import { ApiError } from "./http";
export const MAX_FILE_SIZE = 5 * 1024 * 1024;
export const MAX_ATTACHMENTS = 3;
export function detectFile(data: Uint8Array) {
  const b = Buffer.from(data);
  if (b.length >= 8 && b.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) return { mime: "image/png", ext: "png" };
  if (b.length >= 3 && b[0] === 255 && b[1] === 216 && b[2] === 255) return { mime: "image/jpeg", ext: "jpg" };
  if (b.length >= 5 && b.subarray(0, 5).toString() === "%PDF-") return { mime: "application/pdf", ext: "pdf" };
  throw new ApiError(415, "Bukti hanya boleh berupa PNG, JPEG, atau PDF.");
}
