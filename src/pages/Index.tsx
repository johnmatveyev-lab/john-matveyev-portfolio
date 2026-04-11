import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import FeaturedProjects from "@/components/FeaturedProjects";

import TestimonialsSection from "@/components/TestimonialsSection";
import ContactCTA from "@/components/ContactCTA";
import Footer from "@/components/Footer";
import VoiceAssistant from "@/components/VoiceAssistant";
import { SEO } from "@/components/SEO";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <SEO />
      {/* Ambient Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] ambient-glow-cyan opacity-60" />
        <div className="absolute top-1/2 -right-32 w-[600px] h-[600px] ambient-glow-violet opacity-50" />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] ambient-glow-emerald opacity-40" />
      </div>

      <Navbar />
      <main id="main-content" className="relative z-10">
        <HeroSection />
        <AboutSection />
        <FeaturedProjects />
        
        <TestimonialsSection />
        <ContactCTA />
      </main>
      <Footer />
      <VoiceAssistant />
    </div>
  );
};

export default Index;
