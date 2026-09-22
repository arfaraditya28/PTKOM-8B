import { prisma } from "@/src/lib/prisma";
import { signToken, verifyPassword } from "@/src/lib/auth";
import { loginSchema } from "@/src/lib/validators";

/** POST /api/auth/login — login petugas & admin. */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Body harus JSON valid." }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Username dan password wajib diisi." },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { username: parsed.data.username },
  });
  // Samakan pesan error agar tidak membocorkan username mana yang terdaftar.
  if (!user || !(await verifyPassword(parsed.data.password, user.password))) {
    return Response.json(
      { error: "Username atau password salah." },
      { status: 401 }
    );
  }

  const token = signToken({
    id: user.id,
    username: user.username,
    role: user.role,
  });

  return Response.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      username: user.username,
      role: user.role,
    },
  });
}
