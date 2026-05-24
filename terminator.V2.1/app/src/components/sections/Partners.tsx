import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Building2, Loader2 } from 'lucide-react';
import { partnersAPI } from '@/services/api';
import type { Partner } from '@/types';

export default function Partners() {
  const { data: partners, isLoading } = useQuery<Partner[]>({
    queryKey: ['partners'],
    queryFn: async () => (await partnersAPI.getAll()).data,
  });

  return (
    <section className="py-24 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-[#ff6f00] text-sm font-semibold tracking-[2px] uppercase">Nos Partenaires</motion.span>
          <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="text-4xl lg:text-5xl font-bold text-[#1a237e] mt-4 mb-6">Ils nous font confiance</motion.h2>
          <motion.p initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.4 }} className="text-gray-600 text-lg">Des organisations de renom qui collaborent avec nous.</motion.p>
        </div>

        {isLoading && <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 text-[#1a237e] animate-spin" /></div>}

        {partners && partners.length > 0 && (
          <>
            <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
              <motion.div className="flex gap-8 shrink-0" animate={{ x: ['0%', '-50%'] }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}>
                {[...partners, ...partners].map((partner, index) => (
                  <motion.div key={index} className="flex items-center gap-3 bg-white rounded-xl px-6 py-4 shadow-sm border border-gray-100 shrink-0 min-w-[200px]">
                    {partner.logo_url ? (
                      <img src={partner.logo_url} alt={partner.name} className="h-8 w-auto object-contain" />
                    ) : (
                      <Building2 className="w-8 h-8 text-[#1a237e]" />
                    )}
                    <span className="font-semibold text-gray-700 whitespace-nowrap">{partner.name}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
