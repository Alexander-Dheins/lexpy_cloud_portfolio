import Image from "next/image";
import logo from "@/public/brand/logo-lineas-blancas.png";

// Año fijo a propósito: el prerender de Next.js rechaza `new Date()` aquí.
// Súbelo a mano cuando cambie.
const YEAR = 2026;

const COLUMNS = [
  {
    title: "Sitio",
    links: [
      { label: "Inicio", href: "#top" },
      { label: "Servicios", href: "#servicios" },
      { label: "Contacto", href: "#contacto" },
    ],
  },
  {
    title: "Servicios",
    links: [
      { label: "Desarrollo web y apps", href: "#servicios" },
      { label: "APIs e integraciones", href: "#servicios" },
      { label: "Automatización y DevOps", href: "#servicios" },
      { label: "Consultoría", href: "#servicios" },
    ],
  },
  {
    title: "Stack",
    links: [
      { label: "Next.js y TypeScript" },
      { label: "Docker y Dokploy" },
      { label: "PostgreSQL y Redis" },
      { label: "Cloudflare" },
    ],
  },
];

export default function Footer() {
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
              Desarrollo de software e infraestructura propia, de la idea al servidor.
            </p>
            <a
              href="#contacto"
              className="mt-7 inline-flex h-11 items-center rounded-full bg-panel-ink px-5 text-[14px] font-semibold text-panel transition-opacity duration-[var(--dur-short)] hover:opacity-85"
            >
              Escríbeme
            </a>
          </div>

          {COLUMNS.map((column, i) => (
            <nav
              key={column.title}
              aria-label={column.title}
              className={i === 0 ? "lg:col-span-2 lg:col-start-6" : i === 1 ? "lg:col-span-3" : "lg:col-span-2"}
            >
              <p className="text-[14px] text-panel-muted">{column.title}</p>
              <ul className="mt-4 space-y-2.5 text-[15px]">
                {column.links.map((link) => (
                  <li key={link.label}>
                    {"href" in link ? (
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
          <span>Desplegado en un VPS propio con Dokploy.</span>
          <a href="#top" className="transition-colors duration-[var(--dur-short)] hover:text-panel-ink">
            Volver arriba
          </a>
        </div>
      </div>
    </footer>
  );
}
