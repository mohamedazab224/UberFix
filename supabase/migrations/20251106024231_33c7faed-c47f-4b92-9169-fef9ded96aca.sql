-- إنشاء جدول vendors (الفنيين/الموردين)
CREATE TABLE IF NOT EXISTS vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  company_name TEXT,
  specialization TEXT[] NOT NULL DEFAULT '{}',
  phone TEXT,
  email TEXT,
  address TEXT,
  hourly_rate NUMERIC,
  experience_years INTEGER,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'available', 'busy', 'offline')),
  map_icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إضافة حقول مفقودة لجدول maintenance_requests
ALTER TABLE maintenance_requests 
  ADD COLUMN IF NOT EXISTS property_id UUID REFERENCES properties(id),
  ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;

-- إنشاء فهرس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_maintenance_requests_property_id ON maintenance_requests(property_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_requests_location ON maintenance_requests(latitude, longitude) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_vendors_status ON vendors(status);
CREATE INDEX IF NOT EXISTS idx_vendors_specialization ON vendors USING GIN(specialization);

-- تفعيل RLS على جدول vendors
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;

-- سياسات vendors - القراءة متاحة للجميع
CREATE POLICY "vendors_select_all"
  ON vendors
  FOR SELECT
  USING (true);

-- الإداريون يمكنهم إدارة الفنيين
CREATE POLICY "vendors_admin_insert"
  ON vendors
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role));

CREATE POLICY "vendors_admin_update"
  ON vendors
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role));

CREATE POLICY "vendors_admin_delete"
  ON vendors
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- trigger لتحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION update_vendors_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER vendors_updated_at_trigger
  BEFORE UPDATE ON vendors
  FOR EACH ROW
  EXECUTE FUNCTION update_vendors_updated_at();