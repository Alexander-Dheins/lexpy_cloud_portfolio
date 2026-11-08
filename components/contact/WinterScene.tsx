"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/* Diorama invernal en grises: montañas low-poly sobre una base, teleférico
   con dos cabinas que suben y bajan, refugio iluminado, luna y nieve.
   WebGL no lee los tokens OKLCH, así que la paleta gris vive aquí. */

const C = {
  snow: 0xc9cbd0,
  snowSide: 0x8f9298,
  slabTop: 0xb8bac0,
  tree: 0x3a3c41,
  treeLight: 0x4b4e54,
  trunk: 0x2a2b2f,
  steel: 0x2c2e33,
  gondola: 0xe6e7ea,
  window: 0x2b2d31,
  cabin: 0x6b6e74,
  roof: 0x2e3035,
  glow: 0xf2f1ee,
  moon: 0xeeeeef,
  flake: 0xf4f4f5,
};

const W = 10;
const D = 8;

const HILLS = [
  { x: -2.8, z: -2.0, r: 1.15, h: 4.6 },
  { x: 0.5, z: -2.6, r: 1.0, h: 3.1 },
  { x: 2.9, z: -2.3, r: 0.95, h: 1.9 },
  { x: -1.6, z: -0.3, r: 1.3, h: 1.0 },
  { x: 0.9, z: 0.4, r: 1.2, h: 0.55 },
  { x: -3.4, z: 2.2, r: 1.0, h: 0.6 },
  { x: 3.3, z: 1.3, r: 1.3, h: 0.4 },
];

function smoothstep(a: number, b: number, v: number) {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

function heightAt(x: number, z: number) {
  let h = 0;
  for (const hill of HILLS) {
    const d2 = (x - hill.x) ** 2 + (z - hill.z) ** 2;
    h += hill.h * Math.exp(-d2 / (2 * hill.r * hill.r));
  }
  h += Math.sin(x * 2.1) * Math.cos(z * 1.7) * 0.07;
  const edgeX = smoothstep(0, 0.9, W / 2 - Math.abs(x));
  const edgeZ = smoothstep(0, 0.9, D / 2 - Math.abs(z));
  return Math.max(0, h) * edgeX * edgeZ;
}

function makeTerrain() {
  const geometry = new THREE.PlaneGeometry(W, D, 56, 44);
  geometry.rotateX(-Math.PI / 2);
  const pos = geometry.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    pos.setY(i, heightAt(pos.getX(i), pos.getZ(i)));
  }
  const flat = geometry.toNonIndexed();
  flat.computeVertexNormals();
  geometry.dispose();
  const mesh = new THREE.Mesh(
    flat,
    new THREE.MeshStandardMaterial({ color: C.snow, flatShading: true, roughness: 0.95 }),
  );
  mesh.receiveShadow = true;
  mesh.castShadow = true;
  return mesh;
}

function makeTree(scale: number) {
  const group = new THREE.Group();
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.05, 0.25, 5),
    new THREE.MeshStandardMaterial({ color: C.trunk, flatShading: true }),
  );
  trunk.position.y = 0.12;
  group.add(trunk);
  const tiers = [
    { r: 0.26, h: 0.5, y: 0.42, color: C.tree },
    { r: 0.2, h: 0.42, y: 0.68, color: C.treeLight },
    { r: 0.13, h: 0.32, y: 0.9, color: C.tree },
  ];
  for (const tier of tiers) {
    const cone = new THREE.Mesh(
      new THREE.ConeGeometry(tier.r, tier.h, 6),
      new THREE.MeshStandardMaterial({ color: tier.color, flatShading: true, roughness: 0.9 }),
    );
    cone.position.y = tier.y;
    cone.castShadow = true;
    group.add(cone);
  }
  group.scale.setScalar(scale);
  return group;
}

function makeGondola() {
  const group = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(0.34, 0.3, 0.3),
    new THREE.MeshStandardMaterial({ color: C.gondola, roughness: 0.5 }),
  );
  body.castShadow = true;
  group.add(body);
  const band = new THREE.Mesh(
    new THREE.BoxGeometry(0.35, 0.1, 0.31),
    new THREE.MeshStandardMaterial({ color: C.window, roughness: 0.4 }),
  );
  band.position.y = 0.04;
  group.add(band);
  const hanger = new THREE.Mesh(
    new THREE.CylinderGeometry(0.012, 0.012, 0.32, 4),
    new THREE.MeshStandardMaterial({ color: C.steel }),
  );
  hanger.position.y = 0.31;
  group.add(hanger);
  return group;
}

function makeCabin() {
  const group = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 0.48, 0.6),
    new THREE.MeshStandardMaterial({ color: C.cabin, flatShading: true }),
  );
  body.position.y = 0.24;
  body.castShadow = true;
  group.add(body);
  const roof = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.62, 0.42, 4),
    new THREE.MeshStandardMaterial({ color: C.roof, flatShading: true }),
  );
  roof.rotation.y = Math.PI / 4;
  roof.scale.set(1.15, 1, 0.9);
  roof.position.y = 0.69;
  roof.castShadow = true;
  group.add(roof);
  const windowPane = new THREE.Mesh(
    new THREE.PlaneGeometry(0.22, 0.16),
    new THREE.MeshBasicMaterial({ color: C.glow }),
  );
  windowPane.position.set(0.12, 0.27, 0.301);
  group.add(windowPane);
  const light = new THREE.PointLight(C.glow, 1.3, 1.8, 1.8);
  light.position.set(0.12, 0.3, 0.6);
  group.add(light);
  return group;
}

function makeFlakeTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 32;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 32, 32);
  return new THREE.CanvasTexture(canvas);
}

export default function WinterScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = container.clientWidth;
    let height = container.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 100);
    const target = new THREE.Vector3(0, 1.5, 0);

    function placeCamera() {
      const aspect = width / height;
      const distance = 18.5 * Math.max(1.08, 1.02 / aspect);
      const dir = new THREE.Vector3(0.62, 0.5, 0.68).normalize();
      camera.position.copy(target).addScaledVector(dir, distance);
      camera.lookAt(target);
      camera.updateMatrixWorld();
      // Luna fija en la esquina superior derecha del encuadre
      const depth = distance + 14;
      const halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * depth;
      const halfW = halfH * camera.aspect;
      const forward = new THREE.Vector3();
      camera.getWorldDirection(forward);
      const right = new THREE.Vector3().crossVectors(forward, camera.up).normalize();
      const up = new THREE.Vector3().crossVectors(right, forward).normalize();
      moon.position
        .copy(camera.position)
        .addScaledVector(forward, depth)
        .addScaledVector(up, halfH * 0.72)
        .addScaledVector(right, halfW * 0.62);
      moon.scale.setScalar(depth / 36);
      moonLight.position.copy(moon.position).sub(target).normalize().multiplyScalar(14);
    }

    scene.add(new THREE.HemisphereLight(0xdfe1e6, 0x2a2b2f, 1.15));
    const moonLight = new THREE.DirectionalLight(0xf3f3f4, 1.7);
    moonLight.castShadow = true;
    moonLight.shadow.mapSize.set(1024, 1024);
    moonLight.shadow.camera.left = -8;
    moonLight.shadow.camera.right = 8;
    moonLight.shadow.camera.top = 8;
    moonLight.shadow.camera.bottom = -8;
    moonLight.shadow.bias = -0.0008;
    scene.add(moonLight);

    const world = new THREE.Group();
    scene.add(world);

    // Base del diorama
    const slab = new THREE.Mesh(
      new THREE.BoxGeometry(W, 0.6, D),
      [
        new THREE.MeshStandardMaterial({ color: C.snowSide, roughness: 1 }),
        new THREE.MeshStandardMaterial({ color: C.snowSide, roughness: 1 }),
        new THREE.MeshStandardMaterial({ color: C.slabTop, roughness: 1 }),
        new THREE.MeshStandardMaterial({ color: C.snowSide, roughness: 1 }),
        new THREE.MeshStandardMaterial({ color: C.snowSide, roughness: 1 }),
        new THREE.MeshStandardMaterial({ color: C.snowSide, roughness: 1 }),
      ],
    );
    slab.position.y = -0.31;
    slab.receiveShadow = true;
    world.add(slab);
    world.add(makeTerrain());

    // Árboles
    const TREES: [number, number, number][] = [
      [-3.9, -2.9, 1.2], [-1.0, -3.2, 1.0], [-3.4, 0.2, 0.9], [-0.6, 1.4, 0.8],
      [0.9, -1.0, 1.1], [2.6, -3.1, 1.2], [3.6, -0.6, 0.9], [4.2, -2.6, 0.8],
      [-1.8, 2.9, 0.9], [1.0, 3.0, 0.7], [-4.2, 3.1, 0.8], [3.9, 3.1, 0.9],
      [-2.6, -0.2, 1.3], [0.2, -2.6, 1.0],
    ];
    for (const [x, z, s] of TREES) {
      const tree = makeTree(s);
      tree.position.set(x, heightAt(x, z) - 0.02, z);
      tree.rotation.y = x * 1.7;
      world.add(tree);
    }

    // Refugio
    const cabin = makeCabin();
    cabin.position.set(2.5, heightAt(2.5, 1.0), 1.0);
    cabin.rotation.y = -0.5;
    world.add(cabin);

    // Teleférico: dos cables casi paralelos de la estación baja a la cima
    const stationA = new THREE.Vector3(3.4, heightAt(3.4, 2.4) + 0.9, 2.4);
    const stationB = new THREE.Vector3(-2.5, heightAt(-2.5, -1.7) + 0.9, -1.7);
    const side = new THREE.Vector3()
      .subVectors(stationB, stationA)
      .cross(new THREE.Vector3(0, 1, 0))
      .normalize()
      .multiplyScalar(0.14);

    function cablePoint(t: number, offset: number) {
      const p = new THREE.Vector3().lerpVectors(stationA, stationB, t);
      p.y -= Math.sin(Math.PI * t) * 0.35;
      return p.addScaledVector(side, offset);
    }

    const cableMaterial = new THREE.LineBasicMaterial({ color: C.steel });
    for (const offset of [-1, 1]) {
      const points = Array.from({ length: 40 }, (_, i) => cablePoint(i / 39, offset));
      world.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), cableMaterial));
    }

    const towerMaterial = new THREE.MeshStandardMaterial({ color: C.steel, flatShading: true });
    for (const t of [0, 0.36, 0.7, 1]) {
      const top = cablePoint(t, 0);
      const ground = heightAt(top.x, top.z);
      const tall = top.y - ground + 0.08;
      const mast = new THREE.Mesh(new THREE.BoxGeometry(0.1, tall, 0.1), towerMaterial);
      mast.position.set(top.x, ground + tall / 2, top.z);
      mast.castShadow = true;
      world.add(mast);
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.5), towerMaterial);
      arm.position.set(top.x, top.y + 0.04, top.z);
      arm.lookAt(top.clone().add(side));
      world.add(arm);
    }

    const gondolaUp = makeGondola();
    const gondolaDown = makeGondola();
    gondolaUp.scale.setScalar(1.5);
    gondolaDown.scale.setScalar(1.5);
    world.add(gondolaUp, gondolaDown);

    // Luna
    const moon = new THREE.Mesh(
      new THREE.SphereGeometry(1.15, 32, 16),
      new THREE.MeshBasicMaterial({ color: C.moon }),
    );
    scene.add(moon);
    placeCamera();

    // Nieve
    const FLAKES = 700;
    const flakePos = new Float32Array(FLAKES * 3);
    const flakeSpeed = new Float32Array(FLAKES);
    for (let i = 0; i < FLAKES; i++) {
      flakePos[i * 3] = (Math.random() - 0.5) * 16;
      flakePos[i * 3 + 1] = Math.random() * 10;
      flakePos[i * 3 + 2] = (Math.random() - 0.5) * 14;
      flakeSpeed[i] = 0.35 + Math.random() * 0.45;
    }
    const flakeGeometry = new THREE.BufferGeometry();
    flakeGeometry.setAttribute("position", new THREE.BufferAttribute(flakePos, 3));
    const flakeTexture = makeFlakeTexture();
    const flakes = new THREE.Points(
      flakeGeometry,
      new THREE.PointsMaterial({
        color: C.flake,
        size: 0.09,
        map: flakeTexture,
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
      }),
    );
    scene.add(flakes);

    // Interacción y bucle
    const pointer = { x: 0, y: 0 };
    const eased = { x: 0, y: 0 };
    function onPointer(event: PointerEvent) {
      const rect = container!.getBoundingClientRect();
      pointer.x = (event.clientX - rect.left) / rect.width - 0.5;
      pointer.y = (event.clientY - rect.top) / rect.height - 0.5;
    }
    container.addEventListener("pointermove", onPointer);

    let last = performance.now();
    let elapsed = 0;
    let frame = 0;

    function place(time: number) {
      const t = (Math.sin(time * 0.22) + 1) / 2;
      gondolaUp.position.copy(cablePoint(t, -1)).y -= 0.7;
      gondolaDown.position.copy(cablePoint(1 - t, 1)).y -= 0.7;
      const heading = Math.atan2(stationB.x - stationA.x, stationB.z - stationA.z);
      gondolaUp.rotation.y = heading;
      gondolaDown.rotation.y = heading;
    }

    function render() {
      renderer.render(scene, camera);
    }

    function tick() {
      const now = performance.now();
      const delta = Math.min((now - last) / 1000, 0.05);
      last = now;
      elapsed += delta;

      eased.x += (pointer.x - eased.x) * 0.04;
      eased.y += (pointer.y - eased.y) * 0.04;
      world.rotation.y = Math.sin(elapsed * 0.12) * 0.22 + eased.x * 0.35;
      world.rotation.x = eased.y * 0.08;

      place(elapsed);

      for (let i = 0; i < FLAKES; i++) {
        let y = flakePos[i * 3 + 1] - flakeSpeed[i] * delta;
        if (y < -0.2) y = 10;
        flakePos[i * 3 + 1] = y;
        flakePos[i * 3] += Math.sin(elapsed * 0.8 + i) * delta * 0.12;
      }
      flakeGeometry.attributes.position.needsUpdate = true;

      render();
      frame = requestAnimationFrame(tick);
    }

    function start() {
      if (frame || reduced) return;
      last = performance.now();
      frame = requestAnimationFrame(tick);
    }

    function stop() {
      cancelAnimationFrame(frame);
      frame = 0;
    }

    place(0);
    render();

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) start();
      else stop();
    });
    io.observe(container);

    const ro = new ResizeObserver(() => {
      width = container.clientWidth;
      height = container.clientHeight;
      if (!width || !height) return;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      placeCamera();
      if (!frame) render();
    });
    ro.observe(container);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      container.removeEventListener("pointermove", onPointer);
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        const material = mesh.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(material)) material.forEach((m) => m.dispose());
        else material?.dispose();
      });
      flakeTexture.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={mountRef} aria-hidden className="absolute inset-0" />;
}
