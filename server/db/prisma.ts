import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

let _prisma: PrismaClient | null = null;
let _pool: Pool | null = null;

function createPrismaClient(): PrismaClient {
  const connectionString = process.env["DATABASE_URL"];
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }
  _pool = new Pool({ connectionString });
  const adapter = new PrismaPg(_pool);
  return new PrismaClient({ adapter });
}

export function getPrisma(): PrismaClient {
  if (!_prisma) {
    _prisma = createPrismaClient();
  }
  return _prisma;
}

export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop: string | symbol) {
    const value = (getPrisma() as any)[prop];
    if (typeof value === "function") {
      return value.bind(getPrisma());
    }
    return value;
  },
});

process.on("beforeExit", async () => {
  if (_pool) {
    await _pool.end();
    _pool = null;
    _prisma = null;
  }
});