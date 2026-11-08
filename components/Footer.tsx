import Image from "next/image";
import logo from "@/public/brand/logo-lineas-blancas.png";
import { getDict, type Lang } from "@/lib/i18n";
import { TECH_ROWS } from "@/lib/tech-logos";
import LogoMarquee from "./LogoMarquee";

const YEAR = 2026; // fixed: prerender rejects new Date()

export default function Footer({ lang }: { lang: Lang }) {
  const t = getDict(lang).footer;

  return (
    <footer className="bg-panel text-panel-ink">
      <div className="container-page pt-20 pb-10">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <a
              href="#top"
              className="flex items-center gap-3 text-[21px] font-semibold tracking-[-0.02em]"
            >
              <Image
                src={logo}
                alt=""
                width={44}
                height={44}
                className="h-11 w-11"
              />
              lexpy
            </a>
            <p className="mt-4 max-w-[34ch] text-[15px] leading-relaxed text-panel-muted">
              {t.tagline}
            </p>
            <a
              href="#contacto"
              className="mt-7 inline-flex h-11 items-center rounded-full bg-panel-ink px-5 text-[14px] font-semibold text-panel transition-opacity duration-[var(--dur-short)] hover:opacity-85"
            >
              {t.cta}
            </a>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <LogoMarquee
              rows={TECH_ROWS}
              label={t.techLabel}
              pauseLabel={t.pauseLogos}
              playLabel={t.playLogos}
            />
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-panel-rule pt-6 text-[13.5px] text-panel-muted sm:flex-row sm:items-center sm:justify-between">
          <span>© {YEAR} lexpy.cloud</span>
          <span>{t.deployed}</span>
          <a href="#top" className="transition-colors hover:text-panel-ink">
            {t.backToTop}
          </a>
        </div>
      </div>
    </footer>
  );
}
