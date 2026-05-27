'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import MagneticButton from '@/components/ui/MagneticButton';

export default function HeroSection() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.3 });

    // Cyber text reveal: caracteres uno a uno
    if (titleRef.current) {
      const text = titleRef.current.innerText;
      titleRef.current.innerHTML = text
        .split('')
        .map((char, i) =>
          char === ' '
            ? ' <span>&nbsp;</span>'
            : `\u003cspan class="inline-block opacity-0 translate-y-4" style="animation-delay:${i * 0.04}s"\u003e${char}\u003c/span\u003e`
        )
        .join('');

      tl.to(titleRef.current.querySelectorAll('span'), {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.03,
        ease: 'power3.out',
      });
    }

    if (subtitleRef.current) {
      tl.from(subtitleRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: 'power2.out',
      }, '-=0.4');
    }

    if (taglineRef.current) {
      tl.from(taglineRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: 'power2.out',
      }, '-=0.5');
    }

    if (ctaRef.current) {
      tl.from(ctaRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: 'power2.out',
      }, '-=0.5');
    }

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center px-6 z-10"
    >
      <div className="text-center max-w-5xl mx-auto">
        <div
          ref={taglineRef}
          className="font-mono text-xs tracking-[0.3em] text-alchemy-cyan mb-6 uppercase"
        >
          <span className="inline-block w-8 h-[1px] bg-alchemy-cyan mr-4 align-middle" />
          Art & Technology Studio
          <span className="inline-block w-8 h-[1px] bg-alchemy-cyan ml-4 align-middle" />
        </div>

        <h1
          ref={titleRef}
          className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight gradient-text mb-8"
        >
          DIGITAL ALCHEMY
        </h1>

        <p
          ref={subtitleRef}
          className="font-body text-lg sm:text-xl md:text-2xl text-alchemy-gray max-w-2xl mx-auto leading-relaxed mb-12"
        >
          Transformo ideas en experiencias web inmersivas.
          <br className="hidden sm:block" />
          <span className="text-alchemy-light">Three.js · React · Diseño 3D · Frontend Senior</span>
        </p>

        <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <MagneticButton href="#proyectos">
            VER PROYECTOS
          </MagneticButton>
          <MagneticButton
            href="mailto:hola@ssiliutodesign.com"
            className="!border-alchemy-magenta/30 hover:!border-alchemy-magenta hover:!text-alchemy-magenta"
          >
            CONTACTAR
          </MagneticButton>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="font-mono text-[10px] tracking-[0.2em] text-alchemy-gray uppercase">Scroll</span>
        <div className="w-[1px] h-8 bg-gradient-to-b from-alchemy-cyan to-transparent animate-pulse-glow" />
      </div>
    </section>
  );
}
