# Hasil pengujian — 24 Oktober 2026

Dasar: ZIP main terbaru yang dikirim pengguna. Lingkungan lokal: Node.js 24.19.0, npm 11.9.0, Next.js 16.3.5, Prisma Client 6.19.3. Dependency mengikuti package-lock.json.

| Pemeriksaan | Hasil aktual |
|---|---|
| npm ci --offline dari cache dependency | Berhasil, 464 paket |
| Generate Prisma Client | Lulus |
| Lint | Lulus tanpa error/peringatan ESLint |
| Unit dan database (npm test) | 28 tes lulus |
| Integrasi embedded | 121 pemeriksaan lulus |
| Build produksi Next.js | Lulus |
| TypeScript (tsc --noEmit) | Lulus |
| Integrasi HTTP pada server Next.js produksi lokal | 121 pemeriksaan lulus |
| Browser Chromium melalui Playwright | 19 alur lulus; tanpa pageerror JavaScript |
| Pengecekan ukuran ponsel 390×844 | Halaman pengaduan tidak meluap horizontal |

## Alur browser yang dijalankan

1. /admin tanpa sesi mengarah ke login.
2. Form warga mengirim laporan, instansi tujuan dan bukti PDF; menampilkan nomor/kode serta keberhasilan unggah.
3. Tracking menunjukkan status tanpa identitas pelapor.
4. Login admin memakai cookie HttpOnly dan membuka dashboard data database; tidak membuat token localStorage.
5. Detail internal menampilkan pelapor, instansi dan bukti yang dapat diunduh.
6. Verifikasi laporan.
7. Proses laporan.
8. Selesaikan laporan; form ubah status tidak ditampilkan lagi.
9. Kirim tanggapan dan publikasikan judul/ringkasan yang telah diperiksa.
10. Unduh rekap CSV.
11. Tambah kategori dari dashboard.
12. Tambah akun petugas dari dashboard.
13. Tambah layanan aktif dari dashboard.
14. Muat ulang statistik serta tampilkan grafik/kategori dari database.
15. Logout dan penolakan akses ulang admin.
16. Layanan dan laporan publik tampil dengan data tersimpan tanpa identitas warga.
17. Tracking menampilkan tanggapan setelah laporan selesai.
18. Akun petugas yang dibuat melalui dashboard dapat login; tidak mendapat menu admin dan API pengguna menolak dengan 403.
19. Form warga tetap dapat dipakai pada ukuran ponsel.

## Cakupan unit/integrasi

Validasi tanggal/teks/field/JSON/query/password, nomor laporan WIB, tanda tangan file, token upload khusus laporan, error Prisma lintas bundle, status akhir, penolakan beralasan, akun nonaktif/perubahan password/logout, perlindungan admin terakhir, kategori yang dipakai (409), kategori kosong (hapus berhasil), unggahan bersamaan, batas tiga file/5 MB, privasi tracking/publikasi, statistik dan ekspor. Login cookie, mutasi same-origin dan penolakan origin lain juga diuji lewat HTTP.

Upgrade SQL diuji terhadap schema asli: password, instansi, nomor/kode laporan, kontak, bukti lama dan riwayat dipertahankan. Upgrade dari backend 16 Oktober menambah agency secara idempotent. Readiness memakai SELECT dan mendeteksi kolom/counter yang belum siap. Seed ulang tidak menimpa akun/password/kategori yang sudah ada.

## Lingkungan dan batas verifikasi

Unit/database dan embedded menggunakan PostgreSQL sementara PGlite 0.3.14 dengan adapter Prisma. Tes HTTP menggunakan server Next.js produksi sebenarnya (HTTP, JSON, multipart, cookie, unduhan dan route bundling), dengan Prisma adapter ke PGlite di proses yang sama. Browser memakai Chromium headless dan data uji lokal yang dibuat untuk sesi pengujian; bukan akun atau database kelompok. Server/alat browser sementara tidak masuk ZIP.

Ini belum menguji koneksi TCP/TLS/pooling Neon, PostgreSQL server native, database kelompok, beban besar, multi-instance hosting, atau instalasi Windows langsung. Jalankan test:http pada database pengembangan tim bila perlu membuktikan lingkungan tersebut. Workflow CI menyiapkan PostgreSQL 17 sementara, tetapi hasil Actions tidak dapat dinyatakan sebelum workflow berjalan di GitHub. Tidak ada commit, push, PR baru, deployment, atau perubahan Neon pengguna yang dilakukan selama pengerjaan paket ini.

Landing page, profil wilayah, stylesheet global, aset public, PRD dan user flow dibandingkan byte demi byte dengan ZIP main dan tetap dipertahankan. Perubahan komponen lain dibutuhkan untuk integrasi fungsi backend; daftar file ada di PERUBAHAN.md.
