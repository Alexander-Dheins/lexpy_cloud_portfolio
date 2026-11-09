/* Decorativo: un agujero negro asomando por el borde inferior del footer,
   con el disco de acreción cruzando por delante y el anillo de fotones
   iluminado como un cuarto menguante. */

const CX = 600;
const CY = 380;
const R = 210;

export default function BlackHole() {
  return (
    <div aria-hidden="true" className="black-hole pointer-events-none relative h-[210px] w-full select-none sm:h-[300px] lg:h-[360px]">
      <svg
        viewBox="0 0 1200 380"
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-0 h-full w-full"
        fill="none"
      >
        <defs>
          <radialGradient id="bh-glow" cx={CX} cy={CY} r="370" gradientUnits="userSpaceOnUse">
            <stop offset="0.55" stopColor="var(--hole-light)" stopOpacity="0.16" />
            <stop offset="1" stopColor="var(--hole-light)" stopOpacity="0" />
          </radialGradient>
          {/* Cuarto menguante: el anillo brilla a la izquierda y se apaga a la derecha. */}
          <linearGradient id="bh-crescent" x1={CX - R} y1="0" x2={CX + R} y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="var(--hole-light)" stopOpacity="1" />
            <stop offset="0.55" stopColor="var(--hole-light)" stopOpacity="0.35" />
            <stop offset="1" stopColor="var(--hole-light)" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="bh-disk" x1="40" y1="0" x2="1160" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="var(--hole-light)" stopOpacity="0" />
            <stop offset="0.3" stopColor="var(--hole-light)" stopOpacity="0.75" />
            <stop offset="0.5" stopColor="var(--hole-light)" stopOpacity="1" />
            <stop offset="0.7" stopColor="var(--hole-light)" stopOpacity="0.55" />
            <stop offset="1" stopColor="var(--hole-light)" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="bh-disk-fill" cx={CX} cy={CY - 6} r="560" gradientUnits="userSpaceOnUse" gradientTransform={`translate(0 ${CY}) scale(1 0.14) translate(0 ${-CY})`}>
            <stop offset="0.35" stopColor="var(--hole-light)" stopOpacity="0.1" />
            <stop offset="1" stopColor="var(--hole-light)" stopOpacity="0" />
          </radialGradient>
          <filter id="bh-blur-lg" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="14" />
          </filter>
          <filter id="bh-blur-sm" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
        </defs>

        {/* Resplandor general */}
        <rect className="a-breathe" x="0" y="0" width="1200" height="380" fill="url(#bh-glow)" />

        {/* Parte trasera del disco, curvada por la gravedad alrededor del horizonte */}
        <circle cx={CX} cy={CY} r={R + 22} stroke="url(#bh-crescent)" strokeWidth="26" opacity="0.45" filter="url(#bh-blur-lg)" />
        <circle cx={CX} cy={CY} r={R + 6} stroke="url(#bh-crescent)" strokeWidth="6" opacity="0.8" filter="url(#bh-blur-sm)" />

        {/* Horizonte de eventos */}
        <circle cx={CX} cy={CY} r={R} fill="var(--hole)" />
        {/* Anillo de fotones */}
        <circle cx={CX} cy={CY} r={R + 1.5} stroke="url(#bh-crescent)" strokeWidth="2" />

        {/* Disco de acreción por delante */}
        <ellipse cx={CX} cy={CY + 4} rx="560" ry="78" fill="url(#bh-disk-fill)" />
        <ellipse cx={CX} cy={CY + 4} rx="560" ry="78" stroke="url(#bh-disk)" strokeWidth="16" opacity="0.5" filter="url(#bh-blur-lg)" />
        <ellipse cx={CX} cy={CY + 4} rx="560" ry="78" stroke="url(#bh-disk)" strokeWidth="2" />
        <ellipse
          className="a-orbit"
          cx={CX}
          cy={CY + 4}
          rx="520"
          ry="66"
          stroke="url(#bh-disk)"
          strokeWidth="1.2"
          strokeDasharray="60 140 20 180"
          opacity="0.5"
        />
        <ellipse
          className="a-orbit"
          style={{ animationDuration: "64s" }}
          cx={CX}
          cy={CY + 4}
          rx="600"
          ry="92"
          stroke="url(#bh-disk)"
          strokeWidth="1"
          strokeDasharray="30 220 90 260"
          opacity="0.3"
        />
      </svg>
    </div>
  );
}
