import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, User, Loader2, BookOpen, Clock, 
  ChevronRight, Award, PlayCircle, FileText, Settings 
} from 'lucide-react';
import { trainingsAPI } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress'; // Assurez-vous d'avoir ce composant shadcn ou créez-en un simple
import type { Enrollment } from '@/types';

export default function ClientDashboard() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed'>('all');

  const { data: enrollments, isLoading } = useQuery<Enrollment[]>({
    queryKey: ['my-enrollments'],
    queryFn: async () => (await trainingsAPI.getMyEnrollments()).data,
  });

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    active: 'bg-blue-100 text-blue-700 border-blue-200',
    completed: 'bg-green-100 text-green-700 border-green-200',
    cancelled: 'bg-red-100 text-red-700 border-red-200',
  };

  const filteredEnrollments = enrollments?.filter(e => {
    if (activeTab === 'all') return true;
    return e.status === activeTab;
  });

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-8">
      <div className="max-w-5xl mx-auto px-4">
        
        {/* Header avec Actions Rapides */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-3xl font-extrabold text-[#1a237e] tracking-tight">
              Tableau de bord
            </h1>
            <p className="text-gray-500">Ravi de vous revoir, <span className="font-semibold text-[#ff6f00]">{user?.first_name}</span> 👋</p>
          </motion.div>
          
          <div className="flex gap-3">
            <Button variant="outline" asChild className="rounded-xl shadow-sm">
              <Link to="/client/profil"><Settings className="w-4 h-4 mr-2" /> Paramètres</Link>
            </Button>
            <Button asChild className="bg-[#ff6f00] hover:bg-[#e65100] rounded-xl shadow-md transition-all active:scale-95">
              <Link to="/formations">Nouvelle formation</Link>
            </Button>
          </div>
        </div>

        {/* Stats Grid avec Effet Hover */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {[
            { label: 'Formations', value: enrollments?.length || 0, icon: GraduationCap, color: '#1a237e' },
            { label: 'En cours', value: enrollments?.filter(e => e.status === 'active').length || 0, icon: PlayCircle, color: '#ff6f00' },
            { label: 'Certificats', value: enrollments?.filter(e => e.status === 'completed').length || 0, icon: Award, color: '#10b981' },
          ].map((stat, i) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold mt-1" style={{ color: stat.color }}>{stat.value}</p>
                </div>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner" style={{ backgroundColor: `${stat.color}10` }}>
                  <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Onglets de filtrage */}
          <div className="flex border-b">
            {(['all', 'active', 'completed'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 text-sm font-semibold transition-all relative ${
                  activeTab === tab ? 'text-[#1a237e]' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab === 'all' ? 'Toutes mes formations' : tab === 'active' ? 'En cours' : 'Terminées'}
                {activeTab === tab && (
                  <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-[#ff6f00]" />
                )}
              </button>
            ))}
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="flex flex-col items-center py-12">
                <Loader2 className="w-10 h-10 text-[#1a237e] animate-spin mb-4" />
                <p className="text-gray-400 animate-pulse">Synchronisation de vos cours...</p>
              </div>
            ) : filteredEnrollments && filteredEnrollments.length > 0 ? (
              <div className="grid gap-4">
                <AnimatePresence mode="popLayout">
                  {filteredEnrollments.map((enrollment) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      key={enrollment.id}
                      className="group flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl bg-[#fcfcfd] border border-gray-100 hover:border-[#1a237e20] transition-all"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${statusColors[enrollment.status]}`}>
                            {enrollment.status}
                          </span>
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {enrollment.training.duration}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-[#1a237e] transition-colors">
                          {enrollment.training.title}
                        </h3>
                        
                        {/* Barre de progression fictive pour le dashboard */}
                        <div className="mt-3 w-full md:max-w-xs">
                          <div className="flex justify-between text-[10px] mb-1 font-medium text-gray-500">
                            <span>Progression</span>
                            <span>{enrollment.status === 'completed' ? '100%' : '25%'}</span>
                          </div>
                          <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-1000 ${enrollment.status === 'completed' ? 'bg-green-500' : 'bg-[#ff6f00]'}`}
                              style={{ width: enrollment.status === 'completed' ? '100%' : '25%' }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 md:mt-0 flex gap-2">
                        {enrollment.status === 'completed' ? (
                          <Button variant="outline" size="sm" className="rounded-lg border-green-200 text-green-700 hover:bg-green-50">
                            <Award className="w-4 h-4 mr-2" /> Certificat
                          </Button>
                        ) : (
                          <Button size="sm" asChild className="rounded-lg bg-[#1a237e] hover:bg-[#0d1245]">
                            <Link to={`/formations/${enrollment.training.slug}`}>
                              Continuer <ChevronRight className="w-4 h-4 ml-1" />
                            </Link>
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" className="rounded-lg text-gray-400 hover:text-gray-600">
                          <FileText className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-gray-200">
                  <BookOpen className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-gray-900 font-bold text-lg">Aucune formation ici</h3>
                <p className="text-gray-500 mb-6 max-w-xs mx-auto">
                  Il semblerait que vous n'ayez pas encore de cours dans cette catégorie.
                </p>
                <Button asChild className="bg-[#1a237e] rounded-xl px-8">
                  <Link to="/formations">Découvrir le catalogue</Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Footer info/support */}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between p-6 bg-gradient-to-r from-[#1a237e] to-[#283593] rounded-3xl text-white">
          <div>
            <h4 className="font-bold text-lg">Besoin d'assistance technique ?</h4>
            <p className="text-blue-100 text-sm">Nos conseillers pédagogiques sont disponibles du lundi au vendredi.</p>
          </div>
          <Button asChild className="mt-4 md:mt-0 bg-white text-[#1a237e] hover:bg-blue-50 rounded-xl px-6 font-bold shadow-lg">
            <Link to="/contact">Contacter le support</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}