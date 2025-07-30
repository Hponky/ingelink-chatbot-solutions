import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './app/presentation/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Custom color palette for reusable design system
      colors: {
        // Primary brand colors
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1', // Main primary
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        // Secondary colors
        secondary: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4', // Main secondary
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
          950: '#083344',
        },
        // Accent colors
        accent: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b', // Main accent
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        // Background system
        background: {
          primary: '#0f172a',
          secondary: '#1e293b',
          tertiary: '#334155',
          glass: 'rgba(255, 255, 255, 0.05)',
          'glass-strong': 'rgba(255, 255, 255, 0.1)',
        },
        // Surface colors
        surface: {
          primary: '#1e293b',
          secondary: '#334155',
          tertiary: '#475569',
          elevated: '#64748b',
          'glass-light': 'rgba(255, 255, 255, 0.05)',
          'glass-medium': 'rgba(255, 255, 255, 0.1)',
        },
        // Text colors
        text: {
          primary: '#f8fafc',
          secondary: '#cbd5e1',
          tertiary: '#94a3b8',
          muted: '#64748b',
          inverse: '#0f172a',
          placeholder: '#64748b',
        },
        // Border colors
        border: {
          primary: '#334155',
          secondary: '#475569',
          accent: '#6366f1',
          glass: 'rgba(255, 255, 255, 0.1)',
          'glass-strong': 'rgba(255, 255, 255, 0.2)',
        },
        // Status colors
        status: {
          success: '#10b981',
          error: '#ef4444',
          warning: '#f59e0b',
          info: '#06b6d4',
          processing: '#f59e0b',
          online: '#10b981',
        },
        // Chat-specific colors
        chat: {
          input: {
            bg: 'rgba(30, 41, 59, 0.8)',
            'bg-hover': 'rgba(30, 41, 59, 0.9)',
            border: 'rgba(51, 65, 85, 0.5)',
            text: '#f1f5f9',
            placeholder: '#94a3b8',
          },
          button: {
            primary: {
              from: '#4f46e5',
              to: '#7c3aed',
            },
            'primary-hover': {
              from: '#4338ca',
              to: '#6d28d9',
            },
            disabled: {
              from: '#475569',
              to: '#475569',
            },
          },
        },
      },
      // Custom gradients
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
        'gradient-accent': 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        'gradient-hero': 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        'gradient-glass': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        'gradient-text': 'linear-gradient(135deg, #818cf8 0%, #06b6d4 100%)',
        // Chat-specific gradients
        'gradient-chat-bg': 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        'gradient-chat-header': 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)',
        'gradient-send-button': 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
        'gradient-send-button-hover': 'linear-gradient(135deg, #4338ca 0%, #6d28d9 100%)',
        'gradient-icon-bg': 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
        // Scroll effects
        'gradient-scroll-fade-top': 'linear-gradient(to bottom, rgba(15, 23, 42, 1) 0%, rgba(15, 23, 42, 0.8) 20%, transparent 100%)',
        'gradient-scroll-fade-bottom': 'linear-gradient(to top, rgba(15, 23, 42, 1) 0%, rgba(15, 23, 42, 0.8) 20%, transparent 100%)',
        'gradient-scroll-indicator': 'linear-gradient(135deg, rgba(99, 102, 241, 0.8) 0%, rgba(168, 85, 247, 0.8) 100%)',
      },
      // Animation system
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-in-left': 'slideInFromLeft 0.4s ease-out',
        'slide-in-right': 'slideInFromRight 0.4s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-custom': 'pulse 2s infinite',
        'typing': 'typing 1.5s infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        // Chat-specific animations
        'spin-slow': 'spin 2s linear infinite',
        'bounce-subtle': 'bounceSubtle 2s ease-in-out infinite',
      },
      // Custom keyframes
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInFromLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInFromRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)' },
          '100%': { boxShadow: '0 0 30px rgba(99, 102, 241, 0.8)' },
        },
        typing: {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-2px)' },
        },
      },
      // Typography system
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', 'monospace'],
      },
      // Spacing system for consistent layouts
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem', // For header padding
        '88': '22rem',
        '128': '32rem',
      },
      // Border radius system
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      // Box shadow system
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.12)',
        'glow': '0 0 20px rgba(99, 102, 241, 0.5)',
        'glow-lg': '0 0 30px rgba(99, 102, 241, 0.8)',
        'inner-glow': 'inset 0 1px 0 rgba(255, 255, 255, 0.2)',
        // Chat-specific shadows
        'chat-input': '0 4px 16px rgba(0, 0, 0, 0.1)',
        'chat-button': '0 4px 16px rgba(99, 102, 241, 0.3)',
        'chat-button-hover': '0 6px 20px rgba(99, 102, 241, 0.4)'
      },
      // Backdrop blur system
      backdropBlur: {
        'xs': '2px',
        'chat': '12px',
      },
      // Z-index system
      zIndex: {
        'header': '50',
        'scroll-fade': '10',
        'scroll-indicator': '20',
        'chat-toggle': '40',
      },
      // Transition system
      transitionDuration: {
        '250': '250ms',
        '400': '400ms',
      },
    },
  },
  plugins: [
    // Plugin para añadir las utilidades personalizadas
    plugin(function({ addUtilities }) {
      addUtilities({
        '.hover-lift': {
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            'box-shadow': '0 10px 25px rgba(0, 0, 0, 0.2)',
          },
        },
        '.glass': {
          background: 'rgba(255, 255, 255, 0.05)',
          'backdrop-filter': 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
        '.gradient-text': {
          background: 'linear-gradient(135deg, #818cf8, #06b6d4)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
        '.focus-ring': {
          '&:focus': {
            outline: 'none',
            'box-shadow': '0 0 0 2px #6366f1, 0 0 0 4px rgba(99, 102, 241, 0.2)',
          },
        },
      });
    }),
  ],
};
export default config;