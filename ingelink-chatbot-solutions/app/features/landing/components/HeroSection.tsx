'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useParallax } from '../hooks/useParallax';
import { Button } from '@/components/ui/Button';

interface HeroSectionProps {
  onOpenChat: (mode?: 'normal' | 'demo') => void;
}

export function HeroSection({ onOpenChat }: HeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });
  
  const { mousePosition, handleMouseMove } = useParallax();
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '200%']);
  
  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      onMouseMove={handleMouseMove}
      style={{
        background: `
          radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(6, 182, 212, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 80%, rgba(245, 158, 11, 0.1) 0%, transparent 50%),
          linear-gradient(135deg, #0f172a 0%, #1e293b 100%)
        `
      }}
    >
      {/* Animated Background Elements */}
      <motion.div
        className="absolute top-20 left-20 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl"
        animate={{
          x: mousePosition.x * 0.02,
          y: mousePosition.y * 0.02,
          scale: [1, 1.1],
          opacity: [0.6, 0.8],
        }}
        transition={{
          scale: {
            duration: 8,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          },
          opacity: {
            duration: 8,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          },
          x: { type: 'spring', stiffness: 50, damping: 20 },
          y: { type: 'spring', stiffness: 50, damping: 20 }
        }}
      />
      
      <motion.div
        className="absolute bottom-20 right-20 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl"
        animate={{
          x: mousePosition.x * -0.03,
          y: mousePosition.y * -0.03,
          scale: [1, 0.9],
          opacity: [0.5, 0.7],
        }}
        transition={{
          scale: {
            duration: 10,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          },
          opacity: {
            duration: 10,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          },
          x: { type: 'spring', stiffness: 30, damping: 15 },
          y: { type: 'spring', stiffness: 30, damping: 15 }
        }}
      />

      {/* Additional Floating Elements */}
      <motion.div
        className="absolute top-1/3 right-1/4 w-48 h-48 bg-accent-500/8 rounded-full blur-2xl"
        animate={{
          x: [0, 30],
          y: [0, -25],
          scale: [1, 1.2],
          opacity: [0.4, 0.6],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute bottom-1/3 left-1/4 w-32 h-32 bg-primary-400/12 rounded-full blur-xl"
        animate={{
          x: [0, -20],
          y: [0, 30],
          scale: [1, 0.7],
          opacity: [0.3, 0.5],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
          delay: 2,
        }}
      />

      <motion.div
        className="absolute top-1/2 left-1/6 w-20 h-20 bg-secondary-400/15 rounded-full blur-lg"
        animate={{
          x: [0, 15],
          y: [0, -20],
          scale: [1, 1.4],
          opacity: [0.2, 0.4],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
          delay: 4,
        }}
      />

      <motion.div
        className="absolute top-3/4 right-1/6 w-40 h-40 bg-accent-400/10 rounded-full blur-2xl"
        animate={{
          x: [0, -30],
          y: [0, 15],
          scale: [1, 0.8],
          opacity: [0.3, 0.5],
        }}
        transition={{
          duration: 11,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
          delay: 1,
        }}
      />
      
      {/* Main Content */}
      <motion.div
        className="relative z-10 text-center max-w-4xl mx-auto px-4"
        style={{ y: textY }}
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <h1 className="text-6xl md:text-8xl font-bold mb-6">
            <span className="gradient-text">
              IngeLink
            </span>
            <br />
            <span className="text-white">ChatBot</span>
          </h1>
        </motion.div>
        
        <motion.p
          className="text-xl md:text-2xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          Automatiza tu atención al cliente con IA avanzada.
          Resuelve FAQs, reduce consultas repetitivas y mejora
          la satisfacción de tus clientes 24/7.
        </motion.p>
        
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <Button
            size="xl"
            onClick={() => onOpenChat('demo')}
            className="group relative overflow-hidden bg-gradient-to-r from-primary-400 to-secondary-400 hover:from-primary-500 hover:to-secondary-500 transition-all duration-300"
          >
            <span className="relative z-10">Ver Demostración</span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary-400 to-secondary-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              layoutId="button-bg"
            />
          </Button>
        </motion.div>
      </motion.div>
      
      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10] }}
        transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
      >
        <div className="w-6 h-10 border-2 border-slate-400 rounded-full flex justify-center">
          <motion.div
            className="w-1 h-3 bg-slate-400 rounded-full mt-2"
            animate={{ y: [0, 12] }}
            transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
          />
        </div>
      </motion.div>
    </section>
  );
}