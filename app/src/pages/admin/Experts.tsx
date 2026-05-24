import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Trash2, Edit2, Loader2, User, X, Upload, ImageIcon } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { expertsAPI } from '@/services/api';
import type { Expert } from '@/types';

export default function AdminExperts() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    title: '',
    bio: '',
  });

  const { data: experts, isLoading } = useQuery<Expert[]>({
    queryKey: ['admin-experts'],
    queryFn: async () => (await expertsAPI.getAll()).data,
  });

  const saveMutation = useMutation({
    mutationFn: (data: FormData) => 
      selectedExpert 
        ? expertsAPI.update(selectedExpert.id, data) 
        : expertsAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-experts'] });
      toast.success(selectedExpert ? 'Modifié avec succès' : 'Ajouté avec succès');
      handleClose();
    },
    onError: () => toast.error("Erreur lors de l'enregistrement"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => expertsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-experts'] });
      toast.success('Expert supprimé');
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = (expert: any) => {
    setSelectedExpert(expert);
    setFormData({
      first_name: expert.first_name || expert.name || '', 
      last_name: expert.last_name || '',
      title: expert.title || expert.role || '',
      bio: expert.bio || '',
    });
    setImagePreview(expert.photo_url || expert.image_url || null);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedExpert(null);
    setFormData({ first_name: '', last_name: '', title: '', bio: '' });
    setImagePreview(null);
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedExpert(null);
    setSelectedFile(null);
    setImagePreview(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append('first_name', formData.first_name);
    data.append('last_name', formData.last_name);
    data.append('title', formData.title);
    data.append('bio', formData.bio);
    if (selectedFile) {
      data.append('photo', selectedFile); 
    }
    saveMutation.mutate(data);
  };

  const filtered = experts?.filter(e => {
    const fullName = e.name ? e.name : `${e.first_name} ${e.last_name}`;
    return fullName.toLowerCase().includes(searchQuery.toLowerCase());
  }) || [];

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#1a237e]">Experts</h1>
        <Button className="bg-[#1a237e]" onClick={handleAdd}><Plus className="mr-2 h-4 w-4" /> Ajouter</Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input 
          placeholder="Rechercher..." 
          value={searchQuery} 
          onChange={e => setSearchQuery(e.target.value)} 
          className="pl-10 w-full h-10 border rounded-md" 
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="animate-spin" /></div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(expert => (
            <motion.div key={expert.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden">
                  {(expert.photo_url || expert.image_url) ? (
                    <img src={expert.photo_url || expert.image_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-full h-full p-2 text-gray-400" />
                  )}
                </div>
                <div>
                  <p className="font-bold">
                    {expert.name ? expert.name : `${expert.first_name} ${expert.last_name}`}
                  </p>
                  <p className="text-sm text-[#ff6f00]">
                    {expert.role || expert.title}
                  </p>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">{expert.bio}</p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => handleEdit(expert)}>
                  <Edit2 className="w-3 h-3 mr-1" /> Modifier
                </Button>
                <Button 
                   size="sm" 
                   variant="outline" 
                   className="text-red-500" 
                   onClick={() => window.confirm('Supprimer ?') && deleteMutation.mutate(expert.id)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
              <button onClick={handleClose} className="absolute right-4 top-4 text-gray-400"><X /></button>
              <h2 className="text-xl font-bold mb-4">{selectedExpert ? 'Modifier' : 'Ajouter'}</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  {imagePreview ? (
                    <div className="relative w-24 h-24">
                      <img src={imagePreview} className="w-24 h-24 rounded-full object-cover border-2 border-[#1a237e]" alt="Preview" />
                      <div className="absolute bottom-0 right-0 bg-[#1a237e] text-white p-1 rounded-full shadow-lg"><Upload size={12}/></div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <ImageIcon className="mx-auto h-12 w-12 text-gray-300" />
                      <p className="text-xs text-gray-500 mt-2 font-medium">Cliquez pour ajouter une photo</p>
                    </div>
                  )}
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="Prénom" value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} required />
                  <Input placeholder="Nom" value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} required />
                </div>
                <Input placeholder="Titre" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                <textarea className="w-full border rounded-md p-2 text-sm min-h-[80px]" placeholder="Bio..." value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} required />

                <Button type="submit" className="w-full bg-[#1a237e]" disabled={saveMutation.isPending}>
                  {saveMutation.isPending ? <Loader2 className="animate-spin" /> : 'Enregistrer'}
                </Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}