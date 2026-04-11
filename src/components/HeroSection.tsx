import { motion, useReducedMotion } from "framer-motion";
import { Cpu, Network, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import portraitWebp from "@/assets/portrait.webp";

const skills = [
  "React / Next.js",
  "Node.js / Python",
  "PostgreSQL / MongoDB",
  "LLM Prompt Engineering",
  "Computer Vision",
  "Web Audio API",
  "Real-Time WebSockets",
  "Cloud Architecture",
];

const marqueeStack = [
  "React", "TypeScript", "Python", "Node.js", "PostgreSQL",
  "TensorFlow", "OpenAI", "AWS", "Docker", "Redis",
  "GraphQL", "WebSockets", "Next.js", "Tailwind", "Prisma",
];
const marqueeItems = [...marqueeStack, ...marqueeStack];

const lineReveal = {
  hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, delay: 0.15 * i, ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number] },
  }),
};

export default function HeroSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative min-h-screen flex flex-col justify-center section-padding pt-32 overflow-hidden">
      {/* Grain texture overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      <div className="container-narrow w-full">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Text Content */}
          <div className="flex-1">
            {/* Availability Badge */}
            <motion.div
              variants={lineReveal}
              initial="hidden"
              animate="visible"
              custom={0}
              className="flex items-center gap-2 mb-8"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="status-pulse absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-sm text-muted-foreground">
                Available for new opportunities
              </span>
            </motion.div>

            {/* Headline with line-by-line reveal */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight leading-[0.95] mb-8">
              <motion.span
                variants={lineReveal}
                initial="hidden"
                animate="visible"
                custom={1}
                className="block"
              >
                Full-Stack
              </motion.span>
              <motion.span
                variants={lineReveal}
                initial="hidden"
                animate="visible"
                custom={2}
                className="block text-gradient"
              >
                AI Software
              </motion.span>
              <motion.span
                variants={lineReveal}
                initial="hidden"
                animate="visible"
                custom={3}
                className="block text-gradient"
              >
                Engineer
              </motion.span>
            </h1>

            <motion.p
              variants={lineReveal}
              initial="hidden"
              animate="visible"
              custom={4}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed mb-10"
            >
              I don't just build wrappers. I architect production-ready web
              applications that orchestrate complex multi-modal AI models, handle
              messy data, and solve real-world problems.
            </motion.p>

            {/* Skills Tags */}
            <div className="flex flex-wrap gap-2 mb-12">
              {skills.map((skill, index) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.8 + index * 0.05 }}
                  className="skill-tag"
                >
                  {skill}
                </motion.span>
              ))}
            </div>

            <motion.div
              variants={lineReveal}
              initial="hidden"
              animate="visible"
              custom={5}
              className="flex flex-wrap gap-4"
            >
              <a
                href="#featured"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                <Cpu className="w-4 h-4" />
                View Projects
              </a>
              <Link
                to="/skills"
                className="inline-flex items-center gap-2 border border-border text-foreground px-6 py-3 rounded-lg font-medium hover:border-primary/50 transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                Explore My Expertise
              </Link>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 border border-border text-foreground px-6 py-3 rounded-lg font-medium hover:border-accent/50 transition-colors"
              >
                <Network className="w-4 h-4" />
                Get in Touch
              </a>
            </motion.div>
          </div>

          {/* Portrait with organic mask */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
            className="relative flex-shrink-0"
          >
            <div
              className="relative w-64 h-64 md:w-80 md:h-80 lg:w-[420px] lg:h-[420px] overflow-hidden"
              style={{
                borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
              }}
            >
              <picture>
                <source srcSet={portraitWebp} type="image/webp" />
                <img
                  src={portraitWebp}
                  alt="John Mattveyev"
                  className="w-full h-full object-cover"
                  loading="eager"
                  fetchPriority="high"
                />
              </picture>
              <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
            </div>
            {/* Glow behind portrait */}
            <div
              className="absolute -inset-8 -z-10 blur-3xl opacity-40"
              style={{
                background: "radial-gradient(circle, hsl(var(--gradient-gold) / 0.3), hsl(var(--gradient-cyan) / 0.15), transparent 70%)",
              }}
            />
            {/* Subtle ring */}
            <div
              className="absolute -inset-2 -z-[5] border border-gold/10"
              style={{
                borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
              }}
            />
          </motion.div>
        </div>
      </div>

      {/* Infinite Tech Stack Marquee */}
      <div className="mt-20 md:mt-28 w-screen relative left-1/2 -translate-x-1/2 overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
        <motion.div
          animate={prefersReducedMotion ? undefined : { x: ["0%", "-50%"] }}
          transition={prefersReducedMotion ? undefined : { duration: 30, repeat: Infinity, ease: "linear" }}
          className="flex gap-8 items-center whitespace-nowrap"
        >
          {marqueeItems.map((tech, i) => (
            <span
              key={`${tech}-${i}`}
              className="text-sm font-mono tracking-wider text-muted-foreground/40 uppercase select-none"
            >
              {tech}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
