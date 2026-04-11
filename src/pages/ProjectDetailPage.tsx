import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { PrefetchLink as Link } from "@/components/PrefetchLink";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VoiceAssistant from "@/components/VoiceAssistant";
import ArchitectureView from "@/components/ArchitectureView";
import { useProject } from "@/hooks/useProjects";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowUpRight, Calendar, CheckCircle2, Github, Sparkles, AlertCircle, Wrench } from "lucide-react";
import { SEO } from "@/components/SEO";

const fallbackContact = "contact@matveyev.ai";
const bookingLink = import.meta.env.VITE_BOOKING_LINK || "https://cal.com/your-handle/intro";

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: project, isLoading } = useProject(id);

  const heroMetrics = useMemo(() => project?.metrics || [], [project]);

  return (
    <div className="min-h-screen bg-background">
      {project && (
        <SEO 
          title={`${project.title} | Technical Architecture | John Matveyev`}
          description={project.summary || `Principal engineering case study for ${project.title}: ${project.description.slice(0, 150)}...`}
          canonical={`/projects/${project.id}`}
        />
      )}
      <Navbar />
      <main id="main-content" className="section-padding pt-28">
        <div className="container-narrow">
          <Link to="/projects" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
            <ArrowLeft size={14} /> Back to projects
          </Link>

          {isLoading && (
            <div className="space-y-6 animate-pulse">
              <div className="h-10 w-1/2 bg-card rounded-lg" />
              <div className="h-6 w-1/3 bg-card rounded-lg" />
              <div className="h-48 bg-card rounded-xl" />
            </div>
          )}

          {!isLoading && !project && (
            <div className="text-center py-20 text-muted-foreground">
              Project not found.
            </div>
          )}

          {project && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-12"
            >
              {/* Hero Section */}
              <section className="grid lg:grid-cols-[2fr,1fr] gap-10 items-start">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <p className="mono text-primary uppercase tracking-[0.2em] text-[11px]">Technical Case Study</p>
                    <h1 className="text-4xl md:text-5xl font-display font-bold leading-tight">
                      {project.title}
                    </h1>
                  </div>
                  
                  <p className="text-muted-foreground text-xl leading-relaxed font-medium">
                    {project.summary || project.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-[11px] px-2 py-1 bg-secondary/50">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-3 pt-4">
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-all hover:scale-105 shadow-lg shadow-primary/20">
                        Launch Project <ArrowUpRight size={18} />
                      </a>
                    )}
                    {project.repoUrl && (
                      <a href={project.repoUrl} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border bg-card/50 text-foreground hover:border-primary/50 transition-all">
                        <Github size={18} /> View Source
                      </a>
                    )}
                  </div>
                </div>

                <div className="bg-card border border-border/60 rounded-2xl p-6 space-y-6 backdrop-blur-sm">
                  <div className="flex items-center justify-between pb-4 border-b border-border/50">
                    <span className="mono text-xs text-muted-foreground uppercase tracking-widest">Metadata</span>
                    <Sparkles size={16} className="text-gold" />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="mono text-[11px] uppercase text-muted-foreground mb-2">Role</p>
                      <p className="text-sm font-bold text-foreground">{project.role || "Principal Architect"}</p>
                    </div>

                    {project.tech && project.tech.length > 0 && (
                      <div>
                        <p className="mono text-[11px] uppercase text-muted-foreground mb-2">Technical Core</p>
                        <div className="flex flex-wrap gap-1.5">
                          {project.tech.map((t) => (
                            <span key={t} className="px-2 py-0.5 rounded-md bg-secondary/80 text-foreground text-[10px] font-bold border border-border/50">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {heroMetrics.length > 0 && (
                      <div>
                        <p className="mono text-[11px] uppercase text-muted-foreground mb-2">Impact Analytics</p>
                        <div className="grid grid-cols-2 gap-3">
                          {heroMetrics.map((m) => (
                            <div key={m.label} className="rounded-xl bg-primary/5 border border-primary/10 px-3 py-3">
                              <p className="mono text-[9px] text-muted-foreground uppercase">{m.label}</p>
                              <p className="text-lg font-bold text-primary">{m.value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* Technical Breakdown */}
              <section className="grid md:grid-cols-5 gap-10">
                <div className="md:col-span-3 space-y-10">
                  <div className="space-y-4">
                    <h3 className="text-2xl font-display font-bold flex items-center gap-2">
                       Architecture 
                    </h3>
                    {project.architectureDiagram ? (
                      <ArchitectureView definition={project.architectureDiagram} />
                    ) : (
                      <div className="h-48 rounded-xl border border-dashed border-border flex items-center justify-center text-muted-foreground">
                        Diagram unavailable
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-2xl font-display font-bold">The Challenge</h3>
                    <p className="text-muted-foreground leading-relaxed text-lg">
                      {project.description}
                    </p>
                    
                    {project.technicalChallenges && project.technicalChallenges.length > 0 && (
                      <div className="grid gap-4">
                        {project.technicalChallenges.map((challenge, i) => (
                          <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-border/40 bg-card/20 hover:border-primary/30 transition-colors">
                            <div className="p-1.5 rounded-lg bg-primary/10 text-primary mt-1">
                              <AlertCircle size={14} />
                            </div>
                            <span className="text-sm text-muted-foreground leading-relaxed italic">
                              "{challenge}"
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="md:col-span-2 space-y-8">
                  <div className="bg-card border border-border/60 rounded-2xl p-6 space-y-6">
                    <h3 className="text-xl font-display font-bold flex items-center gap-2">
                      <CheckCircle2 size={20} className="text-emerald-500" /> Outcomes
                    </h3>
                    <div className="space-y-4">
                      {project.outcomes && project.outcomes.length > 0 ? project.outcomes.map((o) => (
                        <div key={o} className="flex items-start gap-3">
                          <CheckCircle2 size={16} className="text-emerald-500 mt-1 shrink-0" />
                          <span className="text-sm text-foreground leading-relaxed font-medium">{o}</span>
                        </div>
                      )) : (
                        <p className="text-sm text-muted-foreground">Detailed outcomes for this implementation focus on performance and enterprise scaling.</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20 rounded-2xl p-6 space-y-4">
                     <h4 className="font-bold flex items-center gap-2">
                       <Wrench size={18} className="text-primary" /> Want to see the spec?
                     </h4>
                     <p className="text-xs text-muted-foreground leading-relaxed">
                       I'm happy to walk through the technical specifications and code for this project in a scheduled session.
                     </p>
                     <a href={bookingLink} target="_blank" rel="noopener noreferrer" className="block text-center w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-md hover:scale-105 transition-transform">
                       Schedule Technical Sync
                     </a>
                  </div>
                </div>
              </section>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
      <VoiceAssistant />
    </div>
  );
}
