import { defineConfig } from "@prisma/config";

export default defineConfig({
  schema: "./apps/api/prisma/schema.prisma",
  datasource: {
    url: "postgres://postgres.twhbjaybtatssmeyjhgb:25123Akunnia@aws-0-eu-north-1.pooler.supabase.com:6543/postgres?workaround=supabase-pooler.prisma",
  },
});