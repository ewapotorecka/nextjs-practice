import { cookies } from 'next/headers';

const isProd = process.env.NODE_ENV === 'production';

export const ACCESS_COOKIE = 'at';
export const REFRESH_COOKIE = 'rt';

export async function setAuthCookies(
  accessToken: string,
  accessExpSec: number,
  refreshToken: string,
  refreshExpSec: number
) {
  const c = await cookies();
  c.set(ACCESS_COOKIE, accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'strict',
    domain: process.env.COOKIE_DOMAIN || undefined,
    path: '/',
    maxAge: accessExpSec, // e.g. 900s = 15m
  });
  c.set(REFRESH_COOKIE, refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'strict',
    domain: process.env.COOKIE_DOMAIN || undefined,
    path: '/',
    maxAge: refreshExpSec, // e.g. 2592000s = 30d
  });
}

export async function clearAuthCookies() {
  const c = await cookies();
  c.set(ACCESS_COOKIE, '', {
    httpOnly: true,
    secure: isProd,
    sameSite: 'strict',
    domain: process.env.COOKIE_DOMAIN || undefined,
    path: '/',
    maxAge: 0,
  });
  c.set(REFRESH_COOKIE, '', {
    httpOnly: true,
    secure: isProd,
    sameSite: 'strict',
    domain: process.env.COOKIE_DOMAIN || undefined,
    path: '/',
    maxAge: 0,
  });
}

export async function readAccessToken() {
  const c = await cookies();
  return c.get(ACCESS_COOKIE)?.value;
}

export async function readRefreshToken() {
  const c = await cookies();
  return c.get(REFRESH_COOKIE)?.value;
}
