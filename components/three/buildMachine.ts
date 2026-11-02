import * as THREE from "three";

/**
 * Shared geometry logic for the PC -> Rubik's cube -> Gaming PC morph.
 *
 * We keep 27 "cubelets" (a 3x3x3 grid, like a real Rubik's cube) alive for the
 * whole animation. Each cubelet only ever needs to know three target
 * positions (one per silhouette) - everything else (twists, entrance,
 * floating) is just tweening toward one of those three vectors.
 */

export type GridIndex = 0 | 1 | 2;

export interface CubeletTargets {
  pc: THREE.Vector3;
  rubik: THREE.Vector3;
  gaming: THREE.Vector3;
}

export const GRID = [0, 1, 2] as GridIndex[];

// Centered coordinate: 0,1,2 -> -1,0,1
const c = (i: GridIndex) => i - 1;

export function buildTargets(ix: GridIndex, iy: GridIndex, iz: GridIndex): CubeletTargets {
  const cx = c(ix);
  const cy = c(iy);
  const cz = c(iz);

  // --- State 1: "PC tower" — tall, narrow case silhouette.
  const pc = new THREE.Vector3(cx * 0.38, cy * 0.95, cz * 0.38);

  // --- State 2: "Rubik's cube" — perfect, evenly spaced cube.
  const rubik = new THREE.Vector3(cx * 0.58, cy * 0.58, cz * 0.58);

  // --- State 3: "Gaming PC" — wide, low case; front layer (iz=0) pushed
  // forward a touch so the "front panel" reads clearly.
  const frontPush = iz === 0 ? -0.22 : 0;
  const gaming = new THREE.Vector3(cx * 0.95, cy * 0.46, cz * 0.62 + frontPush);

  return { pc, rubik, gaming };
}

/** Which cubelets get a colored-glass accent instead of plain dark glass. */
export function accentFor(ix: GridIndex, iy: GridIndex, iz: GridIndex): "red" | "blue" | null {
  // A thin "status light" column on the front-right, red.
  if (iz === 0 && ix === 2 && iy !== 1) return "red";
  // A diagonal thread of blue glass running through the block.
  if (ix === iy && iz === 2) return "blue";
  return null;
}
