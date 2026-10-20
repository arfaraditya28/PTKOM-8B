import Image from "next/image";
import Statistik from "./Statistik";
import KategoriAduan from "./KategoriAduan";

const stats = [
  {
    label: "TOTAL SELURUH LAPORAN",
    value: "284", 
    pin : "/icon-panah.svg",
    info: "+12,5% minggu ini",
    note: "Tercatat aktif di Sekampung",
    icon: "/icon-laporan-admin1.svg",
    color: "bg-[#EFF4FF] text-[#004591]",
    card: "border-white bg-white",
    badge: "bg-[#E5EEFF] text-[#005CBD]",
  },
  {
    label: "MENUNGGU VERIFIKASI",
    value: "36",
    pin : "/icon-new.svg",
    info: "+4 hari ini",
    note: "Prioritas tindakan awal",
    icon: "/icon-pesan.png",
    color: "bg-[#EFF4FF] text-[#004591]",
    card: "border-white bg-white",
    badge: "bg-[#E5EEFF] text-[#005CBD]",
  },
  {
    label : "DALAM TINDAK LANJUT OPD",
    value: "82",
    pin : "/icon-jam.png",
    info: "2.4 hari pengerjaan",
    note: "kasi Trantib & Ekobang",
    icon: "/icon-waktu-laporan.svg",
    color: "bg-[#EFF4FF] text-[#004591]",
    card: "border-white bg-white",
    badge: "bg-[#E5EEFF] text-[#005CBD]",
  },
  {
    label: "TUNTAS TERVERIFIKASI WARGA",
    value: "130",
    pin : "/icon-jempol.svg",
    info: "Kepuasan 94.8%",
    note: "Aspirasi terselesaikan",
    icon: "/icon-centang-hijau.svg",
    color: "bg-emerald-100 text-emerald-600",
    card: "border-white bg-white",
    badge: "bg-emerald-100/80 text-emerald-700",
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
    <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      {/* Sambutan admin */}
      <div>
        <div className="flex items-center gap-2">      
        <div className="h-2 w-2 rounded-full bg-[#005CBD]"></div>
        <p className="text-[13px] font-semibold text-[#005CBD]">
          Sistem Informasi Pengaduan Warga
        </p>
        </div>  

        <h1 className="mt-2 text-[26px] font-bold text-black">
          Selamat Datang, Admin!
        </h1>

        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          Senin, 9 Oktober 2026 • Pantau dan kelola aspirasi 
          serta pengaduan masyarakat Kecamatan Sekampung secara real-time.
        </p>
      </div>

      {/* Tombol unduh laporan */}
      <button
        type="button"
        className="flex shrink-0 items-center justify-center gap-2 rounded-sm bg-[#EFF4FF] px-4 py-2 text-[10px] font-bold text-[#001F41] transition hover:bg-black/10 cursor-pointer disabled:opacity-60"
      >
        <Image
            src="/icon-unduh.svg"
            alt=""
            width={3}
            height={3}
            className="h-3 w-3"
            />
        Unduh Rekap Laporan
      </button>
    </section>


    
    <section className="grid grid-cols-4 gap-4">
        {stats.map((stat) => (
    <article
      key={stat.note}
      className={`rounded-xl border p-5 shadow-sm ${stat.card}`}
    >
      {/* Ikon kiri atas dan informasi kanan atas */}
      <div className="flex items-start justify-between gap-2">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-2xl font-bold ${stat.color}`}
        >
        <img
            src={stat.icon}
            alt=""
            width={20}
            height={20}
            className="h-4 w-4 object-contain"
        />    
        </div>

        <div className={`rounded-xl px-2 py-1 text-right ${stat.badge}`}>
            <p className="flex item-center gap-1 text-[10px] font-semibold">
                <img
                    src={stat.pin} 
                    alt=""
                    width={10}
                    height={10}
                    className="h-3.2 w-3.2 object-contain"
                />  
                {stat.info}
            </p>
        </div>
      </div>

      {/* Angka besar */}
      <p className="mt-1 text-3xl font-bold tracking-tight text-blackS">
        {stat.value}
      </p>

      {/* Keterangan */}
      <p className="mt-1 text-xs leading-5 text-slate-600">
        {stat.label}
      </p>

      {/* Garis pemisah */}
      <div className="mt-2 border-t border-slate-200/70" />

      {/* Keterangan bawah tetap ada */}
      <p className="mt-2 text-xs leading-5 text-slate-600">
        {stat.note}
      </p>
    </article>
        ))}
    </section>

        <div className="mt-6 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="min-w-0">
            <Statistik
              totalMasuk={stats[0].value}
              totalSelesai={stats[3].value}
            />
          </div>

          <div className="min-w-0">
            <KategoriAduan
              totalAduan={stats[0].value}
            />
          </div>
        </div>
    </div>
  );
}
