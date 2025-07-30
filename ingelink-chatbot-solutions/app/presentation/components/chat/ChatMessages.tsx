import { Message } from '../../../domain/entities/message.entity';
import { ChatMessage } from './ChatMessage';
import { useEffect, useRef, useState, RefObject } from 'react';
import { useResponsiveButtonPositioning } from '@/hooks/useResponsiveButtonPositioning';

interface ChatMessagesProps {
  messages: Message[];
  isLoading?: boolean;
  hasSuggestedQuestions?: boolean;
  suggestedQuestionsRef?: RefObject<HTMLDivElement | null>;
}

export function ChatMessages({ 
  messages, 
  isLoading, 
  hasSuggestedQuestions = false, 
  suggestedQuestionsRef 
}: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [containerHeight, setContainerHeight] = useState('calc(100vh - 220px)');
  const [scrollIndicatorStyle, setScrollIndicatorStyle] = useState({
    top: '6rem',
    height: 'calc(100vh - 12rem)'
  });

  // Calcular altura dinámica basada en si hay preguntas sugeridas
  useEffect(() => {
    const calculateHeight = () => {
      const headerHeight = 80; // Assuming a fixed header height of 80px
      let availableHeight;
      let scrollIndicatorHeight;

      if (hasSuggestedQuestions && suggestedQuestionsRef?.current) {
        const rect = suggestedQuestionsRef.current.getBoundingClientRect();
        const suggestedQuestionsTop = rect.top;
        availableHeight = suggestedQuestionsTop - headerHeight;
        scrollIndicatorHeight = availableHeight;
      } else {
        const inputHeight = 100;
        const padding = 20;
        availableHeight = window.innerHeight - headerHeight - inputHeight - padding;
        scrollIndicatorHeight = availableHeight;
      }

      const finalHeight = Math.max(availableHeight, 400);
      setContainerHeight(`${finalHeight}px`);

      setScrollIndicatorStyle({
        top: `${headerHeight}px`, // Starts right after the header
        height: `${scrollIndicatorHeight}px`
      });
    };

    calculateHeight();
    window.addEventListener('resize', calculateHeight);
    
    // Observar cambios en el DOM para recalcular cuando aparezca/desaparezca el FAQ
    let observer: MutationObserver | null = null;
    if (suggestedQuestionsRef?.current) {
      observer = new MutationObserver(calculateHeight);
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class']
      });
    }
    
    return () => {
      window.removeEventListener('resize', calculateHeight);
      observer?.disconnect();
    };
  }, [hasSuggestedQuestions, suggestedQuestionsRef]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToBottom = () => {
    scrollToBottom();
    setShowScrollToBottom(false);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const totalScrollable = scrollHeight - clientHeight;
      
      if (totalScrollable > 0) {
        const progress = Math.min((scrollTop / totalScrollable) * 100, 100);
        setScrollProgress(progress);
        setShowScrollIndicator(totalScrollable > 50);
        
        // Show scroll to bottom button if not at bottom
        const isNearBottom = scrollTop >= totalScrollable - 100;
        setShowScrollToBottom(!isNearBottom && totalScrollable > 200);
      } else {
        setShowScrollIndicator(false);
        setShowScrollToBottom(false);
      }
    };

    container.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => container.removeEventListener('scroll', handleScroll);
  }, [messages]);

  const { positions } = useResponsiveButtonPositioning(true); // Chat siempre abierto aquí

  return (
    <div className="flex-1 relative">
      {/* Scroll fade effects */}
      <div className="scroll-fade-top" />
      <div className="scroll-fade-bottom" />
      
      {/* Scroll indicator con posición dinámica */}
      <div 
        className={`scroll-indicator-dynamic ${showScrollIndicator ? 'visible' : ''}`}
        style={{ 
          '--scroll-progress': `${scrollProgress}%`,
          top: scrollIndicatorStyle.top,
          height: scrollIndicatorStyle.height
        } as React.CSSProperties}
      />
       
       {/* Scroll to bottom button - Posición dinámica */}
       {showScrollToBottom && (
         <button
           onClick={handleScrollToBottom}
           className="fixed w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover-lift z-30 flex items-center justify-center animate-fadeIn"
           style={{
             bottom: positions.scrollToBottom.bottom,
             right: positions.scrollToBottom.right
           }}
           title="Ir al final"
         >
           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
           </svg>
         </button>
       )}
      
      <div 
        ref={scrollContainerRef}
        className={`absolute sm:top-4 md:top-4 lg:top-0 left-0 right-0 overflow-y-auto space-y-4 scroll-container ${
          hasSuggestedQuestions ? 'pt-6 px-6 pb-8' : 'pt-6 px-6'
        }`}
        style={{ 
          height: containerHeight
          // minHeight: '400px' // <--- Eliminado para evitar el desbordamiento
        }}
      >
        <div className="max-w-4xl mx-auto space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`animate-fade-in ${
              msg.role === 'user' ? 'animate-slide-in-right' : 'animate-slide-in-left'
            }`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <ChatMessage message={msg} />
          </div>
        ))}
        
        {/* Typing indicator */}
        {isLoading && (
          <div className="flex items-start space-x-3 animate-fadeIn">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <div className="flex-1 max-w-xs lg:max-w-md">
              <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl rounded-bl-md p-4 glass-morphism">
                {
                  <div className="flex items-center space-x-1">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-xs text-slate-400 ml-2">Escribiendo...</span>
                  </div>
                }
              </div>
            </div>
          </div>
        )}
      </div>
         <div ref={messagesEndRef} className="h-4" />
       </div>
     </div>
   );
}
