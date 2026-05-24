import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Clock, Loader2, BookOpen, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { trainingsAPI } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import type { Training } from '@/types';

export default function TrainingDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: training, isLoading, isError } = useQuery<Training>({
    queryKey: ['training', slug],
    queryFn: async () => (await trainingsAPI.getBySlug(slug!)).data,
    enabled: !!slug,
  });

  const enrollMutation = useMutation({
    mutationFn: () => trainingsAPI.enroll(training!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-enrollments'] });
      toast.success("Inscription réussie ! Vous recevrez une confirmation.");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Erreur lors de l'inscription");
    },
  });

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-10 h-10 text-[#1a237e] animate-spin" />
    </div>
  );

  if (isError || !training) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-gray-500 text-xl">Formation introuvable.</p>
      <Link to="/formations" className="text-[#1a237e] underline">Retour aux formations</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-[#1a237e] to-[#0d1245] py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/formations" className="inline-flex items-center text-white/70 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />Retour aux formations
          </Link>
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <div>
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold text-white mb-3">{training.title}</motion.h1>
              <p className="text-white/70 text-lg">{training.description}</p>
              <div className="flex gap-4 mt-4">
                {training.duration && (
                  <div className="flex items-center gap-2 text-white/80 text-sm">
                    <Clock className="w-4 h-4" />{training.duration}
                  </div>
                )}
                {training.price && (
                  <span className="text-[#ff6f00] font-bold">{training.price.toLocaleString()} FCFA</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-[#1a237e] mb-6">À propos de cette formation</h2>
              <p className="text-gray-600 leading-relaxed text-lg mb-8">{training.full_content || training.description}</p>

              <h3 className="text-xl font-bold text-[#1a237e] mb-4">Ce que vous apprendrez</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {['Maîtriser les concepts fondamentaux', 'Appliquer les bonnes pratiques', 'Développer des compétences pratiques', 'Travailler en situation réelle', 'Obtenir une attestation reconnue'].map(item => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-[#ff6f00] shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="bg-gray-50 rounded-2xl p-6 sticky top-8">
                <h3 className="font-bold text-[#1a237e] text-lg mb-2">Inscription à la formation</h3>
                {training.price && (
                  <p className="text-3xl font-bold text-[#ff6f00] mb-4">{training.price.toLocaleString()} FCFA</p>
                )}
                {training.duration && (
                  <div className="flex items-center gap-2 text-gray-600 text-sm mb-6">
                    <Clock className="w-4 h-4" />Durée : {training.duration}
                  </div>
                )}
                {isAuthenticated ? (
                  <Button onClick={() => enrollMutation.mutate()} disabled={enrollMutation.isPending} className="w-full bg-[#ff6f00] hover:bg-[#e65100] text-white py-3">
                    {enrollMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "S'inscrire maintenant"}
                  </Button>
                ) : (
                  <div>
                    <Link to="/login" className="block w-full bg-[#ff6f00] text-white text-center py-3 rounded-xl font-semibold hover:bg-[#e65100] transition-colors mb-2">Se connecter pour s'inscrire</Link>
                    <Link to="/register" className="block w-full border border-[#1a237e] text-[#1a237e] text-center py-3 rounded-xl font-semibold hover:bg-[#1a237e]/5 transition-colors text-sm">Créer un compte</Link>
                  </div>
                )}
                <p className="text-gray-400 text-xs text-center mt-3">Attestation délivrée à la fin de la formation</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
