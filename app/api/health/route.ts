import { prisma } from '@/src/lib/prisma';
import { configurationProblems } from '@/src/lib/readiness';

/** Liveness/readiness without exposing credentials, hostnames or schema details. */
export async function GET() {
  const headers = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' };
  try {
    if (configurationProblems({ DATABASE_URL: process.env.DATABASE_URL, JWT_SECRET: process.env.JWT_SECRET }).length) return Response.json({ status: 'error' }, { status: 503, headers });
    await prisma.$queryRaw`SELECT 1`;
    return Response.json({ status: 'ok' }, { headers });
  } catch { return Response.json({ status: 'error' }, { status: 503, headers }); }
}
