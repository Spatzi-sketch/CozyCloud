import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { ProductsSection } from "@/components/home/ProductsSection";
import { WhyCozySection } from "@/components/home/WhyCozySection";
import { CozyCornerSection } from "@/components/home/CozyCornerSection";
import { RestockSection } from "@/components/home/RestockSection";
import { FallingDecor } from "@/components/home/FallingDecor";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <FallingDecor />
      <main>
        <Hero />
        <ProductsSection />
        <WhyCozySection />
        <CozyCornerSection />
        <RestockSection />
      </main>
      <Footer />
    </>
  );
}
