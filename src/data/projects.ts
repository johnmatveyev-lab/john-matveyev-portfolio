import { supabase } from "@/integrations/supabase/client";
import { TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { Project, ProjectMetric } from "@/types/project";

const defaultProjects: Project[] = [
  {
    id: "aim8",
    title: "AIM8.io",
    slug: "aim8",
    liveUrl: "https://aim8.io",
    description: "Developing a cloud-native Virtual Studio Environment (VSE) capable of real-time multi-track audio generation via low-latency AI orchestration. Redefining professional music production workflows.",
    summary: "The first professional-grade AI DAW (Digital Audio Workstation) providing composer-level orchestration at the speed of thought.",
    thumbnailUrl: "/projects/aim8.png",
    platform: "Google AI Studio",
    createdAt: "2024-02-15",
    featured: true,
    category: "Generative Audio",
    role: "Founding Engineer",
    gradient: "violet",
    iconName: "Mic",
    tech: ["PyTorch", "AudioWorklets", "Next.js", "Redis"],
    tags: ["Generative AI", "Real-Time", "SaaS"],
    metrics: [
      { label: "Audio Latency", value: "12ms" },
      { label: "Export Speed", value: "10x Realtime" }
    ],
    outcomes: [
      "Won 'Innovation in Music Tech' regional award 2024.",
      "Successfully scaled to 5,000+ waitlist signups in month one."
    ],
    architectureDiagram: `graph LR
      User[User Interface] -->|WebSocket| Orchestrator[Audio Orchestrator]
      Orchestrator -->|Jobs| GPU[ML Worker Clusters]
      GPU -->|Stream| S3[Object Storage]
      Orchestrator -->|Sync| Client[AudioWorklet Engine]`,
    technicalChallenges: [
      "Synchronizing AI-generated MIDI with multi-track PCM playback.",
      "Scaling WebSocket infrastructure to support 1k sub-20ms concurrent streams."
    ]
  },
  {
    id: "quantumearth",
    title: "QuantumEarth",
    slug: "quantumearth",
    liveUrl: "https://quantumearth.lovable.app",
    description: "Architected a high-fidelity geospatial intelligence platform leveraging decentralized compute to visualize real-time environmental data at planetary scale. Optimized LCP by 40% through custom tile-loading algorithms.",
    summary: "A next-generation environmental monitoring hub utilizing distributed AI to predict climate patterns with unprecedented precision.",
    thumbnailUrl: "/projects/quantumearth.png",
    platform: "Vercel",
    createdAt: "2024-03-10",
    featured: true,
    category: "AI Geospatial",
    role: "Lead Architect",
    gradient: "emerald",
    iconName: "Globe",
    tech: ["Three.js", "WebWorkers", "Go", "TensorFlow.js"],
    tags: ["AI/ML", "Real-Time", "Data"],
    metrics: [
      { label: "Data Throughput", value: "2.4GB/s" },
      { label: "Viz Latency", value: "<150ms" }
    ],
    outcomes: [
      "Secured 3 Enterprise pilots within first 60 days of beta.",
      "Reduced server-side rendering costs by 65% via client-side edge compute."
    ],
    architectureDiagram: `graph TD
      A[Data Sources] --> B[Edge Adapters]
      B --> C{Distributed Processing}
      C --> D[Vector Tiles]
      C --> E[ML Analysis]
      D --> F[Three.js Frontend]
      E --> F`,
    technicalChallenges: [
      "Handling 10M+ concurrent data points without UI thread blocking.",
      "Real-time coordinate transformation between non-spherical projections."
    ]
  },
  {
    id: "createvibe",
    title: "CreateVibe",
    slug: "createvibe",
    liveUrl: "https://createdspaceai.vercel.app",
    description: "Full-scale generative media production platform orchestrating voice cloning, video synthesis, and text-to-image pipelines under unified auth.",
    thumbnailUrl: "/projects/createdspaceai.png",
    platform: "Vercel",
    createdAt: "2023-09-22",
    featured: true,
    role: "Founding Engineer",
    tech: ["Vercel Architecture", "ElevenLabs", "Replicate"],
    gradient: "pink",
    iconName: "Wand2",
    tags: ["AI/ML", "API", "Full Stack"]
  },
  {
    id: "prettyprivilegeai",
    title: "PrettyPrivilege AI",
    slug: "prettyprivilegeai",
    liveUrl: "https://prettyprivilegeai.com",
    description: "Engineered a sophisticated Computer Vision pipeline utilizing Deep Metrics to deconstruct aesthetic patterns for brand strategy. Focus on bias-mitigation and high-accuracy detection.",
    summary: "Visual perception AI that analyzes the psychological impact of brand imagery on target demographics.",
    thumbnailUrl: "/projects/prettyprivilegeai.png",
    platform: "Vercel",
    createdAt: "2024-01-20",
    featured: true,
    category: "Computer Vision",
    role: "Principal ML Engineer",
    gradient: "pink",
    iconName: "Eye",
    tech: ["FastAPI", "OpenCV", "Vue.js", "Azure AI"],
    tags: ["AI/ML", "Computer Vision", "Analytics"],
    metrics: [
      { label: "Inference Time", value: "320ms" },
      { label: "Accuracy", value: "98.4%" }
    ],
    outcomes: [
      "Acquired by Marketing Analytics firm (Confidential).",
      "Process optimized for 1/10th the cost of commercial vision APIs."
    ],
    architectureDiagram: `sequenceDiagram
      Client->>API: Upload Image
      API->>Preprocessor: Normalization & Alignment
      Preprocessor->>Inference: Geometric Deep Learning
      Inference->>BiasCheck: Ethical Filter
      BiasCheck->>API: Result Set
      API->>Client: Analytics Dashboard`,
    technicalChallenges: [
      "Reducing algorithmic bias via custom dataset weighting.",
      "Maintaining high frame-rate analysis in browser-based mobile environments."
    ]
  },
  {
    id: "blueridgenanoseal",
    title: "Blue Ridge Nano Seal",
    slug: "blue-ridge-nano-seal",
    liveUrl: "https://blueridgenanoseal.com",
    description: "Developed a mission-critical operations hub with automated CRM pipelines and RBAC dashboards for field service enterprise management.",
    thumbnailUrl: "/projects/blueridgenanoseal.png",
    platform: "React",
    createdAt: "2023-10-18",
    featured: true,
    role: "Enterprise Systems Lead",
    tech: ["Firebase Auth/DB", "Stripe Connect", "Google Maps"],
    gradient: "blue",
    iconName: "Building",
    tags: ["Enterprise", "Full Stack", "Automation"]
  },
  {
    id: "speakgenie",
    title: "SpeakGenie",
    slug: "speakgenie",
    liveUrl: "https://speakgenie.lovable.app",
    description: "Built a mission-critical telecom intelligence platform that provides real-time sentiment analysis and predictive escalation for enterprise call centers.",
    summary: "Real-time voice intelligence that identifies customer churn signals before the call ends.",
    thumbnailUrl: "/projects/speakgenie.png",
    platform: "Vercel",
    createdAt: "2023-11-05",
    featured: true,
    category: "Natural Language AI",
    role: "Systems Architect",
    gradient: "blue",
    iconName: "Phone",
    tech: ["Twilio", "Gemini Pro", "PostgreSQL", "Node.js"],
    tags: ["NLP", "Telecom", "Enterprise"],
    metrics: [
      { label: "Call Capacity", value: "10k/hr" },
      { label: "Sentiment Accuracy", value: "94%" }
    ],
    outcomes: [
      "Reduced support ticket handle time by 22% for initial enterprise partner.",
      "Seamlessly integrated with legacy Avaya/Cisco SIP infrastructure."
    ],
    architectureDiagram: `graph TD
      SIP[SIP Trunk] -->|MediaStream| Collector[Stream Collector]
      Collector -->|Base64| Transcribe[STT Engine]
      Transcribe -->|Text| LLM[LLM Sentiment Engine]
      LLM -->|Insight| Dashboard[Admin Real-time UI]`,
    technicalChallenges: [
      "Low-latency streaming of audio over unstable network paths.",
      "Prompt engineering for domain-specific jargon in legal and insurance calls."
    ]
  },
  {
    id: "currigiganalyzer",
    title: "CurriGigAnalyzer",
    slug: "currigiganalyzer",
    liveUrl: "https://currigiganalyzer.com",
    description: "Financial modeling engine for gig-economy logistics. Transforms unstructured OCR data into predictive P&L statements for distributed workforces.",
    thumbnailUrl: "/projects/currigiganalyzer.png",
    platform: "Next.js",
    createdAt: "2023-12-15",
    featured: true,
    role: "Full-Stack Engineer",
    tech: ["Next.js", "PostgreSQL", "tRPC", "Gemini API"],
    gradient: "blue",
    iconName: "LineChart",
    tags: ["Full Stack", "Data", "AI/ML"]
  },
  {
    id: "aim8video",
    title: "AIM8 Video",
    slug: "aim8-video",
    liveUrl: "https://aim8-video.lovable.app",
    description: "Architected a generative video engine that synchronizes audio-reactive parameters with custom-trained Stable Video Diffusion models.",
    thumbnailUrl: "/projects/aim8video.png",
    platform: "Vercel",
    createdAt: "2024-03-08",
    featured: true,
    role: "Lead Creative Technologist",
    tech: ["Web Audio API", "Pydantic", "Stable Video", "FastAPI"],
    gradient: "violet",
    iconName: "Video",
    tags: ["AI/ML", "Creative Tech", "SaaS"]
  },
  {
    id: "aiskilldrop",
    title: "AI Skill Drop",
    slug: "aiskilldrop",
    liveUrl: "https://ai-skill-drop.vercel.app",
    description: "The definitive resource for AI agent builders. Discover reusable skills, automated agent workflows, and step-by-step how-to guides.",
    summary: "A curated directory for AI agent automations and skills, helping developers track the pulse of agentic engineering.",
    thumbnailUrl: "/projects/aiskilldrop.png",
    platform: "Vercel",
    createdAt: "2024-04-15",
    featured: true,
    category: "AI Educational",
    role: "Full-Stack Engineer",
    gradient: "emerald",
    iconName: "Sparkles",
    tech: ["Next.js", "Tailwind CSS", "MDX"],
    tags: ["AI/ML", "Education", "Development"],
    metrics: [
      { label: "Updates", value: "Weekly" },
      { label: "Community", value: "Discord" }
    ],
    outcomes: [
      "Curated hundreds of valuable AI skills and automations for the developer community.",
      "Provided an essential knowledge base for tracking emerging AI agent frameworks."
    ],
    architectureDiagram: `graph TD
      MDX[MDX Content] -->|Statically Generated| App[Next.js App]
      App -->|CDN Edge| Users[Developer Community]`,
    technicalChallenges: [
      "Compiling and serving dynamic documentation structures optimally for edge networks.",
      "Maintaining up-to-date resources in a fast-moving AI knowledge space."
    ]
  },
  {
    id: "ugcgenerator",
    title: "UGC Generator",
    slug: "ugc-generator",
    liveUrl: "https://ugcgenerator.lovable.app",
    description: "A centralized platform empowering brands to seamlessly create, manage, and scale user-generated campaigns. Complete with creator tracking and analytics.",
    summary: "Automated UGC hub designed to streamline brand and creator collaborations.",
    thumbnailUrl: "/projects/ugcgenerator.png",
    platform: "Lovable",
    createdAt: "2024-04-20",
    featured: true,
    category: "Generative Content",
    role: "Lead Engineer",
    gradient: "pink",
    iconName: "Video",
    tech: ["React", "Lovable", "Supabase", "Tailwind CSS"],
    tags: ["SaaS", "Content", "Automation"],
    metrics: [
      { label: "Creators", value: "10k+" },
      { label: "UGC Generated", value: "1.2M+" }
    ],
    outcomes: [
      "Automated complete end-to-end UGC campaign workflows saving teams ~20 hours weekly.",
      "Established centralized dashboard for evaluating creator performance."
    ],
    architectureDiagram: `graph LR
      Brands[Brands] -->|Campaign Setup| Hub[UGC Hub]
      Hub -->|Briefs| Creators[Creators]
      Creators -->|Upload| Pipeline[Content Pipeline]
      Pipeline -->|Approval| Hub`,
    technicalChallenges: [
      "Handling large asynchronous video file uploads with resilient retries.",
      "Building responsive real-time dashboards."
    ]
  }
];

export const getProjects = async (): Promise<Project[]> => {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("createdAt", { ascending: false });

  if (error) {
    console.error("Error fetching projects:", error);
    return defaultProjects;
  }

  const dbProjects = (data || []).map((p: any) => ({
    ...p,
    createdAt: p.created_at,
    tags: p.tags || [],
    metrics: p.metrics || [],
    featured: !!p.featured,
    role: p.role || "",
    tech: p.tech || [],
    gradient: p.gradient || "blue",
    category: p.category || "",
    iconName: p.icon_name || "LineChart",
    architectureDiagram: p.architecture_diagram || "",
    technicalChallenges: p.technical_challenges || []
  }));

  if (data && data.length > 0) {
    const dbSlugs = new Set(dbProjects.map((p: any) => p.slug));
    const mergedProjects = [...dbProjects];
    for (const dp of defaultProjects) {
      if (!dbSlugs.has(dp.slug)) {
        mergedProjects.push(dp);
      }
    }
    return mergedProjects;
  }

  return defaultProjects;
};

export const getFeaturedProjects = async (): Promise<Project[]> => {
  const projects = await getProjects();
  return projects.filter((p) => p.featured);
};

export const getProjectByIdOrSlug = async (slug: string): Promise<Project | undefined> => {
  const projects = await getProjects();
  return projects.find((p) => p.slug === slug || p.id === slug);
};

export const addProject = async (project: TablesInsert<"projects">) => {
  const { data, error } = await supabase
    .from("projects")
    .insert(project)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateProject = async (id: string, project: TablesUpdate<"projects">) => {
  const { data, error } = await supabase
    .from("projects")
    .update(project)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteProject = async (id: string) => {
  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", id);

  if (error) throw error;
};
