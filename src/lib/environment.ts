import { randomBytes } from 'node:crypto';
import { parseEnv } from 'node:util';

/** Prepare local secrets while preserving DATABASE_URL and all existing valid values. */
export function prepareEnvironment(input: string) {
  const values = parseEnv(input);
  const newline = input.includes('\r\n') ? '\r\n' : '\n';
  let content = input;
  const generated: string[] = [];
  for (const key of ['JWT_SECRET', 'SEED_ADMIN_PASSWORD', 'SEED_PETUGAS_PASSWORD']) {
    const value = values[key];
    const empty = !value || !value.trim();
    if (!empty && (key !== 'JWT_SECRET' || value.trim().length >= 32)) continue;
    const replacement = `${key}="${randomBytes(key === 'JWT_SECRET' ? 32 : 18).toString('hex')}"`;
    const pattern = new RegExp(`^[\\t ]*(?:export[\\t ]+)?${key}[\\t ]*=[^\\r\\n]*`, 'gm');
    if (pattern.test(content)) content = content.replace(pattern, () => replacement);
    else content += `${content && !content.endsWith('\n') ? newline : ''}${replacement}${newline}`;
    generated.push(key);
  }
  return { content, generated };
}
