import { api } from "@/src/lib/http";
import { requireUser } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
export const POST = api(async (req: Request) => { const user = await requireUser(req); await prisma.user.update({ where: { id: user.id }, data: { tokenVersion: { increment: 1 } } }); return Response.json({ message: "Semua sesi akun telah keluar." }); });
