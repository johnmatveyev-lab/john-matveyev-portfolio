-- Contact messages
CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  is_archived boolean DEFAULT false
);
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit a message" ON public.contact_messages FOR INSERT TO anon WITH CHECK (true);

-- Testimonials
CREATE TABLE public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  name text NOT NULL,
  role text NOT NULL,
  avatar_url text,
  quote text NOT NULL,
  rating integer DEFAULT 5,
  visible boolean DEFAULT true,
  sort_order integer DEFAULT 0
);
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read visible testimonials" ON public.testimonials FOR SELECT USING (visible = true);

-- Site settings
CREATE TABLE public.site_settings (
  key text PRIMARY KEY,
  value text NOT NULL,
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read settings" ON public.site_settings FOR SELECT USING (true);