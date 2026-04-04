import { clearRefreshToken, createUser, findUserByEmail, findUserById, toAuthUser } from './users';
import { createAccessToken, createRefreshToken, getRefreshTokenTtlSeconds, verifyAccessToken, verifyRefreshToken } from './tokens';
import { hashValue, verifyValue } from './passwords';
import { readAuthCookies } from './cookies';
import type { AuthUser, LoginPayload, RegisterPayload } from './types';
import { storeRefreshToken } from './users';

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validatePassword = (password: string) => {
  if (password.length < 8) {
    return 'Password must be at least 8 characters long.';
  }

  if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password)) {
    return 'Password must include uppercase, lowercase, and at least one number.';
  }

  return null;
};

const issueSession = async (user: AuthUser, rememberMe?: boolean) => {
  const accessToken = await createAccessToken(user);
  const refreshToken = await createRefreshToken(user, rememberMe);
  const refreshTokenHash = await hashValue(refreshToken);
  const refreshTokenTtlSeconds = getRefreshTokenTtlSeconds(rememberMe);

  await storeRefreshToken(user.id, {
    refreshTokenHash,
    refreshTokenExpiresAt: new Date(Date.now() + refreshTokenTtlSeconds * 1000),
    rememberMe,
  });

  return {
    user,
    accessToken,
    refreshToken,
    refreshTokenTtlSeconds,
  };
};

export const registerUser = async (payload: RegisterPayload) => {
  const email = normalizeEmail(payload.email);
  const password = payload.password;

  if (!validateEmail(email)) {
    throw new Error('Please enter a valid email address.');
  }

  const passwordValidationMessage = validatePassword(password);

  if (passwordValidationMessage) {
    throw new Error(passwordValidationMessage);
  }

  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new Error('This email is already registered. Please login instead.');
  }

  const passwordHash = await hashValue(password);
  const createdUser = await createUser({ email, passwordHash });

  if (!createdUser) {
    throw new Error('Unable to create your account right now. Please try again.');
  }

  return issueSession(toAuthUser(createdUser));
};

export const loginUser = async (payload: LoginPayload) => {
  const email = normalizeEmail(payload.email);
  const password = payload.password;
  const user = await findUserByEmail(email);

  if (!user) {
    throw new Error('Invalid email or password.');
  }

  const isPasswordValid = await verifyValue(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new Error('Invalid email or password.');
  }

  return issueSession(toAuthUser(user), payload.rememberMe);
};

export const logoutUser = async (userId?: string) => {
  if (userId) {
    await clearRefreshToken(userId);
  }
};

export const getUserFromAccessToken = async (token?: string) => {
  if (!token) {
    return null;
  }

  const payload = await verifyAccessToken(token);

  if (!payload) {
    return null;
  }

  const user = await findUserById(payload.sub);

  if (!user) {
    return null;
  }

  return toAuthUser(user);
};

export const refreshUserSession = async (refreshToken?: string) => {
  if (!refreshToken) {
    return null;
  }

  const payload = await verifyRefreshToken(refreshToken);

  if (!payload) {
    return null;
  }

  const user = await findUserById(payload.sub);

  if (!user?.refreshTokenHash || !user.refreshTokenExpiresAt) {
    return null;
  }

  if (user.refreshTokenExpiresAt.getTime() <= Date.now()) {
    await clearRefreshToken(user._id.toHexString());
    return null;
  }

  const matchesStoredToken = await verifyValue(refreshToken, user.refreshTokenHash);

  if (!matchesStoredToken) {
    return null;
  }

  return issueSession(toAuthUser(user), user.rememberMe);
};

export const getServerAuthenticatedUser = async () => {
  const { accessToken, refreshToken } = readAuthCookies();

  const accessUser = await getUserFromAccessToken(accessToken);

  if (accessUser) {
    return accessUser;
  }

  const refreshedSession = await refreshUserSession(refreshToken);
  return refreshedSession?.user ?? null;
};