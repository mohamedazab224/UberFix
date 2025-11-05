import { ReactNode } from 'react';
import { useUserRoles } from '@/hooks/useUserRoles';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ShieldAlert } from 'lucide-react';

type AppRole = 'admin' | 'manager' | 'staff' | 'technician' | 'vendor' | 'customer' | 'dispatcher' | 'finance';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: AppRole[];
  fallback?: ReactNode;
  showError?: boolean;
}

export function RoleGuard({ 
  children, 
  allowedRoles, 
  fallback,
  showError = true 
}: RoleGuardProps) {
  const { roles, loading, hasAnyRole } = useUserRoles();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const hasAccess = hasAnyRole(allowedRoles);

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }

    if (showError) {
      return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <Alert variant="destructive">
            <ShieldAlert className="h-4 w-4" />
            <AlertDescription className="mr-2">
              <strong>غير مصرح</strong>
              <p className="mt-2">
                ليس لديك الصلاحيات الكافية للوصول إلى هذه الصفحة.
                يجب أن يكون لديك أحد الأدوار التالية: {allowedRoles.join(', ')}
              </p>
              <p className="mt-2 text-sm">
                الأدوار الحالية لديك: {roles.length > 0 ? roles.join(', ') : 'لا يوجد'}
              </p>
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return null;
  }

  return <>{children}</>;
}
