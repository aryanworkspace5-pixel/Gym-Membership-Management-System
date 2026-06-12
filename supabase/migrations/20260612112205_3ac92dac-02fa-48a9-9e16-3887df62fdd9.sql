
REVOKE EXECUTE ON FUNCTION public.handle_new_user_admin_seed() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
