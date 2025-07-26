import { IChatRepository } from '@/app/domain/repositories/chat.repository';
import { Message } from '@/app/domain/entities/message.entity';

export class MockChatService implements IChatRepository {
  private responses = [
    {
      keywords: ['hola', 'hello', 'hi', 'buenos días', 'buenas tardes', 'buenas noches'],
      responses: [
        '¡Hola! 👋 Es un placer saludarte. ¿En qué puedo ayudarte hoy?',
        '¡Qué tal! 😊 Estoy aquí para asistirte con lo que necesites.',
        '¡Hola! Espero que tengas un excelente día. ¿Cómo puedo ser de ayuda?',
      ]
    },
    {
      keywords: ['gracias', 'thank you', 'thanks', 'te agradezco'],
      responses: [
        '¡De nada! 😊 Siempre es un placer ayudarte.',
        '¡No hay de qué! Estoy aquí para eso. ¿Algo más en lo que pueda asistirte?',
        '¡Con mucho gusto! Me alegra poder ser de ayuda.',
      ]
    },
    {
      keywords: ['adiós', 'bye', 'hasta luego', 'nos vemos', 'chao'],
      responses: [
        '¡Hasta luego! 👋 Que tengas un día fantástico.',
        '¡Nos vemos! Siempre estaré aquí cuando me necesites.',
        '¡Adiós! Espero verte pronto por aquí. 😊',
      ]
    },
    {
      keywords: ['ayuda', 'help', 'no entiendo', 'confused'],
      responses: [
        '¡Por supuesto! Estoy aquí para ayudarte. ¿Podrías ser más específico sobre lo que necesitas?',
        'No te preocupes, estoy aquí para asistirte. ¿En qué área específica necesitas ayuda?',
        'Claro, me encanta ayudar. ¿Podrías contarme más detalles sobre tu consulta?',
      ]
    },
    {
      keywords: ['programación', 'código', 'programming', 'code', 'desarrollo'],
      responses: [
        '¡Excelente! Me encanta hablar sobre programación. ¿En qué lenguaje o tecnología estás trabajando?',
        'La programación es fascinante. ¿Tienes algún proyecto específico en mente o algún problema que resolver?',
        '¡Genial! Puedo ayudarte con conceptos de programación, debugging, arquitectura y más. ¿Qué necesitas?',
      ]
    },
    {
      keywords: ['react', 'javascript', 'typescript', 'nextjs', 'frontend'],
      responses: [
        '¡React es increíble! Es una de mis tecnologías favoritas. ¿Estás trabajando en algún componente específico?',
        'JavaScript/TypeScript son herramientas muy poderosas. ¿Hay algún concepto o problema específico que te gustaría discutir?',
        'Next.js es una excelente elección para desarrollo frontend. ¿Necesitas ayuda con routing, SSR, o alguna otra característica?',
      ]
    }
  ];

  private getRandomResponse(responses: string[]): string {
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private findMatchingResponse(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    for (const category of this.responses) {
      for (const keyword of category.keywords) {
        if (lowerMessage.includes(keyword)) {
          return this.getRandomResponse(category.responses);
        }
      }
    }

    // Respuestas por defecto más inteligentes
    const defaultResponses = [
      `Interesante pregunta sobre "${message}". Aunque soy un asistente de demostración, puedo ayudarte a explorar este tema. ¿Podrías darme más contexto?`,
      `Me parece muy relevante lo que mencionas. Aunque mis capacidades son limitadas en esta demo, estaré encantado de discutir "${message}" contigo.`,
      `"${message}" es un tema que definitivamente vale la pena explorar. ¿Hay algún aspecto específico que te interese más?`,
      `Gracias por compartir eso sobre "${message}". Me gustaría entender mejor tu perspectiva. ¿Podrías elaborar un poco más?`,
      `Es fascinante lo que mencionas. Aunque soy una demostración, me encanta cuando las conversaciones toman direcciones interesantes como "${message}".`
    ];

    return this.getRandomResponse(defaultResponses);
  }

  async sendMessage(message: string): Promise<Message> {
    // Simular latencia de red variable (1-3 segundos)
    const delay = Math.random() * 2000 + 1000;
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const responseText = this.findMatchingResponse(message);
        
        const response: Message = {
          id: crypto.randomUUID(),
          text: responseText,
          sender: 'assistant',
          timestamp: new Date(),
        };
        resolve(response);
      }, delay);
    });
  }
}