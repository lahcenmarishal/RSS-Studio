import { useRef, useCallback, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import ServicesSection from '@/components/sections/ServicesSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import ProcessSection from '@/components/sections/ProcessSection';
import ContactSection from '@/components/sections/ContactSection';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Index = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const totalSections = 6;

  const checkScroll = useCallback(() => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
      
      const sectionWidth = clientWidth;
      const currentIdx = Math.round(scrollLeft / sectionWidth);
      setCurrentSection(currentIdx);
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      checkScroll();
      
      const handleWheel = (e: WheelEvent) => {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
          e.preventDefault();
          container.scrollLeft += e.deltaY;
        }
      };
      
      container.addEventListener('wheel', handleWheel, { passive: false });
      
      return () => {
        container.removeEventListener('scroll', checkScroll);
        container.removeEventListener('wheel', handleWheel);
      };
    }
  }, [checkScroll]);

  const scrollToSection = useCallback((index: number) => {
    if (containerRef.current) {
      const sectionWidth = containerRef.current.clientWidth;
      containerRef.current.scrollTo({
        left: index * sectionWidth,
        behavior: 'smooth'
      });
    }
  }, []);

  const scrollDirection = (direction: 'left' | 'right') => {
    const newIndex = direction === 'left' 
      ? Math.max(0, currentSection - 1)
      : Math.min(totalSections - 1, currentSection + 1);
    scrollToSection(newIndex);
  };

  return (
    <>
      <Helmet>
        <title>RSS Studio | Menuiserie Sur Mesure à Berrechid - Cuisines, Dressings, Placards</title>
        <meta name="description" content="RSS Studio, artisan menuisier à Berrechid. Fabrication sur mesure de cuisines équipées, dressings, placards, habillages muraux et portes. Devis gratuit." />
        <meta name="keywords" content="menuiserie sur mesure, cuisine équipée, dressing, placards, habillage mural, portes, Berrechid, Casablanca, Maroc" />
        <link rel="canonical" href="https://rss-studio.ma" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "RSS Studio",
            "description": "Artisan menuisier spécialisé dans la fabrication sur mesure de cuisines équipées, dressings, placards, habillages muraux et portes.",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "N4 lot 100 MANAZIL DEROUA 2",
              "addressLocality": "Deroua, Berrechid",
              "postalCode": "26202",
              "addressCountry": "MA"
            },
            "priceRange": "$$",
            "openingHours": ["Mo-Fr 09:00-18:00", "Sa 09:00-13:00"],
            "serviceArea": {
              "@type": "GeoCircle",
              "geoMidpoint": {
                "@type": "GeoCoordinates",
                "latitude": 33.5731,
                "longitude": -7.5486
              }
            }
          })}
        </script>
      </Helmet>

      <div className="relative h-screen w-screen overflow-hidden bg-background">
        <Navigation onNavigate={scrollToSection} currentSection={currentSection} />
        
        {/* Main horizontal scroll container */}
        <div
          ref={containerRef}
          className="h-full w-full flex overflow-x-auto overflow-y-hidden scroll-smooth"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          <HeroSection 
            onNavigateToContact={() => scrollToSection(5)}
            onNavigateToServices={() => scrollToSection(2)}
          />
          <AboutSection />
          <ServicesSection />
          <ProjectsSection />
          <ProcessSection />
          <ContactSection />
        </div>

        {/* Navigation arrows */}
        <button
          onClick={() => scrollDirection('left')}
          className={`fixed left-6 top-1/2 -translate-y-1/2 z-40 p-3 bg-primary/90 text-primary-foreground rounded-full shadow-medium transition-all duration-300 hover:bg-primary hover:scale-110 ${
            canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          aria-label="Section précédente"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <button
          onClick={() => scrollDirection('right')}
          className={`fixed right-6 top-1/2 -translate-y-1/2 z-40 p-3 bg-primary/90 text-primary-foreground rounded-full shadow-medium transition-all duration-300 hover:bg-primary hover:scale-110 ${
            canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          aria-label="Section suivante"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Section indicators */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex gap-3">
          {Array.from({ length: totalSections }).map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToSection(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                index === currentSection 
                  ? 'bg-accent w-8' 
                  : 'bg-primary/30 hover:bg-primary/50 w-2.5'
              }`}
              aria-label={`Aller à la section ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Index;
