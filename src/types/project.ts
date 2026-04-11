export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  repoUrl?: string;
  liveUrl?: string;
  platform: string;
  thumbnailUrl?: string;
  createdAt: string;
  featured: boolean;
  slug?: string;
  summary?: string;
  outcomes?: string[];
  metrics?: ProjectMetric[];
  heroImageUrl?: string;
  // New fields for redesign
  role?: string;
  tech?: string[];
  gradient?: "blue" | "violet" | "emerald" | "pink";
  category?: string;
  iconName?: string;
}

export interface ProjectMetric {
  label: string;
  value: string;
}

export const PLATFORMS = [
  "Lovable",
  "Google AI Studio",
  "Android Studio",
  "Xcode",
  "VS Code",
  "Cursor",
  "Replit",
  "Vercel",
  "Next.js",
  "React",
  "Other",
] as const;

export const TAG_OPTIONS = [
  "AI/ML",
  "Web App",
  "Mobile",
  "API",
  "Automation",
  "LLM",
  "Computer Vision",
  "NLP",
  "Full Stack",
  "DevOps",
  "Data",
  "Chrome Extension",
  "SaaS",
  "Real-Time",
  "Telecom",
  "Enterprise",
] as const;

export const GRADIENT_OPTIONS = ["blue", "violet", "emerald", "pink"] as const;
