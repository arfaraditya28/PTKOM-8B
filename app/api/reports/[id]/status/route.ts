import { prisma } from "@/src/lib/prisma";
import { getAuthUser, unauthorized } from "@/src/lib/auth";
import { updateStatusSchema } from "@/src/lib/validators";

/** PATCH /api/reports/:id/status — ubah status laporan (butuh login). */
export async function PATCH(
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

  const parsed = updateStatusSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Status tidak valid.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const existing = await prisma.report.findUnique({ where: { id } });
  if (!existing) {
    return Response.json({ error: "Laporan tidak ditemukan." }, { status: 404 });
  }

  const updated = await prisma.$transaction(async (tx) => {
    const report = await tx.report.update({
      where: { id },
      data: { status: parsed.data.status },
    });
    await tx.statusHistory.create({
      data: {
        reportId: id,
        userId: user.id,
        status: parsed.data.status,
        note: parsed.data.note,
      },
    });
    return report;
  });

  return Response.json({
    data: {
      id: updated.id,
      reportNumber: updated.reportNumber,
      status: updated.status,
    },
  });
}
