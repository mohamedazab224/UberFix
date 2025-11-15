-- إصلاح policy التحديث بإضافة WITH CHECK clause
DROP POLICY IF EXISTS "properties_update_authorized" ON properties;

CREATE POLICY "properties_update_authorized"
ON properties FOR UPDATE
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'manager'::app_role) OR 
  has_role(auth.uid(), 'staff'::app_role) OR
  manager_id = auth.uid() OR
  manager_id IS NULL
)
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'manager'::app_role) OR 
  has_role(auth.uid(), 'staff'::app_role) OR
  manager_id = auth.uid() OR
  created_by = auth.uid()
);