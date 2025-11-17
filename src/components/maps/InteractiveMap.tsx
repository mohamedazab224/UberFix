import { useEffect, useState } from "react";
import { MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface InteractiveMapProps {
  latitude: number;
  longitude: number;
  onLocationChange?: (lat: number, lng: number, address?: string) => void;
  height?: string;
  className?: string;
}

export function InteractiveMap({
  latitude,
  longitude,
  onLocationChange,
  height = "400px",
  className = "",
}: InteractiveMapProps) {
  const [lat, setLat] = useState(latitude.toString());
  const [lng, setLng] = useState(longitude.toString());

  useEffect(() => {
    setLat(latitude.toString());
    setLng(longitude.toString());
  }, [latitude, longitude]);

  const handleUpdate = () => {
    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);

    if (isNaN(parsedLat) || isNaN(parsedLng)) {
      toast.error("الرجاء إدخال أرقام صحيحة");
      return;
    }

    onLocationChange?.(parsedLat, parsedLng);
    toast.success("تم تحديث الموقع");
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("المتصفح لا يدعم تحديد الموقع");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLat = position.coords.latitude;
        const newLng = position.coords.longitude;
        setLat(newLat.toString());
        setLng(newLng.toString());
        onLocationChange?.(newLat, newLng);
        toast.success("تم تحديد موقعك الحالي");
      },
      (error) => {
        console.error("Error getting location:", error);
        toast.error("فشل تحديد الموقع الحالي");
      }
    );
  };

  return (
    <Card className={className}>
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">الموقع على الخريطة</h3>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCurrentLocation}
          >
            <Navigation className="h-4 w-4 ml-1" />
            موقعي الحالي
          </Button>
        </div>

        {/* خريطة تفاعلية مرئية */}
        <div 
          style={{ height, width: "100%" }}
          className="rounded-lg border-2 border-primary/20 overflow-hidden relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950"
        >
          {/* شبكة الخريطة */}
          <div className="absolute inset-0 opacity-10">
            <div className="grid grid-cols-8 grid-rows-8 h-full w-full">
              {Array.from({ length: 64 }).map((_, i) => (
                <div key={i} className="border border-primary/30"></div>
              ))}
            </div>
          </div>

          {/* المحتوى المركزي */}
          <div className="relative h-full flex flex-col items-center justify-center p-6">
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse"></div>
              <MapPin className="h-16 w-16 text-primary relative z-10 drop-shadow-lg" />
            </div>
            
            <div className="bg-background/95 backdrop-blur-md rounded-lg px-6 py-3 shadow-lg border border-primary/10">
              <p className="text-sm font-semibold text-primary mb-1">📍 الإحداثيات الجغرافية</p>
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="text-muted-foreground">
                  <span className="font-semibold">العرض:</span> {parseFloat(lat).toFixed(6)}°
                </span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">
                  <span className="font-semibold">الطول:</span> {parseFloat(lng).toFixed(6)}°
                </span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground mt-4 text-center max-w-xs">
              استخدم زر "موقعي الحالي" أعلاه لتحديد موقعك تلقائياً
            </p>
          </div>

          {/* علامات الاتجاهات */}
          <div className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm rounded px-2 py-1 text-xs font-semibold text-muted-foreground">
            شمال ↑
          </div>
        </div>
      </div>
    </Card>
  );
}
