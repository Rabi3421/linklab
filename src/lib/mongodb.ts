import { MongoClient, ServerApiVersion } from 'mongodb';

declare global {
  var __linklabMongoClientPromise__: Promise<MongoClient> | undefined;
}

const createMongoClient = () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error('MONGODB_URI is not configured. Add it to your environment variables.');
  }

  return new MongoClient(mongoUri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
};

export const getMongoClient = async () => {
  if (!global.__linklabMongoClientPromise__) {
    global.__linklabMongoClientPromise__ = createMongoClient().connect();
  }

  return global.__linklabMongoClientPromise__;
};

export const getDatabase = async () => {
  const client = await getMongoClient();
  return client.db();
};