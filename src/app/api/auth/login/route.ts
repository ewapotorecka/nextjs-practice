import { NextResponse } from 'next/server';
import { setAuthCookies } from '@/lib/auth/cookies';

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function POST(req: Request) {
  const body = await req.json();
  const be = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const text = await be.text();
  if (!be.ok) {
    console.error('Login backend error:', text);
    return new NextResponse(text || 'Login failed', { status: be.status });
  }

  let data: {
    accessToken: string;
    refreshToken: string;
    accessExpiresIn?: number;
    refreshExpiresIn?: number;
  };
  try {
    data = JSON.parse(text);
  } catch (err) {
    console.error('Invalid JSON from backend login:', err, text);
    return new NextResponse('Invalid response from backend', { status: 500 });
  }

  await setAuthCookies(
    data.accessToken,
    data.accessExpiresIn ?? 15 * 60,
    data.refreshToken,
    data.refreshExpiresIn ?? 30 * 24 * 60 * 60
  );

  console.log('Login: cookies set with access token', data.accessToken);

  return NextResponse.json({ ok: true });
}
