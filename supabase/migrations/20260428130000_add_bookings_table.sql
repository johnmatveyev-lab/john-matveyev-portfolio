CREATE TABLE public.bookings (
  id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
  name text NOT NULL,
  email text NOT NULL,
  date date NOT NULL,
  time time NOT NULL,
  notes text,
  status text NOT NULL DEFAULT 'pending'::text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT bookings_pkey PRIMARY KEY (id)
);

-- Enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts
CREATE POLICY "Allow public inserts" ON public.bookings FOR INSERT TO public WITH CHECK (true);

-- Allow admins to read/update/delete bookings
-- (assuming service role or authenticated admins can bypass RLS or need a policy)
CREATE POLICY "Allow admin read" ON public.bookings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow admin update" ON public.bookings FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow admin delete" ON public.bookings FOR DELETE TO authenticated USING (true);
