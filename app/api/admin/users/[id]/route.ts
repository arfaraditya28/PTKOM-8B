import { api, body } from "@/src/lib/http";
import { requireUser } from "@/src/lib/auth";
import { updateUserSchema } from "@/src/lib/validators";
import { changeUser } from "@/src/lib/users";
export const PATCH = api(async (req: Request, ctx: { params: Promise<{ id: string }> }) => {
  await requireUser(req, true); const { id } = await ctx.params;
  return Response.json({ data: await changeUser(id, await body(req, updateUserSchema)) });
});
export const DELETE = api(async (req: Request, ctx: { params: Promise<{ id: string }> }) => {
  await requireUser(req, true); const { id } = await ctx.params;
  return Response.json({ data: await changeUser(id, { isActive: false }), message: "Akun dinonaktifkan; riwayat tetap disimpan." });
});
