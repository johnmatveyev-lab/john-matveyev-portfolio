import { motion } from "framer-motion";
import {
  Cloud, Sparkles, FlaskConical, Rocket, Layers, Zap, Terminal, Bot,
  Link, Database, Flame, Heart, MousePointer, GitBranch, Globe, Grip,
  Bird, Smartphone, Code, Eye, Mic, LayoutDashboard, Radio, Workflow,
  Brain, BarChart3, Building2, CheckCircle2, ChevronRight,
  Apple,
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { platforms, capabilities } from "@/data/skills";
import AnimatedCounter from "@/components/AnimatedCounter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import IdeaGenerator from "@/components/IdeaGenerator";
import { SEO } from "@/components/SEO";

const iconMap: Record<string, React.ElementType> = {
  Cloud, Sparkles, FlaskConical, Rocket, Layers, Zap, Terminal, Bot,
  Link, Database, Flame, Heart, MousePointer, GitBranch, Globe, Grip,
  Bird, Smartphone, Code, Eye, Mic, LayoutDashboard, Radio, Workflow,
  Brain, BarChart3, Building2, Apple,
};

const gradientClasses: Record<string, string> = {
  blue: "from-[hsl(217,80%,58%)] to-[hsl(187,90%,48%)]",
  violet: "from-[hsl(270,80%,60%)] to-[hsl(330,75%,58%)]",
  emerald: "from-[hsl(160,70%,42%)] to-[hsl(170,80%,50%)]",
  pink: "from-[hsl(330,75%,58%)] to-[hsl(350,85%,65%)]",
  gold: "from-[hsl(40,85%,55%)] to-[hsl(40,70%,70%)]",
  cyan: "from-[hsl(187,90%,48%)] to-[hsl(200,100%,60%)]",
};

const proficiencyColor: Record<string, string> = {
  expert: "text-primary",
  advanced: "text-accent",
  proficient: "text-muted-foreground",
};

const totalSkills = platforms.reduce(
  (sum, p) => sum + p.categories.reduce((s, c) => s + c.skills.length, 0),
  0
);

export default function SkillsPage() {

  const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06 } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 24, scale: 0.97 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number] } },
  };

  return (
    <div className="min-h-screen bg-background relative">
      <SEO 
        title="Skills | John Matveyev" 
        description="A comprehensive breakdown of every platform, system, and technology in my toolkit." 
        canonical="/skills"
      />
      {/* Ambient Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] ambient-glow-cyan opacity-50" />
        <div className="absolute top-1/2 -right-32 w-[600px] h-[600px] ambient-glow-violet opacity-40" />
        <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] ambient-glow-emerald opacity-30" />
      </div>

      <Navbar />

      <main id="main-content">
        {/* Hero */}
        <section className="section-padding pt-32 pb-16 relative overflow-hidden">
          <div className="container-narrow relative z-10">
            <motion.div initial="hidden" animate="visible" variants={stagger}>
              <motion.p variants={fadeUp} className="font-mono text-[11px] tracking-[0.2em] uppercase text-primary mb-4">
                // full_stack.expertise
              </motion.p>
            <motion.h1
              variants={fadeUp}
              className="font-display text-5xl md:text-7xl font-black tracking-tight mb-6 leading-[0.95]"
            >
              Skills &{" "}
              <span className="text-gradient">Expertise</span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="text-muted-foreground text-lg md:text-xl max-w-2xl leading-relaxed mb-12"
            >
              A comprehensive breakdown of every platform, system, and technology
              in my toolkit — from cloud infrastructure to AI models to native
              mobile development.
            </motion.p>

            {/* Stats */}
            <motion.div variants={fadeUp} className="flex gap-10 flex-wrap">
              {[
                { label: "Platforms", value: platforms.length },
                { label: "Skills", value: totalSkills },
                { label: "Capabilities", value: capabilities.length },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-4xl font-black text-gradient-cyan">
                    <AnimatedCounter value={`${s.value}`} />+
                  </div>
                  <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-muted-foreground mt-1">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
          </div>
        </section>

        {/* Skill Tree */}
        <section className="section-padding pt-0 relative z-10">
          <div className="container-narrow">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="grid gap-4"
          >
            {platforms.map((platform) => {
              const Icon = iconMap[platform.icon] || Code;
              return (
                <motion.div key={platform.name} variants={fadeUp}>
                  <Accordion type="single" collapsible>
                    <AccordionItem
                      value={platform.name}
                      className="liquid-glass liquid-glass-hover glass-shine rounded-xl overflow-hidden border-0 transition-all duration-300"
                    >
                      <AccordionTrigger className="px-6 py-5 hover:no-underline group">
                        <div className="flex items-center gap-4 text-left">
                          <div
                            className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradientClasses[platform.gradient]} flex items-center justify-center shrink-0 shadow-lg`}
                          >
                            <Icon className="w-5 h-5 text-background" />
                          </div>
                          <div>
                            <div className="font-display font-bold text-foreground tracking-tight">
                              {platform.name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {platform.description}
                            </div>
                          </div>
                          <div className="ml-auto mr-4 font-mono text-[11px] tracking-[0.15em] uppercase text-muted-foreground hidden sm:block">
                            {platform.categories.reduce((s, c) => s + c.skills.length, 0)} skills
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-6">
                        <div className="grid gap-4 md:grid-cols-2">
                          {platform.categories.map((cat) => (
                            <div
                              key={cat.category}
                              className="liquid-glass-inner rounded-lg p-4"
                            >
                              <div className="font-mono text-[11px] tracking-[0.15em] uppercase text-muted-foreground mb-3 flex items-center gap-2">
                                <ChevronRight className="w-3 h-3 text-primary" />
                                {cat.category}
                              </div>
                              <div className="space-y-2">
                                {cat.skills.map((skill) => (
                                  <div
                                    key={skill.name}
                                    className="flex items-center gap-2 text-sm"
                                  >
                                    <CheckCircle2
                                      className={`w-4 h-4 shrink-0 ${proficiencyColor[skill.proficiency || "proficient"]}`}
                                    />
                                    <span className="text-foreground">
                                      {skill.name}
                                    </span>
                                    <span className="ml-auto font-mono text-[10px] text-muted-foreground capitalize">
                                      {skill.proficiency}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </motion.div>
              );
            })}
          </motion.div>
          </div>
        </section>

        {/* What I Can Build */}
        <section className="section-padding relative z-10">
          <div className="container-narrow">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
          >
            <motion.p variants={fadeUp} className="font-mono text-[11px] tracking-[0.2em] uppercase text-primary mb-4">
              // capabilities.summary
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="font-display text-3xl md:text-5xl font-black tracking-tight mb-10"
            >
              What I Can <span className="text-gradient-gold">Build</span>
            </motion.h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {capabilities.map((cap) => {
                const Icon = iconMap[cap.icon] || Code;
                return (
                  <motion.div
                    key={cap.title}
                    variants={fadeUp}
                    whileHover={{ scale: 1.02, y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="liquid-glass glass-shine rounded-xl p-5 cursor-default"
                  >
                    <div
                      className={`w-9 h-9 rounded-lg bg-gradient-to-br ${gradientClasses[cap.gradient]} flex items-center justify-center mb-3 shadow-lg`}
                    >
                      <Icon className="w-4 h-4 text-background" />
                    </div>
                    <h3 className="font-display font-bold text-foreground mb-1 text-sm tracking-tight">
                      {cap.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {cap.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
          </div>
        </section>

        <IdeaGenerator />
      </main>
      <Footer />
    </div>
  );
}
