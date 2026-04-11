import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Code2, Cpu, Smartphone, Monitor, Sparkles, Braces, Bot, Brain, Zap, Database, Flame, Terminal, MessageSquare, Link, Github, Globe, Wand2 } from "lucide-react";
import AnimatedCounter from "@/components/AnimatedCounter";
import workspaceWebp from "@/assets/workspace.webp";
import portraitWebp from "@/assets/portrait.webp";

const stats = [
  { label: "Projects Built", value: "100+" },
  { label: "AI Models Deployed", value: "30+" },
  { label: "Platforms Mastered", value: "19+" },
];

const toolkit = [
  { name: "Google AI Studio", icon: Sparkles },
  { name: "Google Antigravity", icon: Zap },
  { name: "Gemini", icon: Wand2 },
  { name: "xAI", icon: Brain },
  { name: "Anthropic", icon: Bot },
  { name: "Claude Code", icon: Terminal },
  { name: "ChatGPT", icon: MessageSquare },
  { name: "LangChain", icon: Link },
  { name: "Supabase", icon: Database },
  { name: "Firebase", icon: Flame },
  { name: "OpenClaw", icon: Cpu },
  { name: "Goose", icon: Code2 },
  { name: "GitHub", icon: Github },
  { name: "Hostinger", icon: Globe },
  { name: "Lovable", icon: Monitor },
  { name: "Cursor", icon: Code2 },
  { name: "Android Studio", icon: Smartphone },
  { name: "Xcode", icon: Braces },
  { name: "VS Code", icon: Cpu },
];

export default function AboutSection() {
  const workspaceRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: wsProgress } = useScroll({
    target: workspaceRef,
    offset: ["start end", "end start"],
  });
  const { scrollYProgress: ptProgress } = useScroll({
    target: portraitRef,
    offset: ["start end", "end start"],
  });

  const wsY = useTransform(wsProgress, [0, 1], [40, -40]);
  const wsGlowY = useTransform(wsProgress, [0, 1], [20, -20]);
  const ptY = useTransform(ptProgress, [0, 1], [20, -20]);
  const ptScale = useTransform(ptProgress, [0, 1], [1, 1.05]);
  const ptGlowY = useTransform(ptProgress, [0, 1], [10, -10]);

  return (
    <section id="about" className="section-padding border-t border-border">
      <div className="container-narrow">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="mono text-gold mb-4">About</p>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-12 max-w-3xl">
            Building at the intersection of
            <span className="text-gradient"> AI and product.</span>
          </h2>
        </motion.div>

        {/* Main bio grid: workspace image + text */}
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
            ref={workspaceRef}
          >
            <div className="rounded-2xl overflow-hidden border border-border/50">
              <picture>
                <source srcSet={workspaceWebp} type="image/webp" />
                <motion.img
                  src={workspaceWebp}
                  alt="John Mattveyev workspace"
                  className="w-full h-auto object-cover"
                  style={{ y: wsY }}
                  loading="lazy"
                />
              </picture>
            </div>
            {/* Ambient glow behind image */}
            <motion.div className="absolute -inset-8 bg-primary/10 blur-3xl rounded-full -z-10" style={{ y: wsGlowY }} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="space-y-6 text-muted-foreground leading-relaxed"
          >
            <p>
              I'm John Mattveyev — an AI engineer, product builder, and Google AI
              certified professional. I work across the full spectrum of intelligent
              systems: from fine-tuning LLMs and deploying computer vision pipelines
              to building polished, production-grade applications.
            </p>
            <p>
              My journey has been entirely self-directed. No bootcamps, no hand-holding —
              just relentless curiosity and thousands of hours of experimentation. I taught
              myself to code, design, and ship products by building things that solve real
              problems for real people.
            </p>
            <p>
              Every project in my portfolio represents a real problem solved — not
              a tutorial followed. I believe in shipping fast, iterating relentlessly,
              and making AI genuinely useful for people.
            </p>
          </motion.div>
        </div>

        {/* Philosophy row: portrait + quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-16 flex flex-col md:flex-row items-center gap-8"
        >
          <div className="relative shrink-0" ref={portraitRef}>
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden border border-border/50 glass">
              <picture>
                <source srcSet={portraitWebp} type="image/webp" />
                <motion.img
                  src={portraitWebp}
                  alt="John Mattveyev portrait"
                  className="w-full h-full object-cover"
                  style={{ y: ptY, scale: ptScale }}
                  loading="lazy"
                />
              </picture>
            </div>
            <motion.div className="absolute -inset-6 bg-accent/15 blur-2xl rounded-full -z-10" style={{ y: ptGlowY }} />
          </div>
          <blockquote className="text-lg md:text-xl italic text-muted-foreground border-l-2 border-primary/40 pl-6">
            "My approach is rooted in experimentation. I constantly explore what's possible
            at the edge of AI capability — not to follow trends, but to define what comes next."
          </blockquote>
        </motion.div>

        {/* Toolkit grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16"
        >
          <p className="mono text-primary mb-6">Toolkit</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {toolkit.map((tool, i) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.05 * i }}
                className="glass rounded-xl p-4 flex flex-col items-center gap-3 text-center border border-border/30 hover:border-primary/30 transition-colors"
              >
                <tool.icon className="w-6 h-6 text-primary" />
                <span className="text-xs text-muted-foreground">{tool.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-3 gap-8 mt-20 pt-12 border-t border-border"
        >
          {stats.map((s) => (
            <div key={s.label}>
              <AnimatedCounter value={s.value} className="text-3xl md:text-5xl font-bold text-gradient inline-block" />
              <p className="mono text-muted-foreground mt-2">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
