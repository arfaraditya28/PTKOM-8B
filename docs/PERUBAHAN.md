# Daftar perubahan dari ZIP branch syehab

Tanggal paket: 16 Oktober 2026. Dasar paket: 6 Oktober 2026. Perbandingan terhadap ZIP branch `syehab` yang tersedia pada percakapan ini. Tampilan frontend tetap sama.

- Diubah: `.env.example`
- Baru: `.github/workflows/ci.yml`
- Baru: `Jalankan-Backend.cmd`
- Diubah: `README.md`
- Diubah: `app/api/admin/categories/[id]/route.ts`
- Diubah: `app/api/admin/categories/route.ts`
- Baru: `app/api/admin/services/[id]/route.ts`
- Baru: `app/api/admin/services/route.ts`
- Diubah: `app/api/admin/statistics/route.ts`
- Baru: `app/api/admin/users/[id]/route.ts`
- Diubah: `app/api/admin/users/route.ts`
- Baru: `app/api/attachments/[id]/route.ts`
- Diubah: `app/api/auth/login/route.ts`
- Baru: `app/api/auth/logout/route.ts`
- Baru: `app/api/auth/me/route.ts`
- Diubah: `app/api/categories/route.ts`
- Baru: `app/api/public/reports/route.ts`
- Baru: `app/api/reports/[id]/attachments/route.ts`
- Diubah: `app/api/reports/[id]/comments/route.ts`
- Diubah: `app/api/reports/[id]/route.ts`
- Diubah: `app/api/reports/[id]/status/route.ts`
- Baru: `app/api/reports/[id]/visibility/route.ts`
- Diubah: `app/api/reports/route.ts`
- Baru: `app/api/services/route.ts`
- Diubah: `app/api/tracking/[code]/route.ts`
- Diubah: `docs/API.md`
- Baru: `docs/BACKEND.md`
- Diubah: `docs/DATABASE.md`
- Baru: `docs/HASIL-PENGUJIAN.md`
- Baru: `docs/KOLABORASI.md`
- Baru: `docs/PERBAIKAN-KATEGORI.md`
- Baru: `docs/PTKOM-Backend.postman_collection.json`
- Baru: `docs/TERAPKAN-DI-LAPTOP.md`
- Baru: `docs/sql/fresh-database.sql`
- Baru: `docs/sql/upgrade-from-original.sql`
- Diubah: `package-lock.json`
- Diubah: `package.json`
- Diubah: `prisma/schema.prisma`
- Diubah: `prisma/seed.ts`
- Baru: `scripts/check-backend.ts`
- Baru: `scripts/integration.ts`
- Baru: `scripts/sync-counters.ts`
- Baru: `src/lib/attachments.ts`
- Diubah: `src/lib/auth.ts`
- Baru: `src/lib/http.ts`
- Baru: `src/lib/readiness.ts`
- Diubah: `src/lib/reportMeta.ts`
- Baru: `src/lib/users.ts`
- Diubah: `src/lib/validators.ts`
- Baru: `src/lib/workflow.ts`
- Baru: `tests/backend.test.ts`
- Baru: `tests/embedded.ts`
- Baru: `tests/fixtures/original-schema.sql`
- Baru: `tests/readiness.test.ts`
- Baru: `tests/upgrade.test.ts`

## Tambahan paket lengkap 16 Oktober

- Baru: `app/api/health/route.ts`
- Baru: `docs/UPLOAD-GITHUB.md`
- Baru: `scripts/setup-env.ts`
- Baru: `scripts/test-http.ts`
- Baru: `src/lib/environment.ts`
- Baru: `src/lib/seed.ts`
- Baru: `tests/environment.test.ts`
- Baru: `tests/seed.test.ts`
- Diubah: `.gitignore`, workflow CI, setup/seed, retry pembuatan laporan, script integrasi dan panduan.

Seluruh fitur inti PRD telah memiliki API. Tes diperluas menjadi 23 tes unit/database, 102 pemeriksaan embedded dan 100 pemeriksaan HTTP pada database lokal berisi akun awal. Detail lingkungan dan batas verifikasi ada di HASIL-PENGUJIAN.md. Schema dan frontend tetap sama dengan paket perbaikan sebelumnya.

Daftar ini ikut diperbarui. Paket tidak berisi `.env`, kredensial Neon, folder `.git`, dependency terpasang, atau hasil build. `Jalankan-Backend.cmd` membantu instalasi/generate/pemeriksaan/start; pemeriksaan database hanya membaca. Petunjuk penerapan ada di `TERAPKAN-DI-LAPTOP.md`. Tidak ada commit/push atau perubahan database bersama yang dilakukan.
