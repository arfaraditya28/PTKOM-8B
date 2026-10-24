import { loadEnvConfig } from "@next/env";
import { PrismaClient } from "@prisma/client";
loadEnvConfig(process.cwd());
const db = new PrismaClient();
async function main() {
  // Run with report submissions paused when upgrading an existing database.
  await db.$executeRaw`INSERT INTO "ReportCounter" ("day", "value")
    SELECT substring("reportNumber" from 5 for 8), MAX(substring("reportNumber" from 14)::integer)
    FROM "Report" WHERE "reportNumber" ~ '^LAP-[0-9]{8}-[0-9]+$'
    GROUP BY substring("reportNumber" from 5 for 8)
    ON CONFLICT ("day") DO UPDATE SET "value" = GREATEST("ReportCounter"."value", EXCLUDED."value")`;
  console.log("Counter nomor laporan tersinkronisasi.");
}
main().catch(() => { console.error("Sinkronisasi counter gagal."); process.exitCode = 1; }).finally(() => db.$disconnect());
