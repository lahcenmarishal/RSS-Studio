import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import kitchenImg from '@/assets/hero-kitchen.jpg';

const categories = ['Tous', 'Cuisines', 'Dressings', 'Placards', 'Habillages', 'Portes'];

const ProjectsSection = () => {
  const [activeCategory, setActiveCategory] = useState('Tous');

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const filteredProjects = activeCategory === 'Tous'
    ? projects
    : projects.filter(p => p.category === activeCategory);

  return (
    <section className="scroll-section relative bg-primary">
      <div className="min-h-full flex flex-col py-8 lg:py-12 px-6 lg:px-12">
        {/* Header */}
        <div className="max-w-7xl mx-auto w-full mb-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-3 mb-4">
                <span className="w-12 h-px bg-accent" />
                <span className="font-sans text-sm text-accent tracking-[0.3em] uppercase">
                  Portfolio
                </span>
              </div>
              <h2 className="font-serif text-4xl lg:text-5xl text-primary-foreground leading-tight">
                Nos <span className="text-accent">réalisations</span>
              </h2>
            </div>

            {/* Category filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 font-sans text-sm tracking-wider uppercase rounded-sm transition-all duration-300 ${
                    activeCategory === category
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-primary-foreground/10 text-primary-foreground/70 hover:bg-primary-foreground/20 hover:text-primary-foreground'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Projects grid */}
        <div className="flex-1 max-w-7xl mx-auto w-full overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <p className="font-sans text-primary-foreground/60">
                {projects.length === 0 ? 'Aucun projet pour le moment' : 'Aucun projet dans cette catégorie'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 h-full">
              {filteredProjects.map((project, index) => (
                <div
                  key={project.id}
                  className={`group relative overflow-hidden rounded-sm cursor-pointer aspect-[4/3] lg:aspect-[3/2] min-h-[180px] ${
                    index === 0 ? 'col-span-2 lg:col-span-1 lg:row-span-2 lg:aspect-[3/4]' : ''
                  }`}
                >
                  <img
                    src={project.image_url || kitchenImg}
                    alt={`Réalisation ${project.category} - ${project.title}`}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-4 lg:p-6">
                    <span className="font-sans text-xs text-accent tracking-wider uppercase mb-1 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                      {project.category}
                    </span>
                    <h3 className="font-serif text-lg lg:text-xl text-primary-foreground transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      {project.title}
                    </h3>
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

export default ProjectsSection;
