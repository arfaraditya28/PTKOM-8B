import { prisma } from "./prisma";
import { Prisma, ReportStatus } from "@prisma/client";

type Point = { label: string; masuk: number; selesai: number };
export async function reportStatistics() {
  const today = new Date(Date.now() + 7 * 3600000);
  const year = today.getUTCFullYear();
  const yearStart = Date.UTC(year, 0, 1) - 7 * 3600000;
  const weekStart = Date.UTC(year, today.getUTCMonth(), today.getUTCDate() - 6) - 7 * 3600000;
  const since = new Date(Math.min(yearStart, weekStart));
  const schema = new URL(process.env.DATABASE_URL || "postgresql://localhost/test").searchParams.get("schema") || "public";
  const quoted = `"${schema.replaceAll('"', '""')}"`;
  const reportTable = Prisma.raw(`${quoted}."Report"`);
  const historyTable = Prisma.raw(`${quoted}."StatusHistory"`);
  const [total, statuses, categories, totalUsers, trends] = await Promise.all([
    prisma.report.count(),
    prisma.report.groupBy({ by: ["status"], _count: { status: true } }),
    prisma.category.findMany({ select: { id: true, name: true, _count: { select: { reports: true } } }, orderBy: { name: "asc" } }),
    prisma.user.count(),
    prisma.$queryRaw<{ day: string; masuk: bigint; selesai: bigint }[]>`
      WITH events AS (
        SELECT to_char("createdAt" + interval '7 hours', 'YYYY-MM-DD') AS day, 1 AS masuk, 0 AS selesai
        FROM ${reportTable} WHERE "createdAt" >= ${since}
        UNION ALL
        SELECT to_char("createdAt" + interval '7 hours', 'YYYY-MM-DD') AS day, 0 AS masuk, 1 AS selesai
        FROM ${historyTable} WHERE status = 'SELESAI' AND "createdAt" >= ${since}
      ) SELECT day, sum(masuk)::bigint AS masuk, sum(selesai)::bigint AS selesai FROM events GROUP BY day`,
  ]);
  const byStatus: Record<string, number> = Object.fromEntries(Object.values(ReportStatus).map(s => [s, 0]));
  for (const row of statuses) byStatus[row.status] = row._count.status;
  const weekly: Point[] = Array.from({ length: 7 }, (_, index) => {
    const day = new Date(today); day.setUTCDate(day.getUTCDate() - 6 + index);
    const key = day.toISOString().slice(0, 10);
    const row = trends.find(t => t.day === key);
    return { label: key.slice(5).split("-").reverse().join("/"), masuk: Number(row?.masuk ?? 0), selesai: Number(row?.selesai ?? 0) };
  });
  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  const monthly: Point[] = months.map((label, index) => {
    const key = `${year}-${String(index + 1).padStart(2, "0")}`;
    const rows = trends.filter(t => t.day.startsWith(key));
    return { label, masuk: rows.reduce((n, row) => n + Number(row.masuk), 0), selesai: rows.reduce((n, row) => n + Number(row.selesai), 0) };
  });
  return { total, totalUsers, byStatus, byCategory: categories.map(c => ({ categoryId: c.id, categoryName: c.name, count: c._count.reports })), weekly, monthly, year };
}
