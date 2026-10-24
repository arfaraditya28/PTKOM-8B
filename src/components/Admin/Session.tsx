"use client";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect } from "react";
import { useApi } from "@/src/hooks/useApi";
export type SessionUser = { id: string; name?: string; username: string; role: "ADMIN" | "PETUGAS" };
const Context = createContext<SessionUser | undefined>(undefined);
export function SessionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  useEffect(() => {
    const expired = () => { router.replace("/login"); router.refresh(); };
    window.addEventListener("ptkom-session-expired", expired);
    return () => window.removeEventListener("ptkom-session-expired", expired);
  }, [router]);
  const { data, error } = useApi<{ data: SessionUser }>("/api/auth/me");
  if (error) return <p role="alert" className="p-8 text-red-700">{error}</p>;
  if (!data) return <p className="p-8">Memuat sesi...</p>;
  return <Context.Provider value={data.data}>{children}</Context.Provider>;
}
export function useSession() {
  const user = useContext(Context);
  if (!user) throw new Error("Sesi belum tersedia.");
  return user;
}
