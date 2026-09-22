import { prisma } from "@/src/lib/prisma";
import { forbidden, getAuthUser, unauthorized } from "@/src/lib/auth";
import { ReportStatus } from "@prisma/client";

/** GET /api/admin/statistics — statistik laporan (khusus ADMIN). */
export async function GET(req: Request) {
  const user = getAuthUser(req);
  if (!user) return unauthorized();
  if (user.role !== "ADMIN") return forbidden("Hanya admin.");

  const [total, byStatusRaw, byCategoryRaw, totalUsers] = await Promise.all([
    prisma.report.count(),
    prisma.report.groupBy({ by: ["status"], _count: { status: true } }),
    prisma.report.groupBy({ by: ["categoryId"], _count: { categoryId: true } }),
    prisma.user.count(),
  ]);

  const byStatus: Record<string, number> = {};
  for (const s of Object.values(ReportStatus)) byStatus[s] = 0;
  for (const row of byStatusRaw) byStatus[row.status] = row._count.status;

  const categories = await prisma.category.findMany({
    select: { id: true, name: true },
  });
  const categoryName = new Map(categories.map((c) => [c.id, c.name]));
  const byCategory = byCategoryRaw.map((row) => ({
    categoryId: row.categoryId,
    categoryName: categoryName.get(row.categoryId) ?? row.categoryId,
    count: row._count.categoryId,
  }));

  return Response.json({
    data: { total, totalUsers, byStatus, byCategory },
  });
}
