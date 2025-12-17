import { Award, Users, Hammer, Heart } from 'lucide-react';
import craftsmanImage from '@/assets/craftsman.jpg';

const values = [
  {
    icon: Hammer,
    title: 'Savoir-faire',
    description: 'Techniques traditionnelles et innovations modernes'
  },
  {
    icon: Heart,
    title: 'Passion',
    description: "L'amour du bois et du travail bien fait"
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
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image side */}
          <div className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm shadow-strong">
              <img 
                src={craftsmanImage}
                alt="Artisan RSS Studio au travail"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
            </div>
            
            {/* Floating badge */}
            <div className="absolute -bottom-6 -right-6 lg:right-auto lg:-left-6 bg-accent text-accent-foreground px-6 py-4 rounded-sm shadow-gold">
              <div className="font-serif text-3xl font-bold">15+</div>
              <div className="font-sans text-sm tracking-wider uppercase">Ans d'expérience</div>
            </div>
          </div>

          {/* Content side */}
          <div className="order-1 lg:order-2 space-y-8">
            {/* Section label */}
            <div className="inline-flex items-center gap-3">
              <span className="w-12 h-px bg-accent" />
              <span className="font-sans text-sm text-accent tracking-[0.3em] uppercase">
                À propos
              </span>
            </div>

            {/* Title */}
            <h2 className="font-serif text-4xl lg:text-5xl text-foreground leading-tight">
              Un atelier familial dédié à
              <span className="text-accent"> l'excellence</span>
            </h2>

            {/* Description */}
            <div className="space-y-4 text-muted-foreground font-sans leading-relaxed">
              <p>
                Depuis 2010, <strong className="text-foreground">RSS Studio</strong> conçoit et fabrique des aménagements sur mesure pour les particuliers et professionnels exigeants.
              </p>
              <p>
                Notre approche artisanale allie techniques traditionnelles du travail du bois et technologies de pointe pour créer des pièces uniques, parfaitement adaptées à vos espaces et à votre mode de vie.
              </p>
              <p>
                De la conception à l'installation, nous vous accompagnons à chaque étape pour transformer vos idées en réalisations d'exception.
              </p>
            </div>

            {/* Values grid */}
            <div className="grid grid-cols-2 gap-6 pt-6">
              {values.map((value, index) => (
                <div 
                  key={index}
                  className="group flex items-start gap-4 p-4 rounded-sm transition-all duration-300 hover:bg-secondary/50"
                >
                  <div className="p-2 bg-accent/10 rounded-sm text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-all duration-300">
                    <value.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-foreground">{value.title}</h3>
                    <p className="font-sans text-sm text-muted-foreground">{value.description}</p>
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
