import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2, CheckCircle, XCircle, Loader2, Star, Trophy, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { testimonialsAPI } from '@/services/api';
import type { Testimonial } from '@/types';

export default function AdminTestimonials() {
  const queryClient = useQueryClient();

  const { data: testimonials, isLoading } = useQuery<Testimonial[]>({
    queryKey: ['admin-testimonials'],
    queryFn: async () => {
      const response = await testimonialsAPI.getAll();
      return response.data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Testimonial> }) => {
      return await testimonialsAPI.update(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
    },
    onError: (error: any) => {
      console.error("Update Error:", error);
      toast.error(error.response?.data?.detail || "Erreur lors de la mise à jour");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await testimonialsAPI.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
      toast.success('Témoignage supprimé');
    },
    onError: () => {
      toast.error("Impossible de supprimer ce témoignage");
    }
  });

  const handleToggleApprove = (t: Testimonial) => {
    updateMutation.mutate(
      { id: t.id, data: { is_approved: !t.is_approved } },
      { onSuccess: () => toast.success(t.is_approved ? 'Témoignage masqué' : 'Témoignage publié') }
    );
  };

  const handleToggleFeatured = (t: Testimonial) => {
    updateMutation.mutate(
      { id: t.id, data: { is_featured: !t.is_featured } },
      { onSuccess: () => toast.success('Mise en avant mise à jour') }
    );
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-end"
      >
        <div>
          <h1 className="text-3xl font-bold text-[#1a237e]">Témoignages</h1>
          <p className="text-gray-500">Gérez les avis clients et la mise en avant sur le site.</p>
        </div>
        <div className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          {testimonials?.length || 0} avis au total
        </div>
      </motion.div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-10 h-10 text-[#1a237e] animate-spin" />
          <p className="text-gray-400 animate-pulse">Chargement des avis...</p>
        </div>
      ) : (
        <div className="grid gap-4">
          <AnimatePresence mode="popLayout">
            {testimonials?.map((t) => (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className={`group relative bg-white rounded-2xl p-6 shadow-sm border transition-all ${
                  t.is_approved ? 'border-gray-100' : 'border-amber-200 bg-amber-50/30'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex gap-4">
                    <div className="hidden sm:flex h-12 w-12 rounded-full bg-gray-100 items-center justify-center shrink-0">
                      <Quote className="w-6 h-6 text-gray-300" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-gray-900 text-lg">
                          {t.author_name}
                        </p>
                        {t.is_featured && (
                          <Trophy className="w-4 h-4 text-blue-600 fill-blue-600" />
                        )}
                      </div>
                      <p className="text-sm text-gray-500 font-medium italic">
                        {t.author_title}
                        {t.author_company && ` @ ${t.author_company}`}
                      </p>
                      <div className="flex gap-0.5 mt-1.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < (t.rating ?? 0)
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 items-center shrink-0">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        t.is_approved
                          ? 'bg-green-100 text-green-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {t.is_approved ? 'Public' : 'En attente'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 text-gray-700 leading-relaxed bg-gray-50/50 p-4 rounded-xl border border-gray-50">
                  "{t.content}"
                </div>

                <div className="mt-6 flex flex-wrap justify-between items-center gap-4 border-t pt-4">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={t.is_approved ? "outline" : "default"}
                      onClick={() => handleToggleApprove(t)}
                      disabled={updateMutation.isPending}
                    >
                      {t.is_approved ? (
                        <XCircle className="w-3 h-3 mr-2" />
                      ) : (
                        <CheckCircle className="w-3 h-3 mr-2" />
                      )}
                      {t.is_approved ? 'Retirer du site' : 'Approuver'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleFeatured(t)}
                      disabled={updateMutation.isPending}
                    >
                      <Trophy className="w-3 h-3 mr-2" />
                      {t.is_featured ? 'Vedette' : 'Mettre en vedette'}
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-400 hover:text-red-600 hover:bg-red-50"
                    disabled={deleteMutation.isPending}
                    onClick={() => {
                      if (confirm('Supprimer définitivement ?')) {
                        deleteMutation.mutate(t.id);
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Supprimer
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {!isLoading && !testimonials?.length && (
        <div className="bg-gray-50 border-2 border-dashed rounded-3xl py-20 text-center">
          <Quote className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500">Aucun témoignage pour le moment.</p>
        </div>
      )}
    </div>
  );
}