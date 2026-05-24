import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Trash2, Edit2, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { newsAPI } from '@/services/api';
import type { News } from '@/types';

export default function AdminNews() {
  const [searchQuery, setSearchQuery] = useState('');
  const queryClient = useQueryClient();

  const { data: news, isLoading } = useQuery<News[]>({
    queryKey: ['admin-news'],
    queryFn: async () => (await newsAPI.getAll()).data,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => newsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-news'] });
      toast.success('Actualité supprimée avec succès');
    },
    onError: () => toast.error('Erreur lors de la suppression'),
  });

  const filtered = news?.filter(n => n.title.toLowerCase().includes(searchQuery.toLowerCase())) || [];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1a237e]">Actualités</h1>
          <p className="text-gray-600 mt-1">Gestion des actualités du cabinet</p>
        </div>
        <Button className="bg-[#1a237e] hover:bg-[#0d1245] text-white"><Plus className="w-4 h-4 mr-2" />Ajouter</Button>
      </motion.div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input placeholder="Rechercher..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-[#1a237e] animate-spin" /></div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(article => (
                <TableRow key={article.id}>
                  <TableCell className="font-medium max-w-xs truncate">{article.title}</TableCell>
                  <TableCell className="text-gray-500">{new Date(article.created_at).toLocaleDateString('fr-FR')}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${article.is_published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {article.is_published ? 'Publié' : 'Brouillon'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline"><Edit2 className="w-3 h-3" /></Button>
                      <Button size="sm" variant="outline" className="text-red-500 hover:text-red-700" onClick={() => deleteMutation.mutate(article.id)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {!isLoading && filtered.length === 0 && <p className="text-center text-gray-500 py-8">Aucune actualité trouvée.</p>}
      </div>
    </div>
  );
}
