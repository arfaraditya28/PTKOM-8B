import { api } from "@/src/lib/http";
import { requireUser } from "@/src/lib/auth";
import { reportStatistics } from "@/src/lib/statistics";

export const GET = api(async (req: Request) => {
  await requireUser(req, true);
  return Response.json({ data: await reportStatistics() });
});
