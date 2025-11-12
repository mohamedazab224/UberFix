/**
 * PWA Registration Handler
 * Simplified version for compatibility
 */

export function registerPWA() {
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        });
        
        console.log('SW registered:', registration);

        // Check for updates periodically
        setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000); // Check every hour

        // Listen for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New service worker available
                if (confirm('تحديث جديد متاح! هل تريد تحميله الآن؟')) {
                  window.location.reload();
                }
              }
            });
          }
        });
      } catch (error) {
        console.error('SW registration failed:', error);
      }
    });
  }
}
