import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import TiltCard from "@/components/TiltCard";
import { supabase } from "@/integrations/supabase/client";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar_url: string | null;
  quote: string;
  rating: number;
}

const fallbackTestimonials: Testimonial[] = [
  { id: "1", name: "Sarah Chen", role: "CTO, TechVentures", avatar_url: "", quote: "Exceptional work on our enterprise platform. The attention to detail and technical expertise exceeded our expectations. Delivered on time with outstanding quality.", rating: 5 },
  { id: "2", name: "Marcus Johnson", role: "Founder, StartupLab", avatar_url: "", quote: "Transformed our MVP into a scalable product. The architecture decisions made early on saved us months of refactoring later. Highly recommended!", rating: 5 },
  { id: "3", name: "Elena Rodriguez", role: "Product Manager, InnovateCo", avatar_url: "", quote: "Brilliant problem-solver with a keen eye for UX. Our user engagement increased by 40% after the redesign. A true professional.", rating: 5 },
];

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(fallbackTestimonials);

  useEffect(() => {
    supabase
      .from("testimonials")
      .select("id, name, role, avatar_url, quote, rating")
      .eq("visible", true)
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) setTestimonials(data);
      });
  }, []);

  return (
    <section className="section-padding bg-background relative overflow-hidden" id="testimonials">
      <div className="container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number] }}
          viewport={{ once: true, margin: "-50px" }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Client <span className="text-gradient">Testimonials</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Feedback from partners and clients I've had the pleasure of working with
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15, ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number] }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <TiltCard glowColor="hsl(var(--gradient-gold) / 0.12)" className="h-full">
                <div className="h-full rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md p-6 flex flex-col transition-colors duration-300 group-hover:border-border">
                  <Quote className="h-7 w-7 text-gold/40 mb-4" />
                  <p className="text-muted-foreground flex-grow mb-6 leading-relaxed text-sm">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${i < testimonial.rating ? "text-gold fill-gold" : "text-muted-foreground/30"}`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border border-border">
                      <AvatarImage src={testimonial.avatar_url || ""} alt={testimonial.name} />
                      <AvatarFallback className="bg-gold/10 text-gold text-xs font-medium">
                        {testimonial.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground text-sm">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
