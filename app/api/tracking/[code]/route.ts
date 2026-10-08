import { prisma } from "@/src/lib/prisma";

/**
 * GET /api/tracking/:code — tracking publik via kode tracking.
 * Sesuai catatan keamanan docs/DATABASE.md: data pribadi pelapor
 * (nama & kontak) TIDAK dikembalikan ke publik.
 */
export async function GET(
  _req: Request,
  context: { params: Promise<{ code: string }> }
) {
  const { code } = await context.params;
  const report = await prisma.report.findUnique({
    where: { trackingCode: code },
    select: {
      reportNumber: true,
      trackingCode: true,
      title: true,
      status: true,
      agency: true,
      createdAt: true,
      updatedAt: true,
      category: { select: { id: true, name: true } },
      comments: {
        orderBy: { createdAt: "asc" },
        select: { message: true, createdAt: true },
      },
      statusHistories: {
        orderBy: { createdAt: "asc" },
        select: { status: true, note: true, createdAt: true },
      },
    },
  });
  if (!report) {
    return Response.json(
      { error: "Kode tracking tidak ditemukan." },
      { status: 404 }
    );
  }

  const latestResponse =
    report.comments.length > 0
      ? report.comments[report.comments.length - 1].message
      : null;

  return Response.json({
    reportNumber: report.reportNumber,
    status: report.status,
    response: latestResponse,
    detail: report,
  });
}
