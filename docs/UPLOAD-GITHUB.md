# Mengunggah paket terbaru ke GitHub

Paket dibuat dari `PTKOM-8B-main.zip` yang dikirim 24 Oktober 2026. Tidak ada push otomatis. Jangan unggah ZIP sebagai pengganti isi kode.

## Buat clone dan branch baru

Perintah berikut membuat folder baru agar clone/branch backend-syehab sebelumnya tidak tertimpa. Gunakan nama folder lain jika folder tujuan sudah ada.

```powershell
cd "$env:USERPROFILE\Downloads"
git clone --branch main https://github.com/arfaraditya28/PTKOM-8B.git PTKOM-8B-backend-baru
cd ".\PTKOM-8B-backend-baru"
git switch -c feat/syehab/backend-terbaru
```

Nama branch mengikuti format pada README asli main: `<type>/<nama>/<pekerjaan>`.

## Salin hasil ekstrak

Ekstrak ZIP paket terbaru. Pilih folder bagian dalam yang memiliki package.json. Pada contoh berikut, sesuaikan `$sumberBackend` jika lokasi ekstraknya berbeda:

```powershell
$sumberBackend = "$env:USERPROFILE\Downloads\PTKOM-8B-backend-siap-upload\PTKOM-8B-main"
$tujuanBackend = "$env:USERPROFILE\Downloads\PTKOM-8B-backend-baru"

if (!(Test-Path -LiteralPath "$sumberBackend\package.json")) {
    throw "Folder sumber belum tepat. Pilih folder hasil ekstrak yang berisi package.json."
}
robocopy $sumberBackend $tujuanBackend /E /XD node_modules .next .git .local-test /XF .env .env.local .env.development.local .env.production.local next-env.d.ts *.tsbuildinfo
```

Robocopy tidak menghapus folder lain; kode exit 1–7 dapat berarti salinan berhasil. Kode 8 atau lebih menandakan kegagalan salin dan perlu diperiksa. `.git` tetap milik clone. Gunakan salinan `.env` hanya pada laptop untuk menjalankan aplikasi.

Paket ini juga menghubungkan halaman ke backend. Karena itu folder app/admin, app/login, app/tracking, app/laporan-publik, komponen dan hook integrasi perlu ikut disalin, tidak hanya app/api.

## Periksa, commit dan push

```powershell
cd $tujuanBackend
git branch --show-current
git --no-pager diff --stat
git --no-pager status --short
git check-ignore .env
git ls-files .env
```

Branch harus feat/syehab/backend-terbaru. `.env` diabaikan dan tidak boleh ada pada git ls-files. Jika main sudah memiliki perubahan setelah ZIP ini dibuat, bandingkan file yang bertabrakan sebelum melanjutkan; paket ini berdasarkan snapshot ZIP, bukan pengambilan main langsung.

```powershell
git add .
git --no-pager diff --cached --name-only
git commit -m "feat: lengkapi backend dan integrasi portal pengaduan"
git push -u origin feat/syehab/backend-terbaru
```

Periksa daftar staged sebelum commit: jangan sertakan `.env`, node_modules, .next, maupun folder pengujian lokal. Buat PR dengan base main dan compare feat/syehab/backend-terbaru. Judul: `feat: lengkapi backend portal pengaduan`. Ringkas fitur, hasil tes, dan kebutuhan upgrade schema pada deskripsi.

Workflow GitHub Actions tersedia untuk PR dan push branch kerja ini. Hasil tes lokal tidak berarti workflow sudah hijau. Ikuti aturan review tim sebelum penggabungan. Jika PR backend-syehab lama sudah dibuat, koordinasikan PR mana yang akan dipakai agar perubahan tidak digabung dua kali.
