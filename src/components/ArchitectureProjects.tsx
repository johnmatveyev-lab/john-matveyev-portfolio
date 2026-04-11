import { motion } from "framer-motion";
import { getArchitectureProjects } from "@/data/projects";
import { ArrowUpRight } from "lucide-react";
import TiltCard from "@/components/TiltCard";

export default function ArchitectureProjects() {
  const projects = getArchitectureProjects();

  if (projects.length === 0) return null;

  return (
    <section id="architecture" className="section-padding border-t border-border">
      <div className="container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="mono text-gold mb-4">Complex Systems</p>
          <h2 className="text-3xl md:text-5xl font-display font-bold">
            Enterprise & Telephony Architecture
          </h2>
        </motion.div>

        <div className="space-y-4">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.6,
                delay: index * 0.15,
                ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number],
              }}
            >
              <TiltCard glowColor="hsl(var(--primary) / 0.12)">
                <article className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md transition-colors duration-300 group-hover:border-border">
                  <div className="mb-4 md:mb-0">
                    {project.category && (
                      <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-medium bg-primary/10 text-primary border border-primary/20 mb-2">
                        {project.category}
                      </span>
                    )}
                    <h3 className="text-lg font-display font-bold text-foreground group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Visit ${project.title} website`}
                        className="text-xs text-muted-foreground hover:text-primary transition-colors"
                      >
                        {project.liveUrl.replace("https://", "")}
                      </a>
                    )}
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
                      {project.description}
                    </p>
                    <div className="flex items-center gap-4 shrink-0">
                      {project.tech && (
                        <div className="hidden lg:flex items-center gap-2 text-xs text-muted-foreground">
                          {project.tech.map((t, i) => (
                            <span key={t}>
                              {t}
                              {i !== project.tech!.length - 1 && (
                                <span className="mx-1.5 text-border">•</span>
                              )}
                            </span>
                          ))}
                        </div>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Open ${project.title} in new tab`}
                          className="p-2 rounded-lg border border-border hover:border-primary hover:text-primary transition-colors"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
