import { api, ApiError, boundedBody, serializable } from "@/src/lib/http";
import { canUpload, requireUser } from "@/src/lib/auth";
import { detectFile, MAX_ATTACHMENTS, MAX_FILE_SIZE } from "@/src/lib/attachments";
export const runtime = "nodejs";
export const POST = api(async (req: Request, ctx: { params: Promise<{ id: string }> }) => {
  const { id } = await ctx.params;
  if (!canUpload(req, id)) await requireUser(req);
  if (!req.headers.get("content-type")?.startsWith("multipart/form-data;")) throw new ApiError(415, "Gunakan multipart/form-data dengan field file.");
  const bytes = await boundedBody(req, MAX_FILE_SIZE + 64 * 1024);
  let form: FormData;
  try { form = await new Response(Buffer.from(bytes), { headers: { "content-type": req.headers.get("content-type")! } }).formData(); }
  catch { throw new ApiError(400, "Form upload tidak valid."); }
  const file = form.get("file");
  if (!(file instanceof File) || form.getAll("file").length !== 1) throw new ApiError(400, "Kirim tepat satu file per permintaan.");
  if (!file.size || file.size > MAX_FILE_SIZE) throw new ApiError(413, "Ukuran file harus 1 byte sampai 5 MB.");
  const content = new Uint8Array(await file.arrayBuffer()); const type = detectFile(content);
  if (file.type && file.type !== type.mime) throw new ApiError(415, "Jenis file tidak sesuai dengan isi file.");
  const data = await serializable(async tx => {
    const report = await tx.report.findUnique({ where: { id } });
    if (!report) throw new ApiError(404, "Laporan tidak ditemukan.");
    if (["SELESAI", "DITOLAK"].includes(report.status)) throw new ApiError(409, "Laporan sudah ditutup.");
    if (await tx.attachment.count({ where: { reportId: id } }) >= MAX_ATTACHMENTS) throw new ApiError(409, "Maksimal tiga bukti per laporan.");
    return tx.attachment.create({ data: { reportId: id, fileName: `bukti-${crypto.randomUUID()}.${type.ext}`, fileType: type.mime, size: file.size, content },
      select: { id: true, fileName: true, fileType: true, size: true, createdAt: true } });
  });
  return Response.json({ data }, { status: 201 });
});
