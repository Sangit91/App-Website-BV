import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const SOFT_DELETE_MODELS = new Set(["Patient", "AdminUser"]);

function isSoftDeleteModel(modelName: string): boolean {
  return SOFT_DELETE_MODELS.has(modelName);
}

// Operations cần filter deletedAt — tránh truy cập/update/delete record đã soft-delete.
const FILTERED_OPERATIONS = new Set([
  "findMany",
  "findFirst",
  "findUnique",
  "count",
  "update",
  "updateMany",
  "delete",
  "deleteMany",
]);

function addDeletedAtFilter(args: unknown): void {
  if (args && typeof args === "object" && "where" in args) {
    const where = (args as Record<string, unknown>).where as Record<string, unknown> | undefined;
    if (where) {
      if (where.deletedAt === undefined) {
        where.deletedAt = null;
      }
    } else {
      (args as Record<string, unknown>).where = { deletedAt: null };
    }
  }
}

let _prisma: PrismaClient | null = null;
let _pool: Pool | null = null;

function createPrismaClient(): PrismaClient {
  const connectionString = process.env["DATABASE_URL"];
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }
  _pool = new Pool({ connectionString });
  const adapter = new PrismaPg(_pool);
  return new PrismaClient({ adapter }).$extends({
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          if (isSoftDeleteModel(model) && FILTERED_OPERATIONS.has(operation)) {
            addDeletedAtFilter(args);
          }
          return query(args);
        },
      },
    },
  }) as unknown as PrismaClient;
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