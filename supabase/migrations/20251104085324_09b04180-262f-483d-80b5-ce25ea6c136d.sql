-- ============================================
-- إصلاح Security Definer Functions
-- ============================================

-- 1. إصلاح update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- 2. إصلاح touch_updated_at
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- 3. إصلاح is_admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles r
    WHERE r.user_id = auth.uid() AND r.role = 'admin'::app_role
  );
$function$;

-- ============================================
-- تنظيف error_logs القديمة (أكثر من 30 يوم)
-- ============================================

DELETE FROM public.error_logs 
WHERE created_at < NOW() - INTERVAL '30 days';

-- ============================================
-- إضافة indexes للأداء
-- ============================================

-- Index على maintenance_requests للبحث السريع
CREATE INDEX IF NOT EXISTS idx_maintenance_requests_status 
ON public.maintenance_requests(status);

CREATE INDEX IF NOT EXISTS idx_maintenance_requests_company 
ON public.maintenance_requests(company_id);

CREATE INDEX IF NOT EXISTS idx_maintenance_requests_created_at 
ON public.maintenance_requests(created_at DESC);

-- Index على error_logs
CREATE INDEX IF NOT EXISTS idx_error_logs_created_at 
ON public.error_logs(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_error_logs_level 
ON public.error_logs(level);

-- Index على notifications
CREATE INDEX IF NOT EXISTS idx_notifications_recipient 
ON public.notifications(recipient_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_notifications_read 
ON public.notifications(recipient_id, read_at);

-- ============================================
-- تحسين جدول profiles
-- ============================================

-- إضافة constraint للتأكد من وجود company_id
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_company_id_check;

COMMENT ON TABLE public.profiles IS 'بيانات المستخدمين الإضافية - يجب ربطها بـ company';

-- ============================================
-- تحسين جدول maintenance_requests
-- ============================================

COMMENT ON COLUMN public.maintenance_requests.company_id IS 'مطلوب - معرف الشركة';
COMMENT ON COLUMN public.maintenance_requests.branch_id IS 'مطلوب - معرف الفرع';