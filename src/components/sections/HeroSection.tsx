import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import heroKitchen from '@/assets/hero-kitchen.jpg';

interface HeroSectionProps {
  onNavigateToContact: () => void;
  onNavigateToServices: () => void;
}

const HeroSection = ({ onNavigateToContact, onNavigateToServices }: HeroSectionProps) => {
  return (
    <section className="scroll-section scroll-section-hero relative flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroKitchen})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/85 via-primary/70 to-primary/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-8 lg:px-16 text-center lg:text-left py-12 sm:py-16 lg:py-20">
        <div className="space-y-5 sm:space-y-6 lg:space-y-8">
          {/* Main Title */}
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-primary-foreground leading-tight opacity-0 animate-fade-up sm:order-none order-first">
            L'art du
            <span className="block text-accent mt-1 sm:mt-2">sur-mesure</span>
          </h1>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-accent/20 backdrop-blur-sm rounded-full border border-accent/30 opacity-0 animate-fade-up stagger-1">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-accent rounded-full animate-pulse-soft" />
            <span className="font-sans text-[10px] sm:text-xs text-primary-foreground/90 tracking-wider uppercase">
              Aménageur d'espace depuis 2010
            </span>
          </div>

          {/* Subtitle */}
          <p className="font-sans text-sm sm:text-base md:text-lg text-primary-foreground/80 max-w-lg mx-auto lg:mx-0 leading-relaxed opacity-0 animate-fade-up stagger-2">
            Cuisines équipées, dressings, placards et habillages muraux conçus avec passion pour sublimer votre intérieur.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start opacity-0 animate-fade-up stagger-3 pt-2">
            <Button 
              variant="hero" 
              size="lg"
              onClick={onNavigateToContact}
              className="group text-sm"
            >
              Demander un devis
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button 
              variant="heroOutline" 
              size="lg"
              onClick={onNavigateToServices}
              className="backdrop-blur-sm text-sm"
            >
              Découvrir nos services
            </Button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-6 sm:gap-8 lg:gap-10 justify-center lg:justify-start pt-6 sm:pt-8 border-t border-primary-foreground/15 opacity-0 animate-fade-up stagger-4">
            {[
              { value: '15+', label: "Années d'expertise" },
              { value: '500+', label: 'Projets réalisés' },
              { value: '100%', label: 'Sur mesure' },
            ].map((stat, index) => (
              <div key={index} className="text-center lg:text-left">
                <div className="font-serif text-xl sm:text-2xl lg:text-3xl text-accent font-bold">{stat.value}</div>
                <div className="font-sans text-[10px] sm:text-xs text-primary-foreground/70 tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 sm:bottom-12 right-8 sm:right-12 hidden lg:flex flex-col items-center gap-3 opacity-0 animate-fade-up stagger-5">
        <span className="font-sans text-xs text-primary-foreground/60 tracking-widest uppercase rotate-90 origin-center translate-y-8">
          Défiler
        </span>
        <div className="w-px h-16 bg-gradient-to-b from-accent to-transparent" />
      </div>
    </section>
  );
};

export default HeroSection;
