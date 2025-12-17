import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import heroKitchen from '@/assets/hero-kitchen.jpg';

interface HeroSectionProps {
  onNavigateToContact: () => void;
  onNavigateToServices: () => void;
}

const HeroSection = ({ onNavigateToContact, onNavigateToServices }: HeroSectionProps) => {
  return (
    <section className="scroll-section relative flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroKitchen})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/85 via-primary/70 to-primary/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-12 text-center lg:text-left">
        <div className="space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/20 backdrop-blur-sm rounded-full border border-accent/30 opacity-0 animate-fade-up">
            <span className="w-2 h-2 bg-accent rounded-full animate-pulse-soft" />
            <span className="font-sans text-sm text-primary-foreground/90 tracking-wider uppercase">
              Artisan Menuisier depuis 2010
            </span>
          </div>

          {/* Main Title */}
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-primary-foreground leading-tight opacity-0 animate-fade-up stagger-1">
            L'art du
            <span className="block text-accent">sur-mesure</span>
          </h1>

          {/* Subtitle */}
          <p className="font-sans text-lg md:text-xl text-primary-foreground/80 max-w-xl mx-auto lg:mx-0 leading-relaxed opacity-0 animate-fade-up stagger-2">
            Cuisines équipées, dressings, placards et habillages muraux conçus avec passion pour sublimer votre intérieur.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start opacity-0 animate-fade-up stagger-3">
            <Button 
              variant="hero" 
              size="lg"
              onClick={onNavigateToContact}
              className="group"
            >
              Demander un devis
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button 
              variant="heroOutline" 
              size="lg"
              onClick={onNavigateToServices}
              className="backdrop-blur-sm"
            >
              Découvrir nos services
            </Button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 justify-center lg:justify-start pt-8 border-t border-primary-foreground/20 opacity-0 animate-fade-up stagger-4">
            {[
              { value: '15+', label: "Années d'expertise" },
              { value: '500+', label: 'Projets réalisés' },
              { value: '100%', label: 'Sur mesure' },
            ].map((stat, index) => (
              <div key={index} className="text-center lg:text-left">
                <div className="font-serif text-3xl text-accent font-bold">{stat.value}</div>
                <div className="font-sans text-sm text-primary-foreground/70 tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-12 right-12 hidden lg:flex flex-col items-center gap-3 opacity-0 animate-fade-up stagger-5">
        <span className="font-sans text-xs text-primary-foreground/60 tracking-widest uppercase rotate-90 origin-center translate-y-8">
          Défiler
        </span>
        <div className="w-px h-16 bg-gradient-to-b from-accent to-transparent" />
      </div>
    </section>
  );
};

export default HeroSection;
