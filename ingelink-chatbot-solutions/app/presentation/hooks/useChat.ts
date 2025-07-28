'use client';

import { useState, useCallback, useEffect } from 'react';
import { Message, ChatApiRequestBody } from '@/app/domain/entities/message.entity';
import Pusher from 'pusher-js';

// Define the type for the data received from Pusher
type PusherMessageData = {
  role?: 'user' | 'model';
  parts?: [{ text: string }];
  reply?: string;
  response?: string; // Para el nuevo formato de n8n
};

export const useChat = () => {
  const [history, setHistory] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [engine, setEngine] = useState<'n8n' | 'langchain'>('n8n'); // <-- Nuevo estado para el motor

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
      } else if (data.response) {
        // Convert from new n8n format
        message = {
          role: 'model' as const,
          parts: [{ text: data.response }]
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

    const updatedHistory = [...history, newUserMessage];
    setHistory(updatedHistory);
    setIsLoading(true);

    try {
      const requestBody: ChatApiRequestBody = {
        engine: engine,
        query: messageText,
        history: history, // Enviamos el historial *antes* del nuevo mensaje
      };

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }

      // Si el motor es LangChain, la respuesta viene directamente en el HTTP
      if (engine === 'langchain') {
        const data = await response.json();
        const aiMessage: Message = {
          role: 'model',
          parts: [{ text: data.reply }],
        };
        setHistory(prevHistory => [...prevHistory, aiMessage]);
        setIsLoading(false);
      }
      // Si el motor es n8n, la respuesta llegará por Pusher, así que no hacemos nada aquí.

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
    engine,    // <-- Exportamos el estado y el setter
    setEngine, // <-- para que puedas crear un botón en la UI
  };
};