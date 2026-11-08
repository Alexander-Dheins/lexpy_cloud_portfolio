import type { CSSProperties, ReactNode } from "react";
import { useI18n } from "@/components/i18n/I18nProvider";

/* Dashboard ejecutivo: primera diapositiva del carrusel.
   Datos de muestra, solo para enseñar cómo luce el producto. */

const d = (ms: number) => ({ "--d": ms }) as CSSProperties;

/* ---------- Iconos de línea ---------- */

function Icon({ children, className = "h-4 w-4" }: { children: ReactNode; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

const RAIL = [
  <path key="home" d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />,
  <path key="chart" d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
  <path key="layers" d="M12 3l9 5-9 5-9-5zM3 13l9 5 9-5" />,
  <>
    <ellipse key="db1" cx="12" cy="6" rx="8" ry="3" />
    <path key="db2" d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
  </>,
  <>
    <circle key="u1" cx="9" cy="8" r="3.5" />
    <path key="u2" d="M2.5 20c.8-3.5 3.4-5.5 6.5-5.5s5.7 2 6.5 5.5M16 4.5a3.5 3.5 0 0 1 0 7M18.5 14.8c1.6.8 2.7 2.6 3 5.2" />
  </>,
  <>
    <circle key="s1" cx="12" cy="12" r="3" />
    <path key="s2" d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
  </>,
];

/* ---------- Indicadores ---------- */

const KPIS = [
  { label: "Ingresos", value: "$24.8M", delta: "+18.4%", series: [8, 9, 8.5, 11, 10.5, 12, 13, 12.5, 15, 16] },
  { label: "EBITDA", value: "$6.5M", delta: "+14.7%", series: [5, 6, 5.5, 6.5, 7, 6.8, 8, 8.4, 9, 10] },
  { label: "Clientes activos", value: "12,842", delta: "+9.3%", series: [7, 7.5, 8, 7.8, 9, 9.5, 9.2, 10.5, 11, 11.6] },
  { label: "Rentabilidad", value: "26.3%", delta: "+3.6 pts", series: [6, 6.4, 7.5, 7, 7.8, 8.6, 8.2, 9.4, 9.8, 10.6] },
];

function Sparkline({ values, delay }: { values: number[]; delay: number }) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * 120;
      const y = 24 - ((v - min) / (max - min)) * 20;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg viewBox="0 0 120 26" aria-hidden className="a-wipe mt-3 h-6 w-full" style={d(delay)} preserveAspectRatio="none">
      <polyline points={points} fill="none" stroke="var(--panel-ink)" strokeWidth="1.6" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function Delta({ value, suffix }: { value: string; suffix: string }) {
  return (
    <p className="mt-1.5 flex items-center gap-1 text-[11px] text-panel-muted">
      <Icon className="h-3 w-3 text-panel-ink">
        <path d="M7 17L17 7M9 7h8v8" />
      </Icon>
      <span className="whitespace-nowrap text-panel-ink">{value}</span>
      <span className="whitespace-nowrap">{suffix}</span>
    </p>
  );
}

/* ---------- Ingresos frente a proyección ---------- */

const REAL = [12.5, 14, 18.5, 19.5, 17.5, 21, 22.5, 21.5, 25.5];
const PROJECTION = [25.5, 27, 27.9, 28.7];
const CH = { left: 40, right: 616, top: 14, bottom: 150, max: 40 };
const px = (i: number) => CH.left + (i / 11) * (CH.right - CH.left);
const py = (v: number) => CH.bottom - (v / CH.max) * (CH.bottom - CH.top);

function RevenueChart({ months }: { months: string[] }) {
  const realPts = REAL.map((v, i) => `${px(i).toFixed(1)},${py(v).toFixed(1)}`).join(" ");
  const projPts = PROJECTION.map((v, i) => `${px(i + 8).toFixed(1)},${py(v).toFixed(1)}`).join(" ");
  const area = `${px(0)},${CH.bottom} ${realPts} ${px(8)},${CH.bottom}`;
  return (
    <svg viewBox="0 0 630 172" aria-hidden className="h-full w-full">
      <defs>
        <linearGradient id="area-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="var(--panel-ink)" stopOpacity="0.16" />
          <stop offset="1" stopColor="var(--panel-ink)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 10, 20, 30, 40].map((v) => (
        <g key={v}>
          <line x1={CH.left} x2={CH.right} y1={py(v)} y2={py(v)} stroke="var(--panel-rule)" strokeWidth="1" />
          <text x={CH.left - 10} y={py(v) + 4} textAnchor="end" fontSize="10.5" fill="var(--panel-muted)">
            {v === 0 ? "0" : `${v}M`}
          </text>
        </g>
      ))}
      {months.map((m, i) => (
        <text key={i} x={px(i)} y={168} textAnchor="middle" fontSize="10.5" fill="var(--panel-muted)">
          {m}
        </text>
      ))}
      <g className="a-wipe" style={d(500)}>
        <polygon points={area} fill="url(#area-fill)" />
        <polyline points={realPts} fill="none" stroke="var(--panel-ink)" strokeWidth="2.2" strokeLinejoin="round" />
      </g>
      <g className="a-wipe" style={d(1700)}>
        <polyline points={projPts} fill="none" stroke="var(--panel-muted)" strokeWidth="2" strokeDasharray="5 5" />
      </g>
      {REAL.map((v, i) => (
        <circle key={i} cx={px(i)} cy={py(v)} r="3.2" fill="var(--panel)" stroke="var(--panel-ink)" strokeWidth="1.8" className="a-pop" style={{ ...d(600 + i * 110), transformOrigin: `${px(i)}px ${py(v)}px` }} />
      ))}
      <circle cx={px(11)} cy={py(28.7)} r="3.6" fill="var(--panel-muted)" className="a-pop" style={{ ...d(2700), transformOrigin: `${px(11)}px ${py(28.7)}px` }} />
    </svg>
  );
}

/* ---------- Insights ---------- */

const INSIGHTS = [
  {
    icon: <path d="M3 17l6-6 4 4 8-8M15 7h6v6" />,
    text: "Se proyecta un aumento del 15% en ingresos si la tendencia actual continúa.",
  },
  {
    icon: <path d="M5 20V12M12 20V5M19 20v-9" />,
    text: "El segmento corporativo muestra el mayor potencial de crecimiento.",
  },
  {
    icon: <path d="M12 4l9 16H3zM12 10v4M12 17.5v.01" />,
    text: "Aumenta el riesgo de rotación de clientes en el segmento PYME.",
  },
];

/* ---------- Segmentos, sentimiento y demanda ---------- */

const SEGMENTS = [
  { label: "Corporativo", value: 45, color: "var(--panel-ink)" },
  { label: "PYME", value: 30, color: "var(--panel-muted)" },
  { label: "Consumo", value: 15, color: "var(--panel-4)" },
  { label: "Otros", value: 10, color: "var(--panel-3)" },
];

const DEMAND = [34, 42, 38, 51, 47, 58, 55, 64, 70, 74, 82, 90];

const DONUT_R = 38;
const DONUT_C = 2 * Math.PI * DONUT_R;
const DONUT_ARCS = SEGMENTS.map((s, i) => ({
  ...s,
  len: (s.value / 100) * DONUT_C,
  start: (SEGMENTS.slice(0, i).reduce((sum, x) => sum + x.value, 0) / 100) * DONUT_C,
}));

function Donut() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden className="a-turn h-[104px] w-[104px] shrink-0 -rotate-90" style={d(900)}>
      {DONUT_ARCS.map((arc) => (
        <circle
          key={arc.label}
          cx="50"
          cy="50"
          r={DONUT_R}
          fill="none"
          stroke={arc.color}
          strokeWidth="14"
          strokeDasharray={`${Math.max(arc.len - 2, 0)} ${DONUT_C}`}
          strokeDashoffset={-arc.start}
        />
      ))}
    </svg>
  );
}

function Ring({ value, label }: { value: number; label: string }) {
  const r = 38;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative h-[104px] w-[104px] shrink-0">
      <svg viewBox="0 0 100 100" aria-hidden className="h-full w-full -rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke="var(--panel-3)" strokeWidth="9" />
        <g className="a-turn" style={{ ...d(1100), transformOrigin: "50px 50px" }}>
          <circle cx="50" cy="50" r={r} fill="none" stroke="var(--panel-ink)" strokeWidth="9" strokeLinecap="round" strokeDasharray={`${(value / 100) * c} ${c}`} />
        </g>
      </svg>
      <div className="absolute inset-0 grid place-content-center text-center">
        <p className="text-[22px] font-semibold tabular-nums">{value}%</p>
        <p className="-mt-0.5 text-[11px] text-panel-muted">{label}</p>
      </div>
    </div>
  );
}

/* ---------- Escena ---------- */

export default function ExecutiveScene() {
  const t = useI18n().t.executive;
  return (
    <div className="flex h-full">
      <nav aria-hidden className="flex w-[68px] shrink-0 flex-col items-center gap-2 border-r border-panel-glass-border py-5">
        <span className="mb-3 grid h-9 w-9 place-items-center rounded-[10px] bg-panel-ink text-[13px] font-semibold text-panel">
          lx
        </span>
        {RAIL.map((glyph, i) => (
          <span
            key={i}
            style={d(60 + i * 50)}
            className={`a-fade grid h-10 w-10 place-items-center rounded-[10px] ${
              i === 0 ? "bg-panel-glass-strong text-panel-ink" : "text-panel-muted"
            } ${i === RAIL.length - 1 ? "mt-auto" : ""}`}
          >
            <Icon className="h-[18px] w-[18px]">{glyph}</Icon>
          </span>
        ))}
      </nav>

      <div className="flex min-w-0 flex-1 flex-col gap-4 p-6">
        <header className="a-fade flex items-start justify-between">
          <div>
            <p className="text-[19px] font-semibold tracking-[-0.01em]">{t.title}</p>
            <p className="mt-0.5 text-[12.5px] text-panel-muted">{t.subtitle}</p>
          </div>
          <span className="glass-card flex items-center gap-2 !rounded-full px-3.5 py-1.5 text-[12px] text-panel-muted">
            <Icon className="h-3.5 w-3.5">
              <path d="M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5" />
            </Icon>
            {t.updated}
          </span>
        </header>

        <div className="grid grid-cols-5 gap-3">
          {KPIS.map((kpi, i) => (
            <div key={kpi.label} style={d(150 + i * 90)} className="a-rise glass-card p-4">
              <p className="text-[12px] text-panel-muted">{t.kpis[i]}</p>
              <p className="mt-1.5 text-[24px] leading-none font-semibold tracking-[-0.01em] tabular-nums">{kpi.value}</p>
              <Delta value={kpi.delta} suffix={t.vsLastMonth} />
              <Sparkline values={kpi.series} delay={450 + i * 90} />
            </div>
          ))}
          <div style={d(510)} className="a-rise glass-card flex flex-col p-4">
            <p className="text-[12px] text-panel-muted">{t.risk}</p>
            <p className="mt-1.5 text-[24px] leading-none font-semibold">{t.riskValue}</p>
            <p className="mt-1 text-[11.5px] text-panel-muted">{t.riskLevel}</p>
            <div className="mt-auto h-1.5 rounded-full bg-panel-3">
              <span style={d(900)} className="a-grow-x block h-full w-[22%] rounded-full bg-panel-ink" />
            </div>
          </div>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-[1.6fr_1fr] gap-3">
          <div style={d(350)} className="a-rise glass-card flex min-h-0 flex-col p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[14px] font-semibold">{t.chartTitle}</p>
                <div className="mt-1.5 flex gap-4 text-[11.5px] text-panel-muted">
                  <span className="flex items-center gap-1.5">
                    <span className="h-0.5 w-4 rounded-full bg-panel-ink" />
                    {t.actual}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg viewBox="0 0 16 2" aria-hidden className="h-0.5 w-4">
                      <line x1="0" x2="16" y1="1" y2="1" stroke="var(--panel-muted)" strokeWidth="2" strokeDasharray="4 3" />
                    </svg>
                    {t.forecast}
                  </span>
                </div>
              </div>
              <div style={d(2600)} className="a-rise text-right">
                <p className="text-[11px] text-panel-muted">{t.forecastDec}</p>
                <p className="text-[18px] font-semibold tabular-nums">$28.7M</p>
              </div>
            </div>
            <div className="mt-2 min-h-0 flex-1">
              <RevenueChart months={t.months} />
            </div>
          </div>

          <div style={d(450)} className="a-rise glass-card flex flex-col p-4">
            <p className="text-[14px] font-semibold">{t.insightsTitle}</p>
            <ul className="mt-3 flex flex-1 flex-col divide-y divide-panel-glass-border">
              {INSIGHTS.map((item, i) => (
                <li key={i} style={d(1200 + i * 220)} className="a-rise flex flex-1 items-center gap-3 py-2">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-panel-glass-strong text-panel-ink">
                    <Icon className="h-4 w-4">{item.icon}</Icon>
                  </span>
                  <span className="text-[12.5px] leading-snug">{t.insights[i]}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div style={d(550)} className="a-rise glass-card flex items-center gap-5 p-4">
            <Donut />
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-semibold">{t.segmentsTitle}</p>
              <ul className="mt-2.5 space-y-1.5 text-[12px]">
                {SEGMENTS.map((s, i) => (
                  <li key={s.label} className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: s.color }} />
                    <span className="flex-1 text-panel-muted">{t.segments[i]}</span>
                    <span className="tabular-nums">{s.value}%</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div style={d(650)} className="a-rise glass-card flex items-center gap-5 p-4">
            <Ring value={82} label={t.sentimentPositive} />
            <div>
              <p className="text-[14px] font-semibold">{t.sentimentTitle}</p>
              <p className="mt-1.5 text-[12px] leading-snug text-panel-muted">
                {t.sentimentText}
              </p>
            </div>
          </div>

          <div style={d(750)} className="a-rise glass-card flex flex-col p-4">
            <div className="flex items-baseline justify-between">
              <p className="text-[14px] font-semibold">{t.demandTitle}</p>
              <p className="flex items-center gap-1 text-[13px] font-semibold tabular-nums">
                <Icon className="h-3.5 w-3.5">
                  <path d="M12 19V5M5 12l7-7 7 7" />
                </Icon>
                21%
              </p>
            </div>
            <p className="text-[11px] text-panel-muted">{t.demandPeriod}</p>
            <div className="mt-3 flex h-[62px] items-end gap-1.5">
              {DEMAND.map((h, i) => (
                <span
                  key={i}
                  style={{ ...d(1000 + i * 50), height: `${h}%` }}
                  className={`a-grow-y flex-1 rounded-t-[3px] ${
                    i >= 9 ? "border border-dashed border-panel-muted" : i === 8 ? "bg-panel-ink" : "bg-panel-3"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
