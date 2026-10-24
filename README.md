# Portal Kecamatan Sekampung — PTKOM 8B

Paket backend dan integrasi halaman dari `PTKOM-8B-main.zip` terbaru, 24 Oktober 2026. Next.js 16.3.5, Prisma 6.19.3, PostgreSQL/Neon. API dan halaman berjalan dalam satu aplikasi; tidak perlu server backend terpisah.

## Menjalankan di Windows

Buka folder **yang berisi package.json** di VS Code. Gunakan Node.js 22 atau 24 dan terminal PowerShell:

```powershell
npm.cmd ci
npm.cmd run env:setup
```

Buka `.env` sejajar dengan `package.json`, lalu isi `DATABASE_URL` menggunakan connection string database pengembangan milikmu. Jika sudah memiliki `.env` yang valid dari folder kerja sebelumnya, salin file itu ke folder ini. `env:setup` membuat JWT dan password awal yang masih kosong; tidak mengganti konfigurasi yang sudah terisi.

Untuk database baru:

```powershell
npm.cmd run db:setup
npm.cmd run backend:check
npm.cmd run dev
```

Untuk database yang sudah berisi data, gunakan salinan/branch database pengembangan, kemudian:

```powershell
npm.cmd run db:generate
npm.cmd run db:push
npm.cmd run db:sync-counters
npm.cmd run db:seed
npm.cmd run backend:check
npm.cmd run dev
```

Jangan lanjut dengan opsi `--accept-data-loss` bila Prisma meminta penghapusan data. Kolom baru bersifat tambahan; periksa perbedaan schema bila ada peringatan. Rincian upgrade ada di `docs/BACKEND.md`.

Biarkan terminal tetap menyala. Buka:

- `http://localhost:3000` — beranda dan layanan aktif.
- `http://localhost:3000/pelaporan` — kirim laporan beserta bukti.
- `http://localhost:3000/tracking` — lacak status dan tanggapan.
- `http://localhost:3000/laporan-publik` — laporan yang dipublikasikan admin.
- `http://localhost:3000/login` — login admin atau petugas.
- `http://localhost:3000/admin` — dashboard; meminta login terlebih dahulu.
- `http://localhost:3000/api/health` — status dasar backend/database.

Akun awal: **admin** dan **petugas01**. Password mengikuti `SEED_ADMIN_PASSWORD` dan `SEED_PETUGAS_PASSWORD` di `.env` saat akun pertama dibuat. Seed ulang tidak mengganti password akun lama. Laporan demo tidak dibuat; angka dashboard mengikuti data sebenarnya. Layanan awal kosong dan dapat ditambahkan admin.

## Fitur yang tersambung

- Laporan warga tanpa akun: kategori, instansi tujuan, validasi, nomor harian WIB dan kode tracking unik.
- Unggah sampai tiga bukti PNG/JPEG/PDF, maksimal 5 MB per file. Bukti disimpan privat; upload gagal dapat dicoba ulang tanpa membuat laporan baru.
- Tracking status dan tanggapan tanpa menampilkan identitas/kontak/bukti.
- Login cookie HttpOnly untuk browser dan Bearer token untuk klien API. Logout, penonaktifan akun dan perubahan akun membatalkan sesi.
- Dashboard dengan angka, grafik mingguan/bulanan dan sebaran kategori dari database; tombol perbarui untuk memuat data terbaru.
- Daftar laporan dengan pencarian, filter, pagination, urutan, detail, perubahan status, tanggapan dan bukti.
- Kelola kategori, akun internal, layanan serta publikasi ringkasan laporan khusus admin. Petugas hanya melihat fungsi yang sesuai rolenya.
- Ekspor rekap CSV maksimal 10.000 laporan terbaru, tanpa kontak/nama pelapor maupun kode tracking.

Alur status: DIAJUKAN → DIVERIFIKASI → DIPROSES → SELESAI. Penolakan membutuhkan alasan. Laporan baru tidak langsung ditampilkan publik; admin menulis judul/ringkasan publik yang bebas identitas warga.

## Pengujian

```powershell
npm.cmd run verify
```

Menjalankan lint, unit/database test, integrasi embedded, build, dan TypeScript. Tidak memerlukan Neon untuk unit/embedded/build. Hasil pengujian aktual dan batasnya ada di `docs/HASIL-PENGUJIAN.md`.

Tes HTTP pada database uji milikmu (setelah build):

```powershell
$env:ALLOW_INTEGRATION_TEST = '1'
npm.cmd run test:http
```

Runner membuka server sendiri, menguji endpoint, membersihkan data milik pengujian dan menutup server. Counter tetap maju. Gunakan database uji terpisah.

