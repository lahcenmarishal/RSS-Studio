import { Award, Users, Lightbulb, Heart } from 'lucide-react';
import designConceptImage from '@/assets/design-concept.jpg';

const values = [
  {
    icon: Lightbulb,
    title: 'Créativité',
    description: 'Solutions innovantes et designs personnalisés'
  },
  {
    icon: Heart,
    title: 'Passion',
    description: "L'amour des espaces bien pensés"
  },
  {
    icon: Users,
    title: 'Écoute',
    description: 'Vos envies au cœur de notre démarche'
  },
  {
    icon: Award,
    title: 'Excellence',
    description: 'Des finitions irréprochables'
  },
];

const AboutSection = () => {
  return (
    <section className="scroll-section relative bg-cream">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-secondary to-transparent opacity-50" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-20 items-center">
          {/* Image side */}
          <div className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/3] sm:aspect-[4/5] overflow-hidden rounded-sm shadow-strong">
              <img 
                src={designConceptImage}
                alt="RSS Studio - De la conception à la réalisation"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
            </div>
            
            {/* Floating badge */}
            <div className="absolute -bottom-4 right-4 sm:-bottom-6 sm:right-auto sm:-left-6 bg-accent text-accent-foreground px-4 sm:px-6 py-3 sm:py-4 rounded-sm shadow-gold">
              <div className="font-serif text-2xl sm:text-3xl font-bold">15+</div>
              <div className="font-sans text-xs sm:text-sm tracking-wider uppercase">Ans d'expérience</div>
            </div>
          </div>

          {/* Content side */}
          <div className="order-1 lg:order-2 space-y-6 sm:space-y-8">
            {/* Section label */}
            <div className="inline-flex items-center gap-3">
              <span className="w-8 sm:w-12 h-px bg-accent" />
              <span className="font-sans text-xs sm:text-sm text-accent tracking-[0.2em] sm:tracking-[0.3em] uppercase">
                À propos
              </span>
            </div>

            {/* Title */}
            <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl text-foreground leading-tight">
              Un studio dédié à
              <span className="text-accent"> l'aménagement d'espace</span>
            </h2>

            {/* Description */}
            <div className="space-y-3 sm:space-y-4 text-muted-foreground font-sans text-sm sm:text-base leading-relaxed">
              <p>
                Depuis 2010, <strong className="text-foreground">RSS Studio</strong> conçoit et réalise des aménagements sur mesure pour les particuliers et professionnels exigeants.
              </p>
              <p>
                Notre approche créative allie design contemporain et fonctionnalité pour créer des espaces uniques, parfaitement adaptés à vos besoins et à votre mode de vie.
              </p>
              <p className="hidden sm:block">
                De la conception à l'installation, nous vous accompagnons à chaque étape pour transformer vos idées en réalisations d'exception.
              </p>
            </div>

            {/* Values grid */}
            <div className="grid grid-cols-2 gap-3 sm:gap-6 pt-4 sm:pt-6">
              {values.map((value, index) => (
                <div 
                  key={index}
                  className="group flex items-start gap-2 sm:gap-4 p-2 sm:p-4 rounded-sm transition-all duration-300 hover:bg-secondary/50"
                >
                  <div className="p-1.5 sm:p-2 bg-accent/10 rounded-sm text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-all duration-300 shrink-0">
                    <value.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-serif text-sm sm:text-lg text-foreground">{value.title}</h3>
                    <p className="font-sans text-xs sm:text-sm text-muted-foreground line-clamp-2">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
