import type { JWTPayload } from 'jose';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  createdAt?: string;
}

export interface AuthResponse {
  user: AuthUser;
}

export interface AuthTokenPayload extends JWTPayload {
  sub: string;
  email: string;
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