'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Modal } from './Modal';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const contactInfo = {
  name: 'Humberto Agudelo',
  title: 'Desarrollador Full-Stack',
  email: 'humberto228xd@gmail.com',
  phone: '+57 3044388349',
  linkedin: 'https://linkedin.com/in/humberto-agudelo',
  github: 'https://github.com/Hponky',
  location: 'Colombia'
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 30
    }
  }
};

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const handleEmailClick = () => {
    const subject = encodeURIComponent('Consultoría - IngeLink ChatBot');
    const body = encodeURIComponent(
      `Hola Humberto,\n\nMe interesa conocer más sobre tus servicios de consultoría para el desarrollo de chatbots con IA.\n\n¿Podrías proporcionarme más información sobre:\n- Servicios disponibles\n- Precios y paquetes\n- Tiempo de implementación\n- Casos de éxito\n\nQuedo atento a tu respuesta.\n\nSaludos cordiales.`
    );
    window.open(`mailto:${contactInfo.email}?subject=${subject}&body=${body}`, '_blank');
  };

  const handlePhoneClick = () => {
    window.open(`tel:${contactInfo.phone}`, '_blank');
  };

  const handleLinkedInClick = () => {
    window.open(contactInfo.linkedin, '_blank', 'noopener,noreferrer');
  };

  const handleGitHubClick = () => {
    window.open(contactInfo.github, '_blank', 'noopener,noreferrer');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Información de Contacto" size="lg">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Profile Section */}
        <motion.div variants={itemVariants} className="text-center">
          <div className="w-24 h-24 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl font-bold text-white">
              {contactInfo.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">{contactInfo.name}</h3>
          <p className="text-lg text-slate-300 mb-1">{contactInfo.title}</p>
          <p className="text-slate-400 flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {contactInfo.location}
          </p>
        </motion.div>

        {/* Contact Methods */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Email */}
          <motion.button
            onClick={handleEmailClick}
            className="p-4 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 hover:border-primary-500 rounded-xl transition-all duration-300 group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-semibold text-white">Email</p>
                <p className="text-sm text-slate-300 break-all">{contactInfo.email}</p>
              </div>
            </div>
          </motion.button>

          {/* Phone */}
          <motion.button
            onClick={handlePhoneClick}
            className="p-4 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 hover:border-primary-500 rounded-xl transition-all duration-300 group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-semibold text-white">Teléfono</p>
                <p className="text-sm text-slate-300">{contactInfo.phone}</p>
              </div>
            </div>
          </motion.button>

          {/* LinkedIn */}
          <motion.button
            onClick={handleLinkedInClick}
            className="p-4 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 hover:border-primary-500 rounded-xl transition-all duration-300 group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </div>
              <div className="text-left">
                <p className="font-semibold text-white">LinkedIn</p>
                <p className="text-sm text-slate-300">Perfil profesional</p>
              </div>
            </div>
          </motion.button>

          {/* GitHub */}
          <motion.button
            onClick={handleGitHubClick}
            className="p-4 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 hover:border-primary-500 rounded-xl transition-all duration-300 group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </div>
              <div className="text-left">
                <p className="font-semibold text-white">GitHub</p>
                <p className="text-sm text-slate-300">Repositorios</p>
              </div>
            </div>
          </motion.button>
        </motion.div>

        {/* CTA Section */}
        <motion.div variants={itemVariants} className="text-center pt-4 border-t border-slate-700">
          <p className="text-slate-300 mb-4">
            ¿Listo para llevar tu negocio al siguiente nivel con IA?
          </p>
          <motion.button
            onClick={handleEmailClick}
            className="px-8 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Enviar Email de Consultoría
          </motion.button>
        </motion.div>
      </motion.div>
    </Modal>
  );
}