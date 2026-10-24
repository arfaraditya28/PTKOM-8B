# Perubahan backend — 24 Oktober 2026

Dasar pengerjaan: PTKOM-8B-main.zip terbaru yang dikirim pengguna. Landing page, profil, karakteristik wilayah, stylesheet global, aset publik, PRD dan user flow asli dipertahankan. Komponen yang sebelumnya memakai data contoh dihubungkan ke API/database. Tidak ada perubahan langsung ke GitHub atau Neon kelompok.

Fitur: autentikasi cookie/Bearer, guard admin, pengelolaan laporan/status/tanggapan/bukti, pengguna/role/nonaktif, kategori, layanan, publikasi aman, tracking, penomoran atomik WIB, ekspor CSV dan statistik aktual. Instansi tujuan dari form terbaru disimpan pada Report.agency.

## Daftar file dibanding ZIP main

- Diubah: `.env.example`
- Baru: `.github/workflows/ci.yml`
- Diubah: `.gitignore`
- Baru: `Jalankan-Backend.cmd`
- Diubah: `README.md`
- Baru: `app/admin/layout.tsx`
- Diubah: `app/admin/page.tsx`
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
- Baru: `app/api/health/route.ts`
- Baru: `app/api/public/reports/route.ts`
- Baru: `app/api/reports/[id]/attachments/route.ts`
- Diubah: `app/api/reports/[id]/comments/route.ts`
- Diubah: `app/api/reports/[id]/route.ts`
- Diubah: `app/api/reports/[id]/status/route.ts`
- Baru: `app/api/reports/[id]/visibility/route.ts`
- Baru: `app/api/reports/export/route.ts`
- Diubah: `app/api/reports/route.ts`
- Baru: `app/api/reports/statistics/route.ts`
- Baru: `app/api/services/route.ts`
- Diubah: `app/api/tracking/[code]/route.ts`
- Baru: `app/laporan-publik/page.tsx`
- Baru: `app/login/page.tsx`
- Baru: `app/tracking/page.tsx`
- Diubah: `docs/API.md`
- Baru: `docs/BACKEND.md`
- Diubah: `docs/DATABASE.md`
- Baru: `docs/HASIL-PENGUJIAN.md`
- Baru: `docs/KOLABORASI.md`
- Baru: `docs/PTKOM-Backend.postman_collection.json`
- Baru: `docs/TERAPKAN-DI-LAPTOP.md`
- Baru: `docs/UPLOAD-GITHUB.md`
- Baru: `docs/sql/fresh-database.sql`
- Baru: `docs/sql/upgrade-from-backend-oct16.sql`
- Baru: `docs/sql/upgrade-from-original.sql`
- Diubah: `package-lock.json`
- Diubah: `package.json`
- Diubah: `prisma/schema.prisma`
- Diubah: `prisma/seed.ts`
- Baru: `scripts/check-backend.ts`
- Baru: `scripts/integration.ts`
- Baru: `scripts/setup-env.ts`
- Baru: `scripts/sync-counters.ts`
- Baru: `scripts/test-http.ts`
- Diubah: `src/components/Admin/Dashboard.tsx`
- Diubah: `src/components/Admin/KategoriAduan.tsx`
- Diubah: `src/components/Admin/Laporan.tsx`
- Diubah: `src/components/Admin/Layanan.tsx`
- Baru: `src/components/Admin/Management.tsx`
- Diubah: `src/components/Admin/NavbarAdmin.tsx`
- Baru: `src/components/Admin/ReportDetail.tsx`
- Baru: `src/components/Admin/Session.tsx`
- Diubah: `src/components/Admin/Statistik.tsx`
- Diubah: `src/components/Footer.tsx`
- Diubah: `src/components/LaporanPublik.tsx`
- Diubah: `src/components/Layanan.tsx`
- Diubah: `src/components/Pelaporan.tsx`
- Baru: `src/components/PublicServices.tsx`
- Baru: `src/hooks/useApi.ts`
- Baru: `src/lib/attachments.ts`
- Diubah: `src/lib/auth.ts`
- Baru: `src/lib/client-api.ts`
- Baru: `src/lib/environment.ts`
- Baru: `src/lib/http.ts`
- Baru: `src/lib/readiness.ts`
- Diubah: `src/lib/reportMeta.ts`
- Baru: `src/lib/seed.ts`
- Baru: `src/lib/session.ts`
- Baru: `src/lib/statistics.ts`
- Baru: `src/lib/users.ts`
- Diubah: `src/lib/validators.ts`
- Baru: `src/lib/workflow.ts`
- Baru: `tests/backend.test.ts`
- Baru: `tests/embedded.ts`
- Baru: `tests/environment.test.ts`
- Baru: `tests/fixtures/original-schema.sql`
- Baru: `tests/readiness.test.ts`
- Baru: `tests/seed.test.ts`
- Baru: `tests/session.test.ts`
- Baru: `tests/upgrade.test.ts`

`docs/PERUBAHAN.md` ini juga baru. `.env`, node_modules, .next, .git dan alat pengujian lokal tidak dimasukkan ke ZIP. SQL upgrade mempertahankan data lama. Konfigurasi database pada laptop tetap harus diisi/dipakai ulang.
