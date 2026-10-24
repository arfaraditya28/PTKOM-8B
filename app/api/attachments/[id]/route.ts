import { api, ApiError } from "@/src/lib/http";
import { requireUser } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
export const runtime = "nodejs";
export const GET = api(async (req: Request, ctx: { params: Promise<{ id: string }> }) => {
  await requireUser(req); const { id } = await ctx.params;
  const file = await prisma.attachment.findUnique({ where: { id } });
  if (!file) throw new ApiError(404, "Bukti tidak ditemukan.");
  if (!file.content || file.size === null) throw new ApiError(410, "Bukti lama perlu diunggah ulang oleh petugas.");
  return new Response(Buffer.from(file.content), { headers: { "Content-Type": file.fileType, "Content-Length": String(file.size),
    "Content-Disposition": `attachment; filename="${file.id}.${file.fileType === "image/png" ? "png" : file.fileType === "image/jpeg" ? "jpg" : "pdf"}"`,
    "X-Content-Type-Options": "nosniff", "Cache-Control": "no-store", "Content-Security-Policy": "sandbox" } });
});
export const DELETE = api(async (req: Request, ctx: { params: Promise<{ id: string }> }) => {
  await requireUser(req, true); const { id } = await ctx.params;
  await prisma.attachment.delete({ where: { id } }); return Response.json({ message: "Bukti dihapus." });
});
