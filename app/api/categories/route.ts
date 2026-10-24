import { api } from "@/src/lib/http";
import { prisma } from "@/src/lib/prisma";

/** GET /api/categories — publik, daftar kategori laporan. */
export const GET = api(async function () {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, description: true },
  });
  return Response.json({ data: categories });
});
