import type { CSSProperties, ReactNode } from "react";
import { useI18n } from "@/components/i18n/I18nProvider";

/* Escenas de PY.DEV (control de gastos). Datos de muestra. */

const d = (ms: number) => ({ "--d": ms }) as CSSProperties;

const spaced = (n: number) =>
  n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
const money = (n: number) => `S/ ${spaced(n)}`;
const signed = (n: number) => `${n < 0 ? "-" : "+"}${spaced(Math.abs(n))}`;

function Shell({ app, children }: { app: string; children: ReactNode }) {
  return (
    <div className="flex h-full text-[13px]">
      <aside className="flex w-[64px] shrink-0 flex-col items-center gap-4 border-r border-panel-glass-border py-4">
        <span className="a-fade grid h-9 w-9 place-items-center rounded-lg bg-panel-ink text-[12px] font-bold text-panel">
          P
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
        </header>
        <div className="min-h-0 flex-1 p-4">{children}</div>
      </div>
    </div>
  );
}

const INCOME = [820, 1150, 640, 1300, 760, 1180];
const EXPENSE = [540, 610, 470, 720, 390, 640];

export function PydevScene() {
  const t = useI18n().t.pydev;
  const max = Math.max(...INCOME, ...EXPENSE);
  return (
    <Shell app={t.app}>
      <div className="flex h-full flex-col gap-4">
        <div className="a-fade flex items-end justify-between">
          <p className="text-[20px] font-semibold">{t.hello}</p>
          <p className="text-panel-muted">{t.month}</p>
        </div>
        <div className="grid grid-cols-[1.4fr_1fr_1fr] gap-3">
          <div style={d(140)} className="glass-card a-rise px-4 py-3.5">
            <p className="text-[11.5px] text-panel-muted">{t.balance}</p>
            <p className="mt-1 text-[28px] font-semibold tabular-nums">
              {money(2531.6)}
            </p>
          </div>
          <div style={d(220)} className="glass-card a-rise px-4 py-3.5">
            <p className="text-[11.5px] text-panel-muted">{t.income}</p>
            <p className="mt-1 text-[22px] font-semibold tabular-nums">
              {signed(4850)}
            </p>
          </div>
          <div style={d(300)} className="glass-card a-rise px-4 py-3.5">
            <p className="text-[11.5px] text-panel-muted">{t.expense}</p>
            <p className="mt-1 text-[22px] font-semibold tabular-nums">
              {signed(-2318.4)}
            </p>
          </div>
        </div>
        <div className="grid min-h-0 flex-1 grid-cols-[1.2fr_1fr] gap-4">
          <div
            style={d(360)}
            className="glass-card a-rise flex flex-col px-4 py-4"
          >
            <div className="flex items-center justify-between">
              <p className="font-medium">{t.weeksTitle}</p>
              <p className="flex gap-3 text-[11.5px] text-panel-muted">
                <span className="flex items-center gap-1.5">
                  <i className="h-2 w-2 rounded-full bg-panel-ink" />
                  {t.income}
                </span>
                <span className="flex items-center gap-1.5">
                  <i className="h-2 w-2 rounded-full bg-panel-4" />
                  {t.expense}
                </span>
              </p>
            </div>
            <div className="mt-4 flex min-h-0 flex-1 items-end gap-4">
              {INCOME.map((inc, i) => (
                <div
                  key={i}
                  className="flex h-full flex-1 flex-col justify-end gap-1.5"
                >
                  <div className="flex flex-1 items-end justify-center gap-1.5">
                    <span
                      style={{
                        ...d(560 + i * 90),
                        height: `${(inc / max) * 100}%`,
                      }}
                      className="a-grow-y block w-4 rounded-t-[3px] bg-panel-ink"
                    />
                    <span
                      style={{
                        ...d(600 + i * 90),
                        height: `${(EXPENSE[i] / max) * 100}%`,
                      }}
                      className="a-grow-y block w-4 rounded-t-[3px] bg-panel-4"
                    />
                  </div>
                  <span className="text-center text-[11px] text-panel-muted">
                    {t.weeks[i]}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div style={d(440)} className="glass-card a-rise px-4 py-4">
            <p className="font-medium">{t.recentTitle}</p>
            <ul className="mt-3 divide-y divide-panel-rule">
              {t.recent.map((r) => (
                <li
                  key={r.what}
                  className="flex items-center justify-between gap-3 py-2.5"
                >
                  <span className="min-w-0">
                    <span className="block truncate font-medium">{r.what}</span>
                    <span className="text-[11.5px] text-panel-muted">
                      {r.cat}
                    </span>
                  </span>
                  <span className="tabular-nums">{signed(r.amt)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Shell>
  );
}

export function PydevMovesScene() {
  const t = useI18n().t.pydev;
  const m = t.moves;
  return (
    <Shell app={t.app}>
      <div className="glass-card flex h-full flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b border-panel-rule px-4 py-3">
          <p className="font-medium">{m.title}</p>
          <div className="flex gap-2">
            {m.filters.map((f, i) => (
              <span
                key={f}
                className={`rounded-full px-2.5 py-0.5 text-[11.5px] ${
                  i === 0
                    ? "bg-panel-ink font-medium text-panel"
                    : "border border-panel-rule text-panel-muted"
                }`}
              >
                {f}
              </span>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-[5.5rem_1.3fr_1fr_7rem] border-b border-panel-rule px-4 py-2 text-[11.5px] text-panel-muted">
          {m.cols.map((c, i) => (
            <span key={c} className={i === 3 ? "text-right" : ""}>
              {c}
            </span>
          ))}
        </div>
        <ul className="min-h-0 flex-1 divide-y divide-panel-rule overflow-hidden">
          {m.rows.map((r, i) => (
            <li
              key={i}
              style={d(300 + i * 90)}
              className="a-rise grid grid-cols-[5.5rem_1.3fr_1fr_7rem] items-center px-4 py-3"
            >
              <span className="text-panel-muted">{r.date}</span>
              <span className="truncate font-medium">{r.what}</span>
              <span className="truncate text-panel-muted">{r.cat}</span>
              <span className="text-right tabular-nums">{signed(r.amt)}</span>
            </li>
          ))}
        </ul>
      </div>
    </Shell>
  );
}

const CAT_SHARE = [34, 24, 18, 14, 10];
const BALANCE = [1380, 1710, 1150, 1980, 2240, 2531.6];

export function PydevReportsScene() {
  const t = useI18n().t.pydev;
  const r = t.reports;
  const max = Math.max(...BALANCE);
  return (
    <Shell app={t.app}>
      <div className="grid h-full grid-cols-[1fr_1.1fr] gap-4">
        <div
          style={d(200)}
          className="glass-card a-rise flex flex-col px-5 py-4"
        >
          <p className="font-medium">{r.byCat}</p>
          <ul className="mt-4 flex flex-1 flex-col justify-around">
            {r.cats.map((cat, i) => (
              <li
                key={cat}
                className="grid grid-cols-[6rem_1fr_2.5rem] items-center gap-3 text-[12px]"
              >
                <span className="text-panel-muted">{cat}</span>
                <span className="h-2 rounded-full bg-panel-3">
                  <span
                    style={{
                      ...d(500 + i * 110),
                      width: `${CAT_SHARE[i] * 2.6}%`,
                    }}
                    className={`a-grow-x block h-full rounded-full ${i === 0 ? "bg-panel-ink" : "bg-panel-muted"}`}
                  />
                </span>
                <span className="text-right tabular-nums">{CAT_SHARE[i]}%</span>
              </li>
            ))}
          </ul>
          <div className="mt-auto flex gap-2.5 pt-4">
            {[r.exportPdf, r.exportXls].map((label, i) => (
              <span
                key={label}
                className={`rounded-full px-3.5 py-1.5 text-[12px] ${
                  i === 0
                    ? "bg-panel-ink font-medium text-panel"
                    : "border border-panel-rule text-panel-muted"
                }`}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
        <div
          style={d(320)}
          className="glass-card a-rise flex flex-col px-5 py-4"
        >
          <p className="font-medium">{r.monthTitle}</p>
          <div className="mt-5 flex min-h-0 flex-1 items-end gap-3">
            {BALANCE.map((v, i) => (
              <div
                key={i}
                className="flex h-full flex-1 flex-col justify-end gap-1.5 text-center"
              >
                <span className="text-[11px] tabular-nums text-panel-muted">
                  {Math.round(v)}
                </span>
                <span
                  style={{ ...d(600 + i * 100), height: `${(v / max) * 80}%` }}
                  className={`a-grow-y block rounded-t-[4px] ${i === BALANCE.length - 1 ? "bg-panel-ink" : "bg-panel-3"}`}
                />
              </div>
            ))}
          </div>
          <div className="mt-2 flex gap-3 text-center text-[11px] text-panel-muted">
            {r.months.map((m) => (
              <span key={m} className="flex-1">
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}
