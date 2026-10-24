import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAuthUser } from "@/src/lib/auth";
import { SESSION_COOKIE } from "@/src/lib/session";

export const dynamic = "force-dynamic";
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) redirect("/login");
  const user = await getAuthUser(new Request("http://localhost/admin", { headers: { authorization: `Bearer ${token}` } }));
  if (!user) redirect("/login");
  return children;
}
