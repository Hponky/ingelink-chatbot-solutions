'use client';

import { useState, useCallback, useEffect } from 'react';
import { Message } from '@/app/domain/entities/message.entity';
import Pusher from 'pusher-js';

// Define the type for the data received from Pusher
type PusherMessageData = {
  role?: 'user' | 'model';
  parts?: [{ text: string }];
  reply?: string;
};

export const useChat = () => {
  const [history, setHistory] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initial welcome message
    setHistory([
      {
        role: 'model',
        parts: [{ text: '¡Hola! Soy IngeLink AI. ¿Cómo puedo ayudarte hoy?' }],
      },
    ]);

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channel = pusher.subscribe('chat-channel');

    channel.bind('new-message', (data: PusherMessageData) => {
      // Handle the message properly based on the format received
      let message: Message;
      if (data.role && data.parts) {
        // Already in correct format
        message = data as Message;
      } else if (data.reply) {
        // Convert from old format
        message = {
          role: 'model' as const,
          parts: [{ text: data.reply }]
        };
      } else {
        console.error('Received message in unexpected format:', data);
        return;
      }
      
      setHistory(prevHistory => [...prevHistory, message]);
      setIsLoading(false);
    });

    return () => {
      pusher.unsubscribe('chat-channel');
    };
  }, []);

  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;

    const newUserMessage: Message = {
      role: 'user',
      parts: [{ text: messageText }],
    };

    // Añade el nuevo mensaje del usuario al historial para actualizar la UI inmediatamente
    const updatedHistory = [...history, newUserMessage];
    setHistory(updatedHistory);
    setIsLoading(true);

    // ¡AQUÍ ESTÁ LA MAGIA!
    // Llama a tu webhook de n8n enviando el historial completo
    try {
      const response = await fetch('/api/chat', { // Apunta a tu API de Next.js
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // La API de Next.js reenviará esto a n8n
          contents: updatedHistory 
        }),
      });

      if (!response.ok) {
          throw new Error('Error en la respuesta del servidor');
      }

      // The response will be received via Pusher, so we don't need to do anything here

    } catch (error) {
      console.error("Error contacting the chatbot:", error);
      const errorMessage: Message = {
          role: 'model',
          parts: [{ text: 'Lo siento, estoy teniendo problemas para conectarme. Por favor, intenta de nuevo más tarde.' }] 
      };
      setHistory(prevHistory => [...prevHistory, errorMessage]);
      setIsLoading(false);
    }
  };
  
  const clearChat = useCallback(() => {
    setHistory([
      {
        role: 'model',
        parts: [{ text: '¡Hola! Soy IngeLink AI. ¿Cómo puedo ayudarte hoy?' }],
      },
    ]);
    setIsLoading(false);
  }, []);

  return {
    history,
    isLoading,
    handleSendMessage,
    clearChat,
  };
};