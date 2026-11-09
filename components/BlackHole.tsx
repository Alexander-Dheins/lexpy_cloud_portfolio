/* Decorativo: un agujero negro asomando por el borde inferior del footer,
   con varios anillos de luz alrededor del horizonte de sucesos (más
   brillantes a la izquierda, como un cuarto menguante) y el disco de
   acreción cruzando por delante en varias bandas. */

const CX = 600;
const CY = 270;
const R = 140;

/* Anillos alrededor del horizonte: radio extra, grosor, opacidad y desenfoque. */
const RINGS = [
  { dr: 46, w: 14, o: 0.35, blur: true },
  { dr: 30, w: 1.2, o: 0.45, blur: false },
  { dr: 18, w: 6, o: 0.7, blur: true },
  { dr: 10, w: 1.6, o: 0.85, blur: false },
  { dr: 2, w: 2.4, o: 1, blur: false },
];

/* Bandas del disco por delante: semieje mayor, menor, grosor y opacidad. */
const BANDS = [
  { rx: 560, ry: 64, w: 1, o: 0.35 },
  { rx: 470, ry: 54, w: 1.4, o: 0.6 },
  { rx: 390, ry: 45, w: 2.2, o: 1 },
  { rx: 315, ry: 37, w: 1.2, o: 0.7 },
  { rx: 250, ry: 30, w: 1, o: 0.45 },
];

export default function BlackHole() {
  return (
    <div
      aria-hidden="true"
      className="black-hole pointer-events-none relative h-[140px] w-full select-none sm:h-[190px] lg:h-[230px]"
    >
      <svg viewBox="0 0 1200 270" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 h-full w-full" fill="none">
        <defs>
          <radialGradient id="bh-glow" cx={CX} cy={CY} r="270" gradientUnits="userSpaceOnUse">
            <stop offset="0.5" stopColor="var(--hole-light)" stopOpacity="0.18" />
            <stop offset="1" stopColor="var(--hole-light)" stopOpacity="0" />
          </radialGradient>
          {/* Cuarto menguante: los anillos brillan a la izquierda y se apagan a la derecha. */}
          <linearGradient id="bh-crescent" x1={CX - R - 50} y1="0" x2={CX + R + 50} y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="var(--hole-light)" stopOpacity="1" />
            <stop offset="0.55" stopColor="var(--hole-light)" stopOpacity="0.45" />
            <stop offset="1" stopColor="var(--hole-light)" stopOpacity="0.12" />
          </linearGradient>
          <linearGradient id="bh-disk" x1="40" y1="0" x2="1160" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="var(--hole-light)" stopOpacity="0" />
            <stop offset="0.3" stopColor="var(--hole-light)" stopOpacity="0.8" />
            <stop offset="0.5" stopColor="var(--hole-light)" stopOpacity="1" />
            <stop offset="0.7" stopColor="var(--hole-light)" stopOpacity="0.6" />
            <stop offset="1" stopColor="var(--hole-light)" stopOpacity="0" />
          </linearGradient>
          <filter id="bh-blur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
          <filter id="bh-blur-lg" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="12" />
          </filter>
        </defs>

        {/* Resplandor general */}
        <rect className="a-breathe" x="0" y="0" width="1200" height="270" fill="url(#bh-glow)" />

        {/* Anillos de luz curvada alrededor del horizonte */}
        {RINGS.map((ring) => (
          <circle
            key={ring.dr}
            cx={CX}
            cy={CY}
            r={R + ring.dr}
            stroke="url(#bh-crescent)"
            strokeWidth={ring.w}
            opacity={ring.o}
            filter={ring.blur ? "url(#bh-blur)" : undefined}
          />
        ))}

        {/* Horizonte de sucesos */}
        <circle cx={CX} cy={CY} r={R} fill="var(--hole)" />

        {/* Disco de acreción por delante, en bandas */}
        <ellipse cx={CX} cy={CY} rx="430" ry="50" stroke="url(#bh-disk)" strokeWidth="18" opacity="0.4" filter="url(#bh-blur-lg)" />
        {BANDS.map((band) => (
          <ellipse
            key={band.rx}
            cx={CX}
            cy={CY}
            rx={band.rx}
            ry={band.ry}
            stroke="url(#bh-disk)"
            strokeWidth={band.w}
            opacity={band.o}
          />
        ))}
        <ellipse
          className="a-orbit"
          cx={CX}
          cy={CY}
          rx="430"
          ry="50"
          stroke="url(#bh-disk)"
          strokeWidth="1.4"
          strokeDasharray="50 160 18 200"
          opacity="0.6"
        />
        <ellipse
          className="a-orbit"
          style={{ animationDuration: "64s" }}
          cx={CX}
          cy={CY}
          rx="520"
          ry="60"
          stroke="url(#bh-disk)"
          strokeWidth="1"
          strokeDasharray="26 220 80 260"
          opacity="0.4"
        />
      </svg>
    </div>
  );
}
