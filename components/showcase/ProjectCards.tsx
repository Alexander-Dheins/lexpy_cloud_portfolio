"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import Carousel from "./Carousel";
import MineopsScene, {
  MineopsStaffScene,
  MineopsUnitsScene,
} from "./MineopsScene";
import {
  ActivosDetailScene,
  ActivosMovesScene,
  ActivosScene,
  FlotaMaintScene,
  FlotaScene,
  FlotaUnitScene,
  PlanningBoardScene,
  PlanningComplianceScene,
  PlanningScene,
} from "./ProjectScenes";
import { useI18n } from "@/components/i18n/I18nProvider";

export type ProjectId = "mineops" | "planning" | "flota" | "activos";

const ORDER: ProjectId[] = ["mineops", "planning", "flota", "activos"];

/* Cada proyecto tiene su propio carrusel; las etiquetas salen del diccionario. */
const PROJECT_SCENES: Record<ProjectId, ComponentType[]> = {
  mineops: [MineopsScene, MineopsStaffScene, MineopsUnitsScene],
  planning: [PlanningScene, PlanningBoardScene, PlanningComplianceScene],
  flota: [FlotaScene, FlotaMaintScene, FlotaUnitScene],
  activos: [ActivosScene, ActivosDetailScene, ActivosMovesScene],
};

/* Miniaturas estáticas: dan la forma de cada sistema sin repetir su escena. */
function Thumb({ id }: { id: ProjectId }) {
  const bar = "rounded-full bg-panel-3";
  if (id === "mineops") {
    return (
      <div className="flex h-full gap-2 p-2.5">
        <div className="w-1/4 space-y-1.5 rounded-md bg-panel-2 p-1.5">
          {[70, 90, 60, 80, 55].map((w, i) => (
            <span
              key={i}
              style={{ width: `${w}%` }}
              className={`block h-1 ${i === 1 ? "bg-panel-ink" : "bg-panel-3"} rounded-full`}
            />
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
  if (id === "activos") {
    return (
      <div className="grid h-full grid-cols-4 gap-1.5 p-2.5">
        {Array.from({ length: 8 }, (_, i) => (
          <span
            key={i}
            className={`rounded-md ${i === 2 ? "bg-panel-ink/80" : "bg-panel-2"}`}
          />
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
          <span
            key={i}
            className="relative block h-2.5 rounded-full bg-panel-2"
          >
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
      <svg
        viewBox="0 0 100 56"
        className="absolute inset-0 h-full w-full text-panel-muted"
        fill="none"
        aria-hidden
      >
        <path
          d="M14 42 C 26 30, 34 30, 44 22 S 64 34, 72 30 S 82 14, 88 12"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="2.5 2"
        />
        {[
          [14, 42],
          [44, 22],
          [72, 30],
        ].map(([cx, cy]) => (
          <circle
            key={cx}
            cx={cx}
            cy={cy}
            r="2.6"
            className="text-panel-ink"
            stroke="currentColor"
            strokeWidth="1.2"
          />
        ))}
        <circle
          cx="88"
          cy="12"
          r="3.2"
          className="text-panel-ink"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}

function Viewer({ id, onClose }: { id: ProjectId; onClose: () => void }) {
  const t = useI18n().t.projects;
  const item = t.items[id];
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    dialog.showModal();
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, []);

  const slides = PROJECT_SCENES[id].map((Component, i) => ({
    id: `${id}-${i}`,
    label: item.slides[i],
    Component,
  }));

  return (
    <dialog
      ref={ref}
      aria-labelledby="proyecto-titulo"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) ref.current?.close();
      }}
      className="m-auto max-h-[calc(100dvh-1.5rem)] w-[min(1200px,calc(100%-1.5rem))] overflow-y-auto rounded-[28px] border-0 bg-paper p-4 text-ink backdrop:bg-[oklch(20%_0.01_265/0.55)] backdrop:backdrop-blur-sm sm:p-8"
    >
      <div className="a-rise mb-5 flex items-start justify-between gap-4 sm:mb-6">
        <div className="min-w-0">
          <h2
            id="proyecto-titulo"
            className="flex flex-wrap items-center gap-x-2.5 text-[22px] font-semibold tracking-[-0.01em]"
          >
            {item.name}
            {item.status ? (
              <span className="rounded-full border border-rule px-2 py-px text-[12px] font-normal text-muted">
                {item.status}
              </span>
            ) : null}
          </h2>
          <p className="mt-1 text-[15px] text-muted">{item.desc}</p>
        </div>
        <button
          type="button"
          onClick={() => ref.current?.close()}
          aria-label={t.close}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-rule transition-colors duration-[var(--dur-short)] hover:bg-paper-2"
        >
          <svg viewBox="0 0 16 16" aria-hidden className="h-4 w-4" fill="none">
            <path
              d="M4 4l8 8M12 4l-8 8"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
      <Carousel slides={slides} idPrefix={`proyecto-${id}`} label={item.name} />
    </dialog>
  );
}

export default function ProjectCards() {
  const t = useI18n().t.projects;
  const [open, setOpen] = useState<ProjectId | null>(null);

  return (
    <div className="mt-14 border-t border-rule pt-8">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h2 className="text-[20px] font-semibold tracking-[-0.01em]">
          {t.title}
        </h2>
        <p className="text-[15px] text-muted">{t.lead}</p>
      </div>

      <ul className="-mx-5 mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4">
        {ORDER.map((id) => {
          const item = t.items[id];
          return (
            <li key={id} className="w-[68%] shrink-0 snap-start sm:w-auto">
              <button
                type="button"
                onClick={() => setOpen(id)}
                aria-haspopup="dialog"
                aria-label={`${item.name}: ${t.view}`}
                className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-rule bg-paper-2 text-left transition-colors duration-[var(--dur-short)] hover:border-muted"
              >
                <div className="stage-matte relative aspect-[16/9] w-full text-panel-ink">
                  <Thumb id={id} />
                  <span className="absolute right-2.5 bottom-2.5 rounded-full bg-panel-ink px-2.5 py-1 text-[11.5px] font-medium text-panel opacity-0 transition-opacity duration-[var(--dur-short)] group-hover:opacity-100 group-focus-visible:opacity-100">
                    {t.slideCount}
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-1 p-3 sm:p-4">
                  <p className="flex flex-wrap items-center gap-x-2 text-[15px] font-semibold">
                    {item.name}
                    {item.status ? (
                      <span className="rounded-full border border-rule px-2 py-px text-[11.5px] font-normal text-muted">
                        {item.status}
                      </span>
                    ) : null}
                  </p>
                  <p className="text-[13.5px] leading-snug text-muted">
                    {item.desc}
                  </p>
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      {open ? (
        <Viewer key={open} id={open} onClose={() => setOpen(null)} />
      ) : null}
    </div>
  );
}
