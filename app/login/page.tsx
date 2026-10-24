"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { requestJson, jsonOptions, inputStyle, buttonStyle } from "@/src/lib/client-api";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setBusy(true);
    const form = new FormData(event.currentTarget);
    try {
      await requestJson("/api/auth/login", jsonOptions("POST", { username: form.get("username"), password: form.get("password") }));
      router.replace("/admin"); router.refresh();
    } catch (e) { setError(e instanceof Error ? e.message : "Login gagal."); setBusy(false); }
  }
  return <main className="flex min-h-screen items-center justify-center bg-[#F5F7FB] px-6 py-12">
    <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-[#0F3460]">Login Petugas &amp; Admin</h1>
      <p className="mt-2 text-sm text-slate-600">Portal Kecamatan Sekampung</p>
      <form onSubmit={login} className="mt-6 space-y-4">
        <label className="block text-sm font-semibold">Username<input name="username" autoComplete="username" required maxLength={50} className={inputStyle} /></label>
        <label className="block text-sm font-semibold">Kata sandi<input name="password" type="password" autoComplete="current-password" required className={inputStyle} /></label>
        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
        <button disabled={busy} className={`${buttonStyle} w-full`}>{busy ? "Memeriksa..." : "Masuk"}</button>
      </form>
      <Link href="/" className="mt-5 block text-sm text-blue-700">Kembali ke beranda</Link>
    </section>
  </main>;
}
