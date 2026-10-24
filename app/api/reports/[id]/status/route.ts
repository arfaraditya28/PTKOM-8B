import { api, ApiError, body, serializable } from "@/src/lib/http";
import { requireUser } from "@/src/lib/auth";
import { updateStatusSchema } from "@/src/lib/validators";
import { canTransition } from "@/src/lib/workflow";
export const PATCH = api(async (req: Request, ctx: { params: Promise<{ id: string }> }) => {
  const user = await requireUser(req); const { id } = await ctx.params;
  const data = await body(req, updateStatusSchema);
  const updated = await serializable(async tx => {
    const report = await tx.report.findUnique({ where: { id } });
    if (!report) throw new ApiError(404, "Laporan tidak ditemukan.");
    if (!canTransition(report.status, data.status)) throw new ApiError(409, `Perubahan ${report.status} ke ${data.status} tidak diizinkan.`);
    const changed = await tx.report.updateMany({ where: { id, status: report.status }, data: { status: data.status } });
    if (!changed.count) throw new ApiError(409, "Status baru saja berubah, muat ulang laporan.");
    await tx.statusHistory.create({ data: { reportId: id, userId: user.id, ...data } });
    return { id, reportNumber: report.reportNumber, status: data.status };
  });
  return Response.json({ data: updated });
});
