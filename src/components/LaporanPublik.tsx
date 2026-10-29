"use client";
import { useEffect, useRef, useState } from "react";
import { useApi } from "@/src/hooks/useApi";
import { statusLabels, dateWib, buttonStyle } from "@/src/lib/client-api";
type List = { data: { reportNumber: string; publicTitle: string; publicSummary: string; status: string; createdAt: string; category: { name: string } }[]; pagination: { total: number; pages: number } };

function StatusSelect({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const options: [string, string][] = [["", "Semua status"], ...Object.entries(statusLabels)];
  const selectedLabel = value ? (statusLabels[value] ?? "Semua status") : "Semua status";

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
        id="statusFilter"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Filter status laporan"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg border-2 border-[#1960A3] bg-white px-3 py-2 text-left text-sm text-slate-900 transition-colors hover:bg-[#F5F7FB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1960A3] focus-visible:ring-offset-2"
      >
        <span className="truncate">{selectedLabel}</span>
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
          aria-label="Pilihan status laporan"
          className="absolute left-0 right-0 z-30 mt-1 max-h-64 overflow-auto rounded-lg border border-slate-300 bg-white py-1 shadow-lg"
        >
          {options.map(([key, label]) => (
            <li key={key || "all"} role="option" aria-selected={key === value}>
              <button
                type="button"
                onClick={() => {
                  onChange(key);
                  setOpen(false);
                }}
                className={`block w-full cursor-pointer px-3 py-2 text-left text-sm transition-colors hover:bg-[#F5F7FB] ${
                  key === value ? "bg-[#EAF2FB] font-semibold text-[#0F365F]" : "text-slate-900"
                }`}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function LaporanPublik() {
  const [page, setPage] = useState(1); const [status, setStatus] = useState("");
  const { data, error } = useApi<List>(`/api/public/reports?page=${page}&limit=10${status ? `&status=${status}` : ""}`);
  return <main className="bg-[#F1F1F1] px-6 py-10">
    <section className="mx-auto max-w-7xl rounded-2xl border border-slate-200 bg-white px-6 py-10 shadow-sm sm:px-10">
      <h1 className="text-3xl font-bold">Laporan Publik Warga</h1>
      <p className="mt-2 text-slate-600">Laporan yang telah diperiksa dan dipublikasikan admin. Identitas pelapor dan bukti tidak ditampilkan.</p>

      <div className="mt-6 flex flex-col gap-2 sm:w-80">
        <label htmlFor="statusFilter" className="text-sm font-semibold text-slate-700">Filter status</label>
        <StatusSelect value={status} onChange={(value) => { setStatus(value); setPage(1); }} />
      </div>

      {error && <p role="alert" className="mt-4 text-red-700">{error}</p>}
      {!data && !error && <p className="mt-4">Memuat laporan...</p>}
      {data?.data.length === 0 && <p className="mt-6 text-slate-500">Belum ada laporan publik untuk pilihan ini.</p>}
      <div className="mt-6 grid gap-4 md:grid-cols-2">{data?.data.map(r => <article key={r.reportNumber} className="rounded-xl border border-gray-200 p-5 shadow-sm transition-shadow hover:shadow-md"><div className="flex flex-wrap justify-between gap-2 text-xs"><span>{r.reportNumber}</span><span className="rounded-full bg-blue-100 px-3 py-1 text-blue-900">{statusLabels[r.status]}</span></div><p className="mt-2 text-xs text-slate-500">{r.category.name} · {dateWib(r.createdAt)}</p><h2 className="mt-3 text-lg font-bold">{r.publicTitle}</h2><p className="mt-2 whitespace-pre-wrap text-sm">{r.publicSummary}</p></article>)}</div>
      {data && <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm"><p>{data.pagination.total} laporan · Halaman {page} dari {Math.max(1, data.pagination.pages)}</p><div className="flex gap-3"><button className={`${buttonStyle} cursor-pointer transition hover:brightness-110`} disabled={page <= 1} onClick={() => setPage(n => n - 1)}>Sebelumnya</button><button className={`${buttonStyle} cursor-pointer transition hover:brightness-110`} disabled={page >= data.pagination.pages} onClick={() => setPage(n => n + 1)}>Selanjutnya</button></div></div>}
    </section>
  </main>;
}
