import { Project } from "@/types/project";
import { motion } from "framer-motion";
import { ArrowUpRight, Github } from "lucide-react";
import { Link } from "react-router-dom";
import { PrefetchLink } from "./PrefetchLink";
import { memo } from "react";

const ProjectCard = memo(function ProjectCard({ project, index = 0 }: { project: Project; index?: number }) {
  const detailHref = `/projects/${project.slug || project.id}`;
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.4, 0.25, 1] }}
      className="group relative bg-card border border-border rounded-lg overflow-hidden hover-lift"
    >
      <div className="block">
        {/* Absolute link to make whole card clickable */}
        <PrefetchLink to={detailHref} className="absolute inset-0 z-10">
          <span className="sr-only">View project details</span>
        </PrefetchLink>
        {/* Thumbnail placeholder */}
        <div className="aspect-video bg-secondary flex items-center justify-center">
          <span className="mono text-muted-foreground text-xs">{project.platform}</span>
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between gap-4 mb-3">
            <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
              {project.title}
            </h3>
            <div className="flex gap-2 shrink-0">
              {project.repoUrl && (
                <a href={project.repoUrl} aria-label={`View ${project.title} GitHub Repository`} target="_blank" rel="noopener noreferrer" className="relative z-20 text-muted-foreground hover:text-foreground transition-colors p-2 -m-2" onClick={(e) => e.stopPropagation()}>
                  <Github size={16} />
                </a>
              )}
              {project.liveUrl && (
                <a href={project.liveUrl} aria-label={`View ${project.title} live project`} target="_blank" rel="noopener noreferrer" className="relative z-20 text-muted-foreground hover:text-primary transition-colors p-2 -m-2" onClick={(e) => e.stopPropagation()}>
                  <ArrowUpRight size={16} />
                </a>
              )}
            </div>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="mono text-[10px] px-2 py-1 rounded bg-secondary text-secondary-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  );
});

export default ProjectCard;
