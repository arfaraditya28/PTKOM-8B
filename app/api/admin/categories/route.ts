import { prisma } from "@/src/lib/prisma";
import { forbidden, getAuthUser, unauthorized } from "@/src/lib/auth";
import { upsertCategorySchema } from "@/src/lib/validators";

/** GET /api/admin/categories — daftar kategori (khusus ADMIN). */
export async function GET(req: Request) {
  const user = getAuthUser(req);
  if (!user) return unauthorized();
  if (user.role !== "ADMIN") return forbidden("Hanya admin.");

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { reports: true } } },
  });
  return Response.json({ data: categories });
}

/** POST /api/admin/categories — tambah kategori (khusus ADMIN). */
export async function POST(req: Request) {
  const user = getAuthUser(req);
  if (!user) return unauthorized();
  if (user.role !== "ADMIN") return forbidden("Hanya admin.");

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Body harus JSON valid." }, { status: 400 });
  }

  const parsed = upsertCategorySchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Data kategori tidak valid.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const category = await prisma.category.create({ data: parsed.data });
    return Response.json({ data: category }, { status: 201 });
  } catch {
    return Response.json(
      { error: "Nama kategori sudah dipakai." },
      { status: 409 }
    );
  }
}
