'use client';

import { useEffect, useRef } from 'react';

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      if (!barRef.current) return;
      const max = Math.max(document.body.scrollHeight - window.innerHeight, 1);
      const p = (window.scrollY / max) * 100;
      barRef.current.style.width = `${p}%`;
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-[2px] z-[60] bg-alchemy-steel/20">
      <div
        ref={barRef}
        className="h-full bg-gradient-to-r from-alchemy-cyan to-alchemy-magenta"
        style={{ width: '0%', transition: 'width 0.1s linear' }}
      />
    </div>
  );
}
