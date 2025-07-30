import { useState, useCallback } from 'react';

interface MousePosition {
  x: number;
  y: number;
}

export function useParallax() {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
  
  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    const { clientX, clientY } = event;
    const { innerWidth, innerHeight } = window;
    
    const x = (clientX - innerWidth / 2) / (innerWidth / 2);
    const y = (clientY - innerHeight / 2) / (innerHeight / 2);
    
    setMousePosition({ x: x * 100, y: y * 100 });
  }, []);
  
  return { mousePosition, handleMouseMove };
}