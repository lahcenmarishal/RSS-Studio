import { useRef, useEffect, useState, ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HorizontalScrollContainerProps {
  children: ReactNode;
  showNavigation?: boolean;
}

const HorizontalScrollContainer = ({ 
  children, 
  showNavigation = true 
}: HorizontalScrollContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [currentSection, setCurrentSection] = useState(0);
  const [totalSections, setTotalSections] = useState(0);

  const checkScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
      
      // Calculate current section
      const sectionWidth = clientWidth;
      const currentIdx = Math.round(scrollLeft / sectionWidth);
      setCurrentSection(currentIdx);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      // Count sections
      const sections = container.querySelectorAll('.scroll-section');
      setTotalSections(sections.length);
      
      container.addEventListener('scroll', checkScroll);
      checkScroll();
      
      // Handle wheel events for horizontal scroll
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
  }, []);

  const scrollToSection = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const sectionWidth = containerRef.current.clientWidth;
      const newScrollLeft = direction === 'left' 
        ? containerRef.current.scrollLeft - sectionWidth
        : containerRef.current.scrollLeft + sectionWidth;
      
      containerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  const scrollToIndex = (index: number) => {
    if (containerRef.current) {
      const sectionWidth = containerRef.current.clientWidth;
      containerRef.current.scrollTo({
        left: index * sectionWidth,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-background">
      {/* Main scrollable container */}
      <div
        ref={containerRef}
        className="horizontal-scroll h-full w-full"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {children}
      </div>

      {/* Navigation arrows */}
      {showNavigation && (
        <>
          <button
            onClick={() => scrollToSection('left')}
            className={`fixed left-6 top-1/2 -translate-y-1/2 z-50 p-3 bg-primary/90 text-primary-foreground rounded-full shadow-medium transition-all duration-300 hover:bg-primary hover:scale-110 ${
              canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            aria-label="Section précédente"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={() => scrollToSection('right')}
            className={`fixed right-6 top-1/2 -translate-y-1/2 z-50 p-3 bg-primary/90 text-primary-foreground rounded-full shadow-medium transition-all duration-300 hover:bg-primary hover:scale-110 ${
              canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            aria-label="Section suivante"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Section indicators */}
      {showNavigation && totalSections > 1 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex gap-3">
          {Array.from({ length: totalSections }).map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToIndex(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === currentSection 
                  ? 'bg-accent w-8' 
                  : 'bg-primary/30 hover:bg-primary/50'
              }`}
              aria-label={`Aller à la section ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HorizontalScrollContainer;
