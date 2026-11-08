import type { CSSProperties } from "react";
import { useI18n } from "@/components/i18n/I18nProvider";

/* MINEOPS: control de embarque del personal con registro facial y GPS.
   Nombres, DNI y coordenadas son de muestra. */

const d = (ms: number) => ({ "--d": ms }) as CSSProperties;

const WORKERS = [
  { name: "Luis Huamán Torres", dni: "4521", time: "08:46", date: "06/11/2026", loc: "-16.4021, -71.5374", manual: true },
  { name: "Carla Mendoza Ríos", dni: "7730", time: "08:38", date: "06/11/2026", loc: "-16.4019, -71.5371", manual: false },
  { name: "Jorge Quispe Laura", dni: "1186", time: "08:31", date: "06/11/2026", loc: "-16.4022, -71.5376", manual: false },
  { name: "Ana Paredes Cutipa", dni: "9054", time: "08:24", date: "06/11/2026", loc: "-16.4020, -71.5373", manual: false },
  { name: "Miguel Rojas Apaza", dni: "3318", time: "18:19", date: "05/11/2026", loc: "-17.1794, -70.9312", manual: true },
  { name: "Rosa Condori Mamani", dni: "6642", time: "18:14", date: "05/11/2026", loc: "-17.1791, -70.9315", manual: false },
  { name: "Pedro Flores Vargas", dni: "2207", time: "18:09", date: "05/11/2026", loc: "-17.1796, -70.9310", manual: false },
];

const KPI_VALUES = ["128", "122", "6", "0"];

/* Noviembre de 2026 empieza en domingo: seis huecos antes del día 1. */
const LEAD = 6;
const MARKED = new Set([2, 3, 4, 5, 6]);
const TODAY = 6;

function FaceIcon() {
  return (
    <svg viewBox="0 0 28 28" aria-hidden className="h-7 w-7 shrink-0 text-panel-muted" fill="none">
      <path d="M3 9V5.5A2.5 2.5 0 0 1 5.5 3H9M19 3h3.5A2.5 2.5 0 0 1 25 5.5V9M25 19v3.5a2.5 2.5 0 0 1-2.5 2.5H19M9 25H5.5A2.5 2.5 0 0 1 3 22.5V19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="14" cy="11" r="3.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8.5 21c.8-3 3-4.6 5.5-4.6s4.7 1.6 5.5 4.6" fill="currentColor" className="text-panel-ink" />
    </svg>
  );
}

function Pin() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden className="h-3.5 w-3.5 shrink-0" fill="none">
      <path d="M8 14s4.5-4.2 4.5-7.5a4.5 4.5 0 1 0-9 0C3.5 9.8 8 14 8 14z" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8" cy="6.5" r="1.6" fill="currentColor" />
    </svg>
  );
}

export default function MineopsScene() {
  const t = useI18n().t.mineops;

  return (
    <div className="flex h-full text-[13px]">
      <aside className="flex w-[218px] shrink-0 flex-col border-r border-panel-glass-border bg-panel/60">
        <div className="a-fade flex items-center gap-2.5 border-b border-panel-rule px-4 py-4">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-panel-ink text-[12px] font-bold text-panel">
            M
          </span>
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold">{t.project}</p>
            <p className="text-[11.5px] text-panel-muted">{t.app}</p>
          </div>
        </div>

        <nav className="flex-1 space-y-4 px-3 py-4 text-[12.5px]">
          <p style={d(80)} className="a-fade px-2 text-panel-muted">← {t.back}</p>
          <div style={d(140)} className="a-fade">
            <p className="px-2 text-[11px] text-panel-muted">{t.groups[0]}</p>
            <p className="mt-1 rounded-md px-2 py-1.5">{t.general}</p>
          </div>
          <div style={d(200)} className="a-fade">
            <p className="px-2 text-[11px] text-panel-muted">{t.groups[1]}</p>
            <p className="mt-1 rounded-md px-2 py-1.5">{t.panel}</p>
          </div>
          <div style={d(260)} className="a-fade">
            <p className="px-2 text-[11px] text-panel-muted">{t.groups[2]}</p>
            <p className="mt-1 flex items-center gap-2 px-2 py-1.5 font-medium">
              <span className="rounded bg-panel-ink px-1.5 text-[10.5px] font-bold text-panel">M1</span>
              {t.m1}
            </p>
            <ul className="mt-0.5 space-y-0.5">
              {t.m1Items.map((item, i) => (
                <li
                  key={item}
                  style={d(320 + i * 50)}
                  className={`a-fade rounded-md py-1.5 pr-2 pl-9 ${
                    i === 0 ? "bg-panel-3 text-panel-ink" : "text-panel-muted"
                  }`}
                >
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-1 flex items-center gap-2 px-2 py-1.5 text-panel-muted">
              <span className="rounded bg-panel-3 px-1.5 text-[10.5px] font-bold text-panel-ink">M2</span>
              {t.m2}
            </p>
          </div>
        </nav>

        <div className="flex items-center gap-2.5 border-t border-panel-rule px-4 py-3">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-panel-3 text-[11px] font-semibold">AS</span>
          <div className="min-w-0 text-[12px]">
            <p className="truncate font-medium">{t.user}</p>
            <p className="text-panel-muted">{t.role}</p>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="a-fade flex items-center justify-between border-b border-panel-rule px-5 py-3.5">
          <p className="truncate text-[12.5px] text-panel-muted">
            {t.crumbs[0]} / {t.crumbs[1]} / <span className="text-panel-ink">{t.crumbs[2]}</span>
          </p>
          <span className="rounded-full bg-panel-ink px-3 py-1 text-[11.5px] font-semibold text-panel">
            {t.status}
          </span>
        </header>

        <div className="grid min-h-0 flex-1 grid-cols-[1fr_250px] gap-4 p-4">
          <div className="flex min-h-0 flex-col gap-4">
            <div className="grid grid-cols-4 gap-3">
              {t.kpis.map((label, i) => (
                <div key={label} style={d(160 + i * 80)} className="glass-card a-rise px-3.5 py-3">
                  <p className="truncate text-[11.5px] text-panel-muted">{label}</p>
                  <p className="mt-1 text-[22px] font-semibold tabular-nums">{KPI_VALUES[i]}</p>
                </div>
              ))}
            </div>

            <div className="glass-card min-h-0 flex-1 overflow-hidden">
              <div className="grid grid-cols-[1.6fr_0.8fr_1fr] border-b border-panel-rule px-4 py-2.5 text-[11.5px] text-panel-muted">
                {t.cols.map((c) => (
                  <span key={c}>{c}</span>
                ))}
              </div>
              <ul className="divide-y divide-panel-rule">
                {WORKERS.map((w, i) => (
                  <li
                    key={w.dni}
                    style={d(420 + i * 110)}
                    className={`a-rise grid grid-cols-[1.6fr_0.8fr_1fr] items-center px-4 py-2 ${
                      i === 0 ? "bg-panel-glass-strong" : ""
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <FaceIcon />
                      <div className="min-w-0">
                        <p className="truncate font-medium">{w.name}</p>
                        <p className="flex items-center gap-2 text-[11.5px] text-panel-muted">
                          DNI ••••{w.dni}
                          {w.manual ? (
                            <span className="rounded border border-panel-rule px-1.5 text-[10.5px] text-panel-ink">
                              {t.manual}
                            </span>
                          ) : null}
                        </p>
                      </div>
                    </div>
                    <div className="tabular-nums">
                      <p className="font-medium">{w.time}</p>
                      <p className="text-[11.5px] text-panel-muted">{w.date}</p>
                    </div>
                    <p className="flex items-center gap-1.5 font-mono text-[11.5px] text-panel-muted">
                      <Pin />
                      {w.loc}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex min-h-0 flex-col gap-4">
            <div style={d(260)} className="glass-card a-rise flex flex-col items-center px-4 py-5 text-center">
              <span className="grid h-10 w-10 place-items-center rounded-full border border-panel-rule">
                <svg viewBox="0 0 16 16" aria-hidden className="h-4 w-4" fill="none">
                  <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <p className="mt-3 font-medium">{t.pendingTitle}</p>
              <p className="mt-1 text-[12px] text-panel-muted">{t.pendingEmpty}</p>
            </div>

            <div style={d(380)} className="glass-card a-rise flex min-h-0 flex-1 flex-col px-4 py-4">
              <p className="font-medium">{t.calTitle}</p>
              <p className="mt-0.5 text-[11.5px] text-panel-muted">{t.calHint}</p>
              <p className="mt-3 text-[12.5px] font-medium">{t.month}</p>
              <div className="mt-2 grid grid-cols-7 gap-y-1 text-center text-[11px]">
                {t.weekdays.map((w) => (
                  <span key={w} className="pb-1 text-panel-muted">
                    {w}
                  </span>
                ))}
                {Array.from({ length: LEAD }, (_, i) => (
                  <span key={`b${i}`} />
                ))}
                {Array.from({ length: 30 }, (_, i) => {
                  const day = i + 1;
                  return (
                    <span
                      key={day}
                      className={`mx-auto grid h-6 w-6 place-items-center rounded-full tabular-nums ${
                        day === TODAY
                          ? "bg-panel-ink font-semibold text-panel"
                          : MARKED.has(day)
                            ? "bg-panel-3"
                            : "text-panel-muted"
                      }`}
                    >
                      {day}
                    </span>
                  );
                })}
              </div>
              <div className="mt-auto grid grid-cols-2 gap-2 pt-3 text-[11.5px]">
                <span className="rounded-md border border-panel-rule py-1.5 text-center">{t.excelDay}</span>
                <span className="rounded-md bg-panel-ink py-1.5 text-center font-medium text-panel">{t.exportAll}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
