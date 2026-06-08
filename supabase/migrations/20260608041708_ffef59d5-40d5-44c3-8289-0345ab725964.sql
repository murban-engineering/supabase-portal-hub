CREATE TABLE public.clients (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  password text NOT NULL,
  app_url text NOT NULL,
  terminal_location text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.clients TO anon;
GRANT SELECT, INSERT, UPDATE ON public.clients TO authenticated;
GRANT ALL ON public.clients TO service_role;

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view clients" ON public.clients FOR SELECT USING (true);
CREATE POLICY "Anyone can update client password" ON public.clients FOR UPDATE USING (true) WITH CHECK (true);

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.clients (id, name, password, app_url, created_at, updated_at, terminal_location) VALUES
('66c41eb9-0060-4723-a294-f6dc1fddad6a','Swahili Beach','S001','https://swahili-beach-tank-calculator.vercel.app/','2026-04-13 13:38:23.864808+00','2026-04-13 13:38:23.864808+00',NULL),
('0ae15675-8871-4abf-bed8-f849468335d0','TotalEnergies Zimbabwe PVT Ltd','T006','https://harare-tank-data.vercel.app/','2026-04-13 13:38:23.864808+00','2026-04-13 13:38:23.864808+00',NULL),
('2ef9d72c-1769-4dcc-ad9b-b644f69d5560','Mabati Rolling Mills','M005','https://mabatirollingmills-eight.vercel.app/','2026-04-13 13:38:23.864808+00','2026-04-13 13:38:23.864808+00',NULL),
('2560e046-46b6-43f2-8cd2-ebc76473e0fe','Salim wazaran ltd','T002','https://tank-volume-genesis.vercel.app/','2026-04-13 13:38:23.864808+00','2026-04-15 04:57:22.399502+00',NULL),
('c1f5379f-cfde-43d0-b4b7-a1e8ac45b366','Total – Uganda','T004','https://totaluganda.vercel.app/','2026-04-13 13:38:23.864808+00','2026-04-15 05:00:02.549791+00','Jinja'),
('003a1eaf-2a88-48aa-86b7-a08e6f16c142','Tecaflex limited','T007','https://tecaflex-tank-monitor.vercel.app/','2026-04-14 05:47:50.751509+00','2026-04-15 05:52:07.143243+00',NULL),
('5751e073-c3ea-4ccb-aced-6b47e07bc635','Rubis – Zambia','R003','https://rubiszambia-pink.vercel.app/','2026-04-13 13:38:23.864808+00','2026-05-12 07:23:39.429387+00','Lusaka');