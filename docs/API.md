# Kontrak API

Base URL lokal: `http://localhost:3000`. Request JSON memakai `Content-Type: application/json` (maksimal 64 KiB). Endpoint internal memakai cookie sesi HttpOnly dari login browser atau `Authorization: Bearer TOKEN` pada Postman/CLI. Mutasi cookie wajib same-origin. Respons sukses umumnya `{ "data": ... }`; login, pembuatan laporan dan tracking memiliki format khusus. Respons gagal `{ "error": "Pesan" }`.

## Endpoint

| Method | Path | Akses / fungsi |
|---|---|---|
| GET | /api/health | Publik, konfigurasi dasar dan koneksi database; 200/503 |
| GET | /api/categories | Publik, kategori |
| POST | /api/reports | Publik, buat laporan |
| GET | /api/tracking/:code | Publik dengan kode rahasia, status/tanggapan |
| GET | /api/public/reports | Publik, hanya laporan yang disetujui admin |
| GET | /api/services | Publik, layanan aktif |
| POST | /api/auth/login | Login internal |
| GET | /api/auth/me | Sesi internal saat ini |
| POST | /api/auth/logout | Batalkan seluruh sesi akun |
| GET | /api/reports | Petugas/admin, daftar dengan filter/pagination |
| GET | /api/reports/statistics | Petugas/admin, statistik dashboard dan tren WIB |
| GET | /api/reports/export | Petugas/admin, rekap CSV maksimal 10.000 laporan terbaru |
| GET | /api/reports/:id | Petugas/admin, detail dan metadata bukti |
| PATCH | /api/reports/:id/status | Petugas/admin, ubah status |
| POST | /api/reports/:id/comments | Petugas/admin, tanggapan untuk warga |
| POST | /api/reports/:id/attachments | Token upload laporan atau petugas/admin |
| GET | /api/attachments/:id | Petugas/admin, unduh bukti |
| DELETE | /api/attachments/:id | Admin, hapus bukti |
| PATCH | /api/reports/:id/visibility | Admin, atur publikasi |
| GET, POST | /api/admin/users | Admin, daftar/tambah akun |
| PATCH, DELETE | /api/admin/users/:id | Admin, ubah/nonaktifkan akun |
| GET, POST | /api/admin/categories | Admin, daftar/tambah kategori |
| PATCH, DELETE | /api/admin/categories/:id | Admin, ubah/hapus kategori |
| GET, POST | /api/admin/services | Admin, daftar/tambah layanan |
| PATCH, DELETE | /api/admin/services/:id | Admin, ubah/hapus layanan |
| GET | /api/admin/statistics | Admin, total, per status/kategori dan jumlah akun |

## Login

Health: `GET /api/health` mengembalikan `{"status":"ok"}` dengan 200, atau `{"status":"error"}` dengan 503. Pemeriksaan struktur lengkap tersedia melalui CLI backend:check.

```json
{"username":"admin","password":"PASSWORD_DARI_ENV"}
```

Respons: `{ "token": "JWT", "user": { "id": "...", "name": "...", "username": "admin", "role": "ADMIN" } }`. Token berlaku 12 jam; login juga memasang cookie HttpOnly untuk halaman browser. Password tidak dikembalikan. `/auth/me` mengembalikan id, name, username, role; `/auth/logout` membatalkan semua token sesi akun.

## Membuat laporan

```json
{
  "categoryId": "ID_DARI_API_CATEGORIES",
  "title": "Jalan berlubang di Sekampung",
  "description": "Terdapat lubang besar yang membahayakan pengendara.",
  "location": "Jalan Raya Sekampung",
  "incidentDate": "2026-09-22",
  "reporterName": "Warga Contoh",
  "reporterContact": "081234567890"
}
```

Respons **201**:

```json
{
  "id": "REPORT_ID",
  "reportNumber": "LAP-20260924-0001",
  "trackingCode": "TRK_KODE_UNIK",
  "uploadToken": "JWT_UPLOAD_KHUSUS_LAPORAN",
  "uploadExpiresIn": 900
}
```

Field opsional `agency` menerima instansi tujuan (1–200 karakter).

Tanggal kejadian harus YYYY-MM-DD yang benar secara kalender; spasi di awal/akhir dibersihkan. Nomor laporan mengikuti hari WIB saat pembuatan, bukan tanggal kejadian. Jangan mengirim field tambahan seperti status/isPublic. Status awal selalu DIAJUKAN.

## Daftar laporan dan tracking

`GET /api/reports?status=DIPROSES&categoryId=ID&q=jalan&page=1&limit=20&sort=newest`. `sort` menerima newest (default) atau oldest. Pencarian internal mencakup judul, nomor dan lokasi. Page minimal 1, maksimal 10000; limit bilangan bulat 1–100, default 20. Respons memiliki `data` dan `pagination: {page, limit, total, pages}`. Daftar publik menerima parameter sama tetapi pencarian hanya pada judul publik. Query yang tidak dikenal ditolak.

Tracking mengembalikan `reportNumber`, `status`, `response` (tanggapan terakhir atau null), serta `detail` dengan judul, kategori, waktu, tanggapan dan riwayat status. Nama/kontak/lokasi/bukti serta note internal tidak dikembalikan. Judul asli terlihat pada tracking kepada pemegang kode, tetapi tidak pada daftar publik.

## Status dan tanggapan

PATCH status: `{"status":"DIVERIFIKASI","note":"Data telah diverifikasi"}`.

Alur: DIAJUKAN → DIVERIFIKASI → DIPROSES → SELESAI. Tiga status awal bisa DITOLAK; `note` wajib untuk penolakan. Status akhir tidak dapat dibuka ulang. Lompatan status atau status yang sama menghasilkan 409. Catatan internal maksimal 500 karakter.

POST comments: `{"message":"Laporan sedang ditangani petugas."}`. Pesan 1–2000 karakter, terlihat oleh pemegang kode tracking.

## Bukti

POST attachment memakai `multipart/form-data`, tepat satu field `file`. Gunakan Bearer uploadToken yang diperoleh saat membuat laporan, atau token petugas/admin. Token upload tidak dapat mengakses endpoint internal atau laporan lain. File PNG/JPEG/PDF, maksimal 5 MB, tiga file per laporan. Jenis dicek dengan signature bytes; nama penyimpanan dibuat server. Laporan selesai/ditolak tidak menerima file baru.

Respons 201: `data` berisi id, fileName, fileType, size, createdAt. Unduh memakai GET /api/attachments/:id dengan token internal. DELETE hanya admin. Record file lama tanpa bytes menghasilkan 410.

## Publikasi

```json
{"isPublic":true,"publicTitle":"Perbaikan jalan wilayah Sekampung","publicSummary":"Laporan kerusakan jalan sedang ditangani petugas."}
```

Admin wajib memastikan teks tidak mengandung identitas warga. Menutup publikasi: `{"isPublic":false}`. Default seluruh laporan baru dan lama adalah tidak publik.

## Akun

POST: `{"name":"Petugas Baru","username":"petugas02","password":"PasswordPilihan123","role":"PETUGAS"}`.

PATCH menerima sebagian name, username, password, role, isActive. Password minimal 10 karakter dan maksimal 72 byte. Role ADMIN/PETUGAS. `{"isActive":true}` mengaktifkan akun kembali. Semua perubahan membatalkan sesi lama. DELETE menonaktifkan akun. Admin aktif terakhir dilindungi (409).

## Kategori dan layanan

Kategori POST: `{"name":"Infrastruktur","description":"Jalan dan fasilitas umum"}`. PATCH menerima sebagian field, tidak boleh kosong. Nama unik. Kategori yang sudah digunakan laporan tidak dapat dihapus (409).

Layanan POST:

```json
{"name":"Surat Keterangan","description":"Pelayanan surat keterangan warga.","requirements":"KTP dan KK","hours":"Senin–Jumat 08.00–15.00","contact":"Loket kecamatan","isActive":true}
```

PATCH menerima sebagian field. DELETE menghapus layanan. Hanya layanan aktif tampil pada GET publik.

## Kode respons

200 berhasil; 201 dibuat; 400 validasi/body/query salah; 401 token tidak ada/tidak valid/akun nonaktif; 403 role tidak berhak; 404 data tidak ditemukan; 409 konflik/duplikat/aturan bisnis; 410 file lama belum dimigrasi; 413 ukuran terlalu besar; 415 format body/file tidak didukung; 500 gangguan server/database; 503 health belum siap. Detail database dan stack trace tidak dikirim ke klien.

## Statistik dan ekspor

`GET /api/reports/statistics`: sesi ADMIN/PETUGAS; `data` berisi total, byStatus, byCategory, weekly, monthly dan year. Elemen tren: `{label, masuk, selesai}`. TotalUsers hanya disertakan untuk ADMIN. Endpoint `/api/admin/statistics` tetap khusus ADMIN dengan format sama.

`GET /api/reports/export`: CSV unduhan untuk sesi internal, maksimum 10.000 laporan terbaru. Kolom: nomor, judul, kategori, status dan tanggal masuk WIB. Tidak memuat identitas/kontak, kode tracking maupun bukti.
