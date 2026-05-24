import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, Quote, Star, Loader2, AlertCircle, MessageSquarePlus, X, CheckCircle2 } from 'lucide-react';
import { testimonialsAPI } from '@/services/api';
import type { Testimonial } from '@/types';

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // État du formulaire
  const [formData, setFormData] = useState({
    author_name: '',
    author_title: '',
    author_company: '',
    content: '',
    rating: 5,
  });

  // Récupération des témoignages approuvés
  const { data: testimonials, isLoading, isError, error } = useQuery<Testimonial[]>({
    queryKey: ['testimonials-featured'],
    queryFn: async () => (await testimonialsAPI.getFeatured()).data,
  });

  // Soumission du nouveau témoignage
  const submitMutation = useMutation({
    mutationFn: async (newTestimonial: typeof formData) => {
      return await testimonialsAPI.create(newTestimonial);
    },
    onSuccess: () => {
      setIsSuccess(true);
      // Réinitialise le formulaire
      setFormData({ author_name: '', author_title: '', author_company: '', content: '', rating: 5 });
      // Ferme le message de succès après 3 secondes
      setTimeout(() => {
        setIsSuccess(false);
        setIsModalOpen(false);
      }, 3000);
    },
  });

  const next = () => setActiveIndex((prev) => (prev + 1) % (testimonials?.length || 1));
  const prev = () => setActiveIndex((prev) => (prev - 1 + (testimonials?.length || 1)) % (testimonials?.length || 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMutation.mutate(formData);
  };

  return (
    <section className="py-24 bg-gradient-to-br from-[#1a237e] to-[#0d1245] overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-[#ff6f00] text-sm font-semibold tracking-[2px] uppercase">Témoignages</motion.span>
          <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="text-4xl lg:text-5xl font-bold text-white mt-4 mb-6">Ce que disent nos clients</motion.h2>
          
          {/* Bouton pour ouvrir le formulaire */}
          <motion.button 
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 bg-[#ff6f00] hover:bg-[#e65c00] text-white px-6 py-3 rounded-full font-medium transition-colors shadow-lg shadow-[#ff6f00]/20"
          >
            <MessageSquarePlus className="w-5 h-5" />
            Laisser votre avis
          </motion.button>
        </div>

        {/* --- CARROUSEL --- */}
        {isLoading && (
          <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 text-white animate-spin" /></div>
        )}

        {isError && (
          <div className="flex flex-col items-center justify-center py-12 text-red-400 bg-red-900/20 rounded-2xl max-w-2xl mx-auto p-6 border border-red-500/30">
            <AlertCircle className="w-10 h-10 mb-4 text-red-500" />
            <p className="text-xl font-semibold mb-2 text-red-300">Impossible de charger les témoignages</p>
            <p className="text-sm text-red-400/80 text-center">Erreur serveur : {error instanceof Error ? error.message : "Erreur inconnue"}</p>
          </div>
        )}

        {!isLoading && !isError && (!testimonials || testimonials.length === 0) && (
          <div className="text-center py-12 bg-white/5 rounded-2xl max-w-2xl mx-auto border border-white/10">
            <p className="text-white/70 text-lg">Aucun témoignage n'est disponible pour le moment.</p>
          </div>
        )}

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

      {/* --- MODALE DU FORMULAIRE --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative"
            >
              {/* Bouton fermer */}
              <button onClick={() => !submitMutation.isPending && setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10">
                <X className="w-6 h-6" />
              </button>

              <div className="p-8">
                {isSuccess ? (
                  <div className="text-center py-8">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8 text-green-600" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Merci pour votre avis !</h3>
                    <p className="text-gray-600">Votre témoignage a été envoyé avec succès. Il sera visible sur le site après validation par notre équipe.</p>
                  </div>
                ) : (
                  <>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Partagez votre expérience</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet *</label>
                        <input required type="text" className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ff6f00] focus:border-transparent outline-none" value={formData.author_name} onChange={(e) => setFormData({...formData, author_name: e.target.value})} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Fonction / Poste</label>
                          <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ff6f00] focus:border-transparent outline-none" value={formData.author_title} onChange={(e) => setFormData({...formData, author_title: e.target.value})} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Entreprise</label>
                          <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ff6f00] focus:border-transparent outline-none" value={formData.author_company} onChange={(e) => setFormData({...formData, author_company: e.target.value})} />
                        </div>
                      </div>
                      
                      {/* Système de notation par étoiles */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Votre note *</label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button key={star} type="button" onClick={() => setFormData({...formData, rating: star})} className="focus:outline-none">
                              <Star className={`w-8 h-8 transition-colors ${star <= formData.rating ? 'text-[#ff6f00] fill-[#ff6f00]' : 'text-gray-300'}`} />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Votre message *</label>
                        <textarea required rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ff6f00] focus:border-transparent outline-none resize-none" value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} />
                      </div>

                      {submitMutation.isError && (
                        <p className="text-red-500 text-sm">Une erreur est survenue lors de l'envoi. Veuillez réessayer.</p>
                      )}

                      <button type="submit" disabled={submitMutation.isPending} className="w-full bg-[#1a237e] hover:bg-[#0d1245] text-white py-3 rounded-xl font-medium transition-colors flex justify-center items-center gap-2 mt-6">
                        {submitMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Envoyer mon avis"}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}