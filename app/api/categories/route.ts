import { prisma } from "@/src/lib/prisma";

/** GET /api/categories — publik, daftar kategori laporan. */
export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, description: true },
  });
  return Response.json({ data: categories });
}
