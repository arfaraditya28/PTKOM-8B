import { readFile, writeFile } from 'node:fs/promises';
import { prepareEnvironment } from '../src/lib/environment';

async function main() {
  let original: string;
  let exists = true;
  try { original = await readFile('.env', 'utf8'); }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
    exists = false;
    original = await readFile('.env.example', 'utf8');
  }
  const prepared = prepareEnvironment(original);
  if (!exists) await writeFile('.env', prepared.content, { flag: 'wx', mode: 0o600 });
  else if (prepared.content !== original) await writeFile('.env', prepared.content, { mode: 0o600 });
  console.log('Konfigurasi lokal siap. DATABASE_URL yang sudah ada dipertahankan.');
  if (prepared.generated.length) console.log(`Nilai otomatis disimpan ke .env: ${prepared.generated.join(', ')}.`);
  console.log('Isi DATABASE_URL jika belum benar. Password akun awal dapat dibaca sendiri pada .env; seed tidak mengganti password akun lama.');
}
main().catch(() => {
  console.error('Tidak dapat menyiapkan .env. Periksa format dan izin file, lalu coba lagi.');
  process.exitCode = 1;
});
