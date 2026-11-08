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
import { ApiScene, CoursesScene, DashboardScene, DeployScene } from "./scenes";

interface Scene {
  id: string;
  label: string;
  domain: string;
  Component: ComponentType;
}

/* Cada desarrollo nuevo se agrega aquí: aparece como una pestaña más
   y entra solo en la rotación. */
const SCENES: Scene[] = [
  {
    id: "panel",
    label: "Panel de gestión",
    domain: "crm.lexpy.cloud",
    Component: DashboardScene,
  },
  { id: "api", label: "API", domain: "api.lexpy.cloud", Component: ApiScene },
  {
    id: "cursos",
    label: "Cursos",
    domain: "cursos.lexpy.cloud",
    Component: CoursesScene,
  },
  {
    id: "despliegue",
    label: "Despliegue",
    domain: "lexpy.cloud",
    Component: DeployScene,
  },
];

const DURATION = 7000;
const REDUCED = "(prefers-reduced-motion: reduce)";

function subscribeReduced(onChange: () => void) {
  const query = window.matchMedia(REDUCED);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

export default function Showcase() {
  const [active, setActive] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [userPaused, setUserPaused] = useState<boolean | null>(null);
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const reducedMotion = useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(REDUCED).matches,
    () => false,
  );

  // Con movimiento reducido arranca en pausa; el usuario decide después.
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

  function show(index: number) {
    setActive((index + SCENES.length) % SCENES.length);
    setCycle((c) => c + 1);
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

  const scene = SCENES[active];
  const SceneView = scene.Component;

  return (
    <div ref={rootRef} className="min-w-0">
      <div
        role="tabpanel"
        id={`escena-${scene.id}`}
        aria-labelledby={`pestana-${scene.id}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="@container relative h-[440px] overflow-hidden rounded-[18px] bg-panel text-panel-ink sm:h-[480px] lg:h-[clamp(440px,64vh,540px)]"
      >
        <div key={`${scene.id}-${cycle}`} className="a-fade h-full">
          <SceneView />
        </div>
      </div>

      <div className="mt-5 flex items-start gap-4">
        <div
          role="tablist"
          aria-label="Desarrollos"
          onKeyDown={onTabKey}
          className="grid flex-1 grid-cols-2 gap-x-5 gap-y-4 sm:grid-cols-4"
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
                onClick={() => show(i)}
                className="group min-w-0 text-left"
              >
                <span className="block h-0.5 overflow-hidden rounded-full bg-rule">
                  {isActive ? (
                    <span
                      key={cycle}
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
                  className={`mt-2.5 block truncate text-[14px] transition-colors duration-[var(--dur-short)] ${
                    isActive ? "text-ink" : "text-muted group-hover:text-ink"
                  }`}
                >
                  {item.label}
                </span>
                <span className="mt-0.5 block truncate font-mono text-[12px] text-muted">
                  {item.domain}
                </span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setUserPaused(!paused)}
          aria-label={paused ? "Reanudar la rotación" : "Pausar la rotación"}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-rule text-ink transition-colors duration-[var(--dur-short)] hover:bg-paper-2"
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
