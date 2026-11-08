import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";
import { I18nProvider } from "@/components/i18n/I18nProvider";
import { getGithubStars } from "@/lib/github";
import type { Lang } from "@/lib/i18n";

export default async function HomePage({ lang }: { lang: Lang }) {
  const stars = await getGithubStars();
  return (
    <I18nProvider lang={lang}>
      <Navbar stars={stars} />
      <main className="flex-1">
        <Hero lang={lang} />
        <Services />
        <Contact />
      </main>
      <Footer lang={lang} />
      <FloatingActions />
    </I18nProvider>
  );
}
