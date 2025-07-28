import { Message } from '@/app/domain/entities/message.entity';
import { ChatMessage } from './ChatMessage';
import { useEffect, useRef, useState } from 'react';

interface ChatMessagesProps {
  messages: Message[];
  isLoading?: boolean;
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

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
        const progress = (scrollTop / totalScrollable) * 100;
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

  return (
    <div className="flex-1 relative">
      {/* Scroll fade effects */}
      <div className="scroll-fade-top" />
      <div className="scroll-fade-bottom" />
      
      {/* Scroll indicator */}
       <div 
         className={`scroll-indicator ${showScrollIndicator ? 'visible' : ''}`}
         style={{ '--scroll-progress': `${scrollProgress}%` } as React.CSSProperties}
       />
       
       {/* Scroll to bottom button */}
       {showScrollToBottom && (
         <button
           onClick={handleScrollToBottom}
           className="fixed bottom-24 right-6 w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover-lift z-30 flex items-center justify-center animate-fadeIn"
           title="Ir al final"
         >
           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
           </svg>
         </button>
       )}
      
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-6 space-y-4 scroll-container"
        style={{ height: 'calc(100vh - 220px)', minHeight: '500px' }}
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