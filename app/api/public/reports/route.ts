import { api, ApiError } from "@/src/lib/http";
import { prisma } from "@/src/lib/prisma";
import { reportQuerySchema } from "@/src/lib/validators";
import type { Prisma } from "@prisma/client";
export const GET = api(async (req: Request) => {
  const parsed = reportQuerySchema.safeParse(Object.fromEntries(new URL(req.url).searchParams));
  if (!parsed.success) throw new ApiError(400, "Filter tidak valid.");
  const { status, categoryId, q, sort, page, limit } = parsed.data;
  const where: Prisma.ReportWhereInput = { isPublic: true, status, categoryId, ...(q ? { publicTitle: { contains: q, mode: "insensitive" } } : {}) };
  const [data, total] = await prisma.$transaction([
    prisma.report.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: [{ createdAt: sort === "oldest" ? "asc" : "desc" }, { id: sort === "oldest" ? "asc" : "desc" }],
      select: { reportNumber: true, publicTitle: true, publicSummary: true, status: true, createdAt: true, updatedAt: true, category: { select: { name: true } } } }),
    prisma.report.count({ where }),
  ]);
  return Response.json({ data, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
});
