import { prisma } from "@/src/lib/prisma";
import { getAuthUser, unauthorized } from "@/src/lib/auth";

/** GET /api/reports/:id — detail laporan (butuh login petugas/admin). */
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const user = getAuthUser(req);
  if (!user) return unauthorized();

  const { id } = await context.params;
  const report = await prisma.report.findUnique({
    where: { id },
    include: {
      category: { select: { id: true, name: true } },
      attachments: true,
      comments: {
        orderBy: { createdAt: "asc" },
        include: { user: { select: { id: true, name: true, role: true } } },
      },
      statusHistories: {
        orderBy: { createdAt: "asc" },
        include: { user: { select: { id: true, name: true } } },
      },
    },
  });
  if (!report) {
    return Response.json({ error: "Laporan tidak ditemukan." }, { status: 404 });
  }
  return Response.json({ data: report });
}
