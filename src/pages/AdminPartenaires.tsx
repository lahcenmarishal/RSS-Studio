import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";
import { z } from "zod";

const partnerSchema = z.object({
  name: z.string().min(1, "Le nom est requis").max(100),
  description: z.string().max(500).optional(),
  logo_url: z.string().min(1, "Le logo est requis"),
  website_url: z.string().url("URL invalide").optional().or(z.literal("")),
  display_order: z.number().int().min(0),
  is_active: z.boolean(),
});

type PartnerForm = z.infer<typeof partnerSchema>;

const AdminPartenaires = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const isEditing = id !== "new";

  const [form, setForm] = useState<PartnerForm>({
    name: "",
    description: "",
    logo_url: "",
    website_url: "",
    display_order: 0,
    is_active: true,
  });
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: partner, isLoading } = useQuery({
    queryKey: ["admin-partner", id],
    queryFn: async () => {
      if (!isEditing) return null;
      const { data, error } = await supabase
        .from("partners")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: isEditing && !!user && isAdmin,
  });

  useEffect(() => {
    if (partner) {
      setForm({
        name: partner.name,
        description: partner.description || "",
        logo_url: partner.logo_url,
        website_url: partner.website_url || "",
        display_order: partner.display_order || 0,
        is_active: partner.is_active ?? true,
      });
    }
  }, [partner]);

  const saveMutation = useMutation({
    mutationFn: async (data: PartnerForm) => {
      if (isEditing) {
        const { error } = await supabase
          .from("partners")
          .update({
            name: data.name,
            description: data.description || null,
            logo_url: data.logo_url,
            website_url: data.website_url || null,
            display_order: data.display_order,
            is_active: data.is_active,
          })
          .eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("partners").insert({
          name: data.name,
          description: data.description || null,
          logo_url: data.logo_url,
          website_url: data.website_url || null,
          display_order: data.display_order,
          is_active: data.is_active,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-partners"] });
      queryClient.invalidateQueries({ queryKey: ["partners"] });
      toast({
        title: isEditing ? "Partenaire modifié" : "Partenaire ajouté",
        description: "Les modifications ont été enregistrées.",
      });
      navigate("/admin?tab=partenaires");
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le partenaire.",
        variant: "destructive",
      });
      console.error(error);
    },
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `partners/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("project-images")
      .upload(filePath, file);

    if (uploadError) {
      toast({
        title: "Erreur d'upload",
        description: "Impossible de télécharger l'image.",
        variant: "destructive",
      });
      setUploading(false);
      return;
    }

    const { data } = supabase.storage
      .from("project-images")
      .getPublicUrl(filePath);

    setForm((prev) => ({ ...prev, logo_url: data.publicUrl }));
    setUploading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = partnerSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    saveMutation.mutate(result.data);
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    navigate("/admin-auth");
    return null;
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/admin?tab=partenaires")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>

        <h1 className="text-3xl font-bold text-foreground mb-8">
          {isEditing ? "Modifier le partenaire" : "Nouveau partenaire"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nom du partenaire *</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Nom du partenaire"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Courte description du partenaire"
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Logo du partenaire *</Label>
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("logo-upload")?.click()}
                disabled={uploading}
              >
                {uploading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4 mr-2" />
                )}
                Télécharger
              </Button>
              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="hidden"
              />
              {form.logo_url && (
                <img
                  src={form.logo_url}
                  alt="Preview"
                  className="h-16 w-16 object-contain rounded border"
                />
              )}
            </div>
            {errors.logo_url && (
              <p className="text-sm text-destructive">{errors.logo_url}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="website_url">Site web</Label>
            <Input
              id="website_url"
              type="url"
              value={form.website_url}
              onChange={(e) =>
                setForm({ ...form, website_url: e.target.value })
              }
              placeholder="https://example.com"
            />
            {errors.website_url && (
              <p className="text-sm text-destructive">{errors.website_url}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="display_order">Ordre d'affichage</Label>
            <Input
              id="display_order"
              type="number"
              value={form.display_order}
              onChange={(e) =>
                setForm({ ...form, display_order: parseInt(e.target.value) || 0 })
              }
              min={0}
            />
          </div>

          <div className="flex items-center gap-3">
            <Switch
              id="is_active"
              checked={form.is_active}
              onCheckedChange={(checked) =>
                setForm({ ...form, is_active: checked })
              }
            />
            <Label htmlFor="is_active">Actif</Label>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={saveMutation.isPending}
          >
            {saveMutation.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : null}
            {isEditing ? "Enregistrer" : "Créer le partenaire"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminPartenaires;
