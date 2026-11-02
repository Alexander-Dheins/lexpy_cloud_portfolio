"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import gsap from "gsap";
import { GRID, GridIndex, accentFor, buildTargets } from "./buildMachine";

export interface HeroSceneHandle {
  /** Re-runs the PC -> Rubik's cube -> Gaming PC sequence from the top. */
  replay: () => void;
}

const DARK = new THREE.Color("#1f2328");
const RED = new THREE.Color("#ef4444");
const BLUE = new THREE.Color("#3b82f6");

const HeroScene = forwardRef<HeroSceneHandle>(function HeroScene(_props, ref) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const replayRef = useRef<() => void>(() => {});

  useImperativeHandle(ref, () => ({
    replay: () => replayRef.current(),
  }));

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth;
    let height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(1.6, 1.1, 6.4);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // Procedural environment (no network asset) so the glass material has
    // something believable to reflect/refract.
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);

    const key = new THREE.DirectionalLight(0xffffff, 1.4);
    key.position.set(4, 5, 3);
    scene.add(key);

    const rim = new THREE.DirectionalLight(0xffffff, 0.5);
    rim.position.set(-4, -2, -3);
    scene.add(rim);

    const redGlow = new THREE.PointLight(0xef4444, 6, 6);
    redGlow.position.set(1.3, -0.6, 1.4);
    scene.add(redGlow);

    const blueGlow = new THREE.PointLight(0x3b82f6, 5, 6);
    blueGlow.position.set(-1.4, 0.8, -1.2);
    scene.add(blueGlow);

    const group = new THREE.Group();
    scene.add(group);

    const geometry = new RoundedBoxGeometry(0.52, 0.52, 0.52, 3, 0.09);

    type Cubelet = THREE.Mesh<RoundedBoxGeometry, THREE.MeshPhysicalMaterial> & {
      userData: {
        ix: GridIndex;
        iy: GridIndex;
        iz: GridIndex;
        targets: ReturnType<typeof buildTargets>;
        accent: "red" | "blue" | null;
      };
    };

    const cubelets: Cubelet[] = [];

    for (const ix of GRID) {
      for (const iy of GRID) {
        for (const iz of GRID) {
          const accent = accentFor(ix, iy, iz);
          const baseColor = accent === "red" ? RED : accent === "blue" ? BLUE : DARK;

          const material = new THREE.MeshPhysicalMaterial({
            color: baseColor,
            metalness: 0.08,
            roughness: 0.18,
            transmission: accent ? 0.35 : 0.58,
            thickness: 0.6,
            ior: 1.3,
            clearcoat: 0.6,
            clearcoatRoughness: 0.25,
            transparent: true,
            opacity: 0.94,
            emissive: accent ? baseColor : new THREE.Color(0x000000),
            emissiveIntensity: accent ? 0.35 : 0,
            envMapIntensity: 1.1,
          });

          const mesh = new THREE.Mesh(geometry, material) as unknown as Cubelet;
          const targets = buildTargets(ix, iy, iz);

          // Entrance: start scattered outward and invisible-ish (tiny scale).
          const dir = targets.pc.clone().normalize();
          if (dir.lengthSq() === 0) dir.set(0, 1, 0);
          mesh.position.copy(targets.pc).add(dir.multiplyScalar(3.2));
          mesh.scale.setScalar(0.001);

          mesh.userData = { ix, iy, iz, targets, accent };
          group.add(mesh);
          cubelets.push(mesh);
        }
      }
    }

    // ---- Animation: pointer parallax + idle rotation (rAF loop) ----
    let rafId = 0;
    let autoRotate = 0;
    const pointerTarget = { x: 0, y: 0 };
    const pointerCurrent = { x: 0, y: 0 };

    function onPointerMove(e: PointerEvent) {
      const rect = container!.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      pointerTarget.x = nx;
      pointerTarget.y = ny;
    }
    window.addEventListener("pointermove", onPointerMove);

    function tick() {
      autoRotate += 0.0022;
      pointerCurrent.x += (pointerTarget.x - pointerCurrent.x) * 0.04;
      pointerCurrent.y += (pointerTarget.y - pointerCurrent.y) * 0.04;

      group.rotation.y = autoRotate + pointerCurrent.x * 0.6;
      group.rotation.x = pointerCurrent.y * -0.3 + Math.sin(autoRotate * 0.6) * 0.03;

      redGlow.intensity = 5 + Math.sin(autoRotate * 4) * 1.5;
      blueGlow.intensity = 4 + Math.cos(autoRotate * 3.2) * 1.2;

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(tick);
    }
    tick();

    // ---- GSAP sequence: PC -> Rubik's cube -> Gaming PC ----
    function moveTo(key: "pc" | "rubik" | "gaming", duration: number, stagger: number) {
      return new Promise<void>((resolve) => {
        const tl = gsap.timeline({ onComplete: resolve });
        cubelets.forEach((mesh, i) => {
          tl.to(
            mesh.position,
            {
              x: mesh.userData.targets[key].x,
              y: mesh.userData.targets[key].y,
              z: mesh.userData.targets[key].z,
              duration,
              ease: "power2.inOut",
            },
            i * stagger
          );
        });
      });
    }

    function twistLayer(axis: "x" | "y", layerKey: "ix" | "iy", layerValue: GridIndex, angle: number, duration: number) {
      return new Promise<void>((resolve) => {
        const pivot = new THREE.Group();
        group.add(pivot);
        const selected = cubelets.filter((m) => m.userData[layerKey] === layerValue);
        selected.forEach((m) => pivot.attach(m));

        gsap.to(pivot.rotation, {
          [axis]: angle,
          duration,
          ease: "power2.inOut",
          onComplete: () => {
            selected.forEach((m) => group.attach(m));
            group.remove(pivot);
            resolve();
          },
        });
      });
    }

    function entrance() {
      return new Promise<void>((resolve) => {
        const tl = gsap.timeline({ onComplete: resolve });
        cubelets.forEach((mesh, i) => {
          tl.to(
            mesh.position,
            {
              x: mesh.userData.targets.pc.x,
              y: mesh.userData.targets.pc.y,
              z: mesh.userData.targets.pc.z,
              duration: 0.9,
              ease: "back.out(1.4)",
            },
            i * 0.018
          ).to(
            mesh.scale,
            { x: 1, y: 1, z: 1, duration: 0.7, ease: "back.out(2)" },
            "<"
          );
        });
      });
    }

    let cancelled = false;
    let breatheTween: gsap.core.Tween | null = null;

    async function playSequence() {
      breatheTween?.kill();
      gsap.killTweensOf(cubelets.map((m) => m.position));

      await entrance();
      if (cancelled) return;
      await gsap.to({}, { duration: 1.4 }); // hold as "PC tower"
      if (cancelled) return;

      await moveTo("rubik", 1.1, 0.012);
      if (cancelled) return;
      await gsap.to({}, { duration: 0.6 });
      if (cancelled) return;

      await twistLayer("y", "iy", 2, Math.PI / 2, 0.55);
      if (cancelled) return;
      await gsap.to({}, { duration: 0.15 });
      await twistLayer("x", "ix", 0, -Math.PI / 2, 0.55);
      if (cancelled) return;
      await gsap.to({}, { duration: 0.5 });
      if (cancelled) return;

      await moveTo("gaming", 1.15, 0.012);
      if (cancelled) return;

      // Idle "breathing" glow on the accent cubelets once it has settled
      // into its final "gaming PC" form.
      const accentMats = cubelets
        .filter((m) => m.userData.accent)
        .map((m) => m.material);
      breatheTween = gsap.to(
        accentMats.map((m) => m),
        {
          emissiveIntensity: 0.9,
          duration: 1.4,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          stagger: { each: 0.08, from: "random" },
        }
      );
    }

    replayRef.current = () => {
      // Reset every cubelet back to its scattered entrance position first.
      cubelets.forEach((mesh) => {
        const dir = mesh.userData.targets.pc.clone().normalize();
        if (dir.lengthSq() === 0) dir.set(0, 1, 0);
        gsap.killTweensOf(mesh.position);
        gsap.killTweensOf(mesh.scale);
        mesh.position.copy(mesh.userData.targets.pc).add(dir.multiplyScalar(3.2));
        mesh.scale.setScalar(0.001);
      });
      playSequence();
    };

    playSequence();

    // ---- Resize handling ----
    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      if (width === 0 || height === 0) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });
    resizeObserver.observe(container);

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onPointerMove);
      resizeObserver.disconnect();
      gsap.killTweensOf(cubelets.map((m) => m.position));
      breatheTween?.kill();
      geometry.dispose();
      cubelets.forEach((m) => m.material.dispose());
      pmrem.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="h-full w-full" />;
});

export default HeroScene;
