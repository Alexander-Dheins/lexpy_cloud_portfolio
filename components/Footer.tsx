import Image from "next/image";
import logo from "@/public/brand/logo-lineas-blancas.png";
import { getDict, type Lang } from "@/lib/i18n";

// Año fijo a propósito: el prerender de Next.js rechaza `new Date()` aquí.
// Súbelo a mano cuando cambie.
const YEAR = 2026;


export default function Footer({ lang }: { lang: Lang }) {
  const t = getDict(lang).footer;
  const columns = [
    {
      title: t.site,
      links: ["#top", "#servicios", "#contacto"].map((href, i) => ({ label: t.siteLinks[i], href: href as string | undefined })),
    },
    {
      title: t.servicesTitle,
      links: t.servicesLinks.map((label) => ({ label, href: "#servicios" as string | undefined })),
    },
    {
      title: t.stackTitle,
      links: t.stack.map((label) => ({ label, href: undefined as string | undefined })),
    },
  ];
  return (
    <footer className="bg-panel text-panel-ink">
      <div className="container-page pt-20 pb-10">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          <div className="sm:col-span-2 lg:col-span-4">
            <a href="#top" className="flex items-center gap-3 text-[21px] font-semibold tracking-[-0.02em]">
              <Image src={logo} alt="" width={44} height={44} className="h-11 w-11" />
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

          {columns.map((column, i) => (
            <nav
              key={column.title}
              aria-label={column.title}
              className={i === 0 ? "lg:col-span-2 lg:col-start-6" : i === 1 ? "lg:col-span-3" : "lg:col-span-2"}
            >
              <p className="text-[14px] text-panel-muted">{column.title}</p>
              <ul className="mt-4 space-y-2.5 text-[15px]">
                {column.links.map((link) => (
                  <li key={link.label}>
                    {link.href ? (
                      <a
                        href={link.href}
                        className="underline decoration-transparent underline-offset-4 transition-colors duration-[var(--dur-short)] hover:decoration-panel-muted"
                      >
                        {link.label}
                      </a>
                    ) : (
                      link.label
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>


        <div className="mt-16 flex flex-col gap-3 border-t border-panel-rule pt-6 text-[13.5px] text-panel-muted sm:flex-row sm:items-center sm:justify-between">
          <span>© {YEAR} lexpy.cloud</span>
          <span>{t.deployed}</span>
          <a href="#top" className="transition-colors duration-[var(--dur-short)] hover:text-panel-ink">
            {t.backToTop}
          </a>
        </div>
      </div>
    </footer>
  );
}
