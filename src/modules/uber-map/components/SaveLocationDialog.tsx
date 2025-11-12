import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/modules/uber-map/components/ui/input';
import { Textarea } from '@/modules/uber-map/components/ui/textarea';
import { MapPin, Save } from 'lucide-react';
import { useMapLocations } from '../hooks/useMapLocations';

interface SaveLocationDialogProps {
  latitude: number;
  longitude: number;
  onSaved?: () => void;
}

export const SaveLocationDialog = ({ latitude, longitude, onSaved }: SaveLocationDialogProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const { addLocation } = useMapLocations();

  const handleSave = async () => {
    try {
      await addLocation({
        name,
        description,
        latitude,
        longitude,
        address,
        location_type: 'custom',
        metadata: {},
      });
      
      setName('');
      setDescription('');
      setAddress('');
      setOpen(false);
      onSaved?.();
    } catch (error) {
      console.error('Error saving location:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Save className="h-4 w-4" />
          حفظ الموقع
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            حفظ موقع جديد
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium">
              اسم الموقع
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="أدخل اسم الموقع"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="address" className="text-sm font-medium">
              العنوان
            </label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="أدخل العنوان"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="description" className="text-sm font-medium">
              الوصف
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="أدخل وصف الموقع"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
            <div>
              <span className="font-medium">خط الطول:</span> {longitude.toFixed(6)}
            </div>
            <div>
              <span className="font-medium">خط العرض:</span> {latitude.toFixed(6)}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            إلغاء
          </Button>
          <Button onClick={handleSave} disabled={!name}>
            <Save className="h-4 w-4 ml-2" />
            حفظ
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
