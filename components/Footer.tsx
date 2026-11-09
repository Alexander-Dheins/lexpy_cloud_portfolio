import Image from "next/image";
import logo from "@/public/brand/logo-lineas-blancas.png";
import BlackHole from "./BlackHole";

const YEAR = 2026; // fixed: prerender rejects new Date()

/* El footer mide lo mismo que el agujero negro: el logo y el copyright
   quedan centrados dentro del horizonte de sucesos. */
export default function Footer() {
  return (
    <footer className="relative h-[190px] overflow-hidden bg-panel text-panel-ink sm:h-[200px] lg:h-[230px]">
      <BlackHole />

      <div className="absolute inset-x-0 bottom-4 z-10 flex flex-col items-center gap-1.5 sm:bottom-6 sm:gap-2">
        <a href="#top" className="flex items-center gap-2 text-[17px] font-semibold tracking-[-0.02em] sm:gap-2.5 sm:text-[20px]">
          <Image src={logo} alt="" width={40} height={40} className="h-8 w-8 sm:h-10 sm:w-10" />
          lexpy
        </a>
        <span className="text-[12px] text-panel-muted sm:text-[13px]">© {YEAR} lexpy.cloud</span>
      </div>
    </footer>
  );
}
