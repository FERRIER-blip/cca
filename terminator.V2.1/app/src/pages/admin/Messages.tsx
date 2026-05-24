import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Mail, MailOpen, Trash2, Loader2, CheckCircle2, Phone, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { contactAPI } from '@/services/api';
import type { ContactMessage } from '@/types';

export default function AdminMessages() {
  const queryClient = useQueryClient();

  // 1. Récupération des messages
  const { data: messages, isLoading } = useQuery<ContactMessage[]>({
    queryKey: ['admin-messages'],
    queryFn: async () => (await contactAPI.getMessages()).data,
  });

  // 2. Mutation pour marquer comme lu
  const readMutation = useMutation({
    mutationFn: (id: number) => contactAPI.markAsRead(id), // Vérifie que cette route existe au backend
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-messages'] });
    },
  });

  // 3. Mutation pour supprimer
  const deleteMutation = useMutation({
    mutationFn: (id: number) => contactAPI.deleteMessage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-messages'] });
      toast.success('Message supprimé');
    },
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#1a237e]">Messagerie</h1>
          <p className="text-gray-600 mt-1">Gérez les demandes de renseignements</p>
        </div>
        <div className="text-right">
            <span className="text-sm font-medium bg-blue-100 text-[#1a237e] px-4 py-1.5 rounded-full">
                {messages?.filter(m => !m.is_read).length || 0} nouveaux messages
            </span>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-10 h-10 text-[#1a237e] animate-spin" />
          <p className="text-gray-400">Récupération de vos messages...</p>
        </div>
      ) : (
        <div className="grid gap-4">
          <AnimatePresence mode="popLayout">
            {messages && messages.length > 0 ? (
              messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, x: -20 }}
                  className={`group relative bg-white rounded-2xl p-6 shadow-sm border transition-all hover:shadow-md ${
                    msg.is_read ? 'border-gray-100 opacity-80' : 'border-l-4 border-l-[#1a237e] border-gray-200 bg-blue-50/10'
                  }`}
                  onClick={() => !msg.is_read && readMutation.mutate(msg.id)}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl shrink-0 ${msg.is_read ? 'bg-gray-100 text-gray-400' : 'bg-blue-100 text-[#1a237e]'}`}>
                        {msg.is_read ? <MailOpen className="w-6 h-6" /> : <Mail className="w-6 h-6" />}
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className={`font-bold text-lg ${msg.is_read ? 'text-gray-600' : 'text-gray-900'}`}>
                            {msg.subject || "Sans objet"}
                          </h3>
                          {!msg.is_read && <span className="bg-red-500 w-2 h-2 rounded-full animate-pulse" />}
                        </div>
                        
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                          <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {msg.name}</span>
                          <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {msg.phone || 'Non renseigné'}</span>
                          <span className="flex items-center gap-1.5 text-blue-600 underline cursor-pointer">{msg.email}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 ml-auto md:ml-0">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs text-gray-400 flex items-center justify-end gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(msg.created_at).toLocaleDateString('fr-FR')}
                            </p>
                            <p className="text-xs text-gray-400 font-mono">
                                {new Date(msg.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500 hover:bg-red-50" 
                          onClick={(e) => {
                            e.stopPropagation();
                            if(confirm('Supprimer ce message ?')) deleteMutation.mutate(msg.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-white/50 rounded-xl border border-gray-50 text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                    {msg.message}
                  </div>

                  {!msg.is_read && (
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            readMutation.mutate(msg.id);
                        }}
                        className="absolute top-4 right-12 text-gray-300 hover:text-green-500 transition-colors"
                        title="Marquer comme lu"
                    >
                        <CheckCircle2 className="w-5 h-5" />
                    </button>
                  )}
                </motion.div>
              ))
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100">
                <Mail className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900">Boîte de réception vide</h3>
                <p className="text-gray-500 max-w-xs mx-auto mt-2">
                  Vous n'avez reçu aucun message via le formulaire de contact pour le moment.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}