"use client";
import { useState } from "react";
import { useApi } from "@/src/hooks/useApi";
import { statusLabels, dateWib, inputStyle, buttonStyle } from "@/src/lib/client-api";
import ReportDetail from "./ReportDetail";

type Report = { id: string; reportNumber: string; title: string; status: string; location: string; createdAt: string; category: { id: string; name: string } };
type List = { data: Report[]; pagination: { page: number; total: number; pages: number } };
export default function Laporan() {
  const [search, setSearch] = useState(""); const [query, setQuery] = useState("");
  const [status, setStatus] = useState(""); const [category, setCategory] = useState("");
  const [sort, setSort] = useState("newest"); const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string>(); const [revision, setRevision] = useState(0);
  const params = new URLSearchParams({ page: String(page), limit: "10", sort, ...(query ? { q: query } : {}), ...(status ? { status } : {}), ...(category ? { categoryId: category } : {}) });
  const { data, error } = useApi<List>(`/api/reports?${params}`, revision);
  const categories = useApi<{ data: { id: string; name: string }[] }>("/api/categories", revision);
  return <section id="laporan" className="scroll-mt-40 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
    <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-lg font-bold">Laporan Warga</h2><p className="text-sm text-slate-500">Kelola laporan dan tanggapan berdasarkan data yang masuk.</p></div><button className={buttonStyle} onClick={() => setRevision(n => n + 1)}>Perbarui daftar</button></div>
    <form className="my-5 flex flex-wrap gap-3" onSubmit={e => { e.preventDefault(); setQuery(search.trim()); setPage(1); }}>
      <input aria-label="Cari laporan" value={search} onChange={e => setSearch(e.target.value)} placeholder="Nomor, judul, atau lokasi" className={`${inputStyle} sm:w-64`} maxLength={200} /><button className={buttonStyle}>Cari</button>
      <select aria-label="Filter status" value={status} onChange={e => { setStatus(e.target.value); setPage(1); }} className={`${inputStyle} sm:w-auto`}><option value="">Semua status</option>{Object.entries(statusLabels).map(([key, value]) => <option key={key} value={key}>{value}</option>)}</select>
      <select aria-label="Filter kategori" value={category} onChange={e => { setCategory(e.target.value); setPage(1); }} className={`${inputStyle} sm:w-auto`}><option value="">Semua kategori</option>{categories.data?.data.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
      <select aria-label="Urutan laporan" value={sort} onChange={e => { setSort(e.target.value); setPage(1); }} className={`${inputStyle} sm:w-auto`}><option value="newest">Terbaru</option><option value="oldest">Terlama</option></select>
    </form>
    {error && <p role="alert" className="text-red-700">{error}</p>}
    {!data && !error && <p>Memuat laporan...</p>}
    <div className="overflow-x-auto"><table className="w-full min-w-[700px] text-left text-sm"><thead className="bg-[#EFF4FF]"><tr>{["Nomor / Tanggal", "Judul", "Kategori", "Lokasi", "Status", "Tindakan"].map(s => <th key={s} className="p-3">{s}</th>)}</tr></thead><tbody className="divide-y">{data?.data.map(r => <tr key={r.id}><td className="p-3"><p className="font-semibold text-blue-700">{r.reportNumber}</p><p className="text-xs text-slate-500">{dateWib(r.createdAt)}</p></td><td className="p-3">{r.title}</td><td className="p-3">{r.category.name}</td><td className="p-3">{r.location}</td><td className="p-3">{statusLabels[r.status]}</td><td className="p-3"><button className="rounded bg-blue-100 px-3 py-2 text-blue-800" onClick={() => setSelected(r.id)}>Lihat detail</button></td></tr>)}</tbody></table></div>
    {data?.data.length === 0 && <p className="py-6 text-center text-slate-500">Tidak ada laporan yang cocok.</p>}
    {data && <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm"><p>{data.pagination.total} laporan · Halaman {page} dari {Math.max(1, data.pagination.pages)}</p><div className="flex gap-3"><button disabled={page <= 1} className="rounded bg-slate-100 px-3 py-2 disabled:opacity-50" onClick={() => setPage(n => n - 1)}>Sebelumnya</button><button disabled={page >= data.pagination.pages} className="rounded bg-blue-100 px-3 py-2 disabled:opacity-50" onClick={() => setPage(n => n + 1)}>Selanjutnya</button></div></div>}
    {selected && <ReportDetail key={selected} id={selected} close={() => setSelected(undefined)} updated={() => setRevision(n => n + 1)} />}
  </section>;
}
