# API Documentation

## 1. Overview

API digunakan untuk menghubungkan frontend dengan logic aplikasi
pada Next.js.

Backend menggunakan Next.js Route Handlers melalui folder:

    app/api/

Project tidak menggunakan backend framework terpisah.

## 2. Authentication

Terdapat dua jenis akses:

### Public

Masyarakat tidak perlu login untuk:

- Melihat informasi publik
- Membuat laporan
- Melakukan tracking laporan

### Internal

Petugas dan Admin harus login untuk mengakses fitur internal.

## 3. Public API

### Get Categories

Method: `GET`

Endpoint:

    /api/categories

Mengambil daftar kategori laporan yang tersedia.

### Create Report

Method: `POST`

Endpoint:

    /api/reports

Digunakan untuk membuat laporan baru tanpa login.

Data yang dikirim:

    {
      "categoryId": "category-id",
      "title": "Judul laporan",
      "description": "Deskripsi laporan",
      "location": "Lokasi kejadian",
      "agency": "Instansi tujuan (opsional)",
      "incidentDate": "2026-09-22",
      "reporterName": "Nama pelapor",
      "reporterContact": "Kontak pelapor"
    }

Response:

    {
      "reportNumber": "LAP-20260922-0001",
      "trackingCode": "TRK-ABC123"
    }

### Track Report

Method: `GET`

Endpoint:

    /api/tracking/:code

Digunakan untuk melihat status laporan menggunakan kode tracking.

Contoh:

    /api/tracking/TRK-ABC123

Response:

    {
      "reportNumber": "LAP-20260922-0001",
      "status": "DIPROSES",
      "response": "Laporan sedang ditindaklanjuti."
    }

## 4. Authentication API

### Login

Method: `POST`

Endpoint:

    /api/auth/login

Digunakan oleh Petugas dan Admin.

Data:

    {
      "username": "petugas01",
      "password": "password"
    }

## 5. Petugas API

Endpoint berikut membutuhkan autentikasi Petugas atau Admin.

### Get Reports

Method: `GET`

Endpoint:

    /api/reports

Mengambil daftar laporan untuk diproses oleh petugas.

### Get Report Detail

Method: `GET`

Endpoint:

    /api/reports/:id

Mengambil detail laporan tertentu.

### Update Report Status

Method: `PATCH`

Endpoint:

    /api/reports/:id/status

Data:

    {
      "status": "DIPROSES"
    }

Status laporan:

- DIAJUKAN
- DIVERIFIKASI
- DIPROSES
- SELESAI
- DITOLAK

### Add Report Response

Method: `POST`

Endpoint:

    /api/reports/:id/comments

Data:

    {
      "message": "Laporan sedang ditindaklanjuti oleh petugas."
    }

## 6. Admin API

Endpoint berikut membutuhkan role Admin.

### Get Users

Method: `GET`

Endpoint:

    /api/admin/users

Mengambil daftar pengguna internal.

### Get Statistics

Method: `GET`

Endpoint:

    /api/admin/statistics

Mengambil statistik laporan.

### Manage Categories

Method:

- `GET`
- `POST`
- `PATCH`
- `DELETE`

Endpoint:

    /api/admin/categories
    /api/admin/categories/:id

Digunakan untuk mengelola kategori laporan.

## 7. Authorization

| Role | Login | Akses |
|---|---|---|
| Masyarakat | Tidak | Layanan publik, membuat laporan, tracking |
| Petugas | Ya | Mengelola dan memproses laporan |
| Admin | Ya | Mengelola sistem dan data |

## 8. Catatan

Dokumentasi API ini masih bersifat rancangan untuk prototype.

Endpoint, request, response, authentication, dan struktur data
dapat berubah selama proses pengembangan.
