"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ComponentType,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import ExecutiveScene from "./ExecutiveScene";
import { ApiScene, CoursesScene, DashboardScene, DeployScene } from "./scenes";

interface Scene {
  id: string;
  label: string;
  Component: ComponentType;
}

/* Cada desarrollo nuevo se agrega aquí: aparece como una diapositiva
   más del carrusel y como una pestaña debajo. */
const SCENES: Scene[] = [
  { id: "ejecutivo", label: "Dashboard ejecutivo", Component: ExecutiveScene },
  { id: "api", label: "API", Component: ApiScene },
  { id: "cursos", label: "Cursos", Component: CoursesScene },
  { id: "crm", label: "CRM", Component: DashboardScene },
  { id: "despliegue", label: "Despliegue", Component: DeployScene },
];

/* Lienzo de diseño: cada escena se dibuja a este tamaño y se escala
   para caber en el ancho disponible. */
const CANVAS_W = 1120;
const CANVAS_H = 680;
const DURATION = 7000;
const REDUCED = "(prefers-reduced-motion: reduce)";

function subscribeReduced(onChange: () => void) {
  const query = window.matchMedia(REDUCED);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function Arrow({ dir }: { dir: "left" | "right" }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden className="h-4 w-4" fill="none">
      <path
        d={dir === "left" ? "M10 3.5L5.5 8l4.5 4.5" : "M6 3.5L10.5 8 6 12.5"}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const roundButton =
  "grid h-10 w-10 shrink-0 place-items-center rounded-full border border-rule text-ink transition-colors duration-[var(--dur-short)] hover:bg-paper-2";

export default function Showcase() {
  const [active, setActive] = useState(0);
  const [plays, setPlays] = useState<number[]>(() => SCENES.map(() => 0));
  const [userPaused, setUserPaused] = useState<boolean | null>(null);
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(true);
  const [scale, setScale] = useState(1);
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const reducedMotion = useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(REDUCED).matches,
    () => false,
  );

  const paused = userPaused ?? reducedMotion;
  const running = !paused && !hovered && visible;

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) =>
      setScale(Math.min(1, entry.contentRect.width / CANVAS_W)),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  function show(index: number) {
    const next = (index + SCENES.length) % SCENES.length;
    setActive(next);
    setPlays((current) => current.map((n, i) => (i === next ? n + 1 : n)));
  }

  function onTabKey(event: KeyboardEvent<HTMLDivElement>) {
    const moves: Record<string, number> = {
      ArrowRight: active + 1,
      ArrowLeft: active - 1,
      Home: 0,
      End: SCENES.length - 1,
    };
    if (!(event.key in moves)) return;
    event.preventDefault();
    const next = (moves[event.key] + SCENES.length) % SCENES.length;
    show(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <div ref={rootRef} className="mx-auto w-full max-w-[1120px] min-w-0">
      <div
        ref={stageRef}
        aria-roledescription="carrusel"
        aria-label="Desarrollos"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ aspectRatio: `${CANVAS_W} / ${CANVAS_H}` }}
        className="stage-matte relative w-full overflow-hidden rounded-[22px] text-panel-ink"
      >
        <div
          className="absolute top-0 left-0 origin-top-left"
          style={{ width: CANVAS_W, height: CANVAS_H, transform: `scale(${scale})` }}
        >
          <div
            className="flex h-full transition-transform duration-[700ms] ease-[var(--ease-in-out)]"
            style={{ transform: `translateX(-${active * 100}%)` }}
          >
            {SCENES.map((scene, i) => (
              <div
                key={scene.id}
                role="tabpanel"
                id={`escena-${scene.id}`}
                aria-labelledby={`pestana-${scene.id}`}
                aria-roledescription="diapositiva"
                inert={i !== active}
                className="@container h-full w-full shrink-0"
              >
                <div key={plays[i]} className="h-full">
                  <scene.Component />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p aria-hidden className="mt-4 text-center text-[14px] text-ink sm:hidden">
        {SCENES[active].label}
      </p>

      <div className="mt-2 flex flex-wrap items-center justify-center gap-x-5 gap-y-4 sm:mt-6">
        <button
          type="button"
          onClick={() => show(active - 1)}
          aria-label="Desarrollo anterior"
          className={`${roundButton} hidden sm:grid`}
        >
          <Arrow dir="left" />
        </button>

        <div
          role="tablist"
          aria-label="Desarrollos"
          onKeyDown={onTabKey}
          className="grid w-full grid-cols-5 gap-3 sm:flex sm:w-auto sm:flex-wrap sm:justify-center sm:gap-x-5 sm:gap-y-3"
        >
          {SCENES.map((item, i) => {
            const isActive = i === active;
            return (
              <button
                key={item.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`pestana-${item.id}`}
                aria-selected={isActive}
                aria-controls={`escena-${item.id}`}
                tabIndex={isActive ? 0 : -1}
                aria-label={item.label}
                onClick={() => show(i)}
                className="group py-2 text-left sm:w-[9rem] sm:py-0"
              >
                <span className="block h-0.5 overflow-hidden rounded-full bg-rule">
                  {isActive ? (
                    <span
                      key={plays[i]}
                      onAnimationEnd={() => show(active + 1)}
                      style={
                        {
                          "--dur": `${DURATION}ms`,
                          animationPlayState: running ? "running" : "paused",
                        } as CSSProperties
                      }
                      className="a-progress keep-motion block h-full bg-ink"
                    />
                  ) : null}
                </span>
                <span
                  className={`mt-2.5 hidden truncate text-[14px] sm:block transition-colors duration-[var(--dur-short)] ${
                    isActive ? "text-ink" : "text-muted group-hover:text-ink"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => show(active + 1)}
          aria-label="Desarrollo siguiente"
          className={`${roundButton} hidden sm:grid`}
        >
          <Arrow dir="right" />
        </button>

        <button
          type="button"
          onClick={() => setUserPaused(!paused)}
          aria-label={paused ? "Reanudar el carrusel" : "Pausar el carrusel"}
          className={roundButton}
        >
          <svg viewBox="0 0 16 16" aria-hidden className="h-3.5 w-3.5">
            {paused ? (
              <path d="M4.5 2.8v10.4L13 8z" fill="currentColor" />
            ) : (
              <>
                <rect x="3.5" y="2.5" width="3" height="11" rx="1" fill="currentColor" />
                <rect x="9.5" y="2.5" width="3" height="11" rx="1" fill="currentColor" />
              </>
            )}
          </svg>
        </button>
      </div>
    </div>
  );
}
