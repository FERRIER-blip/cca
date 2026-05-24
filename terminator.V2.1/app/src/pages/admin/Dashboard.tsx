import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Users,
  ShieldCheck,
  ShieldAlert,
  Briefcase,
  GraduationCap,
  Star,
  Building2,
  FileText,
  Loader2,
  Clock
} from 'lucide-react';

import { adminAPI } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import type { DashboardStats } from '@/types';

export default function AdminDashboard() {
  const { user } = useAuthStore();

  const isSuperAdmin = user?.is_superadmin === true;
  const isAdmin = user?.is_admin === true && !isSuperAdmin;

  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['admin-stats'],
    queryFn: async () => (await adminAPI.getDashboardStats()).data,
  });

  const { data: activities, isLoading: activitiesLoading } = useQuery<any[]>({
    queryKey: ['admin-activities'],
    queryFn: async () => (await adminAPI.getRecentActivities()).data,
  });

  // 🔥 CONFIG CORRIGÉE
  const statsConfig = [
    // ✅ VISIBLE UNIQUEMENT SUPERADMIN
    ...(isSuperAdmin
      ? [
          {
            key: 'total_users',
            label: 'Utilisateurs',
            icon: Users,
            color: '#1a237e',
            href: '/admin/users/clients',
          },
          {
            key: 'total_admins',
            label: 'Admins secondaires',
            icon: ShieldCheck,
            color: '#4caf50',
            href: '/admin/users/admins',
          },
          {
            key: 'total_superadmins',
            label: 'Super Admin',
            icon: ShieldAlert,
            color: '#d32f2f',
            href: '/admin/users/superadmins',
          },
        ]
      : []),

    // ✅ ACCESSIBLE ADMIN + SUPERADMIN
    {
      key: 'total_services',
      label: 'Services',
      icon: Briefcase,
      color: '#ff6f00',
      href: '/admin/services',
    },
    {
      key: 'total_trainings',
      label: 'Formations',
      icon: GraduationCap,
      color: '#4fc3f7',
      href: '/admin/formations',
    },
    {
      key: 'total_testimonials',
      label: 'Témoignages',
      icon: Star,
      color: '#1a237e',
      href: '/admin/temoignages',
    },
    {
      key: 'total_partners',
      label: 'Partenaires',
      icon: Building2,
      color: '#ff6f00',
      href: '/admin/partenaires',
    },
    {
      key: 'pending_requests',
      label: 'Demandes',
      icon: FileText,
      color: '#4fc3f7',
      href: '/admin/demandes',
    },
  ];

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-[#1a237e]">
            Tableau de bord
          </h1>

          <p className="text-gray-600 mt-2">
            {isSuperAdmin
              ? 'Super Administrateur'
              : isAdmin
              ? 'Administrateur (Accès limité)'
              : 'Utilisateur'}
          </p>
        </motion.div>

        {!isSuperAdmin && (
          <div className="flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-xl border text-sm">
            <ShieldAlert className="w-4 h-4" />
            Accès limité
          </div>
        )}
      </div>

      {/* STATS */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="animate-spin w-8 h-8" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statsConfig.map((item, index) => (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={item.href}>
                <div className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition">
                  <div className="flex justify-between mb-4">
                    <item.icon
                      className="w-6 h-6"
                      style={{ color: item.color }}
                    />
                    <span className="text-3xl font-bold">
                      {stats ? stats[item.key as keyof DashboardStats] : 0}
                    </span>
                  </div>
                  <p className="text-gray-600">{item.label}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      {/* ACTIVITÉS */}
      <motion.div className="bg-white p-6 rounded-2xl shadow-sm border">
        <h2 className="text-xl font-bold mb-6">Activités récentes</h2>

        {activitiesLoading ? (
          <Loader2 className="animate-spin" />
        ) : activities?.length ? (
          <div className="space-y-4">
            {activities.map((a, i) => (
              <div key={i} className="flex gap-3">
                <Clock className="w-4 h-4" />
                <div>
                  <p>{a.description}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(a.date).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Aucune activité</p>
        )}
      </motion.div>
    </div>
  );
}