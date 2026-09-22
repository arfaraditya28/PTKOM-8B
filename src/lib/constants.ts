import type { FiturLaporan, NavItem, Stat } from "@/src/types";

export const navItems: NavItem[] = [
  { href: "#profile", label: "Profile" },
  { href: "#karakteristik", label: "Karakteristik" },
  { href: "#layanan", label: "Layanan" },
];

export const stats: Stat[] = [
  { value: "148,34 km²", label: "Luas wilayah" },
  { value: "85", label: "Jumlah dusun" },
  { value: "319", label: "Jumlah RT" },
  { value: "68.210", label: "Jumlah penduduk" },
];

export const fiturLaporan: FiturLaporan[] = [
  { label: "Kategori Pengaduan", icon: "/icon-kategori.png" },
  { label: "Kerahasiaan Terjamin", icon: "/icon-privacy.png" },
  { label: "Tracking Laporan", icon: "/icon-tracking.png" },
  { label: "Respons 24 Jam", icon: "/icon-jam.png" },
];
