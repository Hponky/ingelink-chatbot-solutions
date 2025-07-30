'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useResponsiveButtonPositioning } from '@/hooks/useResponsiveButtonPositioning';

interface ChatToggleProps {
  isOpen: boolean;
  onToggle: () => void;
  unreadCount?: number;
}

export function ChatToggle({ isOpen, onToggle, unreadCount = 0 }: ChatToggleProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { positions, screenSize } = useResponsiveButtonPositioning(isOpen);
  
  // No renderizar si no debe ser visible
  if (!positions.chatToggle.visible) {
    return null;
  }
  
  return (
    <motion.div
      className="fixed z-50"
      style={{
        bottom: positions.chatToggle.bottom,
        right: positions.chatToggle.right,
        transform: positions.chatToggle.transform
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 1 }}
      layout
    >
      {/* Tooltip - Ajustado para responsive */}
      <AnimatePresence>
        {isHovered && !isOpen && screenSize !== 'mobile' && (
          <motion.div
            className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-slate-800/90 backdrop-blur-sm text-white text-sm rounded-lg whitespace-nowrap border border-slate-700/50"
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            ¡Habla con nuestro ChatBot!
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-800/90" />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main Button - Tamaño responsivo */}
      <motion.button
        className={`relative bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full shadow-2xl flex items-center justify-center group overflow-hidden ${
          screenSize === 'mobile' ? 'w-14 h-14' : 'w-16 h-16'
        }`}
        whileHover={{ scale: screenSize === 'mobile' ? 1.05 : 1.1 }}
        whileTap={{ scale: 0.95 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={onToggle}
      >
        {/* Icon - Tamaño ajustado */}
        <motion.div
          className="relative z-10 text-white"
          animate={{ rotate: 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? (
            <svg className={screenSize === 'mobile' ? 'w-5 h-5' : 'w-6 h-6'} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className={screenSize === 'mobile' ? 'w-5 h-5' : 'w-6 h-6'} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          )}
        </motion.div>
        
        {/* Unread Badge - Posición ajustada */}
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.div
              className={`absolute bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold ${
                screenSize === 'mobile' ? 'w-5 h-5 -top-1 -right-1' : 'w-6 h-6 -top-2 -right-2'
              }`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Pulse Effect - Ajustado */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-primary-400"
          animate={{
            scale: [1, screenSize === 'mobile' ? 1.3 : 1.5, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.button>
    </motion.div>
  );
}