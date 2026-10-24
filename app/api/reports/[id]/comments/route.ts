import { api, body } from "@/src/lib/http";
import { prisma } from "@/src/lib/prisma";
import { getAuthUser, unauthorized } from "@/src/lib/auth";
import { addCommentSchema } from "@/src/lib/validators";

/** POST /api/reports/:id/comments — tanggapan petugas (butuh login). */
export const POST = api(async function (
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  const { id } = await context.params;
  const data = await body(req, addCommentSchema);

  const existing = await prisma.report.findUnique({ where: { id } });
  if (!existing) {
    return Response.json({ error: "Laporan tidak ditemukan." }, { status: 404 });
  }

  const comment = await prisma.comment.create({
    data: { reportId: id, userId: user.id, message: data.message },
    include: { user: { select: { id: true, name: true, role: true } } },
  });

  return Response.json({ data: comment }, { status: 201 });
});
