import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Package } from 'lucide-react';

const TarifsSection = () => {
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
    <section 
      className="scroll-section flex-shrink-0 w-screen h-screen overflow-y-auto bg-cream"
      style={{ scrollSnapAlign: 'start' }}
    >
      <div className="min-h-full py-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Title */}
          <div className="text-center mb-12">
            <span className="inline-block font-sans text-xs tracking-[0.3em] uppercase text-accent mb-4">
              Nos Prix
            </span>
            <h2 className="font-serif text-4xl lg:text-5xl text-foreground mb-4">
              Tarifs
            </h2>
            <p className="font-sans text-muted-foreground max-w-2xl mx-auto">
              Découvrez nos prix pour chaque service et réalisation. 
              Des solutions sur mesure adaptées à votre budget.
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* Empty State */}
          {!isLoading && (!pricingItems || pricingItems.length === 0) && (
            <div className="text-center py-16">
              <Package className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="font-serif text-2xl text-foreground mb-2">
                Tarifs bientôt disponibles
              </h3>
              <p className="font-sans text-muted-foreground">
                Nous mettons à jour notre grille tarifaire. Revenez bientôt !
              </p>
            </div>
          )}

          {/* Pricing Grid by Category */}
          {groupedItems && Object.entries(groupedItems).map(([category, items]) => (
            <div key={category} className="mb-12">
              <h3 className="font-serif text-2xl lg:text-3xl text-foreground mb-6 border-b border-accent/30 pb-4">
                {category}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    <div className="p-5">
                      <h4 className="font-serif text-lg text-foreground mb-2">
                        {item.title}
                      </h4>
                      {item.description && (
                        <p className="font-sans text-sm text-muted-foreground mb-3 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                      <span className="font-serif text-xl text-accent font-medium">
                        {item.price}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TarifsSection;
