import { api, body } from "@/src/lib/http";
import { requireUser } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { serviceSchema } from "@/src/lib/validators";
export const GET = api(async (req: Request) => { await requireUser(req, true); return Response.json({ data: await prisma.service.findMany({ orderBy: { name: "asc" } }) }); });
export const POST = api(async (req: Request) => { await requireUser(req, true); return Response.json({ data: await prisma.service.create({ data: await body(req, serviceSchema) }) }, { status: 201 }); });
