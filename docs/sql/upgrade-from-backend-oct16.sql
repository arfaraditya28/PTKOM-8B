-- Untuk database yang SUDAH menggunakan backend 16 Oktober.
-- Schema lain tidak berubah; tidak menghapus atau menulis ulang laporan.
BEGIN;
ALTER TABLE "Report" ADD COLUMN IF NOT EXISTS "agency" TEXT;
COMMIT;
