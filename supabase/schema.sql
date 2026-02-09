
-- COMBINED SETUP SCRIPT
-- Copy and paste this into the Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. CONFIGURE ACCESS POLICIES (Row Level Security)

-- Step 1: Enable RLS
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Step 2: Clean up existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public Insert" ON articles;
DROP POLICY IF EXISTS "Public Update" ON articles;
DROP POLICY IF EXISTS "Public Delete" ON articles;
DROP POLICY IF EXISTS "Authenticated Insert" ON articles;
DROP POLICY IF EXISTS "Owner or Admin Update" ON articles;
DROP POLICY IF EXISTS "Owner or Admin Delete" ON articles;
DROP POLICY IF EXISTS "Public Read" ON articles;

-- Step 3: Create new strict policies

-- 1. Allow everyone to view articles (Public Read)
CREATE POLICY "Public Read" ON articles FOR SELECT USING (true);

-- 2. Allow only authenticated users (logged in) to write new articles
CREATE POLICY "Authenticated Insert" ON articles FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- 3. Allow users to update ONLY their own articles, OR Admins to update any
CREATE POLICY "Owner or Admin Update" ON articles FOR UPDATE 
USING (
  auth.uid()::text = "authorId" OR 
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);

-- 4. Allow users to delete ONLY their own articles, OR Admins to delete any
CREATE POLICY "Owner or Admin Delete" ON articles FOR DELETE 
USING (
  auth.uid()::text = "authorId" OR 
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);

-- =========================================================
-- 2. STORAGE SETUP (FOR AVATARS & BLOG IMAGES)
-- =========================================================

-- Create a bucket for 'avatars' if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Create a bucket for 'blog-images' if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

-- STORAGE POLICIES (Allow public read, authenticated upload)

-- 1. Avatars Policies
CREATE POLICY "Avatar Public Read" ON storage.objects FOR SELECT
USING ( bucket_id = 'avatars' );

CREATE POLICY "Avatar Auth Upload" ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'avatars' AND auth.role() = 'authenticated' );

CREATE POLICY "Avatar Owner Update" ON storage.objects FOR UPDATE
USING ( bucket_id = 'avatars' AND auth.uid() = owner );

-- 2. Blog Images Policies
CREATE POLICY "Blog Public Read" ON storage.objects FOR SELECT
USING ( bucket_id = 'blog-images' );

CREATE POLICY "Blog Auth Upload" ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'blog-images' AND auth.role() = 'authenticated' );
