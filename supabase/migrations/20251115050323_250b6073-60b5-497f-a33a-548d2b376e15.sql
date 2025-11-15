-- إضافة policy جديدة للسماح بتعديل العقارات لجميع المستخدمين المصرح لهم
DROP POLICY IF EXISTS "السماح بتحديث العقارات لمديريها" ON properties;
DROP POLICY IF EXISTS "السماح بحذف العقارات لمديريها" ON properties;

-- إضافة column created_by أولاً
ALTER TABLE properties ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES auth.users(id);

-- تحديث العقارات الحالية لتعيين manager_id من أول مستخدم
UPDATE properties 
SET created_by = (SELECT id FROM auth.users LIMIT 1)
WHERE created_by IS NULL;

UPDATE properties 
SET manager_id = created_by
WHERE manager_id IS NULL AND created_by IS NOT NULL;

-- السماح بالتحديث للمستخدمين المصرح لهم أو مديري العقار
CREATE POLICY "properties_update_authorized"
ON properties FOR UPDATE
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'manager'::app_role) OR 
  has_role(auth.uid(), 'staff'::app_role) OR
  manager_id = auth.uid() OR
  manager_id IS NULL
);

-- السماح بالحذف للمستخدمين المصرح لهم أو مديري العقار
CREATE POLICY "properties_delete_authorized"
ON properties FOR DELETE
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'manager'::app_role) OR
  manager_id = auth.uid()
);