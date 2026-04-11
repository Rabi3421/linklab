import type { JWTPayload } from 'jose';

export type UserRole = 'user' | 'superadmin';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role?: UserRole;
  createdAt?: string;
}

export interface AuthResponse {
  user: AuthUser;
}

export interface AuthTokenPayload extends JWTPayload {
  sub: string;
  email: string;
  role?: UserRole;
  type: 'access' | 'refresh';
}

export interface RegisterPayload {
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}