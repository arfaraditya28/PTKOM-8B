import { api } from "@/src/lib/http";
import { prisma } from "@/src/lib/prisma";
export const GET = api(async () => Response.json({ data: await prisma.service.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }) }));
