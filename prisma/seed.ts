import { loadEnvConfig } from '@next/env';
import { PrismaClient } from '@prisma/client';
import { seedDatabase } from '../src/lib/seed';
loadEnvConfig(process.cwd());
const db = new PrismaClient();

seedDatabase(db, { SEED_ADMIN_PASSWORD: process.env.SEED_ADMIN_PASSWORD, SEED_PETUGAS_PASSWORD: process.env.SEED_PETUGAS_PASSWORD })
  .then(() => { console.log('Seed selesai. Akun: admin dan petugas01. Password mengikuti .env saat pembuatan pertama; akun dan kategori lama dipertahankan.'); })
  .catch(error => {
    console.error(error instanceof Error && error.message.startsWith('Isi SEED_')
      ? error.message : 'Seed gagal. Periksa koneksi dan schema database melalui npm.cmd run backend:check.');
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
