'use client';

import { useState, useCallback, useEffect } from 'react';
import Pusher from 'pusher-js';
import { ChatApiRequestBody, Message } from '@/domain/entities/message.entity';

type PusherMessageData = {
  role?: 'user' | 'model';
  parts?: [{ text: string }];
  reply?: string;
  response?: string;
};

const DEMO_CONVERSATION: Message[] = [
  {
    role: 'model',
    parts: [{ text: '¡Hola! Soy el asistente de Humberto Agudelo, Ingeniero de Sistemas y Desarrollador Full-Stack. Estoy aquí para responder preguntas sobre su experiencia profesional. ¿Qué te gustaría saber?' }],
  },
  {
    role: 'user',
    parts: [{ text: '¿Cuál es la experiencia laboral de Humberto?' }],
  },
  {
    role: 'model',
    parts: [{ text: 'Humberto tiene más de 4 años de experiencia como desarrollador full-stack:\n\n🏢 **APICREATE S.A.S** (Jul 2023 - Actualidad)\n• Desarrollador de Software I\n• Mejoró la eficiencia operativa en un 15%\n• Implementó soluciones personalizadas para gestión de proyectos\n\n🏢 **NEWSHORE** (Dic 2022 - Jul 2023)\n• Desarrollo Full-stack\n• Trabajo en equipos multifuncionales\n• Refactorización de código para mejor rendimiento\n\n🏢 **Universidad de Caldas** (Ago 2021 - Dic 2022)\n• Lideró desarrollo de plataforma de evaluación académica\n• Colaboración directa con stakeholders' }],
  },
  {
    role: 'user',
    parts: [{ text: '¿Qué tecnologías maneja?' }],
  },
  {
    role: 'model',
    parts: [{ text: 'Humberto tiene un stack tecnológico muy completo:\n\n**Frontend:**\n• HTML, CSS, JavaScript, TypeScript\n• React.js/Next.js\n• Angular\n\n**Backend:**\n• Node.js\n• SpringBoot\n\n**Bases de Datos:**\n• SQL\n• NoSQL\n\n**Otros:**\n• Inglés B2\n• Arquitectura de software\n• Metodologías ágiles (SCRUM)\n\n¿Te interesa alguna tecnología en particular?' }],
  },
  {
    role: 'user',
    parts: [{ text: '¿Cuáles son sus principales fortalezas?' }],
  },
  {
    role: 'model',
    parts: [{ text: 'Las principales fortalezas de Humberto incluyen:\n\n**Habilidades Técnicas:**\n• Desarrollo full-stack con enfoque en calidad\n• Arquitectura de software escalable\n• Optimización de rendimiento\n\n**Habilidades Blandas:**\n• Liderazgo y trabajo en equipo\n• Espíritu creativo y versátil al cambio\n• Colaborativo y carismático\n• Proactivo y responsable\n• Trabajo con planeación\n\n**Diferenciadores:**\n• Bilingüe (Inglés B2)\n• Experiencia en múltiples industrias\n• Enfoque en aprendizaje continuo\n• Capacidad de trabajar con stakeholders' }],
  }
];

const SUGGESTED_QUESTIONS = [
  // Experiencia técnica y tecnologías
  '¿Puede contarme sobre su experiencia con React y Next.js?',
  '¿Qué tecnologías de backend maneja y cuál prefiere?',
  '¿Tiene experiencia con bases de datos SQL y NoSQL?',
  '¿Cómo es su experiencia con TypeScript y JavaScript?',
  '¿Ha trabajado con arquitectura de microservicios?',
  '¿Qué herramientas de testing utiliza en sus proyectos?',
  
  // Experiencia profesional y logros
  '¿Cómo maneja los proyectos en equipo?',
  '¿Cuál ha sido su mayor logro profesional?',
  '¿Puede describir un proyecto desafiante que haya completado?',
  '¿Cómo mejoró la eficiencia operativa en un 15% en APICREATE?',
  '¿Qué tipo de soluciones personalizadas ha desarrollado?',
  
  // Metodologías y procesos
  '¿Qué metodologías de desarrollo utiliza?',
  '¿Cómo aplica SCRUM en sus proyectos?',
  '¿Cuál es su proceso para el control de calidad del código?',
  '¿Cómo maneja la documentación técnica?',
  
  // Habilidades blandas y liderazgo
  '¿Cómo describe su estilo de liderazgo?',
  '¿Cómo maneja la comunicación con stakeholders?',
  '¿Qué estrategias usa para resolver conflictos en el equipo?',
  '¿Cómo se adapta a los cambios en los requerimientos?',
  
  // Disponibilidad y objetivos
  '¿Está disponible para nuevas oportunidades?',
  '¿Qué tipo de proyectos le interesan más?',
  '¿Cuáles son sus objetivos profesionales a corto plazo?',
  '¿Está interesado en roles de liderazgo técnico?',
  '¿Prefiere trabajo remoto, presencial o híbrido?',
  
  // Aprendizaje y crecimiento
  '¿Cómo se mantiene actualizado con las nuevas tecnologías?',
  '¿Qué tecnologías le gustaría aprender próximamente?',
  '¿Ha participado en proyectos de código abierto?',
  '¿Cómo evalúa su nivel de inglés técnico?',
  
  // Específicas del perfil
  '¿Puede hablar sobre su experiencia en la Universidad de Caldas?',
  '¿Qué aprendió trabajando en NEWSHORE?',
  '¿Cómo fue la transición de estudiante a desarrollador profesional?',
  '¿Qué lo motiva como desarrollador full-stack?'
];

export const useChatWithDemo = (isDemoMode: boolean = false) => {
  const [history, setHistory] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [engine, setEngine] = useState<'n8n' | 'langchain'>('n8n');
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [usedQuestions, setUsedQuestions] = useState<Set<string>>(new Set());

  // Función para obtener preguntas aleatorias sin duplicados
  const getRandomQuestions = useCallback((count: number = 3, exclude: Set<string> = new Set()) => {
    const availableQuestions = SUGGESTED_QUESTIONS.filter(q => !exclude.has(q));
    
    if (availableQuestions.length < count) {
      // Si no hay suficientes preguntas disponibles, reiniciar el conjunto de usadas
      const freshQuestions = SUGGESTED_QUESTIONS.slice().sort(() => 0.5 - Math.random()).slice(0, count);
      return freshQuestions;
    }
    
    const shuffled = [...availableQuestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }, []);

  // Función para manejar la selección de una pregunta
  const handleQuestionSelect = useCallback((selectedQuestion: string) => {
    const newUsedQuestions = new Set(usedQuestions);
    newUsedQuestions.add(selectedQuestion);
    setUsedQuestions(newUsedQuestions);
    
    // Obtener nuevas preguntas excluyendo las ya usadas
    const remainingQuestions = suggestedQuestions.filter(q => q !== selectedQuestion);
    const newQuestions = getRandomQuestions(1, newUsedQuestions);
    
    if (newQuestions.length > 0 && !remainingQuestions.includes(newQuestions[0])) {
      setSuggestedQuestions([...remainingQuestions, ...newQuestions]);
    } else {
      setSuggestedQuestions(remainingQuestions);
    }
  }, [suggestedQuestions, usedQuestions, getRandomQuestions]);

  useEffect(() => {
    if (isDemoMode) {
      setHistory(DEMO_CONVERSATION);
      const initialQuestions = getRandomQuestions(3);
      setSuggestedQuestions(initialQuestions);
      setUsedQuestions(new Set(initialQuestions));
    } else {
      setHistory([
        {
          role: 'model',
          parts: [{ text: '¡Hola! Soy IngeLink AI. ¿Cómo puedo ayudarte hoy?' }],
        },
      ]);
      setSuggestedQuestions([]);
      setUsedQuestions(new Set());
    }

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channel = pusher.subscribe('chat-channel');

    channel.bind('new-message', (data: PusherMessageData) => {
      let message: Message;
      if (data.role && data.parts) {
        message = data as Message;
      } else if (data.reply) {
        message = {
          role: 'model' as const,
          parts: [{ text: data.reply }]
        };
      } else if (data.response) {
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
  }, [isDemoMode, getRandomQuestions]);

  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;

    const newUserMessage: Message = {
      role: 'user',
      parts: [{ text: messageText }],
    };

    const updatedHistory = [...history, newUserMessage];
    setHistory(updatedHistory);
    setIsLoading(true);

    // En modo demo, simular respuestas relacionadas con el CV
    if (isDemoMode) {
      setTimeout(() => {
        const demoResponse = generateDemoResponse(messageText);
        const aiMessage: Message = {
          role: 'model',
          parts: [{ text: demoResponse }],
        };
        setHistory(prevHistory => [...prevHistory, aiMessage]);
        setIsLoading(false);
      }, 1500);
      return;
    }

    try {
      const requestBody: ChatApiRequestBody = {
        engine: engine,
        query: messageText,
        history: history,
      };

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }

      if (engine === 'langchain') {
        const data = await response.json();
        const aiMessage: Message = {
          role: 'model',
          parts: [{ text: data.reply }],
        };
        setHistory(prevHistory => [...prevHistory, aiMessage]);
        setIsLoading(false);
      }
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
    if (isDemoMode) {
      setHistory(DEMO_CONVERSATION);
      const initialQuestions = getRandomQuestions(3);
      setSuggestedQuestions(initialQuestions);
      setUsedQuestions(new Set(initialQuestions));
    } else {
      setHistory([
        {
          role: 'model',
          parts: [{ text: '¡Hola! Soy IngeLink AI. ¿Cómo puedo ayudarte hoy?' }],
        },
      ]);
      setSuggestedQuestions([]);
      setUsedQuestions(new Set());
    }
    setIsLoading(false);
  }, [isDemoMode, getRandomQuestions]);

  return {
    history,
    isLoading,
    handleSendMessage,
    clearChat,
    engine,
    setEngine,
    suggestedQuestions,
    handleQuestionSelect,
    isDemoMode
  };
};

function generateDemoResponse(question: string): string {
  const lowerQuestion = question.toLowerCase();
  
  if (lowerQuestion.includes('react') || lowerQuestion.includes('next')) {
    return 'Humberto tiene sólida experiencia con React.js y Next.js. En APICREATE implementó soluciones personalizadas usando estas tecnologías, y en NEWSHORE trabajó en refactorización de código React para mejorar el rendimiento. Su enfoque se centra en componentes reutilizables y arquitectura escalable.';
  }
  
  if (lowerQuestion.includes('equipo') || lowerQuestion.includes('colabora')) {
    return 'Humberto destaca por su capacidad de trabajo en equipo. En NEWSHORE colaboró con equipos multifuncionales desde UX hasta infraestructura. Es carismático, colaborativo y tiene experiencia liderando proyectos como en la Universidad de Caldas donde gestionó stakeholders y equipos de desarrollo.';
  }
  
  if (lowerQuestion.includes('metodolog') || lowerQuestion.includes('scrum') || lowerQuestion.includes('ágil')) {
    return 'Humberto tiene experiencia con metodologías ágiles, específicamente SCRUM. En NEWSHORE trabajó en un marco de desarrollo ágil que permitió entregas eficientes y adaptación rápida a cambios. Su enfoque incluye planificación, colaboración continua y mejora iterativa.';
  }
  
  if (lowerQuestion.includes('logro') || lowerQuestion.includes('éxito')) {
    return 'Uno de sus mayores logros fue liderar el desarrollo de una plataforma de evaluación académica en la Universidad de Caldas que automatizó procesos y mejoró significativamente la eficiencia para profesores y directivos. También logró una mejora del 15% en eficiencia operativa en APICREATE.';
  }
  
  if (lowerQuestion.includes('disponib') || lowerQuestion.includes('oportunidad')) {
    return 'Humberto está comprometido con el aprendizaje continuo y siempre abierto a nuevas oportunidades que le permitan crecer profesionalmente. Su perfil muestra proactividad y adaptabilidad al cambio, características ideales para roles desafiantes.';
  }
  
  if (lowerQuestion.includes('proyecto') || lowerQuestion.includes('interesa')) {
    return 'Le interesan proyectos que involucren desarrollo full-stack con tecnologías modernas, especialmente aquellos que requieran arquitectura escalable y trabajo en equipo. Su experiencia abarca desde plataformas educativas hasta sistemas de gestión empresarial.';
  }
  
  if (lowerQuestion.includes('backend') || lowerQuestion.includes('servidor')) {
    return 'Humberto tiene sólida experiencia en backend con Node.js y SpringBoot. En APICREATE desarrolló APIs RESTful escalables y en NEWSHORE trabajó en arquitecturas de microservicios. Su enfoque incluye optimización de consultas, manejo de sesiones y implementación de middleware personalizado.';
  }
  
  if (lowerQuestion.includes('sql') || lowerQuestion.includes('nosql') || lowerQuestion.includes('base') || lowerQuestion.includes('datos')) {
    return 'Tiene experiencia tanto con bases de datos SQL como NoSQL. Ha trabajado con MySQL, PostgreSQL para datos relacionales y MongoDB para documentos. Su experiencia incluye diseño de esquemas, optimización de consultas y migración de datos.';
  }
  
  if (lowerQuestion.includes('typescript') || lowerQuestion.includes('javascript')) {
    return 'Humberto domina tanto JavaScript como TypeScript. Prefiere TypeScript para proyectos grandes por su tipado estático que reduce errores y mejora la mantenibilidad. Ha migrado proyectos legacy de JS a TS y implementado configuraciones avanzadas de ESLint y Prettier.';
  }
  
  if (lowerQuestion.includes('microservicio') || lowerQuestion.includes('arquitectura')) {
    return 'Tiene experiencia diseñando arquitecturas escalables y ha trabajado con patrones de microservicios en NEWSHORE. Su enfoque incluye separación de responsabilidades, comunicación asíncrona entre servicios y implementación de API gateways.';
  }
  
  if (lowerQuestion.includes('testing') || lowerQuestion.includes('prueba')) {
    return 'Utiliza Jest para testing unitario, Cypress para E2E y React Testing Library para componentes. Su enfoque incluye TDD cuando es apropiado, cobertura de código superior al 80% y automatización de pruebas en CI/CD.';
  }
  
  if (lowerQuestion.includes('desafiante') || lowerQuestion.includes('complejo')) {
    return 'Uno de sus proyectos más desafiantes fue la plataforma de evaluación académica en la Universidad de Caldas, que requirió integración con múltiples sistemas legacy, manejo de concurrencia para miles de usuarios simultáneos y implementación de algoritmos de calificación automática.';
  }
  
  if (lowerQuestion.includes('stakeholder') || lowerQuestion.includes('comunicación')) {
    return 'Humberto destaca en comunicación técnica con stakeholders no técnicos. En la Universidad de Caldas facilitó reuniones entre profesores, directivos y el equipo técnico, traduciendo requerimientos de negocio a especificaciones técnicas claras.';
  }
  
  if (lowerQuestion.includes('liderazgo') || lowerQuestion.includes('líder')) {
    return 'Su estilo de liderazgo es colaborativo y orientado al mentoring. Cree en empoderar al equipo, fomentar la innovación y mantener comunicación abierta. Ha liderado equipos de 3-5 desarrolladores y coordinado con equipos multidisciplinarios.';
  }
  
  if (lowerQuestion.includes('remoto') || lowerQuestion.includes('presencial') || lowerQuestion.includes('híbrido')) {
    return 'Humberto se adapta a cualquier modalidad de trabajo. Tiene experiencia en trabajo remoto efectivo con herramientas como Slack, Zoom y metodologías ágiles distribuidas. Valora la flexibilidad pero también aprecia la colaboración presencial cuando es necesaria.';
  }
  
  if (lowerQuestion.includes('actualizado') || lowerQuestion.includes('aprender') || lowerQuestion.includes('tecnología')) {
    return 'Se mantiene actualizado a través de documentación oficial, cursos en línea, conferencias tech y contribuciones a proyectos open source. Actualmente está explorando tecnologías como Docker, Kubernetes y arquitecturas serverless.';
  }
  
  if (lowerQuestion.includes('código abierto') || lowerQuestion.includes('open source')) {
    return 'Ha contribuido a varios proyectos de código abierto, principalmente en el ecosistema de React y Node.js. Mantiene algunos proyectos personales en GitHub y participa activamente en la comunidad de desarrolladores locales.';
  }
  
  if (lowerQuestion.includes('inglés') || lowerQuestion.includes('english')) {
    return 'Tiene un nivel B2 de inglés técnico, puede leer documentación, participar en reuniones internacionales y escribir código y comentarios en inglés. Ha trabajado con equipos distribuidos globalmente y se comunica efectivamente en inglés técnico.';
  }
  
  return 'Esa es una excelente pregunta sobre Humberto. Te recomiendo contactarlo directamente para obtener más detalles específicos. Puedes encontrarlo en:\n\n📧 humberto228xd@gmail.com\n📱 +57 3044388349\n💼 LinkedIn: humberto-agudelo\n🔗 GitHub: Hardev1\n\n¿Hay algo más específico sobre su experiencia técnica que te gustaría saber?';
}