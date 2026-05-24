import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Clock, ArrowRight, BookOpen, Loader2 } from 'lucide-react';
import { trainingsAPI } from '@/services/api';
import type { Training } from '@/types';

export default function Trainings() {
  const containerRef = useRef<HTMLDivElement>(null);
  useScroll({ target: containerRef, offset: ['start end', 'end start'] });

  const { data: trainings, isLoading } = useQuery<Training[]>({
    queryKey: ['trainings'],
    queryFn: async () => (await trainingsAPI.getAll()).data,
  });

  return (
    <section ref={containerRef} className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-[#ff6f00] text-sm font-semibold tracking-[2px] uppercase">Nos Formations</motion.span>
          <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="text-4xl lg:text-5xl font-bold text-[#1a237e] mt-4 mb-6">Renforcez vos compétences</motion.h2>
          <motion.p initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.4 }} className="text-gray-600 text-lg">Des programmes de formation professionnelle adaptés à vos besoins.</motion.p>
        </div>

        {isLoading && <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 text-[#1a237e] animate-spin" /></div>}

        {trainings && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trainings.slice(0, 6).map((training, index) => (
              <motion.div key={training.slug} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: index * 0.1 }}>
                <Link to={`/formations/${training.slug}`}>
                  <motion.div whileHover={{ y: -8 }} transition={{ duration: 0.3 }} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow h-full group">
                    <div className="h-40 bg-gradient-to-br from-[#1a237e] to-[#0d1245] flex items-center justify-center">
                      <BookOpen className="w-14 h-14 text-white/40" />
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-[#1a237e] mb-2 group-hover:text-[#ff6f00] transition-colors">{training.title}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{training.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-gray-500 text-sm">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{training.duration}</span>
                        </div>
                        {training.price && (
                          <span className="text-[#ff6f00] font-semibold text-sm">
                            {training.price.toLocaleString()} FCFA
                          </span>
                        )}
                      </div>
                      <div className="mt-4 flex items-center text-[#1a237e] font-medium text-sm group-hover:text-[#ff6f00] transition-colors">
                        <span>Voir détails</span>
                        <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link to="/formations">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-[#1a237e] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#0d1245] transition-colors">
              Voir toutes les formations
            </motion.button>
          </Link>
        </div>
      </div>
    </section>
  );
}
