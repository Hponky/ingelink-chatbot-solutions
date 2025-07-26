'use client';

import { Message } from '@/app/domain/entities/message.entity';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser 
            ? 'bg-gradient-to-r from-indigo-500 to-purple-600' 
            : 'bg-gradient-to-r from-cyan-500 to-blue-600'
        }`}>
          {isUser ? (
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          )}
        </div>

        {/* Message bubble */}
        <div className={`relative px-4 py-3 rounded-2xl shadow-lg hover-lift transition-all duration-200 ${
          isUser
            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-md'
            : 'glass text-slate-100 rounded-bl-md border border-slate-700/50'
        }`}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.parts[0].text}</p>
          


          {/* Message tail */}
          <div className={`absolute top-4 w-3 h-3 transform rotate-45 ${
            isUser
              ? 'right-0 translate-x-1 bg-gradient-to-r from-indigo-600 to-purple-600'
              : 'left-0 -translate-x-1 bg-slate-800/80 border-l border-b border-slate-700/50'
          }`} />
        </div>
      </div>
    </div>
  );
}