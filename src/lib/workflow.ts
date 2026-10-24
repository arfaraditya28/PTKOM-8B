import type { ReportStatus } from "@prisma/client";
export const transitions: Record<ReportStatus, ReportStatus[]> = {
  DIAJUKAN: ["DIVERIFIKASI", "DITOLAK"],
  DIVERIFIKASI: ["DIPROSES", "DITOLAK"],
  DIPROSES: ["SELESAI", "DITOLAK"],
  SELESAI: [], DITOLAK: [],
};
export function canTransition(from: ReportStatus, to: ReportStatus) { return transitions[from].includes(to); }
