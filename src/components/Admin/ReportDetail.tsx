"use client";
import { useState } from "react";
import { useApi } from "@/src/hooks/useApi";
import { useSession } from "./Session";
import { requestJson, jsonOptions, statusLabels, dateWib, inputStyle, buttonStyle } from "@/src/lib/client-api";

type Report = {
  id: string; reportNumber: string; title: string; description: string; location: string; agency: string | null;
  reporterName: string; reporterContact: string; incidentDate: string; status: string; trackingCode: string;
  isPublic: boolean; publicTitle: string | null; publicSummary: string | null;
  attachments: { id: string; fileName: string; size: number | null }[];
  comments: { id: string; message: string; createdAt: string; user: { name: string } }[];
  statusHistories: { id: string; status: string; note: string | null; createdAt: string; user: { name: string } | null }[];
};
const transitions: Record<string, string[]> = { DIAJUKAN: ["DIVERIFIKASI", "DITOLAK"], DIVERIFIKASI: ["DIPROSES", "DITOLAK"], DIPROSES: ["SELESAI", "DITOLAK"], SELESAI: [], DITOLAK: [] };

export default function ReportDetail({ id, close, updated }: { id: string; close: () => void; updated: () => void }) {
  const user = useSession();
  const [revision, setRevision] = useState(0);
  const { data, error } = useApi<{ data: Report }>(`/api/reports/${id}`, revision);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const report = data?.data;
  async function mutation(path: string, options: RequestInit) {
    setBusy(true); setMessage("");
    try { await requestJson(path, options); setMessage("Perubahan tersimpan."); setRevision(n => n + 1); updated(); return true; }
    catch (e) { setMessage(e instanceof Error ? e.message : "Permintaan gagal."); return false; }
    finally { setBusy(false); }
  }
  async function status(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = new FormData(event.currentTarget);
    await mutation(`/api/reports/${id}/status`, jsonOptions("PATCH", { status: form.get("status"), ...(form.get("note") ? { note: form.get("note") } : {}) }));
  }
  async function comment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); const formElement = event.currentTarget; const form = new FormData(formElement);
    if (await mutation(`/api/reports/${id}/comments`, jsonOptions("POST", { message: form.get("message") }))) formElement.reset();
  }
  async function upload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); const element = event.currentTarget;
    if (await mutation(`/api/reports/${id}/attachments`, { method: "POST", body: new FormData(element) })) element.reset();
  }
  async function visibility(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = new FormData(event.currentTarget); const isPublic = form.has("isPublic");
    await mutation(`/api/reports/${id}/visibility`, jsonOptions("PATCH", { isPublic, ...(isPublic ? { publicTitle: form.get("publicTitle"), publicSummary: form.get("publicSummary") } : {}) }));
  }
  return <section aria-label="Detail laporan" className="mt-6 rounded-xl border-2 border-blue-200 bg-slate-50 p-5">
    <div className="flex items-center justify-between gap-3"><h3 className="text-lg font-bold">Detail {report?.reportNumber}</h3><button onClick={close} className="rounded border px-4 py-2 text-sm">Tutup detail</button></div>
    {(error || message) && <p role="status" className="my-3 text-sm">{error || message}</p>}
    {!report && !error && <p>Memuat detail...</p>}
    {report && <div className="mt-4 space-y-6">
      <div><h4 className="font-bold">{report.title}</h4><p className="mt-2 whitespace-pre-wrap">{report.description}</p><dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2"><div><dt className="font-semibold">Status</dt><dd>{statusLabels[report.status]}</dd></div><div><dt className="font-semibold">Tanggal kejadian</dt><dd>{new Date(report.incidentDate).toLocaleDateString("id-ID", { timeZone: "UTC" })}</dd></div><div><dt className="font-semibold">Pelapor (internal)</dt><dd>{report.reporterName} · {report.reporterContact}</dd></div><div><dt className="font-semibold">Lokasi / instansi</dt><dd>{report.location} / {report.agency || "—"}</dd></div></dl></div>
      <div><h4 className="font-bold">Bukti pendukung</h4><ul className="mt-2 space-y-2 text-sm">{report.attachments.map(file => <li key={file.id} className="flex flex-wrap gap-4"><a href={`/api/attachments/${file.id}`} className="text-blue-700 underline">Unduh {file.fileName}</a>{user.role === "ADMIN" && <button disabled={busy} className="text-red-700" onClick={() => { if (window.confirm("Hapus bukti ini?")) void mutation(`/api/attachments/${file.id}`, jsonOptions("DELETE")); }}>Hapus</button>}</li>)}</ul>{!report.attachments.length && <p className="text-sm text-slate-500">Belum ada bukti.</p>}
        {!!transitions[report.status]?.length && <form onSubmit={upload} className="mt-3 flex flex-wrap gap-3"><input aria-label="File bukti" type="file" name="file" accept="image/png,image/jpeg,application/pdf" required className="max-w-full text-sm" /><button disabled={busy || report.attachments.length >= 3} className={buttonStyle}>Unggah bukti</button><p className="w-full text-xs text-slate-500">PNG/JPEG/PDF, maksimal 5 MB per file dan 3 file per laporan.</p></form>}
      </div>
      <div><h4 className="font-bold">Riwayat proses</h4><ul className="mt-2 space-y-2 text-sm">{report.statusHistories.map(row => <li key={row.id} className="border-l-2 border-blue-300 pl-3"><p>{statusLabels[row.status]} · {dateWib(row.createdAt)} · {row.user?.name || "Sistem"}</p>{row.note && <p className="text-slate-500">Catatan internal: {row.note}</p>}</li>)}</ul></div>
      {!!transitions[report.status]?.length && <form onSubmit={status} className="space-y-3"><h4 className="font-bold">Ubah status</h4><select name="status" aria-label="Status berikutnya" className={inputStyle}>{transitions[report.status].map(s => <option key={s} value={s}>{statusLabels[s]}</option>)}</select><label className="block text-sm">Catatan internal (wajib untuk penolakan)<textarea name="note" maxLength={500} className={inputStyle} /></label><button disabled={busy} className={buttonStyle}>Simpan status</button></form>}
      <div><h4 className="font-bold">Tanggapan untuk warga</h4><ul className="mt-2 space-y-3 text-sm">{report.comments.map(c => <li key={c.id}><p className="font-semibold">{c.user.name} · {dateWib(c.createdAt)}</p><p className="whitespace-pre-wrap">{c.message}</p></li>)}</ul><form onSubmit={comment} className="mt-3 space-y-3"><label className="block text-sm">Tanggapan ini terlihat oleh pemegang kode tracking. Hindari data pribadi.<textarea name="message" required maxLength={2000} className={inputStyle} /></label><button disabled={busy} className={buttonStyle}>Kirim tanggapan</button></form></div>
      {user.role === "ADMIN" && <form onSubmit={visibility} className="space-y-3 border-t pt-5"><h4 className="font-bold">Publikasi laporan</h4><p className="text-sm">Tulis judul dan ringkasan yang sudah diperiksa agar tidak memuat identitas warga. Bukti dan kontak tetap privat.</p><label className="block text-sm"><input name="isPublic" type="checkbox" defaultChecked={report.isPublic} /> Tampilkan pada daftar publik</label><label className="block text-sm">Judul publik<input name="publicTitle" maxLength={200} defaultValue={report.publicTitle || ""} className={inputStyle} /></label><label className="block text-sm">Ringkasan publik<textarea name="publicSummary" maxLength={1000} defaultValue={report.publicSummary || ""} className={inputStyle} /></label><button disabled={busy} className={buttonStyle}>Simpan publikasi</button></form>}
    </div>}
  </section>;
}
