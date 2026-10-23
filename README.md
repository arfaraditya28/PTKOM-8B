# PTKOM 8B — Backend Portal Pengaduan Kecamatan Sekampung

Backend menggunakan Next.js Route Handlers, TypeScript, Prisma 6 dan PostgreSQL. Masyarakat dapat membuat laporan tanpa akun; petugas dan admin memakai login internal. Kebutuhan fitur mengikuti [PRD](docs/PRD.md) dan [alur pengguna](docs/USER-FLOW.md).

## Fitur

- Login, profil sesi dan logout; password disimpan sebagai hash bcrypt.
- Akun admin/petugas, pengaturan role, penonaktifan akun, pembatalan sesi dan perlindungan admin terakhir.
- Pengiriman laporan, nomor urut harian WIB dan kode tracking acak.
- Tracking status/tanggapan tanpa menampilkan identitas, kontak, lokasi atau bukti pelapor.
- Daftar laporan dengan pencarian, filter, pagination, detail dan riwayat.
- Alur DIAJUKAN → DIVERIFIKASI → DIPROSES → SELESAI; penolakan wajib disertai alasan.
- Unggah PNG/JPEG/PDF hingga 5 MB, maksimal tiga file per laporan; unduh bukti memerlukan login.
- Publikasi laporan memakai judul dan ringkasan yang ditinjau admin.
- Pengelolaan kategori dan layanan serta statistik laporan.
- Validasi request, penanganan error, pemeriksaan kesiapan dan tes otomatis.

Paket ini berisi backend dan frontend awal proyek. Halaman form, login dan dashboard beserta pemanggilan API dikerjakan pada bagian frontend. Daftar API dan contoh request tersedia di [docs/API.md](docs/API.md).

## Menjalankan di Windows

Gunakan Node.js 22 atau 24. Buka folder yang **langsung berisi `package.json`** di VS Code.

```powershell
npm.cmd ci
npm.cmd run env:setup
npm.cmd run db:generate
```

`env:setup` menyiapkan `.env` dan membuat secret/password awal yang kosong. DATABASE_URL, JWT yang sudah valid dan password yang sudah terisi dipertahankan. Buka `.env`, lalu isi DATABASE_URL dengan connection string PostgreSQL/Neon milikmu. Password akun awal tersimpan pada SEED_ADMIN_PASSWORD dan SEED_PETUGAS_PASSWORD.

**Database baru/kosong:**

```powershell
npm.cmd run db:setup
npm.cmd run backend:check
npm.cmd run dev
```

**Database yang sudah dipakai dengan paket backend sebelumnya dan setup berhasil:**

```powershell
npm.cmd run backend:check
npm.cmd run dev
```

Database lama dari kode awal mengikuti [panduan upgrade](docs/BACKEND.md#upgrade-database-yang-sudah-digunakan). Pemeriksaan kesiapan tidak mengubah database.

Server lokal: <http://localhost:3000>. Pemeriksaan koneksi: <http://localhost:3000/api/health>. Kategori: <http://localhost:3000/api/categories>.

Login melalui API/Postman memakai `admin` atau `petugas01` dengan password saat akun pertama dibuat. Seed ulang mempertahankan akun, password dan kategori lama.

## Pengujian

```powershell
npm.cmd run verify
```

Perintah tersebut menjalankan lint, unit/database test, integrasi embedded, build dan pemeriksaan TypeScript. Tes embedded menggunakan database sementara tanpa kredensial Neon.

Untuk menguji melalui server HTTP yang dijalankan otomatis, gunakan **database uji** yang sudah disiapkan dan hasil build terbaru:

```powershell
$env:ALLOW_INTEGRATION_TEST = "1"
npm.cmd run test:http
```

Server tes memakai port lokal sendiri dan ditutup sesudah tes. Data buatan tes dibersihkan; counter nomor laporan tetap maju. Pengujian PostgreSQL 17 juga disiapkan pada GitHub Actions untuk push ke `syehab`/`main` dan pull request. Hasil pemeriksaan paket dicatat di [docs/HASIL-PENGUJIAN.md](docs/HASIL-PENGUJIAN.md).

## Build dan penggunaan API

`npm.cmd run build` membuat build produksi; `npm.cmd start` menjalankannya. [Panduan backend](docs/BACKEND.md) menjelaskan konfigurasi, upgrade dan integrasi frontend. Koleksi [Postman](docs/PTKOM-Backend.postman_collection.json) tersedia untuk mencoba API tanpa menunggu halaman frontend.

## Unggah ke GitHub

Ikuti [docs/UPLOAD-GITHUB.md](docs/UPLOAD-GITHUB.md) untuk menyalin kode ke clone repository pada branch `syehab`, memeriksa perubahan, lalu commit dan push. ZIP tidak berisi riwayat Git, `.env`, dependency terpasang atau hasil build. Daftar perubahan ada di [docs/PERUBAHAN.md](docs/PERUBAHAN.md).
