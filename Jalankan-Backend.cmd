@echo off
setlocal
cd /d "%~dp0"

where node >nul 2>&1
if errorlevel 1 (
  echo Node.js belum tersedia. Instal Node.js lalu buka kembali berkas ini.
  goto gagal
)
where npm.cmd >nul 2>&1
if errorlevel 1 (
  echo npm belum tersedia. Periksa instalasi Node.js.
  goto gagal
)

echo Memasang dependency sesuai package-lock.json...
call npm.cmd ci
if errorlevel 1 goto gagal

echo Menyiapkan Prisma Client...
call npm.cmd run db:generate
if errorlevel 1 goto gagal

echo Memeriksa konfigurasi dan database tanpa mengubah data...
call npm.cmd run backend:check
if errorlevel 1 goto gagal

echo Membuka server. Gunakan alamat Local yang tampil di bawah.
echo Tekan Ctrl+C untuk menghentikan server.
call npm.cmd run dev
exit /b %errorlevel%

:gagal
echo.
echo Server belum dijalankan. Ikuti pesan di atas dan docs\TERAPKAN-DI-LAPTOP.md.
echo Berkas .env dan database tidak diubah otomatis.
pause
exit /b 1
