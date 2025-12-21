import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Helmet } from "react-helmet-async";
import { ExternalLink, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Partner {
  id: string;
  name: string;
  description: string | null;
  logo_url: string;
  website_url: string | null;
  display_order: number | null;
  is_active: boolean | null;
}

const Partenaires = () => {
  const { data: partners, isLoading } = useQuery({
    queryKey: ["partners"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("partners")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as Partner[];
    },
  });

  return (
    <>
      <Helmet>
        <title>Nos Partenaires | RSS Studio</title>
        <meta
          name="description"
          content="Découvrez nos partenaires de confiance - RSS Studio travaille avec les meilleurs professionnels du secteur."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <section className="pt-32 pb-16 px-4 bg-primary/5">
          <div className="container mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-sm text-primary font-medium">
                Nos Partenaires
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              Nos Partenaires de Confiance
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Nous collaborons avec des professionnels reconnus pour vous offrir
              le meilleur service possible.
            </p>
          </div>
        </section>

        {/* Partners Grid */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-card rounded-xl p-6 animate-pulse"
                  >
                    <div className="w-full h-32 bg-muted rounded-lg mb-4" />
                    <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                    <div className="h-4 bg-muted rounded w-full" />
                  </div>
                ))}
              </div>
            ) : partners && partners.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {partners.map((partner) => (
                  <div
                    key={partner.id}
                    className="bg-card rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg group"
                  >
                    <div className="p-6 flex flex-col items-center text-center">
                      <div className="w-full h-32 flex items-center justify-center mb-4 bg-muted/30 rounded-lg overflow-hidden">
                        <img
                          src={partner.logo_url}
                          alt={partner.name}
                          className="max-h-full max-w-full object-contain p-4"
                        />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {partner.name}
                      </h3>
                      {partner.description && (
                        <p className="text-muted-foreground text-sm mb-4">
                          {partner.description}
                        </p>
                      )}
                      {partner.website_url && (
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="group-hover:border-primary group-hover:text-primary"
                        >
                          <a
                            href={partner.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Visiter le site
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Aucun partenaire pour le moment
                </h3>
                <p className="text-muted-foreground">
                  Revenez bientôt pour découvrir nos partenaires.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default Partenaires;
