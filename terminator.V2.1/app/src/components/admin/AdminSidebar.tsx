import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  GraduationCap,
  Users,
  MessageSquare,
  Building2,
  Newspaper,
  Star,
  FileText,
  LogOut,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const menuItems = [
  { icon: LayoutDashboard, label: 'Tableau de bord', href: '/admin/dashboard' },
  { icon: Briefcase, label: 'Services', href: '/admin/services' },
  { icon: GraduationCap, label: 'Formations', href: '/admin/formations' },
  { icon: Users, label: 'Experts', href: '/admin/experts' },
  { icon: Star, label: 'Témoignages', href: '/admin/temoignages' },
  { icon: Building2, label: 'Partenaires', href: '/admin/partenaires' },
  { icon: Newspaper, label: 'Actualités', href: '/admin/actualites' },
  { icon: Users, label: 'Utilisateurs', href: '/admin/utilisateurs' },
  { icon: MessageSquare, label: 'Messages', href: '/admin/messages' },
  { icon: FileText, label: 'Demandes', href: '/admin/demandes' },
];

export default function AdminSidebar() {
  const location = useLocation();
  const { logout } = useAuthStore();

  const isActive = (href: string) => location.pathname === href;

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#1a237e] text-white z-50">
      <div className="p-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <span className="text-[#1a237e] font-bold">CCA</span>
          </div>
          <div>
            <p className="font-bold text-sm leading-tight">Admin</p>
          </div>
        </Link>

        {/* Menu */}
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive(item.href)
                  ? 'bg-[#ff6f00] text-white'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Logout */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}
