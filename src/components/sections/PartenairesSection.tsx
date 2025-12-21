import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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

const PartenairesSection = () => {
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
    <section 
      className="scroll-section flex-shrink-0 w-screen h-screen overflow-y-auto bg-background"
      style={{ scrollSnapAlign: 'start' }}
    >
      <div className="min-h-full py-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Title */}
          <div className="text-center mb-12">
            <span className="inline-block font-sans text-xs tracking-[0.3em] uppercase text-accent mb-4">
              Nos Collaborateurs
            </span>
            <h2 className="font-serif text-4xl lg:text-5xl text-foreground mb-4">
              Partenaires
            </h2>
            <p className="font-sans text-muted-foreground max-w-2xl mx-auto">
              Nous collaborons avec des professionnels reconnus pour vous offrir
              le meilleur service possible.
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-card rounded-xl p-6 animate-pulse"
                >
                  <div className="w-full h-28 bg-muted rounded-lg mb-4" />
                  <div className="h-5 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-4 bg-muted rounded w-full" />
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && (!partners || partners.length === 0) && (
            <div className="text-center py-16">
              <Users className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="font-serif text-2xl text-foreground mb-2">
                Aucun partenaire pour le moment
              </h3>
              <p className="font-sans text-muted-foreground">
                Revenez bientôt pour découvrir nos partenaires.
              </p>
            </div>
          )}

          {/* Partners Grid */}
          {!isLoading && partners && partners.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {partners.map((partner) => (
                <div
                  key={partner.id}
                  className="bg-card rounded-xl overflow-hidden border border-border hover:border-accent/50 transition-all duration-300 hover:shadow-lg group"
                >
                  <div className="p-6 flex flex-col items-center text-center">
                    <div className="w-full h-28 flex items-center justify-center mb-4 bg-muted/30 rounded-lg overflow-hidden">
                      <img
                        src={partner.logo_url}
                        alt={partner.name}
                        className="max-h-full max-w-full object-contain p-4"
                      />
                    </div>
                    <h3 className="font-serif text-xl text-foreground mb-2">
                      {partner.name}
                    </h3>
                    {partner.description && (
                      <p className="font-sans text-muted-foreground text-sm mb-4 line-clamp-2">
                        {partner.description}
                      </p>
                    )}
                    {partner.website_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="group-hover:border-accent group-hover:text-accent"
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
          )}
        </div>
      </div>
    </section>
  );
};

export default PartenairesSection;
