# Panduan backend

## Cakupan

Pekerjaan melengkapi backend dari ZIP awal. API menggunakan origin yang sama dengan frontend (`/api/...`). Tidak perlu Express, Laravel, atau server backend terpisah. Tampilan dashboard, form pengaduan, dan koneksi komponen frontend ke API tetap menjadi pekerjaan frontend.

## Konfigurasi

- `DATABASE_URL`: connection string PostgreSQL pengembangan (Neon), termasuk SSL sesuai connection string provider.
- `JWT_SECRET`: rahasia acak minimal 32 karakter; gunakan perintah generator di README.
- `SEED_ADMIN_PASSWORD`, `SEED_PETUGAS_PASSWORD`: password untuk pembuatan pertama akun `admin` dan `petugas01`.
- Masa sesi internal tetap 12 jam; token upload 15 menit. `JWT_EXPIRES_IN` dari ZIP awal sudah tidak dipakai.

Jalankan `npm.cmd ci`, `npm.cmd run env:setup`, isi DATABASE_URL pada `.env`, kemudian `npm.cmd run db:setup` pada database baru. `env:setup` membuat secret/password yang kosong tanpa mencetak nilainya; URL dan konfigurasi yang sudah valid tetap dipertahankan. Perintah db:setup melakukan generate, db push, sinkronisasi counter, dan seed. Seed tidak mengganti akun, password atau kategori yang sudah ada dan tidak membuat laporan demo. Password seed hanya wajib untuk akun yang belum ada. Kategori awal: Infrastruktur, Kebersihan, Administrasi, Keamanan, Kesehatan, Pendidikan. Layanan dibuat melalui API admin.

`npm run backend:check` memeriksa URL PostgreSQL, panjang JWT_SECRET, koneksi database, kolom yang dibutuhkan serta sinkronisasi counter. Semua query-nya SELECT; tidak mengubah data atau schema. URL/password/secret tidak dicetak pada pesan error. Schema khusus dari parameter `schema` pada DATABASE_URL didukung. Pemeriksaan ini mendeteksi prasyarat dasar, bukan pemeriksaan menyeluruh indeks/constraint atau pengganti tes integrasi.

`GET /api/health` memeriksa konfigurasi dasar dan koneksi SELECT 1. Respons 200 berisi `{"status":"ok"}`; gangguan menghasilkan 503 `{"status":"error"}`. Endpoint ini tidak mengirim nama database, URL, kredensial atau rincian schema. Jalankan backend:check untuk pemeriksaan struktur sebelum menerima laporan.

Di Windows, `Jalankan-Backend.cmd` menjalankan instalasi bersih dependency, generate Prisma Client, pemeriksaan tersebut dan dev server secara berurutan. Jika ada tahap gagal, proses berhenti sebelum server dibuka. Konfigurasi, upgrade database dan akun awal tetap mengikuti panduan di atas.

## Upgrade database yang sudah digunakan

1. Buat backup atau branch database uji terlebih dahulu. Hentikan sementara pengiriman laporan selama upgrade.
2. Arahkan `.env` ke salinan database pengembangan yang dituju.
3. `npm ci`, lalu `npm run db:generate` dan `npm run db:push`.
4. Jika Prisma meminta penghapusan data, jangan gunakan `--accept-data-loss`; periksa perbedaan schema dengan tim.
5. Jalankan `npm run db:sync-counters`, lalu `npm run db:seed` bila kategori/akun awal diperlukan.
6. Jalankan tes pada salinan database sebelum mengganti lingkungan kelompok.

`docs/sql/upgrade-from-original.sql` adalah SQL perubahan dari schema ZIP awal; gunakan hanya jika memilih upgrade SQL manual, sebagai pengganti `db:push`, bukan menjalankan keduanya. Jalankan SQL manual dalam transaksi pada salinan database terlebih dahulu. `fresh-database.sql` hanya untuk database kosong dan pengujian embedded.

Data akun, laporan dan riwayat lama dipertahankan. `StatusHistory.userId` menjadi nullable agar pembuatan laporan warga dapat dicatat sebagai sistem, bukan mengatasnamakan admin pertama. Riwayat lama tidak ditulis ulang. `Attachment.fileUrl` lama dipertahankan, sementara upload baru memakai bytes database. Bukti lama yang belum memiliki bytes menghasilkan 410 saat diunduh; petugas perlu migrasi/unggah ulang file tersebut. Counter wajib disinkronkan agar nomor baru melanjutkan nomor yang sudah ada.

## Alur frontend masyarakat

1. GET `/api/categories` untuk opsi kategori.
2. POST `/api/reports` dengan JSON laporan. Simpan `reportNumber` dan `trackingCode` untuk ditampilkan kepada warga.
3. Bila ada bukti, kirim satu file per request ke POST `/api/reports/{id}/attachments`, memakai `Authorization: Bearer {uploadToken}`. Field multipart bernama `file`; biarkan browser mengatur Content-Type/boundary.
4. Maksimal tiga file per laporan, masing-masing maksimal 5 MB, jenis PNG/JPEG/PDF. Token upload berlaku 15 menit; jika kedaluwarsa, bantuan petugas diperlukan. Jangan memakai kode tracking sebagai izin upload.
5. GET `/api/tracking/{trackingCode}` menampilkan status dan tanggapan. Kode tracking adalah rahasia akses laporan; hindari log/analytics yang merekamnya.
6. GET `/api/public/reports` untuk daftar laporan yang telah dipublikasikan admin; GET `/api/services` untuk layanan aktif.

Contoh upload browser:

```javascript
const form = new FormData();
form.append('file', fileInput.files[0]);
const response = await fetch(`/api/reports/${report.id}/attachments`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${report.uploadToken}` },
  body: form,
});
const result = await response.json();
if (!response.ok) throw new Error(result.error);
```

## Alur frontend petugas/admin

POST login mengembalikan token dan informasi user. Sertakan `Authorization: Bearer TOKEN` pada request internal. Token tidak diletakkan di URL. Periksa respons 401/403 dan arahkan ke login bila sesi tidak berlaku. Endpoint logout membatalkan semua sesi akun, bukan hanya perangkat sekarang.

Akun yang dinonaktifkan langsung ditolak; semua perubahan akun meningkatkan versi token sehingga sesi lama tidak berlaku. Password tidak pernah dikirim pada daftar/detail akun. DELETE akun adalah penonaktifan agar riwayat tetap utuh. Admin aktif terakhir tidak dapat dinonaktifkan atau diturunkan rolenya.

Alur status yang diterapkan: DIAJUKAN → DIVERIFIKASI → DIPROSES → SELESAI. Dari tiga status awal dapat menuju DITOLAK dengan alasan wajib. SELESAI/DITOLAK tidak dapat dibuka ulang melalui API. Perubahan status dan riwayat dicatat dalam satu transaksi; konflik ditolak atau dicoba ulang. Ini merupakan aturan implementasi dari alur PRD, yang dapat diubah bersama tim jika kebijakan layanan berubah.

Semua tanggapan komentar terlihat pada tracking warga; jangan masukkan data pribadi ke komentar. Catatan status (`note`) hanya terlihat internal. Publikasi mensyaratkan `publicTitle` dan `publicSummary` yang sudah dibersihkan admin. API tidak melakukan penyamaran otomatis isi teks.

## Pengujian

```powershell
npm.cmd run verify
```

Perintah ini menjalankan lint, unit/database test, integrasi embedded, build dan TypeScript secara berurutan.

`test:embedded` menjalankan handler API sebenarnya melalui objek Request/Response dengan PostgreSQL sementara PGlite. Ini menguji SQL, relasi dan respons tanpa kredensial Neon serta tanpa membuka port. Data langsung hilang saat selesai. Ini bukan tes jaringan HTTP, TLS, pooling Neon, atau beban multi-instance.

Untuk menguji HTTP pada server yang berjalan: gunakan database uji terpisah di `.env`, jalankan setup dan `npm run dev` pada terminal pertama. Pada terminal kedua:

```powershell
$env:ALLOW_INTEGRATION_TEST = '1'
$env:TEST_BASE_URL = 'http://localhost:3000'
npm.cmd run test:integration
```

Script membuat data uji dengan penanda unik, lalu membersihkan akun, kategori, layanan dan laporan milik pengujian pada akhir proses, termasuk ketika pemeriksaan gagal. Counter tetap maju agar nomor laporan tidak digunakan ulang. Jika database tidak dapat diakses saat pembersihan, script melaporkan penandanya untuk diperiksa. Gunakan database uji terpisah. Tes memeriksa seluruh endpoint: login, role, laporan bersamaan, tracking, status, unggahan bersamaan, publikasi, akun nonaktif, perubahan password dan logout.

Untuk menjalankan server HTTP produksi secara otomatis setelah build:

```powershell
$env:ALLOW_INTEGRATION_TEST = '1'
npm.cmd run test:http
```

Runner memilih port loopback tersendiri, menunggu health, menjalankan test:integration, kemudian menutup server yang dibuatnya. DATABASE_URL tetap menunjuk database uji pada konfigurasi proses. Tidak perlu menjalankan dev server terpisah untuk mode ini. Workflow `.github/workflows/ci.yml` menyiapkan PostgreSQL 17 sementara dan menjalankan pemeriksaan yang sama; tidak memakai kredensial Neon.

Untuk pengujian manual, import koleksi Postman. Set `baseUrl`, `adminPassword`, `petugasPassword`; jalankan Login admin, Tambah kategori, lalu Buat laporan. Response menyimpan ID/token ke variabel koleksi. Jalankan urutan status sesuai alur. Untuk upload, pilih file pada body form-data.

## Batas implementasi

- Koneksi Neon kelompok belum diverifikasi karena ZIP tidak berisi kredensial. Tidak ada perubahan ke database kelompok atau publikasi server.
- Bytes file disimpan di PostgreSQL supaya prototype dapat berjalan tanpa layanan file tambahan. Untuk banyak file/traffic besar, gunakan object storage privat dan proses scanning malware. Pemeriksaan sekarang membatasi ukuran dan signature, bukan antivirus.
- Sebelum dipublikasikan untuk masyarakat luas, pasang pembatasan request/rate limiting pada gateway/hosting untuk login, pembuatan laporan, tracking dan upload; tentukan retensi bukti dan backup. Belum ada rate limiter terdistribusi atau CAPTCHA di paket ini.
- PGlite mengeksekusi transaksi pada satu database embedded; pengujian beban/koneksi bersamaan nyata tetap perlu dijalankan di PostgreSQL/Neon uji.
- Frontend dan font dari branch `syehab` dipertahankan. Build membutuhkan akses Google Fonts karena konfigurasi `next/font/google` proyek awal.
