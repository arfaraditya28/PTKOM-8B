# Mengunggah backend ke branch syehab

Tujuan: repository `https://github.com/arfaraditya28/PTKOM-8B`, branch `syehab`. Paket disiapkan dari ZIP terakhir yang tersedia pada percakapan; perubahan terbaru di GitHub belum dapat dibandingkan karena repository membutuhkan autentikasi. Gunakan clone milikmu agar riwayat kerja tim tetap ada.

## 1. Buka clone yang sudah ada

Di VS Code, buka `D:\PTKOM-Kerja`, lalu terminal PowerShell:

```powershell
cd "D:\PTKOM-Kerja"
git status --short
git switch syehab
git pull --ff-only origin syehab
```

Jika ada perubahan milikmu yang belum disimpan atau Git menolak perpindahan/pull, simpan dan periksa perubahan tersebut sebelum menyalin paket. Tidak perlu membuat repository baru atau mengunggah berkas ZIP ke repository.

## 2. Salin kode dari paket

Ekstrak ZIP ke folder sementara. Folder `PTKOM-8B-syehab-backend` di dalamnya adalah akar proyek, yaitu folder yang berisi `package.json`.

Salin bagian berikut ke lokasi yang sama pada `D:\PTKOM-Kerja`, lalu pilih replace untuk perubahan backend yang telah dibandingkan:

| Dari paket | Ke clone |
|---|---|
| Isi `app/api` | `app/api` |
| Isi `src/lib` | `src/lib` |
| Isi `prisma` | `prisma` |
| Folder `scripts`, `tests`, `docs` | Folder bernama sama di akar proyek |
| `.github/workflows/ci.yml` | `.github/workflows/ci.yml` |
| `package.json`, `package-lock.json`, `README.md`, `.env.example`, `.gitignore`, `Jalankan-Backend.cmd` | Akar proyek, sejajar dengan package.json |

`.env` milikmu tetap dipakai. Tampilan frontend pada clone tidak perlu disalin dari paket karena pekerjaan ini melengkapi backend.

## 3. Periksa dan unggah

```powershell
cd "D:\PTKOM-Kerja"
git branch --show-current
git diff --stat
git check-ignore .env
git ls-files .env
```

Branch harus `syehab`. `git check-ignore .env` menampilkan `.env`, sedangkan `git ls-files .env` seharusnya kosong. Jika `.env` ternyata sudah terlacak pada Git, lepaskan dari pelacakan dengan `git rm --cached -- .env`; file lokal tetap ada.

Setelah perubahan yang tampil sesuai backend:

```powershell
git add -- app/api src/lib prisma scripts tests docs .github/workflows/ci.yml package.json package-lock.json README.md .env.example .gitignore Jalankan-Backend.cmd
git diff --cached --stat
git diff --cached --name-only
git commit -m "Lengkapi backend portal pengaduan"
git push origin syehab
```

Periksa daftar berkas sebelum commit: `.env`, `node_modules` dan `.next` tidak termasuk. Jika push ditolak karena branch remote berubah, ambil dan selesaikan perbedaan dengan tim; jangan memakai force push.

Setelah push berhasil, buka tab Actions pada GitHub. Workflow akan mencoba lint, tes, build dan integrasi HTTP dengan PostgreSQL 17 sementara. Jika tim meminta penggabungan, buat pull request dari `syehab` ke branch tujuan tim. Pengunggahan dan pembuatan PR dilakukan olehmu.
