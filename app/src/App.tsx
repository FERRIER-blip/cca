import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';

// Layouts
import MainLayout from '@/components/layouts/MainLayout';
import AdminLayout from '@/components/layouts/AdminLayout';

// Public Pages
import Home from '@/pages/Home';
import About from '@/pages/About';
import Services from '@/pages/Services';
import ServiceDetail from '@/pages/ServiceDetail';
import Trainings from '@/pages/Trainings';
import TrainingDetail from '@/pages/TrainingDetail';
import News from '@/pages/News';
import NewsDetail from '@/pages/NewsDetail';
import Contact from '@/pages/Contact';
import Login from '@/pages/Login';
import Register from '@/pages/Register';

// Client Pages
import ClientDashboard from '@/pages/client/Dashboard';
import ClientTrainings from '@/pages/client/Trainings';
import ClientProfile from '@/pages/client/Profile';

// Admin Pages
import AdminDashboard from '@/pages/admin/Dashboard';
import AdminServices from '@/pages/admin/Services';
import AdminTrainings from '@/pages/admin/Trainings';
import AdminExperts from '@/pages/admin/Experts';
import AdminTestimonials from '@/pages/admin/Testimonials';
import AdminPartners from '@/pages/admin/Partners';
import AdminNews from '@/pages/admin/News';
import AdminUsers from '@/pages/admin/Users';
import AdminMessages from '@/pages/admin/Messages';
import AdminServiceRequests from '@/pages/admin/ServiceRequests';

// Hooks
import { useAuthStore } from '@/store/authStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Protected Route Component
function ProtectedRoute({ children, requireAdmin = false }: { children: React.ReactNode; requireAdmin?: boolean }) {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (requireAdmin && !user?.is_admin) {
    return <Navigate to="/client/dashboard" replace />;
  }
  
  return <>{children}</>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/a-propos" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:slug" element={<ServiceDetail />} />
            <Route path="/formations" element={<Trainings />} />
            <Route path="/formations/:slug" element={<TrainingDetail />} />
            <Route path="/actualites" element={<News />} />
            <Route path="/actualites/:slug" element={<NewsDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Client Routes */}
          <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            <Route path="/client/dashboard" element={<ClientDashboard />} />
            <Route path="/client/formations" element={<ClientTrainings />} />
            <Route path="/client/profil" element={<ClientProfile />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<ProtectedRoute requireAdmin><AdminLayout /></ProtectedRoute>}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/services" element={<AdminServices />} />
            <Route path="/admin/formations" element={<AdminTrainings />} />
            <Route path="/admin/experts" element={<AdminExperts />} />
            <Route path="/admin/temoignages" element={<AdminTestimonials />} />
            <Route path="/admin/partenaires" element={<AdminPartners />} />
            <Route path="/admin/actualites" element={<AdminNews />} />
            <Route path="/admin/utilisateurs" element={<AdminUsers />} />
            <Route path="/admin/messages" element={<AdminMessages />} />
            <Route path="/admin/demandes" element={<AdminServiceRequests />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  );
}

export default App;
