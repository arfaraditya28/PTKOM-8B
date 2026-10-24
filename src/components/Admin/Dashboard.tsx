"use client";
import { useState } from "react";
import { useApi } from "@/src/hooks/useApi";
import { useSession } from "./Session";
import Statistik from "./Statistik";
import KategoriAduan from "./KategoriAduan";
import { buttonStyle } from "@/src/lib/client-api";

export type Statistics = {
  total: number; byStatus: Record<string, number>;
  byCategory: { categoryId: string; categoryName: string; count: number }[];
  weekly: { label: string; masuk: number; selesai: number }[];
  monthly: { label: string; masuk: number; selesai: number }[];
  year: number;
};
export default function Dashboard() {
  const user = useSession();
  const [revision, setRevision] = useState(0);
  const { data, error } = useApi<{ data: Statistics }>("/api/reports/statistics", revision);
  const stats = data?.data;
  const cards = stats ? [
    ["TOTAL SELURUH LAPORAN", stats.total], ["MENUNGGU VERIFIKASI", stats.byStatus.DIAJUKAN],
    ["DALAM TINDAK LANJUT", stats.byStatus.DIVERIFIKASI + stats.byStatus.DIPROSES], ["SELESAI", stats.byStatus.SELESAI], ["DITOLAK", stats.byStatus.DITOLAK],
  ] : [];
  return <div className="space-y-6">
    <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div><p className="text-sm text-blue-700">Sistem Informasi Pengaduan Warga</p><h1 className="mt-2 text-2xl font-bold">Selamat Datang, {user.name || user.username}!</h1><p className="mt-2 text-sm text-slate-500">Pantau dan kelola aspirasi masyarakat Kecamatan Sekampung.</p></div>
      <div className="flex flex-wrap gap-3"><button className={buttonStyle} onClick={() => setRevision(n => n + 1)}>Perbarui statistik</button><a download="rekap-laporan.csv" href="/api/reports/export" className="rounded-lg bg-[#EFF4FF] px-4 py-2 text-sm font-semibold text-[#001F41]">Unduh rekap CSV</a></div>
    </section>
    {error && <p role="alert" className="text-red-700">{error}</p>}
    {!stats && !error && <p>Memuat statistik...</p>}
    {stats && <>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{cards.map(([label, count]) => <article key={label} className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm"><p className="text-3xl font-bold text-[#005CBD]">{count}</p><p className="mt-2 text-xs text-slate-600">{label}</p></article>)}</section>
      <div id="statistik" className="grid scroll-mt-40 gap-6 lg:grid-cols-[1.6fr_1fr]"><Statistik totalMasuk={stats.total} totalSelesai={stats.byStatus.SELESAI} weekly={stats.weekly} monthly={stats.monthly} year={stats.year} /><KategoriAduan totalAduan={stats.total} categories={stats.byCategory} /></div>
    </>}
  </div>;
}
