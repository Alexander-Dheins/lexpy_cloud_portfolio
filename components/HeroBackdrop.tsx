import { TECH_ROWS } from "@/lib/tech-logos";

const SPEEDS = ["90s", "105s", "96s"];

// Decorative: the same logo rows as the footer, slow and blurred behind the hero copy.
export default function HeroBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="hero-backdrop pointer-events-none absolute inset-0 overflow-hidden select-none"
    >
      <div className="flex h-full flex-col justify-center gap-5 opacity-[0.17] blur-[2.5px] sm:gap-7">
        {TECH_ROWS.map((row, i) => (
          <div key={i} className="overflow-hidden">
            <div
              className="marquee-track flex w-max"
              style={
                {
                  "--speed": SPEEDS[i % SPEEDS.length],
                  "--dir": i % 2 === 1 ? "reverse" : "normal",
                } as React.CSSProperties
              }
            >
              {[0, 1].map((copy) => (
                <ul
                  key={copy}
                  className="flex shrink-0 gap-4 pr-4 sm:gap-5 sm:pr-5"
                >
                  {row.map((logo) => (
                    <li
                      key={logo.title}
                      className="flex shrink-0 items-center gap-2.5 rounded-full border border-ink/50 px-5 py-2.5 text-[17px] font-medium text-ink sm:text-[19px]"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        width="22"
                        height="22"
                        fill="currentColor"
                      >
                        <path d={logo.path} />
                      </svg>
                      <span className="whitespace-nowrap">{logo.title}</span>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
