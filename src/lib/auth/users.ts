import { ObjectId } from 'mongodb';
import { getDatabase } from '@/lib/mongodb';
import { USERS_COLLECTION_NAME } from './constants';
import type { AuthUser, UserRole } from './types';

export interface UserDocument {
  _id: ObjectId;
  email: string;
  passwordHash: string;
  name?: string;
  role?: UserRole;
  refreshTokenHash?: string;
  refreshTokenExpiresAt?: Date;
  rememberMe?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const getUsersCollection = async () => {
  const database = await getDatabase();
  const collection = database.collection<UserDocument>(USERS_COLLECTION_NAME);

  await collection.createIndex({ email: 1 }, { unique: true });

  return collection;
};

export const toAuthUser = (user: UserDocument): AuthUser => ({
  id: user._id.toHexString(),
  email: user.email,
  name: user.name,
  role: user.role ?? 'user',
  createdAt: user.createdAt.toISOString(),
});

export const findUserByEmail = async (email: string) => {
  const usersCollection = await getUsersCollection();
  return usersCollection.findOne({ email: email.toLowerCase().trim() });
};

export const findUserById = async (id: string) => {
  if (!ObjectId.isValid(id)) {
    return null;
  }

  const usersCollection = await getUsersCollection();
  return usersCollection.findOne({ _id: new ObjectId(id) });
};

export const createUser = async (input: { email: string; passwordHash: string; name?: string }) => {
  const usersCollection = await getUsersCollection();
  const normalizedEmail = input.email.toLowerCase().trim();
  const now = new Date();

  const document: UserDocument = {
    _id: new ObjectId(),
    email: normalizedEmail,
    passwordHash: input.passwordHash,
    name: input.name,
    createdAt: now,
    updatedAt: now,
  };

  const result = await usersCollection.insertOne(document);
  return usersCollection.findOne({ _id: result.insertedId });
};

export const storeRefreshToken = async (
  userId: string,
  values: { refreshTokenHash: string; refreshTokenExpiresAt: Date; rememberMe?: boolean },
) => {
  const usersCollection = await getUsersCollection();

  await usersCollection.updateOne(
    { _id: new ObjectId(userId) },
    {
      $set: {
        refreshTokenHash: values.refreshTokenHash,
        refreshTokenExpiresAt: values.refreshTokenExpiresAt,
        rememberMe: values.rememberMe ?? false,
        updatedAt: new Date(),
      },
    },
  );
};

export const clearRefreshToken = async (userId: string) => {
  if (!ObjectId.isValid(userId)) {
    return;
  }

  const usersCollection = await getUsersCollection();

  await usersCollection.updateOne(
    { _id: new ObjectId(userId) },
    {
      $unset: {
        refreshTokenHash: '',
        refreshTokenExpiresAt: '',
        rememberMe: '',
      },
      $set: {
        updatedAt: new Date(),
      },
    },
  );
};