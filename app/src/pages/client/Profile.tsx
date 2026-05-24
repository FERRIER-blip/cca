import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import { Loader2, Save, User, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { authAPI } from '@/services/api';
import { useAuthStore } from '@/store/authStore';

export default function StudentProfile() {
  const { user, updateUser } = useAuthStore();
  
  // Initialisation du formulaire avec les données actuelles du store
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    phone: user?.phone || '',
  });

  // Sécurité : si l'utilisateur change dans le store, on met à jour le formulaire
  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone || '',
      });
    }
  }, [user]);

  const updateMutation = useMutation({
    mutationFn: (data: typeof formData) => authAPI.updateMe(data),
    onSuccess: (res) => {
      updateUser(res.data); // Mise à jour globale du store
      toast.success('Profil mis à jour avec succès');
    },
    onError: () => {
      toast.error('Erreur lors de la mise à jour du profil');
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-12">
      <div className="max-w-2xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-3xl font-extrabold text-[#1a237e]">Mon Profil</h1>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            {/* Header Profil */}
            <div className="flex items-center gap-5 mb-10 pb-8 border-b border-gray-50">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#1a237e] to-[#3949ab] flex items-center justify-center shadow-lg">
                <User className="w-10 h-10 text-white" />
              </div>
              <div>
                <p className="font-bold text-2xl text-gray-900">
                  {user?.first_name} {user?.last_name}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full font-bold border ${
                    user?.is_admin 
                      ? 'bg-purple-50 text-purple-600 border-purple-100' 
                      : 'bg-blue-50 text-blue-600 border-blue-100'
                  }`}>
                    {user?.is_admin ? 'Compte Administrateur' : 'Compte Étudiant'}
                  </span>
                  {user?.is_admin && <ShieldCheck className="w-4 h-4 text-purple-600" />}
                </div>
              </div>
            </div>

            {/* Formulaire */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="first_name" className="text-gray-600 ml-1">Prénom</Label>
                  <Input 
                    id="first_name" 
                    name="first_name" 
                    value={formData.first_name} 
                    onChange={handleChange} 
                    className="rounded-xl border-gray-200 focus:ring-[#1a237e] h-11" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name" className="text-gray-600 ml-1">Nom</Label>
                  <Input 
                    id="last_name" 
                    name="last_name" 
                    value={formData.last_name} 
                    onChange={handleChange} 
                    className="rounded-xl border-gray-200 focus:ring-[#1a237e] h-11" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-600 ml-1">Numéro de téléphone</Label>
                <Input 
                  id="phone" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  className="rounded-xl border-gray-200 focus:ring-[#1a237e] h-11" 
                  placeholder="+235 XX XX XX XX" 
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-400 ml-1">Adresse Email (Non modifiable)</Label>
                <Input 
                  value={user?.email || ''} 
                  disabled 
                  className="rounded-xl bg-gray-50 border-gray-100 text-gray-400 h-11 cursor-not-allowed" 
                />
              </div>
            </div>

            <div className="mt-10">
              <Button 
                onClick={() => updateMutation.mutate(formData)} 
                disabled={updateMutation.isPending} 
                className="w-full md:w-auto bg-[#1a237e] hover:bg-[#0d1245] text-white px-8 h-12 rounded-xl font-bold shadow-lg shadow-blue-100 transition-all active:scale-95"
              >
                {updateMutation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Sauvegarder les modifications
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}