// Database PostgreSQL sementara di memori; tidak membaca atau mengubah Neon.
import { PGlite } from '@electric-sql/pglite';
import { PrismaPGlite } from 'pglite-prisma-adapter';
import { PrismaClient } from '@prisma/client';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
async function main() {
  process.env.JWT_SECRET = 'embedded-test-secret-at-least-32-characters';
  process.env.ALLOW_INTEGRATION_TEST = '1';
  process.env.TEST_BASE_URL = 'http://localhost:3000';
  process.env.DATABASE_URL = 'postgresql://embedded:embedded@127.0.0.1/embedded';
  const pg = new PGlite();
  await pg.exec(await readFile('docs/sql/fresh-database.sql', 'utf8'));
  const db = new PrismaClient({ adapter: new PrismaPGlite(pg) });
  (globalThis as unknown as { prisma: PrismaClient }).prisma = db;
  type Handler = (req: Request, context: { params: Promise<Record<string, string>> }) => Promise<Response>;
  const routes: { parts: string[]; methods: Record<string, Handler> }[] = [];
  async function scan(dir: string) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) await scan(full);
      else if (entry.name === 'route.ts') routes.push({ parts: path.relative('app', dir).split(path.sep), methods: await import(pathToFileURL(path.resolve(full)).href) });
    }
  }
  await scan('app/api');
  routes.sort((a, b) => a.parts.filter(p => p.startsWith('[')).length - b.parts.filter(p => p.startsWith('[')).length);
  const originalFetch = globalThis.fetch;
  // Invoke the real route handlers with actual Request/Response objects, without opening a network port.
  globalThis.fetch = async (input, init) => {
    const req = new Request(input, init); const parts = new URL(req.url).pathname.split('/').filter(Boolean);
    for (const route of routes) {
      if (route.parts.length !== parts.length) continue;
      const params: Record<string, string> = {};
      const matches = route.parts.every((part, i) => {
        if (part.startsWith('[')) { params[part.slice(1, -1)] = decodeURIComponent(parts[i]); return true; }
        return part === parts[i];
      });
      if (!matches) continue;
      const handler = route.methods[req.method];
      if (!handler) return Response.json({ error: 'Method not allowed' }, { status: 405 });
      return handler(req, { params: Promise.resolve(params) });
    }
    return Response.json({ error: 'Not found' }, { status: 404 });
  };
  try { const runner = await import('../scripts/integration'); await runner.done; }
  finally { globalThis.fetch = originalFetch; await db.$disconnect(); await pg.close(); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
