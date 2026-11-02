"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import type { HeroSceneHandle } from "./three/HeroScene";

// Three.js touches `window`/WebGL, so it can only run on the client.
const HeroScene = dynamic(() => import("./three/HeroScene"), { ssr: false });

export default function Hero() {
  const sceneRef = useRef<HeroSceneHandle>(null);

  return (
    <section id="top" className="relative overflow-hidden">
      <div className="noise-bg pointer-events-none absolute inset-0 opacity-60" />

      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 px-6 pt-10 pb-6 sm:pt-16 md:grid-cols-2 md:gap-4">
        <div className="relative z-10 order-2 md:order-1">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-white/60 px-3 py-1 text-xs font-medium text-muted backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-red" />
            Disponible para nuevos proyectos
          </p>

          <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
            Construyo y despliego
            <br />
            <span className="text-gradient-accent">software e infraestructura</span>
          </h1>

          <p className="mt-5 max-w-md text-base leading-relaxed text-muted">
            Ingeniero de sistemas enfocado en desarrollo de software,
            automatización y infraestructura self-hosted — de la idea al
            servidor en producción.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#proyectos"
              className="rounded-full bg-foreground px-5 py-3 text-sm font-medium text-white transition-opacity hover:opacity-85"
            >
              Ver proyectos
            </a>
            <button
              onClick={() => sceneRef.current?.replay()}
              className="rounded-full border border-foreground/15 bg-white/50 px-5 py-3 text-sm font-medium text-foreground backdrop-blur transition-colors hover:bg-white/80"
            >
              ↻ Repetir transformación
            </button>
          </div>
        </div>

        <div className="relative order-1 aspect-square w-full md:order-2">
          <HeroScene ref={sceneRef} />
        </div>
      </div>
    </section>
  );
}
