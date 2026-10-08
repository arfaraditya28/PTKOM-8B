import { prisma } from "@/src/lib/prisma";
import { getAuthUser, unauthorized } from "@/src/lib/auth";
import { createReportSchema } from "@/src/lib/validators";
import { buildReportNumber, buildTrackingCode } from "@/src/lib/reportMeta";
import { ReportStatus } from "@prisma/client";

/**
 * GET /api/reports — daftar laporan untuk petugas (butuh login).
 * Query opsional: ?status=DIPROSES&categoryId=...&q=...&limit=50
 */
export async function GET(req: Request) {
  const user = getAuthUser(req);
  if (!user) return unauthorized();

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const categoryId = searchParams.get("categoryId");
  const q = searchParams.get("q")?.trim();
  const limit = Math.min(
    Math.max(Number(searchParams.get("limit")) || 50, 1),
    100
  );

  const reports = await prisma.report.findMany({
    where: {
      ...(status ? { status: status as ReportStatus } : {}),
      ...(categoryId ? { categoryId } : {}),
      ...(q
        ? {
            OR: [
              { title: { contains: q } },
              { reportNumber: { contains: q } },
              { trackingCode: { contains: q } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      reportNumber: true,
      trackingCode: true,
      title: true,
      status: true,
      location: true,
      agency: true,
      createdAt: true,
      category: { select: { id: true, name: true } },
    },
  });
  return Response.json({ data: reports });
}

/**
 * POST /api/reports — membuat laporan baru TANPA login (publik).
 * Response: { reportNumber, trackingCode } sesuai docs/API.md.
 */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Body harus JSON valid." }, { status: 400 });
  }

  const parsed = createReportSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Data laporan tidak valid.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const data = parsed.data;

  const category = await prisma.category.findUnique({
    where: { id: data.categoryId },
  });
  if (!category) {
    return Response.json({ error: "Kategori tidak ditemukan." }, { status: 404 });
  }

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const report = await prisma.$transaction(async (tx) => {
    const todayCount = await tx.report.count({
      where: { createdAt: { gte: startOfDay } },
    });
    const created = await tx.report.create({
      data: {
        reportNumber: buildReportNumber(now, todayCount + 1),
        trackingCode: buildTrackingCode(),
        categoryId: data.categoryId,
        title: data.title,
        description: data.description,
        location: data.location,
        agency: data.agency || null,
        incidentDate: new Date(data.incidentDate),
        reporterName: data.reporterName,
        reporterContact: data.reporterContact,
        status: ReportStatus.DIAJUKAN,
      },
    });
    // Catat status awal. userId wajib ada di FK -> pakai akun sistem pertama.
    // (Masyarakat tanpa akun, jadi riwayat awal dicatat atas nama sistem.)
    const systemUser = await tx.user.findFirst({ orderBy: { createdAt: "asc" } });
    if (systemUser) {
      await tx.statusHistory.create({
        data: {
          reportId: created.id,
          userId: systemUser.id,
          status: ReportStatus.DIAJUKAN,
          note: "Laporan dibuat oleh masyarakat.",
        },
      });
    }
    return created;
  });

  return Response.json(
    { reportNumber: report.reportNumber, trackingCode: report.trackingCode },
    { status: 201 }
  );
}
