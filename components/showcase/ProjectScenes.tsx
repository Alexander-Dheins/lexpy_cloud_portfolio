import type { CSSProperties, ReactNode } from "react";
import { useI18n } from "@/components/i18n/I18nProvider";

/* Escenas de los proyectos de "Más proyectos". Datos de muestra. */

const d = (ms: number) => ({ "--d": ms }) as CSSProperties;

function Shell({ app, children, side }: { app: string; children: ReactNode; side?: ReactNode }) {
  return (
    <div className="flex h-full text-[13px]">
      <aside className="flex w-[64px] shrink-0 flex-col items-center gap-4 border-r border-panel-glass-border py-4">
        <span className="a-fade grid h-9 w-9 place-items-center rounded-lg bg-panel-ink text-[12px] font-bold text-panel">
          {app.charAt(0)}
        </span>
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            style={d(100 + i * 60)}
            className={`a-fade h-8 w-8 rounded-lg ${i === 0 ? "bg-panel-3" : "border border-panel-rule"}`}
          />
        ))}
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="a-fade flex items-center justify-between border-b border-panel-rule px-5 py-3.5">
          <p className="text-[15px] font-semibold">{app}</p>
          {side}
        </header>
        <div className="min-h-0 flex-1 p-4">{children}</div>
      </div>
    </div>
  );
}

function Kpis({ labels, values, delay = 160 }: { labels: string[]; values: string[]; delay?: number }) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {labels.map((label, i) => (
        <div key={label} style={d(delay + i * 80)} className="glass-card a-rise px-3.5 py-3">
          <p className="truncate text-[11.5px] text-panel-muted">{label}</p>
          <p className="mt-1 text-[22px] font-semibold tabular-nums">{values[i]}</p>
        </div>
      ))}
    </div>
  );
}

function Chip({ children, strong = false }: { children: ReactNode; strong?: boolean }) {
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-[11px] whitespace-nowrap ${
        strong ? "bg-panel-ink font-medium text-panel" : "border border-panel-rule text-panel-muted"
      }`}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Consultas legales                                                  */
/* ------------------------------------------------------------------ */

export function LegalScene() {
  const t = useI18n().t.legal;
  const current = 2;
  return (
    <Shell app={t.app} side={<Chip strong>{t.newLabel}</Chip>}>
      <div className="flex h-full flex-col gap-4">
        <div className="glass-card flex items-center px-6 py-4">
          {t.steps.map((step, i) => (
            <div key={step} className="flex flex-1 items-center last:flex-none">
              <div style={d(200 + i * 260)} className="a-pop flex items-center gap-2.5">
                <span
                  className={`grid h-8 w-8 place-items-center rounded-full text-[12px] font-semibold ${
                    i < current
                      ? "bg-panel-ink text-panel"
                      : i === current
                        ? "border-2 border-panel-ink text-panel-ink"
                        : "border border-panel-rule text-panel-muted"
                  }`}
                >
                  {i + 1}
                </span>
                <span className={i <= current ? "font-medium" : "text-panel-muted"}>{step}</span>
              </div>
              {i < t.steps.length - 1 ? (
                <span className="mx-4 h-px flex-1 bg-panel-rule">
                  {i < current ? (
                    <span style={d(330 + i * 260)} className="a-grow-x block h-full bg-panel-ink" />
                  ) : null}
                </span>
              ) : null}
            </div>
          ))}
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-[1.35fr_1fr] gap-4">
          <div className="glass-card overflow-hidden">
            <p className="border-b border-panel-rule px-4 py-3 font-medium">{t.listTitle}</p>
            <ul className="divide-y divide-panel-rule">
              {t.rows.map((row, i) => (
                <li
                  key={row.code}
                  style={d(500 + i * 110)}
                  className={`a-rise grid grid-cols-[4.5rem_1fr_auto] items-center gap-3 px-4 py-3 ${
                    i === 0 ? "bg-panel-glass-strong" : ""
                  }`}
                >
                  <span className="font-mono text-[11.5px] text-panel-muted">{row.code}</span>
                  <span className="min-w-0">
                    <span className="block truncate font-medium">{row.topic}</span>
                    <span className="text-[11.5px] text-panel-muted">{row.area}</span>
                  </span>
                  <Chip strong={row.state === 3}>{t.stateLabels[row.state]}</Chip>
                </li>
              ))}
            </ul>
          </div>

          <div style={d(420)} className="glass-card a-rise flex flex-col px-5 py-4">
            <p className="font-medium">{t.detailTitle}</p>
            <p className="mt-1 text-[11.5px] text-panel-muted">{t.attachments}</p>
            <ol className="mt-5 space-y-4">
              {t.timeline.map((event, i) => (
                <li key={i} style={d(700 + i * 220)} className="a-rise relative flex gap-3">
                  <span className="relative flex flex-col items-center">
                    <span
                      className={`mt-1 h-2.5 w-2.5 rounded-full ${
                        i === t.timeline.length - 1 ? "border-2 border-panel-ink" : "bg-panel-ink"
                      }`}
                    />
                    {i < t.timeline.length - 1 ? <span className="mt-1 w-px flex-1 bg-panel-rule" /> : null}
                  </span>
                  <span className="min-w-0 flex-1 pb-1">
                    <span className="flex justify-between gap-3">
                      <span className="font-medium">{event.who}</span>
                      <span className="text-[11.5px] text-panel-muted tabular-nums">{event.when}</span>
                    </span>
                    <span className="mt-0.5 block text-[12px] text-panel-muted">{event.what}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </Shell>
  );
}

/* ------------------------------------------------------------------ */
/* Planning                                                           */
/* ------------------------------------------------------------------ */

/* Inicio y duración de cada tarea en días (0 = lunes), y avance. */
const GANTT = [
  { start: 0, len: 2, done: 100 },
  { start: 1, len: 2.5, done: 100 },
  { start: 2, len: 1.5, done: 70 },
  { start: 3, len: 2, done: 40 },
  { start: 4, len: 1.5, done: 0 },
  { start: 5.5, len: 1.5, done: 0 },
];
const TODAY_AT = 4.4;

export function PlanningScene() {
  const t = useI18n().t.planning;
  return (
    <Shell app={t.app} side={<Chip>{t.week}</Chip>}>
      <div className="flex h-full flex-col gap-4">
        <Kpis labels={t.kpis} values={["72%", "18 / 21", "3", "1,240"]} />

        <div className="glass-card flex min-h-0 flex-1 flex-col px-4 py-4">
          <p className="a-fade font-medium">{t.title}</p>
          <div className="mt-4 grid min-h-0 flex-1 grid-cols-[13rem_1fr] gap-x-4">
            <div className="grid grid-rows-[1.5rem_repeat(6,1fr)] text-[12.5px]">
              <span className="text-[11.5px] text-panel-muted">{t.colTask}</span>
              {t.tasks.map((task, i) => (
                <span key={task} style={d(300 + i * 80)} className="a-fade flex flex-col justify-center border-t border-panel-rule">
                  <span className="truncate font-medium">{task}</span>
                  <span className="text-[11px] text-panel-muted">{t.owners[i]}</span>
                </span>
              ))}
            </div>

            <div className="relative grid grid-rows-[1.5rem_repeat(6,1fr)]">
              <div className="grid grid-cols-7 text-center text-[11.5px] text-panel-muted">
                {t.days.map((day) => (
                  <span key={day}>{day}</span>
                ))}
              </div>
              <div className="pointer-events-none absolute inset-x-0 top-6 bottom-0 grid grid-cols-7">
                {t.days.map((day) => (
                  <span key={day} className="border-l border-panel-rule" />
                ))}
              </div>
              {GANTT.map((bar, i) => (
                <div key={i} className="relative border-t border-panel-rule">
                  <span
                    style={{ ...d(420 + i * 140), left: `${(bar.start / 7) * 100}%`, width: `${(bar.len / 7) * 100}%` }}
                    className="a-grow-x absolute top-1/2 h-6 -translate-y-1/2 overflow-hidden rounded-md bg-panel-3"
                  >
                    <span style={{ width: `${bar.done}%` }} className="block h-full bg-panel-ink/85" />
                  </span>
                </div>
              ))}
              <span
                style={{ ...d(1400), left: `${(TODAY_AT / 7) * 100}%` }}
                className="a-fade absolute top-5 bottom-0 w-px bg-panel-ink"
              >
                <span className="absolute -top-1 left-1/2 -translate-x-1/2 -translate-y-full rounded bg-panel-ink px-1.5 text-[10.5px] font-semibold text-panel">
                  {t.today}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}

/* ------------------------------------------------------------------ */
/* Flota                                                              */
/* ------------------------------------------------------------------ */

const UNITS = [
  { plate: "V3K-482", type: 0, state: 0 },
  { plate: "B7T-115", type: 1, state: 0 },
  { plate: "C1M-907", type: 2, state: 1 },
  { plate: "A9P-330", type: 0, state: 2 },
  { plate: "G2R-761", type: 3, state: 0 },
  { plate: "B7T-118", type: 1, state: 2 },
  { plate: "C1M-910", type: 2, state: 0 },
];

/* Marcadores sobre el mapa, en % del panel. */
const MARKERS = [
  { x: 24, y: 64 },
  { x: 47, y: 38 },
  { x: 71, y: 56 },
  { x: 83, y: 24 },
];

export function FlotaScene() {
  const t = useI18n().t.flota;
  return (
    <Shell app={t.app}>
      <div className="flex h-full flex-col gap-4">
        <Kpis labels={t.kpis} values={["24", "15", "3", "6"]} />

        <div className="grid min-h-0 flex-1 grid-cols-[1fr_1.45fr_0.95fr] gap-4">
          <div className="glass-card overflow-hidden">
            <p className="border-b border-panel-rule px-4 py-3 font-medium">{t.listTitle}</p>
            <ul className="divide-y divide-panel-rule">
              {UNITS.map((unit, i) => (
                <li key={unit.plate} style={d(420 + i * 100)} className="a-rise flex items-center justify-between gap-2 px-4 py-2.5">
                  <span className="min-w-0">
                    <span className="block font-mono text-[12px] font-medium">{unit.plate}</span>
                    <span className="text-[11.5px] text-panel-muted">{t.types[unit.type]}</span>
                  </span>
                  <Chip strong={unit.state === 0}>{t.states[unit.state]}</Chip>
                </li>
              ))}
            </ul>
          </div>

          <div style={d(300)} className="glass-card a-fade relative overflow-hidden">
            <p className="absolute top-3 left-4 z-10 font-medium">{t.mapTitle}</p>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
              {[20, 40, 60, 80].map((v) => (
                <g key={v} className="text-panel-rule" stroke="currentColor" strokeWidth="0.25">
                  <line x1={v} y1="0" x2={v} y2="100" />
                  <line x1="0" y1={v} x2="100" y2={v} />
                </g>
              ))}
              <path
                d="M24 64 C 32 50, 40 46, 47 38 S 62 50, 71 56 S 80 30, 83 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.8"
                strokeDasharray="2 1.6"
                className="text-panel-muted"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            {MARKERS.map((m, i) => (
              <span
                key={i}
                style={{ ...d(700 + i * 220), left: `${m.x}%`, top: `${m.y}%` }}
                className="a-pop absolute -translate-x-1/2 -translate-y-1/2"
              >
                <span
                  className={`grid h-6 w-6 place-items-center rounded-full ${
                    i === 3 ? "bg-panel-ink text-panel" : "border-2 border-panel-ink bg-panel text-panel-ink"
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                </span>
              </span>
            ))}
          </div>

          <div style={d(380)} className="glass-card a-rise flex flex-col px-4 py-4">
            <p className="font-medium">{t.alertsTitle}</p>
            <ul className="mt-3 space-y-3">
              {t.alerts.map((alert, i) => (
                <li key={alert.unit} style={d(900 + i * 160)} className="a-rise rounded-lg border border-panel-rule px-3 py-2.5">
                  <p className="font-medium">{alert.what}</p>
                  <p className="mt-0.5 flex justify-between text-[11.5px] text-panel-muted">
                    <span className="font-mono">{alert.unit}</span>
                    <span>{alert.when}</span>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Shell>
  );
}

/* ------------------------------------------------------------------ */
/* Activos TI                                                         */
/* ------------------------------------------------------------------ */

const TYPE_SHARE = [42, 21, 18, 9, 10];

export function ActivosScene() {
  const t = useI18n().t.activos;
  return (
    <Shell app={t.app}>
      <div className="flex h-full flex-col gap-4">
        <Kpis labels={t.kpis} values={["486", "412", "51", "23"]} />

        <div className="grid min-h-0 flex-1 grid-cols-[1.6fr_1fr] gap-4">
          <div className="glass-card overflow-hidden">
            <p className="border-b border-panel-rule px-4 py-3 font-medium">{t.tableTitle}</p>
            <div className="grid grid-cols-[5rem_1.2fr_1.2fr_6.5rem] border-b border-panel-rule px-4 py-2 text-[11.5px] text-panel-muted">
              {t.cols.map((c) => (
                <span key={c}>{c}</span>
              ))}
            </div>
            <ul className="divide-y divide-panel-rule">
              {t.rows.map((row, i) => (
                <li
                  key={row.code}
                  style={d(420 + i * 100)}
                  className="a-rise grid grid-cols-[5rem_1.2fr_1.2fr_6.5rem] items-center px-4 py-2.5"
                >
                  <span className="font-mono text-[11.5px] text-panel-muted">{row.code}</span>
                  <span className="truncate font-medium">{row.item}</span>
                  <span className="truncate text-panel-muted">{row.who}</span>
                  <span>
                    <Chip strong={row.state === 0}>{t.states[row.state]}</Chip>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex min-h-0 flex-col gap-4">
            <div style={d(360)} className="glass-card a-rise px-4 py-4">
              <p className="font-medium">{t.byType}</p>
              <ul className="mt-3 space-y-2.5">
                {t.types.map((type, i) => (
                  <li key={type} className="grid grid-cols-[5.5rem_1fr_2.5rem] items-center gap-3 text-[12px]">
                    <span className="text-panel-muted">{type}</span>
                    <span className="h-2 rounded-full bg-panel-3">
                      <span
                        style={{ ...d(700 + i * 120), width: `${TYPE_SHARE[i] * 2}%` }}
                        className={`a-grow-x block h-full rounded-full ${i === 0 ? "bg-panel-ink" : "bg-panel-muted"}`}
                      />
                    </span>
                    <span className="text-right tabular-nums">{TYPE_SHARE[i]}%</span>
                  </li>
                ))}
              </ul>
            </div>
            <div style={d(520)} className="glass-card a-rise flex-1 px-4 py-4">
              <p className="font-medium">{t.warrantyTitle}</p>
              <ul className="mt-3 space-y-2">
                {t.warranty.map((w) => (
                  <li key={w} className="flex items-center gap-2.5 rounded-lg border border-panel-rule px-3 py-2.5">
                    <span className="h-2 w-2 rounded-full border-2 border-panel-ink" />
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
