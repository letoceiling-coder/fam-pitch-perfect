
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.is_admin(uuid) FROM anon, authenticated, public;
DROP POLICY IF EXISTS "public read media bucket" ON storage.objects;
CREATE POLICY "public read media bucket" ON storage.objects FOR SELECT USING (bucket_id='media' AND (storage.foldername(name))[1] IS NOT NULL);
