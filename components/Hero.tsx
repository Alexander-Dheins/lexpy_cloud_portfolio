import Showcase from "./showcase/Showcase";

export default function Hero() {
  return (
    <section id="top" aria-labelledby="hero-titulo">
      <div className="container-page pt-10 pb-24 lg:pt-14">
        <div className="mx-auto max-w-3xl text-center">
          <h1
            id="hero-titulo"
            lang="en"
            className="mx-auto max-w-[17ch] text-[clamp(2.5rem,5vw,4.25rem)] leading-[1.03] font-semibold tracking-[-0.035em]"
          >
            From development to production.
          </h1>
          <p className="mx-auto mt-5 max-w-[44ch] text-[1.1875rem] leading-relaxed text-muted">
            Paneles, APIs, plataformas de cursos e infraestructura, de la idea
            al servidor.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-7 gap-y-4">
            <a
              href="#contacto"
              className="inline-flex h-12 items-center rounded-full bg-ink px-6 text-[15px] font-semibold text-on-ink transition-opacity duration-[var(--dur-short)] hover:opacity-85"
            >
              Hablemos de tu proyecto
            </a>
            <a
              href="#servicios"
              className="text-[15px] font-semibold text-ink underline decoration-rule decoration-2 underline-offset-[6px] transition-colors duration-[var(--dur-short)] hover:decoration-ink"
            >
              Ver servicios
            </a>
          </div>
        </div>

        <div className="mt-12 lg:mt-14">
          <Showcase />
        </div>
      </div>
    </section>
  );
}
