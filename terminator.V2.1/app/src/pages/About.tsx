import { motion } from 'framer-motion';
import { Target, Eye, Lightbulb, Users, Award, CheckCircle } from 'lucide-react';

const values = [
  {
    icon: Target,
    title: 'Notre Mission',
    description: 'Fournir une expertise juridique, administrative et de communication de qualité pour contribuer à améliorer le fonctionnement des institutions.',
  },
  {
    icon: Eye,
    title: 'Notre Vision',
    description: 'Contribuer à améliorer la gouvernance publique et la professionnalisation des organisations à l\'ère de la digitalisation.',
  },
  {
    icon: Lightbulb,
    title: 'Nos Valeurs',
    description: 'Excellence, intégrité, innovation et engagement sont les piliers qui guident chacune de nos actions.',
  },
];

const team = [
  {
    name: 'Neloumta Caroline',
    title: 'Directrice Générale',
    bio: 'Master II en Sciences juridiques et politiques, option fiscalité appliquée',
  },
  {
    name: 'Solalta Rimane',
    title: 'Directeur Administratif',
    bio: 'Master II en droit public',
  },
  {
    name: 'Rakidji Ngomdjibaye',
    title: 'Président du Conseil',
    bio: 'Juriste et diplômé de l\'ENA-France',
  },
];

const objectives = [
  'Servir de conseil attitré et spécialisé dans les domaines du droit, de l\'administration et de la communication',
  'Accompagner les institutions dans l\'élaboration et la réforme des textes juridiques',
  'Servir d\'outil de renforcement des capacités des cadres et agents publics et privés',
  'Contribuer à l\'amélioration des procédures administratives et la gestion institutionnelle',
  'Sécuriser juridiquement les décisions et les actions des institutions et organisations',
];

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gradient-to-br from-[#1a237e] to-[#0d1245] py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
          >
            À Propos de Nous
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/70 text-lg max-w-2xl mx-auto"
          >
            Découvrez le Cabinet Construire l'Avenir et notre engagement pour l'excellence
          </motion.p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <div className="aspect-[4/3] bg-gradient-to-br from-[#1a237e] to-[#ff6f00] flex items-center justify-center">
                  <div className="text-center text-white p-8">
                    <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-4xl font-bold">CCA</span>
                    </div>
                    <p className="text-2xl font-bold">Cabinet Construire</p>
                    <p className="text-2xl font-bold">l'Avenir</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-[#1a237e]">
                Qui sommes-nous ?
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Le « Cabinet Construire l'Avenir » en abrégé CCA est un cabinet d'expertise 
                et de conseil dans divers domaines, notamment juridique, administratif et 
                de communication. Sa création et son fonctionnement répondent aux exigences 
                de la législation tchadienne en vigueur.
              </p>
              <p className="text-gray-600 leading-relaxed">
                En dehors de ses équipes dirigeante et technique animées par des personnes 
                qualifiées, compétentes, expérimentées et disponibles, le CCA utilise un 
                parterre d'experts, notamment nationaux, dans tous les domaines de compétences.
              </p>
              <div className="flex items-center gap-4 pt-4">
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1a237e] to-[#ff6f00] border-2 border-white flex items-center justify-center text-white text-sm font-bold"
                    >
                      {i}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500">
                  <span className="font-bold text-[#1a237e]">+50 experts</span> à votre service
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-16 h-16 bg-[#1a237e]/10 rounded-xl flex items-center justify-center mb-6">
                  <value.icon className="w-8 h-8 text-[#1a237e]" />
                </div>
                <h3 className="text-xl font-bold text-[#1a237e] mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Objectives */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-[#1a237e] mb-8">
                Nos Objectifs
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Fournir aux institutions, organisations et entreprises tant publiques que 
                privées une expertise juridique, administrative et de communication de 
                qualité afin de contribuer à améliorer leur fonctionnement et la conformité 
                de leurs actions aux normes juridiques.
              </p>
              <ul className="space-y-4">
                {objectives.map((objective, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle className="w-6 h-6 text-[#ff6f00] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{objective}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="bg-[#1a237e] rounded-2xl p-6 text-white">
                    <Award className="w-10 h-10 mb-4" />
                    <p className="text-3xl font-bold">150+</p>
                    <p className="text-white/70">Projets réalisés</p>
                  </div>
                  <div className="bg-[#4fc3f7] rounded-2xl p-6 text-white">
                    <Users className="w-10 h-10 mb-4" />
                    <p className="text-3xl font-bold">50+</p>
                    <p className="text-white/70">Experts formés</p>
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="bg-[#ff6f00] rounded-2xl p-6 text-white">
                    <p className="text-3xl font-bold">10+</p>
                    <p className="text-white/70">Années d'expérience</p>
                  </div>
                  <div className="bg-gray-100 rounded-2xl p-6">
                    <p className="text-3xl font-bold text-[#1a237e]">98%</p>
                    <p className="text-gray-500">Clients satisfaits</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#1a237e] mb-4">
              Notre Équipe Dirigeante
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Des professionnels expérimentés et passionnés à votre service
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white rounded-2xl p-8 shadow-lg text-center"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-[#1a237e] to-[#ff6f00] rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#1a237e] mb-2">{member.name}</h3>
                <p className="text-[#ff6f00] font-medium mb-4">{member.title}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
