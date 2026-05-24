import { Outlet } from 'react-router-dom';
import TopBar from '@/components/sections/TopBar';
import Navigation from '@/components/sections/Navigation';
import Footer from '@/components/sections/Footer';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <Navigation />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
