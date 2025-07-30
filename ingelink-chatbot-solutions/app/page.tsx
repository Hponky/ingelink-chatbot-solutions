'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChatWindow } from './presentation/components/chat/ChatWindow';
import { 
  HeroSection, 
  FeaturesSection, 
  CTASection, 
  ChatToggle 
} from './features/landing/components';

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [chatMode, setChatMode] = useState<'normal' | 'demo'>('normal');
  
  const handleToggleChat = () => {
    setIsChatOpen(!isChatOpen);
    if (!isChatOpen) {
      setUnreadMessages(0);
    }
  };
  
  const handleOpenChat = (mode: 'normal' | 'demo' = 'normal') => {
    setChatMode(mode);
    setIsChatOpen(true);
    setUnreadMessages(0);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
    setChatMode('normal');
  };
  
  return (
    <main className="relative min-h-screen bg-slate-900">
      {/* Landing Page Content */}
      <AnimatePresence mode="wait">
        {!isChatOpen && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="relative z-10"
          >
            <HeroSection onOpenChat={handleOpenChat} />
            <FeaturesSection />
            <CTASection onOpenChat={handleOpenChat} />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Chat Window */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40"
          >
            <ChatWindow 
              onClose={handleCloseChat} 
              demoMode={chatMode === 'demo'}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Floating Chat Toggle */}
      <ChatToggle 
        isOpen={isChatOpen}
        onToggle={handleToggleChat}
        unreadCount={unreadMessages}
      />
    </main>
  );
}
