import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Mail, Clock, MessageCircle, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const contactInfo = [
  {
    icon: MapPin,
    title: 'Adresse',
    details: ['N4 lot 100 MANAZIL DEROUA 2', 'Deroua, Berrechid 26202'],
  },
  {
    icon: Phone,
    title: 'Téléphone',
    details: ['+212 6 00 00 00 00'],
  },
  {
    icon: Mail,
    title: 'Email',
    details: ['contact@rss-studio.ma'],
  },
  {
    icon: Clock,
    title: 'Horaires',
    details: ['Lun - Ven: 9h - 18h', 'Sam: 9h - 13h'],
  },
];

const ContactSection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message envoyé !",
      description: "Nous vous répondrons dans les plus brefs délais.",
    });
    setFormData({ name: '', email: '', phone: '', service: '', message: '' });
  };

  const handleWhatsApp = () => {
    const phoneNumber = '212600000000';
    const message = encodeURIComponent('Bonjour, je souhaite obtenir des informations sur vos services.');
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <section className="scroll-section relative bg-secondary overflow-hidden">
      <div className="h-full flex flex-col lg:flex-row">
        {/* Left side - Contact form */}
        <div className="lg:w-1/2 p-6 lg:p-12 flex flex-col justify-center bg-cream">
          <div className="max-w-lg mx-auto w-full">
            {/* Header */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-3 mb-4">
                <span className="w-12 h-px bg-accent" />
                <span className="font-sans text-sm text-accent tracking-[0.3em] uppercase">
                  Contact
                </span>
              </div>
              <h2 className="font-serif text-3xl lg:text-4xl text-foreground leading-tight">
                Parlons de votre <span className="text-accent">projet</span>
              </h2>
              <p className="font-sans text-muted-foreground mt-3">
                Remplissez le formulaire ou contactez-nous directement.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-sans text-xs tracking-wider uppercase text-muted-foreground mb-2 block">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-background border border-border rounded-sm font-sans text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                    placeholder="Votre nom"
                  />
                </div>
                <div>
                  <label className="font-sans text-xs tracking-wider uppercase text-muted-foreground mb-2 block">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-background border border-border rounded-sm font-sans text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                    placeholder="+212 6..."
                  />
                </div>
              </div>

              <div>
                <label className="font-sans text-xs tracking-wider uppercase text-muted-foreground mb-2 block">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border rounded-sm font-sans text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                  placeholder="votre@email.com"
                />
              </div>

              <div>
                <label className="font-sans text-xs tracking-wider uppercase text-muted-foreground mb-2 block">
                  Service souhaité
                </label>
                <select
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border rounded-sm font-sans text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                >
                  <option value="">Sélectionnez un service</option>
                  <option value="cuisine">Cuisine équipée</option>
                  <option value="dressing">Dressing</option>
                  <option value="placard">Placards</option>
                  <option value="habillage">Habillage mural</option>
                  <option value="porte">Portes</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              <div>
                <label className="font-sans text-xs tracking-wider uppercase text-muted-foreground mb-2 block">
                  Votre message
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border rounded-sm font-sans text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all resize-none"
                  placeholder="Décrivez votre projet..."
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" variant="default" size="lg" className="flex-1">
                  <Send className="w-4 h-4" />
                  Envoyer
                </Button>
                <Button 
                  type="button" 
                  variant="premium" 
                  size="lg"
                  onClick={handleWhatsApp}
                  className="flex-1"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Right side - Map & Info */}
        <div className="lg:w-1/2 relative bg-primary">
          {/* Map placeholder */}
          <div className="h-1/2 lg:h-2/3 relative">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3323.8461!2d-7.5486!3d33.5731!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDM0JzIzLjIiTiA3wrAzMic1NS4wIlc!5e0!3m2!1sfr!2sma!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'grayscale(30%) contrast(1.1)' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localisation RSS Studio"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/20 pointer-events-none" />
          </div>

          {/* Contact info cards */}
          <div className="h-1/2 lg:h-1/3 p-6 lg:p-8">
            <div className="grid grid-cols-2 gap-4 h-full">
              {contactInfo.map((info, index) => (
                <div
                  key={index}
                  className="bg-primary-foreground/5 backdrop-blur-sm rounded-sm p-4 hover:bg-primary-foreground/10 transition-colors duration-300"
                >
                  <info.icon className="w-5 h-5 text-accent mb-2" />
                  <h3 className="font-serif text-sm text-primary-foreground mb-1">{info.title}</h3>
                  {info.details.map((detail, i) => (
                    <p key={i} className="font-sans text-xs text-primary-foreground/70">{detail}</p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-charcoal py-4 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-sans text-xs text-primary-foreground/60">
            © 2024 RSS Studio. Tous droits réservés.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="font-sans text-xs text-primary-foreground/60 hover:text-accent transition-colors">
              Mentions légales
            </a>
            <a href="#" className="font-sans text-xs text-primary-foreground/60 hover:text-accent transition-colors">
              Politique de confidentialité
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
