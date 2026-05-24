import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Trash2, Edit2, Loader2, X } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { servicesAPI } from '@/services/api';
import type { Service } from '@/types';

export default function AdminServices() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  
  // ÉTAPE 1 : Ajout de full_content dans l'état du formulaire
  const [formData, setFormData] = useState({ 
    title: '', 
    slug: '', 
    description: '', 
    full_content: '', // Nouveau champ
    is_active: true 
  });

  const queryClient = useQueryClient();

  const { data: services, isLoading } = useQuery<Service[]>({
    queryKey: ['admin-services'],
    queryFn: async () => (await servicesAPI.getAll()).data,
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (selectedService) {
        return servicesAPI.update(selectedService.id, formData);
      } else {
        return servicesAPI.create(formData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      toast.success(selectedService ? 'Service mis à jour' : 'Service créé');
      setIsModalOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Une erreur est survenue");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => servicesAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      toast.success('Service supprimé');
    },
  });

  // ÉTAPE 2 : Récupération de full_content lors de l'ouverture (Modification)
  const handleOpenModal = (service: Service | null = null) => {
    setSelectedService(service);
    if (service) {
      setFormData({ 
        title: service.title, 
        slug: service.slug, 
        description: service.description || '', 
        full_content: service.full_content || '', // On charge le contenu détaillé
        is_active: service.is_active 
      });
    } else {
      setFormData({ title: '', slug: '', description: '', full_content: '', is_active: true });
    }
    setIsModalOpen(true);
  };

  const filtered = services?.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase())) || [];

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#1a237e]">Services</h1>
        <Button onClick={() => handleOpenModal()} className="bg-[#1a237e] text-white">
          <Plus className="w-4 h-4 mr-2" /> Ajouter
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input placeholder="Rechercher..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
      </div>

      <div className="bg-white rounded-xl shadow border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titre</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
               <TableRow><TableCell colSpan={3} className="text-center py-10"><Loader2 className="animate-spin inline mr-2"/> Chargement...</TableCell></TableRow>
            ) : filtered.map(service => (
              <TableRow key={service.id}>
                <TableCell className="font-medium">{service.title}</TableCell>
                <TableCell className="text-gray-500">{service.slug}</TableCell>
                <TableCell className="text-right flex justify-end gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleOpenModal(service)}><Edit2 className="w-3 h-3" /></Button>
                  <Button size="sm" variant="outline" className="text-red-500 hover:bg-red-50" onClick={() => { if(confirm('Supprimer ?')) deleteMutation.mutate(service.id) }}><Trash2 className="w-3 h-3" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#1a237e]">{selectedService ? 'Modifier le service' : 'Nouveau service'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X className="w-6 h-6" /></button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Titre</label>
                  <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Ex: Informatique" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Slug (URL)</label>
                  <Input value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} placeholder="ex: informatique" />
                </div>
                
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Description courte (Aperçu)</label>
                  <textarea 
                    className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#1a237e] outline-none min-h-[80px]"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    placeholder="Bref résumé qui s'affiche sur les cartes..."
                  />
                </div>

                {/* ÉTAPE 3 : Champ Visuel pour Full Content */}
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-semibold text-[#1a237e]">Contenu détaillé (Page En savoir plus)</label>
                  <textarea 
                    className="w-full border border-blue-100 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#1a237e] outline-none min-h-[200px] bg-blue-50/20"
                    value={formData.full_content}
                    onChange={e => setFormData({...formData, full_content: e.target.value})}
                    placeholder="Détaillez ici tout le contenu qui s'affichera sur la page individuelle du service..."
                  />
                </div>
              </div>
              
              <div className="mt-8">
                <Button 
                  onClick={() => saveMutation.mutate()} 
                  className="w-full bg-[#1a237e] hover:bg-[#283593] text-white h-12 text-lg rounded-xl"
                  disabled={saveMutation.isPending}
                >
                  {saveMutation.isPending ? <Loader2 className="animate-spin mr-2" /> : null}
                  {selectedService ? 'Mettre à jour le service' : 'Créer le service'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}