import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Facebook, Twitter, Linkedin, Instagram, MapPin, Phone, Mail } from 'lucide-react';

const quickLinks = [
  { name: 'Accueil', href: '/' },
  { name: 'À propos', href: '/a-propos' },
  { name: 'Services', href: '/services' },
  { name: 'Formations', href: '/formations' },
  { name: 'Contact', href: '/contact' },
];

const services = [
  { name: 'Droit', href: '/services/droit' },
  { name: 'Administration', href: '/services/administration' },
  { name: 'Communication', href: '/services/communication' },
  { name: 'Informatique', href: '/services/informatique' },
  { name: 'Formation', href: '/formations' },
];

const socialLinks = [
  { name: 'Facebook', icon: Facebook, href: '#' },
  { name: 'Twitter', icon: Twitter, href: '#' },
  { name: 'LinkedIn', icon: Linkedin, href: '#' },
  { name: 'Instagram', icon: Instagram, href: '#' },
];

export default function Footer() {
  return (
    <footer className="bg-[#1a237e] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo & Description */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <span className="text-[#1a237e] font-bold text-lg">CCA</span>
              </div>
              <div>
                <p className="font-bold text-sm leading-tight">CABINET CONSTRUIRE</p>
                <p className="font-bold text-sm leading-tight">L'AVENIR</p>
              </div>
            </div>
            <p className="text-white/70 text-sm mb-6 leading-relaxed">
              Cabinet Construire l'Avenir - Expertise juridique, administrative et 
              communicationnelle pour accompagner votre développement.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.9 + index * 0.08 }}
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#ff6f00]/20 hover:text-[#ff6f00] transition-all duration-300"
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <h3 className="font-semibold text-lg mb-6">Liens rapides</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.06 }}
                >
                  <Link
                    to={link.href}
                    className="text-white/70 hover:text-[#ff6f00] transition-all duration-200 hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            <h3 className="font-semibold text-lg mb-6">Nos services</h3>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <motion.li
                  key={service.name}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.6 + index * 0.06 }}
                >
                  <Link
                    to={service.href}
                    className="text-white/70 hover:text-[#ff6f00] transition-all duration-200 hover:translate-x-1 inline-block"
                  >
                    {service.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.7 }}
          >
            <h3 className="font-semibold text-lg mb-6">Contact</h3>
            <ul className="space-y-4">
              <motion.li
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.7 }}
                className="flex items-start gap-3"
              >
                <MapPin className="w-5 h-5 text-[#ff6f00] flex-shrink-0 mt-0.5" />
                <span className="text-white/70 text-sm">
                  Gassi, 7ème arrondissement,<br />
                  N'Djaména, Tchad
                </span>
              </motion.li>
              <motion.li
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.78 }}
                className="flex items-center gap-3"
              >
                <Phone className="w-5 h-5 text-[#ff6f00] flex-shrink-0" />
                <span className="text-white/70 text-sm">+235 66 00 00 00</span>
              </motion.li>
              <motion.li
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.86 }}
                className="flex items-center gap-3"
              >
                <Mail className="w-5 h-5 text-[#ff6f00] flex-shrink-0" />
                <span className="text-white/70 text-sm">contact@cca-td.com</span>
              </motion.li>
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 1 }}
        className="border-t border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-white/50 text-sm">
            © {new Date().getFullYear()} CCA - Cabinet Construire l'Avenir. Tous droits réservés.
          </p>
        </div>
      </motion.div>
    </footer>
  );
}
