import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Mail, Clock, MessageCircle, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().trim().min(1, 'Nom requis').max(100),
  email: z.string().trim().email('Email invalide').max(255),
  phone: z.string().max(20).optional(),
  service: z.string().max(50).optional(),
  message: z.string().trim().min(1, 'Message requis').max(2000),
});

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = contactSchema.safeParse(formData);
    if (!validation.success) {
      toast({
        title: 'Erreur',
        description: validation.error.errors[0].message,
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase.from('quote_requests').insert([{
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone || null,
      service: formData.service || null,
      message: formData.message.trim(),
    }]);

    if (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible d\'envoyer le message. Veuillez réessayer.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Message envoyé !',
        description: 'Nous vous répondrons dans les plus brefs délais.',
      });
      setFormData({ name: '', email: '', phone: '', service: '', message: '' });
    }

    setIsSubmitting(false);
  };

  const handleWhatsApp = () => {
    const phoneNumber = '212600000000';
    const message = encodeURIComponent('Bonjour, je souhaite obtenir des informations sur vos services.');
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <section className="scroll-section relative bg-secondary flex flex-col">
      {/* Main content */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left side - Contact form */}
        <div className="lg:w-1/2 p-4 sm:p-6 lg:p-12 flex flex-col justify-center bg-cream">
          <div className="max-w-lg mx-auto w-full">
            {/* Header */}
            <div className="mb-6 sm:mb-8">
              <div className="inline-flex items-center gap-3 mb-3 sm:mb-4">
                <span className="w-8 sm:w-12 h-px bg-accent" />
                <span className="font-sans text-xs sm:text-sm text-accent tracking-[0.2em] sm:tracking-[0.3em] uppercase">
                  Contact
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-foreground leading-tight">
                Parlons de votre <span className="text-accent">projet</span>
              </h2>
              <p className="font-sans text-sm sm:text-base text-muted-foreground mt-2 sm:mt-3">
                Remplissez le formulaire ou contactez-nous directement.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="font-sans text-xs tracking-wider uppercase text-muted-foreground mb-1.5 sm:mb-2 block">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-background border border-border rounded-sm font-sans text-sm sm:text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                    placeholder="Votre nom"
                  />
                </div>
                <div>
                  <label className="font-sans text-xs tracking-wider uppercase text-muted-foreground mb-1.5 sm:mb-2 block">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-background border border-border rounded-sm font-sans text-sm sm:text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                    placeholder="+212 6..."
                  />
                </div>
              </div>

              <div>
                <label className="font-sans text-xs tracking-wider uppercase text-muted-foreground mb-1.5 sm:mb-2 block">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-background border border-border rounded-sm font-sans text-sm sm:text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                  placeholder="votre@email.com"
                />
              </div>

              <div>
                <label className="font-sans text-xs tracking-wider uppercase text-muted-foreground mb-1.5 sm:mb-2 block">
                  Service souhaité
                </label>
                <select
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-background border border-border rounded-sm font-sans text-sm sm:text-base text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
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
                <label className="font-sans text-xs tracking-wider uppercase text-muted-foreground mb-1.5 sm:mb-2 block">
                  Votre message
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-background border border-border rounded-sm font-sans text-sm sm:text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all resize-none"
                  placeholder="Décrivez votre projet..."
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button type="submit" variant="default" size="lg" className="flex-1 text-sm sm:text-base" disabled={isSubmitting}>
                  <Send className="w-4 h-4" />
                  {isSubmitting ? 'Envoi...' : 'Envoyer'}
                </Button>
                <Button 
                  type="button" 
                  variant="premium" 
                  size="lg"
                  onClick={handleWhatsApp}
                  className="flex-1 text-sm sm:text-base"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Right side - Map & Info */}
        <div className="lg:w-1/2 flex flex-col bg-primary">
          {/* Map */}
          <div className="h-48 sm:h-64 lg:flex-1 relative">
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
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {contactInfo.map((info, index) => (
                <div
                  key={index}
                  className="bg-primary-foreground/5 backdrop-blur-sm rounded-sm p-3 sm:p-4 hover:bg-primary-foreground/10 transition-colors duration-300"
                >
                  <info.icon className="w-4 h-4 sm:w-5 sm:h-5 text-accent mb-1.5 sm:mb-2" />
                  <h3 className="font-serif text-xs sm:text-sm text-primary-foreground mb-0.5 sm:mb-1">{info.title}</h3>
                  {info.details.map((detail, i) => (
                    <p key={i} className="font-sans text-xs text-primary-foreground/70 leading-tight">{detail}</p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer bar - now at the bottom */}
      <div className="bg-charcoal py-3 sm:py-4 px-4 sm:px-6 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
          <p className="font-sans text-xs text-primary-foreground/60 text-center sm:text-left">
            © 2024 RSS Studio. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4 sm:gap-6">
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
