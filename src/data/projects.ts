import { supabase } from "@/integrations/supabase/client";
import { TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { Project, ProjectMetric } from "@/types/project";

const defaultProjects: Project[] = [
  {
    id: "8d35b5a9-1a5a-4a50-9b9a-027e6e2b2a01",
    title: "QuantumEarth",
    slug: "quantumearth",
    description: "Interactive geospatial platform combining quantum computing concepts with earth observation data for advanced environmental analysis and visualization.",
    tags: ["Web App", "Data", "Full Stack"],
    liveUrl: "https://quantumearth.lovable.app",
    thumbnailUrl: "/projects/quantumearth.png",
    platform: "Lovable",
    createdAt: "2026-03-10",
    featured: true,
    role: "Geospatial Intelligence Platform",
    tech: ["React", "Lovable", "Geospatial APIs"],
    gradient: "blue",
    iconName: "Globe",
    outcomes: ["Cut exploration time for analysts by ~40%", "Unified satellite, sensor, and quantum-sim outputs in one pane"],
    metrics: [
      { label: "Data layers", value: "75+" },
      { label: "Latency", value: "<400ms tiles" },
    ],
  },
  {
    id: "4f4b6c2b-9040-4c96-9ef0-04a5b4b32402",
    title: "AIM8.io",
    slug: "aim8-io",
    description: "Multi-modal AI music co-producer. Handles asynchronous media files, Web Audio API playback, and complex AI prompt orchestration.",
    tags: ["AI/ML", "Web App", "SaaS"],
    liveUrl: "https://aim8.io",
    thumbnailUrl: "/projects/aim8.png",
    platform: "React",
    createdAt: "2026-01-20",
    featured: true,
    role: "Generative Audio Workspace",
    tech: ["React", "FastAPI", "Web Audio API", "Kie.ai"],
    gradient: "violet",
    iconName: "Mic",
    outcomes: ["Reduced concept-to-hook time from hours to minutes", "Async stem uploads with live waveform previews"],
  },
  {
    id: "5e7a7b31-8dbf-4fd3-9e49-bd9f4e1b6f03",
    title: "PrettyPrivilegeAI",
    slug: "prettyprivilegeai",
    description: "Aesthetic assessment tool utilizing facial mapping and vision models to return structured visual data, feedback, and SaaS billing.",
    tags: ["Computer Vision", "SaaS", "AI/ML"],
    liveUrl: "https://prettyprivilegeai.com",
    thumbnailUrl: "/projects/prettyprivilegeai.png",
    platform: "React",
    createdAt: "2026-03-01",
    featured: true,
    role: "Computer Vision SaaS",
    tech: ["React", "Node.js", "Vision API", "Stripe"],
    gradient: "pink",
    iconName: "Eye",
  },
  {
    id: "27b0f6a2-2b6d-4a61-8cdb-85c06759d404",
    title: "SpeakGenie",
    slug: "speakgenie",
    description: "Conversational AI telecom platform for deploying autonomous inbound/outbound voice agents with sub-second latency.",
    tags: ["Real-Time", "Telecom", "AI/ML"],
    liveUrl: "https://speakgenie.lovable.app",
    thumbnailUrl: "/projects/speakgenie.png",
    platform: "Lovable",
    createdAt: "2025-11-05",
    featured: true,
    role: "Real-Time Telecom AI",
    tech: ["Edge Functions", "Twilio WebSockets", "LLaMA 3"],
    gradient: "emerald",
    iconName: "Phone",
    metrics: [
      { label: "Avg latency", value: "540ms" },
      { label: "Throughput", value: "200+ concurrent calls" },
    ],
  },
  {
    id: "c0b8c4d7-5e0a-4e7c-8d54-4fcbce3b9505",
    title: "Blue Ridge Nano Seal",
    slug: "blue-ridge-nano-seal",
    description: "Full-stack operational hub with RBAC dashboards, automated CRM pipelines, mapping routing, and affiliate tracking.",
    tags: ["Enterprise", "Full Stack", "Automation"],
    liveUrl: "https://blueridgenanoseal.com",
    thumbnailUrl: "/projects/blueridgenanoseal.png",
    platform: "React",
    createdAt: "2025-10-18",
    featured: true,
    role: "Enterprise Operations Hub",
    tech: ["Firebase Auth/DB", "Stripe Connect", "Google Maps"],
    gradient: "blue",
    iconName: "Building",
  },
  {
    id: "d40fcb40-7b58-45f1-9c8a-3d6c0b07a406",
    title: "AIM8 Video",
    slug: "aim8-video",
    description: "AI-powered music visualizer generator that creates stunning animated videos synced to audio tracks, perfect for artists and producers.",
    tags: ["AI/ML", "Web App", "SaaS"],
    liveUrl: "https://aim8-video.lovable.app",
    thumbnailUrl: "/projects/aim8video.png",
    platform: "Lovable",
    createdAt: "2026-03-08",
    featured: true,
    role: "Creative Media Tools",
    tech: ["React", "Web Audio API", "Canvas", "Lovable"],
    gradient: "violet",
    iconName: "Video",
  },
  {
    id: "93e1ccee-65e5-48b9-9578-0d2b0555a507",
    title: "CurriGigAnalyzer",
    slug: "currigiganalyzer",
    description: "AI-driven logistics and financial analytics dashboard. Parses unstructured user data to optimize routes and track expenses for gig workers.",
    tags: ["Full Stack", "Data", "AI/ML"],
    liveUrl: "https://currigiganalyzer.com",
    thumbnailUrl: "/projects/currigiganalyzer.png",
    platform: "Next.js",
    createdAt: "2025-12-15",
    featured: true,
    role: "Full-Stack Data & Analytics",
    tech: ["Next.js", "Node.js", "PostgreSQL", "Gemini API"],
    gradient: "blue",
    iconName: "LineChart",
  },
  {
    id: "8c6bf6e5-9b7f-4d1c-9dc9-bdb2e2c4a508",
    title: "WholesaleAutomated",
    slug: "wholesaleautomated",
    description: "Automated real estate deal evaluator chaining property data APIs with LLMs to score investments and generate outreach scripts.",
    tags: ["Automation", "LLM", "API"],
    liveUrl: "https://wholesaleautomated.com",
    thumbnailUrl: "/projects/wholesaleautomated.png",
    platform: "Next.js",
    createdAt: "2026-02-10",
    featured: true,
    role: "B2B Automation Engine",
    tech: ["Next.js", "MongoDB", "Data APIs", "Claude 3"],
    gradient: "emerald",
    iconName: "Briefcase",
  },
  {
    id: "5f2ab7c3-9c89-4af7-9345-a8a3a5f7e509",
    title: "CreatedSpace AI",
    slug: "createdspace-ai",
    description: "Master API routing system orchestrating generation of text, images, video, and voice cloning under one unified frontend.",
    tags: ["AI/ML", "API", "Full Stack"],
    liveUrl: "https://createdspaceai.vercel.app",
    thumbnailUrl: "/projects/createdspaceai.png",
    platform: "Vercel",
    createdAt: "2025-09-22",
    featured: true,
    role: "Omnichannel Media Hub",
    tech: ["Vercel Architecture", "ElevenLabs", "Replicate"],
    gradient: "pink",
    iconName: "Wand2",
  },
];

const mapRowToProject = (row: TablesInsert<"projects"> & { id: string }): Project => {
  const metrics = Array.isArray(row.metrics) ? (row.metrics as ProjectMetric[]) : [];
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    tags: row.tags ?? [],
    repoUrl: row.repo_url || undefined,
    liveUrl: row.live_url || undefined,
    platform: row.platform,
    thumbnailUrl: row.thumbnail_url || undefined,
    createdAt: row.created_at ? row.created_at.slice(0, 10) : new Date().toISOString().split("T")[0],
    featured: !!row.featured,
    role: row.role || undefined,
    tech: row.tech || [],
    gradient: (row.gradient as Project["gradient"]) || "blue",
    category: row.category || undefined,
    iconName: row.icon_name || undefined,
    slug: row.slug || undefined,
    summary: row.summary || undefined,
    outcomes: row.outcomes || undefined,
    metrics,
    heroImageUrl: row.hero_image_url || undefined,
  };
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

export async function getProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("Falling back to default projects:", error?.message);
    return defaultProjects;
  }

  if (data.length === 0) return defaultProjects;
  return data.map((row) => mapRowToProject(row as any));
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const projects = await getProjects();
  return projects.filter((p) => p.featured);
}

export async function getProjectByIdOrSlug(idOrSlug: string): Promise<Project | undefined> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`)
    .limit(1)
    .maybeSingle();

  if (error) {
    const fallback = defaultProjects.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
    return fallback;
  }
  if (!data) return undefined;
  return mapRowToProject(data as any);
}

function getAdminPassword(override?: string) {
  if (override) return override;
  if (typeof window !== "undefined") {
    return sessionStorage.getItem("jm_admin_pw") || "";
  }
  return "";
}

export async function addProject(project: Omit<Project, "id">, adminPassword?: string) {
  const pw = getAdminPassword(adminPassword);
  const payload: TablesInsert<"projects"> = {
    title: project.title,
    description: project.description,
    tags: project.tags,
    repo_url: project.repoUrl,
    live_url: project.liveUrl,
    platform: project.platform,
    thumbnail_url: project.thumbnailUrl,
    created_at: project.createdAt,
    featured: project.featured,
    role: project.role,
    tech: project.tech,
    gradient: project.gradient,
    category: project.category,
    icon_name: project.iconName,
    slug: project.slug || slugify(project.title),
    summary: project.summary,
    outcomes: project.outcomes,
    metrics: project.metrics,
    hero_image_url: project.heroImageUrl,
  };

  const { data, error } = await supabase.functions.invoke(
    "admin-submissions?resource=projects",
    {
      method: "POST",
      headers: { "x-admin-password": pw },
      body: payload,
    },
  );

  if (error) throw error;
  return mapRowToProject(data as any);
}

export async function updateProject(id: string, updates: Partial<Project>, adminPassword?: string) {
  const pw = getAdminPassword(adminPassword);
  const rawPayload: TablesUpdate<"projects"> = {
    title: updates.title,
    description: updates.description,
    tags: updates.tags,
    repo_url: updates.repoUrl,
    live_url: updates.liveUrl,
    platform: updates.platform,
    thumbnail_url: updates.thumbnailUrl,
    created_at: updates.createdAt,
    featured: updates.featured,
    role: updates.role,
    tech: updates.tech,
    gradient: updates.gradient,
    category: updates.category,
    icon_name: updates.iconName,
    slug: updates.slug,
    summary: updates.summary,
    outcomes: updates.outcomes,
    metrics: updates.metrics,
    hero_image_url: updates.heroImageUrl,
  };
  const payload = Object.fromEntries(
    Object.entries(rawPayload).filter(([, value]) => value !== undefined)
  ) as TablesUpdate<"projects">;

  const { data, error } = await supabase.functions.invoke(
    "admin-submissions?resource=projects",
    {
      method: "PATCH",
      headers: { "x-admin-password": pw },
      body: { id, ...payload },
    },
  );
  if (error) throw error;
  return mapRowToProject(data as any);
}

export async function deleteProject(id: string, adminPassword?: string) {
  const pw = getAdminPassword(adminPassword);
  const { error } = await supabase.functions.invoke(
    "admin-submissions?resource=projects",
    {
      method: "DELETE",
      headers: { "x-admin-password": pw },
      body: { id },
    },
  );
  if (error) throw error;
}
