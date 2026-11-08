import type { CSSProperties } from "react";

/* Cada escena es la interfaz de un desarrollo, construida en HTML/CSS.
   Los datos son de muestra: sirven para enseñar la forma del producto,
   no son cifras reales de clientes. */

const d = (ms: number) => ({ "--d": ms }) as CSSProperties;

function Check({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden className={className} fill="none">
      <path
        d="M3.5 8.5l3 3 6-7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 1. Panel de gestión (CRM)                                          */
/* ------------------------------------------------------------------ */

const MONTHS = ["E", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
const BARS = [36, 48, 42, 58, 54, 66, 61, 72, 69, 80, 77, 92];
const KPIS = [
  { label: "Contactos activos", value: "1,240" },
  { label: "Procesos abiertos", value: "38" },
  { label: "Respuesta media", value: "2.4 h" },
];
const ROWS = [
  { name: "Solicitud de compra 1042", state: "En revisión", when: "Hoy" },
  { name: "Contrato de servicio 1039", state: "Aprobado", when: "Ayer" },
  { name: "Alta de proveedor 1037", state: "Pendiente", when: "Lun" },
];

export function DashboardScene() {
  return (
    <div className="flex h-full">
      <aside className="hidden w-40 shrink-0 flex-col border-r border-panel-glass-border p-4 @xl:flex">
        <p className="a-fade mb-6 text-sm font-semibold">crm</p>
        <ul className="space-y-1 text-[13px] text-panel-muted">
          {["Resumen", "Contactos", "Procesos", "Reportes", "Ajustes"].map(
            (item, i) => (
              <li
                key={item}
                style={d(80 + i * 60)}
                className={`a-fade rounded-md px-2.5 py-1.5 ${
                  i === 0 ? "bg-panel-2 text-panel-ink" : ""
                }`}
              >
                {item}
              </li>
            ),
          )}
        </ul>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col gap-5 p-5 @xl:p-6">
        <div className="a-fade flex items-center justify-between">
          <p className="text-[15px] font-semibold">Resumen</p>
          <div className="flex rounded-md bg-panel-2 p-0.5 text-[12px] text-panel-muted">
            <span className="px-2 py-0.5">7 días</span>
            <span className="rounded bg-panel-3 px-2 py-0.5 text-panel-ink">
              30 días
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3">
          {KPIS.map((kpi, i) => (
            <div
              key={kpi.label}
              style={d(150 + i * 90)}
              className={`a-rise min-w-0 ${
                i > 0 ? "border-l border-panel-rule pl-4" : ""
              } ${i < 2 ? "pr-4" : ""}`}
            >
              <p className="truncate text-[12px] text-panel-muted">
                {kpi.label}
              </p>
              <p className="mt-1 text-[22px] font-semibold tabular-nums @xl:text-[26px]">
                {kpi.value}
              </p>
            </div>
          ))}
        </div>

        <div className="relative flex min-h-0 flex-1 flex-col">
          <div className="pointer-events-none absolute inset-x-0 top-0 bottom-5 flex flex-col justify-between">
            {[0, 1, 2, 3].map((line) => (
              <span key={line} className="h-px bg-panel-rule" />
            ))}
          </div>
          <div className="relative flex min-h-0 flex-1 items-end gap-1.5 @xl:gap-2">
            {BARS.map((h, i) => (
              <span
                key={i}
                style={{ ...d(320 + i * 45), height: `${h}%` }}
                className={`a-grow-y flex-1 rounded-t-[3px] ${
                  i === BARS.length - 1 ? "bg-panel-ink" : "bg-panel-3"
                }`}
              />
            ))}
          </div>
          <div className="mt-1.5 flex gap-1.5 text-center text-[10.5px] text-panel-muted @xl:gap-2">
            {MONTHS.map((m, i) => (
              <span key={i} className="flex-1">
                {m}
              </span>
            ))}
          </div>
        </div>

        <ul className="divide-y divide-panel-rule border-t border-panel-rule text-[12.5px]">
          {ROWS.map((row, i) => (
            <li
              key={row.name}
              style={d(950 + i * 110)}
              className="a-rise grid grid-cols-[1fr_auto] gap-4 py-2 @lg:grid-cols-[1fr_7rem_3rem]"
            >
              <span className="truncate">{row.name}</span>
              <span className="text-panel-muted">{row.state}</span>
              <span className="hidden text-right text-panel-muted tabular-nums @lg:block">
                {row.when}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 2. API                                                             */
/* ------------------------------------------------------------------ */

const ENDPOINTS = [
  ["GET", "/v1/cursos"],
  ["POST", "/v1/inscripciones"],
  ["GET", "/v1/usuarios/:id"],
  ["PUT", "/v1/progreso"],
  ["POST", "/v1/pagos/webhook"],
  ["DELETE", "/v1/sesiones/:id"],
];

const RESPONSE: [number, string][] = [
  [0, "{"],
  [1, '"id": "ins_8f2a",'],
  [1, '"curso": "docker-desde-cero",'],
  [1, '"usuario": "usr_example",'],
  [1, '"estado": "activa",'],
  [1, '"progreso": 0,'],
  [1, '"creado": "2026-11-07T22:14:03Z"'],
  [0, "}"],
];

const REQUEST = [
  '"Authorization": "Bearer ••••••••"',
  '"Content-Type": "application/json"',
  '"body": { "curso": "docker-desde-cero" }',
];

const LATENCY = [
  42, 38, 45, 40, 36, 52, 47, 39, 41, 58, 44, 37, 40, 43, 61, 46, 38, 35, 42,
  48, 39, 44, 41, 37,
];

function JsonLine({ text }: { text: string }) {
  const match = text.match(/^("[^"]+"):\s(.*)$/);
  if (!match) return <>{text}</>;
  return (
    <>
      <span className="text-panel-muted">{match[1]}</span>: {match[2]}
    </>
  );
}

export function ApiScene() {
  return (
    <div className="grid h-full grid-rows-[minmax(0,1fr)] @xl:grid-cols-[13rem_1fr]">
      <aside className="hidden flex-col border-r border-panel-rule p-4 @xl:flex">
        <p className="a-fade mb-4 text-[12px] text-panel-muted">Endpoints</p>
        <ul className="space-y-1 font-mono text-[12px]">
          {ENDPOINTS.map(([method, path], i) => (
            <li
              key={path}
              style={d(60 + i * 60)}
              className={`a-fade flex gap-2 rounded-md px-2 py-1.5 ${
                i === 1 ? "bg-panel-2" : ""
              }`}
            >
              <span className="w-12 shrink-0 text-panel-muted">{method}</span>
              <span className="truncate">{path}</span>
            </li>
          ))}
        </ul>
      </aside>

      <div className="flex min-w-0 flex-col gap-4 p-5 @xl:p-6">
        <div className="a-fade flex flex-wrap items-center gap-x-3 gap-y-2">
          <p className="font-mono text-[13.5px]">
            <span className="text-panel-muted">POST</span> /v1/inscripciones
          </p>
          <span
            style={d(500)}
            className="a-pop rounded-md bg-panel-ink px-2 py-0.5 font-mono text-[11.5px] text-panel"
          >
            201 Created
          </span>
          <span
            style={d(560)}
            className="a-pop rounded-md bg-panel-2 px-2 py-0.5 font-mono text-[11.5px] text-panel-muted"
          >
            84 ms
          </span>
        </div>

        <div style={d(250)} className="a-rise glass-card p-4">
          <p className="mb-2 text-[12px] text-panel-muted">Petición</p>
          <pre className="font-mono text-[12.5px] leading-6">
            {REQUEST.map((line) => (
              <span key={line} className="block truncate">
                <JsonLine text={line} />
              </span>
            ))}
          </pre>
        </div>

        <div className="min-h-0 flex-1 overflow-hidden glass-card p-4">
          <p className="mb-2 text-[12px] text-panel-muted">Respuesta</p>
          <pre className="font-mono text-[12.5px] leading-6">
            {RESPONSE.map(([indent, text], i) => (
              <span
                key={i}
                style={d(700 + i * 120)}
                className="a-fade block truncate"
              >
                {indent ? "  " : ""}
                <JsonLine text={text} />
              </span>
            ))}
          </pre>
        </div>

        <div>
          <div className="mb-2 flex items-baseline justify-between text-[12px] text-panel-muted">
            <span>Latencia p95, últimas 24 h</span>
            <span className="font-mono tabular-nums">61 ms máx.</span>
          </div>
          <div className="flex h-10 items-end gap-[3px]">
            {LATENCY.map((h, i) => (
              <span
                key={i}
                style={{ ...d(1500 + i * 25), height: `${(h / 61) * 100}%` }}
                className={`a-grow-y flex-1 rounded-t-[2px] ${
                  h === 61 ? "bg-panel-ink" : "bg-panel-3"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Plataforma de cursos                                            */
/* ------------------------------------------------------------------ */

const LESSONS = [
  { title: "Instalación", done: true },
  { title: "Imágenes y contenedores", done: true },
  { title: "Volúmenes y persistencia", current: true },
  { title: "Redes" },
  { title: "Docker Compose" },
];

const TERMINAL = [
  "$ docker volume create datos",
  "datos",
  "$ docker run -d -v datos:/var/lib/postgresql/data postgres:16",
  "3f9c2e1b7a04",
  "$ docker volume inspect datos",
  "[",
  '  { "Name": "datos", "Driver": "local",',
  '    "Mountpoint": "/var/lib/docker/volumes/datos/_data" }',
  "]",
  "$ docker exec -it 3f9c psql -U postgres -c '\\l'",
];

export function CoursesScene() {
  return (
    <div className="grid h-full grid-rows-[minmax(0,1fr)] gap-5 p-5 @xl:grid-cols-[1fr_13.5rem] @xl:p-6">
      <div className="flex min-h-0 min-w-0 flex-col">
        <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden glass-card">
          <div className="flex-1 space-y-1.5 overflow-hidden p-4 font-mono text-[12px] leading-5 text-panel-muted @xl:p-5">
            {TERMINAL.map((line, i) => (
              <p
                key={i}
                style={d(300 + i * 220)}
                className={`a-fade truncate ${
                  line.startsWith("$") ? "text-panel-ink" : ""
                }`}
              >
                {line}
              </p>
            ))}
          </div>

          <div className="flex items-center gap-3 border-t border-panel-rule px-4 py-3">
            <svg
              viewBox="0 0 16 16"
              aria-hidden
              className="h-4 w-4 shrink-0 text-panel-ink"
            >
              <rect x="3" y="2.5" width="3.5" height="11" rx="1" fill="currentColor" />
              <rect x="9.5" y="2.5" width="3.5" height="11" rx="1" fill="currentColor" />
            </svg>
            <div className="relative h-1 flex-1 rounded-full bg-panel-3">
              <span
                style={d(200)}
                className="a-grow-x absolute inset-y-0 left-0 w-[42%] rounded-full bg-panel-ink [animation-duration:2600ms]"
              />
              <span
                style={d(2600)}
                className="a-pop absolute top-1/2 left-[42%] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-panel-ink"
              />
            </div>
            <span className="font-mono text-[11.5px] text-panel-muted tabular-nums">
              12:40 / 30:15
            </span>
            <span className="hidden rounded bg-panel-3 px-1.5 py-0.5 font-mono text-[11px] text-panel-muted @md:inline">
              1080p
            </span>
          </div>
        </div>

        <div className="a-rise mt-4" style={d(200)}>
          <p className="text-[15px] font-semibold">3. Volúmenes y persistencia</p>
          <p className="mt-0.5 text-[12.5px] text-panel-muted">
            Docker desde cero, lección 3 de 5
          </p>
        </div>
      </div>

      <aside className="hidden min-w-0 flex-col @xl:flex">
        <p className="a-fade mb-3 text-[12px] text-panel-muted">Contenido</p>
        <ol className="space-y-1">
          {LESSONS.map((lesson, i) => (
            <li
              key={lesson.title}
              style={d(250 + i * 90)}
              className={`a-rise flex items-center gap-2.5 rounded-md px-2 py-2 text-[12.5px] ${
                lesson.current ? "bg-panel-2" : ""
              } ${lesson.done || lesson.current ? "" : "text-panel-muted"}`}
            >
              <span
                className={`grid h-5 w-5 shrink-0 place-items-center rounded-full ${
                  lesson.done
                    ? "bg-panel-ink text-panel"
                    : lesson.current
                      ? "border-2 border-panel-ink"
                      : "border border-panel-4"
                }`}
              >
                {lesson.done ? <Check className="h-3 w-3" /> : null}
              </span>
              <span className="truncate">{lesson.title}</span>
            </li>
          ))}
        </ol>

        <div className="mt-auto">
          <div className="mb-2 flex justify-between text-[12px] text-panel-muted">
            <span>Tu avance</span>
            <span className="tabular-nums">2 de 5</span>
          </div>
          <div className="h-1 rounded-full bg-panel-3">
            <span
              style={d(700)}
              className="a-grow-x block h-full w-[40%] rounded-full bg-panel-ink"
            />
          </div>
        </div>
      </aside>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 4. Despliegue (Dokploy en el VPS)                                  */
/* ------------------------------------------------------------------ */

const STEPS = ["Push", "Build", "Imagen", "Deploy", "SSL"];

const LOGS = [
  ["22:14:00", "Webhook de GitHub recibido, push a master"],
  ["22:14:01", "Clonando lexpy_cloud_portfolio"],
  ["22:14:09", "Nixpacks: node 20, npm ci"],
  ["22:15:10", "367 paquetes instalados"],
  ["22:15:32", "next build, compilado sin errores"],
  ["22:15:41", "Imagen lexpycloud-portfoliocloud creada"],
  ["22:15:48", "Contenedor en marcha, puerto 3000"],
  ["22:15:49", "Traefik: ruta lexpy.cloud lista"],
  ["22:15:51", "Certificado Let's Encrypt para lexpy.cloud"],
];

const STATS = [
  { label: "CPU", value: 34 },
  { label: "Memoria", value: 41 },
  { label: "Disco", value: 22 },
];

const STEP_GAP = 520;

export function DeployScene() {
  return (
    <div className="flex h-full flex-col gap-5 p-5 @xl:p-6">
      <div className="a-fade flex flex-wrap items-center gap-x-3 gap-y-1.5">
        <p className="text-[15px] font-semibold">lexpy_cloud_portfolio</p>
        <span className="rounded bg-panel-2 px-1.5 py-0.5 font-mono text-[11.5px] text-panel-muted">
          master
        </span>
        <span className="font-mono text-[11.5px] text-panel-muted">cd6f7bc</span>
      </div>

      <div className="relative grid grid-cols-5">
        <span className="absolute top-3 right-[10%] left-[10%] h-px bg-panel-3" />
        <span
          style={d(250)}
          className="a-grow-x absolute top-3 right-[10%] left-[10%] h-px bg-panel-ink [animation-duration:2300ms] [animation-timing-function:linear]"
        />
        {STEPS.map((step, i) => (
          <div key={step} className="relative flex flex-col items-center gap-2">
            <span className="relative grid h-6 w-6 place-items-center rounded-full border border-panel-4 bg-panel">
              <span
                style={d(250 + i * STEP_GAP)}
                className="a-pop absolute inset-0 grid place-items-center rounded-full bg-panel-ink text-panel"
              >
                <Check className="h-3.5 w-3.5" />
              </span>
            </span>
            <span className="text-[12px] text-panel-muted">{step}</span>
          </div>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-hidden glass-card p-4 font-mono text-[12px] leading-6">
        {LOGS.map(([time, text], i) => (
          <p
            key={time}
            style={d(300 + i * 270)}
            className="a-fade flex gap-3"
          >
            <span className="shrink-0 text-panel-muted tabular-nums">{time}</span>
            <span className="truncate">{text}</span>
          </p>
        ))}
      </div>

      <div>
        <p className="mb-3 text-[12px] text-panel-muted">
          VPS KVM 2, 2 vCPU y 8 GB de RAM
        </p>
        <div className="grid grid-cols-3 gap-4 @xl:gap-6">
          {STATS.map((stat, i) => (
            <div key={stat.label} className="min-w-0">
              <div className="mb-1.5 flex justify-between text-[12px]">
                <span className="text-panel-muted">{stat.label}</span>
                <span className="tabular-nums">{stat.value}%</span>
              </div>
              <div className="h-1 rounded-full bg-panel-3">
                <span
                  style={{ ...d(2700 + i * 120), width: `${stat.value}%` }}
                  className="a-grow-x block h-full rounded-full bg-panel-ink"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
