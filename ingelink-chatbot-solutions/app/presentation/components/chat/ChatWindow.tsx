'use client';

import { useChatWithDemo } from '../../hooks/useChatWithDemo';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useRef, useState } from 'react';

interface ChatWindowProps {
  onClose?: () => void;
  demoMode?: boolean;
}

export function ChatWindow({ onClose, demoMode = false }: ChatWindowProps) {
  const { history, isLoading, handleSendMessage, clearChat, suggestedQuestions, handleQuestionSelect, isDemoMode } = useChatWithDemo(demoMode);
  const isMobile = useMediaQuery('(max-width: 640px)');
  const isTablet = useMediaQuery('(max-width: 1100px)');
  const isVerySmall = useMediaQuery('(max-width: 470px)');
  const isResponsive = isMobile || isTablet;
  const suggestedQuestionsRef = useRef<HTMLDivElement>(null);
  
  // Estado para controlar la visibilidad de las preguntas sugeridas
  const [isSuggestedQuestionsVisible, setIsSuggestedQuestionsVisible] = useState(true);

  // Función para alternar la visibilidad
  const toggleSuggestedQuestions = () => {
    setIsSuggestedQuestionsVisible(!isSuggestedQuestionsVisible);
  };

  // Función para manejar el clic en preguntas sugeridas
  const handleQuestionClick = (question: string) => {
    handleSendMessage(question);
    handleQuestionSelect(question);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-50 animate-fade-in">
      {/* Header with demo indicator - Reverted to fixed positioning */}
      <header className={`fixed top-0 left-0 right-0 z-50 glass border-b border-slate-700/50 backdrop-blur-xl ${
        isVerySmall ? 'p-3' : 'p-4'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-lg flex items-center justify-center ${
              isVerySmall ? 'w-6 h-6' : 'w-8 h-8'
            }`}>
              <svg className={`text-white ${
                isVerySmall ? 'w-4 h-4' : 'w-5 h-5'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <h1 className={`font-bold gradient-text ${
                isVerySmall ? 'text-lg' : 'text-2xl'
              }`}>
                {isDemoMode ? 'Demo - Humberto Agudelo' : 'IngeLink ChatBot'}
              </h1>
              {!isVerySmall && (
                <p className="text-slate-400 text-sm">
                  {isDemoMode ? 'Asistente de CV - Desarrollador Full-Stack' : 'Asistente IA'}
                </p>
              )}
            </div>
          </div>
          
          {/* Header actions */}
          <div className="flex items-center space-x-2">
            {isDemoMode && (
              <span className="px-2 py-1 bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-xs rounded-full font-medium">
                DEMO
              </span>
            )}
            
            <button
              onClick={clearChat}
              className={`flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-lg transition-all duration-200 hover-lift ${
                isVerySmall ? 'w-6 h-6' : 'w-8 h-8'
              }`}
              title="Limpiar conversación"
            >
              <svg className={isVerySmall ? 'w-4 h-4' : 'w-5 h-5'} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
            
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                isLoading ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'
              }`} title={isLoading ? 'Procesando...' : 'En línea'} />
              {!isVerySmall && (
                <span className="text-xs text-slate-400">
                  {isLoading ? 'Procesando...' : 'En línea'}
                </span>
              )}
            </div>
            
            {isResponsive && onClose && (
              <button
                onClick={onClose}
                className={`flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200 hover-lift ml-2 ${
                  isVerySmall ? 'w-6 h-6' : 'w-8 h-8'
                }`}
                title="Cerrar chat"
              >
                <svg className={isVerySmall ? 'w-4 h-4' : 'w-5 h-5'} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Messages area - Adjusted padding to account for fixed header */}
      <div className="flex-1 relative overflow-hidden pt-20"> {/* pt-20 ensures content starts below the header */}
        <ChatMessages 
          messages={history} 
          isLoading={isLoading} 
          hasSuggestedQuestions={isDemoMode && suggestedQuestions.length > 0 && isSuggestedQuestionsVisible}
          suggestedQuestionsRef={suggestedQuestionsRef}
        />
        
        {/* Botón flotante para mostrar preguntas cuando están ocultas - Versión sobria */}
        {isDemoMode && suggestedQuestions.length > 0 && !isSuggestedQuestionsVisible && (
          <button
            onClick={toggleSuggestedQuestions}
            className="absolute bottom-4 right-7 z-10 w-10 h-10 bg-slate-700/80 hover:bg-slate-600/90 backdrop-blur-sm border border-slate-600/50 hover:border-slate-500/70 text-slate-300 hover:text-slate-100 rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 flex items-center justify-center group"
            title="Mostrar preguntas sugeridas"
          >
            <svg 
              className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              strokeWidth={1.5}
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zM12 18h.01" 
              />
            </svg>
          </button>
        )}
      </div>

      {/* Input area */}
      <div className="border-t border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
        {/* Suggested questions for demo mode */}
        {isDemoMode && suggestedQuestions.length > 0 && isSuggestedQuestionsVisible && (
          <div ref={suggestedQuestionsRef} className="px-4 pt-4 pb-2">
            <div className="bg-slate-800/95 backdrop-blur-md rounded-lg p-4 border border-slate-700/50 shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-slate-300">Preguntas sugeridas:</h3>
                <button
                  onClick={toggleSuggestedQuestions}
                  className="text-slate-400 hover:text-slate-200 transition-colors duration-200 p-1 hover:bg-slate-700/50 rounded"
                  title={isSuggestedQuestionsVisible ? 'Ocultar preguntas' : 'Mostrar preguntas'}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.slice(0, 3).map((question, index) => (
                  <button
                    key={`${question}-${index}`}
                    onClick={() => handleQuestionClick(question)}
                    className="text-xs bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white px-3 py-1 rounded-full transition-all duration-200 border border-slate-600/50 hover:border-slate-500"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}
