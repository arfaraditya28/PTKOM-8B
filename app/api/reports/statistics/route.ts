import { api } from "@/src/lib/http";
import { requireUser } from "@/src/lib/auth";
import { reportStatistics } from "@/src/lib/statistics";

export const GET = api(async (req: Request) => {
  const user = await requireUser(req);
  const data = await reportStatistics();
  return Response.json({ data: { ...data, totalUsers: user.role === "ADMIN" ? data.totalUsers : undefined } });
});
