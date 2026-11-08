import type { CSSProperties } from "react";
import { useI18n } from "@/components/i18n/I18nProvider";

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

const BARS = [36, 48, 42, 58, 54, 66, 61, 72, 69, 80, 77, 92];
const KPIS = [
  { label: "Contactos activos", value: "1,240" },
  { label: "Procesos abiertos", value: "38" },
  { label: "Respuesta media", value: "2.4 h" },
];

export function DashboardScene() {
  const t = useI18n().t.crm;
  return (
    <div className="flex h-full">
      <aside className="hidden w-40 shrink-0 flex-col border-r border-panel-glass-border p-4 @xl:flex">
        <p className="a-fade mb-6 text-sm font-semibold">crm</p>
        <ul className="space-y-1 text-[13px] text-panel-muted">
          {t.menu.map((item, i) => (
            <li
              key={item}
              style={d(80 + i * 60)}
              className={`a-fade rounded-md px-2.5 py-1.5 ${
                i === 0 ? "bg-panel-2 text-panel-ink" : ""
              }`}
            >
              {item}
            </li>
          ))}
        </ul>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col gap-5 p-5 @xl:p-6">
        <div className="a-fade flex items-center justify-between">
          <p className="text-[15px] font-semibold">{t.title}</p>
          <div className="flex rounded-md bg-panel-2 p-0.5 text-[12px] text-panel-muted">
            <span className="px-2 py-0.5">{t.range7}</span>
            <span className="rounded bg-panel-3 px-2 py-0.5 text-panel-ink">
              {t.range30}
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
                {t.kpis[i]}
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
            {t.monthLetters.map((m, i) => (
              <span key={i} className="flex-1">
                {m}
              </span>
            ))}
          </div>
        </div>

        <ul className="divide-y divide-panel-rule border-t border-panel-rule text-[12.5px]">
          {t.rows.map((row, i) => (
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

const REQUEST = [
  '"Authorization": "Bearer ••••••••"',
  '"Content-Type": "application/json"',
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
  const t = useI18n().t.api;
  return (
    <div className="grid h-full grid-rows-[minmax(0,1fr)] @xl:grid-cols-[13rem_1fr]">
      <aside className="hidden flex-col border-r border-panel-rule p-4 @xl:flex">
        <p className="a-fade mb-4 text-[12px] text-panel-muted">
          {t.endpoints}
        </p>
        <ul className="space-y-1 font-mono text-[12px]">
          {ENDPOINTS.map(([method], i) => (
            <li
              key={i}
              style={d(60 + i * 60)}
              className={`a-fade flex gap-2 rounded-md px-2 py-1.5 ${
                i === 1 ? "bg-panel-2" : ""
              }`}
            >
              <span className="w-12 shrink-0 text-panel-muted">{method}</span>
              <span className="truncate">{t.paths[i]}</span>
            </li>
          ))}
        </ul>
      </aside>

      <div className="flex min-w-0 flex-col gap-4 p-5 @xl:p-6">
        <div className="a-fade flex flex-wrap items-center gap-x-3 gap-y-2">
          <p className="font-mono text-[13.5px]">
            <span className="text-panel-muted">POST</span> {t.paths[1]}
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
          <p className="mb-2 text-[12px] text-panel-muted">{t.request}</p>
          <pre className="font-mono text-[12.5px] leading-6">
            {[...REQUEST, t.body].map((line) => (
              <span key={line} className="block truncate">
                <JsonLine text={line} />
              </span>
            ))}
          </pre>
        </div>

        <div className="min-h-0 flex-1 overflow-hidden glass-card p-4">
          <p className="mb-2 text-[12px] text-panel-muted">{t.response}</p>
          <pre className="font-mono text-[12.5px] leading-6">
            {["{", ...t.json, "}"].map((text, i, all) => (
              <span
                key={i}
                style={d(700 + i * 120)}
                className="a-fade block truncate"
              >
                {i > 0 && i < all.length - 1 ? "  " : ""}
                <JsonLine text={text} />
              </span>
            ))}
          </pre>
        </div>

        <div>
          <div className="mb-2 flex items-baseline justify-between text-[12px] text-panel-muted">
            <span>{t.latency}</span>
            <span className="font-mono tabular-nums">{t.latencyMax}</span>
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

export function CoursesScene() {
  const t = useI18n().t.courses;
  return (
    <div className="grid h-full grid-rows-[minmax(0,1fr)] gap-5 p-5 @xl:grid-cols-[1fr_13.5rem] @xl:p-6">
      <div className="flex min-h-0 min-w-0 flex-col">
        <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden glass-card">
          <div className="flex-1 space-y-1.5 overflow-hidden p-4 font-mono text-[12px] leading-5 text-panel-muted @xl:p-5">
            {t.terminal.map((line, i) => (
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
              <rect
                x="3"
                y="2.5"
                width="3.5"
                height="11"
                rx="1"
                fill="currentColor"
              />
              <rect
                x="9.5"
                y="2.5"
                width="3.5"
                height="11"
                rx="1"
                fill="currentColor"
              />
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
          <p className="text-[15px] font-semibold">{t.lessonTitle}</p>
          <p className="mt-0.5 text-[12.5px] text-panel-muted">
            {t.lessonMeta}
          </p>
        </div>
      </div>

      <aside className="hidden min-w-0 flex-col @xl:flex">
        <p className="a-fade mb-3 text-[12px] text-panel-muted">{t.contents}</p>
        <ol className="space-y-1">
          {LESSONS.map((lesson, i) => (
            <li
              key={i}
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
              <span className="truncate">{t.lessons[i]}</span>
            </li>
          ))}
        </ol>

        <div className="mt-auto">
          <div className="mb-2 flex justify-between text-[12px] text-panel-muted">
            <span>{t.progress}</span>
            <span className="tabular-nums">{t.progressValue}</span>
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

const LOG_TIMES = [
  "22:14:00",
  "22:14:01",
  "22:14:09",
  "22:15:10",
  "22:15:32",
  "22:15:41",
  "22:15:48",
  "22:15:49",
  "22:15:51",
];

const STAT_VALUES = [34, 41, 22];

const STEP_GAP = 520;

export function DeployScene() {
  const t = useI18n().t.deploy;
  return (
    <div className="flex h-full flex-col gap-5 p-5 @xl:p-6">
      <div className="a-fade flex flex-wrap items-center gap-x-3 gap-y-1.5">
        <p className="text-[15px] font-semibold">lexpy_cloud_portfolio</p>
        <span className="rounded bg-panel-2 px-1.5 py-0.5 font-mono text-[11.5px] text-panel-muted">
          master
        </span>
        <span className="font-mono text-[11.5px] text-panel-muted">
          cd6f7bc
        </span>
      </div>

      <div className="relative grid grid-cols-5">
        <span className="absolute top-3 right-[10%] left-[10%] h-px bg-panel-3" />
        <span
          style={d(250)}
          className="a-grow-x absolute top-3 right-[10%] left-[10%] h-px bg-panel-ink [animation-duration:2300ms] [animation-timing-function:linear]"
        />
        {t.steps.map((step, i) => (
          <div key={i} className="relative flex flex-col items-center gap-2">
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
        {t.logs.map((text, i) => (
          <p key={i} style={d(300 + i * 270)} className="a-fade flex gap-3">
            <span className="shrink-0 text-panel-muted tabular-nums">
              {LOG_TIMES[i]}
            </span>
            <span className="truncate">{text}</span>
          </p>
        ))}
      </div>

      <div>
        <p className="mb-3 text-[12px] text-panel-muted">{t.server}</p>
        <div className="grid grid-cols-3 gap-4 @xl:gap-6">
          {STAT_VALUES.map((value, i) => (
            <div key={i} className="min-w-0">
              <div className="mb-1.5 flex justify-between text-[12px]">
                <span className="text-panel-muted">{t.stats[i]}</span>
                <span className="tabular-nums">{value}%</span>
              </div>
              <div className="h-1 rounded-full bg-panel-3">
                <span
                  style={{ ...d(2700 + i * 120), width: `${value}%` }}
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
