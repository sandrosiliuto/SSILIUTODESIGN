'use client';

import { useRef, useEffect } from 'react';

/**
 * Hook que expone el progreso de scroll (0..1) como una ref mutable.
 * No provoca re-renders de React — ideal para leer desde useFrame de R3F.
 */
export function useScrollProgress() {
  const ref = useRef(0);

  useEffect(() => {
    const update = () => {
      const max = Math.max(
        document.body.scrollHeight - window.innerHeight,
        1
      );
      const p = Math.min(Math.max(window.scrollY / max, 0), 1);
      ref.current = p;
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return ref;
}
