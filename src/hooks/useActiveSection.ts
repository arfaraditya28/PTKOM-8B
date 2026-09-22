"use client";

import { useEffect, useRef, useState } from "react";
import { navItems } from "@/src/lib/constants";

/**
 * Melacak section aktif untuk highlight navbar.
 * Logika dipindah dari app/page.tsx tanpa perubahan behavior:
 * - klik anchor memakai scroll manual + offset header
 * - IntersectionObserver mengunci target selama smooth-scroll
 *   agar section perantara tidak menimpa active state
 */
export function useActiveSection() {
  const [activeSection, setActiveSection] = useState("");
  // Tujuan klik terakhir: selama smooth-scroll menuju ke sana, section lain
  // yang cuma dilewati (misal Karakteristik saat lompat Profile -> Layanan)
  // tidak boleh menimpa active state.
  const pendingTargetRef = useRef<string | null>(null);
  const lockTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hitung ulang section aktif dari posisi scroll saat ini (pengaman anti-nyangkut).
  const recomputeActiveSection = () => {
    // Paling atas (hero): tidak ada nav yang aktif.
    if (window.scrollY < 80) {
      setActiveSection("");
      return;
    }
    const viewportHeight = window.innerHeight;
    for (const item of navItems) {
      const el = document.querySelector(item.href);
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (rect.top <= viewportHeight * 0.6 && rect.bottom >= viewportHeight * 0.4) {
        setActiveSection(item.href);
        return;
      }
    }
  };

  const releaseLock = () => {
    pendingTargetRef.current = null;
    if (lockTimeoutRef.current) {
      clearTimeout(lockTimeoutRef.current);
      lockTimeoutRef.current = null;
    }
  };

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setActiveSection(href);
    pendingTargetRef.current = href;
    if (lockTimeoutRef.current) {
      clearTimeout(lockTimeoutRef.current);
    }
    // Scroll manual dengan offset tinggi navbar + jeda per-section:
    // Profile 16px (pas), Karakteristik & Layanan -18px (lebih naik lagi,
    // section sedikit masuk ke bawah navbar tapi konten tetap aman karena py-10).
    const extraMap: Record<string, number> = {
      "#profile": 16,
      "#karakteristik": -18,
      "#layanan": -18,
    };
    const extra = extraMap[href] ?? 16;
    const el = document.querySelector(href);
    const headerEl = document.querySelector("header");
    const headerHeight =
      headerEl instanceof HTMLElement ? headerEl.offsetHeight : 88;
    if (el) {
      const top =
        el.getBoundingClientRect().top + window.scrollY - headerHeight - extra;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    }
    // Pengaman: kalau event arrival/scrollend tidak terjadi, lepas kunci
    // maksimal 2 detik lalu koreksi posisi aktif dari scroll saat ini.
    lockTimeoutRef.current = setTimeout(() => {
      releaseLock();
      recomputeActiveSection();
    }, 2000);
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveSection("");
    // Kunci observer selama terbang ke atas: section perantara (Layanan ->
    // Karakteristik -> Profile) tidak boleh menyalakan nav di tengah jalan.
    // "#top" tidak akan pernah sama dengan id section, jadi semua diabaikan
    // sampai scrollend/timeout.
    pendingTargetRef.current = "#top";
    if (lockTimeoutRef.current) {
      clearTimeout(lockTimeoutRef.current);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
    lockTimeoutRef.current = setTimeout(() => {
      releaseLock();
      setActiveSection("");
    }, 2000);
  };

  useEffect(() => {
    const sections = navItems
      .map((item) => document.querySelector(item.href))
      .filter((el): el is Element => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = `#${entry.target.id}`;
          // Masih dalam penerbangan menuju tujuan klik: hanya tujuan yang
          // boleh mengunci active; section perantara diabaikan.
          if (pendingTargetRef.current) {
            if (id === pendingTargetRef.current) {
              releaseLock();
            }
            return;
          }
          setActiveSection(id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );

    sections.forEach((section) => observer.observe(section));

    // Smooth-scroll selesai (klik anchor) -> lepas kunci.
    const handleScrollEnd = () => {
      if (pendingTargetRef.current === "#top") {
        releaseLock();
        setActiveSection("");
        return;
      }
      if (pendingTargetRef.current) {
        releaseLock();
        recomputeActiveSection();
      }
    };
    window.addEventListener("scrollend", handleScrollEnd);

    // Scroll manual ke paling atas (tanpa klik logo): pastikan tidak ada
    // nav nyangkut aktif.
    const handleScroll = () => {
      if (window.scrollY < 80 && !pendingTargetRef.current) {
        setActiveSection("");
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scrollend", handleScrollEnd);
      window.removeEventListener("scroll", handleScroll);
      if (lockTimeoutRef.current) {
        clearTimeout(lockTimeoutRef.current);
      }
    };
  }, []);

  return { activeSection, handleNavClick, handleLogoClick };
}

export type NavClickHandler = (
  e: React.MouseEvent,
  href: string
) => void;
