import { NextResponse } from 'next/server';
import { readRefreshToken, setAuthCookies } from '@/lib/auth/cookies';
const BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function POST() {
  const refreshToken = await readRefreshToken();
  if (!refreshToken) return NextResponse.json({ ok: false }, { status: 401 });

  const be = await fetch(`${BASE}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  });
  const text = await be.text();
  if (!be.ok) {
    console.error('Refresh backend error:', text);
    return new NextResponse(text || 'Refresh failed', { status: be.status });
  }

  let data: {
    accessToken: string;
    refreshToken?: string;
    accessExpiresIn?: number;
    refreshExpiresIn?: number;
  };
  try {
    data = JSON.parse(text);
  } catch (err) {
    console.error('Invalid JSON from backend refresh:', err, text);
    return new NextResponse('Invalid response from backend', { status: 500 });
  }

  setAuthCookies(
    data.accessToken,
    data.accessExpiresIn ?? 15 * 60,
    data.refreshToken ?? refreshToken,
    data.refreshExpiresIn ?? 30 * 24 * 60 * 60
  );
  return NextResponse.json({ ok: true });
}
