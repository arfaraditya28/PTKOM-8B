"use client";

export async function requestJson<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(url, { ...options, cache: "no-store", credentials: "same-origin" });
  const result = await response.json();
  if (!response.ok) {
    if (response.status === 401 && window.location.pathname.startsWith("/admin")) window.dispatchEvent(new Event("ptkom-session-expired"));
    throw new Error(result.error || "Permintaan gagal. Silakan coba lagi.");
  }
  return result as T;
}

export function jsonOptions(method: string, value?: unknown): RequestInit {
  return { method, headers: { "Content-Type": "application/json" }, body: value === undefined ? undefined : JSON.stringify(value) };
}

export const statusLabels: Record<string, string> = {
  DIAJUKAN: "Menunggu verifikasi", DIVERIFIKASI: "Diverifikasi", DIPROSES: "Sedang diproses", SELESAI: "Selesai", DITOLAK: "Ditolak",
};
export const inputStyle = "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900";
export const buttonStyle = "rounded-lg bg-[#1960A3] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50";
export function dateWib(value: string) { return new Date(value).toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }); }
