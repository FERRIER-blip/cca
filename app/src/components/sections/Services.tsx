import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { 
  Scale, Building2, MessageSquare, Monitor, GraduationCap, 
  Lightbulb, Briefcase, ArrowRight, Loader2
} from 'lucide-react';
import { servicesAPI } from '@/services/api';
import type { Service } from '@/types';

const iconMap: Record<string, React.ElementType> = {
  scale: Scale, building2: Building2, 'message-square': MessageSquare,
  monitor: Monitor, 'graduation-cap': GraduationCap, lightbulb: Lightbulb, briefcase: Briefcase,
};
const colors = ['#1a237e', '#ff6f00', '#4fc3f7', '#1a237e', '#ff6f00', '#4fc3f7'];

export default function Services() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  const { data: services, isLoading } = useQuery<Service[]>({
    queryKey: ['services'],
    queryFn: async () => (await servicesAPI.getAll()).data,
  });

  return (
    <section ref={containerRef} className="py-24 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-[#ff6f00] text-sm font-semibold tracking-[2px] uppercase">Nos Services</motion.span>
          <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="text-4xl lg:text-5xl font-bold text-[#1a237e] mt-4 mb-6">Des solutions adaptées à vos besoins</motion.h2>
          <motion.p initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.4 }} className="text-gray-600 text-lg">Nous offrons une gamme complète de services pour accompagner votre développement et garantir votre conformité.</motion.p>
        </div>

        {isLoading && <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 text-[#1a237e] animate-spin" /></div>}

        {services && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const IconComponent = iconMap[service.icon] || Briefcase;
              const color = colors[index % colors.length];
              return (
                <motion.div key={service.slug} initial={{ opacity: 0, rotateY: -90 }} whileInView={{ opacity: 1, rotateY: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.7 + index * 0.1 }} style={{ y, transformStyle: 'preserve-3d', perspective: 1000 }}>
                  <Link to={`/services/${service.slug}`}>
                    <motion.div whileHover={{ y: -15, rotateX: 5, rotateY: -5, translateZ: 30 }} transition={{ duration: 0.4 }} className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow h-full group">
                      <motion.div whileHover={{ scale: 1.2, rotate: 10 }} transition={{ duration: 0.3 }} className="w-16 h-16 rounded-xl flex items-center justify-center mb-6" style={{ backgroundColor: `${color}15` }}>
                        <IconComponent className="w-8 h-8 transition-colors duration-300" style={{ color }} />
                      </motion.div>
                      <h3 className="text-xl font-bold text-[#1a237e] mb-3 group-hover:text-[#ff6f00] transition-colors duration-300">{service.title}</h3>
                      <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                      <div className="flex items-center text-[#1a237e] font-medium group-hover:text-[#ff6f00] transition-colors duration-300">
                        <span>En savoir plus</span>
                        <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-2" />
                      </div>
                      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#ff6f00] transition-colors duration-300 pointer-events-none" />
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
