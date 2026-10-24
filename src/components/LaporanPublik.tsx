"use client";
import Link from "next/link";
import { useState } from "react";
import { useApi } from "@/src/hooks/useApi";
import { statusLabels, dateWib, inputStyle, buttonStyle } from "@/src/lib/client-api";
type List = { data: { reportNumber: string; publicTitle: string; publicSummary: string; status: string; createdAt: string; category: { name: string } }[]; pagination: { total: number; pages: number } };
export default function LaporanPublik() {
  const [page, setPage] = useState(1); const [status, setStatus] = useState("");
  const { data, error } = useApi<List>(`/api/public/reports?page=${page}&limit=10${status ? `&status=${status}` : ""}`);
  return <main className="min-h-screen bg-white px-6 py-10"><section className="mx-auto max-w-6xl">
    <Link href="/" className="text-sm text-blue-700">Kembali ke beranda</Link><h1 className="mt-5 text-3xl font-bold">Laporan Publik Warga</h1><p className="mt-2 text-slate-600">Laporan yang telah diperiksa dan dipublikasikan admin. Identitas pelapor dan bukti tidak ditampilkan.</p>
    <label className="mt-6 block max-w-sm text-sm">Filter status<select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }} className={inputStyle}><option value="">Semua status</option>{Object.entries(statusLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label>
    {error && <p role="alert" className="mt-4 text-red-700">{error}</p>}
    {!data && !error && <p className="mt-4">Memuat laporan...</p>}
    {data?.data.length === 0 && <p className="mt-6 text-slate-500">Belum ada laporan publik untuk pilihan ini.</p>}
    <div className="mt-6 grid gap-4 md:grid-cols-2">{data?.data.map(r => <article key={r.reportNumber} className="rounded-xl border border-gray-200 p-5 shadow-sm"><div className="flex flex-wrap justify-between gap-2 text-xs"><span>{r.reportNumber}</span><span className="rounded-full bg-blue-100 px-3 py-1 text-blue-900">{statusLabels[r.status]}</span></div><p className="mt-2 text-xs text-slate-500">{r.category.name} · {dateWib(r.createdAt)}</p><h2 className="mt-3 text-lg font-bold">{r.publicTitle}</h2><p className="mt-2 whitespace-pre-wrap text-sm">{r.publicSummary}</p></article>)}</div>
    {data && <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm"><p>{data.pagination.total} laporan · Halaman {page} dari {Math.max(1, data.pagination.pages)}</p><div className="flex gap-3"><button className={buttonStyle} disabled={page <= 1} onClick={() => setPage(n => n - 1)}>Sebelumnya</button><button className={buttonStyle} disabled={page >= data.pagination.pages} onClick={() => setPage(n => n + 1)}>Selanjutnya</button></div></div>}
  </section></main>;
}
