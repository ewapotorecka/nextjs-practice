import { NextResponse } from 'next/server';
import { clearAuthCookies, readRefreshToken } from '@/lib/auth/cookies';
const BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function POST() {
  try {
    const refresh = readRefreshToken();
    if (refresh) {
      await fetch(`${BASE}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ refreshToken: refresh }),
      }).catch(() => {});
    }
  } finally {
    clearAuthCookies();
  }
  return NextResponse.json({ ok: true });
}
