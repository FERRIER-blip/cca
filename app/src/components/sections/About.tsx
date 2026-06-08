import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const stats = [
  { value: 150, suffix: '+', label: 'Projets réalisés' },
  { value: 50, suffix: '+', label: 'Experts formés' },
  { value: 10, suffix: '+', label: "Années d'expérience" },
  { value: 100, suffix: '%', label: 'Clients satisfaits' },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const contentY = useTransform(scrollYProgress, [0, 1], [-30, 30]);

  return (
    <section ref={containerRef} className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
{/* Image */}
<motion.div
  style={{ y: imageY }}
  className="relative"
>
  <motion.div
    initial={{ opacity: 0, x: -100, rotateY: 10 }}
    whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
    className="relative rounded-2xl overflow-hidden shadow-2xl"
  >
    <img
      src="/images/about-team.jpg"
      alt="CCA Team"
      className="w-full h-[300px] md:h-[600px] object-cover"
    />
    {/* Decorative overlay */}
    <div className="absolute inset-0 bg-gradient-to-tr from-[#1a237e]/10 to-transparent" />
  </motion.div>

  {/* Decorative Line - Corrigé : masqué sur mobile, visible uniquement sur desktop */}
  <motion.div
    initial={{ pathLength: 0 }}
    whileInView={{ pathLength: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay: 0.5 }}
    className="absolute -right-4 top-1/2 w-16 h-0.5 bg-[#ff6f00] hidden md:block"
  />
</motion.div>

          {/* Content */}
          <motion.div style={{ y: contentY }} className="space-y-6">
            <motion.span
              initial={{ opacity: 0, letterSpacing: '10px' }}
              whileInView={{ opacity: 1, letterSpacing: '2px' }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-[#ff6f00] text-sm font-semibold tracking-[2px] uppercase"
            >
              À Propos de Nous
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl lg:text-5xl font-bold text-[#1a237e] leading-tight"
            >
              Nous sommes des experts passionnés
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="text-gray-600 leading-relaxed"
            >
              Le Cabinet Construire l'Avenir (CCA) est un cabinet d'expertise et de conseil 
              dans divers domaines, notamment juridique, administratif et de communication. 
              Notre équipe de professionnels qualifiés et expérimentés met son expertise au 
              service de votre réussite.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="text-gray-600 leading-relaxed"
            >
              Notre vision est de contribuer à améliorer la gouvernance publique, à assurer 
              la sécurité juridique des institutions et la professionnalisation des organisations 
              publiques et privées.
            </motion.p>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="grid sm:grid-cols-2 gap-4 pt-4"
            >
              {[
                'Expertise multidisciplinaire',
                'Solutions sur mesure',
                'Accompagnement personnalisé',
                'Résultats garantis',
              ].map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-[#ff6f00] flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.9, ease: [0.68, -0.55, 0.265, 1.55] }}
            >
              <Button
                asChild
                className="bg-[#1a237e] hover:bg-[#ff6f00] text-white mt-6 group transition-all duration-300 hover:scale-105"
              >
                <Link to="/a-propos">
                  En savoir plus
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.15 }}
              // On utilise un style simple pour le survol
              whileHover={{ y: -10 }}
              className="text-center p-6 rounded-xl transition-all duration-300 hover:bg-[#ff6f00]/10"
            >
              <p className="text-4xl lg:text-5xl font-bold text-[#ff6f00] mb-2">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-gray-600">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
