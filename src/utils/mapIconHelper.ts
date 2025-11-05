// Map category to icon file and color for branches
export const getBranchIcon = (): { icon: string; color: string } => {
  // All branches use shop icon - Blue
  return { icon: '/icons/pin-pro/pin-pro-49.svg', color: '#1800ad' };
};

// Map category to icon file and color for technicians
export const getTechnicianIcon = (specialization?: string): { icon: string; color: string } => {
  if (!specialization) {
    return { icon: '/icons/pin-pro/pin-pro-5.svg', color: '#faab11' }; // default technician - orange
  }

  const specLower = specialization.toLowerCase();

  // Technician/Worker icons - Orange
  if (specLower.includes('فني') || specLower.includes('عامل') || specLower.includes('صيانة')) {
    return { icon: '/icons/pin-pro/pin-pro-5.svg', color: '#faab11' };
  }

  // Repair/Fix icons - Orange
  if (specLower.includes('إصلاح') || specLower.includes('تصليح')) {
    return { icon: '/icons/pin-pro/pin-pro-14.svg', color: '#faab11' };
  }

  // Electrician - Orange
  if (specLower.includes('كهرب')) {
    return { icon: '/icons/pin-pro/pin-pro-4.svg', color: '#faab11' };
  }

  // Plumber - Orange
  if (specLower.includes('سباك')) {
    return { icon: '/icons/pin-pro/pin-pro-43.svg', color: '#faab11' };
  }

  // Default - Orange
  return { icon: '/icons/pin-pro/pin-pro-5.svg', color: '#faab11' };
};

// Parse location string to lat/lng
export const parseLocation = (location?: string): { lat: number; lng: number } | null => {
  if (!location) return null;

  try {
    // Try to parse JSON format: {"lat": 30.0444, "lng": 31.2357}
    const parsed = JSON.parse(location);
    if (parsed.lat && parsed.lng) {
      return { lat: parseFloat(parsed.lat), lng: parseFloat(parsed.lng) };
    }
  } catch {
    // Try to parse comma-separated format: "30.0444,31.2357"
    const parts = location.split(',');
    if (parts.length === 2) {
      const lat = parseFloat(parts[0].trim());
      const lng = parseFloat(parts[1].trim());
      if (!isNaN(lat) && !isNaN(lng)) {
        return { lat, lng };
      }
    }
  }

  return null;
};
