import { useState, useEffect } from 'react';
import { usePWA } from '@/hooks/usePWA';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, X, Bell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function PWAInstallPrompt() {
  const { canInstall, installApp, isInstalled, notificationPermission, requestNotificationPermission } = usePWA();
  const [showPrompt, setShowPrompt] = useState(false);
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Show install prompt after 30 seconds if not installed
    const timer = setTimeout(() => {
      if (canInstall && !isInstalled) {
        setShowPrompt(true);
      }
    }, 30000);

    return () => clearTimeout(timer);
  }, [canInstall, isInstalled]);

  useEffect(() => {
    // Show notification prompt after install
    if (isInstalled && notificationPermission === 'default') {
      setTimeout(() => {
        setShowNotificationPrompt(true);
      }, 3000);
    }
  }, [isInstalled, notificationPermission]);

  const handleInstall = async () => {
    const success = await installApp();
    if (success) {
      toast({
        title: "تم التثبيت بنجاح",
        description: "يمكنك الآن استخدام التطبيق من شاشتك الرئيسية",
      });
      setShowPrompt(false);
    }
  };

  const handleEnableNotifications = async () => {
    const permission = await requestNotificationPermission();
    if (permission === 'granted') {
      toast({
        title: "تم تفعيل الإشعارات",
        description: "سنرسل لك إشعارات بالتحديثات المهمة",
      });
      setShowNotificationPrompt(false);
    } else {
      toast({
        title: "لم يتم تفعيل الإشعارات",
        description: "يمكنك تفعيلها لاحقاً من الإعدادات",
        variant: "destructive"
      });
    }
  };

  if (!showPrompt && !showNotificationPrompt) {
    return null;
  }

  return (
    <>
      {showPrompt && (
        <div className="fixed bottom-4 right-4 left-4 z-50 max-w-md mx-auto animate-in slide-in-from-bottom">
          <Card className="border-primary shadow-lg">
            <CardHeader className="relative pb-3">
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-2 h-6 w-6"
                onClick={() => setShowPrompt(false)}
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2">
                <Download className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">ثبت التطبيق</CardTitle>
              </div>
              <CardDescription>
                احصل على تجربة أفضل مع التطبيق المثبت
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• الوصول السريع من الشاشة الرئيسية</li>
                <li>• العمل بدون اتصال بالإنترنت</li>
                <li>• أداء أفضل وتحميل أسرع</li>
              </ul>
              <Button 
                onClick={handleInstall} 
                className="w-full"
              >
                <Download className="ml-2 h-4 w-4" />
                تثبيت الآن
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {showNotificationPrompt && (
        <div className="fixed bottom-4 right-4 left-4 z-50 max-w-md mx-auto animate-in slide-in-from-bottom">
          <Card className="border-primary shadow-lg">
            <CardHeader className="relative pb-3">
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-2 h-6 w-6"
                onClick={() => setShowNotificationPrompt(false)}
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">تفعيل الإشعارات</CardTitle>
              </div>
              <CardDescription>
                احصل على إشعارات فورية بالتحديثات المهمة
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• إشعارات بحالة الطلبات</li>
                <li>• تنبيهات بالمواعيد المهمة</li>
                <li>• تحديثات النظام</li>
              </ul>
              <div className="flex gap-2">
                <Button 
                  onClick={handleEnableNotifications} 
                  className="flex-1"
                >
                  <Bell className="ml-2 h-4 w-4" />
                  تفعيل الإشعارات
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setShowNotificationPrompt(false)}
                >
                  لاحقاً
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
