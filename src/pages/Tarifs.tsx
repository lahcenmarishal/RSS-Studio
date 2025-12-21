import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { ArrowLeft, Package } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import Logo from '@/components/Logo';

const Tarifs = () => {
  const { data: pricingItems, isLoading } = useQuery({
    queryKey: ['pricing-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pricing_items')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  // Group items by category
  const groupedItems = pricingItems?.reduce((acc, item) => {
    const category = item.category || 'Autres';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, typeof pricingItems>);

  return (
    <>
      <Helmet>
        <title>Tarifs - RSS Studio | Prix et Services</title>
        <meta name="description" content="Découvrez nos tarifs pour les services d'aménagement intérieur, menuiserie sur mesure et design. RSS Studio à Casablanca." />
      </Helmet>

      <div className="min-h-screen bg-cream">
        {/* Header */}
        <header className="bg-primary py-6 px-6 lg:px-12">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <Logo className="h-12 w-auto" color="hsl(43, 74%, 49%)" />
            </Link>
            <Link 
              to="/" 
              className="flex items-center gap-2 text-primary-foreground/80 hover:text-accent transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-sans">Retour</span>
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="py-16 px-6 lg:px-12">
          <div className="max-w-7xl mx-auto">
            {/* Title */}
            <div className="text-center mb-16">
              <h1 className="font-serif text-4xl lg:text-5xl text-foreground mb-4">
                Nos Tarifs
              </h1>
              <p className="font-sans text-muted-foreground max-w-2xl mx-auto">
                Découvrez nos prix pour chaque service et réalisation. 
                Des solutions sur mesure adaptées à votre budget.
              </p>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {/* Empty State */}
            {!isLoading && (!pricingItems || pricingItems.length === 0) && (
              <div className="text-center py-20">
                <Package className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                <h2 className="font-serif text-2xl text-foreground mb-2">
                  Tarifs bientôt disponibles
                </h2>
                <p className="font-sans text-muted-foreground">
                  Nous mettons à jour notre grille tarifaire. Revenez bientôt !
                </p>
              </div>
            )}

            {/* Pricing Grid by Category */}
            {groupedItems && Object.entries(groupedItems).map(([category, items]) => (
              <div key={category} className="mb-16">
                <h2 className="font-serif text-2xl lg:text-3xl text-foreground mb-8 border-b border-accent/30 pb-4">
                  {category}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {items?.map((item) => (
                    <div 
                      key={item.id}
                      className="bg-white rounded-lg shadow-soft overflow-hidden hover:shadow-md transition-shadow duration-300"
                    >
                      {/* Image */}
                      {item.image_url && (
                        <div className="aspect-[4/3] overflow-hidden">
                          <img 
                            src={item.image_url} 
                            alt={item.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}
                      
                      {/* Content */}
                      <div className="p-6">
                        <h3 className="font-serif text-xl text-foreground mb-2">
                          {item.title}
                        </h3>
                        {item.description && (
                          <p className="font-sans text-sm text-muted-foreground mb-4 line-clamp-3">
                            {item.description}
                          </p>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="font-serif text-2xl text-accent font-medium">
                            {item.price}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* CTA */}
            <div className="text-center mt-16 pt-12 border-t border-muted">
              <p className="font-sans text-muted-foreground mb-6">
                Vous avez des questions sur nos tarifs ? N'hésitez pas à nous contacter.
              </p>
              <Link 
                to="/#contact"
                className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-3 rounded-sm font-sans text-sm uppercase tracking-wider hover:bg-accent/90 transition-colors"
              >
                Demander un devis
              </Link>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-primary py-8 px-6 lg:px-12">
          <div className="max-w-7xl mx-auto text-center">
            <p className="font-sans text-xs text-primary-foreground/60">
              © 2024 RSS Studio. Tous droits réservés.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Tarifs;
