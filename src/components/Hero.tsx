import Image from "next/image";
import type { NavClickHandler } from "@/src/hooks/useActiveSection";

type HeroProps = {
  onNavClick: NavClickHandler;
};

export function Hero({ onNavClick }: HeroProps) {
  return (
    <section className="flex min-h-[calc(100svh-88px)] items-center justify-center px-6 pb-14 pt-8 text-center">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center">
        <Image
          src="/logo-sekampung.png"
          alt="Logo Kecamatan Sekampung"
          width={120}
          height={140}
          className="h-32 w-auto"
          priority
        />
        <p className="mt-8 inline-flex items-center rounded-full bg-[#1960A3] px-5 py-2 text-xs font-semibold uppercase tracking-widest text-white">
          Pemerintah Kabupaten Lampung Timur, Kecamatan Sekampung
        </p>
        <h1 className="mt-8 max-w-4xl text-5xl font-extrabold leading-[1.15] tracking-tight">
          Selamat Datang di Portal Resmi Pemerintahan Kecamatan Sekampung
        </h1>
        <p className="mt-6 max-w-3xl text-base leading-relaxed text-black">
          Pelayanan publik digital yang mudah diakses, transparan, dan
          responsif, sebagai ruang bagi masyarakat Sekampung untuk
          menyampaikan laporan, pengaduan, dan aspirasi demi mewujudkan
          kecamatan yang maju dan berkeadaban.
        </p>
        <a
          href="#layanan"
          onClick={(e) => onNavClick(e, "#layanan")}
          className="mt-8 inline-flex items-center gap-2.5 rounded-lg bg-[#0F365F] px-7 py-3.5 text-sm font-bold text-white shadow transition hover:brightness-125"
        >
          <Image
            src="/icon-toa.png"
            alt=""
            aria-hidden="true"
            width={16}
            height={16}
            className="h-4 w-4"
          />
          Pengaduan Warga
        </a>
      </div>
    </section>
  );
}
