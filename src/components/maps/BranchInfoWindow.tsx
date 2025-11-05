import { MapPin, Phone } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface BranchInfoWindowProps {
  name: string;
  address?: string;
  phone?: string;
  openingHours?: string;
}

export const BranchInfoWindow = ({ 
  name, 
  address, 
  phone,
  openingHours 
}: BranchInfoWindowProps) => {
  return (
    <Card className="min-w-[250px] shadow-lg border-0">
      <CardContent className="p-4">
        <h3 className="font-bold text-lg mb-2">{name}</h3>
        {address && (
          <div className="flex items-start gap-2 mb-2">
            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-muted-foreground">{address}</p>
          </div>
        )}
        {phone && (
          <div className="flex items-center gap-2 mb-2">
            <Phone className="w-4 h-4 flex-shrink-0" />
            <p className="text-sm text-muted-foreground">{phone}</p>
          </div>
        )}
        {openingHours && (
          <p className="text-xs text-muted-foreground mt-2">
            {openingHours}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
