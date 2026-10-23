# Memasang paket backend pada laptop

Folder kerja yang sebelumnya digunakan:

```text
D:\PTKOM-8B-syehab-backend-final\PTKOM-8B-syehab-backend
```

Hentikan server dengan Ctrl+C. Ekstrak paket baru ke folder sementara, lalu salin kode ke folder kerja tersebut. Pertahankan `.env` yang sudah berisi database pribadi. Buka folder bagian dalam yang berisi `package.json` pada VS Code.

```powershell
cd "D:\PTKOM-8B-syehab-backend-final\PTKOM-8B-syehab-backend"
npm.cmd ci
npm.cmd run env:setup
npm.cmd run db:generate
npm.cmd run backend:check
npm.cmd run dev
```

Jika setup database dari paket sebelumnya sudah berhasil, tidak perlu mengulang db:setup/seed. Schema paket lanjutan 16 Oktober sama dengan schema paket perbaikan kategori. Jika pemeriksaan menemukan schema lama dari proyek awal, ikuti upgrade pada `BACKEND.md`.

Untuk folder dan database yang benar-benar baru, gunakan urutan pada README: `env:setup`, isi DATABASE_URL, lalu `db:setup`. Secret dan password yang kosong dapat dibuat otomatis tanpa dicetak ke terminal. Seed hanya membuat akun/kategori yang belum ada; akun lama tidak berubah.

Untuk mengunggah hasil ke repository kelompok, ikuti `UPLOAD-GITHUB.md` dengan clone `D:\PTKOM-Kerja`, branch `syehab`.
