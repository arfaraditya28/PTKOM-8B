import { api, ApiError, body, serializable } from "@/src/lib/http";
import { requireUser } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { patchCategorySchema } from "@/src/lib/validators";
export const PATCH = api(async (req: Request, ctx: { params: Promise<{ id: string }> }) => { await requireUser(req, true); const { id } = await ctx.params; return Response.json({ data: await prisma.category.update({ where: { id }, data: await body(req, patchCategorySchema) }) }); });
export const DELETE = api(async (req: Request, ctx: { params: Promise<{ id: string }> }) => {
  await requireUser(req, true);
  const { id } = await ctx.params;
  await serializable(async tx => {
    const category = await tx.category.findUnique({
      where: { id }, select: { _count: { select: { reports: true } } },
    });
    if (!category) throw new ApiError(404, "Kategori tidak ditemukan.");
    if (category._count.reports > 0) throw new ApiError(409, "Kategori masih digunakan oleh laporan dan tidak dapat dihapus.");
    await tx.category.delete({ where: { id } });
  });
  return Response.json({ message: "Kategori dihapus." });
});
