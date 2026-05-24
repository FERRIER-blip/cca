import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Loader2,
  Trash2,
  ShieldCheck,
  ShieldAlert,
  Power,
  PowerOff
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { toast } from 'sonner';
import { adminAPI } from '@/services/api';
import type { User } from '@/types';

export default function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState('');
  const queryClient = useQueryClient();

  // ✅ FETCH USERS
  const { data: users, isLoading, isError } = useQuery<User[]>({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const res = await adminAPI.getUsers();
      return res.data;
    },
  });

  // ✅ TOGGLE ACTIVE
  const toggleStatusMutation = useMutation({
    mutationFn: async (id: number) => {
      return await adminAPI.toggleUserStatus(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('Statut utilisateur mis à jour');
    },
    onError: (err: any) => {
      console.error(err);
      toast.error(err?.response?.data?.detail || 'Erreur changement statut');
    },
  });

  // ✅ TOGGLE ADMIN
  const toggleAdminMutation = useMutation({
    mutationFn: async (id: number) => {
      return await adminAPI.toggleUserAdmin(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('Rôle admin modifié');
    },
    onError: (err: any) => {
      console.error(err);
      toast.error(err?.response?.data?.detail || 'Erreur rôle admin');
    },
  });

  // ✅ DELETE USER
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await adminAPI.deleteUser(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('Utilisateur supprimé');
    },
    onError: (err: any) => {
      console.error(err);
      toast.error(err?.response?.data?.detail || 'Erreur suppression');
    },
  });

  const filtered =
    users?.filter((u) =>
      `${u.first_name} ${u.last_name} ${u.email}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    ) || [];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-[#1a237e]">
          Gestion des Utilisateurs
        </h1>
        <p className="text-gray-600 mt-1">
          Autorisez les accès étudiants et gérez les rôles
        </p>
      </motion.div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Rechercher..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : isError ? (
          <div className="text-center py-10 text-red-500">
            Erreur chargement utilisateurs
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Accès</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filtered.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <p className="font-bold">
                        {user.first_name} {user.last_name}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </TableCell>

                  <TableCell>
                    {user.is_admin ? 'Admin' : 'Étudiant'}
                  </TableCell>

                  <TableCell>
                    {user.is_active ? 'Actif' : 'Bloqué'}
                  </TableCell>

                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>

                  <TableCell>
                    <div className="flex justify-end gap-2">

                      {/* TOGGLE ACTIVE */}
                      <Button
                        size="sm"
                        disabled={toggleStatusMutation.isPending}
                        onClick={() => toggleStatusMutation.mutate(user.id)}
                      >
                        {toggleStatusMutation.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : user.is_active ? (
                          <PowerOff className="w-4 h-4" />
                        ) : (
                          <Power className="w-4 h-4" />
                        )}
                      </Button>

                      {/* TOGGLE ADMIN */}
                      <Button
                        size="sm"
                        disabled={toggleAdminMutation.isPending}
                        onClick={() => toggleAdminMutation.mutate(user.id)}
                      >
                        {toggleAdminMutation.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : user.is_admin ? (
                          <ShieldAlert className="w-4 h-4" />
                        ) : (
                          <ShieldCheck className="w-4 h-4" />
                        )}
                      </Button>

                      {/* DELETE */}
                      <Button
                        size="sm"
                        disabled={deleteMutation.isPending}
                        onClick={() => {
                          if (confirm('Supprimer cet utilisateur ?')) {
                            deleteMutation.mutate(user.id);
                          }
                        }}
                      >
                        {deleteMutation.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>

                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            Aucun utilisateur trouvé
          </div>
        )}
      </div>
    </div>
  );
}