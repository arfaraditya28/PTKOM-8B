"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useApi } from "@/src/hooks/useApi";
import { useSession } from "./Session";
import { requestJson, jsonOptions, buttonStyle, inputStyle } from "@/src/lib/client-api";

type Row = { id: string; name: string; [key: string]: string | boolean | null };
type Field = { key: string; label: string; type?: "password" | "textarea" | "role" | "checkbox"; required?: boolean; max?: number };
const categoryFields: Field[] = [{ key: "name", label: "Nama kategori", required: true, max: 100 }, { key: "description", label: "Deskripsi", type: "textarea", max: 500 }];
const userFields: Field[] = [{ key: "name", label: "Nama", required: true, max: 100 }, { key: "username", label: "Username", required: true, max: 50 }, { key: "password", label: "Kata sandi (minimal 10 karakter; kosongkan saat edit jika tetap)", type: "password" }, { key: "role", label: "Role", type: "role" }, { key: "isActive", label: "Akun aktif", type: "checkbox" }];
const serviceFields: Field[] = [{ key: "name", label: "Nama layanan", required: true, max: 150 }, { key: "description", label: "Deskripsi", type: "textarea", required: true, max: 5000 }, { key: "requirements", label: "Persyaratan", type: "textarea", required: true, max: 5000 }, { key: "hours", label: "Jam layanan", required: true, max: 500 }, { key: "contact", label: "Kontak", max: 200 }, { key: "isActive", label: "Tampilkan pada halaman publik", type: "checkbox" }];

function Crud({ id, title, path, fields, users = false }: { id: string; title: string; path: string; fields: Field[]; users?: boolean }) {
  const router = useRouter();
  const session = useSession();
  const [revision, setRevision] = useState(0);
  const { data, error } = useApi<{ data: Row[] }>(path, revision);
  const [editing, setEditing] = useState<Row | null>();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage("");
    const form = new FormData(event.currentTarget);
    const payload: Record<string, unknown> = {};
    for (const field of fields) {
      if (field.key === "isActive" && users && !editing) continue;
      const value = field.type === "checkbox" ? form.has(field.key) : String(form.get(field.key) ?? "");
      if (field.key === "password" && !value && editing) continue;
      payload[field.key] = value;
    }
    try {
      await requestJson(editing ? `${path}/${editing.id}` : path, jsonOptions(editing ? "PATCH" : "POST", payload));
      if (users && editing?.id === session.id) { router.replace("/login"); router.refresh(); return; }
      setEditing(undefined); setRevision(n => n + 1); setMessage("Data berhasil disimpan.");
    } catch (e) { setMessage(e instanceof Error ? e.message : "Gagal menyimpan."); }
    finally { setBusy(false); }
  }
  async function remove(row: Row) {
    if (!window.confirm(users ? `Nonaktifkan akun ${row.name}?` : `Hapus ${row.name}?`)) return;
    setBusy(true); setMessage("");
    try {
      await requestJson(`${path}/${row.id}`, jsonOptions("DELETE"));
      if (users && row.id === session.id) { router.replace("/login"); router.refresh(); return; }
      setRevision(n => n + 1); setMessage(users ? "Akun dinonaktifkan." : "Data berhasil dihapus.");
    } catch (e) { setMessage(e instanceof Error ? e.message : "Gagal menghapus."); }
    finally { setBusy(false); }
  }
  return <section id={id} className="scroll-mt-40 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-lg font-bold text-[#082B52]">{title}</h2><button disabled={busy} onClick={() => { setEditing(null); setMessage(""); }} className={buttonStyle}>Tambah</button></div>
    {(error || message) && <p role="status" className="my-3 text-sm">{error || message}</p>}
    {editing !== undefined && <form key={editing?.id || "new"} onSubmit={submit} className="my-5 grid gap-4 rounded-xl bg-slate-50 p-5 sm:grid-cols-2">
      <h3 className="font-bold sm:col-span-2">{editing ? `Ubah ${editing.name}` : "Tambah data"}</h3>
      {fields.filter(f => !(f.key === "isActive" && users && !editing)).map(field => <label key={field.key} className="block text-sm font-semibold">{field.label}
        {field.type === "checkbox" ? <input type="checkbox" name={field.key} defaultChecked={editing ? Boolean(editing[field.key]) : true} className="ml-3" />
          : field.type === "textarea" ? <textarea name={field.key} required={field.required} maxLength={field.max} defaultValue={String(editing?.[field.key] ?? "")} className={inputStyle} rows={3} />
          : field.type === "role" ? <select name={field.key} defaultValue={String(editing?.role || "PETUGAS")} className={inputStyle}><option value="PETUGAS">Petugas</option><option value="ADMIN">Admin</option></select>
          : <input name={field.key} type={field.type || "text"} required={field.required || (field.type === "password" && !editing)} minLength={field.type === "password" ? 10 : undefined} maxLength={field.type === "password" ? 72 : field.max} autoComplete={field.type === "password" ? "new-password" : "off"} defaultValue={field.type === "password" ? "" : String(editing?.[field.key] ?? "")} className={inputStyle} />}
      </label>)}
      <div className="flex gap-3 sm:col-span-2"><button disabled={busy} className={buttonStyle}>{busy ? "Menyimpan..." : "Simpan"}</button><button type="button" disabled={busy} onClick={() => setEditing(undefined)} className="px-4 py-2 text-sm">Batal</button></div>
    </form>}
    <div className="mt-4 divide-y divide-slate-100">{data?.data.map(row => <article key={row.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
      <div><p className="font-semibold">{row.name}</p><p className="whitespace-pre-line text-sm text-slate-500">{users ? `${row.username} · ${row.role} · ${row.isActive ? "Aktif" : "Nonaktif"}` : row.description}</p>{!users && typeof row.isActive === "boolean" && <p className="text-xs">{row.isActive ? "Tampil publik" : "Disembunyikan"}</p>}</div>
      <div className="flex gap-4 text-sm"><button disabled={busy} onClick={() => { setEditing(row); setMessage(""); }} className="font-semibold text-blue-700">Ubah</button><button disabled={busy || (users && row.isActive === false)} onClick={() => remove(row)} className="font-semibold text-red-700">{users ? "Nonaktifkan" : "Hapus"}</button></div>
    </article>)}</div>
    {data?.data.length === 0 && <p className="mt-4 text-sm text-slate-500">Belum ada data.</p>}
    {!data && !error && <p className="mt-4 text-sm">Memuat...</p>}
  </section>;
}

export default function Management() {
  const user = useSession();
  if (user.role !== "ADMIN") return null;
  return <><Crud id="kategori" title="Kelola Kategori" path="/api/admin/categories" fields={categoryFields} /><Crud id="pengguna" title="Kelola Pengguna Internal" path="/api/admin/users" fields={userFields} users /><Crud id="layanan" title="Kelola Layanan Publik" path="/api/admin/services" fields={serviceFields} /></>;
}
