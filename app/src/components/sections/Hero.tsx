import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

// 📸 Chemins des images pour le défilement global en arrière-plan
const IMAGES = [
  '/images/hero-team.jpg',
  '/images/hero-service1.jpg', 
  '/images/hero-service2.jpg',
];

// 🏷️ Vos 4 titres défilants
const TITRES_DEFILANTS = [
  "Expertise Juridique & Administrative",
  "Communication Stratégique",
  "Solutions Clés en Main",
  "Votre Succès, Notre Engagement"
];

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Défilement automatique des images (toutes les 4 secondes)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % IMAGES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-transparent pt-[0.25cm]"
    >
      {/* 🇨🇭 1. Barre tricolore tout en haut - Épaisseur 0.25cm */}
  <div className="fixed top-0 left-0 w-full h-[0.25cm] flex z-50">
        <div className="flex-1 bg-[#1a237e]" /> {/* Bleu */}
        <div className="flex-1 bg-[#ffb300]" /> {/* Jaune */}
        <div className="flex-1 bg-[#e53935]" /> {/* Rouge */}
      </div>

      {/* 🌌 Images défilant en arrière-plan global de l'accueil */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImageIndex}
            src={IMAGES[currentImageIndex]}
            alt="Background Slide"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.6, scale: 1 }} // Augmenté à 30% pour une meilleure vision
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
        {/* Voile protecteur neutre pour garder du contraste avec le texte */}
        <div className="absolute inset-0 bg-white/10" />
      </div>

      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.3 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-[#1a237e]/5 blur-[100px]"
          style={{ animation: 'float-1 15s ease-in-out infinite' }}
        />
      </div>

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.02] z-0"
        style={{
          backgroundImage: `linear-gradient(#1a237e 1px, transparent 1px), linear-gradient(90deg, #1a237e 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />

      {/* 🖼️ Nouveau cadre Logo en haut à droite (Ancien cadre image premier plan repositionné) */}
<motion.div
        initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
        animate={{ opacity: 1, scale: 1, rotate: 360 }}
        transition={{ 
          opacity: { duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] },
          scale: { duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] },
          rotate: { duration: 15, repeat: Infinity, ease: "linear" } // Rotation lente et continue
        }}
        className="absolute top-1/2 -mt-16 sm:-mt-20 left-[55%] sm:left-[60%] lg:left-[65%] w-32 h-32 sm:w-40 sm:h-40 rounded-xl overflow-hidden shadow-xl bg-white/80 backdrop-blur border border-white/40 z-30 flex items-center justify-center p-4"
      >
        <img 
          src="/images/logo.png" 
          alt="Logo CCA" 
          className="max-w-full max-h-full object-contain"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            const parent = e.currentTarget.parentElement;
            if (parent) parent.innerHTML = '<span class="text-[#1a237e] text-xl font-black tracking-wider">C.C.A</span>';
          }}
        />
      </motion.div>

      {/* Corps Principal du Hero */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 flex-grow flex items-center w-full z-10">
        <div className="w-full">
          
          {/* Content (Gauche) */}
          <motion.div style={{ y, opacity }} className="space-y-8 z-10 max-w-2xl">
            
            {/* Logo principal ou indicateur de marque */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="inline-block"
            >
              <div className="w-40 h-20 flex items-center justify-start overflow-hidden rounded-lg">
                <img 
                  src="/images/logo.png" 
                  alt="Logo CCA" 
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent) parent.innerHTML = '<span class="text-[#1a237e] text-2xl font-black tracking-wider">C.C.A</span>';
                  }}
                />
              </div>
            </motion.div>

{/* Title */}
            <div className="space-y-2">
              {["L'expertise qui", "construit l'avenir", "de vos institutions."].map((word, index) => (
                <div key={index} className="overflow-hidden">
                  <motion.h1
                    initial={{ y: '100%', opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      duration: 0.6,
                      delay: 0.6 + index * 0.12,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className={`leading-tight drop-shadow-sm ${
                      index === 1 
                        ? 'text-4xl sm:text-5xl lg:text-6xl text-[#ff6f00] italic font-semibold' 
                        : 'text-5xl sm:text-6xl lg:text-7xl text-[#1a237e] font-extrabold tracking-tight'
                    }`}
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
              className="text-lg text-gray-800 max-w-lg leading-relaxed font-semibold bg-white/40 backdrop-blur-sm p-3 rounded-lg inline-block"
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
                className="bg-[#1a237e] hover:bg-[#ff6f00] text-white px-8 py-6 text-base font-medium transition-all duration-300 hover:scale-105 hover:shadow-xl group"
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
                className="border-2 border-[#1a237e] text-[#1a237e] hover:bg-[#1a237e] hover:text-white px-8 py-6 text-base font-medium transition-all duration-300 group backdrop-blur-md bg-white/60"
              >
                <Link to="/a-propos">
                  En savoir plus
                  <ChevronRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>

        </div>
      </div>

      {/* 📜 3. Bandeau tout en bas (Épaisseur : 1.8cm) */}
      <div className="relative w-full h-[1.8cm] bg-[#1a237e] flex items-center overflow-hidden shadow-lg z-30">
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#1a237e] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#1a237e] to-transparent z-10 pointer-events-none" />
        
        {/* Conteneur de l'animation infinie */}
        <div className="flex whitespace-nowrap animate-marquee">
          <div className="flex items-center gap-12 px-4">
            {TITRES_DEFILANTS.map((titre, idx) => (
              <div key={`g1-${idx}`} className="flex items-center gap-12">
                <span className="text-white text-sm sm:text-base font-medium uppercase tracking-wider">
                  {titre}
                </span>
                <span className="w-2 h-2 rounded-full bg-[#ffb300]" />
              </div>
            ))}
          </div>
          <div className="flex items-center gap-12 px-4" aria-hidden="true">
            {TITRES_DEFILANTS.map((titre, idx) => (
              <div key={`g2-${idx}`} className="flex items-center gap-12">
                <span className="text-white text-sm sm:text-base font-medium uppercase tracking-wider">
                  {titre}
                </span>
                <span className="w-2 h-2 rounded-full bg-[#ffb300]" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Styles CSS de l'animation */}
      <style>{`
        @keyframes float-1 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(15px, -15px); }
        }
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 28s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}