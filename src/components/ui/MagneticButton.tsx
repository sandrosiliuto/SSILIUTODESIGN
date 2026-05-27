'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number;
  onClick?: () => void;
  href?: string;
}

export default function MagneticButton({
  children,
  className = '',
  strength = 0.4,
  onClick,
  href,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  const [transform, setTransform] = useState('translate(0px, 0px)');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;
      const dist = Math.sqrt(distX * distX + distY * distY);
      const maxDist = Math.max(rect.width, rect.height) * 1.2;

      if (dist < maxDist) {
        const factor = (1 - dist / maxDist) * strength;
        setTransform(`translate(${distX * factor}px, ${distY * factor}px)`);
      } else {
        setTransform('translate(0px, 0px)');
      }
    };

    const handleLeave = () => {
      setTransform('translate(0px, 0px)');
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    el.addEventListener('mouseleave', handleLeave);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      el.removeEventListener('mouseleave', handleLeave);
    };
  }, [strength]);

  const baseClasses = `magnetic-btn inline-flex items-center justify-center px-8 py-3 font-mono text-sm tracking-widest uppercase border border-alchemy-cyan/30 text-alchemy-light bg-alchemy-dark/60 backdrop-blur-sm rounded-sm transition-all duration-200 hover:border-alchemy-cyan hover:text-alchemy-cyan ${className}`;

  const style = {
    transform,
    transition: transform === 'translate(0px, 0px)' ? 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)' : 'transform 0.1s ease-out',
  };

  if (href) {
    return (
      <a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={baseClasses}
        style={style}
        data-magnetic
      >
        {children}
      </a>
    );
  }

  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      onClick={onClick}
      className={baseClasses}
      style={style}
      data-magnetic
    >
      {children}
    </button>
  );
}
