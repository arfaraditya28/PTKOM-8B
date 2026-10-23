# Hasil pengujian backend

Paket diperiksa 16 Oktober 2026 menggunakan Node.js 24.19.0 dan npm 11.9.0. Dependency mengikuti package-lock.json. Dasar paket adalah ZIP backend terakhir pada percakapan, termasuk perbaikan kategori tanggal 6 Oktober.

| Pemeriksaan | Hasil |
|---|---|
| Instalasi bersih npm ci | Berhasil |
| Generate Prisma Client 6.19.3 | Berhasil |
| npm test | 23 tes lulus |
| npm run test:embedded | 102 pemeriksaan lulus |
| npm run lint | Lulus |
| npm run build | Lulus; seluruh route API termasuk health terdaftar |
| npm run typecheck | Lulus |
| prisma db push pada database lokal sementara | Berhasil |
| Seed baru, seed ulang dan backend:check pada database lokal | Lulus |
| HTTP pada build produksi Next.js dan database lokal berisi akun seed | 100 pemeriksaan lulus; data seed dipertahankan dan laporan uji dibersihkan |

## Lingkungan dan batas hasil

Tes unit/database dan embedded menggunakan PGlite 0.3.14 serta Prisma adapter. Tes HTTP memakai build Next.js produksi, Prisma Client 6.19.3 dengan koneksi PostgreSQL melalui Prisma local dev yang didukung PGlite. Mode HTTP ini memakai TCP, pemrosesan multipart/JSON Next.js dan respons HTTP sebenarnya; bukan mengganti fetch dengan pemanggilan handler langsung. Proses PostgreSQL sistem tidak dapat dijalankan pada lingkungan ini.

Pengujian HTTP awal pada database kosong mencakup 102 pemeriksaan. Database dengan akun admin seed mencakup 100, karena dua pemeriksaan perlindungan admin terakhir hanya dijalankan jika akun admin uji merupakan satu-satunya admin aktif. Perlindungan tersebut juga diuji dalam mode embedded.

Pengujian PostgreSQL 17 asli disiapkan dalam GitHub Actions, tetapi workflow tersebut baru berjalan sesudah kode diunggah. Hasil lokal ini tidak menyatakan bahwa Actions, PostgreSQL jaringan, Neon pribadi/kelompok, Windows, TLS atau pooling Neon sudah diuji di lingkungan tersebut. Tidak ada perubahan yang dijalankan pada Neon pengguna atau repository GitHub.

## Cakupan pemeriksaan

- Tanggal kalender, leap year, whitespace, panjang teks, field tambahan, pagination dan filter.
- Password dan role, token khusus upload, pemetaan error Prisma lintas constructor, serta respons error tanpa pesan database privat.
- Pembuatan secret lokal tanpa mengganti URL, JWT valid, password terisi, komentar atau CRLF; perintah dapat diulang.
- Seed baru, penolakan password invalid sebelum penulisan, seed ulang tanpa mengubah password/akun/kategori, serta pembuatan akun yang masih kurang.
- Pemeriksaan schema lama/baru/custom schema dan counter dengan SELECT saja; upgrade SQL mempertahankan data, hash, tracking, lampiran dan riwayat lama.
- Seluruh endpoint API: health, login/profil/logout, kategori, akun, layanan, statistik, laporan, komentar, status, publikasi, tracking dan lampiran.
- Lima pembuatan laporan bersamaan menghasilkan nomor berbeda; unggahan bersamaan mempertahankan batas tiga bukti.
- Kategori yang dipakai ditolak dengan 409 tanpa menghapus kategori/laporan; kategori kosong dapat dihapus; data tidak ada menghasilkan 404.
- Tracking dan daftar publik tidak memuat field privat; laporan yang tidak dipublikasikan tidak muncul.
- Akun berubah/nonaktif dan logout membatalkan token; perubahan password berlaku; role petugas tidak dapat memakai fungsi admin.
- Status akhir tidak dibuka kembali dan tidak menerima bukti baru. Penolakan laporan membutuhkan alasan.
- Pembersihan data uji menyasar ID milik pengujian; akun/kategori seed tetap ada dan counter tidak diturunkan.

## Hal yang tetap dikerjakan pada lingkungan tim

Gunakan DATABASE_URL dan .env lokal milik pengguna. Hubungkan halaman frontend ke kontrak pada API.md. Untuk deployment publik, tentukan rate limiting pada hosting/gateway, backup, retensi bukti dan kebutuhan penyimpanan file sesuai volume penggunaan. Penerapan tersebut bukan hasil pengujian lokal paket ini.
