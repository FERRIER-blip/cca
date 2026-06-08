import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { contactAPI } from '@/services/api';

const contactInfo = [
  { icon: MapPin, title: 'Adresse', content: "Gassi, 7ème arrondissement, N'Djaména, Tchad" },
  { icon: Phone, title: 'Téléphone', content: '+235 66 28 42 93' },
  { icon: Mail, title: 'Email', content: 'contact@cca-td.com' },
  { icon: Clock, title: 'Horaires', content: 'Lun - Ven: 8h00 - 17h00' },
];

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await contactAPI.sendMessage(formData);
      toast.success('Message envoyé avec succès ! Nous vous contacterons bientôt.');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-[#1a237e] to-[#0d1245] py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">Contactez-nous</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-white/70 text-lg max-w-2xl mx-auto">Nous sommes à votre écoute pour répondre à toutes vos questions.</motion.p>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-bold text-[#1a237e] mb-8">Nos coordonnées</h2>
              <div className="space-y-6 mb-12">
                {contactInfo.map((info) => (
                  <div key={info.title} className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#1a237e]/10 rounded-xl flex items-center justify-center shrink-0">
                      <info.icon className="w-5 h-5 text-[#1a237e]" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{info.title}</p>
                      <p className="text-gray-600">{info.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-gray-50 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-[#1a237e] mb-6">Envoyez-nous un message</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nom complet *</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleChange} required className="mt-1" placeholder="Votre nom" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required className="mt-1" placeholder="votre@email.com" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} className="mt-1" placeholder="+235 XX XX XX XX" />
                </div>
                <div>
                  <Label htmlFor="subject">Sujet *</Label>
                  <Input id="subject" name="subject" value={formData.subject} onChange={handleChange} required className="mt-1" placeholder="Objet de votre message" />
                </div>
                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea id="message" name="message" value={formData.message} onChange={handleChange} required rows={5} className="mt-1 resize-none" placeholder="Décrivez votre demande..." />
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full bg-[#1a237e] hover:bg-[#0d1245] text-white py-3">
                  {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Envoi en cours...</> : <><Send className="w-4 h-4 mr-2" />Envoyer le message</>}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
