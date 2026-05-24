import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CTA() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a237e] via-[#1a237e] to-[#0d1245]" />
      
      {/* Decorative Shapes */}
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="absolute top-20 left-20 w-20 h-20 bg-[#ff6f00]/20 rounded-full"
        style={{ animation: 'orbit-1 20s linear infinite' }}
      />
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 1.3 }}
        className="absolute bottom-20 right-20 w-16 h-16 bg-[#4fc3f7]/20 rounded-lg rotate-45"
        style={{ animation: 'orbit-2 25s linear infinite' }}
      />
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 1.4 }}
        className="absolute top-1/2 right-1/4 w-8 h-8 bg-white/10 rounded-full"
        style={{ animation: 'orbit-3 15s linear infinite' }}
      />

      {/* Diagonal Split */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          background: 'linear-gradient(135deg, transparent 50%, rgba(255,111,0,0.3) 50%)',
        }}
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 md:p-16 border border-white/20"
        >
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Prêt à démarrer ?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="text-white/70 text-lg md:text-xl mb-10 max-w-2xl mx-auto"
          >
            Contactez-nous dès maintenant pour discuter de vos projets et découvrir 
            comment nous pouvons vous accompagner dans votre réussite.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 1.1, ease: [0.68, -0.55, 0.265, 1.55] }}
          >
            <Button
              asChild
              size="lg"
              className="bg-[#ff6f00] hover:bg-[#ff8f00] text-white px-10 py-6 text-lg font-medium transition-all duration-300 hover:scale-110 group"
              style={{
                boxShadow: '0 0 30px rgba(255, 111, 0, 0.4)',
                animation: 'pulse-glow 2s ease-in-out infinite',
              }}
            >
              <Link to="/contact">
                Contactez-nous
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      <style>{`
        @keyframes orbit-1 {
          from { transform: rotate(0deg) translateX(100px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(100px) rotate(-360deg); }
        }
        @keyframes orbit-2 {
          from { transform: rotate(0deg) translateX(150px) rotate(0deg); }
          to { transform: rotate(-360deg) translateX(150px) rotate(360deg); }
        }
        @keyframes orbit-3 {
          from { transform: rotate(0deg) translateX(80px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(80px) rotate(-360deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 30px rgba(255, 111, 0, 0.4); }
          50% { box-shadow: 0 0 50px rgba(255, 111, 0, 0.6); }
        }
      `}</style>
    </section>
  );
}
