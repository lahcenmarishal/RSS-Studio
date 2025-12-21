import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Upload, Loader2 } from 'lucide-react';
import { z } from 'zod';

const pricingSchema = z.object({
  title: z.string().min(1, "Le titre est requis").max(200),
  description: z.string().max(2000).optional(),
  price: z.string().min(1, "Le prix est requis").max(100),
  image_url: z.string().url("URL d'image invalide").optional().or(z.literal('')),
  category: z.string().max(100).optional(),
  display_order: z.number().int().min(0).optional(),
  is_active: z.boolean().optional(),
});

const AdminTarifs = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditing = id && id !== 'new';

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    image_url: '',
    category: '',
    display_order: 0,
    is_active: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);

  // Fetch existing pricing item if editing
  const { data: pricingItem, isLoading: itemLoading } = useQuery({
    queryKey: ['pricing-item', id],
    queryFn: async () => {
      if (!isEditing) return null;
      const { data, error } = await supabase
        .from('pricing_items')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: isEditing && isAdmin,
  });

  // Populate form when editing
  useEffect(() => {
    if (pricingItem) {
      setFormData({
        title: pricingItem.title || '',
        description: pricingItem.description || '',
        price: pricingItem.price || '',
        image_url: pricingItem.image_url || '',
        category: pricingItem.category || '',
        display_order: pricingItem.display_order || 0,
        is_active: pricingItem.is_active ?? true,
      });
    }
  }, [pricingItem]);

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/admin/auth');
    }
  }, [authLoading, isAdmin, navigate]);

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const validation = pricingSchema.safeParse(data);
      if (!validation.success) {
        const fieldErrors: Record<string, string> = {};
        validation.error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(fieldErrors);
        throw new Error('Validation failed');
      }

      setErrors({});

      const payload = {
        title: data.title,
        description: data.description || null,
        price: data.price,
        image_url: data.image_url || null,
        category: data.category || null,
        display_order: data.display_order,
        is_active: data.is_active,
      };

      if (isEditing) {
        const { error } = await supabase
          .from('pricing_items')
          .update(payload)
          .eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('pricing_items')
          .insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pricing'] });
      toast({
        title: isEditing ? 'Tarif mis à jour' : 'Tarif créé',
        description: 'Les modifications ont été enregistrées.',
      });
      navigate('/admin');
    },
    onError: (error: Error) => {
      if (error.message !== 'Validation failed') {
        toast({
          title: 'Erreur',
          description: 'Une erreur est survenue lors de l\'enregistrement.',
          variant: 'destructive',
        });
      }
    },
  });

  // Image upload handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Erreur',
        description: 'Veuillez sélectionner une image.',
        variant: 'destructive',
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Erreur',
        description: 'L\'image ne doit pas dépasser 5 Mo.',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `pricing/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('project-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('project-images')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, image_url: publicUrl }));
      toast({
        title: 'Image uploadée',
        description: 'L\'image a été uploadée avec succès.',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Erreur lors de l\'upload de l\'image.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (authLoading || (isEditing && itemLoading)) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-primary py-6 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="font-serif text-2xl text-primary-foreground">
            {isEditing ? 'Modifier le tarif' : 'Nouveau tarif'}
          </h1>
          <Button
            variant="ghost"
            onClick={() => navigate('/admin')}
            className="text-primary-foreground/80 hover:text-primary-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
        </div>
      </header>

      {/* Form */}
      <main className="py-12 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-soft p-8">
          <div className="space-y-6">
            {/* Image Upload */}
            <div>
              <label className="block font-sans text-sm font-medium text-foreground mb-2">
                Image
              </label>
              <div className="flex items-start gap-4">
                {formData.image_url && (
                  <img 
                    src={formData.image_url} 
                    alt="Preview" 
                    className="w-32 h-24 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <label className="flex items-center justify-center gap-2 border-2 border-dashed border-muted rounded-lg p-6 cursor-pointer hover:border-accent transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                    {isUploading ? (
                      <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                    ) : (
                      <Upload className="w-5 h-5 text-muted-foreground" />
                    )}
                    <span className="text-sm text-muted-foreground">
                      {isUploading ? 'Upload en cours...' : 'Cliquez pour uploader'}
                    </span>
                  </label>
                  <p className="text-xs text-muted-foreground mt-2">
                    Ou entrez l'URL de l'image ci-dessous
                  </p>
                  <Input
                    type="url"
                    placeholder="https://..."
                    value={formData.image_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                    className="mt-2"
                  />
                  {errors.image_url && (
                    <p className="text-sm text-destructive mt-1">{errors.image_url}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block font-sans text-sm font-medium text-foreground mb-2">
                Titre *
              </label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Ex: Dressing sur mesure"
              />
              {errors.title && (
                <p className="text-sm text-destructive mt-1">{errors.title}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block font-sans text-sm font-medium text-foreground mb-2">
                Catégorie
              </label>
              <Input
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                placeholder="Ex: Menuiserie, Aménagement, Design..."
              />
              {errors.category && (
                <p className="text-sm text-destructive mt-1">{errors.category}</p>
              )}
            </div>

            {/* Price */}
            <div>
              <label className="block font-sans text-sm font-medium text-foreground mb-2">
                Prix *
              </label>
              <Input
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                placeholder="Ex: À partir de 5000 MAD, 1500 MAD/m²..."
              />
              {errors.price && (
                <p className="text-sm text-destructive mt-1">{errors.price}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block font-sans text-sm font-medium text-foreground mb-2">
                Description
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Description détaillée du service ou de la réalisation..."
                rows={4}
              />
              {errors.description && (
                <p className="text-sm text-destructive mt-1">{errors.description}</p>
              )}
            </div>

            {/* Display Order */}
            <div>
              <label className="block font-sans text-sm font-medium text-foreground mb-2">
                Ordre d'affichage
              </label>
              <Input
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                min={0}
              />
            </div>

            {/* Active Status */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                className="w-4 h-4 rounded border-muted text-accent focus:ring-accent"
              />
              <label htmlFor="is_active" className="font-sans text-sm text-foreground">
                Actif (visible sur le site)
              </label>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 pt-6 border-t border-muted">
              <Button
                onClick={() => saveMutation.mutate(formData)}
                disabled={saveMutation.isPending}
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                {saveMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {isEditing ? 'Enregistrer' : 'Créer'}
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/admin')}
              >
                Annuler
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminTarifs;
