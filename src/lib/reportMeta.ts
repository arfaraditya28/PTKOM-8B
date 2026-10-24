import { randomBytes } from "node:crypto";
export function reportDay(date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta", year: "numeric", month: "2-digit", day: "2-digit" }).format(date).replaceAll("-", "");
}
export function buildReportNumber(date: Date, seq: number): string {
  return `LAP-${reportDay(date)}-${String(seq).padStart(4, "0")}`;
}
export function buildTrackingCode(): string { return `TRK-${randomBytes(16).toString("hex").toUpperCase()}`; }
