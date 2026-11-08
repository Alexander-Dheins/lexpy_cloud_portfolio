import "../globals.css";
import RootDocument, { buildMetadata } from "@/components/RootDocument";

export const metadata = buildMetadata("es");

export default function SpanishLayout({ children }: { children: React.ReactNode }) {
  return <RootDocument lang="es">{children}</RootDocument>;
}
