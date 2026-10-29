"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

function LaporanHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white">
      <div className="flex w-full items-center justify-between gap-4 px-6 py-4 sm:px-10 lg:px-14">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <Image
            src="/logo-sekampung.png"
            alt="Logo Kecamatan Sekampung"
            width={56}
            height={64}
            className="h-11 w-auto shrink-0 sm:h-14"
            priority
          />
          <span className="flex min-w-0 flex-col leading-tight text-left">
            <span className="truncate text-base font-extrabold tracking-tight text-black sm:text-2xl">
              Kecamatan Sekampung
            </span>
            <span className="truncate text-xs text-black sm:text-sm">
              Portal Layanan Publik
            </span>
          </span>
        </Link>
        <Link
          href="/"
          className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg border-2 border-[#1960A3] px-3 py-2 text-xs font-semibold text-[#1960A3] transition-colors hover:bg-[#1960A3] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1960A3] focus-visible:ring-offset-2 sm:px-4 sm:text-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path d="M19 12H5" />
            <path d="m12 19-7-7 7-7" />
          </svg>
          Kembali ke Beranda
        </Link>
      </div>
    </header>
  );
}

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

function CategorySelect({
  value,
  onChange,
  categories,
  error,
}: {
  value: string;
  onChange: (id: string) => void;
  categories: Category[];
  error: string | null;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selected = categories.find((c) => c.id === value);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Kategori Laporan"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg border-2 border-[#1960A3] bg-white px-3 py-2 text-left text-sm text-slate-900 transition-colors hover:bg-[#F5F7FB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1960A3] focus-visible:ring-offset-2"
      >
        <span className={selected ? "truncate" : "truncate text-slate-500"}>
          {selected?.name ?? (error ?? "Pilih kategori")}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`h-4 w-4 shrink-0 text-[#1960A3] transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open && (
        <ul
          role="listbox"
          aria-label="Pilihan kategori laporan"
          className="absolute left-0 right-0 z-30 mt-1 max-h-64 overflow-auto rounded-lg border border-slate-300 bg-white py-1 shadow-lg"
        >
          {categories.length === 0 && (
            <li className="px-3 py-2 text-sm text-slate-500">
              {error ?? "Kategori belum tersedia."}
            </li>
          )}
          {categories.map((c) => (
            <li key={c.id} role="option" aria-selected={c.id === value}>
              <button
                type="button"
                onClick={() => {
                  onChange(c.id);
                  setOpen(false);
                }}
                className={`block w-full cursor-pointer px-3 py-2 text-left text-sm transition-colors hover:bg-[#F5F7FB] ${
                  c.id === value ? "bg-[#EAF2FB] font-semibold text-[#0F365F]" : "text-slate-900"
                }`}
              >
                {c.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Pelaporan() {
  const [form, setForm] = useState(initialForm);  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<CreateSuccess | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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
    if (!form.categoryId) {
      setSubmitError("Pilih kategori laporan terlebih dahulu.");
      return;
    }
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
      <>
        <LaporanHeader />
        <main className="min-h-screen bg-[#F1F1F1] px-6 py-10">
        <section className="mx-auto max-w-7xl rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center shadow-sm sm:px-10">
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
      </>
    );
  }

  const inputClass =
    "w-full rounded-lg border-2 border-[#1960A3] px-3 py-2";

  return (
    <>
      <LaporanHeader />
      <main className="min-h-screen bg-[#F1F1F1] px-6 py-10">
      <section className="mx-auto max-w-7xl rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center shadow-sm sm:px-10">
        <h1 className="text-2xl font-bold">
          Layanan Aspirasi dan Pengaduan Online Rakyat
        </h1>

        <p className="mt-1 text-sm">
          Sampaikan laporan Anda langsung kepada instansi pemerintah berwenang.
        </p>

        <h2 className="mt-12 text-xl font-bold">
          Sampaikan Laporan Anda
        </h2>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
            placeholder="Contoh: Jalan rusak di depan SD Negeri 1"
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
            placeholder="Jelaskan kronologi, dampak, dan detail kejadian secara jelas."
            className="w-full rounded-lg border-2 border-[#1960A3] px-3 py-2"/>
        </div>

        <div className="grid gap-4 text-left sm:grid-cols-2">
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
            placeholder="Contoh: Jl. Raya Sekampung, Desa Sumbergede"
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
          <CategorySelect
            value={form.categoryId}
            onChange={(id) => set("categoryId", id)}
            categories={categories}
            error={categoriesError}
          />
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
            placeholder="Contoh: Arfa Raditya"
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
        </div>

        <div className="mt-8 rounded-lg bg-[#F1F4F6] px-6 py-5 text-center">
          <p className="block text-lg font-semibold">Bukti pendukung (opsional)</p>
          <p className="mt-1 text-sm">Pilih maksimal 3 file PNG, JPEG, atau PDF; maksimal 5 MB per file. Bukti hanya dapat dilihat petugas.</p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (fileInputRef.current) fileInputRef.current.value = "";
                fileInputRef.current?.click();
              }}
              className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-[#1960A3] px-4 py-2 text-sm font-bold text-white shadow transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1960A3] focus-visible:ring-offset-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <path d="m17 8-5-5-5 5" />
                <path d="M12 3v12" />
              </svg>
              {files.length ? "Ganti File" : "Pilih File"}
            </button>
            <span className="text-xs text-slate-600">
              {files.length ? `${files.length} file dipilih` : "PNG, JPG, atau PDF"}
            </span>
          </div>
          <input
            ref={fileInputRef}
            id="evidence"
            type="file"
            multiple
            tabIndex={-1}
            accept="image/png,image/jpeg,application/pdf"
            className="sr-only"
            onChange={event => {
              const selected = Array.from(event.target.files || []);
              if (selected.length > 3 || selected.some(file => file.size > 5 * 1024 * 1024)) {
                setSubmitError("Pilih maksimal 3 file, masing-masing maksimal 5 MB."); event.target.value = ""; setFiles([]); return;
              }
              setSubmitError(null); setFiles(selected);
            }}
          />
          {files.length > 0 && (
            <ul className="mt-3 space-y-1 text-sm">
              {files.map((file, index) => (
                <li key={`${file.name}-${file.size}-${index}`} className="flex flex-wrap items-center justify-between gap-2 rounded border border-slate-200 bg-white px-3 py-1.5">
                  <span className="truncate">{file.name}</span>
                  <span className="text-xs text-slate-500">{(file.size / 1024).toFixed(0)} KB</span>
                </li>
              ))}
            </ul>
          )}
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
    </>
  );
}
