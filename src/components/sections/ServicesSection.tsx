import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import kitchenImg from '@/assets/hero-kitchen.jpg';
import dressingImg from '@/assets/dressing.jpg';
import placardsImg from '@/assets/placards.jpg';
import habillageImg from '@/assets/habillage-mural.jpg';
import portesImg from '@/assets/portes.jpg';

const services = [
  {
    id: 'cuisine',
    title: 'Cuisines équipées',
    subtitle: 'Sur mesure',
    description: 'Des cuisines fonctionnelles et élégantes, conçues pour s\'adapter parfaitement à votre espace et à vos habitudes de vie.',
    features: ['Design personnalisé', 'Matériaux premium', 'Électroménager intégré', 'Optimisation de l\'espace'],
    image: kitchenImg,
  },
  {
    id: 'dressing',
    title: 'Dressings',
    subtitle: 'Organisation parfaite',
    description: 'Des espaces de rangement intelligents qui transforment votre quotidien en alliant esthétique et praticité.',
    features: ['Aménagement modulable', 'Éclairage LED', 'Tiroirs coulissants', 'Accessoires intégrés'],
    image: dressingImg,
  },
  {
    id: 'placards',
    title: 'Placards',
    subtitle: 'Solutions de rangement',
    description: 'Optimisez chaque centimètre avec des placards sur mesure parfaitement intégrés à votre intérieur.',
    features: ['Portes coulissantes', 'Intérieur personnalisé', 'Finitions variées', 'Installation soignée'],
    image: placardsImg,
  },
  {
    id: 'habillage',
    title: 'Habillages muraux',
    subtitle: 'Élégance & caractère',
    description: 'Donnez du caractère à vos espaces avec des habillages muraux en bois qui créent une atmosphère unique.',
    features: ['Panneaux décoratifs', 'Boiseries modernes', 'Isolation phonique', 'Effet premium'],
    image: habillageImg,
  },
  {
    id: 'portes',
    title: 'Portes',
    subtitle: 'Design & fonctionnalité',
    description: 'Des portes intérieures qui allient design contemporain et qualité de fabrication exceptionnelle.',
    features: ['Portes battantes', 'Portes coulissantes', 'Finitions sur mesure', 'Quincaillerie premium'],
    image: portesImg,
  },
];

const ServicesSection = () => {
  const [activeService, setActiveService] = useState(0);
  const currentService = services[activeService];

  return (
    <section className="scroll-section relative flex items-center bg-secondary overflow-hidden">
      <div className="w-full h-full flex flex-col lg:flex-row">
        {/* Service navigation - Left side */}
        <div className="lg:w-2/5 p-6 lg:p-12 flex flex-col justify-center bg-cream">
          {/* Section label */}
          <div className="inline-flex items-center gap-3 mb-8">
            <span className="w-12 h-px bg-accent" />
            <span className="font-sans text-sm text-accent tracking-[0.3em] uppercase">
              Nos Services
            </span>
          </div>

          {/* Title */}
          <h2 className="font-serif text-3xl lg:text-4xl text-foreground mb-8 leading-tight">
            Des créations
            <span className="text-accent"> sur mesure</span>
            <br />pour tous vos espaces
          </h2>

          {/* Service tabs */}
          <div className="space-y-2">
            {services.map((service, index) => (
              <button
                key={service.id}
                onClick={() => setActiveService(index)}
                className={`w-full text-left p-4 rounded-sm transition-all duration-300 group ${
                  activeService === index 
                    ? 'bg-primary text-primary-foreground shadow-medium' 
                    : 'hover:bg-muted'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className={`font-sans text-xs tracking-wider uppercase ${
                      activeService === index ? 'text-accent' : 'text-muted-foreground'
                    }`}>
                      {service.subtitle}
                    </span>
                    <h3 className={`font-serif text-xl ${
                      activeService === index ? 'text-primary-foreground' : 'text-foreground'
                    }`}>
                      {service.title}
                    </h3>
                  </div>
                  <ArrowRight className={`w-5 h-5 transition-all duration-300 ${
                    activeService === index 
                      ? 'text-accent translate-x-0 opacity-100' 
                      : 'text-muted-foreground -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
                  }`} />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Service detail - Right side */}
        <div className="lg:w-3/5 relative overflow-hidden">
          {/* Background image */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-all duration-700"
            style={{ backgroundImage: `url(${currentService.image})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent" />
          </div>

          {/* Content overlay */}
          <div className="relative z-10 h-full flex flex-col justify-end p-6 lg:p-12">
            <div className="max-w-lg space-y-6">
              <p className="font-sans text-primary-foreground/90 text-lg leading-relaxed">
                {currentService.description}
              </p>
              
              {/* Features */}
              <div className="grid grid-cols-2 gap-3">
                {currentService.features.map((feature, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-2 text-primary-foreground/80"
                  >
                    <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                    <span className="font-sans text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
