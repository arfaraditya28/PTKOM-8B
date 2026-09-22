import { z } from "zod";
import { ReportStatus } from "@prisma/client";

// Sesuai docs/API.md bagian "Create Report"
export const createReportSchema = z.object({
  categoryId: z.string().min(1, "categoryId wajib diisi"),
  title: z.string().min(5, "Judul minimal 5 karakter").max(200),
  description: z.string().min(10, "Deskripsi minimal 10 karakter"),
  location: z.string().min(3, "Lokasi wajib diisi"),
  incidentDate: z.string().refine((v) => !Number.isNaN(Date.parse(v)), {
    message: "incidentDate harus tanggal valid (YYYY-MM-DD)",
  }),
  reporterName: z.string().min(2, "Nama pelapor wajib diisi").max(100),
  reporterContact: z.string().min(5, "Kontak pelapor wajib diisi").max(50),
});

// Sesuai docs/API.md bagian "Login"
export const loginSchema = z.object({
  username: z.string().min(1, "username wajib diisi"),
  password: z.string().min(1, "password wajib diisi"),
});

// Sesuai docs/API.md bagian "Update Report Status"
export const updateStatusSchema = z.object({
  status: z.nativeEnum(ReportStatus),
  note: z.string().max(500).optional(),
});

// Sesuai docs/API.md bagian "Add Report Response"
export const addCommentSchema = z.object({
  message: z.string().min(1, "Pesan wajib diisi").max(2000),
});

export const upsertCategorySchema = z.object({
  name: z.string().min(2, "Nama kategori minimal 2 karakter").max(100),
  description: z.string().max(500).optional(),
});

export const reportStatuses = Object.values(ReportStatus) as string[];
