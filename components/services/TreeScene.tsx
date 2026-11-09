"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/* Árbol 3D de la sección de servicios: tronco y ramas, copa de follaje
   low-poly que se mece con el viento, raíces visibles bajo una isla de
   césped (cada una lleva una pieza del stack) y hojas que caen.
   Crece al entrar en pantalla y se puede girar arrastrando.
   WebGL no lee los tokens OKLCH, así que la paleta vive aquí. */

const C = {
  bark: 0x6f4a2f,
  barkDark: 0x553621,
  root: 0x8a6240,
  rootFine: 0xa67c52,
  node: 0xf2c14e,
  leaves: [0x2f6b3a, 0x3f8a45, 0x58a84a, 0x7cc257, 0xa5d667],
  grass: 0x79b84f,
  grassDark: 0x5c9a40,
  soil: 0x9a6b45,
  stone: 0x9a9da3,
  flowers: [0xf2c14e, 0xe8735a, 0xf5f1e6],
  falling: [0xe2a13a, 0xd9682f, 0x8fc956],
  sky: 0xfff4e0,
  ground: 0x8a7a5c,
};

/* La escena mide 7.6 unidades de alto; el suelo queda al 66 % desde arriba,
   igual que en el lienzo de 1240 x 760 de la sección. */
const VIEW_H = 7.6;
const LOOK_Y = 1.22;

/* Puntas de las raíces con etiqueta, de izquierda a derecha. */
const ROOT_TIPS: [number, number, number][] = [
  [-1.85, -0.92, 0.45],
  [-1.25, -1.34, 0.85],
  [-0.52, -1.74, 0.65],
  [0.52, -1.74, 0.65],
  [1.25, -1.34, 0.85],
  [1.85, -0.92, 0.45],
];

/* Raíces traseras, sin etiqueta, para dar volumen. */
const BACK_ROOTS: [number, number, number][] = [
  [-1.3, -1.0, -1.0],
  [0.1, -1.45, -1.2],
  [1.35, -1.05, -0.9],
];

/* Ramas principales: punta y grosor en la base. */
const BRANCHES: { tip: [number, number, number]; r: number }[] = [
  { tip: [-1.25, 2.95, 0.25], r: 0.15 },
  { tip: [1.2, 3.05, 0.1], r: 0.15 },
  { tip: [-0.45, 3.75, -0.7], r: 0.12 },
  { tip: [0.5, 3.8, 0.75], r: 0.12 },
  { tip: [0.05, 4.05, 0.0], r: 0.13 },
  { tip: [-0.75, 3.1, 1.0], r: 0.1 },
  { tip: [0.85, 3.0, -0.95], r: 0.1 },
];

/* Copa: centro, radio e índice de color (0 oscuro, 4 claro). */
const BLOBS: [number, number, number, number, number][] = [
  [0.0, 3.25, 0.0, 1.05, 1],
  [-1.2, 2.95, 0.2, 0.8, 0],
  [1.2, 3.0, 0.1, 0.82, 0],
  [-0.55, 3.75, -0.55, 0.78, 1],
  [0.6, 3.8, 0.55, 0.8, 2],
  [0.05, 4.2, 0.05, 0.72, 2],
  [-0.75, 3.1, 0.95, 0.7, 2],
  [0.85, 3.0, -0.9, 0.7, 0],
  [-1.55, 2.6, -0.35, 0.52, 0],
  [1.6, 2.65, 0.45, 0.52, 1],
  [-0.2, 2.75, 1.05, 0.6, 1],
  [0.3, 2.8, -1.1, 0.6, 0],
  [-0.95, 3.75, 0.35, 0.56, 3],
  [0.95, 3.7, -0.25, 0.55, 2],
  [0.35, 3.55, 1.0, 0.5, 3],
  [-0.4, 4.25, 0.5, 0.42, 3],
  [0.55, 4.3, -0.3, 0.42, 3],
  [-0.1, 4.6, -0.1, 0.36, 4],
  [-1.25, 3.45, 0.75, 0.38, 3],
  [1.3, 3.5, 0.65, 0.36, 4],
  [0.0, 3.9, 1.0, 0.34, 4],
];

const GROW_MS = 2600;

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}

function easeOutCubic(v: number) {
  return 1 - Math.pow(1 - v, 3);
}

function easeOutBack(v: number) {
  const c = 1.70158;
  return 1 + (c + 1) * Math.pow(v - 1, 3) + c * Math.pow(v - 1, 2);
}

/* Ruido barato y determinista a partir de una posición. */
function noise(x: number, y: number, z: number) {
  const s = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453;
  return s - Math.floor(s);
}

/* Tubo que se afina de r0 a r1 a lo largo de una curva. */
function limb(
  path: THREE.Vector3[] | THREE.Curve<THREE.Vector3>,
  r0: number,
  r1: number,
  power = 1,
  radial = 8,
  segments = 14,
) {
  const curve = Array.isArray(path) ? new THREE.CatmullRomCurve3(path) : path;
  const frames = curve.computeFrenetFrames(segments, false);
  const positions: number[] = [];
  const indices: number[] = [];
  const p = new THREE.Vector3();

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    curve.getPointAt(t, p);
    const r = r1 + (r0 - r1) * Math.pow(1 - t, power);
    const n = frames.normals[i];
    const b = frames.binormals[i];
    for (let j = 0; j < radial; j++) {
      const a = (j / radial) * Math.PI * 2;
      const cos = Math.cos(a) * r;
      const sin = Math.sin(a) * r;
      positions.push(p.x + cos * n.x + sin * b.x, p.y + cos * n.y + sin * b.y, p.z + cos * n.z + sin * b.z);
    }
  }
  for (let i = 0; i < segments; i++) {
    for (let j = 0; j < radial; j++) {
      const a = i * radial + j;
      const b = i * radial + ((j + 1) % radial);
      const c = a + radial;
      const e = b + radial;
      indices.push(a, c, b, b, c, e);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

/* Recorrido sinuoso de una raíz: primero se abre bajo la tierra y luego
   baja, serpenteando hacia los lados como una raíz de verdad. */
function rootCurve(start: THREE.Vector3, tip: THREE.Vector3, seed: number, wiggle: number) {
  const flat = new THREE.Vector3(tip.x - start.x, 0, tip.z - start.z);
  const side = new THREE.Vector3(-flat.z, 0, flat.x).normalize();
  const steps = 6;
  const points: THREE.Vector3[] = [];
  for (let k = 0; k <= steps; k++) {
    const t = k / steps;
    const out = Math.pow(t, 0.75);
    const down = Math.pow(t, 1.7);
    const bend = Math.sin(t * Math.PI) * wiggle;
    const sway = (noise(seed, k, 1) - 0.5) * 2 * bend;
    const lift = (noise(seed, k, 2) - 0.5) * bend * 0.7;
    points.push(
      new THREE.Vector3(
        start.x + (tip.x - start.x) * out + side.x * sway,
        start.y + (tip.y - start.y) * down + lift,
        start.z + (tip.z - start.z) * out + side.z * sway,
      ),
    );
  }
  return new THREE.CatmullRomCurve3(points);
}

/* Masa de follaje: icosaedro con los vértices desplazados. */
function blobGeometry(radius: number, seed: number) {
  const geometry = new THREE.IcosahedronGeometry(radius, 2);
  const position = geometry.getAttribute("position");
  const v = new THREE.Vector3();
  for (let i = 0; i < position.count; i++) {
    v.fromBufferAttribute(position, i);
    const k = 0.82 + noise(v.x + seed, v.y - seed, v.z + seed * 0.5) * 0.36;
    v.multiplyScalar(k);
    position.setXYZ(i, v.x, v.y * 0.9, v.z);
  }
  geometry.computeVertexNormals();
  return geometry;
}

export default function TreeScene({ labels }: { labels: string[] }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.domElement.style.display = "block";
    renderer.domElement.style.touchAction = "pan-y";
    renderer.domElement.style.cursor = "grab";
    container.prepend(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 60);

    scene.add(new THREE.HemisphereLight(C.sky, C.ground, 1.5));
    const sun = new THREE.DirectionalLight(0xfff1d6, 2.4);
    sun.position.set(-4.5, 9, 6);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.camera.left = -4;
    sun.shadow.camera.right = 4;
    sun.shadow.camera.top = 6;
    sun.shadow.camera.bottom = -3;
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 24;
    sun.shadow.bias = -0.0015;
    scene.add(sun);
    const fill = new THREE.DirectionalLight(0xcfe3ff, 0.5);
    fill.position.set(5, 3, -4);
    scene.add(fill);

    /* Todo el árbol gira dentro de este grupo. */
    const tree = new THREE.Group();
    scene.add(tree);

    const mat = (color: number, extra: Partial<THREE.MeshStandardMaterialParameters> = {}) =>
      new THREE.MeshStandardMaterial({ color, roughness: 0.9, metalness: 0, flatShading: true, ...extra });

    /* Isla de césped */
    const island = new THREE.Group();
    tree.add(island);
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(2.25, 1.95, 0.26, 28, 1), [
      mat(C.soil),
      mat(C.grass),
      mat(C.soil),
    ]);
    disc.position.y = -0.13;
    disc.receiveShadow = true;
    island.add(disc);

    const tuftGeometry = new THREE.ConeGeometry(0.05, 0.2, 4);
    const tuftMaterial = mat(C.grassDark);
    for (let i = 0; i < 34; i++) {
      const a = noise(i, 1, 2) * Math.PI * 2;
      const r = 0.55 + noise(i, 3, 4) * 1.55;
      const tuft = new THREE.Mesh(tuftGeometry, tuftMaterial);
      tuft.position.set(Math.cos(a) * r, 0.09, Math.sin(a) * r);
      tuft.rotation.set((noise(i, 5, 6) - 0.5) * 0.5, a, (noise(i, 7, 8) - 0.5) * 0.5);
      tuft.scale.setScalar(0.7 + noise(i, 9, 1) * 0.9);
      island.add(tuft);
    }
    const flowerGeometry = new THREE.SphereGeometry(0.045, 6, 5);
    for (let i = 0; i < 9; i++) {
      const a = noise(i, 11, 3) * Math.PI * 2;
      const r = 0.8 + noise(i, 13, 5) * 1.25;
      const flower = new THREE.Mesh(flowerGeometry, mat(C.flowers[i % C.flowers.length], { flatShading: false }));
      flower.position.set(Math.cos(a) * r, 0.1, Math.sin(a) * r);
      island.add(flower);
    }
    const stoneGeometry = new THREE.DodecahedronGeometry(0.16, 0);
    const stoneMaterial = mat(C.stone);
    [
      [1.35, 0.06, 0.95, 1],
      [-1.5, 0.05, 0.6, 0.75],
      [-0.9, 0.04, -1.5, 0.6],
    ].forEach(([x, y, z, s]) => {
      const stone = new THREE.Mesh(stoneGeometry, stoneMaterial);
      stone.position.set(x, y, z);
      stone.scale.set(s, s * 0.7, s);
      stone.castShadow = true;
      stone.receiveShadow = true;
      island.add(stone);
    });

    /* Tronco y ramas: crecen hacia arriba desde el suelo */
    const trunk = new THREE.Group();
    tree.add(trunk);
    const barkMaterial = mat(C.bark);
    const trunkTop = new THREE.Vector3(0.04, 2.3, 0);
    const trunkMesh = new THREE.Mesh(
      limb(
        [new THREE.Vector3(0, -0.12, 0), new THREE.Vector3(0.06, 0.8, 0.03), new THREE.Vector3(-0.03, 1.6, -0.02), trunkTop],
        0.5,
        0.2,
        2.6,
        10,
        18,
      ),
      barkMaterial,
    );
    trunkMesh.castShadow = true;
    trunk.add(trunkMesh);

    const branchMaterial = mat(C.barkDark);
    BRANCHES.forEach(({ tip, r }, i) => {
      const end = new THREE.Vector3(...tip);
      const start = new THREE.Vector3(0.02, 1.75 + (i % 3) * 0.2, 0);
      const mid = start.clone().lerp(end, 0.5);
      mid.y -= 0.18;
      const branch = new THREE.Mesh(limb([start, mid, end], r, 0.03, 1.2, 6, 8), branchMaterial);
      branch.castShadow = true;
      trunk.add(branch);
    });

    /* Raíces: crecen hacia abajo desde la base del tronco. Cada raíz
       principal serpentea, se ramifica en raíces secundarias y raicillas,
       y las que llevan etiqueta terminan en un nodo: por ellas sube un
       pulso hacia el tronco, como datos por la infraestructura. */
    const roots = new THREE.Group();
    tree.add(roots);
    const rootMaterial = mat(C.root, { flatShading: false });
    const fineMaterial = mat(C.rootFine, { flatShading: false });
    const nodeMaterial = new THREE.MeshStandardMaterial({
      color: C.node,
      emissive: C.node,
      emissiveIntensity: 0.55,
      roughness: 0.5,
    });
    const nodeGeometry = new THREE.SphereGeometry(0.07, 14, 10);
    const pulseGeometry = new THREE.SphereGeometry(0.038, 10, 8);
    const pulses: { mesh: THREE.Mesh; curve: THREE.Curve<THREE.Vector3>; offset: number }[] = [];
    const at = new THREE.Vector3();
    const tangent = new THREE.Vector3();

    /* Rama que sale de un punto de la curva madre, hacia un lado y abajo. */
    const offshoot = (parent: THREE.Curve<THREE.Vector3>, t: number, seed: number, length: number, radius: number, depth: number) => {
      parent.getPointAt(t, at);
      parent.getTangentAt(t, tangent);
      const turn = (noise(seed, 3, 7) - 0.5) * 2.4;
      const direction = new THREE.Vector3(tangent.x, 0, tangent.z).applyAxisAngle(THREE.Object3D.DEFAULT_UP, turn).normalize();
      const end = at.clone().addScaledVector(direction, length);
      end.y = at.y - length * (0.45 + noise(seed, 5, 9) * 0.5);
      const curve = rootCurve(at.clone(), end, seed, length * 0.22);
      roots.add(new THREE.Mesh(limb(curve, radius, radius * 0.22, 1.1, 6, 12), depth === 0 ? rootMaterial : fineMaterial));
      if (depth < 1) {
        offshoot(curve, 0.45, seed + 11, length * 0.6, radius * 0.5, depth + 1);
        offshoot(curve, 0.8, seed + 23, length * 0.45, radius * 0.4, depth + 1);
      }
    };

    [...ROOT_TIPS, ...BACK_ROOTS].forEach((tipArray, i) => {
      const tip = new THREE.Vector3(...tipArray);
      const start = new THREE.Vector3(tip.x * 0.06, -0.04, tip.z * 0.06);
      const curve = rootCurve(start, tip, i + 1, 0.3);
      roots.add(new THREE.Mesh(limb(curve, 0.19, 0.04, 1.25, 9, 28), rootMaterial));
      offshoot(curve, 0.34, i * 7 + 2, 0.62, 0.07, 0);
      offshoot(curve, 0.58, i * 7 + 4, 0.52, 0.055, 0);
      offshoot(curve, 0.8, i * 7 + 6, 0.36, 0.04, 1);

      if (i < ROOT_TIPS.length) {
        const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
        node.position.copy(tip);
        roots.add(node);
        const pulse = new THREE.Mesh(pulseGeometry, nodeMaterial);
        pulse.visible = false;
        roots.add(pulse);
        pulses.push({ mesh: pulse, curve, offset: noise(i, 31, 7) });
      }
    });

    /* Copa */
    const crown = new THREE.Group();
    tree.add(crown);
    const leafMaterials = C.leaves.map((color) => mat(color, { roughness: 0.8 }));
    const blobs = BLOBS.map(([x, y, z, r, tone], i) => {
      const mesh = new THREE.Mesh(blobGeometry(r, i * 1.7), leafMaterials[tone]);
      mesh.position.set(x, y, z);
      mesh.rotation.set(noise(i, 1, 1) * 3, noise(i, 2, 2) * 3, noise(i, 3, 3) * 3);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      crown.add(mesh);
      return { mesh, home: new THREE.Vector3(x, y, z), phase: noise(i, 8, 8) * Math.PI * 2, spin: mesh.rotation.z };
    });

    /* Hojas que caen */
    const leafGeometry = new THREE.PlaneGeometry(0.11, 0.07);
    const falling = Array.from({ length: 14 }, (_, i) => {
      const material = new THREE.MeshStandardMaterial({
        color: C.falling[i % C.falling.length],
        side: THREE.DoubleSide,
        roughness: 0.8,
        transparent: true,
        opacity: 0,
      });
      const mesh = new THREE.Mesh(leafGeometry, material);
      tree.add(mesh);
      return {
        mesh,
        material,
        angle: noise(i, 21, 4) * Math.PI * 2,
        radius: 0.5 + noise(i, 23, 6) * 1.5,
        speed: 0.28 + noise(i, 25, 8) * 0.22,
        offset: noise(i, 27, 2),
        phase: noise(i, 29, 5) * Math.PI * 2,
      };
    });

    /* Estado */
    let width = 1;
    let height = 1;
    let frame = 0;
    let last = 0;
    let time = 0;
    let grown = reduced ? 1 : 0;
    let growing = false;
    let dragYaw = 0;
    let dragging = false;
    let dragX = 0;
    const tipWorld = new THREE.Vector3();

    function placeCamera() {
      /* La altura visible siempre son VIEW_H unidades; en contenedores
         estrechos la cámara se aleja para que quepa la copa. */
      const aspect = width / height;
      const fov = THREE.MathUtils.degToRad(camera.fov);
      const needHeight = Math.max(VIEW_H, 5.2 / aspect);
      const distance = needHeight / 2 / Math.tan(fov / 2);
      camera.position.set(0, LOOK_Y + distance * 0.085, distance);
      camera.lookAt(0, LOOK_Y, 0);
    }

    function place() {
      const g = clamp01(grown);
      /* Crecimiento: tronco y raíces primero, copa después */
      const trunkK = easeOutCubic(clamp01(g / 0.5));
      trunk.scale.set(0.35 + trunkK * 0.65, Math.max(trunkK, 0.001), 0.35 + trunkK * 0.65);
      const rootK = easeOutCubic(clamp01((g - 0.1) / 0.5));
      roots.scale.setScalar(Math.max(rootK, 0.001));

      const sway = reduced ? 0 : 1;
      crown.rotation.z = Math.sin(time * 0.7) * 0.012 * sway;
      blobs.forEach((blob, i) => {
        const k = clamp01((g - 0.38 - i * 0.022) / 0.2);
        blob.mesh.scale.setScalar(Math.max(k > 0 ? easeOutBack(k) : 0, 0.001));
        blob.mesh.position.set(
          blob.home.x + Math.sin(time * 1.1 + blob.phase) * 0.035 * sway,
          blob.home.y + Math.sin(time * 0.8 + blob.phase * 1.7) * 0.02 * sway,
          blob.home.z + Math.cos(time * 0.9 + blob.phase) * 0.03 * sway,
        );
        blob.mesh.rotation.z = blob.spin + Math.sin(time * 0.9 + blob.phase) * 0.05 * sway;
      });

      const leafFade = clamp01((g - 0.9) / 0.1) * sway;
      falling.forEach((leaf) => {
        const cycle = (time * leaf.speed * 0.12 + leaf.offset) % 1;
        const y = 3.3 - cycle * 3.25;
        const drift = Math.sin(time * 1.3 + leaf.phase) * 0.22;
        leaf.mesh.position.set(
          Math.cos(leaf.angle) * leaf.radius + drift,
          y,
          Math.sin(leaf.angle) * leaf.radius + Math.cos(time * 1.1 + leaf.phase) * 0.18,
        );
        leaf.mesh.rotation.set(time * 1.4 + leaf.phase, time * 0.9 + leaf.phase, Math.sin(time * 2 + leaf.phase) * 0.8);
        leaf.material.opacity = leafFade * Math.min(1, cycle * 8) * Math.min(1, (1 - cycle) * 8);
      });

      /* Pulsos: van de la punta de cada raíz hacia el tronco */
      pulses.forEach((pulse) => {
        const cycle = (time * 0.22 + pulse.offset) % 1;
        pulse.mesh.visible = !reduced && g >= 1;
        /* Recorre la raíz desde la punta hasta poco antes de la tierra y
           se ensancha con ella, como un bulto de luz que sube. */
        const t = 1 - cycle * 0.8;
        pulse.curve.getPointAt(t, pulse.mesh.position);
        const radius = 0.04 + 0.15 * Math.pow(1 - t, 1.25);
        pulse.mesh.scale.setScalar((radius * 1.22 * Math.min(1, cycle * 6, (1 - cycle) * 6)) / 0.038);
      });

      const auto = reduced ? 0.25 : Math.sin(time * 0.3) * 0.32;
      tree.rotation.y = auto + dragYaw;
    }

    function render() {
      renderer.render(scene, camera);
      /* Etiquetas de las raíces: siguen la punta proyectada en pantalla */
      const rootK = roots.scale.x;
      ROOT_TIPS.forEach((tip, i) => {
        const label = labelRefs.current[i];
        if (!label) return;
        tipWorld.set(tip[0], tip[1], tip[2]);
        roots.localToWorld(tipWorld);
        tipWorld.project(camera);
        const x = (tipWorld.x * 0.5 + 0.5) * width;
        const y = (-tipWorld.y * 0.5 + 0.5) * height;
        const left = i < ROOT_TIPS.length / 2;
        label.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(${left ? "-100%" : "0"}, 20%) translateX(${left ? -6 : 6}px)`;
        label.style.opacity = String(clamp01((rootK - 0.7) / 0.3));
      });
    }

    function tick(now: number) {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      time += dt;
      if (growing && grown < 1) grown = Math.min(1, grown + (dt * 1000) / GROW_MS);
      if (!dragging) dragYaw *= Math.pow(0.35, dt);
      place();
      render();
      frame = requestAnimationFrame(tick);
    }

    function start() {
      growing = true;
      if (frame || reduced) return;
      last = performance.now();
      frame = requestAnimationFrame(tick);
    }

    function stop() {
      cancelAnimationFrame(frame);
      frame = 0;
    }

    /* Girar arrastrando en horizontal */
    const canvas = renderer.domElement;
    function onDown(event: PointerEvent) {
      dragging = true;
      dragX = event.clientX;
      canvas.setPointerCapture(event.pointerId);
      canvas.style.cursor = "grabbing";
    }
    function onMove(event: PointerEvent) {
      if (!dragging) return;
      dragYaw = THREE.MathUtils.clamp(dragYaw + (event.clientX - dragX) * 0.008, -1.1, 1.1);
      dragX = event.clientX;
      if (reduced) {
        place();
        render();
      }
    }
    function onUp() {
      dragging = false;
      canvas.style.cursor = "grab";
    }
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);

    const ro = new ResizeObserver(() => {
      width = container.clientWidth;
      height = container.clientHeight;
      if (!width || !height) return;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      placeCamera();
      if (!frame) {
        place();
        render();
      }
    });
    ro.observe(container);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) start();
        else stop();
      },
      { threshold: 0.2 },
    );
    io.observe(container);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        const material = mesh.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(material)) material.forEach((m) => m.dispose());
        else material?.dispose();
      });
      renderer.dispose();
      canvas.remove();
    };
  }, []);

  return (
    <div ref={mountRef} aria-hidden className="absolute inset-0">
      {labels.map((label, i) => (
        <span
          key={label}
          ref={(el) => {
            labelRefs.current[i] = el;
          }}
          className="pointer-events-none absolute top-0 left-0 text-[14px] whitespace-nowrap text-muted opacity-0 will-change-transform"
        >
          {label}
        </span>
      ))}
    </div>
  );
}
