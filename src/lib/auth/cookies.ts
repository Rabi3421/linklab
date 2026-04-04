import type { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ACCESS_COOKIE_NAME, ACCESS_TOKEN_TTL_SECONDS, REFRESH_COOKIE_NAME } from './constants';

const isProduction = process.env.NODE_ENV === 'production';

const baseCookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: isProduction,
  path: '/',
};

export const setAuthCookies = (
  response: NextResponse,
  tokens: { accessToken: string; refreshToken: string; refreshTokenTtlSeconds: number },
) => {
  response.cookies.set(ACCESS_COOKIE_NAME, tokens.accessToken, {
    ...baseCookieOptions,
    maxAge: ACCESS_TOKEN_TTL_SECONDS,
  });

  response.cookies.set(REFRESH_COOKIE_NAME, tokens.refreshToken, {
    ...baseCookieOptions,
    maxAge: tokens.refreshTokenTtlSeconds,
  });
};

export const clearAuthCookies = (response: NextResponse) => {
  response.cookies.set(ACCESS_COOKIE_NAME, '', {
    ...baseCookieOptions,
    maxAge: 0,
  });

  response.cookies.set(REFRESH_COOKIE_NAME, '', {
    ...baseCookieOptions,
    maxAge: 0,
  });
};

export const readAuthCookies = () => {
  const cookieStore = cookies();

  return {
    accessToken: cookieStore.get(ACCESS_COOKIE_NAME)?.value,
    refreshToken: cookieStore.get(REFRESH_COOKIE_NAME)?.value,
  };
};