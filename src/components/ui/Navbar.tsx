'use client';

import { useEffect, useRef, useState } from 'react';
import MagneticButton from './MagneticButton';

const NAV_LINKS = [
  { label: 'INICIO', href: '#hero' },
  { label: 'PROYECTOS', href: '#proyectos' },
  { label: 'SOBRE MÍ', href: '#sobre-mi' },
  { label: 'CONTACTO', href: '#contacto' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-alchemy-void/80 backdrop-blur-md border-b border-alchemy-cyan/10'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a
          href="#hero"
          className="font-display text-lg tracking-[0.2em] text-alchemy-light hover:text-alchemy-cyan transition-colors glitch-text"
          data-text="SSILIUTO"
        >
          SSILIUTO
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-mono text-xs tracking-[0.15em] text-alchemy-gray hover:text-alchemy-cyan transition-colors relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-alchemy-cyan transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
          <MagneticButton href="mailto:hola@ssiliutodesign.com" className="!py-2 !px-5 !text-xs">
            HABLEMOS
          </MagneticButton>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-[2px] bg-alchemy-light transition-all ${mobileOpen ? 'rotate-45 translate-y-[5px]' : ''}`} />
          <span className={`block w-6 h-[2px] bg-alchemy-light transition-all ${mobileOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-[2px] bg-alchemy-light transition-all ${mobileOpen ? '-rotate-45 -translate-y-[5px]' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-alchemy-void/95 backdrop-blur-lg border-b border-alchemy-cyan/10 transition-all duration-300 ${
          mobileOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center gap-6 py-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="font-mono text-sm tracking-[0.15em] text-alchemy-gray hover:text-alchemy-cyan transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
