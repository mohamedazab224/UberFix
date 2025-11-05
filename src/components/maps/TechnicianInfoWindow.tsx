import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface TechnicianInfoWindowProps {
  name: string;
  specialization?: string;
  rating?: number;
  phone?: string;
}

export const TechnicianInfoWindow = ({ 
  name, 
  specialization, 
  rating = 5,
  phone 
}: TechnicianInfoWindowProps) => {
  return (
    <Card className="min-w-[200px] shadow-lg border-0">
      <CardContent className="p-4">
        <h3 className="font-bold text-lg mb-1">{name}</h3>
        {specialization && (
          <p className="text-sm text-muted-foreground mb-2">{specialization}</p>
        )}
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        {phone && (
          <p className="text-sm text-muted-foreground">{phone}</p>
        )}
      </CardContent>
    </Card>
  );
};
