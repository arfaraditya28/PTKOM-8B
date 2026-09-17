# Project PTKOM Kelompok 8 - Team B (Web Pemerintah)

## Cara Menjalankan

```bash
git clone https://github.com/arfaraditya28/PTKOM-8B.git
cd PTKOM-8B
npm install
npm run dev
```

Buka `http://localhost:3000`.

## Scripts

```bash
npm run dev    # mode development
npm run build  # build untuk production
npm run start  # menjalankan hasil build
npm run lint   # menjalankan ESLint
```

## Struktur Direktori

```
app/            # page.tsx, layout.tsx, globals.css
public/         # aset statis
next.config.ts
tsconfig.json
package.json
```

Tidak ada konfigurasi tambahan. Tanpa `.env`, database, maupun Docker.

---

## Panduan Kerjasama (Branch & Kolaborasi)

Panduan ini wajib diikuti semua kontributor agar riwayat git tetap rapi dan review mudah.

### 1. Format Branch

```
<type>/<nama>/<pekerjaan>
```

| Bagian | Aturan | Contoh |
|---|---|---|
| `<type>` | Jenis pekerjaan. Pilih salah satu di bawah | `feat`, `fix`, `chore` |
| `<nama>` | Nama panggilan / username GitHub, huruf kecil, tanpa spasi, kebab-case | `arfa`, `budi`, `putri` |
| `<pekerjaan>` | Deskripsi singkat pekerjaan, kebab-case, 2–4 kata, tanpa spasi | `form-laporan`, `tracking-laporan` |

**Daftar `<type>` yang diizinkan:**

- `feat` / `feature` — fitur baru
- `fix` — perbaikan bug
- `chore` — tooling, deps, config, build
- `docs` — dokumentasi
- `refactor` — refactor tanpa ubah behavior
- `style` — styling/UI saja
- `test` — tambah/perbaiki test

**Contoh benar:**

```
feat/arfa/form-laporan
feat/budi/section-profil
feat/putri/tracking-laporan
fix/arfa/validasi-form
fix/budi/upload-foto
chore/putri/update-deps
docs/arfa/panduan-branch
refactor/budi/footer-layout
```

**Contoh salah:**

```
Feat/Arfa/Form Laporan       # jangan pakai huruf besar & spasi
feature-arfa-form-laporan    # harus pakai slash /
feat/arfa/                   # pekerjaan tidak boleh kosong
```

### 2. Alur Kerja (Workflow)

```bash
# 1. Sync main terbaru
git checkout main
git pull origin main

# 2. Buat branch baru sesuai format
git checkout -b feat/arfa/nama-pekerjaan

# 3. Kerjakan, lalu commit dengan pesan jelas
git add .
git commit -m "feat: tambah form laporan warga"

# 4. Push branch ke remote
git push -u origin feat/arfa/nama-pekerjaan

# 5. Buka Pull Request (PR) di GitHub: base = main, compare = branch kamu
# 6. Tunggu CI lolos (lint, test, build) dan minta 1 review
# 7. Setelah di-approve -> Squash and merge -> hapus branch
```

**Aturan penting:**

- Selalu branch dari `main` terbaru. Jangan branch dari branch orang lain tanpa koordinasi.
- Satu branch = satu pekerjaan/fitur. Jangan campur banyak fitur dalam satu branch.
- Jangan push langsung ke `main`. Semua perubahan wajib lewat PR.
- Selalu `git pull --rebase origin main` jika `main` sudah maju saat kamu masih mengerjakan branch.
- Hapus branch setelah PR di-merge (`git branch -d feat/arfa/nama-pekerjaan`).

### 3. Aturan Commit & Pull Request

**Commit message (disarankan Conventional Commits):**

```
feat: tambah form laporan warga
feat: tambah halaman tracking laporan
fix: perbaiki validasi form pengaduan
fix: perbaiki upload foto laporan
chore: update deps Next 16
docs: tambah panduan kerjasama di README
```

**Judul PR:** jelas dan pakai prefix yang sama, contoh `feat(arfa): form laporan warga`

**Deskripsi PR wajib isi:**

- Apa yang diubah (what)
- Kenapa diubah (why)
- Cara test manual (jika perlu)
- Screenshot (untuk perubahan UI)

**Checklist sebelum minta review:**

- [ ] `npm run lint` lolos
- [ ] `npm run test` lolos (jika ada test)
- [ ] `npm run build` berhasil
- [ ] Tidak ada `console.log` tertinggal
- [ ] Sudah test manual di `http://localhost:3000`

### 4. Review & Merge

- Minimal 1 approval sebelum merge.
- CI di `.github/workflows/ci.yml` wajib hijau (lint, test, build).
- Merge strategy: **Squash and merge** agar riwayat `main` tetap bersih.
- Konflik? Rebase dari `main` dulu, jangan merge `main` ke branch kamu.

### 5. Penamaan Lain

- Issue branch opsional: boleh tambah nomor issue di pekerjaan, contoh `feat/arfa/12-form-laporan` jika pakai GitHub Issues.
- Hotfix urgent: `fix/putri/hotfix-form-laporan` lalu PR langsung dengan label `urgent`.
