"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { useI18n } from "@/components/i18n/I18nProvider";

/* Servicios como un árbol: las ramas son lo que entrego, el tronco es
   cómo lo construyo y la raíz es la infraestructura que lo sostiene.
   El dibujo usa un lienzo de 1240 x 760; los textos se colocan en
   porcentajes de ese mismo lienzo para que coincidan con las flechas. */

const W = 1240;
const H = 760;

type Side = "left" | "right";

interface Branch {
  title: string;
  text: string;
  side: Side;
  y: number;
  arrow: string;
}

const BRANCHES: Branch[] = [
  {
    title: "Desarrollo web y apps",
    text: "Portales, paneles y aplicaciones a medida, del backend a la interfaz.",
    side: "left",
    y: 100,
    arrow: "M 446 150 C 410 118 370 102 322 100",
  },
  {
    title: "APIs e integraciones",
    text: "Endpoints documentados que conectan tus sistemas entre sí.",
    side: "left",
    y: 290,
    arrow: "M 460 268 C 420 282 380 290 322 290",
  },
  {
    title: "Automatización y DevOps",
    text: "Flujos de despliegue y procesos que dejan de ser manuales.",
    side: "right",
    y: 100,
    arrow: "M 794 150 C 830 118 870 102 918 100",
  },
  {
    title: "Consultoría en digitalización",
    text: "Acompaño a llevar procesos y sistemas existentes a su versión digital.",
    side: "right",
    y: 290,
    arrow: "M 780 268 C 820 282 860 290 918 290",
  },
];

const BASES = [
  {
    title: "El tronco: código mantenible",
    text: "TypeScript, pruebas y despliegue continuo para que el proyecto aguante el crecimiento.",
    side: "right" as Side,
    y: 420,
    connector: "M 924 420 L 652 420",
  },
  {
    title: "La raíz: infraestructura propia",
    text: "Servidores, contenedores y redes configurados y asegurados para cada proyecto.",
    side: "left" as Side,
    y: 578,
    connector: "M 316 578 L 470 578",
  },
];

/* Copa: capas de círculos del fondo (oscuro) al frente (claro). */
type Leaf = [number, number, number, string];

const CANOPY_EDGE: Leaf[] = [
  [440, 215, 30, "var(--tree-1)"],
  [800, 220, 30, "var(--tree-1)"],
  [505, 138, 36, "var(--tree-1)"],
  [738, 134, 36, "var(--tree-1)"],
  [585, 68, 34, "var(--tree-1)"],
  [662, 64, 36, "var(--tree-1)"],
  [470, 266, 34, "var(--tree-1)"],
  [774, 268, 34, "var(--tree-1)"],
  [565, 300, 38, "var(--tree-1)"],
  [682, 302, 38, "var(--tree-1)"],
];

const CANOPY: Leaf[] = [
  [520, 240, 70, "var(--tree-1)"],
  [720, 240, 70, "var(--tree-1)"],
  [620, 255, 82, "var(--tree-1)"],
  [560, 168, 74, "var(--tree-1)"],
  [690, 165, 74, "var(--tree-1)"],
  [470, 192, 52, "var(--tree-1)"],
  [770, 195, 52, "var(--tree-1)"],
  [540, 212, 60, "var(--tree-2)"],
  [702, 206, 60, "var(--tree-2)"],
  [620, 178, 80, "var(--tree-2)"],
  [500, 248, 46, "var(--tree-2)"],
  [744, 250, 46, "var(--tree-2)"],
  [620, 108, 62, "var(--tree-2)"],
  [558, 120, 54, "var(--tree-2)"],
  [688, 118, 54, "var(--tree-2)"],
  [590, 138, 48, "var(--tree-3)"],
  [660, 148, 44, "var(--tree-3)"],
  [545, 176, 38, "var(--tree-3)"],
  [706, 182, 38, "var(--tree-3)"],
  [626, 92, 40, "var(--tree-3)"],
  [600, 112, 26, "var(--tree-4)"],
  [652, 124, 22, "var(--tree-4)"],
  [562, 150, 20, "var(--tree-4)"],
];

/* Raíces: cada una lleva una pieza real del stack. */
const ROOTS = [
  { d: "M 600 500 C 570 520 520 545 440 590", tip: [432, 596], label: "Linux", anchor: "end" },
  { d: "M 606 504 C 590 540 550 590 500 628", tip: [492, 638], label: "Docker", anchor: "end" },
  { d: "M 615 506 C 610 560 590 615 572 655", tip: [566, 676], label: "Dokploy", anchor: "end" },
  { d: "M 626 506 C 632 560 652 615 670 655", tip: [676, 676], label: "Cloudflare", anchor: "start" },
  { d: "M 634 504 C 652 540 690 590 740 628", tip: [748, 638], label: "PostgreSQL", anchor: "start" },
  { d: "M 640 500 C 670 520 720 545 800 590", tip: [808, 596], label: "Redis", anchor: "start" },
] as const;


const FINE_ROOTS = [
  "M 603 503 C 580 530 552 560 528 600",
  "M 611 505 C 604 545 596 580 600 620",
  "M 631 505 C 640 545 648 580 642 620",
  "M 637 503 C 660 530 688 560 712 600",
];

const d = (ms: number) => ({ "--d": ms }) as CSSProperties;

function TreeShape() {
  return (
    <g>
      <line x1="360" x2="880" y1="502" y2="502" stroke="var(--rule)" strokeWidth="1.5" />

      <g className="t-anim t-down" style={d(250)}>
        {ROOTS.map((root) => (
          <path key={root.label} d={root.d} fill="none" stroke="var(--tree-bark)" strokeWidth="6" strokeLinecap="round" />
        ))}
        {FINE_ROOTS.map((path) => (
          <path key={path} d={path} fill="none" stroke="var(--tree-2)" strokeWidth="2" strokeLinecap="round" />
        ))}
        {ROOTS.map((root) => (
          <text
            key={root.label}
            x={root.tip[0]}
            y={root.tip[1]}
            textAnchor={root.anchor}
            fontSize="15"
            fill="var(--muted)"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {root.label}
          </text>
        ))}
      </g>

      <g className="t-anim t-up" style={d(0)}>
        <path
          d="M 576 504 C 596 490 600 455 602 410 C 603 380 604 350 606 318 L 636 318 C 637 350 638 380 640 410 C 642 455 646 490 666 504 Z"
          fill="var(--tree-bark)"
        />
        <path d="M 613 492 C 614 445 615 395 616 340" fill="none" stroke="var(--tree-2)" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M 629 484 C 628 440 628 392 627 346" fill="none" stroke="var(--tree-2)" strokeWidth="1.2" strokeLinecap="round" />
      </g>

      <g className="t-anim t-canopy" style={d(450)}>
        {[...CANOPY_EDGE, ...CANOPY.slice(0, 7)].map(([cx, cy, r, fill], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill={fill} />
        ))}
        <path d="M 618 318 C 606 280 580 252 520 236" fill="none" stroke="var(--tree-bark)" strokeWidth="7" strokeLinecap="round" />
        <path d="M 626 318 C 640 280 668 250 726 230" fill="none" stroke="var(--tree-bark)" strokeWidth="7" strokeLinecap="round" />
        <path d="M 600 282 C 590 262 586 242 590 214" fill="none" stroke="var(--tree-bark)" strokeWidth="4" strokeLinecap="round" />
        <path d="M 648 278 C 660 258 664 238 660 210" fill="none" stroke="var(--tree-bark)" strokeWidth="4" strokeLinecap="round" />
        {CANOPY.slice(7).map(([cx, cy, r, fill], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill={fill} />
        ))}
      </g>
    </g>
  );
}

function Arrows() {
  return (
    <>
      <defs>
        <marker id="flecha" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="9" markerHeight="9" orient="auto-start-reverse">
          <path d="M 1 1 L 8 5 L 1 9" fill="none" stroke="var(--ink)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </marker>
      </defs>
      {BRANCHES.map((branch, i) => (
        <path
          key={branch.title}
          d={branch.arrow}
          fill="none"
          stroke="var(--ink)"
          strokeWidth="1.6"
          markerEnd="url(#flecha)"
          className={`t-anim ${branch.side === "left" ? "t-left" : "t-right"}`}
          style={d(1150 + i * 120)}
        />
      ))}
      {BASES.map((base, i) => (
        <path
          key={base.title}
          d={base.connector}
          fill="none"
          stroke="var(--muted)"
          strokeWidth="1.4"
          strokeDasharray="3 5"
          className={`t-anim ${base.side === "left" ? "t-left" : "t-right"}`}
          style={d(1650 + i * 120)}
        />
      ))}
    </>
  );
}

function Node({
  title,
  text,
  side,
  y,
  delay,
}: {
  title: string;
  text: string;
  side: Side;
  y: number;
  delay: number;
}) {
  const x = side === "left" ? 0 : 930;
  const style = {
    "--x": `${(x / W) * 100}%`,
    "--y": `${(y / H) * 100}%`,
    "--w": `${(310 / W) * 100}%`,
    ...d(delay),
  } as CSSProperties;
  return (
    <div style={style} className={`tree-node t-anim t-rise ${side === "left" ? "xl:text-right" : ""}`}>
      <h3 className="text-[19px] font-semibold tracking-[-0.01em]">{title}</h3>
      <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{text}</p>
    </div>
  );
}

export default function Services() {
  const t = useI18n().t.services;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.classList.add("is-armed");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="servicios" aria-labelledby="servicios-titulo" className="container-page py-24 sm:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <h2 id="servicios-titulo" className="text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.08] font-semibold tracking-[-0.03em]">
          {t.title}
        </h2>
        <p className="mx-auto mt-4 max-w-[46ch] text-[1.125rem] leading-relaxed text-muted">
          {t.lead}
        </p>
      </div>

      <div ref={ref} className="relative mt-14 xl:mt-16 xl:aspect-[1240/760]">
        <svg viewBox={`0 0 ${W} ${H}`} aria-hidden className="absolute inset-0 hidden h-full w-full xl:block">
          <Arrows />
          <TreeShape />
        </svg>

        <svg viewBox="360 20 520 680" aria-hidden className="mx-auto block w-full max-w-[340px] xl:hidden">
          <TreeShape />
        </svg>

        <div className="mx-auto mt-12 grid max-w-4xl gap-x-12 gap-y-9 sm:grid-cols-2 xl:mt-0 xl:block xl:max-w-none">
          {BRANCHES.map((branch, i) => (
            <Node
              key={branch.title}
              {...branch}
              title={t.branches[i].title}
              text={t.branches[i].text}
              delay={1300 + i * 120}
            />
          ))}
          {BASES.map((base, i) => (
            <Node
              key={base.title}
              {...base}
              title={i === 0 ? t.trunk.title : t.root.title}
              text={i === 0 ? t.trunk.text : t.root.text}
              delay={1800 + i * 120}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
