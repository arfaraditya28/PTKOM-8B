# Database Documentation

## 1. Overview

Database digunakan untuk menyimpan data pengguna internal,
laporan masyarakat, kategori laporan, tanggapan, dan riwayat
perubahan status laporan.

Project direncanakan menggunakan Prisma sebagai ORM.

Struktur Prisma nantinya berada di:

    prisma/

## 2. User

Tabel `User` digunakan untuk menyimpan akun Petugas dan Admin.

Masyarakat tidak memiliki akun sehingga tidak disimpan sebagai
User.

| Field | Type | Keterangan |
|---|---|---|
| id | String | Primary key |
| name | String | Nama pengguna |
| username | String | Username |
| password | String | Password yang sudah di-hash |
| role | String | PETUGAS atau ADMIN |
| createdAt | DateTime | Waktu dibuat |
| updatedAt | DateTime | Waktu diperbarui |

## 3. Category

Tabel `Category` digunakan untuk menyimpan kategori laporan.

| Field | Type | Keterangan |
|---|---|---|
| id | String | Primary key |
| name | String | Nama kategori |
| description | String | Deskripsi kategori |
| createdAt | DateTime | Waktu dibuat |
| updatedAt | DateTime | Waktu diperbarui |

Satu kategori dapat digunakan oleh banyak laporan.

## 4. Report

Tabel `Report` digunakan untuk menyimpan laporan masyarakat.

Masyarakat dapat membuat laporan tanpa login.

| Field | Type | Keterangan |
|---|---|---|
| id | String | Primary key |
| reportNumber | String | Nomor laporan |
| trackingCode | String | Kode tracking |
| categoryId | String | Relasi ke Category |
| title | String | Judul laporan |
| description | String | Isi laporan |
| location | String | Lokasi kejadian |
| incidentDate | DateTime | Waktu kejadian |
| reporterName | String | Nama pelapor |
| reporterContact | String | Kontak pelapor |
| status | String | Status laporan |
| createdAt | DateTime | Waktu laporan dibuat |
| updatedAt | DateTime | Waktu diperbarui |

Report memiliki relasi dengan Category.

Report tidak memiliki relasi User untuk masyarakat.

## 5. Attachment

Tabel `Attachment` digunakan untuk menyimpan informasi
file bukti yang diunggah pada laporan.

| Field | Type | Keterangan |
|---|---|---|
| id | String | Primary key |
| reportId | String | Relasi ke Report |
| fileName | String | Nama file |
| fileUrl | String | Lokasi file |
| fileType | String | Jenis file |
| createdAt | DateTime | Waktu upload |

Satu laporan dapat memiliki beberapa attachment.

## 6. Comment

Tabel `Comment` digunakan untuk menyimpan tanggapan dari
Petugas atau Admin terhadap laporan.

| Field | Type | Keterangan |
|---|---|---|
| id | String | Primary key |
| reportId | String | Relasi ke Report |
| userId | String | Relasi ke User |
| message | String | Isi tanggapan |
| createdAt | DateTime | Waktu dibuat |

Satu laporan dapat memiliki beberapa tanggapan.

## 7. StatusHistory

Tabel `StatusHistory` digunakan untuk mencatat perubahan
status laporan.

| Field | Type | Keterangan |
|---|---|---|
| id | String | Primary key |
| reportId | String | Relasi ke Report |
| userId | String | Pengguna yang mengubah status |
| status | String | Status baru |
| note | String | Catatan perubahan |
| createdAt | DateTime | Waktu perubahan |

Status yang digunakan:

- DIAJUKAN
- DIVERIFIKASI
- DIPROSES
- SELESAI
- DITOLAK

## 8. Relasi Database

Relasi utama:

    User
     │
     ├── Comment
     │
     └── StatusHistory

    Category
       │
       └── Report
             │
             ├── Attachment
             ├── Comment
             └── StatusHistory

Masyarakat tidak memiliki akun dan tidak memiliki relasi
langsung ke tabel User.

## 9. Catatan Keamanan

- Password User harus disimpan dalam bentuk hash.
- Password tidak boleh disimpan dalam bentuk plaintext.
- Kode tracking digunakan untuk mengakses informasi laporan publik.
- Data pribadi pelapor tidak boleh ditampilkan pada halaman publik.
- Akses Petugas dan Admin harus menggunakan autentikasi dan otorisasi.

## 10. Catatan Project

Database ini masih berupa rancangan untuk prototype.

Struktur tabel, field, relasi, dan teknologi database dapat
berubah selama proses pengembangan.
