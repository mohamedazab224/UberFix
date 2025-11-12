-- Create table for map locations
CREATE TABLE IF NOT EXISTS public.map_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  address TEXT,
  location_type TEXT DEFAULT 'custom',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create table for map markers
CREATE TABLE IF NOT EXISTS public.map_markers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  location_id UUID REFERENCES public.map_locations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  marker_type TEXT DEFAULT 'pin',
  icon TEXT,
  color TEXT DEFAULT '#3b82f6',
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.map_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.map_markers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for map_locations
CREATE POLICY "Users can view their own locations"
  ON public.map_locations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own locations"
  ON public.map_locations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own locations"
  ON public.map_locations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own locations"
  ON public.map_locations FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for map_markers
CREATE POLICY "Users can view their own markers"
  ON public.map_markers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own markers"
  ON public.map_markers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own markers"
  ON public.map_markers FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own markers"
  ON public.map_markers FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_map_locations_user_id ON public.map_locations(user_id);
CREATE INDEX IF NOT EXISTS idx_map_locations_coords ON public.map_locations(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_map_markers_user_id ON public.map_markers(user_id);
CREATE INDEX IF NOT EXISTS idx_map_markers_location_id ON public.map_markers(location_id);
CREATE INDEX IF NOT EXISTS idx_map_markers_coords ON public.map_markers(latitude, longitude);

-- Trigger for updated_at
CREATE TRIGGER update_map_locations_updated_at
  BEFORE UPDATE ON public.map_locations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_map_markers_updated_at
  BEFORE UPDATE ON public.map_markers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();