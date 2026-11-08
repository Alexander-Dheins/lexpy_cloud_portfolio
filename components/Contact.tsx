import GlassCard from "./GlassCard";

// TODO: reemplaza por tu correo/enlaces reales antes de publicar.
const EMAIL = "tu@correo.com";

export default function Contact() {
  return (
    <section id="contacto" className="container-page py-20 sm:py-28">
      <GlassCard strong className="px-8 py-14 text-center sm:px-16">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          ¿Tienes un proyecto en mente?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted">
          Escríbeme y conversamos sobre qué necesitas construir o desplegar.
        </p>

        <a
          href={`mailto:${EMAIL}`}
          className="mt-8 inline-block rounded-full bg-ink px-6 py-3 text-sm font-semibold text-on-ink transition-opacity duration-[var(--dur-short)] hover:opacity-85"
        >
          {EMAIL}
        </a>
      </GlassCard>
    </section>
  );
}
