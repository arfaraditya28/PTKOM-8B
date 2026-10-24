import { ApiError, serializable } from "./http";
import { hashPassword } from "./auth";
import type { z } from "zod";
import type { updateUserSchema } from "./validators";
export const userSelect = { id: true, name: true, username: true, role: true, isActive: true, createdAt: true, updatedAt: true } as const;
export async function changeUser(id: string, data: z.infer<typeof updateUserSchema>) {
  const password = data.password ? await hashPassword(data.password) : undefined;
  return serializable(async tx => {
    const old = await tx.user.findUnique({ where: { id } });
    if (!old) throw new ApiError(404, "Pengguna tidak ditemukan.");
    if (old.isActive && old.role === "ADMIN" && (data.isActive === false || data.role === "PETUGAS")) {
      if (await tx.user.count({ where: { role: "ADMIN", isActive: true } }) <= 1) throw new ApiError(409, "Minimal satu admin aktif harus tersedia.");
    }
    return tx.user.update({ where: { id }, data: { ...data, password, tokenVersion: { increment: 1 } }, select: userSelect });
  });
}
