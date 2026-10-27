-- Repoint the auto-grant admin seed to the new founder email
CREATE OR REPLACE FUNCTION public.handle_new_user_admin_seed()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF lower(NEW.email) = 'ramavdesh0ram1958@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin'::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.handle_new_user_admin_seed() FROM PUBLIC, anon, authenticated;
COMMENT ON FUNCTION public.handle_new_user_admin_seed() IS 'Auto-grants the admin role on signup to the configured founder email (ramavdesh0ram1958@gmail.com).';
