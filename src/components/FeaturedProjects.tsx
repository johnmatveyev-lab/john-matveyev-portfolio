import { motion } from "framer-motion";
import { useFeaturedProjects } from "@/hooks/useProjects";
import { ExternalLink, LineChart, Mic, Briefcase, Eye, Globe, Phone, Building2, Video, Wand2 } from "lucide-react";
import { Project } from "@/types/project";
import TiltCard from "@/components/TiltCard";
import { PrefetchLink as Link } from "@/components/PrefetchLink";

const iconMap: Record<string, React.ReactNode> = {
  LineChart: <LineChart className="w-5 h-5" />,
  Mic: <Mic className="w-5 h-5" />,
  Briefcase: <Briefcase className="w-5 h-5" />,
  Eye: <Eye className="w-5 h-5" />,
  Globe: <Globe className="w-5 h-5" />,
  Phone: <Phone className="w-5 h-5" />,
  Building: <Building2 className="w-5 h-5" />,
  Video: <Video className="w-5 h-5" />,
  Wand2: <Wand2 className="w-5 h-5" />,
};

const gradientBorderMap: Record<string, string> = {
  blue: "from-blue-500 to-cyan-400",
  violet: "from-violet-500 to-fuchsia-400",
  emerald: "from-emerald-500 to-teal-400",
  pink: "from-pink-500 to-rose-400",
};

const glowColorMap: Record<string, string> = {
  blue: "hsl(var(--gradient-cyan) / 0.2)",
  violet: "hsl(var(--gradient-violet) / 0.2)",
  emerald: "hsl(var(--gradient-emerald) / 0.2)",
  pink: "hsl(var(--gradient-pink) / 0.2)",
};

// Bento grid: first card spans 2 cols on large screens, others fill
const bentoClass = (index: number, total: number) => {
  if (total >= 9 && (index === 0 || index === 5 || index === 8)) return "md:col-span-2 md:row-span-1";
  if (total < 9 && total >= 4 && (index === 0 || index === 3)) return "md:col-span-2 md:row-span-1";
  return "";
};

function ProjectCard({ project, index, total }: { project: Project; index: number; total: number }) {
  const gradient = project.gradient || "blue";
  const icon = project.iconName ? iconMap[project.iconName] : <LineChart className="w-5 h-5" />;
  const isWide = bentoClass(index, total).includes("col-span-2");
  const detailHref = `/projects/${project.slug || project.id}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.7,
        delay: index * 0.12,
        ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number],
      }}
      className={bentoClass(index, total)}
    >
      <TiltCard
        glowColor={glowColorMap[gradient]}
        className="h-full"
      >
        <article className="relative h-full rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md overflow-hidden transition-colors duration-300 group-hover:border-border">
          {/* Gradient top accent */}
          <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${gradientBorderMap[gradient]} opacity-60`} />

          {/* Noise texture */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.03] z-[1]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundSize: "128px",
            }}
          />

          {/* Project thumbnail image */}
          {project.thumbnailUrl && (
            <div
              className="relative w-full overflow-hidden flex-shrink-0"
              style={{ height: isWide ? "200px" : "160px" }}
            >
              <img
                src={project.thumbnailUrl}
                alt={`${project.title} preview`}
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              {/* Gradient overlay blending image into card background */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-card/95" />
              {/* Subtle colored tint on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${gradientBorderMap[gradient]} opacity-0 group-hover:opacity-15 transition-opacity duration-500`} />
              {/* Live badge */}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${project.title} live site`}
                  className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-background/80 backdrop-blur-sm border border-border/60 text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200 shadow-md z-10"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live <ExternalLink className="w-2.5 h-2.5" />
                </a>
              )}
            </div>
          )}

          <Link to={detailHref} className={`relative p-6 block ${isWide ? "md:p-8 md:flex md:items-start md:gap-8" : "md:p-7"}`}>
            <div className={isWide ? "md:flex-1" : ""}>
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${gradientBorderMap[gradient]} text-foreground`}>
                  {icon}
                </div>
                {!project.thumbnailUrl && project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View ${project.title} live site`}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Live <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              {/* Content */}
              <h3 className="text-lg font-display font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                {project.title}
              </h3>
              {project.role && (
                <p className="text-xs text-gold font-medium mb-3">{project.role}</p>
              )}
              <p className={`text-sm text-muted-foreground leading-relaxed mb-5 ${isWide ? "" : "line-clamp-3"}`}>
                {project.description}
              </p>
            </div>

            {/* Tech Stack */}
            {project.tech && project.tech.length > 0 && (
              <div className={`flex flex-wrap gap-1.5 ${isWide ? "md:max-w-[200px] md:mt-12" : ""}`}>
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-secondary/60 text-muted-foreground border border-border/50"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </Link>
        </article>
      </TiltCard>
    </motion.div>
  );
}

export default function FeaturedProjects() {
  const { data: featured = [], isLoading } = useFeaturedProjects();

  return (
    <section id="featured" className="section-padding border-t border-border">
      <div className="container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="mono text-gold mb-4">Featured Work</p>
          <h2 className="text-3xl md:text-5xl font-display font-bold">
            Production AI Applications
          </h2>
        </motion.div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-64 rounded-2xl border border-border bg-card animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {featured.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} total={featured.length} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
