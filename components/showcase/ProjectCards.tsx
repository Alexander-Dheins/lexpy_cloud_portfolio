"use client";

import type { CSSProperties } from "react";
import { useI18n } from "@/components/i18n/I18nProvider";

export type ProjectId = "mineops" | "legal" | "planning" | "flota" | "activos";

const ORDER: ProjectId[] = ["mineops", "legal", "planning", "flota", "activos"];

/* Miniaturas estáticas: dan la forma de cada sistema sin repetir su escena. */
function Thumb({ id }: { id: ProjectId }) {
  const bar = "rounded-full bg-panel-3";
  if (id === "mineops") {
    return (
      <div className="flex h-full gap-2 p-2.5">
        <div className="w-1/4 space-y-1.5 rounded-md bg-panel-2 p-1.5">
          {[70, 90, 60, 80, 55].map((w, i) => (
            <span key={i} style={{ width: `${w}%` }} className={`block h-1 ${i === 1 ? "bg-panel-ink" : "bg-panel-3"} rounded-full`} />
          ))}
        </div>
        <div className="flex flex-1 flex-col gap-1.5">
          {[0, 1, 2, 3, 4].map((r) => (
            <div key={r} className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full border border-panel-muted" />
              <span className={`h-1 flex-1 ${bar}`} />
              <span className="h-1 w-1/5 rounded-full bg-panel-4" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (id === "legal") {
    return (
      <div className="flex h-full items-center justify-center gap-1.5 px-3">
        {[0, 1, 2, 3].map((n) => (
          <div key={n} className="flex items-center gap-1.5">
            <span className={`grid h-6 w-6 place-items-center rounded-full text-[9px] font-semibold ${n < 2 ? "bg-panel-ink text-panel" : "border border-panel-muted text-panel-muted"}`}>
              {n + 1}
            </span>
            {n < 3 ? <span className={`h-px w-4 ${n < 1 ? "bg-panel-ink" : "bg-panel-muted"}`} /> : null}
          </div>
        ))}
      </div>
    );
  }
  if (id === "activos") {
    return (
      <div className="grid h-full grid-cols-4 gap-1.5 p-2.5">
        {Array.from({ length: 8 }, (_, i) => (
          <span key={i} className={`rounded-md ${i === 2 ? "bg-panel-ink/80" : "bg-panel-2"}`} />
        ))}
      </div>
    );
  }
  if (id === "planning") {
    return (
      <div className="flex h-full flex-col justify-center gap-2 px-3">
        {[
          [0, 30],
          [18, 34],
          [40, 22],
          [55, 30],
          [72, 22],
        ].map(([left, width], i) => (
          <span key={i} className="relative block h-2.5 rounded-full bg-panel-2">
            <span
              style={{ left: `${left}%`, width: `${width}%` }}
              className={`absolute inset-y-0 rounded-full ${i < 2 ? "bg-panel-ink/85" : "bg-panel-4"}`}
            />
          </span>
        ))}
      </div>
    );
  }
  // flota
  return (
    <div className="relative h-full">
      <svg viewBox="0 0 100 56" className="absolute inset-0 h-full w-full text-panel-muted" fill="none" aria-hidden>
        <path d="M14 42 C 26 30, 34 30, 44 22 S 64 34, 72 30 S 82 14, 88 12" stroke="currentColor" strokeWidth="1" strokeDasharray="2.5 2" />
        {[
          [14, 42],
          [44, 22],
          [72, 30],
        ].map(([cx, cy]) => (
          <circle key={cx} cx={cx} cy={cy} r="2.6" className="text-panel-ink" stroke="currentColor" strokeWidth="1.2" />
        ))}
        <circle cx="88" cy="12" r="3.2" className="text-panel-ink" fill="currentColor" />
      </svg>
    </div>
  );
}

type Props = {
  activeId: string;
  running: boolean;
  playKey: number;
  duration: number;
  onPick: (id: ProjectId) => void;
  onDone: () => void;
};

export default function ProjectCards({ activeId, running, playKey, duration, onPick, onDone }: Props) {
  const t = useI18n().t.projects;

  return (
    <div className="mt-14 border-t border-rule pt-8">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h2 className="text-[20px] font-semibold tracking-[-0.01em]">{t.title}</h2>
        <p className="text-[15px] text-muted">{t.lead}</p>
      </div>

      <ul className="-mx-5 mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-5">
        {ORDER.map((id) => {
          const item = t.items[id];
          const isActive = activeId === id;
          return (
            <li key={id} className="w-[68%] shrink-0 snap-start sm:w-auto">
              <button
                type="button"
                onClick={() => onPick(id)}
                aria-pressed={isActive}
                aria-label={`${item.name}: ${t.view}`}
                className={`group flex h-full w-full flex-col overflow-hidden rounded-2xl border bg-paper-2 text-left transition-colors duration-[var(--dur-short)] ${
                  isActive ? "border-ink" : "border-rule hover:border-muted"
                }`}
              >
                <div className="stage-matte relative aspect-[16/9] w-full text-panel-ink">
                  <Thumb id={id} />
                  {isActive ? (
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-panel-3">
                      <span
                        key={playKey}
                        onAnimationEnd={onDone}
                        style={{ "--dur": `${duration}ms`, animationPlayState: running ? "running" : "paused" } as CSSProperties}
                        className="a-progress keep-motion block h-full bg-panel-ink"
                      />
                    </span>
                  ) : null}
                </div>
                <div className="flex flex-1 flex-col gap-1 p-3 sm:p-4">
                  <p className="flex flex-wrap items-center gap-x-2 text-[15px] font-semibold">
                    {item.name}
                    {item.status ? (
                      <span className="rounded-full border border-rule px-2 py-px text-[11.5px] font-normal text-muted">{item.status}</span>
                    ) : null}
                  </p>
                  <p className="text-[13.5px] leading-snug text-muted">{item.desc}</p>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
