// Google Maps Loader Utility - Uses Forge Proxy
// This file provides compatibility for legacy code that uses loadGoogleMaps

let loadPromise: Promise<void> | null = null;

// إضافة callback عالمي لتهيئة Google Maps
(window as any).initMap = () => {
  console.log('Google Maps initialized');
};

export const loadGoogleMaps = async (apiKey?: string): Promise<void> => {
  if (!loadPromise) {
    loadPromise = new Promise((resolve, reject) => {
      // Check if already loaded
      if (window.google && window.google.maps) {
        console.log('Google Maps already loaded');
        resolve();
        return;
      }

      const API_KEY = import.meta.env.VITE_FRONTEND_FORGE_API_KEY || 'AIzaSyBNqGzF5H9mYGZbKCaF3f8YPo8wX6qJpXs';
      const FORGE_BASE_URL = import.meta.env.VITE_FRONTEND_FORGE_API_URL || "https://forge.butterfly-effect.dev";
      const MAPS_PROXY_URL = `${FORGE_BASE_URL}/v1/maps/proxy`;

      const scriptUrl = `${MAPS_PROXY_URL}/maps/api/js?key=${API_KEY}&libraries=places,drawing,geometry,visualization,marker&callback=initMap&v=weekly`;
      
      console.log('Loading Google Maps from:', scriptUrl);
      
      fetch(scriptUrl, {
        method: 'GET',
        headers: { 
          'Origin': window.location.origin,
          'Accept': '*/*'
        },
      })
        .then(response => {
          console.log('Google Maps response status:', response.status);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.text();
        })
        .then(scriptContent => {
          console.log('Google Maps script loaded, length:', scriptContent.length);
          const script = document.createElement('script');
          script.textContent = scriptContent;
          script.setAttribute('data-source', 'google-maps');
          document.head.appendChild(script);
          
          // انتظار تحميل Google Maps
          const checkGoogle = setInterval(() => {
            if (window.google && window.google.maps) {
              console.log('Google Maps API ready');
              clearInterval(checkGoogle);
              resolve();
            }
          }, 100);
          
          setTimeout(() => {
            clearInterval(checkGoogle);
            if (!window.google || !window.google.maps) {
              reject(new Error('Google Maps failed to load within timeout'));
            }
          }, 15000); // زيادة المهلة إلى 15 ثانية
        })
        .catch(error => {
          console.error('Failed to fetch Google Maps script:', error);
          reject(error);
        });
    });
  }
  return loadPromise;
};

export const resetGoogleMapsLoader = () => {
  loadPromise = null;
};

// Compatibility export
export const getGoogleMapsLoader = () => ({ load: loadGoogleMaps });
