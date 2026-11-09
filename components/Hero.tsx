import Showcase from "./showcase/Showcase";
import HeroBackdrop from "./HeroBackdrop";
import { getDict, type Lang } from "@/lib/i18n";

export default function Hero({ lang }: { lang: Lang }) {
  const t = getDict(lang).hero;
  return (
    <section id="top" aria-labelledby="hero-titulo">
      <div className="relative isolate">
        <HeroBackdrop />
        <div className="container-page relative pt-10 pb-12 lg:pt-14 lg:pb-14">
          <div className="mx-auto max-w-3xl text-center">
            <h1
              id="hero-titulo"
              className="text-halo mx-auto max-w-[17ch] text-[clamp(2.5rem,5vw,4.25rem)] leading-[1.03] font-semibold tracking-[-0.035em]"
            >
              {t.title}
            </h1>
            <p className="text-halo mx-auto mt-5 max-w-[44ch] text-[1.1875rem] leading-relaxed text-muted">
              {t.lead}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-7 gap-y-4">
              <a
                href="#contacto"
                className="inline-flex h-12 items-center rounded-full bg-ink px-6 text-[15px] font-semibold text-on-ink transition-opacity duration-[var(--dur-short)] hover:opacity-85"
              >
                {t.primary}
              </a>
              <a
                href="#servicios"
                className="text-[15px] font-semibold text-ink underline decoration-rule decoration-2 underline-offset-[6px] transition-colors duration-[var(--dur-short)] hover:decoration-ink"
              >
                {t.secondary}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="container-page pb-24">
        <div>
          <Showcase />
        </div>
      </div>
    </section>
  );
}
