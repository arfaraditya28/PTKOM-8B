import Image from "next/image";
import { fiturLaporan } from "@/src/lib/constants";
import PublicServices from "./PublicServices";

export function Layanan() {
  return (
    <section id="layanan" className="scroll-mt-[70px] px-6 pb-16 pt-10">
      <div className="mx-auto w-full max-w-[1280px]">
        <h2 className="text-center text-4xl font-extrabold uppercase tracking-tight text-black sm:text-[40px]">
          Portal Layanan Terpadu
        </h2>
        <p className="mt-2 text-center text-[28px] font-extrabold tracking-tight text-[#0F365F] sm:text-[32px]">
          Layanan Prioritas Warga Sekampung
        </p>
        <p className="mx-auto mt-4 max-w-3xl text-center text-xl leading-relaxed text-black">
          Penyelesaian dan penyaluran aspirasi pengawasan publik secara
          langsung, transparan, dan efisien.
        </p>

        <div className="relative mx-auto mt-10 w-full max-w-[1120px] rounded-3xl bg-white p-10 shadow-sm">
          <span className="absolute right-8 top-8 rounded-full bg-[#D4E3FF] px-3.5 py-1.5 text-xs font-semibold text-[#0F365F]">
            <span aria-hidden="true" className="text-[#1960A3]">
              ●
            </span>{" "}
            Kanal Warga Siaga
          </span>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1960A3]">
            <Image
              src="/icon-laporan.png"
              alt=""
              aria-hidden="true"
              width={26}
              height={26}
              className="h-[26px] w-[26px] object-contain"
            />
          </div>
          <h3 className="mt-6 text-2xl font-extrabold">
            Laporan Masyarakat &amp; Aspirasi
          </h3>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-black">
            Sampaikan pengaduan, kritik konstruktif, aspirasi pembangunan,
            atau permintaan informasi langsung kepada Camat dan petugas
            terkait.
          </p>
          <ul className="mt-6 grid grid-cols-1 gap-3 text-sm font-medium sm:grid-cols-2">
            {fiturLaporan.map((fitur) => (
              <li key={fitur.label} className="flex items-center gap-2.5 rounded-lg bg-[#F1F4F6] px-4 py-3">
                <Image
                  src={fitur.icon}
                  alt=""
                  aria-hidden="true"
                  width={20}
                  height={20}
                  className="h-5 w-5 shrink-0 object-contain"
                />
                {fitur.label}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex justify-end">
            <a
              href="/pelaporan"
              className="inline-flex items-center gap-2 rounded-lg bg-[#2B6CB0] px-6 py-3.5 text-[13px] font-bold text-white shadow transition hover:brightness-110"
            >
              Sampaikan Laporan Warga
              <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>
        <PublicServices />
      </div>
    </section>
  );
}
