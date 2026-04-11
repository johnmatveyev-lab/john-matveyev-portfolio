-- Projects table for portfolio content
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  title text not null,
  description text not null,
  tags text[] not null default '{}',
  repo_url text,
  live_url text,
  platform text not null,
  thumbnail_url text,
  featured boolean default false,
  role text,
  tech text[] default '{}',
  gradient text default 'blue',
  category text,
  icon_name text,
  slug text unique,
  summary text,
  outcomes text[] default '{}',
  metrics jsonb default '[]',
  hero_image_url text
);

alter table public.projects enable row level security;

-- Public read access
create policy "Anyone can read projects"
  on public.projects
  for select
  using (true);

-- Keep timestamps fresh
create or replace function public.projects_set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

create trigger projects_set_updated_at
before update on public.projects
for each row execute function public.projects_set_updated_at();

-- Seed with the existing featured projects
insert into public.projects
  (id, title, description, tags, live_url, platform, created_at, featured, role, tech, gradient, icon_name, slug, category)
values
  ('8d35b5a9-1a5a-4a50-9b9a-027e6e2b2a01', 'QuantumEarth', 'Interactive geospatial platform combining quantum computing concepts with earth observation data for advanced environmental analysis and visualization.', '{\"Web App\",\"Data\",\"Full Stack\"}', 'https://quantumearth.lovable.app', 'Lovable', '2026-03-10', true, 'Geospatial Intelligence Platform', '{\"React\",\"Lovable\",\"Geospatial APIs\"}', 'blue', 'Globe', 'quantumearth', 'Geospatial'),
  ('4f4b6c2b-9040-4c96-9ef0-04a5b4b32402', 'AIM8.io', 'Multi-modal AI music co-producer. Handles asynchronous media files, Web Audio API playback, and complex AI prompt orchestration.', '{\"AI/ML\",\"Web App\",\"SaaS\"}', 'https://aim8.io', 'React', '2026-01-20', true, 'Generative Audio Workspace', '{\"React\",\"FastAPI\",\"Web Audio API\",\"Kie.ai\"}', 'violet', 'Mic', 'aim8-io', 'AI/ML'),
  ('5e7a7b31-8dbf-4fd3-9e49-bd9f4e1b6f03', 'PrettyPrivilegeAI', 'Aesthetic assessment tool utilizing facial mapping and vision models to return structured visual data, feedback, and SaaS billing.', '{\"Computer Vision\",\"SaaS\",\"AI/ML\"}', 'https://prettyprivilegeai.com', 'React', '2026-03-01', true, 'Computer Vision SaaS', '{\"React\",\"Node.js\",\"Vision API\",\"Stripe\"}', 'pink', 'Eye', 'prettyprivilegeai', 'Computer Vision'),
  ('27b0f6a2-2b6d-4a61-8cdb-85c06759d404', 'SpeakGenie', 'Conversational AI telecom platform for deploying autonomous inbound/outbound voice agents with sub-second latency.', '{\"Real-Time\",\"Telecom\",\"AI/ML\"}', 'https://speakgenie.lovable.app', 'Lovable', '2025-11-05', true, 'Real-Time Telecom AI', '{\"Edge Functions\",\"Twilio WebSockets\",\"LLaMA 3\"}', 'emerald', 'Phone', 'speakgenie', 'Telecom'),
  ('c0b8c4d7-5e0a-4e7c-8d54-4fcbce3b9505', 'Blue Ridge Nano Seal', 'Full-stack operational hub with RBAC dashboards, automated CRM pipelines, mapping routing, and affiliate tracking.', '{\"Enterprise\",\"Full Stack\",\"Automation\"}', 'https://blueridgenanoseal.com', 'React', '2025-10-18', true, 'Enterprise Operations Hub', '{\"Firebase Auth/DB\",\"Stripe Connect\",\"Google Maps\"}', 'blue', 'Building', 'blue-ridge-nano-seal', 'Enterprise'),
  ('d40fcb40-7b58-45f1-9c8a-3d6c0b07a406', 'AIM8 Video', 'AI-powered music visualizer generator that creates stunning animated videos synced to audio tracks, perfect for artists and producers.', '{\"AI/ML\",\"Web App\",\"SaaS\"}', 'https://aim8-video.lovable.app', 'Lovable', '2026-03-08', true, 'Creative Media Tools', '{\"React\",\"Web Audio API\",\"Canvas\",\"Lovable\"}', 'violet', 'Video', 'aim8-video', 'AI/ML'),
  ('93e1ccee-65e5-48b9-9578-0d2b0555a507', 'CurriGigAnalyzer', 'AI-driven logistics and financial analytics dashboard. Parses unstructured user data to optimize routes and track expenses for gig workers.', '{\"Full Stack\",\"Data\",\"AI/ML\"}', 'https://currigiganalyzer.com', 'Next.js', '2025-12-15', true, 'Full-Stack Data & Analytics', '{\"Next.js\",\"Node.js\",\"PostgreSQL\",\"Gemini API\"}', 'blue', 'LineChart', 'currigiganalyzer', 'Logistics'),
  ('8c6bf6e5-9b7f-4d1c-9dc9-bdb2e2c4a508', 'WholesaleAutomated', 'Automated real estate deal evaluator chaining property data APIs with LLMs to score investments and generate outreach scripts.', '{\"Automation\",\"LLM\",\"API\"}', 'https://wholesaleautomated.com', 'Next.js', '2026-02-10', true, 'B2B Automation Engine', '{\"Next.js\",\"MongoDB\",\"Data APIs\",\"Claude 3\"}', 'emerald', 'Briefcase', 'wholesaleautomated', 'Automation'),
  ('5f2ab7c3-9c89-4af7-9345-a8a3a5f7e509', 'CreatedSpace AI', 'Master API routing system orchestrating generation of text, images, video, and voice cloning under one unified frontend.', '{\"AI/ML\",\"API\",\"Full Stack\"}', 'https://createdspaceai.vercel.app', 'Vercel', '2025-09-22', true, 'Omnichannel Media Hub', '{\"Vercel Architecture\",\"ElevenLabs\",\"Replicate\"}', 'pink', 'Wand2', 'createdspace-ai', 'Media')
on conflict (id) do nothing;
