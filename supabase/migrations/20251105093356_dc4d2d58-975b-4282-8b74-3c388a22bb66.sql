-- إضافة عمود icon_url لجدول properties لحفظ أيقونة العقار
ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS icon_url TEXT;

COMMENT ON COLUMN public.properties.icon_url IS 'مسار أيقونة العقار على الخريطة من مجلد pin-pro';
