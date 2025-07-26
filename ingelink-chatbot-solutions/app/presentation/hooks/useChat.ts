'use client';

import { useState, useCallback, useRef } from 'react';
import { Message } from '@/app/domain/entities/message.entity';
import { SendMessageUseCase } from '@/app/application/use-cases/sendMessage.use-case';
import { MockChatService } from '@/app/infrastructure/services/mockChat.service';

const chatService = new MockChatService();
const sendMessageUseCase = new SendMessageUseCase(chatService);

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '¡Hola! 👋 Soy tu asistente virtual inteligente. Estoy aquí para ayudarte con cualquier pregunta o tarea que tengas. ¿En qué puedo asistirte hoy?',
      sender: 'assistant',
      timestamp: new Date(),
    },
    {
      id: '2',
      text: 'Hola, me gustaría probar el scroll personalizado',
      sender: 'user',
      timestamp: new Date(),
    },
    {
      id: '3',
      text: '¡Perfecto! 🎨 He implementado un sistema de scroll completamente personalizado con las siguientes características:\n\n✨ **Scrollbar con gradientes**: Colores indigo y purple que se integran con el diseño\n🎯 **Efectos hover**: El scrollbar se ilumina y escala al pasar el mouse\n📊 **Indicador de progreso**: Muestra tu posición en la conversación\n🔄 **Scroll suave**: Transiciones fluidas y naturales\n\nPuedes probarlo escribiendo más mensajes para generar contenido que active el scroll. ¿Te gustaría que añada más mensajes de demostración?',
      sender: 'assistant',
      timestamp: new Date(),
    },
    {
      id: '4',
      text: 'Sí, añade más contenido para probar el scroll',
      sender: 'user',
      timestamp: new Date(),
    },
    {
      id: '5',
      text: '¡Excelente! 🚀 Aquí tienes más contenido para probar todas las funcionalidades del scroll:\n\n**Características del Scroll Personalizado:**\n\n1. **Diseño Visual Moderno**\n   - Gradientes dinámicos en tonos indigo-purple\n   - Bordes redondeados y sombras suaves\n   - Transparencias que se integran con el fondo\n\n2. **Interactividad Avanzada**\n   - Efectos hover con escalado y brillo\n   - Transiciones suaves con cubic-bezier\n   - Feedback visual inmediato\n\n3. **Funcionalidad Inteligente**\n   - Auto-scroll a nuevos mensajes\n   - Botón flotante "Ir al final"\n   - Indicadores de posición en tiempo real\n\n4. **Compatibilidad Cross-Browser**\n   - Soporte para WebKit (Chrome, Safari, Edge)\n   - Fallback para Firefox\n   - Estilos consistentes en todos los navegadores',
      sender: 'assistant',
      timestamp: new Date(),
    },
    {
      id: '6',
      text: '¿Cómo funciona el indicador de progreso?',
      sender: 'user',
      timestamp: new Date(),
    },
    {
      id: '7',
      text: '📊 **El Indicador de Progreso** es una característica muy elegante:\n\n**Ubicación**: Se encuentra en el lado derecho de la pantalla\n**Apariencia**: Una barra vertical con gradiente que refleja tu posición\n**Comportamiento**:\n- Aparece automáticamente cuando hay contenido suficiente para hacer scroll\n- Se actualiza en tiempo real mientras navegas\n- Desaparece cuando no es necesario\n\n**Detalles Técnicos**:\n- Usa CSS variables para actualización dinámica\n- Cálculo basado en `scrollTop / scrollHeight`\n- Transiciones suaves de 0.1s para fluidez\n- Z-index alto para mantenerse visible\n\n¡Prueba hacer scroll hacia arriba y abajo para verlo en acción! 🎯',
      sender: 'assistant',
      timestamp: new Date(),
    },
    {
      id: '8',
      text: 'Impresionante. ¿Y el botón flotante?',
      sender: 'user',
      timestamp: new Date(),
    },
    {
      id: '9',
      text: '🎯 **El Botón Flotante "Ir al Final"** es súper inteligente:\n\n**Cuándo Aparece**:\n- Solo cuando no estás en la parte inferior del chat\n- Requiere contenido suficiente (más de 200px de scroll)\n- Se oculta automáticamente al llegar al final\n\n**Diseño**:\n- Botón circular con gradiente indigo-purple\n- Icono de flecha hacia abajo\n- Sombras y efectos hover elegantes\n- Posición fija en la esquina inferior derecha\n\n**Funcionalidad**:\n- Scroll suave al hacer clic\n- Se oculta automáticamente después del scroll\n- Tooltip informativo\n- Animación de entrada fadeIn\n\n**Ubicación**: Esquina inferior derecha, sobre el área de input\n\n¡Es perfecto para conversaciones largas! 🚀',
      sender: 'assistant',
      timestamp: new Date(),
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [typingMessage, setTypingMessage] = useState<string>('');
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    // Cancelar cualquier solicitud anterior
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Crear nuevo AbortController
    abortControllerRef.current = new AbortController();

    const userMessage: Message = {
      id: crypto.randomUUID(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsLoading(true);
    setTypingMessage('');

    try {
      // Simular efecto de escritura
      const responses = [
        'Entendido, déjame procesar tu solicitud...',
        'Analizando la información...',
        'Preparando una respuesta detallada...',
        'Casi listo...'
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setTypingMessage(randomResponse);

      const aiResponse = await sendMessageUseCase.execute(text);
      
      // Verificar si la operación fue cancelada
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }

      setTypingMessage('');
      setMessages((prevMessages) => [...prevMessages, aiResponse]);
    } catch (error) {
      // Verificar si la operación fue cancelada
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }

      console.error('Error sending message:', error);
      setTypingMessage('');
      
      const errorResponse: Message = {
        id: crypto.randomUUID(),
        text: '😔 Oops, parece que hubo un problema técnico. Por favor, inténtalo de nuevo en unos momentos. Si el problema persiste, verifica tu conexión a internet.',
        sender: 'assistant',
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, errorResponse]);
    } finally {
      setIsLoading(false);
      setTypingMessage('');
    }
  }, [isLoading]);

  const clearChat = useCallback(() => {
    setMessages([
      {
        id: 'welcome-message',
        text: '¡Hola! 👋 Soy tu asistente virtual inteligente. Estoy aquí para ayudarte con cualquier pregunta o tarea que tengas. ¿En qué puedo asistirte hoy?',
        sender: 'assistant',
        timestamp: new Date(),
      },
    ]);
    setIsLoading(false);
    setTypingMessage('');
  }, []);

  return {
    messages,
    isLoading,
    typingMessage,
    handleSendMessage,
    clearChat,
  };
};