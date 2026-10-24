
"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

type KategoriAduanProps = {
  totalAduan: string | number;
  categories: { categoryId: string; categoryName: string; count: number }[];
};

export default function KategoriAduan({
  totalAduan, categories,
}: KategoriAduanProps) {

  const colors = ["#005CBD", "#0F3460", "#2FB257", "#F59E0B", "#A855F7"];
  const dataKategori = categories.map((c, i) => ({ nama: c.categoryName, jumlah: c.count, warna: colors[i % colors.length] }));
  return (
    <section className="h-full min-w-0 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-[#082B52]">
            Kategori Aduan
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Sebaran sektor permasalahan
          </p>
        </div>

        <span className="shrink-0 rounded-lg bg-slate-50 px-3 py-2 text-xs font-medium text-slate-500">
          Semua laporan
        </span>
      </div>

      {/* Diagram lingkaran */}
      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
                isAnimationActive={false}
                data={dataKategori}
                dataKey="jumlah"
                nameKey="nama"
                cx="50%"
                cy="50%"
                innerRadius="65%"
                outerRadius="90%"
                paddingAngle={2}
                stroke="none"
            >
                {dataKategori.map((kategori) => (
                <Cell
                    key={kategori.nama}
                    fill={kategori.warna}
                />
                ))}
            </Pie>

            <Tooltip
                formatter={(value, name) => [`${value} laporan`, name]}
            />

            <text
                x="50%"
                y="47%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-slate-800"
                fontSize={25}
                fontWeight={700}
            >
                {totalAduan}
            </text>

            <text
                x="50%"
                y="59%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-slate-500"
                fontSize={11}
            >
                TOTAL LAPORAN
            </text>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Keterangan warna */}
      <div className="mt-4 space-y-3">
        {dataKategori.map((kategori) => (
          <div
            key={kategori.nama}
            className="flex items-center justify-between gap-3"
          >
            <div className="flex min-w-0 items-center gap-2">
              <span
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: kategori.warna }}
              />
              <span className="truncate text-sm text-slate-600">
                {kategori.nama}
              </span>
            </div>

            <span className="shrink-0 text-sm font-semibold text-slate-700">
              {kategori.jumlah}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
