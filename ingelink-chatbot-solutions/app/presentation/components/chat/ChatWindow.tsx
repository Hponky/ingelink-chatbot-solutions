'use client';

import { useChat } from '@/app/presentation/hooks/useChat';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';

export function ChatWindow() {
  const { history, isLoading, handleSendMessage, clearChat } = useChat();

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-50 animate-fade-in">
      {/* Header with glass morphism effect */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-slate-700/50 p-6 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">
                IngeLink ChatBot
              </h1>
              <p className="text-slate-400 text-sm">
                Asistente inteligente para tus consultas
              </p>
            </div>
          </div>
          
          {/* Header actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={clearChat}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-lg transition-all duration-200 hover-lift"
              title="Limpiar conversación"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
            <div className={`w-2 h-2 rounded-full ${
              isLoading ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'
            }`} title={isLoading ? 'Procesando...' : 'En línea'} />
          </div>
        </div>
      </header>

      {/* Messages area */}
      <div className="flex-1 relative overflow-hidden pt-32">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/20 to-transparent pointer-events-none" />
        <ChatMessages messages={history} isLoading={isLoading} />
      </div>

      {/* Input area */}
      <div className="border-t border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}