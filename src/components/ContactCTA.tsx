import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import bannerWebp from "@/assets/banner.webp";
import { track } from "@/lib/analytics";

const bookingLink = import.meta.env.VITE_BOOKING_LINK || "https://cal.com/your-handle/intro";

export default function ContactCTA() {
  return (
    <section id="contact" className="section-padding border-t border-border relative overflow-hidden">
      {/* Banner background */}
      <div className="absolute inset-0">
        <picture>
          <source srcSet={bannerWebp} type="image/webp" />
          <img
            src={bannerWebp}
            alt=""
            className="w-full h-full object-cover opacity-20"
            loading="lazy"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/60" />
      </div>

      <div className="container-narrow relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-6">
            Let's Build the Future<span className="text-gold">.</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
            Currently open for roles where I can architect, build, and deploy
            complex AI systems at scale.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={bookingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground font-bold hover:opacity-90 transition-all hover:scale-105 active:scale-95"
              onClick={() => track("cta:book_call", { location: "contact_cta" })}
            >
              Book a Call <ChevronRight className="w-5 h-5" />
            </a>
            <a
              href="mailto:contact@matveyev.ai"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-border text-foreground font-bold hover:border-primary/60 transition-all hover:scale-105 active:scale-95"
              onClick={() => track("cta:email", { location: "contact_cta" })}
            >
              Email Me
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
