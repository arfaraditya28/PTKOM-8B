import { prisma } from "@/src/lib/prisma";
import { forbidden, getAuthUser, unauthorized } from "@/src/lib/auth";

/** GET /api/admin/users — daftar pengguna internal (khusus ADMIN). */
export async function GET(req: Request) {
  const user = getAuthUser(req);
  if (!user) return unauthorized();
  if (user.role !== "ADMIN") return forbidden("Hanya admin.");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      name: true,
      username: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return Response.json({ data: users });
}
