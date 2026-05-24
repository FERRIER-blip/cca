import { Link } from 'react-router-dom';
import { Bell, Search, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store/authStore';

export default function AdminHeader() {
  const { user } = useAuthStore();

  return (
    <header className="bg-white border-b px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Search */}
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Rechercher..."
            className="pl-10"
          />
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative p-2 text-gray-500 hover:text-[#1a237e] transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#ff6f00] rounded-full" />
          </button>

          {/* User */}
          <Link
            to="/client/profil"
            className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 bg-[#1a237e] rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-[#1a237e]">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-xs text-gray-500">Administrateur</p>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
