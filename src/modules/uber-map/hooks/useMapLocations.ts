import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface MapLocation {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  address?: string;
  location_type: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export interface MapMarker {
  id: string;
  user_id: string;
  location_id?: string;
  title: string;
  description?: string;
  marker_type: string;
  icon?: string;
  color: string;
  latitude: number;
  longitude: number;
  is_active: boolean;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export const useMapLocations = () => {
  const [locations, setLocations] = useState<MapLocation[]>([]);
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchLocations = async () => {
    try {
      const { data, error } = await supabase
        .from('map_locations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLocations(data || []);
    } catch (error: any) {
      toast({
        title: 'خطأ في تحميل المواقع',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const fetchMarkers = async () => {
    try {
      const { data, error } = await supabase
        .from('map_markers')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMarkers(data || []);
    } catch (error: any) {
      toast({
        title: 'خطأ في تحميل العلامات',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addLocation = async (location: Omit<MapLocation, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('يجب تسجيل الدخول');

      const { data, error } = await supabase
        .from('map_locations')
        .insert([{ ...location, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      
      setLocations(prev => [data, ...prev]);
      toast({
        title: 'تم إضافة الموقع',
        description: 'تم حفظ الموقع بنجاح',
      });
      
      return data;
    } catch (error: any) {
      toast({
        title: 'خطأ في إضافة الموقع',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const addMarker = async (marker: Omit<MapMarker, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('يجب تسجيل الدخول');

      const { data, error } = await supabase
        .from('map_markers')
        .insert([{ ...marker, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      
      setMarkers(prev => [data, ...prev]);
      toast({
        title: 'تم إضافة العلامة',
        description: 'تم حفظ العلامة بنجاح',
      });
      
      return data;
    } catch (error: any) {
      toast({
        title: 'خطأ في إضافة العلامة',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const deleteLocation = async (id: string) => {
    try {
      const { error } = await supabase
        .from('map_locations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setLocations(prev => prev.filter(loc => loc.id !== id));
      toast({
        title: 'تم حذف الموقع',
        description: 'تم حذف الموقع بنجاح',
      });
    } catch (error: any) {
      toast({
        title: 'خطأ في حذف الموقع',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const deleteMarker = async (id: string) => {
    try {
      const { error } = await supabase
        .from('map_markers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setMarkers(prev => prev.filter(marker => marker.id !== id));
      toast({
        title: 'تم حذف العلامة',
        description: 'تم حذف العلامة بنجاح',
      });
    } catch (error: any) {
      toast({
        title: 'خطأ في حذف العلامة',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchLocations();
    fetchMarkers();
  }, []);

  return {
    locations,
    markers,
    loading,
    addLocation,
    addMarker,
    deleteLocation,
    deleteMarker,
    refetch: () => {
      fetchLocations();
      fetchMarkers();
    },
  };
};
