export function Footer() {
  return (
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
  );
}
