import GlassCard from "./GlassCard";

// TODO: reemplaza por tu correo/enlaces reales antes de publicar.
const EMAIL = "tu@correo.com";

export default function Contact() {
  return (
    <section id="contacto" className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
      <GlassCard strong className="relative overflow-hidden px-8 py-14 text-center sm:px-16">
        <div className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-accent-red/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-accent-blue/10 blur-3xl" />

        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          ¿Tienes un proyecto en mente?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted">
          Escríbeme y conversamos sobre qué necesitas construir o desplegar.
        </p>

        <a
          href={`mailto:${EMAIL}`}
          className="mt-8 inline-block rounded-full bg-foreground px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-85"
        >
          {EMAIL}
        </a>
      </GlassCard>
    </section>
  );
}
