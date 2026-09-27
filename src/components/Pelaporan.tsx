"use client";

import { useState } from "react";

export default function Pelaporan() {
  const [laporanBerhasil, setLaporanBerhasil] = useState(false);

  return (
    <main className="min-h-screen bg-[#FFFFFF] px-6 py-10">

      {laporanBerhasil && (
        <div className="mx-auto mb-10 w-fit rounded border border-blue-300 px-4 py-2 text-sm font-semibold">
          Laporan Berhasil Dibuat!
        </div>
      )}

      <section className="mx-auto max-w-8xl text-center">
        <h1 className="text-2xl font-bold">
          Layanan Aspirasi dan Pengaduan Online Rakyat
        </h1>

        <p className="mt-1 text-sm">
          Sampaikan laporan Anda langsung kepada instansi pemerintah berwenang.
        </p>

        <h2 className="mt-12 text-xl font-bold">
          Sampaikan Laporan Anda
        </h2>

        <form className="mx-auto mt-6 max-w-5xl space-y-4">
        <div>
          <label className="mb-1 block text-left text-base font-bold text-[#0F365F]">
            Judul Laporan
          </label>
          <input type="text" className="w-full rounded-lg border-2 border-[#1960A3] px-3 py-0.5"/>
        </div>

        <div>
          <label className="mb-1 block text-left text-base font-bold text-[#0F365F]">
            Isi Laporan
          </label>
          <textarea rows={4} className="w-full rounded-lg border-2 border-[#1960A3] px-3 py-1.5"/>
        </div>

        <div>
          <label className="mb-1 block text-left text-base font-bold text-[#0F365F]">
            Tanggal Kejadian
          </label>
          <input type="date" className="w-full rounded-lg border-2 border-[#1960A3] px-3 py-0.5"/>
        </div>

        <div>
          <label className="mb-1 block text-left text-base font-bold text-[#0F365F]">
            Lokasi Kejadian
          </label>
          <input type="text" className="w-full rounded-lg border-2 border-[#1960A3] px-3 py-0.5"/>
        </div>

        <div>
          <label className="mb-1 block text-left text-base font-bold text-[#0F365F]">
              Instansi Tujuan
          </label>
          <input type="text"className="w-full rounded-lg border-2 border-[#1960A3] px-3 py-0.5"/>
        </div>

        <div>
          <label className="mb-1 block text-left text-base font-bold text-[#0F365F]">
            Kategori Tujuan
          </label>
          <input type="text" className="w-full rounded-lg border-2 border-[#1960A3] px-3 py-0.5"/>
        </div>

        {/* Upload Foto */}
        <div className=" mx-14 mt-8 rounded-lg bg-[#F1F4F6] px-6 py-5 text-center">
        <div className="mb-2 text-xl">
          <img
            src="icon-upload.svg"
            alt="Upload"
            className="mx-auto w-12 h-10"
          />
        </div>

        <p className="text-lg font-semibold">
          Tarik foto kerusakan ke sini atau{" "}
          <label className="cursor-pointer text-[#1960A3] underline transition hover:brightness-110">
            pilih dari galeri
          <input
            type="file"
            accept="image/*"
            className="hidden"/>
          </label>
        </p>

        <p className="mt-1 text-sm">
          Sertakan foto bukti yang terang dan jelas agar petugas peninjau cepat mengidentifikasi lokasi.
        </p>
        </div>
        </form>

        <div className="mt-6 ml-29 flex items-start gap-2">
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

        <button
          type="submit"
          className="mt-10 w-full max-w-[1020px] rounded-md bg-[#1960A3] py-1 text-sm font-bold tracking-[0.15em] 
          text-white shadow-[0_4px_6px_rgba(0,0,0,0.25)] transition hover:brightness-115 cursor-pointer">
            LAPOR
        </button>

      </section>

    </main>
  );
}