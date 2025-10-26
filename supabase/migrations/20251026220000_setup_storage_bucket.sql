-- Create storage bucket for object images
INSERT INTO storage.buckets (id, name, public)
VALUES ('object-images', 'object-images', true)
ON CONFLICT (id) DO NOTHING;

-- RLS is already enabled on storage.objects by Supabase

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload object images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'object-images');

-- Allow public read access to all object images
CREATE POLICY "Public read access to object images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'object-images');

-- Allow users to delete files from their own objects
CREATE POLICY "Users can delete images from their objects"
ON storage.objects
FOR DELETE
TO authenticated
USING (
    bucket_id = 'object-images'
    AND (storage.foldername(name))[1] = 'objects'
);

-- Allow users to update their own object images
CREATE POLICY "Users can update their own object images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
    bucket_id = 'object-images'
    AND (storage.foldername(name))[1] = 'objects'
);
