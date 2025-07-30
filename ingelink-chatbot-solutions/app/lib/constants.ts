export const APP_CONFIG = {
  name: 'Ingelink Chatbot Solutions',
  version: '1.0.0',
  description: 'Soluciones de chatbot inteligente para empresas',
  author: 'Ingelink Team',
  contact: {
    email: 'info@ingelink.com',
    phone: '+1 (555) 123-4567',
    website: 'https://ingelink.com'
  }
} as const;

export const ANIMATION_CONFIG = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500
  },
  easing: {
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)'
  }
} as const;

export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
} as const;

export const CHAT_CONFIG = {
  maxMessageLength: 1000,
  typingIndicatorDelay: 1000,
  autoScrollThreshold: 100,
  messageRetryAttempts: 3,
  connectionTimeout: 30000
} as const;

export const API_ENDPOINTS = {
  chat: '/api/chat',
  messages: '/api/messages',
  health: '/api/health'
} as const;

// Colores WCAG AA compliant
export const COLORS = {
  primary: {
    50: '#f0f9ff',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    900: '#1e3a8a'
  },
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    500: '#6b7280',
    700: '#374151',
    900: '#111827'
  }
} as const;