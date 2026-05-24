import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Clock, ArrowRight, BookOpen, Users, Award, Loader2 } from 'lucide-react';
import { trainingsAPI } from '@/services/api';
import type { Training } from '@/types';

const features = [
  { icon: BookOpen, title: 'Contenu de qualité', description: 'Des programmes élaborés par des experts' },
  { icon: Users, title: 'Apprentissage interactif', description: 'Sessions pratiques et études de cas' },
  { icon: Award, title: 'Certification', description: 'Attestation de formation reconnue' },
];

export default function TrainingsPage() {
  const { data: trainings, isLoading } = useQuery<Training[]>({
    queryKey: ['trainings'],
    queryFn: async () => (await trainingsAPI.getAll()).data,
  });

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-[#1a237e] to-[#0d1245] py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">Nos Formations</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-white/70 text-lg max-w-2xl mx-auto">Renforcez vos compétences avec nos programmes de formation professionnelle certifiants.</motion.p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f) => (
              <div key={f.title} className="flex items-start gap-4 bg-white rounded-2xl p-6 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-[#1a237e]/10 flex items-center justify-center shrink-0">
                  <f.icon className="w-6 h-6 text-[#1a237e]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#1a237e] mb-1">{f.title}</h3>
                  <p className="text-gray-600 text-sm">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#1a237e] mb-12">Toutes nos formations</h2>
          {isLoading && <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 text-[#1a237e] animate-spin" /></div>}
          {trainings && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {trainings.map((training, index) => (
                <motion.div key={training.slug} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }}>
                  <Link to={`/formations/${training.slug}`}>
                    <motion.div whileHover={{ y: -8 }} transition={{ duration: 0.3 }} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow h-full group">
                      <div className="h-40 bg-gradient-to-br from-[#1a237e] to-[#0d1245] flex items-center justify-center">
                        <BookOpen className="w-14 h-14 text-white/30" />
                      </div>
                      <div className="p-6">
                        <h3 className="text-lg font-bold text-[#1a237e] mb-2 group-hover:text-[#ff6f00] transition-colors">{training.title}</h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{training.description}</p>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center text-gray-500 text-sm">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>{training.duration}</span>
                          </div>
                          {training.price && (
                            <span className="text-[#ff6f00] font-semibold">{training.price.toLocaleString()} FCFA</span>
                          )}
                        </div>
                        <div className="flex items-center text-[#1a237e] font-medium text-sm group-hover:text-[#ff6f00] transition-colors">
                          <span>Voir les détails</span>
                          <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
          {trainings?.length === 0 && !isLoading && (
            <p className="text-center text-gray-500 py-16">Aucune formation disponible pour le moment.</p>
          )}
        </div>
      </section>
    </div>
  );
}
