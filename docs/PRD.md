# Product Requirement Document

## 1. Nama Produk

Portal Layanan Pemerintah

## 2. Status Project

Prototype / Design Trial

## 3. Tujuan

Membuat prototype website layanan pemerintah yang mudah digunakan
untuk menampilkan informasi publik dan menyediakan layanan pengaduan
masyarakat secara digital.

## 4. Target Pengguna

### Masyarakat

Pengguna yang membutuhkan informasi publik dan ingin menyampaikan
laporan atau pengaduan.

Masyarakat tidak perlu membuat akun atau login untuk menggunakan
layanan pengaduan.

### Petugas

Pengguna internal yang bertugas menerima, memverifikasi, memproses,
dan memberikan tanggapan terhadap laporan masyarakat.

Petugas harus login untuk mengakses sistem.

### Admin

Pengguna internal yang mengelola sistem, pengguna, kategori,
layanan, dan data laporan.

Admin harus login untuk mengakses sistem.

## 5. Fitur Utama

### Public

- Landing page
- Informasi pemerintah
- Informasi wilayah
- Informasi layanan
- Daftar laporan publik

### Masyarakat

- Membuat laporan tanpa login
- Mengisi data laporan
- Mengunggah bukti pendukung
- Mendapatkan nomor laporan
- Mendapatkan kode tracking
- Melacak status laporan menggunakan kode tracking
- Melihat tanggapan terhadap laporan

### Petugas

- Login
- Dashboard laporan
- Melihat detail laporan
- Verifikasi laporan
- Mengubah status laporan
- Memberikan tanggapan
- Melihat riwayat proses laporan

### Admin

- Login
- Dashboard
- Kelola pengguna internal
- Kelola kategori
- Kelola laporan
- Kelola data layanan
- Melihat statistik laporan

## 6. Alur Laporan

Masyarakat membuat laporan
↓
Laporan diterima
↓
Diverifikasi
↓
Diproses
↓
Selesai

Laporan juga dapat ditolak apabila tidak memenuhi persyaratan.

## 7. Akses Pengguna

| Pengguna | Login | Akses |
|---|---|---|
| Masyarakat | Tidak | Layanan publik, membuat laporan, tracking |
| Petugas | Ya | Mengelola dan memproses laporan |
| Admin | Ya | Mengelola sistem dan data |

## 8. Catatan

Project ini masih dalam tahap prototype dan desain.
Struktur fitur, tampilan, API, dan database dapat berubah
sesuai hasil pengembangan dan diskusi tim.
