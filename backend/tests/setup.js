import { jest } from "@jest/globals";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongo;

jest.setTimeout(20000);

beforeAll(async () => {
  const mongoVersion = process.env.MONGOMS_VERSION || "7.0.14";
  try {
    mongo = await MongoMemoryServer.create({
      binary: {
        version: mongoVersion
      }
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(
      `MongoMemoryServer failed to start (version ${mongoVersion}). ` +
        `Set MONGOMS_VERSION to a compatible version for your OS, ` +
        `or install a system MongoDB and point tests at it. Original error: ${message}`
    );
  }
  const uri = mongo.getUri();
  await mongoose.connect(uri);
});

afterEach(async () => {
  if (mongoose.connection.readyState !== 1) {
    return;
  }
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
  if (mongo) {
    await mongo.stop();
  }
});
