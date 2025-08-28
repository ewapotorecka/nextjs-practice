import { NextResponse } from 'next/server';
import { readAccessToken } from '@/lib/auth/cookies';

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;

type NodeRequestInit = RequestInit & { duplex?: 'half' };

async function forward(req: Request, path: string) {
  const access = await readAccessToken();
  const url = `${BASE}/${path}`;

  const method = req.method.toUpperCase();
  const headers = new Headers(req.headers);

  headers.delete('host');
  headers.set('accept', headers.get('accept') || 'application/json');

  const hasBody = !['GET', 'HEAD'].includes(method);
  let body: BodyInit | undefined;

  if (hasBody) {
    const ct = headers.get('content-type') || '';

    if (ct.includes('multipart/form-data')) {
      const form = await req.formData();
      body = form;
      headers.delete('content-type');
    } else if (ct.includes('application/x-www-form-urlencoded')) {
      body = await req.text();
      headers.set('content-type', 'application/x-www-form-urlencoded');
    } else if (ct.includes('application/json')) {
      body = await req.text(); // keep as text to avoid parse/stringify
      headers.set('content-type', 'application/json');
    } else {
      body = Buffer.from(await req.arrayBuffer());
    }
  }

  if (access) {
    console.log('Proxy attaching token:', access?.toString());
    headers.set('authorization', `Bearer ${access}`);
  } else {
    console.log('Proxy: no access token found');
  }

  const init: NodeRequestInit = {
    method,
    headers,
    body,
    cache: 'no-store',
    ...(hasBody ? { duplex: 'half' } : {}),
  };

  return fetch(url, init);
}

async function handle(req: Request, path: string) {
  let res = await forward(req, path);

  if (res.status === 401) {
    const refresh = await fetch(new URL('/api/auth/refresh', req.url), {
      method: 'POST',
    });
    if (refresh.ok) {
      res = await forward(req, path);
    } else {
      console.error(
        'Token refresh failed:',
        await refresh.text().catch(() => '')
      );
    }
  }

  const text = await res.text();
  const out = new NextResponse(text, { status: res.status });
  out.headers.set(
    'content-type',
    res.headers.get('content-type') || 'application/json; charset=utf-8'
  );
  return out;
}

export async function GET(
  req: Request,
  ctx: { params: Promise<{ path: string[] }> }
) {
  const { path } = await ctx.params;
  return handle(req, path.join('/'));
}
export async function POST(
  req: Request,
  ctx: { params: Promise<{ path: string[] }> }
) {
  const { path } = await ctx.params;
  return handle(req, path.join('/'));
}
export async function PUT(
  req: Request,
  ctx: { params: Promise<{ path: string[] }> }
) {
  const { path } = await ctx.params;
  return handle(req, path.join('/'));
}
export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ path: string[] }> }
) {
  const { path } = await ctx.params;
  return handle(req, path.join('/'));
}
export async function DELETE(
  req: Request,
  ctx: { params: Promise<{ path: string[] }> }
) {
  const { path } = await ctx.params;
  return handle(req, path.join('/'));
}
