import { loadEnvConfig } from '@next/env';
import { PrismaClient } from '@prisma/client';
import { configurationProblems, databaseProblems } from '../src/lib/readiness';

loadEnvConfig(process.cwd());

async function main() {
  const config = configurationProblems({ DATABASE_URL: process.env.DATABASE_URL, JWT_SECRET: process.env.JWT_SECRET });
  if (config.length) {
    for (const message of config) console.error(`- ${message}`);
    process.exitCode = 1;
    return;
  }
  const url = new URL(process.env.DATABASE_URL!);
  const schema = url.searchParams.get('schema') || 'public';
  if (!url.searchParams.has('connect_timeout')) url.searchParams.set('connect_timeout', '10');
  if (!url.searchParams.has('pool_timeout')) url.searchParams.set('pool_timeout', '10');
  const db = new PrismaClient({ datasources: { db: { url: url.toString() } } });
  try {
    const problems = await databaseProblems(db, schema);
    if (problems.length) {
      for (const message of problems) console.error(`- ${message}`);
      console.error('Gunakan salinan database uji dan panduan docs/BACKEND.md untuk upgrade. Pemeriksaan ini tidak mengubah database.');
      process.exitCode = 1;
      return;
    }
    console.log('Konfigurasi, koneksi database, kolom backend dan counter laporan siap.');
  } catch {
    // Do not print Prisma's raw message: connection errors can include credentials.
    console.error('Tidak dapat membaca database. Periksa URL, koneksi internet, SSL dan izin akun database.');
    process.exitCode = 1;
  } finally {
    await db.$disconnect();
  }
}

main().catch(() => { console.error('Pemeriksaan backend gagal.'); process.exitCode = 1; });
