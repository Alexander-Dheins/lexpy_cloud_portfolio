import type { CSSProperties, ReactNode } from "react";
import { useI18n } from "@/components/i18n/I18nProvider";

/* Escenas de los proyectos de "Más proyectos". Datos de muestra. */

const d = (ms: number) => ({ "--d": ms }) as CSSProperties;

function Shell({
  app,
  children,
  side,
}: {
  app: string;
  children: ReactNode;
  side?: ReactNode;
}) {
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

function Kpis({
  labels,
  values,
  delay = 160,
}: {
  labels: string[];
  values: string[];
  delay?: number;
}) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {labels.map((label, i) => (
        <div
          key={label}
          style={d(delay + i * 80)}
          className="glass-card a-rise px-3.5 py-3"
        >
          <p className="truncate text-[11.5px] text-panel-muted">{label}</p>
          <p className="mt-1 text-[22px] font-semibold tabular-nums">
            {values[i]}
          </p>
        </div>
      ))}
    </div>
  );
}

function Chip({
  children,
  strong = false,
}: {
  children: ReactNode;
  strong?: boolean;
}) {
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-[11px] whitespace-nowrap ${
        strong
          ? "bg-panel-ink font-medium text-panel"
          : "border border-panel-rule text-panel-muted"
      }`}
    >
      {children}
    </span>
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
              <span className="text-[11.5px] text-panel-muted">
                {t.colTask}
              </span>
              {t.tasks.map((task, i) => (
                <span
                  key={task}
                  style={d(300 + i * 80)}
                  className="a-fade flex flex-col justify-center border-t border-panel-rule"
                >
                  <span className="truncate font-medium">{task}</span>
                  <span className="text-[11px] text-panel-muted">
                    {t.owners[i]}
                  </span>
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
                    style={{
                      ...d(420 + i * 140),
                      left: `${(bar.start / 7) * 100}%`,
                      width: `${(bar.len / 7) * 100}%`,
                    }}
                    className="a-grow-x absolute top-1/2 h-6 -translate-y-1/2 overflow-hidden rounded-md bg-panel-3"
                  >
                    <span
                      style={{ width: `${bar.done}%` }}
                      className="block h-full bg-panel-ink/85"
                    />
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
            <p className="border-b border-panel-rule px-4 py-3 font-medium">
              {t.listTitle}
            </p>
            <ul className="divide-y divide-panel-rule">
              {UNITS.map((unit, i) => (
                <li
                  key={unit.plate}
                  style={d(420 + i * 100)}
                  className="a-rise flex items-center justify-between gap-2 px-4 py-2.5"
                >
                  <span className="min-w-0">
                    <span className="block font-mono text-[12px] font-medium">
                      {unit.plate}
                    </span>
                    <span className="text-[11.5px] text-panel-muted">
                      {t.types[unit.type]}
                    </span>
                  </span>
                  <Chip strong={unit.state === 0}>{t.states[unit.state]}</Chip>
                </li>
              ))}
            </ul>
          </div>

          <div
            style={d(300)}
            className="glass-card a-fade relative overflow-hidden"
          >
            <p className="absolute top-3 left-4 z-10 font-medium">
              {t.mapTitle}
            </p>
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full"
              aria-hidden
            >
              {[20, 40, 60, 80].map((v) => (
                <g
                  key={v}
                  className="text-panel-rule"
                  stroke="currentColor"
                  strokeWidth="0.25"
                >
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
                    i === 3
                      ? "bg-panel-ink text-panel"
                      : "border-2 border-panel-ink bg-panel text-panel-ink"
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                </span>
              </span>
            ))}
          </div>

          <div
            style={d(380)}
            className="glass-card a-rise flex flex-col px-4 py-4"
          >
            <p className="font-medium">{t.alertsTitle}</p>
            <ul className="mt-3 space-y-3">
              {t.alerts.map((alert, i) => (
                <li
                  key={alert.unit}
                  style={d(900 + i * 160)}
                  className="a-rise rounded-lg border border-panel-rule px-3 py-2.5"
                >
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
            <p className="border-b border-panel-rule px-4 py-3 font-medium">
              {t.tableTitle}
            </p>
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
                  <span className="font-mono text-[11.5px] text-panel-muted">
                    {row.code}
                  </span>
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
                  <li
                    key={type}
                    className="grid grid-cols-[5.5rem_1fr_2.5rem] items-center gap-3 text-[12px]"
                  >
                    <span className="text-panel-muted">{type}</span>
                    <span className="h-2 rounded-full bg-panel-3">
                      <span
                        style={{
                          ...d(700 + i * 120),
                          width: `${TYPE_SHARE[i] * 2}%`,
                        }}
                        className={`a-grow-x block h-full rounded-full ${i === 0 ? "bg-panel-ink" : "bg-panel-muted"}`}
                      />
                    </span>
                    <span className="text-right tabular-nums">
                      {TYPE_SHARE[i]}%
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div style={d(520)} className="glass-card a-rise flex-1 px-4 py-4">
              <p className="font-medium">{t.warrantyTitle}</p>
              <ul className="mt-3 space-y-2">
                {t.warranty.map((w) => (
                  <li
                    key={w}
                    className="flex items-center gap-2.5 rounded-lg border border-panel-rule px-3 py-2.5"
                  >
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

/* ------------------------------------------------------------------ */
/* Planning: órdenes de trabajo y cumplimiento                        */
/* ------------------------------------------------------------------ */

export function PlanningBoardScene() {
  const t = useI18n().t.planning;
  const b = t.board;
  return (
    <Shell app={t.app} side={<Chip>{t.week}</Chip>}>
      <div className="flex h-full flex-col gap-4">
        <p className="a-fade font-medium">{b.title}</p>
        <div className="grid min-h-0 flex-1 grid-cols-3 gap-4">
          {b.columns.map((column, c) => {
            const cards = b.cards.filter((card) => card.col === c);
            return (
              <div
                key={column}
                style={d(120 + c * 120)}
                className="glass-card a-rise flex min-h-0 flex-col px-3 py-3"
              >
                <p className="flex items-center justify-between px-1 pb-3">
                  <span className="font-medium">{column}</span>
                  <span className="grid h-6 min-w-6 place-items-center rounded-full bg-panel-3 px-1.5 text-[11.5px] tabular-nums">
                    {cards.length}
                  </span>
                </p>
                <ul className="space-y-2.5">
                  {cards.map((card, i) => (
                    <li
                      key={card.code}
                      style={d(420 + c * 260 + i * 140)}
                      className={`a-rise rounded-xl border px-3.5 py-3 ${
                        c === 1
                          ? "border-panel-muted bg-panel-glass-strong"
                          : "border-panel-rule"
                      }`}
                    >
                      <p className="flex justify-between font-mono text-[11px] text-panel-muted">
                        <span>{card.code}</span>
                        <span>{card.area}</span>
                      </p>
                      <p className="mt-1.5 font-medium">{card.title}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="flex -space-x-1.5">
                          {[0, 1, 2].slice(0, 2 + (i % 2)).map((n) => (
                            <span
                              key={n}
                              className="h-5 w-5 rounded-full border-2 border-panel bg-panel-4"
                            />
                          ))}
                        </span>
                        {c === 1 ? (
                          <span className="h-1 w-20 rounded-full bg-panel-3">
                            <span
                              style={{
                                ...d(900 + i * 200),
                                width: i === 0 ? "64%" : "35%",
                              }}
                              className="a-grow-x block h-full rounded-full bg-panel-ink"
                            />
                          </span>
                        ) : (
                          <span className="text-[11px] text-panel-muted">
                            {b.crew}
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </Shell>
  );
}

const PLAN = [42, 48, 45, 52, 50, 55, 58, 54];
const REAL = [38, 45, 44, 47, 49, 52, 55, 39];
const CAUSE_SHARE = [38, 27, 18, 17];

export function PlanningComplianceScene() {
  const t = useI18n().t.planning;
  const c = t.compliance;
  const max = 60;
  return (
    <Shell app={t.app} side={<Chip>{t.week}</Chip>}>
      <div className="grid h-full grid-cols-[1.6fr_1fr] gap-4">
        <div className="glass-card flex min-h-0 flex-col px-5 py-4">
          <div className="a-fade flex items-start justify-between">
            <div>
              <p className="font-medium">{c.title}</p>
              <p className="mt-0.5 text-[12px] text-panel-muted">
                {c.subtitle}
              </p>
            </div>
            <div className="flex gap-4 text-[12px] text-panel-muted">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-panel-4" />
                {c.plan}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-panel-ink" />
                {c.real}
              </span>
            </div>
          </div>
          <div className="relative mt-5 flex min-h-0 flex-1 flex-col">
            <div className="pointer-events-none absolute inset-x-0 top-0 bottom-6 flex flex-col justify-between">
              {[0, 1, 2, 3].map((line) => (
                <span key={line} className="h-px bg-panel-rule" />
              ))}
            </div>
            <div className="relative flex min-h-0 flex-1 items-end gap-4">
              {PLAN.map((plan, i) => (
                <div
                  key={i}
                  className="flex h-full flex-1 items-end justify-center gap-1"
                >
                  <span
                    style={{
                      ...d(250 + i * 70),
                      height: `${(plan / max) * 100}%`,
                    }}
                    className="a-grow-y w-1/2 rounded-t-[3px] bg-panel-4"
                  />
                  <span
                    style={{
                      ...d(330 + i * 70),
                      height: `${(REAL[i] / max) * 100}%`,
                    }}
                    className="a-grow-y w-1/2 rounded-t-[3px] bg-panel-ink"
                  />
                </div>
              ))}
            </div>
            <div className="mt-2 flex gap-4 text-center text-[11px] text-panel-muted">
              {PLAN.map((_, i) => (
                <span key={i} className="flex-1">
                  {c.weekPrefix}
                  {38 + i}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex min-h-0 flex-col gap-4">
          <div style={d(300)} className="glass-card a-rise px-5 py-4">
            <p className="text-[12px] text-panel-muted">{c.summary}</p>
            <p className="mt-1 text-[34px] font-semibold tabular-nums">91.4%</p>
            <span className="mt-2 block h-1.5 rounded-full bg-panel-3">
              <span
                style={{ ...d(700), width: "91.4%" }}
                className="a-grow-x block h-full rounded-full bg-panel-ink"
              />
            </span>
          </div>
          <div style={d(420)} className="glass-card a-rise flex-1 px-5 py-4">
            <p className="font-medium">{c.causesTitle}</p>
            <ul className="mt-4 space-y-4">
              {c.causes.map((cause, i) => (
                <li key={cause}>
                  <p className="flex justify-between text-[12.5px]">
                    <span>{cause}</span>
                    <span className="text-panel-muted tabular-nums">
                      {CAUSE_SHARE[i]}%
                    </span>
                  </p>
                  <span className="mt-1.5 block h-1.5 rounded-full bg-panel-3">
                    <span
                      style={{
                        ...d(800 + i * 140),
                        width: `${CAUSE_SHARE[i] * 2.2}%`,
                      }}
                      className={`a-grow-x block h-full rounded-full ${i === 0 ? "bg-panel-ink" : "bg-panel-muted"}`}
                    />
                  </span>
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
/* Flota: mantenimiento y ficha de la unidad                          */
/* ------------------------------------------------------------------ */

const SERVICE_ROWS = [
  { plate: "V3K-482", progress: 62, state: 0 },
  { plate: "C1M-907", progress: 100, state: 2 },
  { plate: "B7T-118", progress: 88, state: 1 },
  { plate: "A9P-330", progress: 91, state: 1 },
  { plate: "G2R-761", progress: 34, state: 0 },
  { plate: "B7T-115", progress: 48, state: 0 },
];

export function FlotaMaintScene() {
  const t = useI18n().t.flota;
  const m = t.maint;
  return (
    <Shell app={t.app}>
      <div className="grid h-full grid-cols-[1.65fr_1fr] gap-4">
        <div className="glass-card overflow-hidden">
          <p className="border-b border-panel-rule px-4 py-3 font-medium">
            {m.title}
          </p>
          <div className="grid grid-cols-[6rem_1fr_1.3fr_5.5rem] gap-3 border-b border-panel-rule px-4 py-2.5 text-[11.5px] text-panel-muted">
            {m.cols.map((col) => (
              <span key={col}>{col}</span>
            ))}
          </div>
          <ul className="divide-y divide-panel-rule">
            {SERVICE_ROWS.map((row, i) => (
              <li
                key={row.plate}
                style={d(300 + i * 110)}
                className="a-rise grid grid-cols-[6rem_1fr_1.3fr_5.5rem] items-center gap-3 px-4 py-3.5"
              >
                <span className="font-mono text-[12px] font-medium">
                  {row.plate}
                </span>
                <span className="truncate">{m.services[i]}</span>
                <span className="h-1.5 rounded-full bg-panel-3">
                  <span
                    style={{ ...d(600 + i * 110), width: `${row.progress}%` }}
                    className={`a-grow-x block h-full rounded-full ${row.state === 0 ? "bg-panel-muted" : "bg-panel-ink"}`}
                  />
                </span>
                <span>
                  <Chip strong={row.state === 2}>{m.states[row.state]}</Chip>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div
          style={d(260)}
          className="glass-card a-rise flex flex-col px-4 py-4"
        >
          <p className="font-medium">{m.ordersTitle}</p>
          <ul className="mt-3 space-y-3">
            {m.orders.map((order, i) => (
              <li
                key={order.code}
                style={d(700 + i * 180)}
                className="a-rise rounded-xl border border-panel-rule px-3.5 py-3"
              >
                <p className="flex justify-between font-mono text-[11px] text-panel-muted">
                  <span>{order.code}</span>
                  <span>{order.unit}</span>
                </p>
                <p className="mt-1.5 font-medium">{order.what}</p>
                <span className="mt-2.5 block h-1 rounded-full bg-panel-3">
                  <span
                    style={{
                      ...d(1000 + i * 180),
                      width: `${[70, 40, 15][i]}%`,
                    }}
                    className="a-grow-x block h-full rounded-full bg-panel-ink"
                  />
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Shell>
  );
}

const FUEL = [31.2, 30.4, 32.1, 29.8, 31.6, 33.0];

export function FlotaUnitScene() {
  const t = useI18n().t.flota;
  const u = t.unit;
  const max = 36;
  return (
    <Shell app={t.app} side={<Chip strong>V3K-482</Chip>}>
      <div className="grid h-full grid-cols-[1fr_1.35fr] gap-4">
        <div className="flex min-h-0 flex-col gap-4">
          <div
            style={d(160)}
            className="glass-card a-rise flex items-center gap-4 px-4 py-4"
          >
            <span className="grid h-14 w-20 shrink-0 place-items-center rounded-xl bg-panel-2">
              <svg
                viewBox="0 0 48 24"
                aria-hidden
                className="h-7 w-12 text-panel-ink"
                fill="none"
              >
                <path
                  d="M3 17V12l5-6h16l7 6h12a2 2 0 0 1 2 2v3"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <circle
                  cx="12"
                  cy="18"
                  r="3.2"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <circle
                  cx="36"
                  cy="18"
                  r="3.2"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
              </svg>
            </span>
            <div className="min-w-0">
              <p className="font-mono text-[15px] font-semibold">V3K-482</p>
              <p className="text-[12px] text-panel-muted">{u.model}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div style={d(240)} className="glass-card a-rise px-4 py-3">
              <p className="text-[11.5px] text-panel-muted">{u.driver}</p>
              <p className="mt-1 font-medium">Raúl Ticona</p>
            </div>
            <div style={d(300)} className="glass-card a-rise px-4 py-3">
              <p className="text-[11.5px] text-panel-muted">{u.odometer}</p>
              <p className="mt-1 font-medium tabular-nums">48,215 km</p>
            </div>
          </div>
          <div style={d(380)} className="glass-card a-rise flex-1 px-4 py-4">
            <p className="font-medium">{u.docsTitle}</p>
            <ul className="mt-3 space-y-2.5">
              {u.docs.map((doc, i) => (
                <li
                  key={doc.name}
                  style={d(600 + i * 140)}
                  className="a-rise flex items-center justify-between gap-3 rounded-lg border border-panel-rule px-3 py-2.5"
                >
                  <span className="font-medium">{doc.name}</span>
                  <span
                    className={`text-[11.5px] ${doc.ok ? "text-panel-muted" : "rounded-full bg-panel-ink px-2 py-0.5 font-medium text-panel"}`}
                  >
                    {doc.until}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex min-h-0 flex-col gap-4">
          <div
            style={d(300)}
            className="glass-card a-rise flex min-h-0 flex-1 flex-col px-5 py-4"
          >
            <p className="flex items-baseline justify-between">
              <span className="font-medium">{u.fuelTitle}</span>
              <span className="text-[12px] text-panel-muted">{u.fuelUnit}</span>
            </p>
            <div className="mt-4 flex min-h-0 flex-1 items-end gap-4">
              {FUEL.map((value, i) => (
                <div
                  key={i}
                  className="flex h-full flex-1 flex-col justify-end gap-1.5 text-center"
                >
                  <span className="text-[11px] tabular-nums text-panel-muted">
                    {value.toFixed(1)}
                  </span>
                  <span
                    style={{
                      ...d(500 + i * 90),
                      height: `${(value / max) * 80}%`,
                    }}
                    className={`a-grow-y block rounded-t-[4px] ${i === FUEL.length - 1 ? "bg-panel-ink" : "bg-panel-3"}`}
                  />
                </div>
              ))}
            </div>
            <div className="mt-2 flex gap-4 text-center text-[11px] text-panel-muted">
              {u.months.map((month) => (
                <span key={month} className="flex-1">
                  {month}
                </span>
              ))}
            </div>
          </div>
          <div style={d(460)} className="glass-card a-rise px-5 py-4">
            <p className="font-medium">{u.tripsTitle}</p>
            <ul className="mt-2 divide-y divide-panel-rule">
              {u.trips.map((trip, i) => (
                <li
                  key={trip}
                  className="flex justify-between py-2 text-[12.5px]"
                >
                  <span>{trip}</span>
                  <span className="text-panel-muted tabular-nums">
                    {["186 km", "24 km", "24 km"][i]}
                  </span>
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
/* Activos TI: ficha del equipo y movimientos                         */
/* ------------------------------------------------------------------ */

export function ActivosDetailScene() {
  const t = useI18n().t.activos;
  const dt = t.detail;
  return (
    <Shell app={t.app} side={<Chip strong>TI-0481</Chip>}>
      <div className="grid h-full grid-cols-[1fr_1.15fr] gap-4">
        <div className="flex min-h-0 flex-col gap-4">
          <div
            style={d(160)}
            className="glass-card a-rise flex items-center gap-4 px-4 py-4"
          >
            <span className="grid h-14 w-20 shrink-0 place-items-center rounded-xl bg-panel-2">
              <svg
                viewBox="0 0 40 28"
                aria-hidden
                className="h-8 w-11 text-panel-ink"
                fill="none"
              >
                <rect
                  x="7"
                  y="3"
                  width="26"
                  height="17"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <path
                  d="M3 24h34"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <div className="min-w-0">
              <p className="text-[15px] font-semibold">{t.rows[0].item}</p>
              <p className="text-[12px] text-panel-muted">{dt.assigned}</p>
            </div>
          </div>
          <div style={d(260)} className="glass-card a-rise flex-1 px-4 py-4">
            <p className="font-medium">{dt.specsTitle}</p>
            <dl className="mt-3 divide-y divide-panel-rule">
              {dt.specs.map(([label, value], i) => (
                <div
                  key={label}
                  style={d(480 + i * 90)}
                  className="a-fade flex justify-between gap-4 py-2.5"
                >
                  <dt className="text-panel-muted">{label}</dt>
                  <dd
                    className={
                      label.startsWith("Seri") ? "font-mono text-[12px]" : ""
                    }
                  >
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="flex min-h-0 flex-col gap-4">
          <div style={d(320)} className="glass-card a-rise flex-1 px-5 py-4">
            <p className="font-medium">{dt.historyTitle}</p>
            <ol className="mt-4 space-y-4">
              {dt.history.map((event, i) => (
                <li
                  key={event.what}
                  style={d(600 + i * 200)}
                  className="a-rise flex gap-3"
                >
                  <span className="flex flex-col items-center">
                    <span
                      className={`mt-1 h-2.5 w-2.5 rounded-full ${i === 0 ? "bg-panel-ink" : "border-2 border-panel-muted"}`}
                    />
                    {i < dt.history.length - 1 ? (
                      <span className="mt-1 w-px flex-1 bg-panel-rule" />
                    ) : null}
                  </span>
                  <span className="flex flex-1 justify-between gap-3 pb-1">
                    <span className={i === 0 ? "font-medium" : ""}>
                      {event.what}
                    </span>
                    <span className="text-[11.5px] text-panel-muted tabular-nums">
                      {event.when}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <div
            style={d(460)}
            className="glass-card a-rise flex items-center justify-between gap-4 px-5 py-4"
          >
            <div>
              <p className="font-medium">{dt.actTitle}</p>
              <p className="mt-0.5 text-[12px] text-panel-muted">
                {dt.warranty}
              </p>
            </div>
            <span style={d(1500)} className="a-pop">
              <Chip strong>{dt.actState}</Chip>
            </span>
          </div>
        </div>
      </div>
    </Shell>
  );
}

const AREA_COUNT = [148, 112, 64, 98, 64];

export function ActivosMovesScene() {
  const t = useI18n().t.activos;
  const mv = t.moves;
  const max = Math.max(...AREA_COUNT);
  return (
    <Shell app={t.app}>
      <div className="grid h-full grid-cols-[1.6fr_1fr] gap-4">
        <div className="glass-card overflow-hidden">
          <p className="border-b border-panel-rule px-4 py-3 font-medium">
            {mv.title}
          </p>
          <ul className="divide-y divide-panel-rule">
            {mv.rows.map((row, i) => (
              <li
                key={i}
                style={d(300 + i * 110)}
                className="a-rise grid grid-cols-[6.5rem_1fr_auto] items-center gap-3 px-4 py-3.5"
              >
                <span>
                  <Chip strong={row.kind === 0}>{mv.kinds[row.kind]}</Chip>
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-medium">{row.item}</span>
                  <span className="text-[11.5px] text-panel-muted">
                    {row.from} → {row.to}
                  </span>
                </span>
                <span className="text-[11.5px] text-panel-muted">
                  {row.when}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div
          style={d(260)}
          className="glass-card a-rise flex min-h-0 flex-col px-5 py-4"
        >
          <p className="font-medium">{mv.byAreaTitle}</p>
          <div className="mt-5 flex min-h-0 flex-1 items-end gap-3">
            {AREA_COUNT.map((count, i) => (
              <div
                key={i}
                className="flex h-full flex-1 flex-col justify-end gap-1.5 text-center"
              >
                <span className="text-[11px] tabular-nums text-panel-muted">
                  {count}
                </span>
                <span
                  style={{
                    ...d(600 + i * 100),
                    height: `${(count / max) * 82}%`,
                  }}
                  className={`a-grow-y block rounded-t-[4px] ${i === 0 ? "bg-panel-ink" : "bg-panel-3"}`}
                />
              </div>
            ))}
          </div>
          <div className="mt-2 flex gap-3 text-center text-[10.5px] leading-tight text-panel-muted">
            {mv.areas.map((area) => (
              <span key={area} className="flex-1 truncate">
                {area}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}
