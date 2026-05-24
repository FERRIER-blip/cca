import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Services from '@/components/sections/Services';
import Trainings from '@/components/sections/Trainings';
import Testimonials from '@/components/sections/Testimonials';
import Partners from '@/components/sections/Partners';
import CTA from '@/components/sections/CTA';

export default function Home() {
  return (
    <div className="overflow-hidden">
      <Hero />
      <About />
      <Services />
      <Trainings />
      <Testimonials />
      <Partners />
      <CTA />
    </div>
  );
}
