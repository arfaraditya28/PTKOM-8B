import Image from "next/image";
import { stats } from "@/src/lib/constants";

export function Karakteristik() {
  return (
    <section
      id="karakteristik"
      className="scroll-mt-[70px] px-6 py-10"
    >
      <div className="mx-auto w-full max-w-[1280px]">
        <h2 className="text-[32px] font-extrabold tracking-tight">
          Gambaran Umum Wilayah
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
  );
}
