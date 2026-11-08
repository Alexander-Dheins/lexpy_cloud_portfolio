import type { Metadata } from "next";
import type { ReactNode } from "react";
import { HOME_PATH, getDict, type Lang } from "@/lib/i18n";

export function buildMetadata(lang: Lang): Metadata {
  const t = getDict(lang);
  return {
    metadataBase: new URL("https://lexpy.cloud"),
    title: t.meta.title,
    description: t.meta.description,
    alternates: {
      canonical: HOME_PATH[lang],
      languages: { es: HOME_PATH.es, en: HOME_PATH.en, "x-default": HOME_PATH.es },
    },
  };
}

export default function RootDocument({ lang, children }: { lang: Lang; children: ReactNode }) {
  return (
    <html lang={lang} className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-paper text-ink">{children}</body>
    </html>
  );
}
