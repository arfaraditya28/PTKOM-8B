"use client";

import Image from "next/image";
import { useState } from "react";

const laporan = [
  {
    id: "#LAP-2024-0891",
    tanggal: "24 Okt 2024, 08:30",
    judul: "Jalan Penghubung Desa Giriklopomulyo Rusak",
    deskripsi: "Kedalaman lubang mencapai 15cm dan membahayakan...",
    kategori: "Infrastruktur",
    lokasi: "Desa Giriklopomulyo, Dusun 3",
    status: "Baru",
  },
  {
    id: "#LAP-2024-0887",
    tanggal: "23 Okt 2024, 19:15",
    judul: "Lampu Penerangan Jalan Umum (PJU) Padam",
    deskripsi: "Ada 4 titik lampu mati mengakibatkan rawan...",
    kategori: "Infrastruktur",
    lokasi: "Desa Sukorame, Depan Pasar",
    status: "Sedang Diproses",
  },
  {
    id: "#LAP-2024-0882",
    tanggal: "23 Okt 2024, 14:10",
    judul: "Permohonan Normalisasi Saluran Irigasi",
    deskripsi: "Debit air ke persawahan berkurang drastis...",
    kategori: "Kebersihan",
    lokasi: "Desa Tanjung Harapan, RT 04",
    status: "Sedang Diproses",
  },
  {
    id: "#LAP-2024-0879",
    tanggal: "22 Okt 2024, 10:45",
    judul: "Keluhan Antrean Pengurusan KTP-el dan KK",
    deskripsi: "Mesin pencetak sering offline saat jam pelayanan...",
    kategori: "Pelayanan Publik",
    lokasi: "Kantor Kecamatan Sekampung",
    status: "Selesai",
  },
  {
    id: "#LAP-2024-0865",
    tanggal: "21 Okt 2024, 16:20",
    judul: "Permintaan Bantuan Bibit Jagung Kelompok",
    deskripsi: "Pengajuan proposal subsidi bibit musim panen ke-3...",
    kategori: "Pertanian & Sosial",
    lokasi: "Desa Karyamukti, Sekampung",
    status: "Selesai",
  },
];

const warnaStatus: Record<string, string> = {
  Baru: "bg-blue-100 text-blue-700",
  "Sedang Diproses": "bg-slate-200 text-slate-800",
  Selesai: "bg-green-100 text-green-800",
};

export default function Laporan() {
  const [cari, setCari] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua Status");
  const [urutkan, setUrutkan] = useState("Terbaru (Waktu Masuk)");
  const [halaman, setHalaman] = useState(1);

  const hasilFilter = laporan.filter((item) => {
    const cocokCari = [
      item.id,
      item.judul,
      item.deskripsi,
      item.lokasi,
    ]
      .join(" ")
      .toLowerCase()
      .includes(cari.toLowerCase());

    const cocokStatus =
      filterStatus === "Semua Status" || item.status === filterStatus;

    return cocokCari && cocokStatus;
  });

  const dataTampil =
    urutkan === "Terlama (Waktu Masuk)"
      ? [...hasilFilter].reverse()
      : hasilFilter;

  return (
    <section className="mt-6 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 px-5 py-5">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">
              Laporan Terbaru Masuk
            </h2>
            <span className="rounded-full bg-[#D7E2FF] px-2 py-1 text-[10px] font-medium text-[#004591]">
              5 Terkini
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Daftar keluhan, usulan perbaikan, dan aspirasi masyarakat Sekampung
          </p>
        </div>

        <button
          type="button"
          onClick={() => setFilterStatus("Semua Status")}
          className="shrink-0 text-xs font-semibold text-blue-700 hover:text-blue-900"
        >
          Lihat Semua Laporan  →
        </button>
      </div>

      {/* Search dan filter */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#EFF4FF]-70 px-5 py-3">
        <div className="flex flex-wrap gap-2">
          <div className="flex w-64 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 focus-within:border-blue-400">
            <Image
                src="/icon-search-abu.svg"
                alt=""
                width={10}
                height={10}
                className="shrink-0 object-contain"
            />
            <input
                type="text"
                value={cari}
                onChange={(e) => {
                setCari(e.target.value);
                setHalaman(1);
                }}
                placeholder=" Cari ID laporan, judul, atau desa..."
                className="w-full min-w-0 bg-transparent text-xs outline-none"
            />
            </div>

          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setHalaman(1);
            }}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none"
          >
            <option>Semua Status</option>
            <option>Baru</option>
            <option>Sedang Diproses</option>
            <option>Selesai</option>
          </select>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-600">
          <label htmlFor="urutkan">Urutkan:</label>
          <select
            id="urutkan"
            value={urutkan}
            onChange={(e) => setUrutkan(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs outline-none"
          >
            <option>Terbaru (Waktu Masuk)</option>
            <option>Terlama (Waktu Masuk)</option>
          </select>
        </div>
      </div>

      {/* Tabel */}
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[900px] table-fixed text-left">
          <thead className="bg-[#EFF4FF] text-[10px] font-semibold uppercase tracking-wide text-slate-600">
            <tr>
              <th className="w-[17%] px-4 py-3">ID & Tanggal</th>
              <th className="w-[25%] px-4 py-3">Judul Laporan</th>
              <th className="w-[12%] px-4 py-3">Kategori</th>
              <th className="w-[18%] px-4 py-3">Lokasi Kejadian</th>
              <th className="w-[14%] px-4 py-3">Status</th>
              <th className="w-[14%] px-4 py-3 text-center">Tindakan</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-[11px]">
            {dataTampil.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <p className="font-semibold text-blue-700">{item.id}</p>
                  <p className="mt-1 text-[10px] text-slate-500">
                    {item.tanggal}
                  </p>
                </td>

                <td className="px-4 py-3">
                  <p className="truncate font-semibold text-slate-800">
                    {item.judul}
                  </p>
                  <p className="mt-1 truncate text-[10px] text-slate-500">
                    {item.deskripsi}
                  </p>
                </td>

                <td className="px-4 py-3">
                  <span className="inline-block rounded bg-blue-100 px-2 py-1 text-[10px] text-blue-800">
                    {item.kategori}
                  </span>
                </td>

                <td className="flex items-center gap-1 px-4 py-3 text-slate-700">
                  <img
                        src="/icon-lokasi.svg"
                        alt=""
                        className="h-3 w-3 object-contain"
                    />
                  {item.lokasi}
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-medium ${warnaStatus[item.status]}`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    {item.status}
                  </span>
                </td>

                <td className="px-4 py-3 text-center">
                  <button
                    type="button"
                    onClick={() => alert(`Detail laporan ${item.id}`)}
                    className="whitespace-nowrap rounded-md bg-blue-100 px-3 py-1 text-[10px] font-medium text-blue-800 hover:bg-blue-200"
                  >
                    Lihat Detail ↗
                  </button>
                </td>
              </tr>
            ))}

            {dataTampil.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                  Tidak ada laporan yang cocok.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 text-[10px] text-slate-500">
        <p>
          Menampilkan {dataTampil.length === 0 ? 0 : 1}-
          {dataTampil.length} dari 248 laporan warga
        </p>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={halaman === 1}
            onClick={() => setHalaman((prev) => Math.max(1, prev - 1))}
            className="rounded-md bg-slate-100 px-3 py-2 disabled:opacity-50"
          >
            Sebelumnya
          </button>
          <button
            type="button"
            className="rounded-md bg-blue-700 px-3 py-2 font-semibold text-white"
          >
            {halaman}
          </button>
          <button
            type="button"
            onClick={() => setHalaman((prev) => prev + 1)}
            className="rounded-md bg-blue-50 px-3 py-2 text-blue-800"
          >
            Selanjutnya
          </button>
        </div>
      </div>
    </section>
  );
}
