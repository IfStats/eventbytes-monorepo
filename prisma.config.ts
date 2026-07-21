import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "./prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL || "postgresql://postgres.ypucrnoexyaomiubfogc:123Akunnia%26@aws-1-eu-central-2.pooler.supabase.com:6543/postgres?sslmode=require",
  },
});
