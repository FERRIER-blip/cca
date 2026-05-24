import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Calendar, ArrowRight, Loader2 } from 'lucide-react';
import { newsAPI } from '@/services/api';
import type { News } from '@/types';

export default function NewsPage() {
  const { data: news, isLoading } = useQuery<News[]>({
    queryKey: ['news'],
    queryFn: async () => (await newsAPI.getAll()).data,
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-[#1a237e] to-[#0d1245] py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">Actualités</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-white/70 text-lg max-w-2xl mx-auto">Restez informés des dernières nouvelles et activités du CCA.</motion.p>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading && <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 text-[#1a237e] animate-spin" /></div>}
          {news && news.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {news.map((article, index) => (
                <motion.div key={article.slug} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }}>
                  <Link to={`/actualites/${article.slug}`}>
                    <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.3 }} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-gray-100 h-full group">
                      {article.image_url ? (
                        <img src={article.image_url} alt={article.title} className="w-full h-48 object-cover" />
                      ) : (
                        <div className="w-full h-48 bg-gradient-to-br from-[#1a237e]/10 to-[#ff6f00]/10 flex items-center justify-center">
                          <span className="text-4xl">📰</span>
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex items-center text-gray-400 text-sm mb-3">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>{formatDate(article.published_at || article.created_at)}</span>
                        </div>
                        <h3 className="text-lg font-bold text-[#1a237e] mb-2 group-hover:text-[#ff6f00] transition-colors line-clamp-2">{article.title}</h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{article.excerpt}</p>
                        <div className="flex items-center text-[#1a237e] font-medium text-sm group-hover:text-[#ff6f00] transition-colors">
                          <span>Lire la suite</span>
                          <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
          {news?.length === 0 && !isLoading && (
            <p className="text-center text-gray-500 py-16">Aucune actualité disponible pour le moment.</p>
          )}
        </div>
      </section>
    </div>
  );
}
