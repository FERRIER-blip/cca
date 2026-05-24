import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Scale, Building2, MessageSquare, Monitor, GraduationCap, Lightbulb, Briefcase, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import { servicesAPI } from '@/services/api';
import type { Service } from '@/types';

const iconMap: Record<string, React.ElementType> = {
  scale: Scale, building2: Building2, 'message-square': MessageSquare,
  monitor: Monitor, 'graduation-cap': GraduationCap, lightbulb: Lightbulb, briefcase: Briefcase,
};
const colors = ['#1a237e', '#ff6f00', '#4fc3f7', '#1a237e', '#ff6f00', '#4fc3f7'];

export default function ServicesPage() {
  const { data: services, isLoading } = useQuery<Service[]>({
    queryKey: ['services'],
    queryFn: async () => (await servicesAPI.getAll()).data,
  });

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-[#1a237e] to-[#0d1245] py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">Nos Services</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-white/70 text-lg max-w-2xl mx-auto">Une expertise complète pour accompagner votre développement institutionnel et organisationnel.</motion.p>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading && <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 text-[#1a237e] animate-spin" /></div>}
          {services && (
            <div className="space-y-16">
              {services.map((service, index) => {
                const IconComponent = iconMap[service.icon] || Briefcase;
                const color = colors[index % colors.length];
                const isEven = index % 2 === 0;
                return (
                  <motion.div key={service.slug} initial={{ opacity: 0, x: isEven ? -50 : 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}>
                    <div className="lg:w-1/2">
                      <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: `${color}15` }}>
                        <IconComponent className="w-10 h-10" style={{ color }} />
                      </div>
                      <h2 className="text-3xl font-bold text-[#1a237e] mb-4">{service.title}</h2>
                      <p className="text-gray-600 text-lg mb-6">{service.description}</p>
                      {service.full_content && (
                        <p className="text-gray-500 mb-8">{service.full_content}</p>
                      )}
                      <Link to={`/services/${service.slug}`} className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-xl font-semibold transition-colors" style={{ backgroundColor: color }}>
                        En savoir plus <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                    <div className="lg:w-1/2">
                      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: `${color}10`, border: `2px solid ${color}20` }}>
                        <div className="p-8">
                          <h3 className="text-lg font-bold mb-4" style={{ color }}>Points clés</h3>
                          <div className="space-y-3">
                            {['Expertise reconnue', 'Approche sur mesure', 'Résultats mesurables', 'Accompagnement continu', 'Équipe pluridisciplinaire'].map((feat) => (
                              <div key={feat} className="flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 shrink-0" style={{ color }} />
                                <span className="text-gray-700">{feat}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
