"use client";

import { useState } from "react";
import Image from "next/image";

const stats = [
  { value: "148,34 km²", label: "Luas wilayah" },
  { value: "85", label: "Jumlah dusun" },
  { value: "319", label: "Jumlah RT" },
  { value: "68.210", label: "Jumlah penduduk" },
];

const fiturLaporan = [
  { label: "Kategori Pengaduan", icon: "/icon-kategori.png" },
  { label: "Kerahasiaan Terjamin", icon: "/icon-privacy.png" },
  { label: "Tracking Laporan", icon: "/icon-tracking.png" },
  { label: "Respons 24 Jam", icon: "/icon-jam.png" },
];

const navItems = [
  { href: "#profile", src: "/profile.png", label: "Profile" },
  { href: "#karakteristik", src: "/karakteristik.png", label: "Karakteristik" },
  { href: "#layanan", src: "/layanan.png", label: "Layanan" },
];

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="min-h-screen bg-[#F1F1F1] text-[#1A202C]">
      {/* ===== Navbar (1440 canvas: konten 1200 terpusat) ===== */}
      <header className="sticky top-0 z-50 border-b border-black/5 bg-white">
        <div className="flex w-full items-center justify-between px-6 py-4 sm:px-10 lg:px-14">
          <a href="#top" className="flex items-center gap-3">
            <Image
              src="/logo-sekampung.png"
              alt="Logo Kecamatan Sekampung"
              width={56}
              height={64}
              className="h-14 w-auto"
              priority
            />
            <span className="truncate text-xl font-extrabold tracking-tight sm:text-2xl">
              Kecamatan Sekampung
            </span>
          </a>
          <nav
            className="hidden items-center gap-4 text-[15px] font-semibold text-black sm:gap-8 md:flex lg:gap-20"
            aria-label="Navigasi utama"
          >
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                aria-label={item.label}
                className="group relative flex h-14 w-[100px] flex-col items-center justify-center"
              >
                <span className="transition-transform duration-300 ease-out group-hover:-translate-y-3">
                  <Image
                    src={item.src}
                    alt=""
                    aria-hidden="true"
                    width={36}
                    height={36}
                    className="h-9 w-9 object-contain"
                  />
                </span>
                <span className="pointer-events-none absolute top-full mt-0.5 translate-y-1 whitespace-nowrap text-sm opacity-0 transition-all duration-300 group-hover:-translate-y-2 group-hover:opacity-100">
                  {item.label}
                </span>
              </a>
            ))}
          </nav>
          <button
            type="button"
            className="flex h-11 w-11 shrink-0 flex-col items-center justify-center gap-1.5 rounded-lg transition hover:bg-black/5 md:hidden"
            aria-label={menuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span
              aria-hidden="true"
              className={`h-0.5 w-6 bg-black transition-transform duration-300 ${menuOpen ? "translate-y-2 rotate-45" : ""}`}
            />
            <span
              aria-hidden="true"
              className={`h-0.5 w-6 bg-black transition-opacity duration-300 ${menuOpen ? "opacity-0" : ""}`}
            />
            <span
              aria-hidden="true"
              className={`h-0.5 w-6 bg-black transition-transform duration-300 ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`}
            />
          </button>
        </div>
        <nav
          aria-label="Navigasi seluler"
          className={`absolute inset-x-0 top-full grid bg-white shadow-lg transition-all duration-300 ease-out md:hidden ${
            menuOpen
              ? "visible grid-rows-[1fr] border-t border-black/5 opacity-100"
              : "invisible grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="min-h-0 overflow-hidden">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                tabIndex={menuOpen ? 0 : -1}
                className="flex items-center gap-3 px-6 py-3.5 text-sm font-semibold text-black transition hover:bg-black/5"
              >
                <Image
                  src={item.src}
                  alt=""
                  aria-hidden="true"
                  width={28}
                  height={28}
                  className="h-7 w-7 object-contain"
                />
                {item.label}
              </a>
            ))}
          </div>
        </nav>
      </header>

      <main id="top">
        {/* ===== Hero ===== */}
        <section className="px-6 pb-24 pt-16 text-center">
          <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center">
            <Image
              src="/logo-sekampung.png"
              alt="Logo Kecamatan Sekampung"
              width={120}
              height={140}
              className="h-32 w-auto"
              priority
            />
            <p className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#1960A3] px-5 py-2 text-xs font-semibold uppercase tracking-widest text-white">
              <Image
                src="/icon-ceklis.png"
                alt=""
                aria-hidden="true"
                width={14}
                height={14}
                className="h-3.5 w-3.5"
              />
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

        {/* ===== Profile / Tentang ===== */}
        <section id="profile" className="scroll-mt-4 px-6 py-20">
          <div className="mx-auto w-full max-w-[1280px] rounded-3xl bg-white p-10 shadow-sm">
            <h2 className="text-[26px] font-extrabold leading-tight tracking-tight sm:text-[28px] md:text-[32px]">
              <span className="whitespace-nowrap">Tentang Kecamatan</span>{" "}
              Sekampung
            </h2>
            <div className="mt-8 grid gap-10 md:grid-cols-[400px_1fr] md:items-center">
              <div className="flex items-center justify-center">
                <Image
                  src="/logo-sekampung.png"
                  alt="Logo Kecamatan Sekampung"
                  width={340}
                  height={394}
                  className="h-auto w-80"
                />
              </div>
              <div className="text-[15px] leading-relaxed text-black">
                <p className="rounded-lg bg-[#F1F3F6] p-5">
                  Kecamatan Sekampung terdiri dari 6 dusun dan 34 RT dengan
                  mayoritas warga bermata pencaharian agraris. Portal ini
                  dibangun agar setiap laporan warga dan pembaruan data
                  keluarga tercatat rapi mulai dari tingkat RT, tanpa memutus
                  alur birokrasi yang berjalan.
                </p>
                <div className="mt-5 space-y-3">
                  <div className="rounded-lg bg-[#0F365F] p-5 text-[15px] text-white">
                    <span className="font-bold">Visi : </span>
                    Mewujudkan layanan administrasi kewilayahan yang cepat,
                    transparan, dan dekat dengan warga.
                  </div>
                  <div className="rounded-lg bg-[#0F365F] p-5 text-[15px] text-white">
                    <span className="font-bold">Misi : </span>
                    Mendorong pendataan kependudukan yang akurat dan responsif
                    terhadap laporan warga di setiap RT.
                  </div>
                </div>
                <p className="mt-5 text-[15px]">
                  <span className="font-bold">Camat :</span> Drs. H. Sunarto,
                  M.Si, menjabat sejak 2023
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== Karakteristik ===== */}
        <section
          id="karakteristik"
          className="scroll-mt-4 px-6 py-20"
        >
          <div className="mx-auto w-full max-w-[1280px]">
            <h2 className="text-[32px] font-extrabold tracking-tight">
              Gambaran umum wilayah
            </h2>
            <p className="mt-2 text-[15px] text-black">
              Data dasar kewilayahan sebagai konteks perencanaan layanan di
              tiap dusun dan RT.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-5 lg:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl bg-white p-8 text-center shadow-sm"
                >
                  <p className="text-[28px] font-extrabold text-[#2B6CB0]">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-sm text-black">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 grid items-center gap-4 rounded-3xl bg-white p-10 shadow-sm lg:grid-cols-[1fr_380px]">
              <div>
                <p className="inline-flex items-center gap-2.5 text-[13px] font-semibold text-[#006A61]">
                  <Image
                    src="/icon-gps.png"
                    alt=""
                    aria-hidden="true"
                    width={20}
                    height={20}
                    className="h-5 w-5"
                  />
                  Gambaran Umum Wilayah Geografis
                </p>
                <h3 className="mt-3 text-2xl font-extrabold leading-snug">
                  Posisi Geostrategis di Kecamatan Sekampung
                </h3>
                <p className="mt-4 text-[15px] leading-relaxed text-black">
                  Kecamatan Sekampung merupakan wilayah pedesaan di Kabupaten
                  Lampung Timur yang memiliki lingkungan masyarakat yang aktif
                  dan beragam. Wilayahnya didominasi oleh permukiman, lahan
                  pertanian, dan perkebunan yang menjadi bagian dari kehidupan
                  serta perekonomian masyarakat. Berbagai potensi wilayah dan
                  aktivitas masyarakat menjadi bagian penting dalam mendukung
                  perkembangan Kecamatan Sekampung.
                </p>
                <div className="mt-5 flex flex-wrap gap-2 text-xs font-medium text-black">
                  <span className="rounded-lg bg-[#F1F3F6] px-3 py-1.5">
                    Ketinggian: 25–55 mdpl
                  </span>
                  <span className="rounded-lg bg-[#F1F3F6] px-3 py-1.5">
                    Curah Hujan: 1.850–1.950 mm/th
                  </span>
                  <span className="rounded-lg bg-[#F1F3F6] px-3 py-1.5">
                    Suhu Rata-rata: 26°C - 28°C
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-center lg:justify-end">
                <Image
                  src="/peta.png"
                  alt="Peta Kecamatan Sekampung"
                  width={380}
                  height={220}
                  className="h-[220px] w-[380px] max-w-full rounded-2xl object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ===== Layanan ===== */}
        <section id="layanan" className="scroll-mt-24 px-6 pb-24 pt-6">
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
                  href="#layanan"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#2B6CB0] px-6 py-3.5 text-[13px] font-bold text-white shadow transition hover:brightness-110"
                >
                  Sampaikan Laporan Warga
                  <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ===== Footer ===== */}
      <footer className="bg-[#0F365F] px-6 py-16 text-white">
        <div className="mx-auto grid w-full max-w-[1280px] gap-12 text-sm leading-relaxed md:grid-cols-3">
          <div>
            <p className="text-lg font-extrabold">Kecamatan Sekampung</p>
            <p className="mt-5 text-white" suppressHydrationWarning>
              Jl. Raya Sekampung No. 124, Kecamatan Sekampung, Kab. Lampung
              Timur 40872
              <br />
              <a href="tel:+622287654321" className="hover:underline">
                (022) 87654321
              </a>{" "}
              /{" "}
              <a href="tel:+6281122334455" className="hover:underline">
                0811-2233-4455
              </a>
              <br />
              kecamatan.Sekampung@lampungtimurkab.go.id
            </p>
          </div>
          <div>
            <p className="text-lg font-extrabold">Jam Operasional Pelayanan</p>
            <dl className="mt-4 max-w-xs space-y-2 text-white">
              <div className="flex justify-between gap-4">
                <dt>Senin - Kamis</dt>
                <dd>08.00 - 15.30 WIB</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>Jumat</dt>
                <dd>08.00 - 14.30 WIB</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>Sabtu - Minggu</dt>
                <dd className="font-semibold text-[#D58384]">Libur Pelayanan</dd>
              </div>
            </dl>
          </div>
          <div>
            <div className="rounded-2xl border border-white/20 p-6">
              <p className="text-lg font-extrabold">
                Layanan Online Mandiri 24/7
              </p>
              <p className="mt-2 text-white">
                Pengaduan berkas online dan pelaporan warga tetap dapat
                dilakukan setiap saat melalui portal ini.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
