
CREATE TABLE public.project_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  status text DEFAULT 'pending' NOT NULL,
  user_name text NOT NULL,
  user_email text NOT NULL,
  user_phone text,
  user_company text,
  user_notes text,
  project_name text NOT NULL,
  project_tagline text,
  project_description text,
  project_category text,
  project_audience text,
  project_design_style text,
  project_platforms text[] DEFAULT '{}',
  project_features text[] DEFAULT '{}',
  project_tech_stack text[] DEFAULT '{}',
  project_key_features text[] DEFAULT '{}',
  mockup_landing_page text,
  mockup_pages jsonb DEFAULT '[]',
  edit_instructions text[] DEFAULT '{}'
);

ALTER TABLE public.project_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a project"
  ON public.project_submissions FOR INSERT
  TO anon
  WITH CHECK (true);
