import { prisma } from "@/src/lib/prisma";
import { getAuthUser, unauthorized } from "@/src/lib/auth";
import { addCommentSchema } from "@/src/lib/validators";

/** POST /api/reports/:id/comments — tanggapan petugas (butuh login). */
export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const user = getAuthUser(req);
  if (!user) return unauthorized();

  const { id } = await context.params;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Body harus JSON valid." }, { status: 400 });
  }

  const parsed = addCommentSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Pesan tidak valid.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const existing = await prisma.report.findUnique({ where: { id } });
  if (!existing) {
    return Response.json({ error: "Laporan tidak ditemukan." }, { status: 404 });
  }

  const comment = await prisma.comment.create({
    data: { reportId: id, userId: user.id, message: parsed.data.message },
    include: { user: { select: { id: true, name: true, role: true } } },
  });

  return Response.json({ data: comment }, { status: 201 });
}
