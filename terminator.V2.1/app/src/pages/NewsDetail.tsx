import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Calendar, Loader2 } from 'lucide-react';
import { newsAPI } from '@/services/api';
import type { News } from '@/types';

export default function NewsDetail() {
  const { slug } = useParams<{ slug: string }>();

  const { data: article, isLoading, isError } = useQuery<News>({
    queryKey: ['news', slug],
    queryFn: async () => (await newsAPI.getBySlug(slug!)).data,
    enabled: !!slug,
  });

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-10 h-10 text-[#1a237e] animate-spin" />
    </div>
  );

  if (isError || !article) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-gray-500 text-xl">Article introuvable.</p>
      <Link to="/actualites" className="text-[#1a237e] underline">Retour aux actualités</Link>
    </div>
  );

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-[#1a237e] to-[#0d1245] py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/actualites" className="inline-flex items-center text-white/70 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />Retour aux actualités
          </Link>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-5xl font-bold text-white mb-4">{article.title}</motion.h1>
          <div className="flex items-center gap-4 text-white/60 text-sm">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(article.published_at || article.created_at)}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {article.image_url && (
            <img src={article.image_url} alt={article.title} className="w-full h-72 object-cover rounded-2xl mb-10" />
          )}
          <p className="text-xl text-gray-600 mb-8 font-medium leading-relaxed">{article.excerpt}</p>
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-line">{article.content}</div>

          <div className="mt-12 pt-8 border-t border-gray-100">
            <Link to="/actualites" className="inline-flex items-center gap-2 text-[#1a237e] font-medium hover:text-[#ff6f00] transition-colors">
              <ArrowLeft className="w-4 h-4" />Retour aux actualités
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
