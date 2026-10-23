import test from 'node:test';
import assert from 'node:assert/strict';
import { parseEnv } from 'node:util';
import { prepareEnvironment } from '../src/lib/environment';

test('setup env membuat secret acak tanpa mengganti URL atau komentar CRLF', () => {
  const databaseLine = 'DATABASE_URL="postgresql://local:example@127.0.0.1/dev?sslmode=disable"';
  const original = `${databaseLine}\r\n# konfigurasi lokal\r\nJWT_SECRET=""\r\nSEED_ADMIN_PASSWORD=""\r\nSEED_PETUGAS_PASSWORD=""\r\n`;
  const first = prepareEnvironment(original);
  const second = prepareEnvironment(original);
  assert.ok(first.content.startsWith(`${databaseLine}\r\n# konfigurasi lokal\r\n`));
  assert.equal(first.content.replaceAll('\r\n', '').includes('\n'), false);
  const env = parseEnv(first.content);
  assert.match(env.JWT_SECRET ?? '', /^[0-9a-f]{64}$/);
  assert.match(env.SEED_ADMIN_PASSWORD ?? '', /^[0-9a-f]{36}$/);
  assert.match(env.SEED_PETUGAS_PASSWORD ?? '', /^[0-9a-f]{36}$/);
  assert.notEqual(first.content, second.content);
  assert.deepEqual(first.generated, ['JWT_SECRET', 'SEED_ADMIN_PASSWORD', 'SEED_PETUGAS_PASSWORD']);
});

test('setup env kedua mempertahankan konfigurasi dan password yang sudah dipakai', () => {
  const input = 'DATABASE_URL="postgresql://local:example@127.0.0.1/dev"\nJWT_SECRET="already-valid-secret-of-32-characters"\nSEED_ADMIN_PASSWORD="Existing12345"\nSEED_PETUGAS_PASSWORD="Existing67890"\nCUSTOM_OPTION="keep this"\n';
  assert.deepEqual(prepareEnvironment(input), { content: input, generated: [] });
  const created = prepareEnvironment('DATABASE_URL="postgresql://local:example@127.0.0.1/dev"');
  assert.deepEqual(prepareEnvironment(created.content), { content: created.content, generated: [] });
});

test('setup env memperbaiki JWT pendek dan menambahkan field yang belum ada', () => {
  const prepared = prepareEnvironment('export JWT_SECRET = "short" # nilai lama\nSEED_ADMIN_PASSWORD="KeepPassword123"\n');
  const env = parseEnv(prepared.content);
  assert.equal(env.SEED_ADMIN_PASSWORD, 'KeepPassword123');
  assert.match(env.JWT_SECRET ?? '', /^[0-9a-f]{64}$/);
  assert.match(env.SEED_PETUGAS_PASSWORD ?? '', /^[0-9a-f]{36}$/);
  assert.ok(!prepared.content.includes('short'));
});
