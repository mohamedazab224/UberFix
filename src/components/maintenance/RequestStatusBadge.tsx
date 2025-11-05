import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface RequestStatusBadgeProps {
  status: string;
  className?: string;
}

export function RequestStatusBadge({ status, className }: RequestStatusBadgeProps) {
  const statusConfig = {
    // حالات المهام القديمة
    pending: { label: "في الانتظار", variant: "secondary" as const },
    in_progress: { label: "قيد التنفيذ", variant: "default" as const },
    completed: { label: "مكتمل", variant: "default" as const },
    cancelled: { label: "ملغي", variant: "destructive" as const },
    
    // حالات دورة الحياة الجديدة
    draft: { label: "مسودة", variant: "outline" as const },
    submitted: { label: "مُقدم", variant: "secondary" as const },
    acknowledged: { label: "تم الاستلام", variant: "secondary" as const },
    assigned: { label: "تم التعيين", variant: "default" as const },
    scheduled: { label: "مجدول", variant: "default" as const },
    inspection: { label: "تحت الفحص", variant: "default" as const },
    waiting_parts: { label: "بانتظار قطع غيار", variant: "outline" as const },
    billed: { label: "تم إصدار فاتورة", variant: "default" as const },
    paid: { label: "مدفوع", variant: "default" as const },
    closed: { label: "مغلق", variant: "outline" as const },
    on_hold: { label: "معلق", variant: "outline" as const }
  };

  const config = statusConfig[status] || { label: status, variant: "outline" as const };

  return (
    <Badge 
      variant={config.variant}
      className={cn(
        "text-xs font-medium",
        status === 'completed' && "bg-green-600 hover:bg-green-700 text-primary-foreground",
        status === 'in_progress' && "bg-blue-600 hover:bg-blue-700 text-primary-foreground",
        status === 'pending' && "bg-yellow-600 hover:bg-yellow-700 text-primary-foreground",
        className
      )}
    >
      {config.label}
    </Badge>
  );
}
