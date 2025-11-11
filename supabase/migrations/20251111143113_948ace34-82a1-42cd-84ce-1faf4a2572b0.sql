
-- إزالة my_view لأنها غير ضرورية ومكررة
-- يمكن الاستعلام مباشرة من maintenance_requests مع احترام RLS
DROP VIEW IF EXISTS public.my_view;

-- إعادة إنشاء dashboard_stats و monthly_stats بوضوح مع SECURITY DEFINER
-- لأنها تحتاج عرض إحصائيات إجمالية لجميع الطلبات
DROP VIEW IF EXISTS public.dashboard_stats;
CREATE VIEW public.dashboard_stats 
WITH (security_invoker=false) -- SECURITY DEFINER
AS
SELECT 
  COUNT(*) FILTER (WHERE status = 'Open'::mr_status) AS pending_requests,
  COUNT(*) FILTER (WHERE DATE(created_at) = CURRENT_DATE) AS today_requests,
  COUNT(*) FILTER (WHERE status = 'Completed'::mr_status) AS completed_requests,
  COUNT(*) AS total_requests,
  COUNT(*) FILTER (WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE::timestamp with time zone)) AS this_month_requests,
  COALESCE(SUM(estimated_cost) FILTER (WHERE status <> 'Cancelled'::mr_status), 0) AS total_budget,
  COALESCE(SUM(actual_cost) FILTER (WHERE status = 'Completed'::mr_status), 0) AS actual_cost,
  ROUND(COUNT(*) FILTER (WHERE status = 'Completed'::mr_status)::numeric / NULLIF(COUNT(*), 0)::numeric * 100, 2) AS completion_rate,
  ROUND(AVG(EXTRACT(epoch FROM (updated_at - created_at)) / 86400) FILTER (WHERE status = 'Completed'::mr_status), 2) AS avg_completion_days,
  COUNT(*) FILTER (WHERE priority = 'high') AS high_priority_count,
  COUNT(*) FILTER (WHERE priority = 'medium') AS medium_priority_count,
  COUNT(*) FILTER (WHERE priority = 'low') AS low_priority_count,
  COUNT(*) FILTER (WHERE workflow_stage = 'submitted') AS submitted_count,
  COUNT(*) FILTER (WHERE workflow_stage = 'assigned') AS assigned_count,
  COUNT(*) FILTER (WHERE workflow_stage = 'in_progress') AS in_progress_count,
  COUNT(*) FILTER (WHERE workflow_stage = 'completed') AS workflow_completed_count,
  MAX(updated_at) AS last_updated
FROM maintenance_requests
WHERE archived_at IS NULL;

DROP VIEW IF EXISTS public.monthly_stats;
CREATE VIEW public.monthly_stats
WITH (security_invoker=false) -- SECURITY DEFINER
AS
SELECT 
  DATE_TRUNC('month', created_at) AS month,
  COUNT(*) AS total_requests,
  COUNT(*) FILTER (WHERE status = 'Completed'::mr_status) AS completed_requests,
  COUNT(*) FILTER (WHERE status = 'Open'::mr_status) AS pending_requests,
  COALESCE(SUM(estimated_cost), 0) AS total_estimated,
  COALESCE(SUM(actual_cost), 0) AS total_actual,
  ROUND(COUNT(*) FILTER (WHERE status = 'Completed'::mr_status)::numeric / NULLIF(COUNT(*), 0)::numeric * 100, 2) AS completion_rate
FROM maintenance_requests
WHERE archived_at IS NULL 
  AND created_at >= DATE_TRUNC('year', CURRENT_DATE::timestamp with time zone)
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY DATE_TRUNC('month', created_at) DESC;

-- إعادة إنشاء vw_cities_public بدون SECURITY DEFINER (بيانات عامة)
DROP VIEW IF EXISTS public.vw_cities_public;
CREATE VIEW public.vw_cities_public
WITH (security_invoker=true) -- بدون SECURITY DEFINER
AS
SELECT id, name_ar
FROM cities;

COMMENT ON VIEW public.dashboard_stats IS 'إحصائيات Dashboard - تستخدم SECURITY DEFINER لعرض جميع الطلبات';
COMMENT ON VIEW public.monthly_stats IS 'إحصائيات شهرية - تستخدم SECURITY DEFINER لعرض جميع الطلبات';
COMMENT ON VIEW public.vw_cities_public IS 'بيانات المدن العامة - بدون SECURITY DEFINER';
