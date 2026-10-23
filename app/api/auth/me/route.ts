import { api } from "@/src/lib/http";
import { requireUser } from "@/src/lib/auth";
export const GET = api(async (req: Request) => { const user = await requireUser(req); return Response.json({ data: { id: user.id, username: user.username, role: user.role } }); });
