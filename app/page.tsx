"use client";

import { Navbar } from "@/src/components/Navbar";
import { Hero } from "@/src/components/Hero";
import { Profile } from "@/src/components/Profile";
import { Karakteristik } from "@/src/components/Karakteristik";
import { Layanan } from "@/src/components/Layanan";
import { Footer } from "@/src/components/Footer";
import { useActiveSection } from "@/src/hooks/useActiveSection";

export default function HomePage() {
  const { activeSection, handleNavClick, handleLogoClick } =
    useActiveSection();

  return (
    <div id="top" className="min-h-screen bg-[#F1F1F1] text-[#1A202C]">
      {/* ===== Navbar (1440 canvas: konten 1200 terpusat) ===== */}
      <Navbar
        activeSection={activeSection}
        onNavClick={handleNavClick}
        onLogoClick={handleLogoClick}
      />

      <main>
        {/* ===== Hero ===== */}
        <Hero onNavClick={handleNavClick} />

        {/* ===== Profile / Tentang ===== */}
        <Profile />

        {/* ===== Karakteristik ===== */}
        <Karakteristik />

        {/* ===== Layanan ===== */}
        <Layanan />
      </main>

      {/* ===== Footer ===== */}
      <Footer />
    </div>
  );
}
