import { Project } from "@/types/project";
import { motion } from "framer-motion";
import { ArrowUpRight, Github } from "lucide-react";
import { PrefetchLink } from "./PrefetchLink";
import { memo, MouseEvent } from "react";

const ProjectCard = memo(function ProjectCard({ project, index = 0 }: { project: Project; index?: number }) {
  const detailHref = `/projects/${project.slug || project.id}`;

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.4, 0.25, 1] }}
      onMouseMove={handleMouseMove}
      className={`group relative bg-card/60 backdrop-blur-md rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-500 hover:shadow-2xl hover:shadow-[hsl(var(--primary))/0.15] border-2 border-transparent`}
    >
      {/* Spotlight overlay effect */}
      <div className="pointer-events-none absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(600px_circle_at_var(--mouse-x)_var(--mouse-y),rgba(255,255,255,0.06),transparent_40%)]" />

      {/* Glowing border overlay */}
      <div className="pointer-events-none absolute inset-0 z-0 border-2 rounded-2xl border-[hsl(var(--primary))/0.5] opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-[0_0_15px_hsl(var(--primary)/0.5)]" />

      {/* Main Container */}
      <div className="block h-full relative z-10">
        
        {/* Absolute link to make whole card clickable */}
        <PrefetchLink to={detailHref} className="absolute inset-0 z-30">
          <span className="sr-only">View project details</span>
        </PrefetchLink>
        
        {/* Thumbnail or placeholder */}
        {project.thumbnailUrl ? (
          <div className="aspect-video w-full overflow-hidden bg-secondary relative">
            <img 
              src={project.thumbnailUrl} 
              alt={project.title} 
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
            />
            {/* Gradient overlay inside image area */}
             <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent pointer-events-none" />
          </div>
        ) : (
          <div className="aspect-video bg-secondary flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
            <span className="mono text-muted-foreground text-xs">{project.platform}</span>
          </div>
        )}

        <div className="p-6 relative z-30">
          <div className="flex items-start justify-between gap-4 mb-3">
            <h3 className="font-semibold text-xl tracking-tight text-foreground group-hover:text-primary transition-colors">
              {project.title}
            </h3>
            <div className="flex gap-2 shrink-0 relative z-40">
              {project.repoUrl && (
                <a href={project.repoUrl} aria-label={`View ${project.title} GitHub Repository`} target="_blank" rel="noopener noreferrer" className="relative z-40 text-muted-foreground hover:text-foreground transition-colors p-2 -m-2 opacity-0 group-hover:opacity-100 block" onClick={(e) => e.stopPropagation()}>
                  <Github size={16} />
                </a>
              )}
              {project.liveUrl && (
                <a href={project.liveUrl} aria-label={`View ${project.title} live project`} target="_blank" rel="noopener noreferrer" className="relative z-40 text-background hover:text-primary-foreground bg-primary/80 hover:bg-primary transition-all p-2 -m-2 rounded-full opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100" onClick={(e) => e.stopPropagation()}>
                  <ArrowUpRight size={16} />
                </a>
              )}
            </div>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed mb-6 line-clamp-2">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="mono text-[10px] px-2 py-1 rounded bg-secondary/50 text-secondary-foreground border border-border/50 group-hover:border-primary/20 transition-colors"
              >
                {tag}
              </span>
            ))}
            {project.tags.length > 3 && (
              <span className="mono text-[10px] px-2 py-1 rounded bg-secondary/30 text-muted-foreground">
                +{project.tags.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
});

export default ProjectCard;
