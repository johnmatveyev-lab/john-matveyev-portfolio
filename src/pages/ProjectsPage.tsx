import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectCard";
import VoiceAssistant from "@/components/VoiceAssistant";
import { useProjects } from "@/hooks/useProjects";
import { TAG_OPTIONS, PLATFORMS } from "@/types/project";
import { useSearchParams } from "react-router-dom";
import { SEO } from "@/components/SEO";

export default function ProjectsPage() {
  const { data: projects = [], isLoading } = useProjects();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [sort, setSort] = useState<"newest" | "oldest">("newest");

  useEffect(() => {
    const searchParam = searchParams.get("q") || "";
    const tagParam = searchParams.get("tag");
    const platformParam = searchParams.get("platform");
    const sortParam = (searchParams.get("sort") as "newest" | "oldest") || "newest";
    setSearch(searchParam);
    setSelectedTag(tagParam || null);
    setSelectedPlatform(platformParam || null);
    setSort(sortParam);
  }, [searchParams]);

  useEffect(() => {
    const params: Record<string, string> = {};
    if (search) params.q = search;
    if (selectedTag) params.tag = selectedTag;
    if (selectedPlatform) params.platform = selectedPlatform;
    if (sort !== "newest") params.sort = sort;
    setSearchParams(params, { replace: true });
  }, [search, selectedTag, selectedPlatform, sort, setSearchParams]);

  const filtered = useMemo(() => {
    const base = projects.filter((p) => {
      const matchesSearch =
        !search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      const matchesTag = !selectedTag || p.tags.includes(selectedTag);
      const matchesPlatform = !selectedPlatform || p.platform === selectedPlatform;
      return matchesSearch && matchesTag && matchesPlatform;
    });
    return base.sort((a, b) => {
      if (sort === "oldest") return a.createdAt.localeCompare(b.createdAt);
      return b.createdAt.localeCompare(a.createdAt);
    });
  }, [projects, search, selectedTag, selectedPlatform, sort]);

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Projects | John Matveyev" 
        description="A growing collection of AI experiments, products, and tools — each one a real solution shipped." 
        canonical="/projects"
      />
      <Navbar />
      <main id="main-content" className="section-padding pt-32">
        <div className="container-narrow">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="mono text-primary mb-4">Projects</p>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">All builds</h1>
            <p className="text-muted-foreground text-lg mb-12 max-w-xl">
              A growing collection of AI experiments, products, and tools — each one a real solution shipped.
            </p>
          </motion.div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-10">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search projects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <select
                value={selectedTag || ""}
                onChange={(e) => setSelectedTag(e.target.value || null)}
                className="bg-card border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50"
              >
                <option value="">All Tags</option>
                {TAG_OPTIONS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <select
                value={selectedPlatform || ""}
                onChange={(e) => setSelectedPlatform(e.target.value || null)}
                className="bg-card border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50"
              >
                <option value="">All Platforms</option>
                {PLATFORMS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as any)}
                className="bg-card border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
              </select>
            </div>
          </div>

          <p className="mono text-muted-foreground mb-6">{filtered.length} projects</p>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-52 bg-card border border-border rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((project, i) => (
                  <ProjectCard key={project.id} project={project} index={i} />
                ))}
              </div>

              {filtered.length === 0 && (
                <div className="text-center py-20 text-muted-foreground">
                  No projects match your filters.
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
      <VoiceAssistant />
    </div>
  );
}
