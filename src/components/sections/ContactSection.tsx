'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MagneticButton from '@/components/ui/MagneticButton';

const SOCIALS = [
  { label: 'GitHub', url: 'https://github.com/sandrosiliuto' },
  { label: 'LinkedIn', url: 'https://linkedin.com/in/sandrosiliuto' },
  { label: 'Behance', url: 'https://behance.net/ssiliutodesign' },
  { label: 'Dribbble', url: 'https://dribbble.com/ssiliutodesign' },
];

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (sectionRef.current) {
      gsap.from(sectionRef.current.querySelectorAll('.gsap-reveal'), {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      id="contacto"
      ref={sectionRef}
      className="relative py-32 px-6 z-10"
    >
      <div className="max-w-4xl mx-auto text-center">
        <span className="gsap-reveal font-mono text-xs tracking-[0.3em] text-alchemy-cyan uppercase block mb-4">
          Contacto
        </span>

        <h2 className="gsap-reveal font-display text-4xl sm:text-5xl md:text-6xl font-bold gradient-text mb-6">
          HABLEMOS
        </h2>

        <p className="gsap-reveal font-body text-lg text-alchemy-gray max-w-xl mx-auto mb-12 leading-relaxed">
          ¿Tienes un proyecto en mente? Me encanta transformar ideas en experiencias digitales memorables.
        </p>

        <div className="gsap-reveal flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <MagneticButton href="mailto:hola@ssiliutodesign.com">
            ENVIAR EMAIL
          </MagneticButton>
          <MagneticButton
            href="https://calendly.com/ssiliutodesign"
            className="!border-alchemy-magenta/30 hover:!border-alchemy-magenta hover:!text-alchemy-magenta"
          >
            AGENDAR CALL
          </MagneticButton>
        </div>

        <div className="gsap-reveal flex flex-wrap items-center justify-center gap-6 mb-20">
          {SOCIALS.map((social) => (
            <a
              key={social.label}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-sm text-alchemy-gray hover:text-alchemy-cyan transition-colors relative group"
            >
              {social.label}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-alchemy-cyan transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-alchemy-steel/20 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="font-mono text-[10px] tracking-[0.2em] text-alchemy-gray">
              © 2025 SSILIUTODESIGN
            </span>
            <span className="font-mono text-[10px] tracking-[0.2em] text-alchemy-gray">
              HECHO CON <span className="text-alchemy-magenta">♥</span> EN ESPAÑA
            </span>
            <span className="font-mono text-[10px] tracking-[0.2em] text-alchemy-cyan">
              THREE.JS · REACT · GSAP
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
