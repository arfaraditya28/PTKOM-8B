"use client";

import { useEffect, useState } from "react";

type Category = {
  id: string;
  name: string;
  description: string | null;
};

type CreateSuccess = {
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
      setResult(json as CreateSuccess);
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
          <button
            type="button"
            onClick={() => {
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
            max={new Date().toISOString().slice(0, 10)}
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

        {/* Upload Foto (nonaktif — segera hadir) */}
        <div className="pointer-events-none mx-14 mt-8 rounded-lg bg-[#F1F4F6] px-6 py-5 text-center opacity-60 select-none" aria-disabled="true">
        <span className="mb-2 inline-block rounded-full bg-[#D4E3FF] px-3 py-1 text-xs font-bold text-[#0F365F]">
          Segera hadir
        </span>
        <div className="mb-2 text-xl">
          <img
            src="/icon-upload.svg"
            alt="Upload"
            className="mx-auto w-12 h-10"
          />
        </div>

        <p className="text-lg font-semibold">
          Tarik foto kerusakan ke sini atau{" "}
          <span className="text-[#1960A3] underline">
            pilih dari galeri
          </span>
        </p>

        <p className="mt-1 text-sm">
          Sertakan foto bukti yang terang dan jelas agar petugas peninjau cepat mengidentifikasi lokasi.
        </p>
        </div>

        <div className="mt-6 flex items-start gap-2 text-left">
          <input
            type="checkbox"
            id="anonymous"
            name="anonymous"
            className="mt-1 accent-[#002041]"/>

        <div className="flex-1 text-left">
          <label htmlFor="anonymous" className="text-sm font-bold text-[#0F365F]">
            Rahasiakan Nama Saya (Anonim Publik)
          </label>

          <p className="mt-1 text-xs font-semibold text-black">
            Nama Anda disamarkan di halaman publik transparansi masyarakat,
            namun tercatat aman di sistem verifikasi internal.
          </p>
        </div>
        </div>

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
