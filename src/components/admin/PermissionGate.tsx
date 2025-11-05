import { ReactNode, useEffect, useState } from 'react';
import { useUserRoles } from '@/hooks/useUserRoles';

interface PermissionGateProps {
  children: ReactNode;
  resource: string;
  action: string;
  fallback?: ReactNode;
}

export function PermissionGate({ 
  children, 
  resource, 
  action, 
  fallback 
}: PermissionGateProps) {
  const { hasPermission, loading } = useUserRoles();
  const [canAccess, setCanAccess] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkPermission = async () => {
      if (!loading) {
        const result = await hasPermission(resource, action);
        setCanAccess(result);
        setChecking(false);
      }
    };

    checkPermission();
  }, [resource, action, loading, hasPermission]);

  if (loading || checking) {
    return null;
  }

  if (!canAccess) {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
}
