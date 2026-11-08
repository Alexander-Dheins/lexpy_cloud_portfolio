"use client";

import { useState } from "react";

export type MarqueeLogo = { title: string; path: string };

type Props = {
  rows: MarqueeLogo[][];
  label: string;
  pauseLabel: string;
  playLabel: string;
};

const SPEEDS = ["46s", "54s", "50s"];

function Chip({ logo }: { logo: MarqueeLogo }) {
  return (
    <li className="flex shrink-0 items-center gap-2 rounded-full border border-panel-rule px-3.5 py-2 text-[13.5px] text-panel-muted">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
        <path d={logo.path} />
      </svg>
      <span className="whitespace-nowrap">{logo.title}</span>
    </li>
  );
}

export default function LogoMarquee({ rows, label, pauseLabel, playLabel }: Props) {
  const [paused, setPaused] = useState(false);

  return (
    <div className="marquee" data-paused={paused}>
      <div className="mb-5 flex items-center justify-between gap-4">
        <p className="text-[14px] text-panel-muted">{label}</p>
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          aria-label={paused ? playLabel : pauseLabel}
          title={paused ? playLabel : pauseLabel}
          className="grid size-8 place-items-center rounded-full border border-panel-rule text-panel-muted transition-colors hover:text-panel-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-panel-ink motion-reduce:hidden"
        >
          {paused ? (
            <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor" aria-hidden="true">
              <path d="M4 2.5v11l9-5.5z" />
            </svg>
          ) : (
            <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor" aria-hidden="true">
              <path d="M4 2.5h3v11H4zM9 2.5h3v11H9z" />
            </svg>
          )}
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {rows.map((row, i) => (
          <div key={i} className="marquee-row overflow-hidden">
            <div
              className="marquee-track flex w-max motion-reduce:w-full"
              style={
                {
                  "--speed": SPEEDS[i % SPEEDS.length],
                  "--dir": i % 2 === 1 ? "reverse" : "normal",
                } as React.CSSProperties
              }
            >
              {/* The list is rendered twice; the copy is hidden from assistive tech. */}
              <ul className="flex shrink-0 gap-3 pr-3 motion-reduce:shrink motion-reduce:flex-wrap motion-reduce:pr-0">
                {row.map((logo) => (
                  <Chip key={logo.title} logo={logo} />
                ))}
              </ul>
              <ul className="flex shrink-0 gap-3 pr-3 motion-reduce:hidden" aria-hidden="true">
                {row.map((logo) => (
                  <Chip key={logo.title} logo={logo} />
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
