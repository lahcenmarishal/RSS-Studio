import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Upload, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

const categories = ['Cuisines', 'Dressings', 'Placards', 'Habillages', 'Portes'];

const projectSchema = z.object({
  title: z.string().trim().min(1, 'Titre requis').max(200),
  category: z.string().min(1, 'Catégorie requise'),
  description: z.string().max(2000).optional(),
  image_url: z.string().url('URL d\'image invalide'),
  is_featured: z.boolean(),
  display_order: z.number().int().min(0),
});

const AdminProject = () => {
  const { id } = useParams();
  const isNew = id === 'new';
  const navigate = useNavigate();
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    image_url: '',
    is_featured: false,
    display_order: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);

  const { data: project, isLoading: loadingProject } = useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      if (isNew) return null;
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !isNew && isAdmin,
  });

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title,
        category: project.category,
        description: project.description || '',
        image_url: project.image_url,
        is_featured: project.is_featured || false,
        display_order: project.display_order || 0,
      });
    }
  }, [project]);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate('/admin/auth');
    }
  }, [user, isAdmin, authLoading, navigate]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const validation = projectSchema.safeParse(formData);
      if (!validation.success) {
        const fieldErrors: Record<string, string> = {};
        validation.error.errors.forEach((err) => {
          fieldErrors[err.path[0] as string] = err.message;
        });
        setErrors(fieldErrors);
        throw new Error('Validation failed');
      }

      if (isNew) {
        const { error } = await supabase.from('projects').insert([formData]);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('projects').update(formData).eq('id', id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({ title: isNew ? 'Projet créé' : 'Projet mis à jour' });
      navigate('/admin');
    },
    onError: (error: Error) => {
      if (error.message !== 'Validation failed') {
        toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
      }
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({ title: 'Erreur', description: 'Fichier non valide', variant: 'destructive' });
      return;
    }

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `projects/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('project-images')
      .upload(filePath, file);

    if (uploadError) {
      toast({ title: 'Erreur upload', description: uploadError.message, variant: 'destructive' });
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from('project-images').getPublicUrl(filePath);
    setFormData({ ...formData, image_url: urlData.publicUrl });
    setUploading(false);
  };

  if (authLoading || (!isNew && loadingProject)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate('/admin')}
            className="p-2 hover:bg-muted rounded-sm transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-serif text-xl text-foreground">
            {isNew ? 'Nouveau projet' : 'Modifier le projet'}
          </h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setErrors({});
            saveMutation.mutate();
          }}
          className="space-y-6"
        >
          {/* Image */}
          <div>
            <label className="font-sans text-xs tracking-wider uppercase text-muted-foreground mb-2 block">
              Image
            </label>
            {formData.image_url && (
              <img
                src={formData.image_url}
                alt="Preview"
                className="w-full max-w-md h-48 object-cover rounded-sm mb-3"
              />
            )}
            <div className="flex gap-3">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-sm font-sans text-sm hover:bg-secondary/80 transition-colors">
                  <Upload className="w-4 h-4" />
                  {uploading ? 'Upload...' : 'Choisir une image'}
                </span>
              </label>
              <input
                type="text"
                placeholder="Ou entrer une URL"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="flex-1 px-4 py-2 bg-background border border-border rounded-sm font-sans text-foreground"
              />
            </div>
            {errors.image_url && <p className="text-destructive text-xs mt-1">{errors.image_url}</p>}
          </div>

          {/* Title */}
          <div>
            <label className="font-sans text-xs tracking-wider uppercase text-muted-foreground mb-2 block">
              Titre
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 bg-background border border-border rounded-sm font-sans text-foreground"
              placeholder="Titre du projet"
            />
            {errors.title && <p className="text-destructive text-xs mt-1">{errors.title}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="font-sans text-xs tracking-wider uppercase text-muted-foreground mb-2 block">
              Catégorie
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 bg-background border border-border rounded-sm font-sans text-foreground"
            >
              <option value="">Sélectionner une catégorie</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && <p className="text-destructive text-xs mt-1">{errors.category}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="font-sans text-xs tracking-wider uppercase text-muted-foreground mb-2 block">
              Description (optionnel)
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 bg-background border border-border rounded-sm font-sans text-foreground resize-none"
              placeholder="Description du projet..."
            />
          </div>

          {/* Display order */}
          <div>
            <label className="font-sans text-xs tracking-wider uppercase text-muted-foreground mb-2 block">
              Ordre d'affichage
            </label>
            <input
              type="number"
              min="0"
              value={formData.display_order}
              onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
              className="w-32 px-4 py-3 bg-background border border-border rounded-sm font-sans text-foreground"
            />
          </div>

          {/* Featured */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="featured"
              checked={formData.is_featured}
              onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
              className="w-4 h-4 accent-accent"
            />
            <label htmlFor="featured" className="font-sans text-sm text-foreground">
              Mettre en vedette sur la page d'accueil
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={saveMutation.isPending || uploading}>
              <Save className="w-4 h-4 mr-2" />
              {saveMutation.isPending ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/admin')}>
              Annuler
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AdminProject;
