export interface Skill {
  name: string;
  proficiency?: "expert" | "advanced" | "proficient";
}

export interface SkillCategory {
  category: string;
  skills: Skill[];
}

export interface Platform {
  name: string;
  icon: string;
  gradient: "blue" | "violet" | "emerald" | "pink" | "gold" | "cyan";
  description: string;
  categories: SkillCategory[];
}

export const platforms: Platform[] = [
  {
    name: "Google Cloud",
    icon: "Cloud",
    gradient: "blue",
    description: "Enterprise cloud infrastructure & serverless computing",
    categories: [
      {
        category: "Compute & Serverless",
        skills: [
          { name: "Cloud Functions", proficiency: "expert" },
          { name: "Cloud Run", proficiency: "expert" },
          { name: "App Engine", proficiency: "advanced" },
          { name: "Compute Engine", proficiency: "advanced" },
          { name: "Kubernetes Engine (GKE)", proficiency: "advanced" },
        ],
      },
      {
        category: "Data & Storage",
        skills: [
          { name: "Firestore", proficiency: "expert" },
          { name: "BigQuery", proficiency: "advanced" },
          { name: "Cloud Storage", proficiency: "expert" },
          { name: "Cloud SQL", proficiency: "advanced" },
          { name: "Pub/Sub", proficiency: "advanced" },
          { name: "Memorystore (Redis)", proficiency: "proficient" },
        ],
      },
      {
        category: "AI & ML",
        skills: [
          { name: "Vertex AI", proficiency: "expert" },
          { name: "AutoML", proficiency: "advanced" },
          { name: "Vision API", proficiency: "expert" },
          { name: "Natural Language API", proficiency: "advanced" },
          { name: "Speech-to-Text", proficiency: "expert" },
          { name: "Text-to-Speech", proficiency: "expert" },
          { name: "Translation API", proficiency: "advanced" },
        ],
      },
      {
        category: "DevOps & Security",
        skills: [
          { name: "Cloud Build", proficiency: "advanced" },
          { name: "IAM & Access Control", proficiency: "expert" },
          { name: "Secret Manager", proficiency: "expert" },
          { name: "Cloud Monitoring", proficiency: "advanced" },
          { name: "Cloud Armor", proficiency: "proficient" },
          { name: "Container Registry", proficiency: "advanced" },
          { name: "Cloud Logging", proficiency: "expert" },
        ],
      },
      {
        category: "Networking",
        skills: [
          { name: "Cloud CDN", proficiency: "advanced" },
          { name: "Load Balancing", proficiency: "advanced" },
          { name: "VPC Networking", proficiency: "proficient" },
          { name: "Cloud DNS", proficiency: "expert" },
        ],
      },
    ],
  },
  {
    name: "Google Gemini",
    icon: "Sparkles",
    gradient: "violet",
    description: "Multimodal AI — text, vision, audio, video, and code",
    categories: [
      {
        category: "Content Generation",
        skills: [
          { name: "Text Generation", proficiency: "expert" },
          { name: "Code Generation", proficiency: "expert" },
          { name: "Structured Output (JSON)", proficiency: "expert" },
          { name: "System Instructions", proficiency: "expert" },
          { name: "Long Context (1M+ tokens)", proficiency: "expert" },
        ],
      },
      {
        category: "Multimodal Processing",
        skills: [
          { name: "Vision / Image Analysis", proficiency: "expert" },
          { name: "Audio Processing", proficiency: "expert" },
          { name: "Video Understanding", proficiency: "advanced" },
          { name: "Multimodal Prompts", proficiency: "expert" },
          { name: "Document Understanding (PDF)", proficiency: "expert" },
        ],
      },
      {
        category: "Advanced Features",
        skills: [
          { name: "Function Calling", proficiency: "expert" },
          { name: "Context Caching", proficiency: "advanced" },
          { name: "Grounding with Search", proficiency: "advanced" },
          { name: "Embeddings", proficiency: "advanced" },
          { name: "Fine-Tuning", proficiency: "proficient" },
          { name: "Safety & Content Filtering", proficiency: "expert" },
          { name: "Streaming Responses", proficiency: "expert" },
        ],
      },
    ],
  },
  {
    name: "Google AI Studio",
    icon: "FlaskConical",
    gradient: "cyan",
    description: "Rapid AI prototyping & prompt engineering",
    categories: [
      {
        category: "Prototyping",
        skills: [
          { name: "MVP Development", proficiency: "expert" },
          { name: "Prompt Engineering", proficiency: "expert" },
          { name: "Chat Prototypes", proficiency: "expert" },
          { name: "Structured Prompts", proficiency: "expert" },
        ],
      },
      {
        category: "Model Configuration",
        skills: [
          { name: "Model Tuning", proficiency: "advanced" },
          { name: "Temperature & Sampling", proficiency: "expert" },
          { name: "Safety Settings", proficiency: "advanced" },
          { name: "API Key Management", proficiency: "expert" },
          { name: "Batch Processing", proficiency: "advanced" },
        ],
      },
    ],
  },
  {
    name: "Google Antigravity",
    icon: "Rocket",
    gradient: "emerald",
    description: "Full-stack development with OAuth, APIs, and MCP tooling",
    categories: [
      {
        category: "Development",
        skills: [
          { name: "Frontend Development", proficiency: "expert" },
          { name: "Project Scaffolding", proficiency: "expert" },
          { name: "OAuth Integration", proficiency: "expert" },
          { name: "API Server Development", proficiency: "expert" },
          { name: "MCP Tooling", proficiency: "expert" },
        ],
      },
    ],
  },
  {
    name: "Google Stitch",
    icon: "Layers",
    gradient: "pink",
    description: "Frontend development & UI component design",
    categories: [
      {
        category: "Frontend",
        skills: [
          { name: "Frontend Development", proficiency: "expert" },
          { name: "UI Component Design", proficiency: "expert" },
          { name: "Responsive Layouts", proficiency: "expert" },
          { name: "Prototyping", proficiency: "expert" },
        ],
      },
    ],
  },
  {
    name: "xAI (Grok)",
    icon: "Zap",
    gradient: "blue",
    description: "Real-time AI with conversational intelligence",
    categories: [
      {
        category: "AI Capabilities",
        skills: [
          { name: "Real-Time Data Analysis", proficiency: "expert" },
          { name: "Conversational AI", proficiency: "expert" },
          { name: "Code Generation", proficiency: "advanced" },
          { name: "Image Understanding", proficiency: "advanced" },
          { name: "Web Search Integration", proficiency: "expert" },
        ],
      },
    ],
  },
  {
    name: "Anthropic / Claude Code",
    icon: "Terminal",
    gradient: "violet",
    description: "Agentic coding, CLI development, and MCP architecture",
    categories: [
      {
        category: "Development",
        skills: [
          { name: "CLI Development", proficiency: "expert" },
          { name: "Agentic Coding", proficiency: "expert" },
          { name: "Multi-File Refactoring", proficiency: "expert" },
          { name: "MCP Server Development", proficiency: "expert" },
          { name: "Extended Thinking", proficiency: "expert" },
        ],
      },
      {
        category: "Prompt Engineering",
        skills: [
          { name: "System Prompts", proficiency: "expert" },
          { name: "Tool Use / Function Calling", proficiency: "expert" },
          { name: "Chain of Thought", proficiency: "expert" },
          { name: "Constitutional AI", proficiency: "advanced" },
          { name: "XML-Structured Outputs", proficiency: "expert" },
        ],
      },
    ],
  },
  {
    name: "ChatGPT / OpenAI",
    icon: "Bot",
    gradient: "emerald",
    description: "GPT-4, DALL-E, Whisper, and Assistants API",
    categories: [
      {
        category: "APIs & Models",
        skills: [
          { name: "GPT-4 / GPT-4o Integration", proficiency: "expert" },
          { name: "DALL-E Image Generation", proficiency: "advanced" },
          { name: "Whisper (Speech-to-Text)", proficiency: "expert" },
          { name: "Assistants API", proficiency: "advanced" },
          { name: "Function Calling", proficiency: "expert" },
          { name: "Fine-Tuning", proficiency: "proficient" },
          { name: "Embeddings API", proficiency: "expert" },
        ],
      },
      {
        category: "Advanced",
        skills: [
          { name: "Structured Outputs", proficiency: "expert" },
          { name: "Streaming & SSE", proficiency: "expert" },
          { name: "Batch API", proficiency: "advanced" },
          { name: "Content Moderation API", proficiency: "advanced" },
        ],
      },
    ],
  },
  {
    name: "ElevenLabs",
    icon: "Mic",
    gradient: "gold",
    description: "Voice AI — cloning, text-to-speech, and conversational agents",
    categories: [
      {
        category: "Voice Generation",
        skills: [
          { name: "Text-to-Speech (TTS)", proficiency: "expert" },
          { name: "Voice Cloning", proficiency: "expert" },
          { name: "Voice Design", proficiency: "advanced" },
          { name: "Multilingual TTS", proficiency: "advanced" },
        ],
      },
      {
        category: "Conversational AI",
        skills: [
          { name: "Voice AI Agents", proficiency: "expert" },
          { name: "Streaming Audio", proficiency: "expert" },
          { name: "Real-Time Voice Chat", proficiency: "advanced" },
          { name: "Audio Dubbing", proficiency: "proficient" },
        ],
      },
    ],
  },
  {
    name: "LangChain",
    icon: "Link",
    gradient: "cyan",
    description: "AI orchestration — chains, RAG, agents, and memory",
    categories: [
      {
        category: "Core Framework",
        skills: [
          { name: "Chain Orchestration", proficiency: "expert" },
          { name: "RAG Pipelines", proficiency: "expert" },
          { name: "Agent Frameworks", proficiency: "advanced" },
          { name: "Vector Store Integration", proficiency: "expert" },
          { name: "Memory Management", proficiency: "advanced" },
          { name: "Tool Integration", proficiency: "expert" },
          { name: "LangGraph", proficiency: "advanced" },
          { name: "LangSmith Tracing", proficiency: "advanced" },
        ],
      },
    ],
  },
  {
    name: "Supabase",
    icon: "Database",
    gradient: "emerald",
    description: "Backend-as-a-service with PostgreSQL and real-time",
    categories: [
      {
        category: "Authentication",
        skills: [
          { name: "Email/Password Auth", proficiency: "expert" },
          { name: "OAuth Providers", proficiency: "expert" },
          { name: "Magic Links", proficiency: "expert" },
          { name: "Row-Level Security", proficiency: "expert" },
          { name: "JWT & Session Management", proficiency: "expert" },
        ],
      },
      {
        category: "Database",
        skills: [
          { name: "PostgreSQL", proficiency: "expert" },
          { name: "Database Migrations", proficiency: "expert" },
          { name: "SQL Functions & Triggers", proficiency: "expert" },
          { name: "Foreign Key Relationships", proficiency: "expert" },
          { name: "Full-Text Search", proficiency: "advanced" },
        ],
      },
      {
        category: "Backend Services",
        skills: [
          { name: "Edge Functions (Deno)", proficiency: "expert" },
          { name: "Realtime Subscriptions", proficiency: "advanced" },
          { name: "Storage & File Upload", proficiency: "expert" },
          { name: "Database Webhooks", proficiency: "advanced" },
          { name: "Cron Jobs (pg_cron)", proficiency: "advanced" },
        ],
      },
    ],
  },
  {
    name: "Firebase",
    icon: "Flame",
    gradient: "gold",
    description: "Google's app development platform",
    categories: [
      {
        category: "Authentication",
        skills: [
          { name: "Email/Password Auth", proficiency: "expert" },
          { name: "Social Login Providers", proficiency: "expert" },
          { name: "Phone Auth", proficiency: "advanced" },
          { name: "Anonymous Auth", proficiency: "expert" },
        ],
      },
      {
        category: "Database & Storage",
        skills: [
          { name: "Firestore Database", proficiency: "expert" },
          { name: "Realtime Database", proficiency: "advanced" },
          { name: "Cloud Storage", proficiency: "expert" },
          { name: "Security Rules", proficiency: "expert" },
        ],
      },
      {
        category: "Backend & Hosting",
        skills: [
          { name: "Cloud Functions", proficiency: "expert" },
          { name: "Firebase Hosting", proficiency: "expert" },
          { name: "Cloud Messaging (FCM)", proficiency: "advanced" },
          { name: "Remote Config", proficiency: "advanced" },
          { name: "Analytics", proficiency: "advanced" },
          { name: "Crashlytics", proficiency: "proficient" },
        ],
      },
    ],
  },
  {
    name: "Lovable",
    icon: "Heart",
    gradient: "pink",
    description: "AI-powered full-stack app generation & deployment",
    categories: [
      {
        category: "Development",
        skills: [
          { name: "Full-Stack App Generation", proficiency: "expert" },
          { name: "AI-Assisted Development", proficiency: "expert" },
          { name: "Cloud Deployment", proficiency: "expert" },
          { name: "Database Management", proficiency: "expert" },
          { name: "Component Architecture", proficiency: "expert" },
          { name: "Supabase Integration", proficiency: "expert" },
        ],
      },
    ],
  },
  {
    name: "Cursor",
    icon: "MousePointer",
    gradient: "blue",
    description: "AI-first code editor for rapid development",
    categories: [
      {
        category: "Features",
        skills: [
          { name: "AI-Assisted Coding", proficiency: "expert" },
          { name: "Multi-File Editing", proficiency: "expert" },
          { name: "Codebase Chat", proficiency: "expert" },
          { name: "Terminal Integration", proficiency: "expert" },
          { name: "Custom Rules (.cursorrules)", proficiency: "advanced" },
          { name: "Composer Mode", proficiency: "expert" },
        ],
      },
    ],
  },
  {
    name: "GitHub",
    icon: "GitBranch",
    gradient: "violet",
    description: "Version control, CI/CD, and collaboration",
    categories: [
      {
        category: "Version Control",
        skills: [
          { name: "Git Workflows", proficiency: "expert" },
          { name: "Branch Strategies", proficiency: "expert" },
          { name: "Pull Request Reviews", proficiency: "expert" },
          { name: "Merge Conflict Resolution", proficiency: "expert" },
        ],
      },
      {
        category: "DevOps & Automation",
        skills: [
          { name: "GitHub Actions CI/CD", proficiency: "expert" },
          { name: "Codespaces", proficiency: "advanced" },
          { name: "GitHub Pages", proficiency: "expert" },
          { name: "GitHub Packages", proficiency: "advanced" },
          { name: "Dependabot", proficiency: "advanced" },
        ],
      },
    ],
  },
  {
    name: "Hostinger",
    icon: "Globe",
    gradient: "cyan",
    description: "Domain management, VPS, and web hosting",
    categories: [
      {
        category: "Hosting & Infrastructure",
        skills: [
          { name: "Domain Management", proficiency: "expert" },
          { name: "VPS Hosting", proficiency: "advanced" },
          { name: "DNS Configuration", proficiency: "expert" },
          { name: "SSL Certificates", proficiency: "expert" },
          { name: "WordPress Hosting", proficiency: "advanced" },
        ],
      },
    ],
  },
  {
    name: "Vercel",
    icon: "Rocket",
    gradient: "blue",
    description: "Edge-first deployment platform for modern web apps",
    categories: [
      {
        category: "Deployment",
        skills: [
          { name: "Edge Deployment", proficiency: "expert" },
          { name: "Serverless Functions", proficiency: "expert" },
          { name: "Preview Deployments", proficiency: "expert" },
          { name: "Domain Management", proficiency: "expert" },
        ],
      },
      {
        category: "Platform Features",
        skills: [
          { name: "Analytics & Web Vitals", proficiency: "advanced" },
          { name: "Edge Config", proficiency: "advanced" },
          { name: "Cron Jobs", proficiency: "advanced" },
          { name: "Environment Variables", proficiency: "expert" },
        ],
      },
    ],
  },
  {
    name: "Stripe",
    icon: "Zap",
    gradient: "violet",
    description: "Payment processing, subscriptions, and billing",
    categories: [
      {
        category: "Payments",
        skills: [
          { name: "Payments API", proficiency: "expert" },
          { name: "Checkout Sessions", proficiency: "expert" },
          { name: "Subscription Billing", proficiency: "expert" },
          { name: "Webhooks", proficiency: "expert" },
          { name: "Payment Intents", proficiency: "expert" },
        ],
      },
      {
        category: "Advanced",
        skills: [
          { name: "Connect (Marketplace)", proficiency: "advanced" },
          { name: "Customer Portal", proficiency: "expert" },
          { name: "Invoicing", proficiency: "advanced" },
          { name: "Metered Billing", proficiency: "proficient" },
        ],
      },
    ],
  },
  {
    name: "Docker",
    icon: "Layers",
    gradient: "cyan",
    description: "Containerization and orchestration for deployment",
    categories: [
      {
        category: "Containerization",
        skills: [
          { name: "Dockerfile Creation", proficiency: "expert" },
          { name: "Docker Compose", proficiency: "expert" },
          { name: "Multi-Stage Builds", proficiency: "advanced" },
          { name: "Container Networking", proficiency: "advanced" },
          { name: "Volume Management", proficiency: "expert" },
          { name: "Image Optimization", proficiency: "advanced" },
        ],
      },
    ],
  },
  {
    name: "Figma",
    icon: "Eye",
    gradient: "pink",
    description: "UI/UX design, prototyping, and design systems",
    categories: [
      {
        category: "Design",
        skills: [
          { name: "UI/UX Design", proficiency: "expert" },
          { name: "Interactive Prototyping", proficiency: "expert" },
          { name: "Design Systems & Tokens", proficiency: "expert" },
          { name: "Auto Layout", proficiency: "expert" },
          { name: "Dev Handoff", proficiency: "expert" },
          { name: "Plugin Development", proficiency: "proficient" },
        ],
      },
    ],
  },
  {
    name: "Cloudflare",
    icon: "Globe",
    gradient: "gold",
    description: "Edge computing, CDN, DNS, and security",
    categories: [
      {
        category: "Edge & Compute",
        skills: [
          { name: "Workers (Edge Functions)", proficiency: "expert" },
          { name: "Pages (Static Sites)", proficiency: "expert" },
          { name: "R2 Object Storage", proficiency: "advanced" },
          { name: "KV Store", proficiency: "advanced" },
        ],
      },
      {
        category: "Infrastructure",
        skills: [
          { name: "CDN & Caching", proficiency: "expert" },
          { name: "DNS Management", proficiency: "expert" },
          { name: "SSL/TLS", proficiency: "expert" },
          { name: "DDoS Protection", proficiency: "advanced" },
          { name: "Web Application Firewall", proficiency: "advanced" },
        ],
      },
    ],
  },
  {
    name: "Notion",
    icon: "LayoutDashboard",
    gradient: "blue",
    description: "Knowledge management and workspace automation",
    categories: [
      {
        category: "Integration",
        skills: [
          { name: "Notion API", proficiency: "expert" },
          { name: "Database Automation", proficiency: "expert" },
          { name: "Knowledge Base Architecture", proficiency: "expert" },
          { name: "Template Systems", proficiency: "advanced" },
          { name: "Workspace Organization", proficiency: "expert" },
        ],
      },
    ],
  },
  {
    name: "Zapier / Make",
    icon: "Workflow",
    gradient: "emerald",
    description: "No-code workflow automation and multi-app integrations",
    categories: [
      {
        category: "Automation",
        skills: [
          { name: "Multi-Step Workflows", proficiency: "expert" },
          { name: "Webhook Triggers", proficiency: "expert" },
          { name: "API Integrations", proficiency: "expert" },
          { name: "Conditional Logic", proficiency: "expert" },
          { name: "Data Transformation", proficiency: "advanced" },
          { name: "Error Handling & Retry", proficiency: "advanced" },
        ],
      },
    ],
  },
  {
    name: "Replit",
    icon: "Code",
    gradient: "cyan",
    description: "Cloud IDE with AI-assisted development and deployment",
    categories: [
      {
        category: "Development",
        skills: [
          { name: "Cloud IDE", proficiency: "expert" },
          { name: "AI-Assisted Coding", proficiency: "expert" },
          { name: "One-Click Deployments", proficiency: "expert" },
          { name: "Multiplayer Collaboration", proficiency: "advanced" },
          { name: "Database Integration", proficiency: "advanced" },
        ],
      },
    ],
  },
  {
    name: "OpenClaw",
    icon: "Grip",
    gradient: "gold",
    description: "AI agent orchestration & tool integration",
    categories: [
      {
        category: "Agent Development",
        skills: [
          { name: "AI Agent Orchestration", proficiency: "expert" },
          { name: "Tool Integration", proficiency: "expert" },
          { name: "Workflow Automation", proficiency: "advanced" },
          { name: "Multi-Agent Systems", proficiency: "advanced" },
        ],
      },
    ],
  },
  {
    name: "Goose",
    icon: "Bird",
    gradient: "emerald",
    description: "CLI automation agents for development workflows",
    categories: [
      {
        category: "Automation",
        skills: [
          { name: "Task Automation", proficiency: "expert" },
          { name: "CLI Agent Development", proficiency: "expert" },
          { name: "Code Generation", proficiency: "advanced" },
          { name: "Workflow Scripting", proficiency: "advanced" },
        ],
      },
    ],
  },
  {
    name: "Android Studio",
    icon: "Smartphone",
    gradient: "blue",
    description: "Native Android development with Kotlin & Compose",
    categories: [
      {
        category: "Mobile Development",
        skills: [
          { name: "Kotlin", proficiency: "expert" },
          { name: "Java", proficiency: "advanced" },
          { name: "Jetpack Compose", proficiency: "expert" },
          { name: "Firebase Integration", proficiency: "expert" },
          { name: "Play Store Deployment", proficiency: "expert" },
          { name: "Material Design 3", proficiency: "expert" },
        ],
      },
      {
        category: "Architecture",
        skills: [
          { name: "MVVM Pattern", proficiency: "expert" },
          { name: "Room Database", proficiency: "advanced" },
          { name: "Retrofit / OkHttp", proficiency: "expert" },
          { name: "Navigation Component", proficiency: "expert" },
        ],
      },
    ],
  },
  {
    name: "Xcode",
    icon: "Apple",
    gradient: "pink",
    description: "Native iOS development with Swift & SwiftUI",
    categories: [
      {
        category: "iOS Development",
        skills: [
          { name: "Swift", proficiency: "expert" },
          { name: "SwiftUI", proficiency: "expert" },
          { name: "UIKit", proficiency: "advanced" },
          { name: "iOS App Deployment", proficiency: "expert" },
          { name: "App Store Submission", proficiency: "expert" },
          { name: "Core Data", proficiency: "advanced" },
        ],
      },
      {
        category: "Frameworks",
        skills: [
          { name: "Combine", proficiency: "advanced" },
          { name: "ARKit", proficiency: "proficient" },
          { name: "HealthKit", proficiency: "proficient" },
          { name: "Push Notifications (APNs)", proficiency: "expert" },
        ],
      },
    ],
  },
  {
    name: "VS Code",
    icon: "Code",
    gradient: "blue",
    description: "Primary code editor with extensive extension ecosystem",
    categories: [
      {
        category: "Development",
        skills: [
          { name: "Extension Ecosystem", proficiency: "expert" },
          { name: "Debugging", proficiency: "expert" },
          { name: "Integrated Terminal", proficiency: "expert" },
          { name: "Git Integration", proficiency: "expert" },
          { name: "Remote Development", proficiency: "advanced" },
          { name: "Dev Containers", proficiency: "advanced" },
        ],
      },
    ],
  },
];

export interface Capability {
  title: string;
  description: string;
  icon: string;
  gradient: "blue" | "violet" | "emerald" | "pink" | "gold" | "cyan";
}

export const capabilities: Capability[] = [
  { title: "Full-Stack SaaS", description: "End-to-end web applications with auth, payments, and real-time features", icon: "Layers", gradient: "blue" },
  { title: "AI Agents & Chatbots", description: "Intelligent conversational systems with memory, tools, and RAG pipelines", icon: "Bot", gradient: "violet" },
  { title: "Mobile Apps", description: "Native iOS and Android apps with cloud backends and push notifications", icon: "Smartphone", gradient: "pink" },
  { title: "Enterprise Dashboards", description: "Data-rich admin panels with analytics, charts, and role-based access", icon: "LayoutDashboard", gradient: "emerald" },
  { title: "Real-Time Systems", description: "Live collaboration, streaming data, and WebSocket-powered experiences", icon: "Radio", gradient: "cyan" },
  { title: "Computer Vision Apps", description: "Image/video analysis, object detection, and visual AI pipelines", icon: "Eye", gradient: "violet" },
  { title: "Voice AI", description: "Speech recognition, text-to-speech, and voice-controlled interfaces", icon: "Mic", gradient: "gold" },
  { title: "Automation Pipelines", description: "CI/CD workflows, data processing, and AI-powered task automation", icon: "Workflow", gradient: "emerald" },
  { title: "Payment Systems", description: "Stripe-powered billing, subscriptions, marketplaces, and checkout flows", icon: "Zap", gradient: "blue" },
  { title: "MCP Servers & Tools", description: "Model Context Protocol servers, tool integrations, and AI agent infrastructure", icon: "Terminal", gradient: "violet" },
];

export interface IdeaTile {
  label: string;
  icon: string;
}

export const ideaTiles: IdeaTile[] = [
  { label: "AI / ML", icon: "Brain" },
  { label: "Web App", icon: "Globe" },
  { label: "Mobile", icon: "Smartphone" },
  { label: "Automation", icon: "Workflow" },
  { label: "Data Analytics", icon: "BarChart3" },
  { label: "Real-Time", icon: "Radio" },
  { label: "Enterprise", icon: "Building2" },
  { label: "SaaS", icon: "Cloud" },
  { label: "Voice AI", icon: "Mic" },
  { label: "Payments", icon: "Zap" },
  { label: "E-Commerce", icon: "Grip" },
  { label: "Social Platform", icon: "Heart" },
];

export interface AudienceTile {
  label: string;
  icon: string;
  description: string;
}

export const audienceTiles: AudienceTile[] = [
  { label: "Consumers", icon: "Heart", description: "End users & everyday people" },
  { label: "Developers", icon: "Code", description: "Engineers & technical builders" },
  { label: "Businesses", icon: "Building2", description: "SMBs & growing companies" },
  { label: "Enterprise", icon: "Globe", description: "Large-scale organizations" },
  { label: "Creators", icon: "Sparkles", description: "Content creators & artists" },
  { label: "Students", icon: "Brain", description: "Learners & educators" },
  { label: "Healthcare", icon: "Heart", description: "Medical & health sector" },
  { label: "Finance", icon: "BarChart3", description: "Banking & fintech" },
];

export interface FeatureTile {
  label: string;
  icon: string;
}

export const featureTiles: FeatureTile[] = [
  { label: "AI Chat", icon: "Bot" },
  { label: "Auth & Roles", icon: "Database" },
  { label: "Real-Time Sync", icon: "Radio" },
  { label: "Payments", icon: "Zap" },
  { label: "Dashboard", icon: "LayoutDashboard" },
  { label: "Voice Interface", icon: "Mic" },
  { label: "API Marketplace", icon: "Link" },
  { label: "Mobile-First", icon: "Smartphone" },
  { label: "Analytics", icon: "BarChart3" },
  { label: "Notifications", icon: "Flame" },
  { label: "File Storage", icon: "Cloud" },
  { label: "Search & Filter", icon: "Eye" },
];

export interface DesignStyleTile {
  label: string;
  icon: string;
  description: string;
  preview: string;
}

export const designStyleTiles: DesignStyleTile[] = [
  { label: "Minimal & Clean", icon: "Eye", description: "Whitespace, clarity, elegance", preview: "from-[hsl(0,0%,95%)] to-[hsl(0,0%,100%)]" },
  { label: "Bold & Vibrant", icon: "Sparkles", description: "Gradients, energy, impact", preview: "from-[hsl(270,80%,60%)] to-[hsl(330,75%,58%)]" },
  { label: "Dark & Premium", icon: "Terminal", description: "Luxury, glass, neon accents", preview: "from-[hsl(220,20%,10%)] to-[hsl(220,30%,20%)]" },
  { label: "Playful & Colorful", icon: "Heart", description: "Fun, rounded, approachable", preview: "from-[hsl(160,70%,42%)] to-[hsl(40,85%,55%)]" },
];

export const platformTiles: IdeaTile[] = platforms.map((p) => ({
  label: p.name,
  icon: p.icon,
}));

export const ideaTemplates: Record<string, string[]> = {
  "AI / ML": [
    "intelligent recommendation engine",
    "predictive analytics dashboard",
    "custom model training pipeline",
    "AI-powered content moderator",
    "multi-model orchestration platform",
  ],
  "Web App": [
    "interactive portfolio platform",
    "collaborative workspace tool",
    "social media aggregator",
    "project management suite",
    "knowledge base with AI search",
  ],
  "Mobile": [
    "cross-platform fitness tracker",
    "AR-enhanced navigation app",
    "mobile payment gateway",
    "location-based social network",
    "health monitoring dashboard",
  ],
  "Automation": [
    "workflow orchestration engine",
    "CI/CD pipeline generator",
    "smart notification system",
    "automated report builder",
    "multi-platform content publisher",
  ],
  "Data Analytics": [
    "real-time KPI dashboard",
    "data visualization platform",
    "business intelligence tool",
    "customer behavior analyzer",
    "predictive forecasting engine",
  ],
  "Real-Time": [
    "live collaboration whiteboard",
    "streaming data processor",
    "multiplayer game server",
    "real-time chat system",
    "live auction platform",
  ],
  "Enterprise": [
    "role-based access control system",
    "multi-tenant SaaS platform",
    "enterprise resource planner",
    "compliance monitoring tool",
    "internal tooling framework",
  ],
  "SaaS": [
    "subscription management platform",
    "API marketplace",
    "white-label solution builder",
    "usage-based billing system",
    "customer onboarding suite",
  ],
  "Voice AI": [
    "voice-controlled smart assistant",
    "AI podcast host with cloned voices",
    "real-time translation phone system",
    "voice-driven data entry tool",
  ],
  "Payments": [
    "subscription billing dashboard",
    "marketplace payment router",
    "invoice automation system",
    "usage-metered billing engine",
  ],
  "E-Commerce": [
    "AI-powered product recommendation store",
    "dropshipping automation platform",
    "social commerce marketplace",
    "subscription box builder",
  ],
  "Social Platform": [
    "niche community hub",
    "creator monetization platform",
    "professional networking tool",
    "collaborative content curation app",
  ],
};
