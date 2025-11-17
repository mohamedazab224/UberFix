-- إنشاء RLS policies لـ property-images storage bucket

-- السماح للمستخدمين المسجلين برفع الصور
CREATE POLICY "Users can upload property images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'property-images');

-- السماح للجميع بعرض الصور (لأن الباكت public)
CREATE POLICY "Anyone can view property images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'property-images');

-- السماح للمستخدمين بتحديث صورهم
CREATE POLICY "Users can update property images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'property-images')
WITH CHECK (bucket_id = 'property-images');

-- السماح للمستخدمين بحذف صورهم
CREATE POLICY "Users can delete property images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'property-images');