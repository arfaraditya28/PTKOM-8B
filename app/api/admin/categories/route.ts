import { api, body } from "@/src/lib/http";
import { requireUser } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { upsertCategorySchema } from "@/src/lib/validators";
export const GET = api(async (req: Request) => { await requireUser(req, true); return Response.json({ data: await prisma.category.findMany({ orderBy: { name: "asc" }, include: { _count: { select: { reports: true } } } }) }); });
export const POST = api(async (req: Request) => { await requireUser(req, true); return Response.json({ data: await prisma.category.create({ data: await body(req, upsertCategorySchema) }) }, { status: 201 }); });
