"use client";
import Link from "next/link";
import { useState } from "react";
import { requestJson, statusLabels, dateWib, buttonStyle, inputStyle } from "@/src/lib/client-api";

type Tracking = { reportNumber: string; status: string; response: string | null; detail: {
  title: string; category: { name: string }; createdAt: string;
  comments: { message: string; createdAt: string }[];
  statusHistories: { status: string; createdAt: string }[];
} };
export default function TrackingPage() {
  const [code, setCode] = useState(""); const [data, setData] = useState<Tracking>();
  const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  async function track(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(""); setData(undefined);
    try { setData(await requestJson<Tracking>(`/api/tracking/${encodeURIComponent(code.trim())}`)); }
    catch (e) { setError(e instanceof Error ? e.message : "Tracking gagal."); }
    finally { setBusy(false); }
  }
  return <main className="min-h-screen bg-[#F5F7FB] px-6 py-12"><section className="mx-auto max-w-3xl rounded-2xl border bg-white p-6 shadow-sm">
    <Link href="/" className="text-sm text-blue-700">Kembali ke beranda</Link><h1 className="mt-5 text-2xl font-bold text-[#0F3460]">Lacak Laporan</h1><p className="mt-2 text-sm text-slate-600">Masukkan kode tracking yang didapat setelah mengirim laporan. Simpan kode tersebut untuk Anda sendiri.</p>
    <form onSubmit={track} className="mt-6 flex flex-wrap gap-3"><label className="min-w-0 flex-1 text-sm">Kode tracking<input value={code} onChange={e => setCode(e.target.value)} required maxLength={100} autoComplete="off" placeholder="TRK-..." className={inputStyle} /></label><button disabled={busy} className={`${buttonStyle} self-end`}>{busy ? "Mencari..." : "Lacak"}</button></form>
    {error && <p role="alert" className="mt-4 text-red-700">{error}</p>}
    {data && <article className="mt-8 space-y-6 border-t pt-5"><div><p className="font-semibold text-blue-700">{data.reportNumber}</p><h2 className="text-xl font-bold">{data.detail.title}</h2><p className="mt-2">{statusLabels[data.status]} · {data.detail.category.name}</p><p className="text-sm text-slate-500">Masuk: {dateWib(data.detail.createdAt)}</p></div><div><h3 className="font-bold">Riwayat status</h3><ul className="mt-3 space-y-2">{data.detail.statusHistories.map((row, i) => <li key={i} className="border-l-2 border-blue-300 pl-3 text-sm">{statusLabels[row.status]} · {dateWib(row.createdAt)}</li>)}</ul></div><div><h3 className="font-bold">Tanggapan petugas</h3>{data.detail.comments.length === 0 && <p className="mt-2 text-sm text-slate-500">Belum ada tanggapan.</p>}<ul className="mt-3 space-y-3">{data.detail.comments.map((row, i) => <li key={i} className="rounded-lg bg-blue-50 p-3"><p className="text-xs text-slate-500">{dateWib(row.createdAt)}</p><p className="mt-1 whitespace-pre-wrap text-sm">{row.message}</p></li>)}</ul></div></article>}
  </section></main>;
}
