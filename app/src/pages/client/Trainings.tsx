import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, BookOpen, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { trainingsAPI } from '@/services/api';
import type { Training, Enrollment } from '@/types';

export default function ClientTrainings() {
  const queryClient = useQueryClient();

  const { data: trainings, isLoading: trainingsLoading } = useQuery<Training[]>({
    queryKey: ['trainings'],
    queryFn: async () => (await trainingsAPI.getAll()).data,
  });

  const { data: enrollments } = useQuery<Enrollment[]>({
    queryKey: ['my-enrollments'],
    queryFn: async () => (await trainingsAPI.getMyEnrollments()).data,
  });

  const enrollMutation = useMutation({
    mutationFn: (trainingId: number) => trainingsAPI.enroll(trainingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-enrollments'] });
      toast.success('Inscription réussie ! Vous recevrez une confirmation.');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Erreur lors de l\'inscription');
    },
  });

  const enrolledIds = new Set(enrollments?.map(e => e.training_id) || []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-[#1a237e]">Formations disponibles</h1>
          <p className="text-gray-600 mt-1">Inscrivez-vous aux formations qui vous intéressent.</p>
        </motion.div>

        {trainingsLoading && <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-[#1a237e] animate-spin" /></div>}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trainings?.map((training, index) => {
            const isEnrolled = enrolledIds.has(training.id);
            return (
              <motion.div key={training.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                <div className="h-36 bg-gradient-to-br from-[#1a237e] to-[#0d1245] flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-white/30" />
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-[#1a237e] mb-1">{training.title}</h3>
                  <p className="text-gray-500 text-sm mb-3 line-clamp-2">{training.description}</p>
                  <div className="flex items-center gap-3 text-sm text-gray-400 mb-4">
                    <div className="flex items-center gap-1"><Clock className="w-3 h-3" />{training.duration}</div>
                    {training.price && <span className="text-[#ff6f00] font-semibold">{training.price.toLocaleString()} FCFA</span>}
                  </div>
                  {isEnrolled ? (
                    <div className="flex items-center gap-2 text-green-600 font-medium text-sm">
                      <CheckCircle className="w-4 h-4" />Inscrit
                    </div>
                  ) : (
                    <Button onClick={() => enrollMutation.mutate(training.id)} disabled={enrollMutation.isPending} className="w-full bg-[#1a237e] hover:bg-[#0d1245] text-white text-sm">
                      {enrollMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "S'inscrire"}
                    </Button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
