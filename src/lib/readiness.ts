import { Prisma, type PrismaClient } from '@prisma/client';

export function configurationProblems(env: { DATABASE_URL?: string; JWT_SECRET?: string }): string[] {
  const problems: string[] = [];
  if (!env.DATABASE_URL) {
    problems.push('DATABASE_URL belum diisi. Letakkan .env sejajar dengan package.json, lalu simpan.');
  } else {
    try {
      const url = new URL(env.DATABASE_URL);
      if (!['postgresql:', 'postgres:'].includes(url.protocol) || !url.hostname ||
        url.hostname.toLowerCase() === 'host' || url.pathname.length < 2) {
        throw new Error('Invalid connection URL');
      }
    } catch {
      problems.push('DATABASE_URL belum berupa URL PostgreSQL yang valid. Gunakan URL database uji milikmu.');
    }
  }
  if (!env.JWT_SECRET || env.JWT_SECRET.trim().length < 32) {
    problems.push('JWT_SECRET belum diisi atau kurang dari 32 karakter. Buat rahasia acak sesuai README.');
  }
  return problems;
}

export async function databaseProblems(db: PrismaClient, schema = 'public'): Promise<string[]> {
  const required: Record<string, string[]> = {
    User: ['id', 'name', 'username', 'password', 'role', 'isActive', 'tokenVersion', 'createdAt', 'updatedAt'],
    Category: ['id', 'name', 'description', 'createdAt', 'updatedAt'],
    Report: ['id', 'reportNumber', 'trackingCode', 'categoryId', 'title', 'description', 'location', 'agency',
      'incidentDate', 'reporterName', 'reporterContact', 'status', 'isPublic', 'publicTitle',
      'publicSummary', 'createdAt', 'updatedAt'],
    Attachment: ['id', 'reportId', 'fileName', 'fileUrl', 'fileType', 'content', 'size', 'createdAt'],
    Comment: ['id', 'reportId', 'userId', 'message', 'createdAt'],
    StatusHistory: ['id', 'reportId', 'userId', 'status', 'note', 'createdAt'],
    ReportCounter: ['day', 'value'],
    Service: ['id', 'name', 'description', 'requirements', 'hours', 'contact', 'isActive', 'createdAt', 'updatedAt'],
  };
  const columns = await db.$queryRaw<{ table_name: string; column_name: string; is_nullable: string }[]>`
    SELECT table_name, column_name, is_nullable FROM information_schema.columns
    WHERE table_schema = ${schema}`;
  const problems: string[] = [];
  for (const [table, fields] of Object.entries(required)) {
    const existing = new Set(columns.filter(column => column.table_name === table).map(column => column.column_name));
    const missing = fields.filter(field => !existing.has(field));
    if (missing.length) problems.push(`Schema belum sesuai: ${table} kekurangan ${missing.join(', ')}.`);
  }
  for (const [table, field] of [['StatusHistory', 'userId'], ['Attachment', 'fileUrl']]) {
    const column = columns.find(column => column.table_name === table && column.column_name === field);
    if (column && column.is_nullable !== 'YES') problems.push(`Schema belum sesuai: ${table}.${field} harus nullable.`);
  }
  if (problems.length) return problems;

  // Quote identifiers, including embedded quotes, so custom schema names are safe.
  const quotedSchema = `"${schema.replaceAll('"', '""')}"`;
  const reportTable = Prisma.raw(`${quotedSchema}."Report"`);
  const counterTable = Prisma.raw(`${quotedSchema}."ReportCounter"`);
  // SELECT only: never migrate, seed, update counters, or change user data.
  const unsynced = await db.$queryRaw<{ day: string }[]>`
    SELECT substring(r."reportNumber" from 5 for 8) AS day
    FROM ${reportTable} r
    LEFT JOIN ${counterTable} c ON c.day = substring(r."reportNumber" from 5 for 8)
    WHERE r."reportNumber" ~ '^LAP-[0-9]{8}-[0-9]+$'
    GROUP BY substring(r."reportNumber" from 5 for 8), c.value
    HAVING COALESCE(c.value, 0) < MAX(substring(r."reportNumber" from 14)::numeric)
    LIMIT 1`;
  if (unsynced.length) problems.push('Counter laporan lama belum disinkronkan. Jalankan db:sync-counters pada database uji sebelum menerima laporan.');
  return problems;
}
