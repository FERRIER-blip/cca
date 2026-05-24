import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit2, Loader2, Building2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { partnersAPI } from '@/services/api';
import type { Partner } from '@/types';

export default function AdminPartners() {
  const queryClient = useQueryClient();

  const { data: partners, isLoading, isError } = useQuery<Partner[]>({
    queryKey: ['admin-partners'],
    queryFn: async () => (await partnersAPI.getAll()).data,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => partnersAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-partners'] });
      toast.success('Partenaire supprimé');
    },
  });

  // Fonction pour le bouton Ajouter
  const handleAdd = () => {
    toast.info("L'ouverture du formulaire d'ajout arrive bientôt !");
    // Ici tu devrais normalement ouvrir une modal ou naviguer vers une page /add
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1a237e]">Partenaires</h1>
          <p className="text-gray-600 mt-1">Gestion des partenaires</p>
        </div>
        <Button 
          onClick={handleAdd} // Rendu actif ici
          className="bg-[#1a237e] hover:bg-[#0d1245] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />Ajouter
        </Button>
      </motion.div>

      {isLoading && <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-[#1a237e] animate-spin" /></div>}
      
      {isError && <p className="text-center text-red-500 py-8">Erreur : Vérifiez que le fichier .db est bien supprimé et le serveur relancé.</p>}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {partners?.map(partner => (
          <motion.div key={partner.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {partner.logo_url ? (
                <img src={partner.logo_url} alt={partner.name} className="h-10 w-auto object-contain" />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-[#1a237e]/10 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-[#1a237e]" />
                </div>
              )}
              <div>
                <p className="font-semibold text-gray-800">{partner.name}</p>
                {partner.website && (
                  <a href={partner.website} target="_blank" rel="noopener noreferrer" className="text-xs text-[#ff6f00] hover:underline">
                    Visiter le site
                  </a>
                )}
              </div>
            </div>
            <div className="flex gap-1">
              <Button size="sm" variant="outline"><Edit2 className="w-3 h-3" /></Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="text-red-500" 
                onClick={() => {
                  if(window.confirm('Supprimer ?')) deleteMutation.mutate(partner.id)
                }}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
      {!isLoading && !partners?.length && !isError && <p className="text-center text-gray-500 py-8">Aucun partenaire trouvé.</p>}
    </div>
  );
}