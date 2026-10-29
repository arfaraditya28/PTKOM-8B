import { z } from "zod";
import { ReportStatus } from "@prisma/client";
const text = (min: number, max: number) => z.string().trim().min(min).max(max);
// Tanggal "hari ini" menurut WIB, bukan zona waktu server.
function todayWib(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}
export const dateOnly = z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/).refine(v => {
  const d = new Date(`${v}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === v;
}, "Tanggal tidak valid (YYYY-MM-DD).").refine(v => v <= todayWib(), "Tanggal kejadian tidak boleh di masa depan.");
export const createReportSchema = z.object({
  categoryId: text(1, 100), title: text(5, 200), description: text(10, 10000),
  location: text(3, 500), incidentDate: dateOnly,
  agency: text(1, 200).optional(),
  reporterName: text(2, 100), reporterContact: text(5, 100),
}).strict();
export const loginSchema = z.object({ username: text(1, 50), password: z.string().min(1).max(72).refine(v => Buffer.byteLength(v, "utf8") <= 72, "Password maksimal 72 byte.") }).strict();
export const updateStatusSchema = z.object({ status: z.nativeEnum(ReportStatus), note: text(1, 500).optional() }).strict()
  .refine(v => v.status !== "DITOLAK" || !!v.note, "Alasan penolakan wajib diisi.");
export const addCommentSchema = z.object({ message: text(1, 2000) }).strict();
export const upsertCategorySchema = z.object({ name: text(2, 100), description: text(0, 500).optional() }).strict();
export const patchCategorySchema = upsertCategorySchema.partial().refine(v => Object.keys(v).length > 0, "Isi minimal satu field.");
export const passwordSchema = z.string().min(10).max(72)
  .refine(v => v.trim().length > 0, "Password tidak boleh hanya spasi.")
  .refine(v => Buffer.byteLength(v, "utf8") <= 72, "Password maksimal 72 byte.");
const password = passwordSchema;
export const createUserSchema = z.object({ name: text(2, 100), username: text(3, 50).regex(/^[a-zA-Z0-9_.-]+$/), password, role: z.enum(["ADMIN", "PETUGAS"]).default("PETUGAS") }).strict();
export const updateUserSchema = z.object({ name: text(2, 100).optional(), username: text(3, 50).regex(/^[a-zA-Z0-9_.-]+$/).optional(), password: password.optional(), role: z.enum(["ADMIN", "PETUGAS"]).optional(), isActive: z.boolean().optional() }).strict().refine(v => Object.keys(v).length > 0, "Isi minimal satu field.");
export const serviceSchema = z.object({ name: text(3, 150), description: text(5, 5000), requirements: text(1, 5000), hours: text(1, 500), contact: text(0, 200).optional(), isActive: z.boolean().default(true) }).strict();
export const patchServiceSchema = serviceSchema.partial().extend({ isActive: z.boolean().optional() }).refine(v => Object.keys(v).length > 0, "Isi minimal satu field.");
export const visibilitySchema = z.object({ isPublic: z.boolean(), publicTitle: text(5, 200).optional(), publicSummary: text(10, 1000).optional() }).strict().refine(v => !v.isPublic || (!!v.publicTitle && !!v.publicSummary), "Publikasi membutuhkan judul dan ringkasan yang sudah disamarkan.");
export const reportQuerySchema = z.object({ status: z.nativeEnum(ReportStatus).optional(), categoryId: text(1, 100).optional(), q: text(0, 200).optional(), sort: z.enum(["newest", "oldest"]).default("newest"), limit: z.coerce.number().int().min(1).max(100).default(20), page: z.coerce.number().int().min(1).max(10000).default(1) }).strict();
export const reportStatuses = Object.values(ReportStatus);
