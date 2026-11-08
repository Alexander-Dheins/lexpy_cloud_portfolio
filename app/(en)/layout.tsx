import "../globals.css";
import RootDocument, { buildMetadata } from "@/components/RootDocument";

export const metadata = buildMetadata("en");

export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return <RootDocument lang="en">{children}</RootDocument>;
}
