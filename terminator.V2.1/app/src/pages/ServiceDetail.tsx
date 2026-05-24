import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, CheckCircle, Loader2, Scale, Building2, MessageSquare, Monitor, GraduationCap, Lightbulb, Briefcase } from 'lucide-react';
import { servicesAPI } from '@/services/api';
import type { Service } from '@/types';

const iconMap: Record<string, React.ElementType> = {
  scale: Scale, building2: Building2, 'message-square': MessageSquare,
  monitor: Monitor, 'graduation-cap': GraduationCap, lightbulb: Lightbulb, briefcase: Briefcase,
};

export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>();

  const { data: service, isLoading, isError } = useQuery<Service>({
    queryKey: ['service', slug],
    queryFn: async () => (await servicesAPI.getBySlug(slug!)).data,
    enabled: !!slug,
  });

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-10 h-10 text-[#1a237e] animate-spin" />
    </div>
  );

  if (isError || !service) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-gray-500 text-xl">Service introuvable.</p>
      <Link to="/services" className="text-[#1a237e] underline">Retour aux services</Link>
    </div>
  );

  const IconComponent = iconMap[service.icon] || Briefcase;

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-[#1a237e] to-[#0d1245] py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/services" className="inline-flex items-center text-white/70 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />Retour aux services
          </Link>
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center">
              <IconComponent className="w-10 h-10 text-white" />
            </div>
            <div>
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-4xl md:text-5xl font-bold text-white mb-3">{service.title}</motion.h1>
              <p className="text-white/70 text-lg">{service.description}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-[#1a237e] mb-6">À propos de ce service</h2>
              <p className="text-gray-600 leading-relaxed text-lg mb-8">{service.full_content || service.description}</p>

              <h3 className="text-xl font-bold text-[#1a237e] mb-4">Ce que nous offrons</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {['Expertise reconnue', 'Approche sur mesure', 'Accompagnement continu', 'Résultats mesurables', 'Équipe pluridisciplinaire', 'Suivi personnalisé'].map(item => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-[#ff6f00] shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="bg-gray-50 rounded-2xl p-6 sticky top-8">
                <h3 className="font-bold text-[#1a237e] text-lg mb-4">Intéressé par ce service ?</h3>
                <p className="text-gray-600 text-sm mb-6">Contactez-nous pour discuter de vos besoins et obtenir un devis personnalisé.</p>
                <Link to="/contact" className="block w-full bg-[#1a237e] text-white text-center py-3 rounded-xl font-semibold hover:bg-[#0d1245] transition-colors mb-3">Nous contacter</Link>
                <Link to="/formations" className="block w-full border border-[#1a237e] text-[#1a237e] text-center py-3 rounded-xl font-semibold hover:bg-[#1a237e]/5 transition-colors">Voir nos formations</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
