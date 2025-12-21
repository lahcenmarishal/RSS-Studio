import { MessageSquare, Pencil, Wrench, CheckCircle } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: MessageSquare,
    title: 'Étude & Conseil',
    description: 'Rencontre pour comprendre vos besoins, prise de mesures précises et évaluation de votre espace.',
  },
  {
    number: '02',
    icon: Pencil,
    title: 'Conception',
    description: 'Création de plans détaillés et visualisations 3D pour concrétiser votre vision.',
  },
  {
    number: '03',
    icon: Wrench,
    title: 'Réalisation',
    description: 'Fabrication et assemblage avec les meilleurs matériaux et techniques modernes.',
  },
  {
    number: '04',
    icon: CheckCircle,
    title: 'Livraison',
    description: 'Installation soignée par nos équipes qualifiées avec finitions impeccables.',
  },
];

const ProcessSection = () => {
  return (
    <section className="scroll-section relative bg-cream">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-8 lg:py-12 w-full">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-4 justify-center">
            <span className="w-12 h-px bg-accent" />
            <span className="font-sans text-sm text-accent tracking-[0.3em] uppercase">
              Notre méthode
            </span>
            <span className="w-12 h-px bg-accent" />
          </div>
          <h2 className="font-serif text-4xl lg:text-5xl text-foreground leading-tight">
            Un processus <span className="text-accent">transparent</span>
          </h2>
          <p className="font-sans text-muted-foreground mt-4 max-w-2xl mx-auto">
            De la première rencontre à la livraison finale, nous vous accompagnons à chaque étape de votre projet d'aménagement.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-border -translate-y-1/2" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative group"
              >
                {/* Step card */}
                <div className="bg-card rounded-sm p-6 shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-2">
                  {/* Number badge */}
                  <div className="absolute -top-4 left-6 bg-accent text-accent-foreground px-3 py-1 rounded-sm">
                    <span className="font-sans text-sm font-bold">{step.number}</span>
                  </div>

                  {/* Icon */}
                  <div className="mb-6 pt-4">
                    <div className="w-14 h-14 bg-secondary rounded-sm flex items-center justify-center group-hover:bg-accent transition-colors duration-300">
                      <step.icon className="w-7 h-7 text-foreground group-hover:text-accent-foreground transition-colors duration-300" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="font-serif text-xl text-foreground mb-3">{step.title}</h3>
                  <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Connector dot for desktop */}
                <div className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-accent rounded-full border-4 border-cream z-10" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
