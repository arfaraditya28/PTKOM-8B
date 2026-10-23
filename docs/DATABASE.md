# Database backend

Sumber schema: `prisma/schema.prisma`. PostgreSQL digunakan untuk pengembangan dan deployment (Neon). Prisma Client menghubungkan route Next.js dengan database.

| Model | Isi utama |
|---|---|
| User | Akun internal, password bcrypt, role ADMIN/PETUGAS, isActive, tokenVersion |
| Category | Nama kategori unik dan deskripsi |
| Report | Nomor unik, tracking unik, kategori, isi laporan, lokasi, tanggal kejadian, identitas pelapor, status, publikasi |
| Attachment | Relasi laporan, nama server, MIME, ukuran dan bytes file; fileUrl nullable dipertahankan untuk data lama |
| Comment | Tanggapan petugas yang dapat dilihat warga melalui tracking |
| StatusHistory | Status, waktu, note internal dan userId nullable (null berarti sistem) |
| ReportCounter | Satu baris setiap tanggal WIB (YYYYMMDD), nilai urutan atomik |
| Service | Nama layanan unik, deskripsi, persyaratan, jam layanan, kontak, status aktif |

Status: DIAJUKAN, DIVERIFIKASI, DIPROSES, SELESAI, DITOLAK.

Report berelasi dengan Category; Attachment, Comment dan StatusHistory berelasi dengan Report. Comment/StatusHistory merujuk akun internal. Warga tidak memiliki akun. Penghapusan akun melalui API berarti nonaktif; data historis tidak dihapus.

`Report.isPublic` default false. Daftar publik hanya mengambil reportNumber, publicTitle, publicSummary, kategori, status dan waktu. Nama/kontak, lokasi asli, judul asli, tracking, bukti dan catatan internal tidak dipilih oleh endpoint publik.

Penomoran memakai upsert/increment ReportCounter dalam transaksi yang sama dengan pembuatan Report dan riwayat awal. Format LAP-YYYYMMDD-0001; tanggal memakai Asia/Jakarta. Tracking baru memakai randomBytes(16) (128 bit) dalam format TRK-32_HEX. Kode lama tetap dapat dilacak.

Bukti baru wajib memiliki content/size pada jalur upload. Kolom nullable hanya untuk mempertahankan record Attachment lama. Database menyimpan bytes secara privat; route download mewajibkan sesi petugas/admin dan memberi Content-Disposition attachment serta no-store.

Setup dan upgrade dijelaskan dalam BACKEND.md. Berkas SQL hasil diff ada di `docs/sql/`.
