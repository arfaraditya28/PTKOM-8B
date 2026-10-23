import { Prisma } from "@prisma/client";
import { prisma } from "@/src/lib/prisma";
import { requireUser, signUploadToken } from "@/src/lib/auth";
import { api, ApiError, body, prismaErrorCode } from "@/src/lib/http";
import { createReportSchema, reportQuerySchema } from "@/src/lib/validators";
import { buildReportNumber, buildTrackingCode, reportDay } from "@/src/lib/reportMeta";
export const GET = api(async (req: Request) => {
  await requireUser(req);
  const parsed = reportQuerySchema.safeParse(Object.fromEntries(new URL(req.url).searchParams));
  if (!parsed.success) throw new ApiError(400, "Filter status, page atau limit tidak valid.");
  const { status, categoryId, q, limit, page } = parsed.data;
  const where: Prisma.ReportWhereInput = { status, categoryId, ...(q ? { OR: [
    { title: { contains: q, mode: "insensitive" } }, { reportNumber: { contains: q } }, { trackingCode: { contains: q } },
  ] } : {}) };
  const [data, total] = await prisma.$transaction([
    prisma.report.findMany({ where, orderBy: [{ createdAt: "desc" }, { id: "desc" }], take: limit, skip: (page - 1) * limit,
      select: { id: true, reportNumber: true, trackingCode: true, title: true, status: true, location: true, createdAt: true, category: { select: { id: true, name: true } } } }),
    prisma.report.count({ where }),
  ]);
  return Response.json({ data, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
});
export const POST = api(async (req: Request) => {
  const data = await body(req, createReportSchema);
  if (!await prisma.category.findUnique({ where: { id: data.categoryId } })) throw new ApiError(404, "Kategori tidak ditemukan.");
  const now = new Date();
  // Prepare token first: missing JWT configuration must not leave a committed report.
  const reportId = `r${crypto.randomUUID().replaceAll("-", "")}`;
  const uploadToken = signUploadToken(reportId);
  for (let attempt = 0; ; attempt++) {
    try {
      const report = await prisma.$transaction(async tx => {
        const counter = await tx.reportCounter.upsert({ where: { day: reportDay(now) }, create: { day: reportDay(now), value: 1 }, update: { value: { increment: 1 } } });
        return tx.report.create({ data: { ...data, id: reportId, incidentDate: new Date(`${data.incidentDate}T00:00:00Z`),
          reportNumber: buildReportNumber(now, counter.value), trackingCode: buildTrackingCode(),
          statusHistories: { create: { status: "DIAJUKAN", note: "Laporan dibuat oleh masyarakat." } },
        } });
      });
      return Response.json({ id: report.id, reportNumber: report.reportNumber, trackingCode: report.trackingCode, uploadToken, uploadExpiresIn: 900 }, { status: 201 });
    } catch (error) {
      if (["P2002", "P2034"].includes(prismaErrorCode(error) ?? "") && attempt < 4) continue;
      throw error;
    }
  }
});
