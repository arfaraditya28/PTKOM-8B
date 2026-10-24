import { Prisma } from "@prisma/client";
import type { z } from "zod";
import { isTrustedMutation } from "./session";
export class ApiError extends Error {
  constructor(public status: number, message: string) { super(message); }
}
export function api<Args extends unknown[]>(handler: (...args: Args) => Promise<Response>) {
  return async (...args: Args): Promise<Response> => {
    let response: Response;
    try {
      if (args[0] instanceof Request && !isTrustedMutation(args[0])) throw new ApiError(403, "Permintaan harus berasal dari aplikasi ini.");
      response = await handler(...args);
    }
    catch (error) { response = errorResponse(error); }
    response.headers.set("Cache-Control", "no-store");
    response.headers.set("X-Content-Type-Options", "nosniff");
    return response;
  };
}
// Bundled routes may load another copy of Prisma's error constructor.
// Recognize its documented error shape as well as the local constructor.
export function prismaErrorCode(error: unknown): string | undefined {
  if (error instanceof Prisma.PrismaClientKnownRequestError) return error.code;
  if (typeof error !== "object" || error === null) return;
  const candidate = error as { name?: unknown; code?: unknown; clientVersion?: unknown };
  if (candidate.name === "PrismaClientKnownRequestError" &&
      typeof candidate.clientVersion === "string" &&
      typeof candidate.code === "string" && /^P\d{4}$/.test(candidate.code)) return candidate.code;
}
function errorResponse(error: unknown): Response {
  if (error instanceof ApiError) return Response.json({ error: error.message }, { status: error.status });
  const code = prismaErrorCode(error);
  if (code === "P2002") return Response.json({ error: "Data unik sudah digunakan." }, { status: 409 });
  if (code === "P2025") return Response.json({ error: "Data tidak ditemukan." }, { status: 404 });
  if (code === "P2003" || code === "P2014") return Response.json({ error: "Data masih digunakan atau relasi tidak valid." }, { status: 409 });
  if (code === "P2034") return Response.json({ error: "Data sedang berubah. Silakan ulangi permintaan." }, { status: 409 });
  console.error("API failure", error instanceof Error ? error.name : "UnknownError", code ?? "NO_PRISMA_CODE");
  return Response.json({ error: "Gangguan server. Silakan coba lagi." }, { status: 500 });
}
export async function boundedBody(req: Request, max: number): Promise<Uint8Array> {
  if (Number(req.headers.get("content-length")) > max) throw new ApiError(413, "Ukuran permintaan terlalu besar.");
  if (!req.body) throw new ApiError(400, "Body wajib diisi.");
  const reader = req.body.getReader(); const chunks: Uint8Array[] = []; let total = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read(); if (done) break;
      total += value.length;
      if (total > max) { await reader.cancel(); throw new ApiError(413, "Ukuran permintaan terlalu besar."); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  return Buffer.concat(chunks);
}
export async function body<T>(req: Request, schema: z.ZodType<T>): Promise<T> {
  if (!req.headers.get("content-type")?.includes("application/json")) throw new ApiError(415, "Gunakan Content-Type: application/json.");
  const bytes = await boundedBody(req, 64 * 1024);
  let raw: unknown;
  try { raw = JSON.parse(new TextDecoder().decode(bytes)); } catch { throw new ApiError(400, "Body harus JSON valid."); }
  const parsed = schema.safeParse(raw);
  if (!parsed.success) throw new ApiError(400, parsed.error.issues.map(i => `${i.path.join(".")}: ${i.message}`).join("; "));
  return parsed.data;
}
export async function serializable<T>(run: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
  const { prisma } = await import("./prisma");
  for (let attempt = 0; ; attempt++) {
    try { return await prisma.$transaction(run, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }); }
    catch (error) {
      if (prismaErrorCode(error) === "P2034" && attempt < 4) continue;
      throw error;
    }
  }
}
