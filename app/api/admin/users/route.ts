import { api, body } from "@/src/lib/http";
import { requireUser, hashPassword } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { createUserSchema } from "@/src/lib/validators";
import { userSelect } from "@/src/lib/users";
export const GET = api(async (req: Request) => { await requireUser(req, true); return Response.json({ data: await prisma.user.findMany({ select: userSelect, orderBy: { createdAt: "asc" } }) }); });
export const POST = api(async (req: Request) => {
  await requireUser(req, true); const data = await body(req, createUserSchema);
  const user = await prisma.user.create({ data: { ...data, password: await hashPassword(data.password) }, select: userSelect });
  return Response.json({ data: user }, { status: 201 });
});
