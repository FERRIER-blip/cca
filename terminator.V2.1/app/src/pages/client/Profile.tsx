import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Save, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { authAPI } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import type { User as UserType } from '@/types';

export default function ClientProfile() {
  const { user, updateUser } = useAuthStore();
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    phone: user?.phone || '',
  });

  const updateMutation = useMutation({
    mutationFn: (data: typeof formData) => authAPI.updateMe(data),
    onSuccess: (res) => {
      updateUser(res.data);
      toast.success('Profil mis à jour avec succès');
    },
    onError: () => toast.error('Erreur lors de la mise à jour'),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-[#1a237e] mb-8">Mon profil</h1>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-full bg-[#1a237e]/10 flex items-center justify-center">
                <User className="w-8 h-8 text-[#1a237e]" />
              </div>
              <div>
                <p className="font-bold text-xl text-gray-900">{user?.first_name} {user?.last_name}</p>
                <p className="text-gray-500">{user?.email}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${user?.is_admin ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                  {user?.is_admin ? 'Administrateur' : 'Client'}
                </span>
              </div>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">Prénom</Label>
                  <Input id="first_name" name="first_name" value={formData.first_name} onChange={handleChange} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="last_name">Nom</Label>
                  <Input id="last_name" name="last_name" value={formData.last_name} onChange={handleChange} className="mt-1" />
                </div>
              </div>
              <div>
                <Label htmlFor="phone">Téléphone</Label>
                <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} className="mt-1" placeholder="+235 XX XX XX XX" />
              </div>
              <div>
                <Label>Email</Label>
                <Input value={user?.email || ''} disabled className="mt-1 bg-gray-50" />
                <p className="text-xs text-gray-400 mt-1">L'email ne peut pas être modifié.</p>
              </div>
            </div>

            <Button onClick={() => updateMutation.mutate(formData)} disabled={updateMutation.isPending} className="mt-6 bg-[#1a237e] hover:bg-[#0d1245] text-white">
              {updateMutation.isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Enregistrement...</> : <><Save className="w-4 h-4 mr-2" />Enregistrer</>}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
