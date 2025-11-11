import { useEffect, useRef, useState } from "react";
import { MapPin, Wrench, Building2, Zap, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { VendorsList, vendors, type Vendor } from "./VendorsList";

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
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [apiKey, setApiKey] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const markersRef = useRef<any[]>([]);

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

        // Add vendor markers with custom icons
        vendors.forEach((vendor) => {
          const markerDiv = document.createElement('div');
          markerDiv.className = 'relative vendor-marker';
          
          // Get specialty color
          let gradientColor = 'from-yellow-400 to-yellow-600';
          let iconSvg = '<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>';
          
          switch (vendor.specialty.toLowerCase()) {
            case 'سباك':
              gradientColor = 'from-blue-400 to-blue-600';
              iconSvg = '<path d="M12 2c-4 0-8 .5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h2l1.5-1.5h5L16 21v-.5l-1.5-1.5c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-4-4-8-4z"/>';
              break;
            case 'كهربائي':
              gradientColor = 'from-yellow-400 to-yellow-600';
              iconSvg = '<path d="M7 2v11h3v9l7-12h-4l4-8z"/>';
              break;
            case 'نجار':
              gradientColor = 'from-amber-400 to-amber-600';
              iconSvg = '<path d="M13 10h8v2h-8zm0-4h8v2h-8zm0 8h8v2h-8zM3 10h8v2H3zm0-4h8v2H3zm0 8h8v2H3z"/>';
              break;
            case 'دهان':
              gradientColor = 'from-purple-400 to-purple-600';
              iconSvg = '<path d="M18 4V3c0-.55-.45-1-1-1H5c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V6h1v4H9v11c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-9h8V4h-3z"/>';
              break;
            case 'فني تكييف':
              gradientColor = 'from-cyan-400 to-cyan-600';
              iconSvg = '<path d="M6.59 3.41L5 5l7 7-7 7 1.59 1.59L12 15.17l5.41 5.42L19 19l-7-7 7-7-1.59-1.59L12 8.83z"/>';
              break;
          }
          
          markerDiv.innerHTML = `
            <div class="relative group cursor-pointer">
              ${vendor.available ? `
                <div class="absolute inset-0 rounded-full bg-primary/30 animate-pulse-ring"></div>
                <div class="absolute inset-0 rounded-full bg-primary/20 animate-pulse-ring" style="animation-delay: 0.5s;"></div>
              ` : ''}
              
              <div class="relative w-12 h-12 rounded-full bg-gradient-to-br ${gradientColor}
                          shadow-lg border-4 border-white flex items-center justify-center
                          ${vendor.available ? 'animate-pulse-soft' : 'opacity-70'} hover:scale-110 transition-transform">
                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  ${iconSvg}
                </svg>
              </div>
              
              <div class="absolute -top-20 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 
                          transition-opacity bg-white px-3 py-2 rounded-lg shadow-xl whitespace-nowrap text-sm z-10 min-w-[180px]">
                <div class="font-bold text-foreground">${vendor.name}</div>
                <div class="text-xs text-muted-foreground">${vendor.specialty}</div>
                <div class="flex items-center gap-1 mt-1">
                  <svg class="w-3 h-3 fill-yellow-400" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                  <span class="text-xs font-bold">${vendor.rating}</span>
                  <span class="text-xs text-muted-foreground">(${vendor.reviews})</span>
                </div>
                <div class="text-xs text-primary font-bold mt-1">ج.م ${vendor.hourlyRate}/ساعة</div>
                ${vendor.available ? 
                  '<div class="text-xs text-green-600 font-medium mt-1">✓ متاح الآن</div>' : 
                  '<div class="text-xs text-gray-500 mt-1">مشغول</div>'
                }
              </div>
            </div>
          `;

          const marker = new window.google.maps.marker.AdvancedMarkerElement({
            map: mapInstance,
            position: { lat: vendor.lat, lng: vendor.lng },
            content: markerDiv,
            title: vendor.name
          });

          markersRef.current.push(marker);

          markerDiv.addEventListener('click', () => {
            setSelectedVendor(vendor);
            mapInstance.panTo({ lat: vendor.lat, lng: vendor.lng });
            mapInstance.setZoom(12);
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

  const handleVendorSelect = (vendor: Vendor) => {
    if (map) {
      map.panTo({ lat: vendor.lat, lng: vendor.lng });
      map.setZoom(14);
      setSelectedVendor(vendor);
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* Vendors List Drawer */}
      <VendorsList onVendorSelect={handleVendorSelect} />

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

      {/* Selected Vendor Info */}
      {selectedVendor && (
        <div className="absolute bottom-4 left-4 bg-white rounded-xl p-4 shadow-xl max-w-sm animate-float border-2 border-primary/20">
          <button 
            onClick={() => setSelectedVendor(null)}
            className="absolute top-2 left-2 w-6 h-6 rounded-full bg-muted/50 hover:bg-muted 
                     flex items-center justify-center text-muted-foreground hover:text-foreground
                     transition-colors text-sm font-bold"
          >
            ✕
          </button>
          
          <div className="flex items-start gap-3 mb-3">
            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${
              selectedVendor.specialty === 'سباك' ? 'from-blue-400 to-blue-600' :
              selectedVendor.specialty === 'كهربائي' ? 'from-yellow-400 to-yellow-600' :
              selectedVendor.specialty === 'نجار' ? 'from-amber-400 to-amber-600' :
              selectedVendor.specialty === 'دهان' ? 'from-purple-400 to-purple-600' :
              selectedVendor.specialty === 'فني تكييف' ? 'from-cyan-400 to-cyan-600' :
              'from-gray-400 to-gray-600'
            } flex items-center justify-center shadow-lg border-2 border-white text-white font-bold text-lg`}>
              {selectedVendor.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-lg">{selectedVendor.name}</h4>
              <p className="text-sm text-muted-foreground">{selectedVendor.specialty}</p>
              <div className="flex items-center gap-1 mt-1">
                <svg className="w-4 h-4 fill-yellow-400" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
                <span className="text-sm font-bold">{selectedVendor.rating}</span>
                <span className="text-xs text-muted-foreground">({selectedVendor.reviews} تقييم)</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 mb-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">المسافة:</span>
              <span className="font-medium">{selectedVendor.distance} كم</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">السعر:</span>
              <span className="font-bold text-primary">ج.م {selectedVendor.hourlyRate}/ساعة</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">الحالة:</span>
              <span className={`font-medium ${selectedVendor.available ? 'text-green-600' : 'text-gray-500'}`}>
                {selectedVendor.available ? '✓ متاح الآن' : 'مشغول'}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <a 
              href={`tel:${selectedVendor.phone}`}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary 
                       text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors 
                       text-sm font-medium shadow-sm"
            >
              <Phone className="h-4 w-4" />
              اتصال
            </a>
            <button 
              onClick={() => window.location.href = '/requests?vendor=' + selectedVendor.id}
              className="flex-1 px-4 py-2.5 bg-secondary text-secondary-foreground rounded-lg 
                       hover:bg-secondary/80 transition-colors text-sm font-medium"
            >
              طلب خدمة
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
