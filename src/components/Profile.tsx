import Image from "next/image";

export function Profile() {
  return (
    <section id="profile" className="scroll-mt-[104px] px-6 py-10">
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
  );
}
