import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import "./globals.css";

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Kecamatan Sekampung",
  description:
    "Selamat datang di Portal Resmi Pemerintahan Kecamatan Sekampung — pelayanan publik digital yang mudah diakses, transparan, dan responsif.",
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
  other: {
    "format-detection": "telephone=no",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${publicSans.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">{children}</body>
    </html>
  );
}
