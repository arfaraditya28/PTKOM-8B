"use client";

import { useState } from "react";
import Image from "next/image";
import { navItems } from "@/src/lib/constants";
import type { NavClickHandler } from "@/src/hooks/useActiveSection";

type NavbarProps = {
  activeSection: string;
  onNavClick: NavClickHandler;
  onLogoClick: (e: React.MouseEvent) => void;
};

export function Navbar({ activeSection, onNavClick, onLogoClick }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white">
      <div className="flex w-full items-center justify-between px-6 py-4 sm:px-10 lg:px-14">
        <a href="#top" onClick={onLogoClick} className="flex items-center gap-3">
          <Image
            src="/logo-sekampung.png"
            alt="Logo Kecamatan Sekampung"
            width={56}
            height={64}
            className="h-14 w-auto"
            priority
          />
          <span className="truncate text-xl font-extrabold tracking-tight sm:text-2xl">
            Kecamatan Sekampung
          </span>
        </a>
        <nav
          className="hidden items-center gap-4 text-[15px] text-black sm:gap-8 md:flex lg:gap-12"
          aria-label="Navigasi utama"
        >
          {navItems.map((item) => {
            const isActive = activeSection === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                aria-label={item.label}
                aria-current={isActive ? "true" : undefined}
                onClick={(e) => onNavClick(e, item.href)}
                className={`group relative whitespace-nowrap rounded-lg px-4 py-2 after:absolute after:bottom-1 after:left-4 after:right-4 after:h-[2px] after:origin-center after:bg-current after:content-[''] after:transition-transform after:duration-300 after:ease-out ${
                  isActive
                    ? "after:scale-x-100"
                    : "after:scale-x-0 hover:after:scale-x-100 focus-visible:after:scale-x-100"
                }`}
              >
                {/* Placeholder tak terlihat dengan lebar extrabold: mengunci lebar
                    link agar sibling tidak kegeser saat teks menebal saat hover/active */}
                <span aria-hidden="true" className="invisible font-extrabold">
                  {item.label}
                </span>
                <span
                  className={`absolute inset-0 flex items-center justify-center ${
                    isActive
                      ? "font-extrabold"
                      : "font-semibold group-hover:font-extrabold"
                  }`}
                >
                  {item.label}
                </span>
              </a>
            );
          })}
        </nav>
        <button
          type="button"
          className="flex h-11 w-11 shrink-0 flex-col items-center justify-center gap-1.5 rounded-lg transition hover:bg-black/5 md:hidden"
          aria-label={menuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span
            aria-hidden="true"
            className={`h-0.5 w-6 bg-black transition-transform duration-300 ${menuOpen ? "translate-y-2 rotate-45" : ""}`}
          />
          <span
            aria-hidden="true"
            className={`h-0.5 w-6 bg-black transition-opacity duration-300 ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            aria-hidden="true"
            className={`h-0.5 w-6 bg-black transition-transform duration-300 ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </button>
      </div>
      <nav
        aria-label="Navigasi seluler"
        className={`absolute inset-x-0 top-full grid bg-white shadow-lg transition-all duration-300 ease-out md:hidden ${
          menuOpen
            ? "visible grid-rows-[1fr] border-t border-black/5 opacity-100"
            : "invisible grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          {navItems.map((item) => {
            const isActive = activeSection === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  onNavClick(e, item.href);
                  setMenuOpen(false);
                }}
                tabIndex={menuOpen ? 0 : -1}
                aria-current={isActive ? "true" : undefined}
                className={`mx-3 my-1 block rounded-lg px-4 py-3.5 text-sm transition-[background-color,box-shadow] duration-300 ease-out hover:bg-black/[0.04] hover:font-extrabold hover:shadow-[0_8px_18px_-10px_rgba(0,0,0,0.3)] ${
                  isActive
                    ? "bg-black/[0.05] font-extrabold text-black shadow-[0_8px_18px_-10px_rgba(0,0,0,0.3)]"
                    : "font-semibold text-black"
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
