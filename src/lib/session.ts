// Cookie hanya menyimpan token bertanda tangan; browser tidak dapat membacanya.
export const SESSION_COOKIE = "ptkom_session";
export const SESSION_SECONDS = 12 * 60 * 60;

export function sessionFromRequest(req: Request): string | undefined {
  const value = req.headers.get("cookie")?.split(";")
    .map(part => part.trim()).find(part => part.startsWith(`${SESSION_COOKIE}=`));
  return value?.slice(SESSION_COOKIE.length + 1);
}

export function sessionCookie(req: Request, token: string, clear = false): string {
  const secure = new URL(req.url).protocol === "https:" ? "; Secure" : "";
  return `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${clear ? 0 : SESSION_SECONDS}${secure}`;
}

export function isTrustedMutation(req: Request): boolean {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return true;
  if (req.headers.get("authorization")?.startsWith("Bearer ")) return true;
  const origin = req.headers.get("origin");
  if (origin) {
    try {
      const target = new URL(req.url);
      // Next dapat memakai hostname internal pada req.url. Host adalah tujuan
      // permintaan browser; jangan mengambil x-forwarded-host dari klien.
      const host = req.headers.get("host") || target.host;
      const source = new URL(origin);
      return source.host === host && source.protocol === target.protocol;
    } catch { return false; }
  }
  if (req.headers.get("sec-fetch-site") === "cross-site") return false;
  return !sessionFromRequest(req);
}
