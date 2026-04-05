import { createHmac, randomBytes } from 'crypto';
import { ObjectId } from 'mongodb';
import { getDatabase } from '@/lib/mongodb';
import { findUserById, toAuthUser } from '@/lib/auth/users';
import { getBillingUsageSnapshotForUser } from '@/lib/billing/service';
import type { AuthUser } from '@/lib/auth/types';
import type { DeveloperApiKeyIssueResult, DeveloperApiKeySummary } from './types';

interface DeveloperApiKeyDocument {
  _id: ObjectId;
  ownerId: string;
  ownerEmail?: string;
  keyHash: string;
  keyPreview: string;
  createdAt: Date;
  updatedAt: Date;
  lastUsedAt?: Date;
  revokedAt?: Date;
}

const API_KEYS_COLLECTION = 'developer_api_keys';
const API_KEY_PREFIX = 'll_live_';

const getApiKeysCollection = async () => {
  const database = await getDatabase();
  const collection = database.collection<DeveloperApiKeyDocument>(API_KEYS_COLLECTION);
  await collection.createIndex({ ownerId: 1 }, { unique: true });
  await collection.createIndex({ keyHash: 1 }, { unique: true });
  return collection;
};

const getApiKeyHashSecret = () =>
  process.env.API_KEY_SECRET || process.env.JWT_ACCESS_SECRET || 'linklab-api-key-dev-secret';

const hashApiKey = (plainTextKey: string) =>
  createHmac('sha256', getApiKeyHashSecret()).update(plainTextKey).digest('hex');

const generatePlainTextApiKey = () => `${API_KEY_PREFIX}${randomBytes(24).toString('base64url')}`;

const toKeyPreview = (plainTextKey: string) =>
  `${plainTextKey.slice(0, 14)}••••${plainTextKey.slice(-4)}`;

const buildSummary = async (
  ownerId: string,
  ownerEmail?: string,
  document?: DeveloperApiKeyDocument | null
): Promise<DeveloperApiKeySummary> => ({
  hasKey: !!document,
  keyPreview: document?.keyPreview ?? null,
  createdAt: document?.createdAt.toISOString() ?? null,
  lastUsedAt: document?.lastUsedAt?.toISOString() ?? null,
  usage: await getBillingUsageSnapshotForUser(ownerId, ownerEmail),
});

const extractApiKeyFromAuthorizationHeader = (authorizationHeader?: string | null) => {
  const normalizedHeader = authorizationHeader?.trim();

  if (!normalizedHeader) {
    return null;
  }

  if (/^bearer\s+/i.test(normalizedHeader)) {
    return normalizedHeader.replace(/^bearer\s+/i, '').trim();
  }

  return normalizedHeader.startsWith(API_KEY_PREFIX) ? normalizedHeader : null;
};

export const extractApiKeyFromRequest = (request: Request) => {
  const fromAuthorization = extractApiKeyFromAuthorizationHeader(
    request.headers.get('authorization')
  );

  if (fromAuthorization) {
    return fromAuthorization;
  }

  const fromHeader = request.headers.get('x-api-key')?.trim();
  return fromHeader || null;
};

export const getDeveloperApiKeySummaryForUser = async (ownerId: string, ownerEmail?: string) => {
  const apiKeysCollection = await getApiKeysCollection();
  const document = await apiKeysCollection.findOne({ ownerId });
  return buildSummary(ownerId, ownerEmail, document);
};

export const issueDeveloperApiKeyForUser = async (input: {
  ownerId: string;
  ownerEmail?: string;
}): Promise<DeveloperApiKeyIssueResult> => {
  const apiKeysCollection = await getApiKeysCollection();
  const now = new Date();
  const plainTextKey = generatePlainTextApiKey();
  const keyHash = hashApiKey(plainTextKey);
  const keyPreview = toKeyPreview(plainTextKey);

  await apiKeysCollection.updateOne(
    { ownerId: input.ownerId },
    {
      $set: {
        ownerEmail: input.ownerEmail,
        keyHash,
        keyPreview,
        updatedAt: now,
      },
      $setOnInsert: {
        _id: new ObjectId(),
        ownerId: input.ownerId,
        createdAt: now,
      },
      $unset: {
        revokedAt: '',
      },
    },
    { upsert: true }
  );

  const document = await apiKeysCollection.findOne({ ownerId: input.ownerId });

  return {
    plainTextKey,
    summary: await buildSummary(input.ownerId, input.ownerEmail, document),
  };
};

export const revokeDeveloperApiKeyForUser = async (ownerId: string, ownerEmail?: string) => {
  const apiKeysCollection = await getApiKeysCollection();

  await apiKeysCollection.deleteOne({ ownerId });

  return buildSummary(ownerId, ownerEmail, null);
};

export const getAuthUserFromApiKey = async (
  plainTextApiKey?: string | null
): Promise<AuthUser | null> => {
  if (!plainTextApiKey || !plainTextApiKey.startsWith(API_KEY_PREFIX)) {
    return null;
  }

  const apiKeysCollection = await getApiKeysCollection();
  const document = await apiKeysCollection.findOne({ keyHash: hashApiKey(plainTextApiKey) });

  if (!document) {
    return null;
  }

  await apiKeysCollection.updateOne(
    { _id: document._id },
    {
      $set: {
        lastUsedAt: new Date(),
        updatedAt: new Date(),
      },
    }
  );

  const user = await findUserById(document.ownerId);

  if (!user) {
    return null;
  }

  return toAuthUser(user);
};
