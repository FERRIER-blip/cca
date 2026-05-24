import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
 Plus, Search, Trash2, Edit2, Loader2, X,
Upload, ImageIcon, Users, Video,
CheckCircle2, Layout, MoreVertical
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';

// API & Types
import { trainingsAPI } from '@/services/api';
import type { Training, Module } from '@/types';

export default function AdminTrainings() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // States
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
    modules: [] as Module[],
  });

  // Queries
  const { data: trainings, isLoading, error } = useQuery<Training[]>({
    queryKey: ['admin-trainings'],
    queryFn: async () => {
      const response = await trainingsAPI.getAll();
      return response.data;
    },
  });

  // Mutation
  const saveMutation = useMutation({
    mutationFn: async (payload: FormData) => {
      if (selectedTraining) {
        return trainingsAPI.update(selectedTraining.id, payload);
      }
      return trainingsAPI.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-trainings'] });
      toast.success(selectedTraining ? 'Parcours mis à jour' : 'Nouveau parcours créé');
      handleCloseModal();
    },
    onError: (err: any) => {
      const msg = err.response?.data?.detail || "Une erreur est survenue lors de la sauvegarde";
      toast.error(msg);
      console.error("Erreur de sauvegarde:", err);
    }
  });

  // Mutation pour la suppression
const deleteMutation = useMutation({
  mutationFn: async (id: number) => {
    return trainingsAPI.delete(id);
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['admin-trainings'] });
    toast.success('Parcours supprimé avec succès');
  },
  onError: (err: any) => {
    const msg = err.response?.data?.detail || "Erreur lors de la suppression";
    toast.error(msg);
  }
});

// Handler pour confirmer la suppression
const handleDelete = (id: number) => {
  if (window.confirm("Êtes-vous sûr de vouloir supprimer définitivement cette formation ?")) {
    deleteMutation.mutate(id);
  }
};

  // Handlers
  const handleOpenModal = (training: Training | null = null) => {
    if (training) {
      setSelectedTraining(training);
      setFormData({
        title: training.title,
        slug: training.slug || '',
        description: training.description || '',
        duration: training.duration || '',
        price: training.price || 0,
        modules: training.modules || [],
      });
      setImagePreview(training.image_url || null);
    } else {
      setSelectedTraining(null);
      setFormData({ title: '', slug: '', description: '', duration: '', price: 0, modules: [] });
      setImagePreview(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFile(null);
    setImagePreview(null);
    setActiveTab('general');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const addModule = () => {
    const newModule: Module = {
  id: Date.now(),
  training_id: selectedTraining?.id || 0,
  title: 'Nouveau Module',
  content_text: '',
  video_url: '',
  exercise_content: '',
  unlock_condition: 'previous_completed',
  order: formData.modules.length + 1
};
    setFormData(prev => ({ ...prev, modules: [...prev.modules, newModule] }));
  };

  const updateModule = (id: number, field: keyof Module, value: any) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.map(m => m.id === id ? { ...m, [field]: value } : m)
    }));
  };

  const removeModule = (id: number) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.filter(m => m.id !== id)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append('title', formData.title);
    data.append('slug', formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-'));
    data.append('description', formData.description);
    data.append('duration', formData.duration);
    data.append('price', formData.price.toString());
    
    // On envoie les modules sous forme de chaîne JSON
    data.append('modules', JSON.stringify(formData.modules));

    if (selectedFile) {
      data.append('image', selectedFile);
    }

    saveMutation.mutate(data);
  };

  const filteredTrainings = trainings?.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  if (error) return <div className="p-10 text-red-500">Erreur de chargement des données.</div>;

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1a237e] flex items-center gap-3">
            <Layout className="w-8 h-8 text-[#ff6f00]" /> Catalogue de Formations
          </h1>
          <p className="text-gray-500 mt-1">Gérez vos parcours d'apprentissage et les modules associés.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="bg-[#1a237e] hover:bg-[#ff6f00] text-white px-6">
          <Plus className="w-4 h-4 mr-2" /> Créer un parcours
        </Button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            placeholder="Rechercher une formation par titre..." 
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)} 
            className="pl-10 bg-gray-50 border-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-[400px]">Parcours</TableHead>
              <TableHead>Statistiques</TableHead>
              <TableHead>Tarification</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-20">
                  <Loader2 className="animate-spin inline w-8 h-8 text-[#ff6f00]" />
                  <p className="mt-2 text-gray-500">Chargement des parcours...</p>
                </TableCell>
              </TableRow>
            ) : filteredTrainings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-20 text-gray-400">
                  Aucun parcours trouvé.
                </TableCell>
              </TableRow>
            ) : filteredTrainings.map((training) => (
              <TableRow key={training.id} className="hover:bg-blue-50/30 transition-colors">
                <TableCell>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {training.image_url ? (
                        <img src={training.image_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-full h-full p-2 text-gray-300" />
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{training.title}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-2">
                        <Video className="w-3 h-3" /> {training.modules?.length || 0} Modules • {training.duration}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Users className="w-4 h-4 text-blue-500" /> {training.enrollments_count || 0}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-bold text-[#1a237e]">
  {(training.price ?? 0).toLocaleString()} FCFA
</div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm"><MoreVertical className="w-4 h-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleOpenModal(training)}>
                        <Edit2 className="w-4 h-4 mr-2" /> Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(training.id)}>
                        <Trash2 className="w-4 h-4 mr-2" /> supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a237e]/40 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-5xl shadow-2xl max-h-[95vh] flex flex-col"
            >
              <form onSubmit={handleSubmit} className="flex flex-col h-full">
                {/* Header */}
                <div className="p-6 border-b flex justify-between items-center bg-white rounded-t-3xl">
                  <div>
                    <h2 className="text-2xl font-bold text-[#1a237e]">
                      {selectedTraining ? 'Modifier le parcours' : 'Nouveau parcours'}
                    </h2>
                    <p className="text-sm text-gray-500">Configurez les détails et le contenu pédagogique.</p>
                  </div>
                  <Button type="button" variant="ghost" onClick={handleCloseModal} className="rounded-full">
                    <X className="w-6 h-6" />
                  </Button>
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden flex flex-col">
                  <div className="px-8 bg-white border-b">
                    <TabsList className="bg-transparent border-b-0 gap-8 h-14">
                      <TabsTrigger value="general" className="data-[state=active]:border-b-2 data-[state=active]:border-[#ff6f00] rounded-none bg-transparent shadow-none">Informations Générales</TabsTrigger>
                      <TabsTrigger value="curriculum" className="data-[state=active]:border-b-2 data-[state=active]:border-[#ff6f00] rounded-none bg-transparent shadow-none">Programme & Modules</TabsTrigger>
                    </TabsList>
                  </div>

                  <div className="flex-1 overflow-y-auto p-8 bg-gray-50/50">
                    <TabsContent value="general" className="m-0 space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Upload Image */}
                        <div className="space-y-4">
                          <Label>Image de couverture</Label>
                          <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="aspect-video bg-white rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-[#ff6f00] transition-colors overflow-hidden group relative"
                          >
                            {imagePreview ? (
                              <>
                                <img src={imagePreview} className="w-full h-full object-cover" alt="" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                  <Upload className="text-white w-8 h-8" />
                                </div>
                              </>
                            ) : (
                              <div className="text-center p-4">
                                <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                <p className="text-xs text-gray-500">Cliquez pour uploader (JPG, PNG)</p>
                              </div>
                            )}
                          </div>
                          <input type="file" ref={fileInputRef} hidden onChange={handleFileChange} accept="image/*" />
                        </div>

                        {/* Basic Info */}
                        <div className="md:col-span-2 space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="title">Titre du parcours</Label>
                              <Input id="title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="ex: Développement Web Fullstack" required />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="duration">Durée estimée</Label>
                              <Input id="duration" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} placeholder="ex: 12 semaines / 40h" />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="desc">Description</Label>
                            <Textarea id="desc" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="h-32" placeholder="Décrivez les objectifs de la formation..." />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="price">Prix (FCFA)</Label>
                              <Input id="price" type="number" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="slug">Slug (URL)</Label>
                              <Input id="slug" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} placeholder="auto-genere-si-vide" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="curriculum" className="m-0 space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                          <Video className="text-[#ff6f00] w-5 h-5" /> Modules du programme
                        </h3>
                        <Button type="button" onClick={addModule} className="bg-[#ff6f00] hover:bg-[#e66400]">
                          <Plus className="w-4 h-4 mr-2" /> Ajouter un module
                        </Button>
                      </div>

                      <div className="space-y-4">
                        {formData.modules.map((module, index) => (
                          <div key={module.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                              <div className="flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-[#1a237e] text-white flex items-center justify-center font-bold text-sm">
                                  {index + 1}
                                </span>
                                <Input 
                                  value={module.title} 
                                  onChange={e => updateModule(module.id, 'title', e.target.value)}
                                  className="font-bold border-none text-lg p-0 focus-visible:ring-0 w-[300px]"
                                />
                              </div>
                              <Button type="button" variant="ghost" size="sm" onClick={() => removeModule(module.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <Label className="text-xs uppercase text-gray-400">Contenu texte / Leçon</Label>
                                <Textarea 
                                  value={module.content_text} 
                                  onChange={e => updateModule(module.id, 'content_text', e.target.value)}
                                  className="h-24 text-sm" 
                                />
                              </div>
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label className="text-xs uppercase text-gray-400">Lien vidéo (YouTube/Vimeo)</Label>
                                  <Input 
                                    value={module.video_url} 
                                    onChange={e => updateModule(module.id, 'video_url', e.target.value)}
                                    placeholder="https://..." 
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-xs uppercase text-gray-400">Exercice pratique</Label>
                                  <Input 
                                    value={module.exercise_content} 
                                    onChange={e => updateModule(module.id, 'exercise_content', e.target.value)}
                                    placeholder="Instructions de l'exercice" 
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>

                {/* Footer */}
                <div className="p-6 border-t bg-white flex items-center justify-end gap-4 rounded-b-3xl">
                  <Button type="button" variant="outline" onClick={handleCloseModal}>Annuler</Button>
                  <Button 
                    type="submit" 
                    className="bg-[#1a237e] hover:bg-[#283593] text-white px-10 h-12 rounded-xl"
                    disabled={saveMutation.isPending}
                  >
                    {saveMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sauvegarde en cours...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Publier le parcours
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}