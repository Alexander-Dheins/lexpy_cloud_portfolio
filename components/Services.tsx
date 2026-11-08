import GlassCard from "./GlassCard";

const SERVICES = [
  {
    title: "Desarrollo Web & APIs",
    description:
      "Aplicaciones y APIs a medida, desde el backend hasta la interfaz, pensadas para crecer.",
  },
  {
    title: "Automatización & DevOps",
    description:
      "Flujos de despliegue, integraciones y procesos que antes eran manuales y ya no deberían serlo.",
  },
  {
    title: "Infraestructura Self-Hosted",
    description:
      "Servidores, contenedores y redes configurados y asegurados a medida de cada proyecto.",
  },
  {
    title: "Consultoría en Digitalización",
    description:
      "Acompañamiento técnico para llevar procesos y sistemas existentes a una versión digital.",
  },
];

export default function Services() {
  return (
    <section id="servicios" className="container-page py-20 sm:py-28">
      <div className="mb-12 max-w-xl">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          En qué puedo ayudarte
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {SERVICES.map((service) => (
          <GlassCard key={service.title} className="p-7 transition-transform duration-[var(--dur-short)] hover:-translate-y-1">
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
