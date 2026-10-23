import { loadEnvConfig } from '@next/env';
import assert from 'node:assert/strict';
import { prisma as db } from '../src/lib/prisma';
import { hashPassword } from '../src/lib/auth';
import { prismaErrorCode } from '../src/lib/http';
loadEnvConfig(process.cwd());
const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
const suffix = crypto.randomUUID().replaceAll('-', '');
const categoryIds: string[] = [], userIds: string[] = [], serviceIds: string[] = [];
let checks = 0;

type TestResult = { status: number; data: Record<string, unknown> };
async function request(path: string, method = 'GET', payload?: unknown, token?: string, expected = 200) {
  const response = await fetch(`${base}${path}`, {
    method, headers: { ...(payload ? { 'Content-Type': 'application/json' } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: payload ? JSON.stringify(payload) : undefined, signal: AbortSignal.timeout(30000),
  });
  const data = await response.json();
  assert.equal(response.status, expected, `${method} ${path}: ${JSON.stringify(data)}`); checks++;
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
  return data;
}

async function cleanup() {
  // Delete only records belonging to this run. Cascades remove their test files/history/comments.
  // Counters deliberately keep advancing, so a report number is never reused.
  await db.$transaction([
    db.report.deleteMany({ where: { categoryId: { in: categoryIds } } }),
    db.category.deleteMany({ where: { id: { in: categoryIds } } }),
    db.service.deleteMany({ where: { id: { in: serviceIds } } }),
    db.user.deleteMany({ where: { id: { in: userIds } } }),
  ]);
  assert.equal(await db.category.count({ where: { id: { in: categoryIds } } }), 0);
  assert.equal(await db.user.count({ where: { id: { in: userIds } } }), 0);
  assert.equal(await db.service.count({ where: { id: { in: serviceIds } } }), 0);
}

async function run() {
  assert.deepEqual(await request('/api/health'), { status: 'ok' });
  const password = `Test-${crypto.randomUUID()}`;
  const account = await db.user.create({ data: { name: 'Test Admin', username: `admin-${suffix}`, password: await hashPassword(password), role: 'ADMIN' } });
  userIds.push(account.id);
  const admin = (await request('/api/auth/login', 'POST', { username: account.username, password })).token;
  await request('/api/reports', 'GET', undefined, undefined, 401);
  await request('/api/auth/login', 'POST', { username: account.username, password: 'wrong' }, undefined, 401);
  await request('/api/auth/me', 'GET', undefined, `${admin}X`, 401);
  const self = (await request('/api/auth/me', 'GET', undefined, admin)).data;
  assert.equal(self.id, account.id); checks++;
  if (await db.user.count({ where: { role: 'ADMIN', isActive: true } }) === 1) {
    await request(`/api/admin/users/${self.id}`, 'DELETE', undefined, admin, 409);
    await request(`/api/admin/users/${self.id}`, 'PATCH', { role: 'PETUGAS' }, admin, 409);
  }
  const category = (await request('/api/admin/categories', 'POST', { name: `Kategori ${suffix}` }, admin, 201)).data;
  categoryIds.push(category.id);
  await request('/api/admin/categories', 'POST', { name: category.name }, admin, 409);
  await request(`/api/admin/categories/${category.id}`, 'PATCH', { description: 'Kategori pengujian' }, admin);
  assert.ok((await request('/api/categories')).data.some((item: { id: string }) => item.id === category.id)); checks++;
  await request('/api/admin/categories', 'GET', undefined, admin);
  const petugas = (await request('/api/admin/users', 'POST', { name: 'Test Petugas', username: `petugas-${suffix}`, password, role: 'PETUGAS' }, admin, 201)).data;
  userIds.push(petugas.id);
  await request('/api/admin/users', 'POST', { name: 'Test Petugas', username: petugas.username, password }, admin, 409);
  const users = await request('/api/admin/users', 'GET', undefined, admin);
  assert.ok(!JSON.stringify(users).includes('"password"')); checks++;
  let staff = (await request('/api/auth/login', 'POST', { username: petugas.username, password })).token;
  await request('/api/admin/users', 'GET', undefined, staff, 403);
  await request('/api/admin/statistics', 'GET', undefined, staff, 403);
  const service = (await request('/api/admin/services', 'POST', { name: `Layanan ${suffix}`, description: 'Layanan uji coba', requirements: 'KTP', hours: '08.00-16.00' }, admin, 201)).data;
  serviceIds.push(service.id);
  await request('/api/admin/services', 'POST', { name: service.name, description: 'Layanan uji coba', requirements: 'KTP', hours: '08.00-16.00' }, admin, 409);
  await request('/api/admin/services', 'GET', undefined, admin);
  assert.ok((await request('/api/services')).data.some((item: { id: string }) => item.id === service.id)); checks++;
  await request(`/api/admin/services/${service.id}`, 'PATCH', { isActive: false }, admin);
  await request(`/api/admin/services/${service.id}`, 'PATCH', { contact: 'Loket uji' }, admin);
  assert.ok(!(await request('/api/services')).data.some((item: { id: string }) => item.id === service.id)); checks++;
  const input = { categoryId: category.id, title: 'Jalan uji berlubang', description: 'Pengujian laporan masyarakat.', location: 'Lokasi privat', incidentDate: '2026-09-22', reporterName: 'Nama Rahasia', reporterContact: '08123456789' };
  await request('/api/reports', 'POST', { ...input, incidentDate: '2026-02-30' }, undefined, 400);
  await request('/api/reports', 'POST', { ...input, categoryId: 'missing-test-category' }, undefined, 404);
  const reports = await Promise.all(Array.from({ length: 5 }, () => request('/api/reports', 'POST', input, undefined, 201)));
  assert.equal(new Set(reports.map(report => report.reportNumber)).size, 5); checks++;
  const report = reports[0];
  await request('/api/auth/me', 'GET', undefined, report.uploadToken, 401);
  await request('/api/reports?status=BAD', 'GET', undefined, staff, 400);
  await request('/api/reports?limit=1.5', 'GET', undefined, staff, 400);
  await request('/api/reports?unknown=1', 'GET', undefined, staff, 400);
  const listed = await request(`/api/reports?categoryId=${category.id}&limit=2&page=2`, 'GET', undefined, staff);
  assert.equal(listed.data.length, 2); assert.equal(listed.pagination.total, 5); assert.equal(listed.pagination.pages, 3); checks++;
  const detail = (await request(`/api/reports/${report.id}`, 'GET', undefined, staff)).data;
  assert.equal(detail.reporterName, input.reporterName);
  assert.equal(detail.statusHistories.length, 1);
  assert.equal(detail.statusHistories[0].userId, null); checks++;
  await request('/api/tracking/TRK-NOT-FOUND', 'GET', undefined, undefined, 404);
  await request(`/api/reports/${report.id}/status`, 'PATCH', { status: 'SELESAI' }, staff, 409);
  await request(`/api/reports/${report.id}/status`, 'PATCH', { status: 'DIVERIFIKASI', note: 'catatan-internal' }, staff);
  await request(`/api/reports/${report.id}/status`, 'PATCH', { status: 'DIPROSES' }, staff);
  await request(`/api/reports/${reports[1].id}/status`, 'PATCH', { status: 'DITOLAK' }, staff, 400);
  await request(`/api/reports/${reports[1].id}/status`, 'PATCH', { status: 'DITOLAK', note: 'Data uji ditolak.' }, staff);
  await request(`/api/reports/${reports[1].id}/status`, 'PATCH', { status: 'DIVERIFIKASI' }, staff, 409);
  await request(`/api/reports/${report.id}/comments`, 'POST', { message: 'Sedang ditangani.' }, staff, 201);
  const tracked = await request(`/api/tracking/${report.trackingCode}`);
  assert.equal(tracked.response, 'Sedang ditangani.');
  for (const secret of ['Nama Rahasia', '08123456789', 'catatan-internal', 'Lokasi privat']) assert.ok(!JSON.stringify(tracked).includes(secret)); checks++;

  async function upload(token: string, id = report.id, bytes = '%PDF-1.7\nTesting'): Promise<TestResult> {
    const form = new FormData(); form.set('file', new Blob([bytes], { type: 'application/pdf' }), 'bukti.pdf');
    const response = await fetch(`${base}/api/reports/${id}/attachments`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: form, signal: AbortSignal.timeout(30000) });
    return { status: response.status, data: await response.json() };
  }
  async function checkedUpload(token: string, id = report.id, bytes?: string, expected = 201) {
    const result = await upload(token, id, bytes);
    assert.equal(result.status, expected, JSON.stringify(result.data)); checks++; return result.data;
  }
  await checkedUpload(report.uploadToken, reports[1].id, undefined, 401);
  await checkedUpload(report.uploadToken, report.id, '<script>bad</script>', 415);
  await checkedUpload(report.uploadToken, report.id, '%PDF-' + 'x'.repeat(5 * 1024 * 1024), 413);
  const attachment = (await checkedUpload(report.uploadToken)).data as { id: string };
  const file = await fetch(`${base}/api/attachments/${attachment.id}`, { headers: { Authorization: `Bearer ${staff}` }, signal: AbortSignal.timeout(30000) });
  assert.equal(file.status, 200); assert.equal(await file.text(), '%PDF-1.7\nTesting'); checks++;
  await request(`/api/attachments/${attachment.id}`, 'GET', undefined, undefined, 401);
  await request(`/api/attachments/${attachment.id}`, 'DELETE', undefined, staff, 403);
  const parallelUploads = await Promise.all(Array.from({ length: 4 }, () => upload(report.uploadToken)));
  assert.deepEqual(parallelUploads.map(result => result.status).sort(), [201, 201, 409, 409], JSON.stringify(parallelUploads));
  assert.equal(await db.attachment.count({ where: { reportId: report.id } }), 3); checks++;
  await checkedUpload(reports[1].uploadToken, reports[1].id, undefined, 409);

  await request(`/api/reports/${report.id}/visibility`, 'PATCH', { isPublic: true }, admin, 400);
  await request(`/api/reports/${report.id}/visibility`, 'PATCH', { isPublic: false }, staff, 403);
  const publicPath = `/api/public/reports?categoryId=${category.id}`;
  assert.equal((await request(publicPath)).data.length, 0); checks++;
  await request(`/api/reports/${report.id}/visibility`, 'PATCH', { isPublic: true, publicTitle: 'Jalan perlu diperbaiki', publicSummary: 'Laporan perbaikan jalan sedang ditindaklanjuti.' }, admin);
  const publicList = await request(publicPath);
  assert.equal(publicList.data.length, 1);
  assert.equal(publicList.data[0].reportNumber, report.reportNumber);
  for (const field of ['reporterName', 'reporterContact', 'trackingCode', 'location', 'attachments']) assert.ok(!JSON.stringify(publicList).includes(`"${field}"`)); checks++;
  await request(`/api/reports/${report.id}/visibility`, 'PATCH', { isPublic: false }, admin);
  assert.equal((await request(publicPath)).data.length, 0); checks++;
  await request(`/api/admin/categories/${category.id}`, 'DELETE', undefined, admin, 409);
  assert.ok(await db.category.findUnique({ where: { id: category.id } }));
  assert.equal(await db.report.count({ where: { categoryId: category.id } }), reports.length); checks++;
  const emptyCategory = (await request('/api/admin/categories', 'POST', { name: `Kategori kosong ${suffix}` }, admin, 201)).data;
  categoryIds.push(emptyCategory.id);
  await request(`/api/admin/categories/${emptyCategory.id}`, 'DELETE', undefined, staff, 403);
  await request(`/api/admin/categories/${emptyCategory.id}`, 'DELETE', undefined, admin);
  await request(`/api/admin/categories/${emptyCategory.id}`, 'DELETE', undefined, admin, 404);
  await request(`/api/reports/${report.id}/status`, 'PATCH', { status: 'SELESAI' }, staff);
  await request(`/api/reports/${report.id}/status`, 'PATCH', { status: 'DIPROSES' }, staff, 409);
  await checkedUpload(report.uploadToken, report.id, undefined, 409);
  await request(`/api/admin/users/${petugas.id}`, 'PATCH', { name: 'Petugas Diperbarui' }, admin);
  await request('/api/auth/me', 'GET', undefined, staff, 401);
  staff = (await request('/api/auth/login', 'POST', { username: petugas.username, password })).token;
  await request(`/api/admin/users/${petugas.id}`, 'DELETE', undefined, admin);
  await request('/api/reports', 'GET', undefined, staff, 401);
  await request('/api/auth/login', 'POST', { username: petugas.username, password }, undefined, 401);
  await request(`/api/admin/users/${petugas.id}`, 'PATCH', { isActive: true, password: `${password}-new` }, admin);
  await request('/api/auth/login', 'POST', { username: petugas.username, password }, undefined, 401);
  await request('/api/auth/login', 'POST', { username: petugas.username, password: `${password}-new` });
  const statistics = (await request('/api/admin/statistics', 'GET', undefined, admin)).data;
  assert.ok(statistics.byCategory.some((item: { categoryId: string; count: number }) => item.categoryId === category.id && item.count === 5)); checks++;
  await request(`/api/admin/services/${service.id}`, 'DELETE', undefined, admin);
  await request(`/api/admin/services/${service.id}`, 'DELETE', undefined, admin, 404);
  await request(`/api/attachments/${attachment.id}`, 'DELETE', undefined, admin);
  await request(`/api/attachments/${attachment.id}`, 'GET', undefined, admin, 404);
  await request('/api/auth/logout', 'POST', undefined, admin);
  await request('/api/auth/me', 'GET', undefined, admin, 401);
}

async function main() {
  if (process.env.ALLOW_INTEGRATION_TEST !== '1') throw new Error('Gunakan database uji terpisah dan set ALLOW_INTEGRATION_TEST=1.');
  let failed = false, failure: unknown;
  try { await run(); }
  catch (error) { failed = true; failure = error; }
  finally {
    try { await cleanup(); }
    catch (error) {
      console.error(`Pembersihan data uji ${suffix} gagal. Periksa database uji.`);
      if (!failed) { failed = true; failure = error; }
    }
  }
  if (failed) throw failure;
  console.log(`LULUS: ${checks} pemeriksaan integrasi; data uji ${suffix} sudah dibersihkan (counter tetap maju).`);
}
export const done = main().catch(error => {
  if (error instanceof assert.AssertionError) console.error(error.message);
  else console.error('Integrasi gagal. Periksa server, konfigurasi dan database uji.', prismaErrorCode(error) ?? (error instanceof Error ? error.name : 'UnknownError'));
  process.exitCode = 1;
}).finally(() => db.$disconnect());
