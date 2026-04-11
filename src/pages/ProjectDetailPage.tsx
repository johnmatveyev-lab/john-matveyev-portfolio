import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { PrefetchLink as Link } from "@/components/PrefetchLink";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VoiceAssistant from "@/components/VoiceAssistant";
import { useProject } from "@/hooks/useProjects";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowUpRight, Calendar, CheckCircle2, Github, Sparkles } from "lucide-react";
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
          title={`${project.title} | Case Study | John Matveyev`}
          description={project.summary || `Case study for ${project.title}: ${project.description.slice(0, 150)}...`}
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
              <div className="h-32 bg-card rounded-xl" />
            </div>
          )}

          {!isLoading && !project && (
            <div className="text-center py-20 text-muted-foreground">
              Project not found.
            </div>
          )}

          {project && (
            <div className="space-y-10">
              <section className="grid md:grid-cols-[2fr,1fr] gap-10 items-start">
                <div className="space-y-4">
                  <p className="mono text-primary uppercase tracking-[0.2em] text-[11px]">Case Study</p>
                  <h1 className="text-4xl md:text-5xl font-display font-bold leading-tight">
                    {project.title}
                  </h1>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {project.summary || project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-[11px] px-2 py-1">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90">
                        Launch <ArrowUpRight size={16} />
                      </a>
                    )}
                    {project.repoUrl && (
                      <a href={project.repoUrl} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-foreground hover:border-primary/50">
                        <Github size={16} /> View Code
                      </a>
                    )}
                    <a href={bookingLink} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-foreground hover:border-primary/50">
                      Book a Call
                    </a>
                    <a href={`mailto:${fallbackContact}?subject=Project: ${project.title}`}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-foreground hover:border-primary/50">
                      Email Me
                    </a>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="mono text-xs text-muted-foreground">Timeline</span>
                    <Calendar size={16} className="text-muted-foreground" />
                  </div>
                  <p className="text-lg font-semibold">{project.createdAt}</p>
                  {project.tech && project.tech.length > 0 && (
                    <div>
                      <p className="mono text-[11px] uppercase text-muted-foreground mb-2">Tech Stack</p>
                      <div className="flex flex-wrap gap-2">
                        {project.tech.map((t) => (
                          <span key={t} className="px-2 py-1 rounded bg-secondary text-secondary-foreground text-[11px]">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {heroMetrics.length > 0 && (
                    <div>
                      <p className="mono text-[11px] uppercase text-muted-foreground mb-2">Impact</p>
                      <div className="grid grid-cols-2 gap-3">
                        {heroMetrics.map((m) => (
                          <div key={m.label} className="rounded-lg bg-secondary/40 border border-border px-3 py-2">
                            <p className="mono text-[11px] text-muted-foreground">{m.label}</p>
                            <p className="text-lg font-semibold">{m.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </section>

              <section className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-card border border-border rounded-2xl p-6 space-y-4">
                  <p className="mono text-[11px] uppercase text-muted-foreground">Problem → Solution</p>
                  <p className="text-muted-foreground leading-relaxed">{project.description}</p>
                  {project.outcomes && project.outcomes.length > 0 && (
                    <div className="space-y-2">
                      {project.outcomes.map((o) => (
                        <div key={o} className="flex items-start gap-2 text-sm text-foreground">
                          <CheckCircle2 size={16} className="text-primary mt-0.5" />
                          <span className="text-muted-foreground">{o}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-primary" />
                    <p className="font-semibold">Role</p>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {project.role || "Full-stack / AI engineering"}
                  </p>
                  <div className="space-y-2">
                    <p className="mono text-[11px] uppercase text-muted-foreground">Platform</p>
                    <p className="text-sm">{project.platform}</p>
                  </div>
                  {project.category && (
                    <div className="space-y-2">
                      <p className="mono text-[11px] uppercase text-muted-foreground">Category</p>
                      <p className="text-sm">{project.category}</p>
                    </div>
                  )}
                </div>
              </section>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <VoiceAssistant />
    </div>
  );
}
