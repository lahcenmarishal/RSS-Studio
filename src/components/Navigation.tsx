import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Logo from '@/components/Logo';

interface NavItem {
  label: string;
  sectionIndex: number;
}

const navItems: NavItem[] = [
  { label: 'Accueil', sectionIndex: 0 },
  { label: 'À propos', sectionIndex: 1 },
  { label: 'Services', sectionIndex: 2 },
  { label: 'Réalisations', sectionIndex: 3 },
  { label: 'Processus', sectionIndex: 4 },
  { label: 'Contact', sectionIndex: 5 },
];

interface NavigationProps {
  onNavigate: (index: number) => void;
  currentSection: number;
}

const Navigation = ({ onNavigate, currentSection }: NavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (index: number) => {
    onNavigate(index);
    setIsOpen(false);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled || currentSection > 0 
            ? 'bg-cream/95 backdrop-blur-md shadow-soft' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <button 
              onClick={() => handleNavClick(0)}
              className="flex items-center gap-2 group"
            >
              <Logo 
                className="h-16 w-auto"
                color={currentSection === 0 && !isScrolled ? 'hsl(43, 74%, 49%)' : 'hsl(43, 74%, 49%)'}
              />
            </button>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-8">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.sectionIndex)}
                  className={`relative font-sans text-sm tracking-wider uppercase transition-all duration-300 py-2 ${
                    currentSection === item.sectionIndex
                      ? currentSection === 0 && !isScrolled 
                        ? 'text-accent' 
                        : 'text-accent'
                      : currentSection === 0 && !isScrolled
                        ? 'text-primary-foreground/90 hover:text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {item.label}
                  <span 
                    className={`absolute bottom-0 left-0 h-0.5 bg-accent transition-all duration-300 ${
                      currentSection === item.sectionIndex ? 'w-full' : 'w-0'
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`lg:hidden p-2 transition-colors ${
                currentSection === 0 && !isScrolled ? 'text-primary-foreground' : 'text-foreground'
              }`}
              aria-label="Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div 
          className="absolute inset-0 bg-primary/95 backdrop-blur-lg"
          onClick={() => setIsOpen(false)}
        />
        <div className="relative h-full flex flex-col items-center justify-center gap-6">
          {navItems.map((item, index) => (
            <button
              key={item.label}
              onClick={() => handleNavClick(item.sectionIndex)}
              className={`font-serif text-3xl text-primary-foreground hover:text-accent transition-all duration-300 opacity-0 animate-fade-up`}
              style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default Navigation;
