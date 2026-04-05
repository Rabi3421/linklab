import { getServerAuthenticatedUser } from './server';
import { extractApiKeyFromRequest, getAuthUserFromApiKey } from '@/lib/developers/service';
import type { AuthUser } from './types';

export interface RequestAuthenticationResult {
  user: AuthUser | null;
  method: 'session' | 'api-key' | null;
  invalidApiKey: boolean;
}

export const getRequestAuthenticatedUser = async (
  request: Request
): Promise<RequestAuthenticationResult> => {
  const apiKey = extractApiKeyFromRequest(request);

  if (apiKey) {
    const apiKeyUser = await getAuthUserFromApiKey(apiKey);

    if (apiKeyUser) {
      return {
        user: apiKeyUser,
        method: 'api-key',
        invalidApiKey: false,
      };
    }

    return {
      user: null,
      method: null,
      invalidApiKey: true,
    };
  }

  const sessionUser = await getServerAuthenticatedUser();

  if (sessionUser) {
    return {
      user: sessionUser,
      method: 'session',
      invalidApiKey: false,
    };
  }

  return {
    user: null,
    method: null,
    invalidApiKey: false,
  };
};
