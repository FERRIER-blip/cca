import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, Quote, Star, Loader2 } from 'lucide-react';
import { testimonialsAPI } from '@/services/api';
import type { Testimonial } from '@/types';

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  const { data: testimonials, isLoading } = useQuery<Testimonial[]>({
    queryKey: ['testimonials-featured'],
    queryFn: async () => (await testimonialsAPI.getFeatured()).data,
  });

  const next = () => setActiveIndex((prev) => (prev + 1) % (testimonials?.length || 1));
  const prev = () => setActiveIndex((prev) => (prev - 1 + (testimonials?.length || 1)) % (testimonials?.length || 1));

  return (
    <section className="py-24 bg-gradient-to-br from-[#1a237e] to-[#0d1245] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-[#ff6f00] text-sm font-semibold tracking-[2px] uppercase">Témoignages</motion.span>
          <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="text-4xl lg:text-5xl font-bold text-white mt-4 mb-6">Ce que disent nos clients</motion.h2>
        </div>

        {isLoading && <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 text-white animate-spin" /></div>}

        {testimonials && testimonials.length > 0 && (
          <div className="relative max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div key={activeIndex} initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }} transition={{ duration: 0.4 }} className="bg-white/10 backdrop-blur-sm rounded-3xl p-10 text-center">
                <Quote className="w-12 h-12 text-[#ff6f00] mx-auto mb-6" />
                <p className="text-white text-xl leading-relaxed mb-8 italic">"{testimonials[activeIndex].content}"</p>
                <div className="flex justify-center mb-4">
                  {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-[#ff6f00] fill-[#ff6f00]" />
                  ))}
                </div>
                <p className="text-white font-bold text-lg">{testimonials[activeIndex].author_name}</p>
                <p className="text-white/70">{testimonials[activeIndex].author_title} — {testimonials[activeIndex].author_company}</p>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center gap-4 mt-8">
              <button onClick={prev} className="p-3 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"><ChevronLeft className="w-5 h-5" /></button>
              <div className="flex gap-2 items-center">
                {testimonials.map((_, i) => (
                  <button key={i} onClick={() => setActiveIndex(i)} className={`w-2 h-2 rounded-full transition-all ${i === activeIndex ? 'bg-[#ff6f00] w-6' : 'bg-white/40'}`} />
                ))}
              </div>
              <button onClick={next} className="p-3 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"><ChevronRight className="w-5 h-5" /></button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
