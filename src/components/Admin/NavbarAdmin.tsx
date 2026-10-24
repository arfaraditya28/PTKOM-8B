"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useSession } from "./Session";
import { requestJson, jsonOptions } from "@/src/lib/client-api";

export default function NavbarAdmin() {
  const router = useRouter();
  const user = useSession();
  const [error, setError] = useState("");
  async function logout() {
    try { await requestJson("/api/auth/logout", jsonOptions("POST")); router.replace("/login"); router.refresh(); }
    catch (e) { setError(e instanceof Error ? e.message : "Gagal keluar."); }
  }
  const links = [["/admin", "Dashboard"], ["#laporan", "Laporan"], ...(user.role === "ADMIN" ? [["#kategori", "Kategori"], ["#pengguna", "Pengguna"], ["#layanan", "Layanan"]] : []), ["#statistik", "Statistik"]];
  return <header className="sticky top-0 z-20 text-white">
    <div className="bg-[#0F3460]">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4 px-6 py-4">
        <a href="/admin" className="flex items-center gap-3"><Image src="/logo-sekampung.png" width={48} height={48} alt="Logo Kecamatan Sekampung" /><div><p className="text-xl font-bold">Kecamatan Sekampung</p><p className="text-xs text-blue-200">Kab. Lampung Timur</p></div></a>
        <div className="flex items-center gap-5"><div><p className="font-semibold">{user.name || user.username}</p><p className="text-xs text-blue-200">{user.role}</p></div><button onClick={logout} className="rounded-lg border border-white/30 px-4 py-2">Keluar</button></div>
      </div>
      {error && <p role="alert" className="px-6 pb-3">{error}</p>}
    </div>
    <nav className="bg-[#001F41]"><div className="mx-auto flex max-w-[1440px] flex-wrap gap-2 px-6 py-2">{links.map(([href, label]) => <a key={href} href={href} className="rounded-lg px-4 py-2 text-sm hover:bg-[#005CBD]">{label}</a>)}<Link href="/" className="px-4 py-2 text-sm">Beranda publik</Link></div></nav>
  </header>;
}
