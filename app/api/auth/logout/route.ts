import { api } from "@/src/lib/http";
import { getAuthUser } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { sessionCookie } from "@/src/lib/session";
export const POST = api(async (req: Request) => {
  const user = await getAuthUser(req);
  if (user) await prisma.user.update({ where: { id: user.id }, data: { tokenVersion: { increment: 1 } } });
  return Response.json({ message: "Semua sesi akun telah keluar." }, {
    status: user ? 200 : 401, headers: { "Set-Cookie": sessionCookie(req, "", true) },
  });
});
