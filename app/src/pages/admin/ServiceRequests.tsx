import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { contactAPI } from '@/services/api';
import type { ServiceRequest } from '@/types';

const statusColors: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};
const statusLabels: Record<string, string> = {
  new: 'Nouveau',
  in_progress: 'En cours',
  completed: 'Terminé',
  cancelled: 'Annulé',
};

export default function AdminServiceRequests() {
  const queryClient = useQueryClient();

  const { data: requests, isLoading } = useQuery<ServiceRequest[]>({
    queryKey: ['admin-requests'],
    queryFn: async () => (await contactAPI.getServiceRequests()).data,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => contactAPI.updateServiceRequest(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-requests'] });
      toast.success('Statut mis à jour');
    },
  });

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-[#1a237e]">Demandes de service</h1>
        <p className="text-gray-600 mt-1">Gestion des demandes clients</p>
      </motion.div>

      {isLoading && <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-[#1a237e] animate-spin" /></div>}

      <div className="space-y-4">
        {requests?.map(req => (
          <motion.div key={req.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#ff6f00]/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#ff6f00]" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">{req.contact_name}</p>
                  <p className="text-sm text-gray-500">{req.contact_email} {req.contact_phone && `· ${req.contact_phone}`}</p>
                  {req.company && <p className="text-sm text-gray-400">{req.company}</p>}
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[req.status] || 'bg-gray-100 text-gray-600'}`}>
                {statusLabels[req.status] || req.status}
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-4">{req.message}</p>
            <div className="flex gap-2 flex-wrap">
              {['in_progress', 'completed', 'cancelled'].map(status => (
                <Button key={status} size="sm" variant="outline" onClick={() => updateMutation.mutate({ id: req.id, status })} disabled={req.status === status}>
                  {statusLabels[status]}
                </Button>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
      {!isLoading && !requests?.length && <p className="text-center text-gray-500 py-8">Aucune demande de service pour le moment.</p>}
    </div>
  );
}
