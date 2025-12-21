-- Create pricing_items table
CREATE TABLE public.pricing_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price TEXT NOT NULL,
  image_url TEXT,
  category TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pricing_items ENABLE ROW LEVEL SECURITY;

-- Public read policy for active items
CREATE POLICY "Anyone can read active pricing items"
ON public.pricing_items
FOR SELECT
USING (is_active = true);

-- Admin full access policies
CREATE POLICY "Admins can insert pricing items"
ON public.pricing_items
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update pricing items"
ON public.pricing_items
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete pricing items"
ON public.pricing_items
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admin can read all items (including inactive)
CREATE POLICY "Admins can read all pricing items"
ON public.pricing_items
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_pricing_items_updated_at
BEFORE UPDATE ON public.pricing_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();