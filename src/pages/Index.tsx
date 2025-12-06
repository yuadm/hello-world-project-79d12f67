import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Hero from "@/components/home/Hero";
import ValuesSection from "@/components/home/ValuesSection";
import WhatWeOffer from "@/components/home/WhatWeOffer";
import ValueProposition from "@/components/home/ValueProposition";
import Testimonials from "@/components/home/Testimonials";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <Hero />
        <section id="values">
          <ValuesSection />
        </section>
        <WhatWeOffer />
        <ValueProposition />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
