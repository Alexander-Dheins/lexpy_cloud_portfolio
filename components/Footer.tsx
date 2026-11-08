import Image from "next/image";
import {
  siCplusplus,
  siDart,
  siDjango,
  siDocker,
  siFastapi,
  siFlutter,
  siGit,
  siGithub,
  siGnubash,
  siGo,
  siJavascript,
  siKotlin,
  siKubernetes,
  siLaravel,
  siLinux,
  siMysql,
  siNestjs,
  siNextdotjs,
  siNginx,
  siNodedotjs,
  siPhp,
  siPostgresql,
  siPython,
  siReact,
  siRedis,
  siRust,
  siTailwindcss,
  siThreedotjs,
  siTypescript,
  siCloudflare,
  type SimpleIcon,
} from "simple-icons";
import logo from "@/public/brand/logo-lineas-blancas.png";
import { getDict, type Lang } from "@/lib/i18n";
import LogoMarquee, { type MarqueeLogo } from "./LogoMarquee";

const YEAR = 2026; // fixed: prerender rejects new Date()

const pick = (icons: SimpleIcon[]): MarqueeLogo[] =>
  icons.map((i) => ({ title: i.title === "GNU Bash" ? "Bash" : i.title, path: i.path }));

// Brand marks from simple-icons (CC0), drawn in the footer's gray.
const ROWS: MarqueeLogo[][] = [
  pick([siJavascript, siTypescript, siPython, siPhp, siGo, siKotlin, siRust, siDart, siCplusplus, siGnubash]),
  pick([siReact, siNextdotjs, siNodedotjs, siLaravel, siDjango, siFastapi, siNestjs, siTailwindcss, siThreedotjs, siFlutter]),
  pick([siDocker, siPostgresql, siMysql, siRedis, siLinux, siNginx, siCloudflare, siGit, siGithub, siKubernetes]),
];

export default function Footer({ lang }: { lang: Lang }) {
  const t = getDict(lang).footer;

  return (
    <footer className="bg-panel text-panel-ink">
      <div className="container-page pt-20 pb-10">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <a href="#top" className="flex items-center gap-3 text-[21px] font-semibold tracking-[-0.02em]">
              <Image src={logo} alt="" width={44} height={44} className="h-11 w-11" />
              lexpy
            </a>
            <p className="mt-4 max-w-[34ch] text-[15px] leading-relaxed text-panel-muted">{t.tagline}</p>
            <a
              href="#contacto"
              className="mt-7 inline-flex h-11 items-center rounded-full bg-panel-ink px-5 text-[14px] font-semibold text-panel transition-opacity duration-[var(--dur-short)] hover:opacity-85"
            >
              {t.cta}
            </a>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <LogoMarquee rows={ROWS} label={t.techLabel} pauseLabel={t.pauseLogos} playLabel={t.playLogos} />
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
