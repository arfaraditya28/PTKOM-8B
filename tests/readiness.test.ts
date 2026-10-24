import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';
import { PrismaPGlite } from 'pglite-prisma-adapter';
import { PrismaClient } from '@prisma/client';
import { configurationProblems, databaseProblems } from '../src/lib/readiness';

test('pemeriksaan konfigurasi mendeteksi env kosong/tidak valid tanpa mencetak rahasia', () => {
  assert.equal(configurationProblems({}).length, 2);
  const secret = 'a-very-private-configuration-secret';
  for (const url of ['not-a-url', 'https://user:private-password@example.test/database',
    'postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require']) {
    const problems = configurationProblems({ DATABASE_URL: url, JWT_SECRET: secret });
    assert.equal(problems.length, 1);
    assert.ok(!problems.join(' ').includes('private-password'));
    assert.ok(!problems.join(' ').includes(secret));
  }
  assert.deepEqual(configurationProblems({ DATABASE_URL: 'postgresql://test:test@localhost:5432/test', JWT_SECRET: secret }), []);
});

test('pemeriksaan menolak schema lama dan membaca schema baru tanpa mengubahnya', async () => {
  const pg = new PGlite();
  const db = new PrismaClient({ adapter: new PrismaPGlite(pg) });
  try {
    await pg.exec(await readFile('tests/fixtures/original-schema.sql', 'utf8'));
    const before = (await pg.query('SELECT table_name, column_name, is_nullable FROM information_schema.columns WHERE table_schema = \'public\' ORDER BY table_name, column_name')).rows;
    const problems = await databaseProblems(db);
    assert.ok(problems.some(message => message.includes('User') && message.includes('tokenVersion')));
    assert.ok(problems.some(message => message.includes('ReportCounter')));
    assert.ok(problems.some(message => message.includes('StatusHistory.userId')));
    const after = (await pg.query('SELECT table_name, column_name, is_nullable FROM information_schema.columns WHERE table_schema = \'public\' ORDER BY table_name, column_name')).rows;
    assert.deepEqual(after, before);
    await pg.exec(await readFile('docs/sql/upgrade-from-original.sql', 'utf8'));
    assert.deepEqual(await databaseProblems(db), []);
    assert.ok((await databaseProblems(db, 'schema_lain')).length > 0);
  } finally {
    await db.$disconnect();
    await pg.close();
  }
});

test('pemeriksaan counter mendeteksi nomor lama dan tidak mengubah nilainya', async () => {
  const pg = new PGlite();
  const db = new PrismaClient({ adapter: new PrismaPGlite(pg) });
  try {
    await pg.exec(await readFile('docs/sql/fresh-database.sql', 'utf8'));
    await pg.exec(`INSERT INTO "Category" (id, name, "updatedAt") VALUES ('c', 'Kategori uji', NOW());
      INSERT INTO "Report" (id, "reportNumber", "trackingCode", "categoryId", title, description,
        location, "incidentDate", "reporterName", "reporterContact", "updatedAt")
        VALUES ('r', 'LAP-20261006-0007', 'TRK-TEST', 'c', 'Judul', 'Isi', 'Lokasi', NOW(), 'Nama', 'Kontak', NOW());`);
    assert.ok((await databaseProblems(db)).some(message => message.includes('Counter')));
    assert.deepEqual((await pg.query('SELECT * FROM "ReportCounter"')).rows, []);
    await pg.exec(`INSERT INTO "ReportCounter" (day, value) VALUES ('20261006', 6);`);
    assert.ok((await databaseProblems(db)).some(message => message.includes('Counter')));
    assert.deepEqual((await pg.query('SELECT value FROM "ReportCounter"')).rows, [{ value: 6 }]);
    await pg.exec(`UPDATE "ReportCounter" SET value = 7;`);
    assert.deepEqual(await databaseProblems(db), []);
    await pg.exec('CREATE SCHEMA tenant; SET search_path = tenant;');
    await pg.exec(await readFile('docs/sql/fresh-database.sql', 'utf8'));
    await pg.exec(`SET search_path = public;
      INSERT INTO tenant."Category" SELECT * FROM public."Category";
      INSERT INTO tenant."Report" (id, "reportNumber", "trackingCode", "categoryId", title,
        description, location, "incidentDate", "reporterName", "reporterContact", "updatedAt")
        VALUES ('r', 'LAP-20261006-0007', 'TRK-TEST', 'c', 'Judul', 'Isi', 'Lokasi', NOW(), 'Nama', 'Kontak', NOW());`);
    assert.ok((await databaseProblems(db, 'tenant')).some(message => message.includes('Counter')));
    assert.deepEqual((await pg.query('SELECT * FROM tenant."ReportCounter"')).rows, []);
    assert.deepEqual(await databaseProblems(db), []);
    const quoted = 'tenant"quoted';
    await pg.exec('CREATE SCHEMA "tenant""quoted"; SET search_path = "tenant""quoted";');
    await pg.exec(await readFile('docs/sql/fresh-database.sql', 'utf8'));
    await pg.exec('SET search_path = public;');
    assert.deepEqual(await databaseProblems(db, quoted), []);
  } finally {
    await db.$disconnect();
    await pg.close();
  }
});
