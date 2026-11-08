import Showcase from "./showcase/Showcase";

export default function Hero() {
  return (
    <section id="top" aria-labelledby="hero-titulo">
      <div className="container-page grid items-center gap-12 pt-6 pb-20 lg:min-h-[calc(100svh-72px)] lg:grid-cols-12 lg:gap-10 lg:py-10">
        <div className="min-w-0 lg:col-span-5">
          <h1
            id="hero-titulo"
            className="max-w-[13ch] text-[clamp(2.6rem,4.6vw,4.25rem)] leading-[1.03] font-semibold tracking-[-0.035em]"
          >
            Construyo software y lo pongo en producción.
          </h1>
          <p className="mt-6 max-w-[38ch] text-[1.1875rem] leading-relaxed text-muted">
            Paneles, APIs, plataformas de cursos e infraestructura, de la idea
            al servidor.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
            <a
              href="#proyectos"
              className="inline-flex h-12 items-center rounded-full bg-ink px-6 text-[15px] font-semibold text-on-ink transition-opacity duration-[var(--dur-short)] hover:opacity-85"
            >
              Ver proyectos
            </a>
            <a
              href="#contacto"
              className="text-[15px] font-semibold text-ink underline decoration-rule decoration-2 underline-offset-[6px] transition-colors duration-[var(--dur-short)] hover:decoration-ink"
            >
              Escríbeme
            </a>
          </div>
        </div>

        <div className="min-w-0 lg:col-span-7">
          <Showcase />
        </div>
      </div>
    </section>
  );
}
