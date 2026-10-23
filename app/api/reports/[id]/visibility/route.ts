import { api, body } from "@/src/lib/http";
import { requireUser } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { visibilitySchema } from "@/src/lib/validators";
export const PATCH = api(async (req: Request, ctx: { params: Promise<{ id: string }> }) => {
  await requireUser(req, true); const { id } = await ctx.params; const data = await body(req, visibilitySchema);
  const report = await prisma.report.update({ where: { id }, data, select: { id: true, isPublic: true, publicTitle: true, publicSummary: true } });
  return Response.json({ data: report });
});
