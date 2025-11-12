import { MapView } from '@/modules/uber-map/components/Map';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useLocation } from 'wouter';

export default function UberMapTest() {
  const [, setLocation] = useLocation();
  const [markers, setMarkers] = useState<any[]>([]);

  const handleMapReady = (map: any) => {
    console.log('Map ready:', map);
    
    // Add example markers
    const testMarkers = [
      {
        position: { lat: 37.7749, lng: -122.4194 },
        title: 'San Francisco',
      },
      {
        position: { lat: 37.7849, lng: -122.4094 },
        title: 'Marker 2',
      },
    ];

    testMarkers.forEach(marker => {
      new window.google.maps.marker.AdvancedMarkerElement({
        map,
        position: marker.position,
        title: marker.title,
      });
    });

    setMarkers(testMarkers);
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="container mx-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">اختبار مديول Uber Map</h1>
            <p className="text-muted-foreground">
              صفحة تجريبية لاختبار مكونات الخريطة التفاعلية وتتبع الموقع الحي
            </p>
          </div>
          <Button onClick={() => setLocation('/dashboard')}>
            العودة للوحة التحكم
          </Button>
        </div>

        <div className="grid gap-6">
          {/* Map Component */}
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-xl font-semibold mb-4">خريطة تفاعلية</h2>
            <MapView
              center={{ lat: 37.7749, lng: -122.4194 }}
              zoom={13}
              className="w-full h-[600px] rounded-lg overflow-hidden"
              onMapReady={handleMapReady}
            />
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">
                عدد العلامات: {markers.length}
              </p>
            </div>
          </div>

          {/* Features Info */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="rounded-lg border bg-card p-4">
              <h3 className="font-semibold mb-2">🗺️ خريطة Google Maps</h3>
              <p className="text-sm text-muted-foreground">
                تكامل كامل مع Google Maps API مع دعم المكتبات المتقدمة
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <h3 className="font-semibold mb-2">📍 تتبع الموقع</h3>
              <p className="text-sm text-muted-foreground">
                تتبع الموقع الحي للفنيين والمركبات في الوقت الفعلي
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <h3 className="font-semibold mb-2">🎯 علامات مخصصة</h3>
              <p className="text-sm text-muted-foreground">
                إضافة علامات مخصصة مع معلومات تفصيلية وأيقونات ملونة
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold mb-4">صفحات المديول</h3>
            <div className="grid md:grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                onClick={() => setLocation('/uber-map')}
                className="justify-start"
              >
                الخريطة الرئيسية
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setLocation('/uber-map/quick-request')}
                className="justify-start"
              >
                طلب سريع
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setLocation('/uber-map/track-orders')}
                className="justify-start"
              >
                تتبع الطلبات
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setLocation('/uber-map/invoices')}
                className="justify-start"
              >
                الفواتير
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
