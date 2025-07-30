'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { ContactModal } from '@/components/ui';

interface CTASectionProps {
  onOpenChat: () => void;
}

const stats = [
  {
    number: "95%",
    label: "Reducción en tiempo de respuesta",
    description: "Respuestas instantáneas 24/7"
  },
  {
    number: "80%",
    label: "Menos consultas repetitivas",
    description: "FAQs resueltas automáticamente"
  },
  {
    number: "60%",
    label: "Mejora en satisfacción del cliente",
    description: "Atención personalizada y eficiente"
  },
  {
    number: "24/7",
    label: "Disponibilidad total",
    description: "Sin horarios ni días festivos"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 30,
    scale: 0.9
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 100,
      damping: 12
    }
  }
};

export function CTASection({ onOpenChat }: CTASectionProps) {
  const { elementRef, isIntersecting } = useIntersectionObserver({ threshold: 0.1 });
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const handleOpenContactModal = () => {
    setIsContactModalOpen(true);
  };

  const handleCloseContactModal = () => {
    setIsContactModalOpen(false);
  };

  return (
    <>
      <section ref={elementRef} className="relative py-24 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main CTA Content */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 } as const}
            animate={isIntersecting ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-white">Optimiza tu</span>
              <br />
              <span className="gradient-text">
                Atención al Cliente
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
              Implementa IA que resuelve consultas automáticamente y mejora la experiencia del cliente.
            </p>
            
            {/* Primary CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <motion.button
                onClick={onOpenChat}
                className="px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Probar Demo Gratuita
              </motion.button>
              
              <motion.button
                onClick={handleOpenContactModal}
                className="px-8 py-4 border-2 border-primary-500/50 text-primary-300 font-semibold rounded-xl hover:bg-primary-500/10 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Solicitar Consultoría
              </motion.button>
            </div>
          </motion.div>
          
          {/* Statistics Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
            variants={containerVariants}
            initial="hidden"
            animate={isIntersecting ? "visible" : "hidden"}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center p-6 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl hover:border-primary-500/30 transition-all duration-300"
              >
                <div className="text-4xl font-bold gradient-text mb-2">
                  {stat.number}
                </div>
                <div className="text-white font-semibold mb-1">
                  {stat.label}
                </div>
                <div className="text-slate-400 text-sm">
                  {stat.description}
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          {/* Value Proposition */}
          <motion.div
            className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm border border-slate-600/50 rounded-2xl p-8 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={isIntersecting ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h3 className="text-2xl font-bold text-white mb-4">
              Ventajas Clave
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div>
                <div className="text-primary-400 font-semibold mb-2">📚 Personalización Total</div>
                <p className="text-slate-300 text-sm">
                  Configura respuestas específicas para tu empresa.
                </p>
              </div>
              <div>
                <div className="text-secondary-400 font-semibold mb-2">📊 Métricas Claras</div>
                <p className="text-slate-300 text-sm">
                  Insights sobre efectividad y áreas de mejora.
                </p>
              </div>
              <div>
                <div className="text-accent-400 font-semibold mb-2">🔄 Aprendizaje Continuo</div>
                <p className="text-slate-300 text-sm">
                  Mejora automática con cada interacción.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Contact Modal */}
      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={handleCloseContactModal} 
      />
    </>
  );
}