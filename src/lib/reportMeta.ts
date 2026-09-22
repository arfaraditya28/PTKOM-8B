import { randomBytes } from "crypto";

/**
 * Nomor laporan: LAP-YYYYMMDD-XXXX (urutan harian).
 * Dipanggil di dalam transaksi agar aman dari duplikat.
 */
export function buildReportNumber(date = new Date(), seq: number): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `LAP-${y}${m}${d}-${String(seq).padStart(4, "0")}`;
}

/** Kode tracking publik: TRK-XXXXXX (6 char base32 tanpa huruf ambigu). */
export function buildTrackingCode(): string {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(6);
  let code = "";
  for (const b of bytes) code += alphabet[b % alphabet.length];
  return `TRK-${code}`;
}
