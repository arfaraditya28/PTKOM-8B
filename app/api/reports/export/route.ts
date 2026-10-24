import { api } from "@/src/lib/http";
import { requireUser } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";

// Cegah spreadsheet menjalankan nilai sel sebagai formula.
export function csvCell(value: string): string {
  const safe = /^[\s]*[=+@-]/.test(value) ? `'${value}` : value;
  return `"${safe.replaceAll('"', '""')}"`;
}

export const GET = api(async (req: Request) => {
  await requireUser(req);
  const rows = await prisma.report.findMany({
    take: 10000, orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    select: { reportNumber: true, title: true, status: true, createdAt: true, category: { select: { name: true } } },
  });
  const lines = [["Nomor laporan", "Judul", "Kategori", "Status", "Tanggal masuk (WIB)"],
    ...rows.map(r => [r.reportNumber, r.title, r.category.name, r.status, r.createdAt.toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })])];
  return new Response("\uFEFF" + lines.map(row => row.map(csvCell).join(",")).join("\r\n"), {
    headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": 'attachment; filename="rekap-laporan.csv"' },
  });
});
