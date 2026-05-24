import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Building2, Loader2, AlertCircle } from 'lucide-react'; // Ajout de AlertCircle
import { partnersAPI } from '@/services/api';
import type { Partner } from '@/types';

export default function Partners() {
  // 1. Ajout de isError et error pour capturer les problèmes
  const { data: partners, isLoading, isError, error } = useQuery<Partner[]>({
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

        {/* État 1 : Chargement en cours */}
        {isLoading && (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 text-[#1a237e] animate-spin" />
          </div>
        )}

        {/* État 2 : Erreur de l'API (Backend éteint, Erreur 500, etc.) */}
        {isError && (
          <div className="flex flex-col items-center justify-center py-12 text-red-500 bg-red-50 rounded-2xl max-w-2xl mx-auto p-6 border border-red-200">
            <AlertCircle className="w-10 h-10 mb-4 text-red-500" />
            <p className="text-xl font-semibold mb-2">Impossible de charger les partenaires</p>
            <p className="text-sm text-red-600/80 text-center">
              Erreur serveur : {error instanceof Error ? error.message : "Vérifiez que votre backend répond correctement."}
            </p>
          </div>
        )}

        {/* État 3 : L'API fonctionne, mais la base de données est vide */}
        {!isLoading && !isError && (!partners || partners.length === 0) && (
          <div className="text-center py-12 bg-white rounded-2xl max-w-2xl mx-auto border border-gray-200 shadow-sm">
            <p className="text-gray-500 text-lg">Aucun partenaire n'est disponible pour le moment.</p>
          </div>
        )}

        {/* État 4 : Succès, affichage du carrousel animé */}
        {partners && partners.length > 0 && (
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
        )}
      </div>
    </section>
  );
}