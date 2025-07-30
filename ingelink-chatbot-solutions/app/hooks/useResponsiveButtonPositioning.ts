'use client';

import { useState, useEffect } from 'react';

interface ButtonPositions {
  chatToggle: {
    bottom: string;
    right: string;
    transform?: string;
    visible: boolean; // Nueva propiedad para controlar visibilidad
  };
  scrollToBottom: {
    bottom: string;
    right: string;
    transform?: string;
  };
}

export function useResponsiveButtonPositioning(isChatOpen: boolean) {
  const [positions, setPositions] = useState<ButtonPositions>({
    chatToggle: { bottom: '1.5rem', right: '1.5rem', visible: true },
    scrollToBottom: { bottom: '6rem', right: '1.5rem' }
  });
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    const updatePositions = () => {
      const width = window.innerWidth;
      
      let newScreenSize: 'mobile' | 'tablet' | 'desktop';
      if (width < 640) newScreenSize = 'mobile';
      else if (width < 1100) newScreenSize = 'tablet';
      else newScreenSize = 'desktop';
      
      setScreenSize(newScreenSize);
      
      // En responsive (mobile/tablet), ocultar el botón cuando el chat está abierto
      const shouldHideToggle = isChatOpen && (newScreenSize === 'mobile' || newScreenSize === 'tablet');
      
      if (isChatOpen) {
        // Cuando el chat está abierto
        if (newScreenSize === 'mobile') {
          setPositions({
            chatToggle: { 
              bottom: '1rem', 
              right: '1rem',
              transform: 'scale(0.9)',
              visible: false // Ocultar en mobile cuando está abierto
            },
            scrollToBottom: { 
              bottom: '5rem', 
              right: '1rem' 
            }
          });
        } else if (newScreenSize === 'tablet') {
          setPositions({
            chatToggle: { 
              bottom: '1.25rem', 
              right: '1.25rem',
              visible: false // Ocultar en tablet cuando está abierto
            },
            scrollToBottom: { 
              bottom: '5.5rem', 
              right: '1.25rem' 
            }
          });
        } else {
          // Desktop - mantener visible
          setPositions({
            chatToggle: { 
              bottom: '1.5rem', 
              right: '1.5rem',
              visible: true
            },
            scrollToBottom: { 
              bottom: '6rem', 
              right: '1.5rem' 
            }
          });
        }
      } else {
        // Cuando el chat está cerrado - siempre visible
        if (newScreenSize === 'mobile') {
          setPositions({
            chatToggle: { 
              bottom: '1rem', 
              right: '1rem',
              transform: 'scale(0.95)',
              visible: true
            },
            scrollToBottom: { 
              bottom: '6rem', 
              right: '1rem' 
            }
          });
        } else {
          setPositions({
            chatToggle: { 
              bottom: '1.5rem', 
              right: '1.5rem',
              visible: true
            },
            scrollToBottom: { 
              bottom: '6rem', 
              right: '1.5rem' 
            }
          });
        }
      }
    };

    updatePositions();
    window.addEventListener('resize', updatePositions);
    return () => window.removeEventListener('resize', updatePositions);
  }, [isChatOpen]);

  return { positions, screenSize };
}