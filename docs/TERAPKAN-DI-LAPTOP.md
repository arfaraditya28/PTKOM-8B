# Memasang paket terbaru

Buka folder hasil ekstrak yang memiliki package.json. Jangan membuka ZIP langsung di VS Code. Ikuti urutan pada README.

Jika sudah memiliki konfigurasi di folder lama, hentikan server lama dengan Ctrl+C dan salin hanya `.env` ke folder hasil ekstrak baru. Jangan menimpa `.env` dengan `.env.example`.

```powershell
npm.cmd ci
npm.cmd run db:generate
npm.cmd run db:push
npm.cmd run db:sync-counters
npm.cmd run db:seed
npm.cmd run backend:check
npm.cmd run dev
```

Gunakan salinan database pengembangan untuk upgrade schema. Paket terbaru menambahkan Report.agency bila berasal dari backend 16 Oktober. Seed tidak mengganti password akun lama.

Buka /login untuk akun admin/petugas; /pelaporan untuk warga; /tracking untuk memantau laporan. Admin menambahkan layanan agar tampil pada beranda. /admin hanya dapat diakses setelah login.
