import { api, body } from "@/src/lib/http";
import { requireUser } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { patchServiceSchema } from "@/src/lib/validators";
export const PATCH = api(async (req: Request, ctx: { params: Promise<{ id: string }> }) => { await requireUser(req, true); const { id } = await ctx.params; return Response.json({ data: await prisma.service.update({ where: { id }, data: await body(req, patchServiceSchema) }) }); });
export const DELETE = api(async (req: Request, ctx: { params: Promise<{ id: string }> }) => { await requireUser(req, true); const { id } = await ctx.params; await prisma.service.delete({ where: { id } }); return Response.json({ message: "Layanan dihapus." }); });
