
-- Roles
CREATE TYPE public.app_role AS ENUM ('admin','editor');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('admin','editor'))
$$;

CREATE POLICY "users can view own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "admins manage roles" ON public.user_roles
  FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Site content (single-row keyed by section)
CREATE TABLE public.site_content (
  section text PRIMARY KEY,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read content" ON public.site_content FOR SELECT USING (true);
CREATE POLICY "admins write content" ON public.site_content
  FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- Leads
CREATE TABLE public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  experience text,
  guardian_name text NOT NULL,
  student_name text NOT NULL,
  birth_date date,
  phone text NOT NULL,
  comment text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can create lead" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "admins read leads" ON public.leads FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "admins update leads" ON public.leads FOR UPDATE TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "admins delete leads" ON public.leads FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));

-- Media
CREATE TABLE public.media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  url text NOT NULL,
  type text NOT NULL,
  size bigint,
  path text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read media" ON public.media FOR SELECT USING (true);
CREATE POLICY "admins manage media" ON public.media FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- Storage bucket for media
INSERT INTO storage.buckets (id, name, public) VALUES ('media','media',true) ON CONFLICT DO NOTHING;
CREATE POLICY "public read media bucket" ON storage.objects FOR SELECT USING (bucket_id = 'media');
CREATE POLICY "admins upload media bucket" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id='media' AND public.is_admin(auth.uid()));
CREATE POLICY "admins update media bucket" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id='media' AND public.is_admin(auth.uid()));
CREATE POLICY "admins delete media bucket" ON storage.objects FOR DELETE TO authenticated USING (bucket_id='media' AND public.is_admin(auth.uid()));

-- Seed default content
INSERT INTO public.site_content (section, data) VALUES
('settings', '{"phone":"+7 (861) 002-51-41","email":"info@famorev.ru","telegram":"","whatsapp":"","max":"","address":"Анапа, Краснодарский край","map_embed":"https://yandex.ru/map-widget/v1/?ll=37.316568%2C44.894228&z=12","copyright":"© 2026 Футбольная Академия Морева"}'::jsonb),
('hero', '{"title_top":"Футбольная","title_mid":"академия","title_accent":"Морева","subtitle":"Крупнейшая футбольная академия Анапы","cta":"Записать ребёнка"}'::jsonb),
('about', '{"title":"Об Академии","caption":"Анапа · Россия","image":"","paragraphs":["Футбольная академия имени Андрея Морева — это современный подход к обучению. Мы воспитываем не только игроков, но и характер, дисциплину, уважение.","Помогаем каждому ребёнку раскрыть таланты и поверить в свои силы. Создаём пространство, где дети растут с интересом и любовью к игре."]}'::jsonb),
('keepers', '{"title":"Школа вратарей","description":"Вратарь — ключевая позиция на футбольном поле, требующая отдельной подготовки. У нас работают опытные тренеры, которые превращают учеников в мастеров.","video":"/media/hero.mp4","poster":""}'::jsonb),
('principles', '{"title":"Наши принципы","subtitle":"Что для нас важно в работе с детьми и в подходе к игре.","items":[{"title":"Дисциплина","text":"Каждая тренировка строится на внимании, ответственности и уважении команды и тренера."},{"title":"Постепенное обучение","text":"Учим от простого к сложному, без перегруза, с учётом возраста и индивидуальных особенностей."},{"title":"Умный игрок","text":"Развиваем тактическое мышление и умение принимать решения на поле."},{"title":"Характер","text":"Воспитываем волю к победе, стойкость и работу в команде."},{"title":"Радость от игры","text":"Любовь к футболу — главный двигатель прогресса."}]}'::jsonb),
('coaches', '{"title":"Тренеры","subtitle":"Главное в академии — это люди. Команда тренеров с профессиональным образованием и многолетним опытом.","items":[{"name":"Губин Алексей Олегович","role":"Главный тренер","bio":"Лицензия УЕФА","photo":""},{"name":"Моисеев Владислав Русланович","role":"Тренер","bio":"Высшее спортивное образование","photo":""},{"name":"Андреев Константин Петрович","role":"Тренер","bio":"Высшее спортивное образование","photo":""}]}'::jsonb),
('location', '{"title":"Где мы тренируемся","description":"Тренировки проходят на профессиональном стадионе с современным искусственным газоном и освещением. Комфортные раздевалки, конференц-зал для теоретических занятий и удобные парковки для родителей.","address":"Анапа, Краснодарский край","caption":"Тренировочное поле","map":"https://yandex.ru/map-widget/v1/?ll=37.316568%2C44.894228&z=13","images":[]}'::jsonb),
('signup', '{"title":"Записать ребёнка","subtitle":"Оставьте заявку — мы свяжемся с вами в течение дня.","bullets":["Пробное занятие — бесплатно","Индивидуальный подход к каждому","Современное оборудование и поле"]}'::jsonb);
