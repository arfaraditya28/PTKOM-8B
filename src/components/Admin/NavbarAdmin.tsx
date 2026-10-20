import Image from "next/image";

export default function NavbarAdmin() {
  return (
    <header className="sticky top-0 z-20">
      {/* NAVBAR UTAMA */}
        <div className="border-b border-white/10 bg-[#0F3460] text-white">
            <div className="mx-auto flex min-h-[84px] max-w-[1440px] items-center justify-between gap-6 px-5 py-4 md:px-8">
                {/* Logo dan nama kecamatan */}
                <a href="/admin" className="flex shrink-0 items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center">
                    <Image
                    src="/logo-sekampung.png"
                    alt="Logo Kecamatan Sekampung"
                    width={48}
                    height={48}
                    className="h-12 w-12 object-contain"
                    priority
                    />
                    </div>

                    <div>
                        <p className="text-xl font-bold tracking-wide">
                            Kecamatan Sekampung
                        </p>
                        <p className="mt-1 text-xs text-white/60">
                            Kab. Lampung Timur
                        </p>
                    </div>
                </a>

                {/* Kolom pencarian di tengah */}
                <div className="hidden w-[380px] shrink-0 md:block">
                    <div className="-ml-12 mr-12 flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2">
                    <Image
                        src="/icon-search.svg"
                        alt=""
                        width={15}
                        height={15}
                        className="h-[15px] w-[15px] opacity-70"
                    />

                    <input
                        type="search"
                        placeholder="Cari laporan, NIK, nama pengadu atau desa... "
                        aria-label="Cari laporan atau warga"
                        className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/50"
                    />
                    </div>
                </div>

                {/* Profil admin di kanan */}
                <div className="flex shrink-0 items-center gap-5">
                    <button
                        type="button"
                        aria-label="Notifikasi"
                        className="mr-25 -ml-25 relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 text-lg hover:bg-white/10">
                        <Image
                            src="/icon-notifikasi.svg"
                            alt=""
                            width={15}
                            height={15}
                            className="h-[15px] w-[15px]"
                        />
                        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-400" />
                    </button>

                    <div className="mr-20 -ml-20 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#DDEBFA] font-bold text-[#164B7B]">
                        <Image
                            src="/foto-profil-admin.png"
                            alt="Foto Profil"
                            width={60}
                            height={40}
                            className="h-[40px] w-[60px]"
                        />
                    </div>

                    <div className="mr-20 -ml-20 hidden sm:block">
                        <p className="text-[14px] font-semibold">Admin Kecamatan</p>
                        <p className="mt-1 text-[12px] text-blue-200">
                            Pratama IT
                        </p>
                    </div>

                
                    <button
                        type="button"
                        aria-label="Logout"
                        title="Keluar"
                        className="mr-3 -ml-3 gap-2 flex h-10 w-auto px-3 shrink-0 items-center justify-center rounded-xl transition hover:bg-white/10">
                    <Image
                        src="/icon-keluar.svg"
                        alt=""
                        width={10}
                        height={10}
                        className="h-[15px] w-[15px]"
                    />
                    <span className="text-sm">Keluar</span>
                    </button>
                </div>
            </div>
        </div>


      {/* SUBNAV */}
      <nav className="border-b border-slate-200 bg-[#001F41]">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-1 px-5 py-2 md:px-8">
          <a href="/admin"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-white/80 hover:bg-[#005CBD] hover:text-white shadow-sm">
            <Image
                src="/icon-dashboard.svg"
                alt="Icon Dashboard"
                width={5}
                height={5}
                className="h-4 w-4"
                
            />
            Dashboard
          </a>

          <a
            href="#laporan"
            className="flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-semibold text-white/80 hover:bg-[#005CBD] hover:text-white shadow-sm">
            <Image
                src="/icon-laporan-admin.svg"
                alt="Icon Dashboard"
                width={5}
                height={5}
                className="h-4 w-4"
                
            />
            Laporan
          </a>

          <a
            href="#kategori"
            className="flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-semibold text-white/80 hover:bg-[#005CBD] hover:text-white shadow-sm">
            <Image
                src="/icon-kategori-putih.svg"
                alt="Icon kategori"
                width={5}
                height={5}
                className="h-4 w-4"
                
            />
            Kategori
          </a>

          <a
            href="#pengguna"
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white/80 hover:bg-[#005CBD] hover:text-white shadow-sm">
            <Image
                src="/icon-pengguna.svg"
                alt="Icon kategori"
                width={5}
                height={5}
                className="h-4 w-4"
                
            />
            Pengguna
          </a>

          <a
            href="#layanan"
            className="flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-semibold text-white/80 hover:bg-[#005CBD] hover:text-white shadow-sm">
            <Image
                src="/icon-layanan.svg"
                alt="Icon kategori"
                width={5}
                height={5}
                className="h-4 w-4"
                
            />
            Layanan
          </a>

          <a
            href="#statistik"
            className="flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-semibold text-white/80 hover:bg-[#005CBD] hover:text-white shadow-sm">
            <Image
                src="/icon-statistik.svg"
                alt="Icon kategori"
                width={5}
                height={5}
                className="h-4 w-4"
                
            />
            Statistik
          </a>

          <a
            href="#pengaturan"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-white/80 hover:bg-[#005CBD] hover:text-white shadow-sm">
            <Image
                src="/icon-pengaturan.svg"
                alt="Icon kategori"
                width={5}
                height={5}
                className="h-4 w-4"
            />
            Pengaturan
          </a>

        </div>
      </nav>
    </header>
  );
}
