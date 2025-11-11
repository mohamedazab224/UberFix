// Singleton for Google Maps loading
let loadPromise: Promise<void> | null = null;

export const loadGoogleMaps = async (apiKey: string): Promise<void> => {
  if (!loadPromise) {
    loadPromise = new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry&language=ar&region=EG`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      document.head.appendChild(script);
    });
  }
  return loadPromise;
};

export const resetGoogleMapsLoader = () => {
  loadPromise = null;
};
