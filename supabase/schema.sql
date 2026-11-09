-- ==============================================================================
-- HIRENAIJA (Nigerian Business Directory & Artisan Marketplace)
-- Fully Idempotent & Re-runnable Supabase / PostgreSQL Schema
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. SAFE ENUM CREATION (Will not fail if already created)
DO $$ BEGIN
  CREATE TYPE business_category AS ENUM (
    'mechanics', 'electricians', 'plumbers', 'tailors',
    'barbers', 'hairstylists', 'photographers', 'djs',
    'mcs', 'welders', 'freelancers', 'tutors'
  );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE plan_tier AS ENUM ('free', 'starter', 'growth', 'vip');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE verification_status AS ENUM ('unverified', 'identity_verified', 'cac_verified');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE price_tier AS ENUM ('₦', '₦₦', '₦₦₦');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE urgency_level AS ENUM (
    'Immediate (Today)', 'Within 48 Hours', 'This Week',
    'Planning Stage', 'Emergency', 'Flexible'
  );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE quote_status AS ENUM ('new', 'contacted', 'resolved');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE job_status AS ENUM ('open', 'awarded', 'completed', 'cancelled');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM ('pending', 'successful', 'failed', 'abandoned');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- ==============================================================================
-- 3. CORE TABLES
-- ==============================================================================

-- 3.1 PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE,
  full_name TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'artisan', 'admin')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3.2 BUSINESSES
CREATE TABLE IF NOT EXISTS public.businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  owner_name TEXT NOT NULL,
  category business_category NOT NULL,
  category_label TEXT NOT NULL,
  tag_line TEXT,
  bio TEXT,
  city TEXT NOT NULL DEFAULT 'Lagos',
  neighborhood TEXT NOT NULL,
  full_address TEXT NOT NULL,
  landmark TEXT,
  phone TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  email TEXT,
  instagram TEXT,
  image_url TEXT,
  gallery TEXT[] DEFAULT ARRAY[]::TEXT[],
  plan_tier plan_tier NOT NULL DEFAULT 'free',
  verification_status verification_status NOT NULL DEFAULT 'unverified',
  cac_number TEXT,
  years_in_business INTEGER DEFAULT 1 CHECK (years_in_business >= 0),
  rating NUMERIC(3, 2) NOT NULL DEFAULT 5.00 CHECK (rating >= 0 AND rating <= 5),
  review_count INTEGER NOT NULL DEFAULT 0 CHECK (review_count >= 0),
  starting_price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  price_tier price_tier NOT NULL DEFAULT '₦',
  opening_days TEXT NOT NULL DEFAULT 'Mon - Sat',
  opening_hours TEXT NOT NULL DEFAULT '8:00 AM - 6:00 PM',
  is_open_now BOOLEAN DEFAULT true,
  badges TEXT[] DEFAULT ARRAY[]::TEXT[],
  response_time TEXT DEFAULT 'Within 30 mins',
  views_count INTEGER NOT NULL DEFAULT 0,
  phone_clicks INTEGER NOT NULL DEFAULT 0,
  whatsapp_clicks INTEGER NOT NULL DEFAULT 0,
  leads_received INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3.3 SERVICES
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  duration TEXT,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3.4 REVIEWS
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  neighborhood TEXT,
  verified_hire BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3.5 QUOTE REQUESTS
CREATE TABLE IF NOT EXISTS public.quote_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  neighborhood TEXT,
  service_needed TEXT NOT NULL,
  description TEXT NOT NULL,
  urgency urgency_level NOT NULL DEFAULT 'Within 48 Hours',
  budget_estimate TEXT,
  status quote_status NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3.6 JOB LEADS
CREATE TABLE IF NOT EXISTS public.job_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  category business_category NOT NULL,
  city TEXT NOT NULL,
  neighborhood TEXT NOT NULL,
  description TEXT NOT NULL,
  budget TEXT NOT NULL,
  urgency urgency_level NOT NULL DEFAULT 'This Week',
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  status job_status NOT NULL DEFAULT 'open',
  bids_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3.7 JOB BIDS
CREATE TABLE IF NOT EXISTS public.job_bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.job_leads(id) ON DELETE CASCADE,
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
  artisan_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  proposed_amount NUMERIC(12, 2),
  proposal_note TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3.8 BOOKMARKS
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE (user_id, business_id)
);

-- 3.9 PAYMENTS
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id) ON DELETE SET NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  plan_tier plan_tier NOT NULL,
  amount_kobo BIGINT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'NGN',
  paystack_reference TEXT NOT NULL UNIQUE,
  payment_channel TEXT DEFAULT 'card',
  status payment_status NOT NULL DEFAULT 'pending',
  customer_email TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 4. INDEXES
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_businesses_slug ON public.businesses(slug);
CREATE INDEX IF NOT EXISTS idx_businesses_category ON public.businesses(category);
CREATE INDEX IF NOT EXISTS idx_businesses_city ON public.businesses(city);
CREATE INDEX IF NOT EXISTS idx_businesses_neighborhood ON public.businesses(neighborhood);
CREATE INDEX IF NOT EXISTS idx_businesses_plan_tier ON public.businesses(plan_tier);
CREATE INDEX IF NOT EXISTS idx_businesses_verification ON public.businesses(verification_status);
CREATE INDEX IF NOT EXISTS idx_businesses_rating ON public.businesses(rating DESC);
CREATE INDEX IF NOT EXISTS idx_businesses_published ON public.businesses(is_published);

CREATE INDEX IF NOT EXISTS idx_services_business_id ON public.services(business_id);
CREATE INDEX IF NOT EXISTS idx_reviews_business_id ON public.reviews(business_id);
CREATE INDEX IF NOT EXISTS idx_quote_requests_business_id ON public.quote_requests(business_id);
CREATE INDEX IF NOT EXISTS idx_job_leads_status_category ON public.job_leads(status, category);
CREATE INDEX IF NOT EXISTS idx_job_bids_job_id ON public.job_bids(job_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON public.bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_reference ON public.payments(paystack_reference);

-- ==============================================================================
-- 5. TRIGGERS & PROCEDURES
-- ==============================================================================

-- 5.1 Profile creation on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone, role, avatar_url)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'phone',
    COALESCE(new.raw_user_meta_data->>'role', 'customer'),
    new.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 5.2 Auto-update ratings and review counts
CREATE OR REPLACE FUNCTION public.update_business_rating_and_reviews()
RETURNS trigger AS $$
DECLARE
  target_biz_id UUID;
  new_count INTEGER;
  new_avg NUMERIC(3, 2);
BEGIN
  IF (TG_OP = 'DELETE') THEN
    target_biz_id := OLD.business_id;
  ELSE
    target_biz_id := NEW.business_id;
  END IF;

  SELECT COUNT(*), COALESCE(ROUND(AVG(rating)::numeric, 2), 5.00)
  INTO new_count, new_avg
  FROM public.reviews
  WHERE business_id = target_biz_id;

  UPDATE public.businesses
  SET review_count = new_count,
      rating = new_avg,
      updated_at = timezone('utc'::text, now())
  WHERE id = target_biz_id;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_recalc_reviews ON public.reviews;
CREATE TRIGGER trg_recalc_reviews
  AFTER INSERT OR UPDATE OR DELETE ON public.reviews
  FOR EACH ROW EXECUTE PROCEDURE public.update_business_rating_and_reviews();

-- 5.3 Auto-increment job bids count
CREATE OR REPLACE FUNCTION public.increment_job_bids_count()
RETURNS trigger AS $$
BEGIN
  UPDATE public.job_leads
  SET bids_count = bids_count + 1,
      updated_at = timezone('utc'::text, now())
  WHERE id = NEW.job_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_increment_job_bids ON public.job_bids;
CREATE TRIGGER trg_increment_job_bids
  AFTER INSERT ON public.job_bids
  FOR EACH ROW EXECUTE PROCEDURE public.increment_job_bids_count();

-- 5.4 Metric counters
CREATE OR REPLACE FUNCTION public.increment_business_metric(
  target_business_id UUID,
  metric_name TEXT
)
RETURNS void AS $$
BEGIN
  IF metric_name = 'views' THEN
    UPDATE public.businesses SET views_count = views_count + 1 WHERE id = target_business_id;
  ELSIF metric_name = 'phone' THEN
    UPDATE public.businesses SET phone_clicks = phone_clicks + 1 WHERE id = target_business_id;
  ELSIF metric_name = 'whatsapp' THEN
    UPDATE public.businesses SET whatsapp_clicks = whatsapp_clicks + 1 WHERE id = target_business_id;
  ELSIF metric_name = 'leads' THEN
    UPDATE public.businesses SET leads_received = leads_received + 1 WHERE id = target_business_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- 6.1 Profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 6.2 Businesses
DROP POLICY IF EXISTS "Published businesses are viewable by everyone" ON public.businesses;
CREATE POLICY "Published businesses are viewable by everyone"
  ON public.businesses FOR SELECT USING (is_published = true OR auth.uid() = owner_id);

DROP POLICY IF EXISTS "Registered users can create business listings" ON public.businesses;
CREATE POLICY "Registered users can create business listings"
  ON public.businesses FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Business owners can update their own listings" ON public.businesses;
CREATE POLICY "Business owners can update their own listings"
  ON public.businesses FOR UPDATE USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Business owners can delete their own listings" ON public.businesses;
CREATE POLICY "Business owners can delete their own listings"
  ON public.businesses FOR DELETE USING (auth.uid() = owner_id);

-- 6.3 Services
DROP POLICY IF EXISTS "Services are viewable by everyone" ON public.services;
CREATE POLICY "Services are viewable by everyone"
  ON public.services FOR SELECT USING (true);

DROP POLICY IF EXISTS "Owners can manage their business services" ON public.services;
CREATE POLICY "Owners can manage their business services"
  ON public.services FOR ALL USING (
    EXISTS (SELECT 1 FROM public.businesses WHERE businesses.id = services.business_id AND businesses.owner_id = auth.uid())
  );

-- 6.4 Reviews
DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON public.reviews;
CREATE POLICY "Reviews are viewable by everyone"
  ON public.reviews FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can submit reviews" ON public.reviews;
CREATE POLICY "Authenticated users can submit reviews"
  ON public.reviews FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- 6.5 Quote Requests
DROP POLICY IF EXISTS "Requesters and business owners can view quotes" ON public.quote_requests;
CREATE POLICY "Requesters and business owners can view quotes"
  ON public.quote_requests FOR SELECT USING (
    auth.uid() = user_id OR
    EXISTS (SELECT 1 FROM public.businesses WHERE businesses.id = quote_requests.business_id AND businesses.owner_id = auth.uid())
  );

DROP POLICY IF EXISTS "Anyone can submit a quote request" ON public.quote_requests;
CREATE POLICY "Anyone can submit a quote request"
  ON public.quote_requests FOR INSERT WITH CHECK (true);

-- 6.6 Job Leads
DROP POLICY IF EXISTS "Open jobs viewable by everyone" ON public.job_leads;
CREATE POLICY "Open jobs viewable by everyone"
  ON public.job_leads FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can post a job lead" ON public.job_leads;
CREATE POLICY "Anyone can post a job lead"
  ON public.job_leads FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Job posters can update their own job" ON public.job_leads;
CREATE POLICY "Job posters can update their own job"
  ON public.job_leads FOR UPDATE USING (auth.uid() = client_user_id);

-- 6.7 Job Bids
DROP POLICY IF EXISTS "Job poster and bidder can view bids" ON public.job_bids;
CREATE POLICY "Job poster and bidder can view bids"
  ON public.job_bids FOR SELECT USING (
    auth.uid() = artisan_id OR
    EXISTS (SELECT 1 FROM public.job_leads WHERE job_leads.id = job_bids.job_id AND job_leads.client_user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Artisans can submit bids" ON public.job_bids;
CREATE POLICY "Artisans can submit bids"
  ON public.job_bids FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- 6.8 Bookmarks
DROP POLICY IF EXISTS "Users can view their own bookmarks" ON public.bookmarks;
CREATE POLICY "Users can view their own bookmarks"
  ON public.bookmarks FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their bookmarks" ON public.bookmarks;
CREATE POLICY "Users can manage their bookmarks"
  ON public.bookmarks FOR ALL USING (auth.uid() = user_id);

-- 6.9 Payments
DROP POLICY IF EXISTS "Users can view their payments" ON public.payments;
CREATE POLICY "Users can view their payments"
  ON public.payments FOR SELECT USING (
    auth.uid() = user_id OR
    EXISTS (SELECT 1 FROM public.businesses WHERE businesses.id = payments.business_id AND businesses.owner_id = auth.uid())
  );

DROP POLICY IF EXISTS "Authenticated users can create payments" ON public.payments;
CREATE POLICY "Authenticated users can create payments"
  ON public.payments FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
