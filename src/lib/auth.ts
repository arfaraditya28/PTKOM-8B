import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "./prisma";
import { ApiError } from "./http";
import type { Role } from "@prisma/client";
import { sessionFromRequest } from "./session";
export type AuthUser = { id: string; name?: string; username: string; role: Role; tokenVersion: number };
function secret(): string {
  const value = process.env.JWT_SECRET;
  if (!value || value.length < 32) throw new Error("JWT_SECRET minimal 32 karakter.");
  return value;
}
export const hashPassword = (password: string) => bcrypt.hash(password, 12);
export const verifyPassword = (password: string, hash: string) => bcrypt.compare(password, hash);
export function signToken(user: AuthUser) {
  return jwt.sign({ sub: user.id, version: user.tokenVersion, purpose: "session" }, secret(),
    { algorithm: "HS256", expiresIn: "12h", issuer: "ptkom", audience: "internal" });
}
function verify(req: Request, audience: string) {
  const header = req.headers.get("authorization");
  const token = header?.startsWith("Bearer ") ? header.slice(7) : (!header && audience === "internal" ? sessionFromRequest(req) : undefined);
  if (!token) return null;
  const key = secret();
  try {
    const data = jwt.verify(token, key, { algorithms: ["HS256"], issuer: "ptkom", audience });
    return typeof data === "object" ? data : null;
  } catch { return null; }
}
export async function getAuthUser(req: Request): Promise<AuthUser | null> {
  const data = verify(req, "internal");
  if (!data || data.purpose !== "session" || typeof data.sub !== "string" || !Number.isInteger(data.version)) return null;
  const user = await prisma.user.findUnique({ where: { id: data.sub } });
  if (!user?.isActive || user.tokenVersion !== data.version) return null;
  return { id: user.id, name: user.name, username: user.username, role: user.role, tokenVersion: user.tokenVersion };
}
export async function requireUser(req: Request, admin = false) {
  const user = await getAuthUser(req);
  if (!user) throw new ApiError(401, "Silakan login dengan akun aktif.");
  if (admin && user.role !== "ADMIN") throw new ApiError(403, "Hanya admin.");
  return user;
}
export function signUploadToken(reportId: string) {
  return jwt.sign({ sub: reportId, purpose: "upload" }, secret(),
    { algorithm: "HS256", expiresIn: "15m", issuer: "ptkom", audience: "attachment" });
}
export function canUpload(req: Request, reportId: string) {
  const data = verify(req, "attachment");
  return data?.purpose === "upload" && data.sub === reportId;
}
export function unauthorized(message = "Butuh login (Bearer token).") { return Response.json({ error: message }, { status: 401 }); }
export function forbidden(message = "Akses ditolak.") { return Response.json({ error: message }, { status: 403 }); }
