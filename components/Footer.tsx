import Image from "next/image";
import logo from "@/public/brand/logo-lineas-blancas.png";
import { getDict, type Lang } from "@/lib/i18n";
import BlackHole from "./BlackHole";

const YEAR = 2026; // fixed: prerender rejects new Date()

export default function Footer({ lang }: { lang: Lang }) {
  const t = getDict(lang).footer;

  return (
    <footer className="relative overflow-hidden bg-panel text-panel-ink">
      <BlackHole />
      <div className="container-page relative z-10 pt-14 pb-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
            <a href="#top" className="flex items-center gap-3 text-[21px] font-semibold tracking-[-0.02em]">
              <Image src={logo} alt="" width={44} height={44} className="h-11 w-11" />
              lexpy
            </a>
          </div>
          <a
            href="#contacto"
            className="inline-flex h-11 shrink-0 items-center self-start rounded-full bg-panel-ink px-5 text-[14px] font-semibold text-panel transition-opacity duration-[var(--dur-short)] hover:opacity-85 sm:self-auto"
          >
            {t.cta}
          </a>
        </div>

        <div className="mt-8 flex flex-col gap-2 pt-1 text-[13.5px] text-panel-muted sm:flex-row sm:items-center sm:justify-between">
          <span>© {YEAR} lexpy.cloud</span>
          <a href="#top" className="transition-colors hover:text-panel-ink">
            {t.backToTop}
          </a>
        </div>
      </div>

    </footer>
  );
}
