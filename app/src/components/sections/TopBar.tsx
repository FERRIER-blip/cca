import { Phone } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TopBar() {
  return (
    <motion.div
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="bg-[#1a237e] text-white py-2"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Phone className="w-4 h-4" />
          </motion.div>
          <span className="text-sm">+235 66 28 42 93</span>
        </div>
        <a
          href="/contact"
          className="text-sm hover:text-[#ff6f00] transition-colors duration-200 relative group"
        >
          Contactez-nous
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#ff6f00] transition-all duration-300 group-hover:w-full" />
        </a>
      </div>
    </motion.div>
  );
}
