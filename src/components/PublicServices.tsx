"use client";
import { useApi } from "@/src/hooks/useApi";
type Service = { id: string; name: string; description: string; requirements: string; hours: string; contact: string | null };
export default function PublicServices() {
  const { data, error } = useApi<{ data: Service[] }>("/api/services");
  return <div className="mx-auto mt-8 grid max-w-[1120px] gap-4 md:grid-cols-2">
    {error && <p role="alert" className="text-red-700">Informasi layanan gagal dimuat. Silakan coba lagi.</p>}
    {data?.data.map(service => <article key={service.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h3 className="text-xl font-bold text-[#0F365F]">{service.name}</h3><p className="mt-2 whitespace-pre-wrap text-sm">{service.description}</p><dl className="mt-4 space-y-3 text-sm"><div><dt className="font-semibold">Persyaratan</dt><dd className="whitespace-pre-wrap">{service.requirements}</dd></div><div><dt className="font-semibold">Jam pelayanan</dt><dd>{service.hours}</dd></div>{service.contact && <div><dt className="font-semibold">Kontak</dt><dd>{service.contact}</dd></div>}</dl></article>)}
  </div>;
}
