'use client';

import { useRef, useEffect } from 'react';

/**
 * Hook que expone la posición del ratón en NDC (-1..+1) como una ref mutable.
 * No provoca re-renders — ideal para leer desde useFrame de R3F.
 */
export function useMousePosition() {
  const ref = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      ref.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      ref.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const onTouch = (e: TouchEvent) => {
      if (!e.touches[0]) return;
      ref.current.x = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
      ref.current.y = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('touchmove', onTouch, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onTouch);
    };
  }, []);

  return ref;
}
