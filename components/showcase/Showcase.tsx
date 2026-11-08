"use client";

import type { ComponentType } from "react";
import Carousel from "./Carousel";
import ExecutiveScene from "./ExecutiveScene";
import ProjectCards from "./ProjectCards";
import { useI18n } from "@/components/i18n/I18nProvider";
import { ApiScene, CoursesScene, DashboardScene, DeployScene } from "./scenes";

type SceneId = "ejecutivo" | "api" | "cursos" | "crm" | "despliegue";

/* Cada desarrollo nuevo se agrega aquí: aparece como una diapositiva
   más del carrusel principal y como una pestaña debajo. */
const SCENES: { id: SceneId; Component: ComponentType }[] = [
  { id: "ejecutivo", Component: ExecutiveScene },
  { id: "api", Component: ApiScene },
  { id: "cursos", Component: CoursesScene },
  { id: "crm", Component: DashboardScene },
  { id: "despliegue", Component: DeployScene },
];

export default function Showcase() {
  const s = useI18n().t.showcase;
  const slides = SCENES.map((scene) => ({ ...scene, label: s.tabs[scene.id] }));

  return (
    <>
      <Carousel slides={slides} idPrefix="escena" label={s.region} />
      <ProjectCards />
    </>
  );
}
