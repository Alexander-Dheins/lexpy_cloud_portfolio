import GlassCard from "./GlassCard";

interface Project {
  title: string;
  description: string;
  tag: string;
  href?: string;
  status: "Próximamente" | "En vivo";
}

const PROJECTS: Project[] = [
  {
    title: "Plataforma de cursos",
    description: "Cursos con video, progreso y streaming adaptativo.",
    tag: "cursos.lexpy.cloud",
    status: "Próximamente",
  },
  {
    title: "API & backend",
    description: "Servicios y endpoints que dan soporte al resto de proyectos.",
    tag: "api.lexpy.cloud",
    status: "Próximamente",
  },
  {
    title: "Panel / CRM",
    description: "Gestión de contactos, procesos y reportes internos.",
    tag: "crm.lexpy.cloud",
    status: "Próximamente",
  },
];

export default function Projects() {
  return (
    <section id="proyectos" className="container-page py-20 sm:py-28">
      <div className="mb-12 max-w-xl">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Lo que se está construyendo
        </h2>
        <p className="mt-3 text-sm text-muted">
          Cada proyecto corre en su propio subdominio, desplegado sobre la
          misma infraestructura self-hosted.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {PROJECTS.map((project) => (
          <GlassCard key={project.title} className="flex flex-col p-7">
            <div className="mb-6 flex items-center justify-between">
              <span className="rounded-full border border-rule px-2.5 py-1 font-mono text-[11px] text-muted">
                {project.tag}
              </span>
              <span
                className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                  project.status === "En vivo"
                    ? "bg-ink text-on-ink"
                    : "bg-ink/5 text-muted"
                }`}
              >
                {project.status}
              </span>
            </div>
            <h3 className="text-lg font-semibold">{project.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {project.description}
            </p>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}
