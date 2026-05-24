import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Search, Trash2, Edit2, Loader2, X, GraduationCap, 
  Upload, ImageIcon, BookOpen, Users, Video, FileText, 
  ChevronRight, CheckCircle2, Lock, Layout 
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { trainingsAPI } from '@/services/api';
import type { Training, Module, Enrollment } from '@/types';

export default function AdminTrainings() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // --- ÉTATS ---
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState('general');

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    duration: '',
    price: 0,
    modules: [] as Module[], // Structure : { id, title, order, content: { text, video_url, exercise } }
  });

  // --- QUERIES ---
  const { data: trainings, isLoading } = useQuery<Training[]>({
    queryKey: ['admin-trainings'],
    queryFn: async () => (await trainingsAPI.getAll()).data,
  });

  // --- MUTATIONS ---
  const saveMutation = useMutation({
    mutationFn: async (payload: FormData) => {
      return selectedTraining 
        ? trainingsAPI.update(selectedTraining.id, payload) 
        : trainingsAPI.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-trainings'] });
      toast.success('Modifications enregistrées avec succès');
      handleCloseModal();
    }
  });

  // --- LOGIQUE DES MODULES ---
  const addModule = () => {
    const newModule: Module = {
      id: Date.now(),
      title: 'Nouveau Module',
      content_text: '',
      video_url: '',
      exercise_content: '',
      unlock_condition: 'previous_completed', // Condition par défaut
      order: formData.modules.length + 1
    };
    setFormData({ ...formData, modules: [...formData.modules, newModule] });
  };

  const updateModule = (id: number, field: keyof Module, value: any) => {
    const updatedModules = formData.modules.map(m => m.id === id ? { ...m, [field]: value } : m);
    setFormData({ ...formData, modules: updatedModules });
  };

  // --- HANDLERS ---
  const handleOpenModal = (training: Training | null = null) => {
    setSelectedTraining(training);
    if (training) {
      setFormData({
        title: training.title,
        slug: training.slug,
        description: training.description || '',
        duration: training.duration || '',
        price: training.price || 0,
        modules: training.modules || [], // On récupère les modules du backend
      });
      setImagePreview(training.image_url || null);
    } else {
      setFormData({ title: '', slug: '', description: '', duration: '', price: 0, modules: [] });
      setImagePreview(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setActiveTab('general');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'modules') {
        data.append(key, JSON.stringify(value));
      } else {
        data.append(key, String(value));
      }
    });
    if (selectedFile) data.append('image', selectedFile);
    saveMutation.mutate(data);
  };

  const filtered = trainings?.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase())) || [];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#1a237e] flex items-center gap-3">
          <Layout className="w-8 h-8 text-[#ff6f00]" /> Gestion Académique
        </h1>
        <Button onClick={() => handleOpenModal()} className="bg-[#1a237e] hover:bg-[#ff6f00] text-white transition-colors">
          <Plus className="w-4 h-4 mr-2" /> Créer un parcours
        </Button>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input placeholder="Chercher une formation ou un domaine..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
      </div>

      {/* Liste principale */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow>
              <TableHead>Parcours</TableHead>
              <TableHead>Inscrits</TableHead>
              <TableHead>Contenu</TableHead>
              <TableHead>Tarif</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-20"><Loader2 className="animate-spin inline" /></TableCell></TableRow>
            ) : filtered.map(training => (
              <TableRow key={training.id} className="hover:bg-gray-50/50 transition-colors">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img src={training.image_url || '/placeholder.png'} className="w-10 h-10 rounded-lg object-cover" />
                    <div>
                      <p className="font-bold text-gray-800">{training.title}</p>
                      <p className="text-xs text-gray-400">{training.duration}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span className="font-medium text-gray-700">{training.enrollments_count || 0} apprenants</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                    {training.modules?.length || 0} Modules
                  </span>
                </TableCell>
                <TableCell className="font-bold text-[#1a237e]">{training.price.toLocaleString()} FCFA</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleOpenModal(training)}><Edit2 className="w-4 h-4" /></Button>
                    <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-50" onClick={() => confirm('Archiver ce cours ?') && trainingsAPI.delete(training.id)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modal d'édition avancée */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a237e]/20 backdrop-blur-md p-4">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-3xl w-full max-w-5xl shadow-2xl max-h-[92vh] flex flex-col">
              <div className="p-6 border-b flex justify-between items-center bg-gray-50/50 rounded-t-3xl">
                <h2 className="text-2xl font-bold text-[#1a237e] flex items-center gap-2">
                  <BookOpen className="text-[#ff6f00]" /> Configuration du Parcours
                </h2>
                <Button variant="ghost" onClick={handleCloseModal}><X /></Button>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden flex flex-col">
                <div className="px-6 pt-4 bg-gray-50/50">
                  <TabsList className="grid grid-cols-3 w-[400px] mb-4">
                    <TabsTrigger value="general">Général</TabsTrigger>
                    <TabsTrigger value="curriculum">Programme</TabsTrigger>
                    <TabsTrigger value="students">Inscrits</TabsTrigger>
                  </TabsList>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                  {/* ONGLET 1 : GÉNÉRAL */}
                  <TabsContent value="general" className="space-y-6 mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="group relative w-full h-48 bg-gray-100 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                          {imagePreview ? <img src={imagePreview} className="w-full h-full object-cover" /> : <ImageIcon className="w-10 h-10 text-gray-300" />}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-sm"><Upload className="mr-2" /> Changer l'image</div>
                          <input type="file" ref={fileInputRef} hidden onChange={(e) => {
                            const file = e.target.files?.[0];
                            if(file) { setSelectedFile(file); setImagePreview(URL.createObjectURL(file)); }
                          }} />
                        </div>
                        <Input label="Titre" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                        <Input label="Durée estimée" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} />
                      </div>
                      <div className="space-y-4">
                        <label className="text-sm font-semibold">Résumé du cours</label>
                        <textarea className="w-full h-40 border rounded-xl p-4 outline-none focus:ring-2 focus:ring-[#ff6f00]" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                        <Input type="number" label="Prix de vente (FCFA)" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
                      </div>
                    </div>
                  </TabsContent>

                  {/* ONGLET 2 : PROGRAMME (MODULES & CHAPITRES) */}
                  <TabsContent value="curriculum" className="space-y-6 mt-0">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-gray-700">Structure de l'apprentissage</h3>
                      <Button size="sm" onClick={addModule} className="bg-[#ff6f00]"><Plus className="w-4 h-4 mr-1" /> Ajouter un module</Button>
                    </div>
                    
                    <div className="space-y-4">
                      {formData.modules.map((module, idx) => (
                        <div key={module.id} className="border rounded-2xl p-5 bg-white shadow-sm border-gray-100">
                          <div className="flex items-center gap-4 mb-4">
                            <span className="bg-[#1a237e] text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold">{idx + 1}</span>
                            <Input variant="ghost" className="text-lg font-bold p-0 focus:ring-0" value={module.title} onChange={e => updateModule(module.id, 'title', e.target.value)} />
                            <div className="flex gap-2">
                               <select className="text-xs border rounded-lg p-1" value={module.unlock_condition} onChange={e => updateModule(module.id, 'unlock_condition', e.target.value)}>
                                  <option value="none">Libre</option>
                                  <option value="previous_completed">Après module précédent</option>
                                  <option value="quiz_passed">Après succès exercice</option>
                               </select>
                               <Button size="sm" variant="ghost" className="text-red-400" onClick={() => setFormData({...formData, modules: formData.modules.filter(m => m.id !== module.id)})}><Trash2 className="w-4 h-4"/></Button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1"><FileText className="w-3 h-3"/> Contenu texte</label>
                              <textarea className="w-full h-32 border rounded-xl p-3 text-sm" placeholder="Contenu du chapitre..." value={module.content_text} onChange={e => updateModule(module.id, 'content_text', e.target.value)} />
                            </div>
                            <div className="space-y-4">
                                <div>
                                  <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1"><Video className="w-3 h-3"/> Lien Vidéo (YouTube/Vimeo)</label>
                                  <Input className="mt-1" placeholder="https://..." value={module.video_url} onChange={e => updateModule(module.id, 'video_url', e.target.value)} />
                                </div>
                                <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                                  <label className="text-xs font-bold text-amber-700 uppercase">Section Exercice / Question de validation</label>
                                  <Input variant="ghost" className="text-sm p-0 bg-transparent" placeholder="Question finale pour valider le module..." value={module.exercise_content} onChange={e => updateModule(module.id, 'exercise_content', e.target.value)} />
                                </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  {/* ONGLET 3 : LISTE DES INSCRITS */}
                  <TabsContent value="students" className="mt-0">
                    <div className="bg-gray-50 rounded-2xl p-4">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Apprenant</TableHead>
                              <TableHead>Date d'inscription</TableHead>
                              <TableHead>Progression</TableHead>
                              <TableHead>Statut</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedTraining?.enrollments?.map((enr: Enrollment) => (
                              <TableRow key={enr.id}>
                                <TableCell className="font-medium text-gray-700">{enr.user_name}</TableCell>
                                <TableCell className="text-gray-500 text-sm">{new Date(enr.enrolled_at).toLocaleDateString('fr-FR')}</TableCell>
                                <TableCell>
                                  <div className="w-full bg-gray-200 rounded-full h-1.5 max-w-[100px]">
                                    <div className="bg-[#ff6f00] h-1.5 rounded-full" style={{ width: `${enr.progress_percent}%` }} />
                                  </div>
                                  <span className="text-[10px] text-gray-400">{enr.progress_percent}% complété</span>
                                </TableCell>
                                <TableCell>
                                  {enr.progress_percent === 100 ? 
                                    <span className="text-green-600 flex items-center gap-1 text-xs"><CheckCircle2 className="w-3 h-3"/> Terminé</span> : 
                                    <span className="text-blue-600 flex items-center gap-1 text-xs font-medium"><Loader2 className="w-3 h-3 animate-spin"/> En cours</span>
                                  }
                                </TableCell>
                              </TableRow>
                            )) || <TableRow><TableCell colSpan={4} className="text-center py-10 text-gray-400">Aucun inscrit pour le moment</TableCell></TableRow>}
                          </TableBody>
                        </Table>
                    </div>
                  </TabsContent>
                </div>

                <div className="p-6 border-t bg-gray-50/50 flex gap-3 justify-end rounded-b-3xl">
                  <Button variant="ghost" onClick={handleCloseModal}>Annuler</Button>
                  <Button className="bg-[#1a237e] text-white px-8" onClick={handleSubmit} disabled={saveMutation.isPending}>
                    {saveMutation.isPending ? <Loader2 className="animate-spin mr-2" /> : <CheckCircle2 className="mr-2 w-4 h-4" />}
                    Publier le parcours
                  </Button>
                </div>
              </Tabs>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}