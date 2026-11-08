"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import logo from "@/public/brand/logo-lineas-negras.png";
import { GITHUB_URL } from "@/lib/github-config";
import { HOME_PATH } from "@/lib/i18n";
import { useI18n } from "@/components/i18n/I18nProvider";

function GithubMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden className={className} fill="currentColor">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}



export default function Navbar({ stars }: { stars: number | null }) {
  const [scrolled, setScrolled] = useState(false);
  const { lang, t } = useI18n();
  const other = lang === "es" ? "en" : "es";

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
          aria-label={t.nav.home}
          className="flex items-center gap-2.5 text-[19px] font-semibold tracking-[-0.02em]"
        >
          <Image src={logo} alt="" width={36} height={36} priority className="h-9 w-9" />
          lexpy
        </a>

        <div className="flex items-center gap-2.5">
          <a
            href={HOME_PATH[other]}
            hrefLang={other}
            lang={other}
            aria-label={t.nav.switchLabel}
            title={t.nav.switchLabel}
            className="inline-flex h-10 items-center gap-1.5 rounded-full border border-ink/20 px-3 text-[13.5px] font-semibold text-ink transition-colors duration-[var(--dur-short)] hover:bg-paper-2"
          >
            <svg viewBox="0 0 24 24" aria-hidden className="h-[17px] w-[17px]" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" />
            </svg>
            {t.nav.switchShort}
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={stars === null ? t.nav.github : t.nav.githubStars(stars)}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-ink/20 px-3.5 text-[14px] font-semibold text-ink transition-colors duration-[var(--dur-short)] hover:bg-paper-2"
          >
            <GithubMark className="h-[18px] w-[18px]" />
            {stars !== null ? (
              <span className="flex items-center gap-1 border-l border-ink/15 pl-2 tabular-nums">
                <svg viewBox="0 0 16 16" aria-hidden className="h-3.5 w-3.5" fill="currentColor">
                  <path d="M8 .9l2.2 4.5 4.9.7-3.6 3.5.9 4.9L8 12.2l-4.4 2.3.9-4.9L.9 6.1l4.9-.7z" />
                </svg>
                {stars}
              </span>
            ) : null}
          </a>

          <a
            href="#contacto"
            aria-label={t.nav.mail}
            title={t.nav.mail}
            className="grid h-10 w-10 place-items-center rounded-full border border-ink/20 text-ink transition-colors duration-[var(--dur-short)] hover:bg-paper-2"
          >
            <svg viewBox="0 0 24 24" aria-hidden className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="5" width="18" height="14" rx="2.5" />
              <path d="M4 7l8 6 8-6" />
            </svg>
          </a>
        </div>
      </nav>
    </header>
  );
}
