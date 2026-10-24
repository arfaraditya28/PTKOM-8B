import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';

test('upgrade SQL mempertahankan data lama dan memungkinkan riwayat sistem', async () => {
  const db = new PGlite();
  try {
    await db.exec(await readFile('tests/fixtures/original-schema.sql', 'utf8'));
    await db.exec(`
      INSERT INTO "User" (id, name, username, password, role, "updatedAt")
        VALUES ('u', 'Admin lama', 'admin', 'hash-lama', 'ADMIN', NOW());
      INSERT INTO "Category" (id, name, "updatedAt") VALUES ('c', 'Kategori lama', NOW());
      INSERT INTO "Report" (id, "reportNumber", "trackingCode", "categoryId", title,
        description, location, "incidentDate", "reporterName", "reporterContact", "updatedAt")
        VALUES ('r', 'LAP-20260923-0007', 'TRK-LAMA', 'c', 'Judul lama',
        'Isi lama', 'Lokasi lama', '2026-09-23', 'Nama lama', 'Kontak lama', NOW());
      INSERT INTO "Attachment" (id, "reportId", "fileName", "fileUrl", "fileType")
        VALUES ('a', 'r', 'lama.pdf', '/files/lama.pdf', 'application/pdf');
      INSERT INTO "StatusHistory" (id, "reportId", "userId", status, note)
        VALUES ('h', 'r', 'u', 'DIAJUKAN', 'Catatan lama');
      INSERT INTO "Comment" (id, "reportId", "userId", message)
        VALUES ('m', 'r', 'u', 'Tanggapan lama');
    `);
    await db.exec(`UPDATE "Report" SET agency = 'Instansi lama' WHERE id = 'r';`);
    await db.exec('BEGIN');
    await db.exec(await readFile('docs/sql/upgrade-from-original.sql', 'utf8'));
    await db.exec('COMMIT');
    assert.deepEqual((await db.query('SELECT password, "isActive", "tokenVersion" FROM "User"')).rows,
      [{ password: 'hash-lama', isActive: true, tokenVersion: 0 }]);
    assert.deepEqual((await db.query('SELECT "trackingCode", "reporterName", "isPublic", agency FROM "Report"')).rows,
      [{ trackingCode: 'TRK-LAMA', reporterName: 'Nama lama', isPublic: false, agency: 'Instansi lama' }]);
    assert.deepEqual((await db.query('SELECT "fileUrl", content, size FROM "Attachment"')).rows,
      [{ fileUrl: '/files/lama.pdf', content: null, size: null }]);
    assert.deepEqual((await db.query('SELECT "userId", note FROM "StatusHistory"')).rows,
      [{ userId: 'u', note: 'Catatan lama' }]);
    assert.deepEqual((await db.query('SELECT message FROM "Comment"')).rows, [{ message: 'Tanggapan lama' }]);
    await db.exec(`INSERT INTO "StatusHistory" (id, "reportId", status)
      VALUES ('system', 'r', 'DIAJUKAN');`);
    assert.deepEqual((await db.query('SELECT "userId" FROM "StatusHistory" WHERE id = \'system\'')).rows,
      [{ userId: null }]);
    await db.exec(`INSERT INTO "Service" (id, name, description, requirements, hours, "updatedAt")
      VALUES ('s', 'Layanan baru', 'Deskripsi', 'Persyaratan', 'Jam', NOW());
      INSERT INTO "ReportCounter" (day, value) VALUES ('20260923', 7);`);
    assert.deepEqual((await db.query('SELECT "isActive" FROM "Service"')).rows, [{ isActive: true }]);
    assert.deepEqual((await db.query('SELECT value FROM "ReportCounter"')).rows, [{ value: 7 }]);
  } finally {
    await db.close();
  }
});

test('upgrade backend 16 Oktober menambah instansi secara idempotent tanpa kehilangan data', async () => {
  const db = new PGlite();
  try {
    await db.exec(await readFile('docs/sql/fresh-database.sql', 'utf8'));
    await db.exec('ALTER TABLE "Report" DROP COLUMN agency;');
    const sql = await readFile('docs/sql/upgrade-from-backend-oct16.sql', 'utf8');
    await db.exec(sql);
    await db.exec(`INSERT INTO "Category" (id, name, "updatedAt") VALUES ('c', 'Kategori lama', NOW());
      INSERT INTO "Report" (id, "reportNumber", "trackingCode", "categoryId", title, description,
        location, "incidentDate", "reporterName", "reporterContact", agency, "updatedAt")
        VALUES ('r', 'LAP-20261016-0001', 'TRK-LAMA', 'c', 'Judul lama', 'Isi lama', 'Lokasi', NOW(), 'Nama', 'Kontak', 'Instansi tersimpan', NOW());`);
    await db.exec(sql);
    assert.deepEqual((await db.query('SELECT "trackingCode", agency FROM "Report"')).rows, [{ trackingCode: 'TRK-LAMA', agency: 'Instansi tersimpan' }]);
  } finally { await db.close(); }
});
