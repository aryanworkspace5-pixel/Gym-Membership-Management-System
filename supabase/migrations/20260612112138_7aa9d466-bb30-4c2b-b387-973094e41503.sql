
-- =========================================================
-- Auto-grant admin role to founder email on signup
-- =========================================================
CREATE OR REPLACE FUNCTION public.handle_new_user_admin_seed()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.email = 'aryanworkspace5@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin'::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_admin_seed ON auth.users;
CREATE TRIGGER on_auth_user_created_admin_seed
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_admin_seed();

-- =========================================================
-- ENUMS
-- =========================================================
CREATE TYPE public.member_status AS ENUM ('active','inactive','expired','frozen');
CREATE TYPE public.payment_method AS ENUM ('cash','card','upi','bank_transfer','other');
CREATE TYPE public.attendance_source AS ENUM ('manual','qr','self');
CREATE TYPE public.gender_type AS ENUM ('male','female','other','prefer_not_to_say');

-- =========================================================
-- membership_plans
-- =========================================================
CREATE TABLE public.membership_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  duration_months integer NOT NULL CHECK (duration_months > 0),
  price numeric(10,2) NOT NULL CHECK (price >= 0),
  features jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.membership_plans TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.membership_plans TO authenticated;
GRANT ALL ON public.membership_plans TO service_role;
ALTER TABLE public.membership_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active plans"
ON public.membership_plans FOR SELECT
USING (is_active = true OR public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins manage plans"
ON public.membership_plans FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_membership_plans_updated_at
BEFORE UPDATE ON public.membership_plans
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================================
-- members
-- =========================================================
CREATE TABLE public.members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  phone text NOT NULL,
  email text,
  gender gender_type,
  date_of_birth date,
  address text,
  emergency_contact_name text,
  emergency_contact_phone text,
  photo_url text,
  join_date date NOT NULL DEFAULT CURRENT_DATE,
  status member_status NOT NULL DEFAULT 'active',
  plan_id uuid REFERENCES public.membership_plans(id) ON DELETE SET NULL,
  plan_start_date date,
  plan_end_date date,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_members_status ON public.members(status);
CREATE INDEX idx_members_plan_end_date ON public.members(plan_end_date);
CREATE INDEX idx_members_phone ON public.members(phone);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.members TO authenticated;
GRANT ALL ON public.members TO service_role;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage members"
ON public.members FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_members_updated_at
BEFORE UPDATE ON public.members
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================================
-- payments
-- =========================================================
CREATE TABLE public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  plan_id uuid REFERENCES public.membership_plans(id) ON DELETE SET NULL,
  amount numeric(10,2) NOT NULL CHECK (amount >= 0),
  payment_date date NOT NULL DEFAULT CURRENT_DATE,
  method payment_method NOT NULL DEFAULT 'cash',
  period_from date,
  period_to date,
  notes text,
  recorded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_payments_member ON public.payments(member_id);
CREATE INDEX idx_payments_date ON public.payments(payment_date);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.payments TO authenticated;
GRANT ALL ON public.payments TO service_role;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage payments"
ON public.payments FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_payments_updated_at
BEFORE UPDATE ON public.payments
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================================
-- attendance
-- =========================================================
CREATE TABLE public.attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  check_in timestamptz NOT NULL DEFAULT now(),
  check_out timestamptz,
  source attendance_source NOT NULL DEFAULT 'manual',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_attendance_member ON public.attendance(member_id);
CREATE INDEX idx_attendance_check_in ON public.attendance(check_in DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.attendance TO authenticated;
GRANT ALL ON public.attendance TO service_role;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage attendance"
ON public.attendance FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- =========================================================
-- Seed default plans
-- =========================================================
INSERT INTO public.membership_plans (name, description, duration_months, price, features, display_order) VALUES
  ('Monthly', 'Perfect for trying us out', 1, 1500, '["Full gym access","Locker access","Free Wi-Fi"]'::jsonb, 1),
  ('Quarterly', 'Best for building a habit', 3, 4000, '["Full gym access","Locker access","1 free PT session","Diet consultation"]'::jsonb, 2),
  ('Half Yearly', 'Serious commitment, serious savings', 6, 7500, '["Full gym access","Locker access","3 free PT sessions","Diet consultation","Body composition check"]'::jsonb, 3),
  ('Annual', 'Best value for transformation', 12, 13000, '["Full gym access","Locker access","6 free PT sessions","Quarterly diet plan","Monthly body composition","Priority support"]'::jsonb, 4);
