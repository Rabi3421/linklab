import { jwtVerify, SignJWT } from 'jose';
import {
  ACCESS_TOKEN_TTL_SECONDS,
  REFRESH_TOKEN_TTL_SECONDS,
  REMEMBER_ME_REFRESH_TOKEN_TTL_SECONDS,
} from './constants';
import type { AuthTokenPayload, AuthUser } from './types';

const encoder = new TextEncoder();

const getJwtSecret = (envKey: 'JWT_ACCESS_SECRET' | 'JWT_REFRESH_SECRET') => {
  const value = process.env[envKey] || (process.env.NODE_ENV !== 'production' ? `linklab-dev-${envKey.toLowerCase()}` : undefined);

  if (!value) {
    throw new Error(`${envKey} is not configured. Add it to your environment variables.`);
  }

  return encoder.encode(value);
};

const signToken = async (payload: AuthTokenPayload, secret: Uint8Array, expiresIn: string) => {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secret);
};

export const createAccessToken = async (user: AuthUser) => {
  return signToken(
    {
      sub: user.id,
      email: user.email,
      type: 'access',
    },
    getJwtSecret('JWT_ACCESS_SECRET'),
    `${ACCESS_TOKEN_TTL_SECONDS}s`,
  );
};

export const getRefreshTokenTtlSeconds = (rememberMe?: boolean) => {
  return rememberMe ? REMEMBER_ME_REFRESH_TOKEN_TTL_SECONDS : REFRESH_TOKEN_TTL_SECONDS;
};

export const createRefreshToken = async (user: AuthUser, rememberMe?: boolean) => {
  const refreshTokenTtlSeconds = getRefreshTokenTtlSeconds(rememberMe);

  return signToken(
    {
      sub: user.id,
      email: user.email,
      type: 'refresh',
    },
    getJwtSecret('JWT_REFRESH_SECRET'),
    `${refreshTokenTtlSeconds}s`,
  );
};

const verifyToken = async (token: string, secret: Uint8Array, expectedType: AuthTokenPayload['type']) => {
  try {
    const { payload } = await jwtVerify(token, secret);

    if (payload.type !== expectedType || typeof payload.sub !== 'string' || typeof payload.email !== 'string') {
      return null;
    }

    return payload as unknown as AuthTokenPayload;
  } catch {
    return null;
  }
};

export const verifyAccessToken = async (token: string) => verifyToken(token, getJwtSecret('JWT_ACCESS_SECRET'), 'access');

export const verifyRefreshToken = async (token: string) => verifyToken(token, getJwtSecret('JWT_REFRESH_SECRET'), 'refresh');