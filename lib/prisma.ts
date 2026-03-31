import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const g = globalThis as unknown as { prisma?: PrismaClient };

function createPrisma() {
  const adapter = new PrismaLibSql({ url: "file:./prisma/dev.db" });
  return new PrismaClient({ adapter, log: ["error"] });
}

export const prisma = g.prisma || createPrisma();
if (process.env.NODE_ENV !== "production") g.prisma = prisma;
