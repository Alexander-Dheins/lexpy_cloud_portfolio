"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, type CSSProperties } from "react";
import { useI18n } from "@/components/i18n/I18nProvider";

const TreeScene = dynamic(() => import("./services/TreeScene"), { ssr: false });

/* Servicios como un árbol: las ramas son lo que entrego, el tronco es
   cómo lo construyo y la raíz es la infraestructura que lo sostiene.
   El árbol es una escena 3D; las flechas usan un lienzo de 1240 x 760 y
   los textos se colocan en porcentajes de ese mismo lienzo. */

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

/* Cada raíz con etiqueta lleva una pieza real del stack (de izquierda a derecha). */
const STACK = ["Linux", "Docker", "Dokploy", "Cloudflare", "PostgreSQL", "Redis"];

const d = (ms: number) => ({ "--d": ms }) as CSSProperties;

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
        {/* El árbol 3D ocupa la franja central del lienzo (x de 360 a 880). */}
        <div className="relative mx-auto aspect-[520/760] w-full max-w-[360px] xl:absolute xl:inset-y-0 xl:left-[29.03%] xl:aspect-auto xl:w-[41.94%] xl:max-w-none">
          <TreeScene labels={STACK} />
        </div>

        <svg
          viewBox={`0 0 ${W} ${H}`}
          aria-hidden
          className="pointer-events-none absolute inset-0 hidden h-full w-full xl:block"
        >
          <Arrows />
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
