import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.05]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50"
    >
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-[#1a237e]/10 blur-[100px]"
          style={{
            animation: 'float-1 15s ease-in-out infinite',
          }}
        />
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.4 }}
          transition={{ duration: 1.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-[#ff6f00]/10 blur-[100px]"
          style={{
            animation: 'float-2 18s ease-in-out infinite',
          }}
        />
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.3 }}
          transition={{ duration: 1.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-1/2 left-1/3 w-[400px] h-[400px] rounded-full bg-[#4fc3f7]/10 blur-[100px]"
          style={{
            animation: 'float-3 20s ease-in-out infinite',
          }}
        />
      </div>

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#1a237e 1px, transparent 1px), linear-gradient(90deg, #1a237e 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <motion.div style={{ y, opacity }} className="space-y-8 z-10">
            {/* Subtitle */}
            <motion.div
              initial={{ opacity: 0, letterSpacing: '20px' }}
              animate={{ opacity: 1, letterSpacing: '4px' }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="text-[#ff6f00] text-sm font-semibold tracking-[4px] uppercase">
                Cabinet Construire l'Avenir
              </span>
            </motion.div>

            {/* Title */}
            <div className="space-y-2">
              {['Satisfaire', 'par la', 'qualité'].map((word, index) => (
                <div key={word} className="overflow-hidden">
                  <motion.h1
                    initial={{ y: '100%', opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      duration: 0.6,
                      delay: 0.6 + index * 0.12,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#1a237e] leading-tight"
                  >
                    {word}
                  </motion.h1>
                </div>
              ))}
            </div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg text-gray-600 max-w-lg leading-relaxed"
            >
              Expertise juridique, administrative et communicationnelle pour 
              accompagner votre réussite. Nous construisons l'avenir avec vous.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap gap-4"
            >
              <Button
                asChild
                size="lg"
                className="bg-[#1a237e] hover:bg-[#ff6f00] text-white px-8 py-6 text-base font-medium transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#ff6f00]/30 group"
              >
                <Link to="/services">
                  Nos services
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-2 border-[#1a237e] text-[#1a237e] hover:bg-[#1a237e] hover:text-white px-8 py-6 text-base font-medium transition-all duration-300 group"
              >
                <Link to="/a-propos">
                  En savoir plus
                  <ChevronRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 100, rotateY: -15 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ scale }}
            className="relative lg:h-[600px] flex items-center justify-center perspective-1000"
          >
            {/* Decorative Elements */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 1.4, ease: [0.68, -0.55, 0.265, 1.55] }}
              className="absolute -top-8 -left-8 w-24 h-24 bg-[#ff6f00] rounded-lg opacity-20"
              style={{ animation: 'spin 20s linear infinite' }}
            />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 1.5, ease: [0.68, -0.55, 0.265, 1.55] }}
              className="absolute -bottom-4 -right-4 w-16 h-16 bg-[#1a237e] rounded-full opacity-20"
            />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 1.6, ease: [0.68, -0.55, 0.265, 1.55] }}
              className="absolute top-1/2 -right-12 w-8 h-8 bg-[#4fc3f7] rounded-full opacity-30"
            />

            {/* Main Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/images/hero-team.jpg"
                alt="CCA Team"
                className="w-full h-auto object-cover"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a237e]/20 to-transparent" />
            </div>

            {/* Floating Stats Card */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.8, ease: [0.16, 1, 0.3, 1] }}
              className="absolute -bottom-8 -left-8 bg-white rounded-xl shadow-xl p-6"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#ff6f00]/10 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-[#ff6f00]">10+</span>
                </div>
                <div>
                  <p className="font-semibold text-[#1a237e]">Années</p>
                  <p className="text-sm text-gray-500">d'expérience</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes float-1 {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(30px, -30px); }
          50% { transform: translate(-20px, 20px); }
          75% { transform: translate(20px, 10px); }
        }
        @keyframes float-2 {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-30px, 20px); }
          50% { transform: translate(20px, -20px); }
          75% { transform: translate(-10px, -10px); }
        }
        @keyframes float-3 {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(20px, 30px); }
          50% { transform: translate(-30px, -10px); }
          75% { transform: translate(10px, -20px); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}
