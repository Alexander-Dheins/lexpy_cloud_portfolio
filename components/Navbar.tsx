"use client";

import { useEffect, useState } from "react";

const LINKS = [
  { href: "#servicios", label: "Servicios" },
  { href: "#proyectos", label: "Proyectos" },
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
      className={`sticky top-0 z-50 transition-colors ${
        scrolled ? "glass-nav" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#top" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-foreground" />
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-accent-red" />
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-accent-blue" />
          <span className="ml-2 text-lg">lexpy</span>
        </a>

        <div className="hidden items-center gap-8 text-sm text-muted sm:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>

        <a
          href="#contacto"
          className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-85"
        >
          Hablemos
        </a>
      </nav>
    </header>
  );
}
