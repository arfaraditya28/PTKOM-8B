"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Category = {
  id: string;
  name: string;
  description: string | null;
};

type CreateSuccess = {
  id: string;
  uploadToken: string;
  reportNumber: string;
  trackingCode: string;
};

const initialForm = {
  title: "",
  description: "",
  incidentDate: "",
  location: "",
  agency: "",
  categoryId: "",
  reporterName: "",
  reporterContact: "",
};

export default function Pelaporan() {
  const [form, setForm] = useState(initialForm);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<CreateSuccess | null>(null);
  const [today] = useState(() => new Date(Date.now() + 7 * 3600000).toISOString().slice(0, 10));
  const [files, setFiles] = useState<File[]>([]);
  const [uploadMessage, setUploadMessage] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/categories", { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) throw new Error("Gagal memuat kategori.");
        const json = (await res.json()) as { data: Category[] };
        setCategories(json.data);
      })
      .catch(() => setCategoriesError("Kategori gagal dimuat. Coba muat ulang halaman."));
  }, []);

  function set<K extends keyof typeof initialForm>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function uploadFiles(report: CreateSuccess, pending: File[]) {
    const failed: File[] = [];
    for (const file of pending) {
      try {
        const body = new FormData(); body.append("file", file);
        const response = await fetch(`/api/reports/${report.id}/attachments`, {
          method: "POST", headers: { Authorization: `Bearer ${report.uploadToken}` }, body,
        });
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error || "Unggahan gagal.");
      } catch { failed.push(file); }
    }
    setFiles(failed);
    setUploadMessage(failed.length ? `${failed.length} bukti belum terunggah. Laporan sudah tersimpan; coba unggah ulang tanpa membuat laporan baru. Jika token sudah kedaluwarsa, hubungi petugas.` : pending.length ? "Semua bukti berhasil diunggah." : "");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          agency: form.agency.trim() === "" ? undefined : form.agency.trim(),
        }),
      });
      const json = (await res.json()) as
        | CreateSuccess
        | { error: string; details?: unknown };
      if (!res.ok) {
        throw new Error(
          "error" in json ? json.error : "Gagal mengirim laporan."
        );
      }
      const created = json as CreateSuccess;
      setResult(created);
      await uploadFiles(created, files);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Gagal mengirim laporan."
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function copy(text: string, key: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      setCopied(null);
    }
  }

  if (result) {
    return (
      <main className="min-h-screen bg-[#FFFFFF] px-6 py-10">
        <section className="mx-auto max-w-5xl text-center">
          <div className="mx-auto w-fit rounded border border-green-300 bg-green-50 px-4 py-2 text-sm font-semibold text-green-800">
            Laporan Berhasil Dibuat!
          </div>
          <h1 className="mt-6 text-2xl font-bold">
            Simpan Nomor Laporan Anda
          </h1>
          <p className="mt-1 text-sm">
            Gunakan kode tracking untuk memantau status laporan.
          </p>
          <div className="mx-auto mt-6 max-w-xl space-y-3 rounded-lg border-2 border-[#1960A3] p-6 text-left">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-gray-500">Nomor Laporan</p>
                <p className="text-lg font-bold">{result.reportNumber}</p>
              </div>
              <button
                type="button"
                onClick={() => copy(result.reportNumber, "number")}
                className="rounded-md bg-[#F1F4F6] px-3 py-1.5 text-xs font-bold text-[#0F365F] hover:brightness-95"
              >
                {copied === "number" ? "Tersalin!" : "Salin"}
              </button>
            </div>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-gray-500">Kode Tracking</p>
                <p className="text-lg font-bold">{result.trackingCode}</p>
              </div>
              <button
                type="button"
                onClick={() => copy(result.trackingCode, "tracking")}
                className="rounded-md bg-[#F1F4F6] px-3 py-1.5 text-xs font-bold text-[#0F365F] hover:brightness-95"
              >
                {copied === "tracking" ? "Tersalin!" : "Salin"}
              </button>
            </div>
          </div>
          {submitting && <p className="mt-4" role="status">Mengunggah bukti, tunggu sampai selesai...</p>}
          {uploadMessage && <p role="status" className="mx-auto mt-4 max-w-xl text-sm">{uploadMessage}</p>}
          {files.length > 0 && !submitting && <button type="button" onClick={async () => {
            setSubmitting(true); try { await uploadFiles(result, files); } finally { setSubmitting(false); }
          }} className="mt-4 rounded bg-blue-100 px-4 py-2 text-blue-800">Coba unggah bukti lagi</button>}
          <Link href="/tracking" className="mt-5 block text-blue-700 underline">Lacak laporan dengan kode tracking</Link>
          <button
            type="button"
            disabled={submitting}
            onClick={() => {
              setFiles([]); setUploadMessage("");
              setForm(initialForm);
              setResult(null);
            }}
            className="mt-6 rounded-md bg-[#1960A3] px-6 py-2 text-sm font-bold text-white shadow transition hover:brightness-110"
          >
            Buat Laporan Lain
          </button>
        </section>
      </main>
    );
  }

  const inputClass =
    "w-full rounded-lg border-2 border-[#1960A3] px-3 py-0.5";

  return (
    <main className="min-h-screen bg-[#FFFFFF] px-6 py-10">
      <section className="mx-auto max-w-5xl text-center">
        <h1 className="text-2xl font-bold">
          Layanan Aspirasi dan Pengaduan Online Rakyat
        </h1>

        <p className="mt-1 text-sm">
          Sampaikan laporan Anda langsung kepada instansi pemerintah berwenang.
        </p>

        <h2 className="mt-12 text-xl font-bold">
          Sampaikan Laporan Anda
        </h2>

        <form onSubmit={handleSubmit} className="mx-auto mt-6 max-w-5xl space-y-4">
        <div>
          <label className="mb-1 block text-left text-base font-bold text-[#0F365F]">
            Judul Laporan
          </label>
          <input
            type="text"
            required
            minLength={5}
            maxLength={200}
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            className={inputClass}/>
        </div>

        <div>
          <label className="mb-1 block text-left text-base font-bold text-[#0F365F]">
            Isi Laporan
          </label>
          <textarea
            rows={4}
            maxLength={10000}
            required
            minLength={10}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            className="w-full rounded-lg border-2 border-[#1960A3] px-3 py-1.5"/>
        </div>

        <div>
          <label className="mb-1 block text-left text-base font-bold text-[#0F365F]">
            Tanggal Kejadian
          </label>
          <input
            type="date"
            required
            max={today}
            value={form.incidentDate}
            onChange={(e) => set("incidentDate", e.target.value)}
            className={inputClass}/>
        </div>

        <div>
          <label className="mb-1 block text-left text-base font-bold text-[#0F365F]">
            Lokasi Kejadian
          </label>
          <input
            type="text"
            required
            minLength={3}
            maxLength={500}
            value={form.location}
            onChange={(e) => set("location", e.target.value)}
            className={inputClass}/>
        </div>

        <div>
          <label className="mb-1 block text-left text-base font-bold text-[#0F365F]">
              Instansi Tujuan
          </label>
          <input
            type="text"
            required
            maxLength={200}
            placeholder="Contoh: Dinas PUPR"
            value={form.agency}
            onChange={(e) => set("agency", e.target.value)}
            className={inputClass}/>
        </div>

        <div>
          <label className="mb-1 block text-left text-base font-bold text-[#0F365F]">
            Kategori Laporan
          </label>
          <select
            required
            value={form.categoryId}
            onChange={(e) => set("categoryId", e.target.value)}
            className={`${inputClass} py-1.5`}>
            <option value="" disabled>
              {categoriesError ?? "Pilih kategori"}
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {categoriesError && (
            <p className="mt-1 text-left text-xs font-semibold text-red-600">
              {categoriesError}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-left text-base font-bold text-[#0F365F]">
            Nama Pelapor
          </label>
          <input
            type="text"
            required
            minLength={2}
            maxLength={100}
            value={form.reporterName}
            onChange={(e) => set("reporterName", e.target.value)}
            className={inputClass}/>
        </div>

        <div>
          <label className="mb-1 block text-left text-base font-bold text-[#0F365F]">
            No HP Pelapor
          </label>
          <input
            type="tel"
            required
            minLength={9}
            maxLength={20}
            placeholder="Contoh: 08123456789"
            value={form.reporterContact}
            onChange={(e) => set("reporterContact", e.target.value)}
            className={inputClass}/>
        </div>

        <div className="mt-8 rounded-lg bg-[#F1F4F6] px-6 py-5 text-left">
          <label htmlFor="evidence" className="block text-lg font-semibold">Bukti pendukung (opsional)</label>
          <p className="mt-1 text-sm">Pilih maksimal 3 file PNG, JPEG, atau PDF; maksimal 5 MB per file. Bukti hanya dapat dilihat petugas.</p>
          <input id="evidence" type="file" multiple accept="image/png,image/jpeg,application/pdf" className="mt-3 max-w-full text-sm" onChange={event => {
            const selected = Array.from(event.target.files || []);
            if (selected.length > 3 || selected.some(file => file.size > 5 * 1024 * 1024)) {
              setSubmitError("Pilih maksimal 3 file, masing-masing maksimal 5 MB."); event.target.value = ""; setFiles([]); return;
            }
            setSubmitError(null); setFiles(selected);
          }} />
        </div>
        <p className="text-left text-xs text-slate-600">Nama, kontak, lokasi lengkap, dan bukti tersimpan untuk petugas. Laporan baru tidak langsung tampil publik. Admin hanya mempublikasikan judul dan ringkasan yang telah diperiksa tanpa identitas warga.</p>

        {submitError && (
          <p className="rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-left text-sm font-semibold text-red-700">
            {submitError}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-10 w-full max-w-[1020px] rounded-md bg-[#1960A3] py-1 text-sm font-bold tracking-[0.15em]
          text-white shadow-[0_4px_6px_rgba(0,0,0,0.25)] transition hover:brightness-115 cursor-pointer disabled:opacity-60">
            {submitting ? "MENGIRIM..." : "LAPOR"}
        </button>
        </form>

      </section>

    </main>
  );
}
