import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';
import { PrismaPGlite } from 'pglite-prisma-adapter';
import { PrismaClient } from '@prisma/client';
import { seedDatabase } from '../src/lib/seed';
import { verifyPassword } from '../src/lib/auth';

test('seed membuat akun dan kategori; seed ulang menjaga password, role dan perubahan kategori', async () => {
  const pg = new PGlite();
  const db = new PrismaClient({ adapter: new PrismaPGlite(pg) });
  try {
    await pg.exec(await readFile('docs/sql/fresh-database.sql', 'utf8'));
    const env = { SEED_ADMIN_PASSWORD: 'InitialAdmin12345', SEED_PETUGAS_PASSWORD: 'InitialPetugas12345' };
    await seedDatabase(db, env);
    const admin = await db.user.findUniqueOrThrow({ where: { username: 'admin' } });
    assert.equal(admin.role, 'ADMIN');
    assert.equal(await verifyPassword(env.SEED_ADMIN_PASSWORD, admin.password), true);
    assert.equal(await db.user.count(), 2);
    assert.equal(await db.category.count(), 6);
    await db.category.update({ where: { name: 'Infrastruktur' }, data: { description: 'Deskripsi yang sudah diubah tim.' } });
    await db.user.update({ where: { username: 'petugas01' }, data: { isActive: false, name: 'Nama dari admin' } });
    await seedDatabase(db, {});
    assert.equal((await db.user.findUniqueOrThrow({ where: { username: 'admin' } })).password, admin.password);
    const staff = await db.user.findUniqueOrThrow({ where: { username: 'petugas01' } });
    assert.equal(staff.isActive, false);
    assert.equal(staff.name, 'Nama dari admin');
    assert.equal((await db.category.findUniqueOrThrow({ where: { name: 'Infrastruktur' } })).description, 'Deskripsi yang sudah diubah tim.');
    assert.equal(await db.user.count(), 2);
    assert.equal(await db.category.count(), 6);
  } finally { await db.$disconnect(); await pg.close(); }
});

test('seed menolak password akun baru yang invalid sebelum menulis akun atau kategori', async () => {
  const pg = new PGlite();
  const db = new PrismaClient({ adapter: new PrismaPGlite(pg) });
  try {
    await pg.exec(await readFile('docs/sql/fresh-database.sql', 'utf8'));
    for (const value of ['', 'short', ' '.repeat(12), '😀'.repeat(25)]) {
      await assert.rejects(seedDatabase(db, { SEED_ADMIN_PASSWORD: 'ValidAdmin12345', SEED_PETUGAS_PASSWORD: value }), /Isi SEED_PETUGAS_PASSWORD/);
      assert.equal(await db.user.count(), 0);
      assert.equal(await db.category.count(), 0);
    }
    await db.user.create({ data: { username: 'admin', name: 'Admin lama', password: 'existing-hash', role: 'ADMIN' } });
    await seedDatabase(db, { SEED_PETUGAS_PASSWORD: 'NewPetugas12345' });
    assert.equal((await db.user.findUniqueOrThrow({ where: { username: 'admin' } })).password, 'existing-hash');
    assert.equal(await db.user.count(), 2);
  } finally { await db.$disconnect(); await pg.close(); }
});
