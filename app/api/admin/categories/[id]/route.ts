import { prisma } from "@/src/lib/prisma";
import { forbidden, getAuthUser, unauthorized } from "@/src/lib/auth";
import { upsertCategorySchema } from "@/src/lib/validators";

/** PATCH /api/admin/categories/:id — ubah kategori (khusus ADMIN). */
export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const user = getAuthUser(req);
  if (!user) return unauthorized();
  if (user.role !== "ADMIN") return forbidden("Hanya admin.");

  const { id } = await context.params;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Body harus JSON valid." }, { status: 400 });
  }

  const parsed = upsertCategorySchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Data kategori tidak valid.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const category = await prisma.category.update({
      where: { id },
      data: parsed.data,
    });
    return Response.json({ data: category });
  } catch {
    return Response.json(
      { error: "Kategori tidak ditemukan atau nama sudah dipakai." },
      { status: 404 }
    );
  }
}

/** DELETE /api/admin/categories/:id — hapus kategori (khusus ADMIN). */
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const user = getAuthUser(req);
  if (!user) return unauthorized();
  if (user.role !== "ADMIN") return forbidden("Hanya admin.");

  const { id } = await context.params;
  const used = await prisma.report.count({ where: { categoryId: id } });
  if (used > 0) {
    return Response.json(
      { error: `Kategori dipakai ${used} laporan, tidak bisa dihapus.` },
      { status: 409 }
    );
  }

  try {
    await prisma.category.delete({ where: { id } });
    return Response.json({ message: "Kategori dihapus." });
  } catch {
    return Response.json(
      { error: "Kategori tidak ditemukan." },
      { status: 404 }
    );
  }
}
