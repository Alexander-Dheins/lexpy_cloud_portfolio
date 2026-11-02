import GlassCard from "./GlassCard";

const SERVICES = [
  {
    title: "Desarrollo Web & APIs",
    description:
      "Aplicaciones y APIs a medida — desde el backend hasta la interfaz, pensadas para crecer.",
    accent: "red" as const,
  },
  {
    title: "Automatización & DevOps",
    description:
      "Flujos de despliegue, integraciones y procesos que antes eran manuales y ya no deberían serlo.",
    accent: "blue" as const,
  },
  {
    title: "Infraestructura Self-Hosted",
    description:
      "Servidores, contenedores y redes configurados y asegurados a medida de cada proyecto.",
    accent: "red" as const,
  },
  {
    title: "Consultoría en Digitalización",
    description:
      "Acompañamiento técnico para llevar procesos y sistemas existentes a una versión digital.",
    accent: "blue" as const,
  },
];

export default function Services() {
  return (
    <section id="servicios" className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
      <div className="mb-12 max-w-xl">
        <h2 className="text-sm font-medium uppercase tracking-widest text-muted">
          Servicios
        </h2>
        <p className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          En qué puedo ayudarte
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {SERVICES.map((service) => (
          <GlassCard key={service.title} className="p-7 transition-transform hover:-translate-y-1">
            <span
              className={`mb-4 inline-block h-2.5 w-2.5 rounded-full ${
                service.accent === "red" ? "bg-accent-red" : "bg-accent-blue"
              }`}
            />
            <h3 className="text-lg font-semibold">{service.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {service.description}
            </p>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}
