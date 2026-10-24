import test from "node:test";
import assert from "node:assert/strict";
import { api } from "../src/lib/http";
import { sessionCookie, isTrustedMutation } from "../src/lib/session";
import { csvCell } from "../app/api/reports/export/route";
import { createReportSchema } from "../src/lib/validators";

test("cookie sesi HttpOnly, SameSite dan HTTPS Secure; logout menghapusnya", () => {
  const https = new Request("https://example.test/api/auth/login");
  assert.match(sessionCookie(https, "signed"), /HttpOnly; SameSite=Lax; Max-Age=43200; Secure$/);
  assert.match(sessionCookie(https, "", true), /ptkom_session=;.*Max-Age=0/);
  assert.ok(!sessionCookie(new Request("http://localhost"), "signed").includes("Secure"));
});
test("mutasi cookie hanya menerima origin aplikasi; Bearer dan baca tetap didukung", async () => {
  const make = (headers: Record<string, string>) => new Request("https://portal.test/api/admin/categories", { method: "PATCH", headers });
  assert.equal(isTrustedMutation(make({ cookie: "ptkom_session=token", origin: "https://portal.test" })), true);
  assert.equal(isTrustedMutation(make({ cookie: "ptkom_session=token", origin: "https://other.test" })), false);
  assert.equal(isTrustedMutation(make({ cookie: "ptkom_session=token" })), false);
  assert.equal(isTrustedMutation(make({ authorization: "Bearer token" })), true);
  assert.equal(isTrustedMutation(new Request("http://localhost:3000/api/test", { method: "POST", headers: { host: "127.0.0.1:3000", origin: "http://127.0.0.1:3000", cookie: "ptkom_session=x" } })), true);
  assert.equal(isTrustedMutation(make({ "sec-fetch-site": "cross-site" })), false);
  const response = await api(async (req: Request) => Response.json({ method: req.method }))(make({ origin: "https://other.test" }));
  assert.equal(response.status, 403);
  assert.equal(response.headers.get("cache-control"), "no-store");
});
test("ekspor CSV mengutip koma, baris, kutip dan menetralkan formula spreadsheet", () => {
  for (const value of ["=SUM(A1)", "+1", "@cmd", " -2", "\t=cmd"]) assert.ok(csvCell(value).startsWith('"\''));
  assert.equal(csvCell('jalan, "rusak"\nbaris'), '"jalan, ""rusak""\nbaris"');
});
test("laporan frontend terbaru menerima instansi tanpa membolehkan field admin", () => {
  const report = { categoryId: "cat", title: "Jalan rusak", description: "Jalan perlu diperbaiki segera.", location: "Sekampung", incidentDate: "2026-09-22", reporterName: "Warga", reporterContact: "08123456789", agency: " Dinas PUPR " };
  assert.equal(createReportSchema.parse(report).agency, "Dinas PUPR");
  assert.equal(createReportSchema.safeParse({ ...report, isPublic: true }).success, false);
});
