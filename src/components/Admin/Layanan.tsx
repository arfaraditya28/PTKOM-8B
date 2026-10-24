
import Image from "next/image";

export default function Layanan() {
  return (
    <section className="flex items-center justify-between gap-4 rounded-2xl border border-[#D3E4FE] bg-[#EFF4FF] p-5 shadow-sm">
      {/* Ikon dan informasi di kiri */}
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white">
          <Image
            src="/icon-peringatan.svg"
            alt=""
            width={16}
            height={16}
            className="h-4 w-4 object-contain"
          />
        </div>

        <div className="min-w-0">
          <h2 className="text-base font-bold text-slate-800">
            Perhatian: Verifikasi Cepat Diperlukan
          </h2>

          <p className="max-w-md text-[13px] text-slate-500">
            Terdapat 4 laporan baru yang belum ditindak lanjuti lebih dari 3 hari kerja. Mohon segera periksa validitas
            berkan dan diposisikan ke Kasi terkait.
          </p>
        </div>
      </div>

      {/* Tombol di kanan, sejajar di tengah */}
      <button
        type="button"
        className="flex shrink-0 items-center gap-2 rounded-lg bg-white px-4 py-2 text-[13px] font-semibold text-[#005CBD] transition hover:bg-blue-400 transition hover:text-white"
      >
        Lihat 4 Laporan Menunggu
        <span aria-hidden="true">→</span>
      </button>
    </section>
  );
}
