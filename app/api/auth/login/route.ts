import { api, body } from "@/src/lib/http";
import { prisma } from "@/src/lib/prisma";
import { signToken, verifyPassword } from "@/src/lib/auth";
import { loginSchema } from "@/src/lib/validators";
import { sessionCookie } from "@/src/lib/session";

/** POST /api/auth/login — login petugas & admin. */
export const POST = api(async function (req: Request) {
  const data = await body(req, loginSchema);

  const user = await prisma.user.findUnique({
    where: { username: data.username },
  });
  // Samakan pesan error agar tidak membocorkan username mana yang terdaftar.
  if (!user?.isActive || !(await verifyPassword(data.password, user.password))) {
    return Response.json(
      { error: "Username atau password salah." },
      { status: 401 }
    );
  }

  const token = signToken({
    id: user.id,
    username: user.username,
    role: user.role,
    tokenVersion: user.tokenVersion,
  });

  return Response.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      username: user.username,
      role: user.role,
    },
  }, { headers: { "Set-Cookie": sessionCookie(req, token) } });
});
