// Property type to icon mapping
// يتم تعيين الأيقونة تلقائياً حسب نوع العقار
export const getPropertyIcon = (type: string): string => {
  const iconMap: Record<string, string> = {
    residential: '/icons/properties/residential.svg',
    commercial: '/icons/properties/commercial.svg',
    industrial: '/icons/properties/Industrial.svg',
    office: '/icons/properties/office.svg',
    retail: '/icons/properties/retail.svg',
    mixed_use: '/icons/properties/mixed_use.svg',
  };

  return iconMap[type] || iconMap.residential;
};

// Get property type label in Arabic
export const getPropertyTypeLabel = (type: string): string => {
  const labelMap: Record<string, string> = {
    residential: 'سكني',
    commercial: 'تجاري',
    industrial: 'صناعي',
    office: 'مكتبي',
    retail: 'تجزئة',
    mixed_use: 'متعدد الاستخدام',
  };

  return labelMap[type] || type;
};

// Get all property types with their icons and labels
export const getPropertyTypes = () => [
  { value: 'residential', label: 'سكني', icon: '/icons/properties/residential.svg' },
  { value: 'commercial', label: 'تجاري', icon: '/icons/properties/commercial.svg' },
  { value: 'industrial', label: 'صناعي', icon: '/icons/properties/Industrial.svg' },
  { value: 'office', label: 'مكتبي', icon: '/icons/properties/office.svg' },
  { value: 'retail', label: 'تجزئة', icon: '/icons/properties/retail.svg' },
  { value: 'mixed_use', label: 'متعدد الاستخدام', icon: '/icons/properties/mixed_use.svg' },
];
