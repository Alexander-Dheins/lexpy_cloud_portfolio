import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";
import { getGithubStars } from "@/lib/github";

export default async function Home() {
  const stars = await getGithubStars();
  return (
    <>
      <Navbar stars={stars} />
      <main className="flex-1">
        <Hero />
        <Services />
        <Contact />
      </main>
      <Footer />
      <FloatingActions />
    </>
  );
}
