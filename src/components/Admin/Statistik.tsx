
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


type StatistikProps = {
  totalMasuk: string | number;
  totalSelesai: string | number;
  weekly: { label: string; masuk: number; selesai: number }[];
  monthly: { label: string; masuk: number; selesai: number }[];
  year: number;
};

export default function Statistik({
    totalMasuk,
    totalSelesai, weekly, monthly, year,
    }: StatistikProps) {
  const [periode, setPeriode] = useState("mingguan");

  const chartData =
    periode === "mingguan" ? weekly : monthly;

  return (
    <section className="h-full min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-[#082B52]">
            Tren Laporan Masuk & Selesai
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {periode === "mingguan" ? "Tujuh hari terakhir (WIB)" : `Januari–Desember ${year} (WIB)`}
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
              domain={[0, "auto"]}
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
                isAnimationActive={false}
                type="monotone"
                dataKey="masuk"
                name="Laporan Masuk"
                stroke="#005CBD"
                strokeWidth={3}
                fill="url(#gradasiBiru)"
                activeDot={{ r: 5 }}
            />

            <Area
                isAnimationActive={false}
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
