import { PrismaClient } from "@prisma/client";

import { getRequiredServerEnv } from "@/lib/config/server-env";

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};
const databaseUrl = getRequiredServerEnv("DATABASE_URL");

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
    log: process.env.NODE_ENV === "development" ? ["error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
