import Image from "next/image";
import logo from "@/public/brand/logo-lineas-blancas.png";
import BlackHole from "./BlackHole";

const YEAR = 2026; // fixed: prerender rejects new Date()

/* El footer mide lo mismo que el agujero negro: el logo y el copyright
   quedan centrados dentro del horizonte de sucesos. */
export default function Footer() {
  return (
    <footer className="relative h-[120px] overflow-hidden bg-panel text-panel-ink">
      <BlackHole />

      <div className="absolute inset-x-0 bottom-3 z-10 flex flex-col items-center gap-0.5">
        <a href="#top" className="flex items-center gap-2 text-[16px] font-semibold tracking-[-0.02em]">
          <Image src={logo} alt="" width={40} height={40} className="h-7 w-7" />
          lexpy
        </a>
        <span className="text-[11.5px] text-panel-muted">© {YEAR} lexpy.cloud</span>
      </div>
    </footer>
  );
}
