"use client";

import { useEffect, useState } from "react";

const LINKS = [
  { href: "#servicios", label: "Servicios" },
  { href: "#contacto", label: "Contacto" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-[var(--dur-short)] ${
        scrolled ? "glass-nav" : "border-b border-transparent"
      }`}
    >
      <nav className="container-page flex h-[72px] items-center justify-between">
        <a
          href="#top"
          aria-label="lexpy, ir al inicio"
          className="flex items-center gap-2.5 text-[19px] font-semibold tracking-[-0.02em]"
        >
          <span aria-hidden className="inline-block h-3.5 w-3.5 rounded-[4px] bg-ink" />
          lexpy
        </a>

        <div className="hidden items-center gap-9 text-[15px] text-muted sm:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition-colors duration-[var(--dur-short)] hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </div>

        <a
          href="#contacto"
          className="inline-flex h-10 items-center rounded-full border border-ink/25 px-4 text-[14px] font-semibold text-ink transition-colors duration-[var(--dur-short)] hover:bg-paper-2"
        >
          Hablemos
        </a>
      </nav>
    </header>
  );
}
