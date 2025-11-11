import { useEffect, useRef, useState } from "react";
import { MapPin, Wrench, Building2, Zap, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ServiceLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: 'maintenance' | 'construction' | 'electrical';
  projects: number;
}

const serviceLocations: ServiceLocation[] = [
  { id: '1', name: 'القاهرة', lat: 30.0444, lng: 31.2357, type: 'construction', projects: 156 },
  { id: '2', name: 'الإسكندرية', lat: 31.2001, lng: 29.9187, type: 'maintenance', projects: 98 },
  { id: '3', name: 'الجيزة', lat: 30.0131, lng: 31.2089, type: 'electrical', projects: 142 },
  { id: '4', name: 'شبرا الخيمة', lat: 30.1286, lng: 31.2422, type: 'maintenance', projects: 67 },
  { id: '5', name: '6 أكتوبر', lat: 29.9668, lng: 30.9171, type: 'construction', projects: 89 },
  { id: '6', name: 'المنصورة', lat: 31.0409, lng: 31.3785, type: 'electrical', projects: 54 },
  { id: '7', name: 'طنطا', lat: 30.7865, lng: 31.0004, type: 'maintenance', projects: 43 },
  { id: '8', name: 'الزقازيق', lat: 30.5852, lng: 31.5021, type: 'construction', projects: 38 },
];

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

export const InteractiveMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<ServiceLocation | null>(null);
  const [apiKey, setApiKey] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-maps-key');
        if (error) throw error;
        if (data?.apiKey) {
          setApiKey(data.apiKey);
        }
      } catch (error) {
        console.error('Error fetching Maps API key:', error);
        setIsLoading(false);
      }
    };

    fetchApiKey();
  }, []);

  useEffect(() => {
    if (!apiKey || !mapRef.current) return;

    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        initializeMap();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,marker&v=weekly`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      script.onerror = () => {
        console.error('Error loading Google Maps');
        setIsLoading(false);
      };
      document.head.appendChild(script);
    };

    const initializeMap = async () => {
      if (!mapRef.current || !window.google) return;

      try {
        const mapInstance = new window.google.maps.Map(mapRef.current, {
          center: { lat: 30.0444, lng: 31.2357 },
          zoom: 7,
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          mapId: '8e0a97af9386fef',
        });

        setMap(mapInstance);
        setIsLoading(false);

        // Add markers with pulse effect
        serviceLocations.forEach((location) => {
          const markerDiv = document.createElement('div');
          markerDiv.className = 'relative';
          markerDiv.innerHTML = `
            <div class="relative group cursor-pointer">
              <div class="absolute inset-0 rounded-full bg-primary/30 animate-pulse-ring"></div>
              <div class="absolute inset-0 rounded-full bg-primary/20 animate-pulse-ring" style="animation-delay: 0.5s;"></div>
              
              <div class="relative w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 
                          shadow-lg border-4 border-white flex items-center justify-center
                          animate-pulse-soft hover:scale-110 transition-transform">
                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              </div>
              
              <div class="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 
                          transition-opacity bg-white px-3 py-1 rounded-lg shadow-lg whitespace-nowrap text-sm font-medium z-10">
                ${location.name}
                <div class="text-xs text-yellow-600">${location.projects} مشروع</div>
              </div>
            </div>
          `;

          const marker = new window.google.maps.marker.AdvancedMarkerElement({
            map: mapInstance,
            position: { lat: location.lat, lng: location.lng },
            content: markerDiv,
            title: location.name
          });

          markerDiv.addEventListener('click', () => {
            setSelectedLocation(location);
            mapInstance.panTo({ lat: location.lat, lng: location.lng });
            mapInstance.setZoom(10);
          });
        });
      } catch (error) {
        console.error('Error initializing map:', error);
        setIsLoading(false);
      }
    };

    loadGoogleMaps();
  }, [apiKey]);

  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'construction':
        return <Building2 className="h-4 w-4" />;
      case 'electrical':
        return <Zap className="h-4 w-4" />;
      default:
        return <Wrench className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-full rounded-2xl bg-muted/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">جاري تحميل الخريطة...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {/* Map Container */}
      <div 
        ref={mapRef} 
        className="w-full h-full rounded-2xl shadow-2xl overflow-hidden border-4 border-white/50 animate-glow"
      />

      {/* Decorative Elements */}
      <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/10 rounded-full blur-2xl animate-pulse-soft"></div>
      <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-secondary/10 rounded-full blur-2xl animate-pulse-soft" style={{ animationDelay: '1s' }}></div>

      {/* Floating Info Cards */}
      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg max-w-xs animate-float">
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="h-5 w-5 text-primary animate-pulse-soft" />
          <h3 className="font-bold text-sm">مواقع خدماتنا</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          نخدم أكثر من 8 مدن رئيسية في مصر
        </p>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1">
              <Building2 className="h-3 w-3 text-primary" />
              تجهيز محلات
            </span>
            <span className="font-bold">283 مشروع</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1">
              <Wrench className="h-3 w-3 text-primary" />
              صيانة
            </span>
            <span className="font-bold">208 مشروع</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1">
              <Zap className="h-3 w-3 text-primary" />
              كهرباء
            </span>
            <span className="font-bold">196 مشروع</span>
          </div>
        </div>
      </div>

      {/* Quick Contact Button */}
      <div className="absolute bottom-4 right-4 group">
        <a 
          href="tel:+201234567890"
          className="bg-gradient-to-r from-primary to-primary-dark text-white px-6 py-3 rounded-full 
                   shadow-lg hover:shadow-xl transition-all flex items-center gap-2
                   animate-pulse-soft hover:scale-105"
        >
          <Phone className="h-4 w-4" />
          <span className="font-medium text-sm">اتصل بنا الآن</span>
        </a>
      </div>

      {/* Selected Location Info */}
      {selectedLocation && (
        <div className="absolute bottom-4 left-4 bg-white rounded-xl p-4 shadow-lg max-w-xs animate-float">
          <button 
            onClick={() => setSelectedLocation(null)}
            className="absolute top-2 left-2 text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
          
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              {getLocationIcon(selectedLocation.type)}
            </div>
            <div>
              <h4 className="font-bold">{selectedLocation.name}</h4>
              <p className="text-sm text-muted-foreground">
                {selectedLocation.projects} مشروع منجز
              </p>
              <button 
                onClick={() => window.location.href = '/projects'}
                className="mt-2 text-xs text-primary hover:underline"
              >
                عرض المشاريع ←
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
