import type { PrismaClient } from '@prisma/client';
import { hashPassword } from './auth';
import { passwordSchema } from './validators';

type SeedEnvironment = { SEED_ADMIN_PASSWORD?: string; SEED_PETUGAS_PASSWORD?: string };
const initialUsers = [
  { name: 'Administrator', username: 'admin', role: 'ADMIN', key: 'SEED_ADMIN_PASSWORD' },
  { name: 'Petugas Sekampung', username: 'petugas01', role: 'PETUGAS', key: 'SEED_PETUGAS_PASSWORD' },
] as const;

export async function seedDatabase(db: PrismaClient, env: SeedEnvironment) {
  const existing = new Set((await db.user.findMany({
    where: { username: { in: initialUsers.map(user => user.username) } }, select: { username: true },
  })).map(user => user.username));
  const missing = initialUsers.filter(user => !existing.has(user.username));
  // Validate all missing accounts before creating any data.
  for (const user of missing) {
    if (!passwordSchema.safeParse(env[user.key]).success) {
      throw new Error(`Isi ${user.key}: minimal 10 karakter, maksimal 72 byte, bukan hanya spasi. Atau jalankan npm.cmd run env:setup.`);
    }
  }
  const users = await Promise.all(missing.map(async user => ({
    name: user.name, username: user.username, role: user.role, password: await hashPassword(env[user.key]!),
  })));
  await db.$transaction(async tx => {
    for (const user of users) await tx.user.upsert({ where: { username: user.username }, update: {}, create: user });
    for (const category of [
      { name: 'Infrastruktur', description: 'Jalan, jembatan, drainase, penerangan jalan.' },
      { name: 'Kebersihan', description: 'Sampah, lingkungan, sanitasi.' },
      { name: 'Administrasi', description: 'KTP, KK, surat keterangan, perizinan.' },
      { name: 'Keamanan', description: 'Keamanan lingkungan, ketertiban umum.' },
      { name: 'Kesehatan', description: 'Puskesmas, posyandu, layanan kesehatan.' },
      { name: 'Pendidikan', description: 'Sekolah, PAUD, sarana pendidikan.' },
    ]) await tx.category.upsert({ where: { name: category.name }, update: {}, create: category });
  });
}
