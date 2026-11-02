import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lexpy | Desarrollo & Infraestructura",
  description:
    "Portafolio de servicios — desarrollo de software, automatización e infraestructura self-hosted.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
