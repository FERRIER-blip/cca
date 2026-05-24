import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, CheckCircle2, PlayCircle, 
  Lock, FileText, ArrowRight, Loader2, Menu
} from 'lucide-react';
import { trainingsAPI, progressAPI } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import type { Training, ModuleProgress } from '@/types';

export default function CoursePlayer() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // 1. Charger les détails de la formation
  const { data: training, isLoading } = useQuery<Training>({
    queryKey: ['training-player', slug],
    queryFn: async () => (await trainingsAPI.getBySlug(slug!)).data,
    enabled: !!slug,
  });

  // 2. Charger le statut de progression (quels modules sont finis)
  const { data: progressStatus } = useQuery<ModuleProgress[]>({
    queryKey: ['progress-status', training?.id],
    queryFn: async () => (await progressAPI.getTrainingStatus(training!.id)).data,
    enabled: !!training?.id,
  });

  // 3. Mutation pour valider un module
  const completeMutation = useMutation({
    mutationFn: (moduleId: number) => progressAPI.completeModule(moduleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progress-status'] });
      queryClient.invalidateQueries({ queryKey: ['my-enrollments'] });
      // Passer au module suivant automatiquement s'il existe
      if (training && activeModuleIndex < training.modules.length - 1) {
        setActiveModuleIndex(prev => prev + 1);
      }
    },
  });

  const activeModule = training?.modules[activeModuleIndex];
  const isCompleted = (moduleId: number) => progressStatus?.some(p => p.module_id === moduleId && p.is_completed);

  if (isLoading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 className="w-12 h-12 text-[#1a237e] animate-spin mb-4" />
      <p className="text-gray-500 font-medium">Préparation de votre espace d'étude...</p>
    </div>
  );

  if (!training) return <div>Formation non trouvée.</div>;

  return (
    <div className="flex h-screen bg-[#f8f9fa] overflow-hidden">
      
      {/* SIDEBAR : Liste des chapitres */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 350 : 0, opacity: isSidebarOpen ? 1 : 0 }}
        className="bg-white border-r border-gray-200 flex flex-col shadow-xl z-20"
      >
        <div className="p-6 border-b">
          <Button variant="ghost" size="sm" onClick={() => navigate('/client/dashboard')} className="mb-4 -ml-2 text-gray-500">
            <ChevronLeft className="w-4 h-4 mr-1" /> Retour au dashboard
          </Button>
          <h2 className="font-bold text-[#1a237e] text-lg leading-tight">{training.title}</h2>
          <div className="mt-4">
            <div className="flex justify-between text-xs font-bold mb-1 text-gray-400">
              <span>PROGRESSION</span>
              <span>{Math.round((progressStatus?.length || 0) / (training.modules.length || 1) * 100)}%</span>
            </div>
            <Progress value={(progressStatus?.length || 0) / (training.modules.length || 1) * 100} className="h-2" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {training.modules.sort((a, b) => a.order - b.order).map((module, index) => {
            const isDone = isCompleted(module.id);
            const isActive = activeModuleIndex === index;
            
            return (
              <button
                key={module.id}
                onClick={() => setActiveModuleIndex(index)}
                className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all text-left ${
                  isActive ? 'bg-[#1a237e] text-white shadow-lg' : 'hover:bg-gray-50 text-gray-600'
                }`}
              >
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                  isDone ? 'bg-green-500 text-white' : isActive ? 'bg-white/20' : 'bg-gray-100'
                }`}>
                  {isDone ? <CheckCircle2 className="w-5 h-5" /> : index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold truncate ${isActive ? 'text-white' : 'text-gray-700'}`}>
                    {module.title}
                  </p>
                  <p className={`text-[10px] uppercase tracking-wider font-medium opacity-60`}>
                    {module.video_url ? 'Vidéo' : 'Lecture'}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </motion.aside>

      {/* CONTENU PRINCIPAL : Lecteur Vidéo & Texte */}
      <main className="flex-1 flex flex-col relative overflow-y-auto bg-white">
        
        {/* Barre du haut mobile/desktop */}
        <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 border-b p-4 flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <Menu className="w-6 h-6 text-[#1a237e]" />
          </Button>
          <div className="flex items-center gap-4">
             <span className="text-sm font-bold text-gray-400 hidden sm:block">Module {activeModuleIndex + 1} sur {training.modules.length}</span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto w-full p-6 md:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeModule?.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* Lecteur Vidéo (si présent) */}
              {activeModule?.video_url && (
                <div className="aspect-video w-full rounded-3xl overflow-hidden shadow-2xl bg-black border-4 border-white">
                  <iframe 
                    className="w-full h-full"
                    src={activeModule.video_url.replace("watch?v=", "embed/")} 
                    title={activeModule.title}
                    allowFullScreen
                  />
                </div>
              )}

              {/* Titre et Contenu */}
              <div>
                <h1 className="text-3xl font-extrabold text-[#1a237e] mb-4">{activeModule?.title}</h1>
                <div className="prose prose-blue max-w-none text-gray-600 leading-relaxed">
                  {activeModule?.content_text || "Aucun contenu textuel pour ce module."}
                </div>
              </div>

              {/* Zone d'exercices / Ressources */}
              {activeModule?.exercise_content && (
                <div className="bg-[#fff3e0] border-l-4 border-[#ff6f00] p-6 rounded-r-2xl">
                  <h4 className="flex items-center font-bold text-[#e65100] mb-2">
                    <FileText className="w-5 h-5 mr-2" /> Exercice d'application
                  </h4>
                  <p className="text-gray-700 text-sm">{activeModule.exercise_content}</p>
                </div>
              )}

              {/* Actions de navigation */}
              <div className="flex items-center justify-between pt-10 border-t">
                <Button 
                  variant="outline" 
                  disabled={activeModuleIndex === 0}
                  onClick={() => setActiveModuleIndex(prev => prev - 1)}
                  className="rounded-xl"
                >
                  Précédent
                </Button>

                {!isCompleted(activeModule?.id!) ? (
                  <Button 
                    onClick={() => completeMutation.mutate(activeModule!.id)}
                    disabled={completeMutation.isPending}
                    className="bg-[#ff6f00] hover:bg-[#e65100] rounded-xl px-8 font-bold shadow-lg shadow-orange-200"
                  >
                    {completeMutation.isPending ? <Loader2 className="animate-spin" /> : "Marquer comme terminé"}
                  </Button>
                ) : (
                   <Button 
                    onClick={() => setActiveModuleIndex(prev => prev + 1)}
                    disabled={activeModuleIndex === training.modules.length - 1}
                    className="bg-[#1a237e] rounded-xl"
                  >
                    Module suivant <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}