import Link from "next/link";

export default function LaporanPublik() {
  return (
    <main className="min-h-screen bg-[#FFFFFF] px-6 py-10">
    <section className="mx-auto mt-15 max-w-6xl px-4">

      <div className="-ml-3 mb-2 inline-flex rounded-full bg-[#86F2E4]/40 px-3 py-1 text-xs font-medium text-[#006F66]">
        <img
            src="icon-dunia.svg"
            alt="Icon Dunia"
            className="mr-1 h-4 w-4"
        />
            Feed Aspirasi Terbuka
      </div>

      <div className="-mt-1 flex items-start justify-between gap-6">
        <div className="-ml-4">
          <h2 className="text-[34px] font-bold">
            Laporan Publik Warga
          </h2>

          <p className="max-w-4xl text-lg">
            Pantau keterbukaan aspirasi dan permasalahan yang disampaikan oleh
            warga Kecamatan Sekampung secara transparan.
          </p>
        </div>

        <Link
          href="/"
          className="mt-11 mr-1 rounded-lg bg-[#002853] px-6 py-2 font-semibold text-white shadow-[0_4px_6px_rgba(0,0,0,0.25)] 
          transition hover:brightness-130 cursor-pointer"
        >
          Beranda
        </Link>
      </div>

      <div className="mt-8 inline-flex">
        <button
          type="button"
          className="-ml-4 inline-flex rounded-2xl bg-[#002853] px-3 py-1 text-[11px] font-semibold text-white transition 
          hover:brightness-130 cursor-pointer">
          <img
            src="icon.svg"
            alt="Icon"
            className="mr-1.5 h-4 w-2.5"/>
          Semua Laporan
          <div className="ml-1 bg-[#0F3E74] rounded-2xl px-2">
            128
          </div>
        </button>

        <div className="ml-6.5 flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-[#FFB77D]"></div>
          <span className="text-[11px] font-medium text-[#002853]">
            Belum Selesai / Sedang Diproses 
          </span>
          <div className=" bg-[#FFDCC3] rounded-2xl px-1.5 h-4 text-[11px] font-bold text-[#2F1500]">
            18
          </div>
        </div>

        <div className="ml-6.5 flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-[#006A61]"></div>
          <span className="text-[11px] font-medium text-[#002853]">
            Sudah Selesai Ditangani
          </span>
          <div className=" bg-[#86F2E4] rounded-2xl px-1.5 h-4 text-[11px] font-bold text-[#006F66]">
            110
          </div>
        </div>
      </div>

    
      {/* Daftar Laporan Publik */}
      <div className="mt-5 -ml-4 grid grid-cols-1 gap-4 md:grid-cols-2">

        {/* Kartu 1: Laporan jalan selesai */}
        <article className=" h-fit self-start rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D8E5FF] text-xs font-bold text-[#002853]">
                BS
              </div>
              <div>
                <p className="text-xs font-semibold text-black">Budi S.</p>
                <p className="text-[10px] text-gray-500">2 hari lalu</p>
              </div>
            </div>

            <span className="rounded-full bg-[#86F2E4] px-2 py-1 text-[8px] font-bold text-[#006F66]">
              ✓ Selesai Ditangani
            </span>
          </div>

          <span className=" rounded-sm bg-gray-100 px-2 py-0.5 text-[9px] text-[#002853]">
            Infrastruktur Jalan
          </span>

          <h3 className="text-[14px] text-base font-bold text-black">
            Perbaikan Lubang Jalan Donomulyo
          </h3>

          <p className=" text-xs leading-relaxed text-gray-700">
            Aspal ambles cukup dalam membahayakan pengendara motor saat malam hari.
          </p>

          <div className="mt-2 grid grid-cols-2 gap-1">
            <div className="relative h-24 overflow-hidden rounded-md">
              <img
                src="foto-kondisi-awal.png"
                alt="Kondisi jalan sebelum diperbaiki"
                className="h-full w-full object-cover"/>
              <span className="absolute bottom-0 left-0 w-full bg-black/50 p-1 text-[10px] text-white">
                Sebelum
              </span>
            </div>

          <div className="relative h-24 overflow-hidden rounded-md">
            <img
              src="foto-kondisi-perbaikan.png"
              alt="Kondisi jalan setelah diperbaiki"
              className="h-full w-full object-cover"/>
            <span className="absolute bottom-0 left-0 w-full bg-black/50 p-1 text-[10px] text-white">
              Telah Ditambal
            </span>
          </div>
        </div>

          <div className="mt-2 rounded-md border-l-[3px] border-[#00877A] bg-[#E6FBF8] p-2">
            <p className="text-[10px] font-bold text-[#006F66]">
              ✓ Tanggapan Resmi Seksi Pembangunan:
            </p>
            <p className="mt-1 text-xs text-gray-800">
              “Terima kasih, tim pemeliharaan jalan telah selesai menambal dan meratakan permukaan jalan pada 24 Okt 2026.”
            </p>
          </div>

          <div className="mt-2 flex justify-between gap-2 text-[10px] text-[#006F66]">
            <span>👍 14 Warga mendukung penyelesaian ini</span>
            <span className="shrink-0 text-gray-600">2 Hari Selesai</span>
          </div>
        </article>

        {/* Kartu 2: Laporan sampah diproses */}
        <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#86F2E4] text-xs font-bold text-[#006F66]">
                SR
              </div>
              <div>
                <p className="text-xs font-semibold text-black">Siti Rahma</p>
                <p className="text-[10px] text-gray-500">Kemarin</p>
              </div>
            </div>

            <span className="rounded-full bg-[#D8E5FF] px-2 py-1 text-[8px] font-bold text-[#002853]">
              ♧ Sedang Ditangani
            </span>
          </div>

          <span className="rounded-sm bg-gray-100 px-2 py-0.5 text-[9px] text-[#002853]">
            Kebersihan &amp; Lingkungan
          </span>

          <h3 className="text-[14px] text-base font-bold text-black">
            Tumpukan Sampah Liar di Pinggir Saluran Irigasi RT 04
          </h3>

          <p className=" text-xs leading-relaxed text-gray-700">
            Sampah menyumbat aliran air saat hujan lebat, butuh pengangkutan armada truk sampah kecamatan segera.
          </p>

          <div className="relative mt-2 h-24 overflow-hidden rounded-md">
            <img
              src="foto-tumpukan-sampah.png"
              alt="Tumpukan sampah di pinggir saluran irigasi"
              className="h-full w-full object-cover"/>
            <span className="absolute bottom-0 left-0 w-full bg-black/50 p-1 text-[10px] text-white">
              Lokasi Irigasi RT 04
            </span>
          </div>

          <div className="mt-2 rounded-md border-l-[3px] border-[#002853] bg-[#EEF4FF] p-2">
            <p className="text-[10px] font-bold text-[#002853]">
              ↳ Tanggapan Seksi Lingkungan:
            </p>
            <p className="mt-1 text-xs text-gray-800">
              “Petugas lapangan telah menjadwalkan armada truk sampah untuk pembersihan esok pagi pukul 08.00 WIB.”
            </p>
          </div>

          <div className="mt-2 flex justify-between gap-2 text-[10px] text-[#002853]">
            <span>📣 28 Warga terdampak mendukung</span>
            <span className="shrink-0 text-gray-600">Diproses</span>
          </div>
        </article>

        {/* Kartu 3: Menunggu verifikasi */}
        <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm text-gray-600">
                <img
                  src="icon-profile.svg"
                  alt="Warga Anonim"
                  className="h-2.5 w-2.5 object-contain"/>
              </div>
              <div>
                <p className="text-xs font-semibold text-black">
                  Warga Anonim <span className="font-normal text-gray-600">(Identitas Dirahasiakan)</span>
                </p>
                <p className="text-[10px] text-gray-500">3 jam lalu</p>
              </div>
            </div>

            <span className="rounded-full bg-[#FFDCC3] px-2 py-0.5 text-[8px] font-bold text-[#2F1500]">
              Menunggu Verifikasi
            </span>
          </div>

          <span className="rounded-sm bg-gray-100 px-2 py-0.5 text-[9px] text-[#002853]">
            Fasilitas Umum
          </span>

          <h3 className="text-[14px] text-base font-bold text-black">
            Lampu Penerangan Jalan Padam di Tanjakan Hargomulyo
          </h3>

          <p className="mt-1 text-xs leading-relaxed text-gray-700">
            Sudah 3 malam lampu penerangan mati total, rawan kecelakaan di tikungan tajam bagi kendaraan yang melintas.
          </p>

          <div className="mt-2 rounded-md border-l-[3px] border-[#754000] bg-gray-100 p-2">
            <p className="text-xs text-gray-800">⌛ Status: Menunggu peninjauan.</p>
          </div>

          <div className="mt-2 flex justify-between text-[10px] text-gray-600">
            <span>◉ 7 Warga melihat</span>
            <span>Verifikasi &lt; 24 Jam</span>
          </div>
        </article>

        {/* Kartu 4: Menunggu verifikasi */}
        <article className="h-fit self-start rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm text-gray-600">
                <img
                  src="icon-profile.svg"
                  alt="Warga Anonim"
                  className="h-2.5 w-2.5 object-contain"/>
              </div>
              <div>
                <p className="text-xs font-semibold text-black">
                  Warga Anonim <span className="font-normal text-gray-600">(Identitas Dirahasiakan)</span>
                </p>
                <p className="text-[10px] text-gray-500">11 jam lalu</p>
              </div>
            </div>

            <span className="rounded-full bg-[#FFDCC3] px-2 py-0.5 text-[8px] font-semibold text-[#2F1500]">
              Menunggu Verifikasi
            </span>
          </div>

          <span className="rounded-sm bg-gray-100 px-2 py-0.5 text-[9px] text-[#002853]">
            Fasilitas Umum
          </span>

          <h3 className="text-[14px] text-base font-bold text-black">
            Tiang Listrik Roboh di Desa Sukarame
          </h3>

          <p className="mt-1 text-xs leading-relaxed text-gray-700">
            Tiang listrik roboh dan membahayakan pengguna jalan.
          </p>

          <div className="mt-2 rounded-md border-l-[3px] border-[#754000] bg-gray-100 p-2">
            <p className="text-xs text-gray-800">⌛ Status: Menunggu peninjauan.</p>
          </div>

          <div className="mt-2 flex justify-between text-[10px] text-gray-600">
            <span>◉ 11 Warga melihat</span>
            <span>Verifikasi &lt; 24 Jam</span>
          </div>
        </article>
      </div>


    </section>
    </main>
  );
}