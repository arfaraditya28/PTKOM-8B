import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { Role } from "@prisma/client";

export type AuthUser = {
  id: string;
  username: string;
  role: Role;
};

function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET belum di-set di .env");
  return secret;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(user: AuthUser): string {
  return jwt.sign(
    { sub: user.id, username: user.username, role: user.role },
    getSecret(),
    { expiresIn: process.env.JWT_EXPIRES_IN ?? "12h" } as jwt.SignOptions
  );
}

function bearerToken(req: Request): string | null {
  const header = req.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return null;
  return header.slice("Bearer ".length).trim() || null;
}

/** Mengembalikan user dari JWT Bearer, atau null bila tidak valid. */
export function getAuthUser(req: Request): AuthUser | null {
  const token = bearerToken(req);
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, getSecret()) as {
      sub: string;
      username: string;
      role: Role;
    };
    if (!decoded?.sub || !decoded?.role) return null;
    return { id: decoded.sub, username: decoded.username, role: decoded.role };
  } catch {
    return null;
  }
}

/** Response 401 standar agar konsisten di semua route. */
export function unauthorized(message = "Butuh login (Bearer token).") {
  return Response.json({ error: message }, { status: 401 });
}

/** Response 403 standar untuk role yang tidak diizinkan. */
export function forbidden(message = "Akses ditolak untuk role ini.") {
  return Response.json({ error: message }, { status: 403 });
}
