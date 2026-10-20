
"use client";

import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";


const dataMingguan = [
  { label: "Sen", masuk: 35, selesai: 18 },
  { label: "Sel", masuk: 42, selesai: 22 },
  { label: "Rab", masuk: 30, selesai: 16 },
  { label: "Kam", masuk: 55, selesai: 28 },
  { label: "Jum", masuk: 38, selesai: 20 },
  { label: "Sab", masuk: 48, selesai: 25 },
  { label: "Min", masuk: 0, selesai: 1 },
];

const dataBulanan = [
  { label: "Jan", masuk: 18, selesai: 10 },
  { label: "Feb", masuk: 22, selesai: 12 },
  { label: "Mar", masuk: 15, selesai: 8 },
  { label: "Apr", masuk: 25, selesai: 13 },
  { label: "Mei", masuk: 20, selesai: 11 },
  { label: "Jun", masuk: 28, selesai: 14 },
  { label: "Jul", masuk: 16, selesai: 9 },
  { label: "Agu", masuk: 24, selesai: 12 },
  { label: "Sep", masuk: 19, selesai: 10 },
  { label: "Okt", masuk: 27, selesai: 14 },
  { label: "Nov", masuk: 17, selesai: 8 },
  { label: "Des", masuk: 37, selesai: 9 },
];

type StatistikProps = {
  totalMasuk: string | number;
  totalSelesai: string | number;
};

export default function Statistik({
    totalMasuk,
    totalSelesai,
    }: StatistikProps) {
  const [periode, setPeriode] = useState("mingguan");

  const chartData =
    periode === "mingguan" ? dataMingguan : dataBulanan;

  return (
    <section className="h-full min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-[#082B52]">
            Tren Laporan Masuk & Selesai
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Periode pergerakan volume laporan dan tingkat penyelesaian
          </p>
        </div>

        <select
          aria-label="Pilih periode statistik"
          value={periode}
          onChange={(e) => setPeriode(e.target.value)}
          className="cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600
          outline-none transition focus:border-[#087F70] focus:ring-2 focus:ring-[#087F70]/10"
        >
          <option value="mingguan">Mingguan</option>
          <option value="bulanan">Bulanan</option>
        </select>
      </div>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 8, left: -18, bottom: 0 }}
          >
            <defs>
                <linearGradient id="gradasiBiru" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.20} />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.01} />
                </linearGradient>

                <linearGradient id="gradasiHijau" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#087F70" stopOpacity={0.20} />
                    <stop offset="100%" stopColor="#087F70" stopOpacity={0.01} />
                </linearGradient>
            </defs>

            <CartesianGrid
              stroke="#E2E8F0"
              strokeDasharray="4 4"
              vertical={false}
            />

            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748B", fontSize: 12 }}
              dy={10}
            />

            <YAxis
              domain={[0, 60]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748B", fontSize: 12 }}
              allowDecimals={false}
            />

            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #E2E8F0",
                fontSize: "12px",
              }}
              formatter={(value) => [value, "Jumlah laporan"]}
            />
            
            <Area
                type="monotone"
                dataKey="masuk"
                name="Laporan Masuk"
                stroke="#005CBD"
                strokeWidth={3}
                fill="url(#gradasiBiru)"
                activeDot={{ r: 5 }}
            />

            <Area
                type="monotone"
                dataKey="selesai"
                name="Laporan Selesai"
                stroke="#2FB257"
                strokeWidth={3}
                fill="url(#gradasiHijau)"
                activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
        
        <div className="mt-8 flex w-full flex-wrap items-center justify-end gap-x-2 gap-y-2">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="h-2 w-2 shrink-0 rounded-full bg-[#005CBD]" />
          <span>
            Laporan Masuk (Total: {totalMasuk})
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="h-2 w-2 shrink-0 rounded-full bg-[#2FB257]" />
          <span>
            Laporan Selesai (Total: {totalSelesai})
          </span>
        </div>
      </div>

    </section>
  );
}
