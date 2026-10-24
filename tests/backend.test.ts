import test from 'node:test';
import assert from 'node:assert/strict';
import { Prisma } from '@prisma/client';
import { createReportSchema, dateOnly, reportQuerySchema, createUserSchema, updateStatusSchema, visibilitySchema, patchServiceSchema } from '../src/lib/validators';
import { buildReportNumber, buildTrackingCode, reportDay } from '../src/lib/reportMeta';
import { canTransition } from '../src/lib/workflow';
import { detectFile } from '../src/lib/attachments';
import { api, ApiError, body } from '../src/lib/http';
import { canUpload, signUploadToken } from '../src/lib/auth';
const report = { categoryId: 'cat', title: 'Jalan rusak', description: 'Jalan rusak perlu diperbaiki.', location: 'Sekampung', incidentDate: '2026-09-22', reporterName: 'Warga', reporterContact: '08123456789' };
test('tanggal kalender: leap year dan tanggal tidak nyata', () => {
  assert.equal(dateOnly.safeParse('2024-02-29').success, true);
  assert.equal(dateOnly.parse(' 2024-02-29 '), '2024-02-29');
  for (const v of ['2026-02-29', '2026-02-30', '2026-13-01', '22/09/2026', '2026-09-22T12:00:00Z']) assert.equal(dateOnly.safeParse(v).success, false);
});
test('laporan menolak kosong, spasi, field tambahan dan teks berlebihan', () => {
  assert.equal(createReportSchema.safeParse(report).success, true);
  for (const extra of [{ title: '     ' }, { reporterName: '' }, { description: 'a'.repeat(10001) }, { status: 'SELESAI' }]) assert.equal(createReportSchema.safeParse({ ...report, ...extra }).success, false);
});
test('filter menolak status asing, limit pecahan, pagination negatif', () => {
  for (const v of [{ status: 'BOGUS' }, { limit: '1.5' }, { page: '-1' }, { limit: '101' }]) assert.equal(reportQuerySchema.safeParse(v).success, false);
  assert.equal(reportQuerySchema.parse({}).limit, 20);
});
test('nomor laporan memakai hari WIB saat pergantian hari UTC', () => {
  const now = new Date('2026-09-23T18:00:00Z');
  assert.equal(reportDay(now), '20260924');
  assert.equal(buildReportNumber(now, 12), 'LAP-20260924-0012');
  assert.match(buildTrackingCode(), /^TRK-[0-9A-F]{32}$/);
});
test('status mengikuti alur; status akhir tidak dibuka kembali', () => {
  assert.equal(canTransition('DIAJUKAN', 'DIVERIFIKASI'), true);
  assert.equal(canTransition('DIAJUKAN', 'SELESAI'), false);
  assert.equal(canTransition('SELESAI', 'DIPROSES'), false);
  assert.equal(canTransition('DITOLAK', 'DIAJUKAN'), false);
  assert.equal(updateStatusSchema.safeParse({ status: 'DITOLAK' }).success, false);
  assert.equal(updateStatusSchema.safeParse({ status: 'DITOLAK', note: 'Data tidak valid' }).success, true);
});
test('akun baru wajib password kuat dan role yang dikenal', () => {
  const user = { name: 'Petugas', username: 'petugas-test', password: 'PasswordTest123' };
  assert.equal(createUserSchema.safeParse(user).success, true);
  assert.equal(createUserSchema.safeParse({ ...user, password: '123' }).success, false);
  assert.equal(createUserSchema.safeParse({ ...user, role: 'ROOT' }).success, false);
  assert.equal(createUserSchema.safeParse({ ...user, password: '😀'.repeat(30) }).success, false);
});
test('publikasi wajib judul dan ringkasan terpisah', () => {
  assert.equal(visibilitySchema.safeParse({ isPublic: true }).success, false);
  assert.equal(visibilitySchema.safeParse({ isPublic: false }).success, true);
  assert.equal(visibilitySchema.safeParse({ isPublic: true, publicTitle: 'Jalan rusak', publicSummary: 'Perbaikan jalan sedang diproses.' }).success, true);
});
test('upload memeriksa signature file, bukan nama ekstensi', () => {
  assert.equal(detectFile(Buffer.from('%PDF-1.7\n')).mime, 'application/pdf');
  assert.equal(detectFile(new Uint8Array([137,80,78,71,13,10,26,10])).mime, 'image/png');
  assert.throws(() => detectFile(Buffer.from('<script>alert(1)</script>')), ApiError);
});
test('upload token hanya berlaku pada satu laporan dan audience upload', () => {
  process.env.JWT_SECRET = 'test-only-secret-at-least-32-characters';
  const token = signUploadToken('report-a');
  const req = new Request('http://localhost', { headers: { authorization: `Bearer ${token}` } });
  assert.equal(canUpload(req, 'report-a'), true);
  assert.equal(canUpload(req, 'report-b'), false);
});
test('body tidak valid: JSON rusak, tipe salah, payload terlalu besar', async () => {
  const json = (s: string) => new Request('http://localhost', { method: 'POST', headers: { 'content-type': 'application/json' }, body: s });
  await assert.rejects(body(json('{'), createReportSchema), (e: unknown) => e instanceof ApiError && e.status === 400);
  await assert.rejects(body(json('x'.repeat(65537)), createReportSchema), (e: unknown) => e instanceof ApiError && e.status === 413);
  await assert.rejects(body(new Request('http://localhost', { method: 'POST', body: '{}' }), createReportSchema), (e: unknown) => e instanceof ApiError && e.status === 415);
});
test('API mengubah error bisnis menjadi response tanpa stack trace', async () => {
  const handler = api(async () => { throw new ApiError(409, 'Status konflik.'); });
  const response = await handler(); assert.equal(response.status, 409);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
  assert.deepEqual(await response.json(), { error: 'Status konflik.' });
});

test('patch layanan tidak mengaktifkan ulang layanan secara tidak sengaja', () => {
  assert.deepEqual(patchServiceSchema.parse({ contact: 'Loket' }), { contact: 'Loket' });
  assert.equal(patchServiceSchema.safeParse({}).success, false);
});

test('API mengenali konflik Prisma dari constructor lokal maupun salinan bundle', async () => {
  for (const [code, status] of [['P2002', 409], ['P2003', 409], ['P2014', 409], ['P2025', 404], ['P2034', 409]] as const) {
    const local = new Prisma.PrismaClientKnownRequestError('private database message', { code, clientVersion: '6.19.3' });
    class OtherPrismaError extends Error {
      name = 'PrismaClientKnownRequestError';
      code = code;
      clientVersion = '6.19.3';
    }
    const bundled = new OtherPrismaError('private database message');
    assert.equal(bundled instanceof Prisma.PrismaClientKnownRequestError, false);
    for (const error of [local, bundled]) {
      const response = await api(async () => { throw error; })();
      assert.equal(response.status, status, code);
      assert.ok(!JSON.stringify(await response.json()).includes('private database message'));
    }
  }
});

test('API tidak mengubah error tak dikenal menjadi konflik atau membocorkan pesan database', async t => {
  const logs: unknown[][] = [];
  t.mock.method(console, 'error', (...args: unknown[]) => { logs.push(args); });
  for (const error of [new Error('private database message'), { code: 'P2003' },
    { name: 'PrismaClientKnownRequestError', code: 'private database message', clientVersion: '6.19.3' },
    new Prisma.PrismaClientKnownRequestError('private database message', { code: 'P2024', clientVersion: '6.19.3' })]) {
    const response = await api(async () => { throw error; })();
    assert.equal(response.status, 500);
    assert.deepEqual(await response.json(), { error: 'Gangguan server. Silakan coba lagi.' });
  }
  assert.ok(JSON.stringify(logs).includes('P2024'));
  assert.ok(!JSON.stringify(logs).includes('private database message'));
});
