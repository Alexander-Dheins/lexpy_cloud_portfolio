import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "lexpy, desarrollo de software e infraestructura",
  description:
    "Desarrollo paneles, APIs, plataformas de cursos e infraestructura propia, de la idea al servidor.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-paper text-ink">
        {children}
      </body>
    </html>
  );
}
