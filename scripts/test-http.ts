import { loadEnvConfig } from '@next/env';
import { spawn, type ChildProcess } from 'node:child_process';
import { createServer } from 'node:net';
import { access } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { configurationProblems } from '../src/lib/readiness';
loadEnvConfig(process.cwd());

function launch(args: string[], env: NodeJS.ProcessEnv) {
  const child = spawn(process.execPath, args, { env, stdio: 'inherit', windowsHide: true });
  const closed = new Promise<number>((resolve, reject) => {
    child.once('error', reject);
    child.once('close', code => resolve(code ?? 1));
  });
  return { child, closed };
}

async function unusedPort() {
  const server = createServer();
  await new Promise<void>((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Port lokal tidak tersedia.');
  await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  return address.port;
}

async function stop(child: ChildProcess, closed: Promise<number>) {
  if (child.exitCode !== null || child.signalCode !== null) return;
  child.kill('SIGTERM');
  await Promise.race([closed, delay(5000)]);
  if (child.exitCode === null && child.signalCode === null) { child.kill('SIGKILL'); await closed; }
}

async function main() {
  if (process.env.ALLOW_INTEGRATION_TEST !== '1') throw new Error('Pilih database uji dan set ALLOW_INTEGRATION_TEST=1 terlebih dahulu.');
  if (configurationProblems({ DATABASE_URL: process.env.DATABASE_URL, JWT_SECRET: process.env.JWT_SECRET }).length) throw new Error('Isi DATABASE_URL dan JWT_SECRET yang valid sebelum tes HTTP.');
  try { await access('.next/BUILD_ID'); }
  catch { throw new Error('Jalankan npm.cmd run build sebelum npm.cmd run test:http.'); }
  const port = await unusedPort();
  const env: NodeJS.ProcessEnv = { ...process.env, NODE_ENV: 'production', NEXT_TELEMETRY_DISABLED: '1', TEST_BASE_URL: `http://127.0.0.1:${port}` };
  const require = createRequire(path.join(process.cwd(), 'package.json'));
  const server = launch([require.resolve('next/dist/bin/next'), 'start', '--hostname', '127.0.0.1', '--port', String(port)], env);
  const shutdown = () => { server.child.kill('SIGTERM'); };
  process.once('SIGINT', shutdown);
  process.once('SIGTERM', shutdown);
  try {
    let ready = false;
    const deadline = Date.now() + 60000;
    while (Date.now() < deadline) {
      if (server.child.exitCode !== null) throw new Error('Server tes berhenti sebelum siap.');
      try {
        const response = await fetch(`${env.TEST_BASE_URL}/api/health`, { signal: AbortSignal.timeout(3000) });
        if (response.ok && (await response.json()).status === 'ok') { ready = true; break; }
      } catch { /* Wait for our own server only. */ }
      await delay(300);
    }
    if (!ready) throw new Error('Server tes belum siap. Periksa database uji melalui backend:check.');
    const test = launch(['--import', 'tsx', 'scripts/integration.ts'], env);
    const code = await test.closed;
    if (code !== 0) throw new Error('Pengujian HTTP gagal; lihat hasil di atas.');
  } finally {
    process.off('SIGINT', shutdown);
    process.off('SIGTERM', shutdown);
    await stop(server.child, server.closed);
  }
}
main().catch(error => { console.error(error instanceof Error ? error.message : 'Tes HTTP gagal.'); process.exitCode = 1; });
