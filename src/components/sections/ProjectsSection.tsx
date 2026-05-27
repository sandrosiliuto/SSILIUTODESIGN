'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MagneticButton from '@/components/ui/MagneticButton';

const PROJECTS = [
  {
    id: 'negrinjamon',
    title: 'NEGRÍN ALJAMÓN',
    category: 'Experiencia Web 3D',
    description: 'Web inmersiva para jamón ibérico de bellota con líneas vivas reactivas al cursor, postprocesado bloom y scroll cinematográfico.',
    tags: ['Next.js', 'Three.js', 'GSAP', 'Tailwind'],
    url: 'https://negrinjamon.vercel.app',
    color: 'from-alchemy-cyan/20 to-alchemy-magenta/10',
  },
  {
    id: 'becube3d',
    title: 'BECUBE 3D',
    category: 'Visualización 3D Interactiva',
    description: 'Experiencia 3D con cubo dinámico, shaders personalizados y animaciones fluidas. Proyecto de demostración de capacidades técnicas.',
    tags: ['React Three Fiber', 'GLSL', 'Postprocessing'],
    url: 'https://becube-3-d.vercel.app',
    color: 'from-alchemy-magenta/20 to-alchemy-cyan/10',
  },
  {
    id: 'ssiliuto-portfolio',
    title: 'SSILIUTO PORTFOLIO',
    category: 'Portfolio Creativo',
    description: 'Identidad visual high-tech con tipografía monoespaciada, paleta neón y efectos glitch. El punto de partida de Digital Alchemy.',
    tags: ['React', 'Vercel', 'Diseño UI/UX'],
    url: 'https://ssiliutodesign.vercel.app',
    color: 'from-alchemy-cyan/10 to-alchemy-magenta/20',
  },
];

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
        y: 60,
        opacity: 0,
        duration: 0.9,
        delay: i * 0.15,
        ease: 'power3.out',
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      id="proyectos"
      ref={sectionRef}
      className="relative py-32 px-6 z-10"
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-20">
          <span className="font-mono text-xs tracking-[0.3em] text-alchemy-cyan uppercase block mb-4">
            Portfolio
          </span>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold gradient-text mb-6">
            PROYECTOS
          </h2>
          <p className="font-body text-alchemy-gray text-lg max-w-xl">
            Selección de experiencias web donde el diseño 3D, la interactividad y el código se funden en una sola pieza.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PROJECTS.map((project, i) => (
            <div
              key={project.id}
              ref={(el) => { if (el) cardsRef.current[i] = el; }}
              className={`group relative cyber-border bg-gradient-to-br ${project.color} backdrop-blur-sm p-1 overflow-hidden`}
            >
              <div className="relative bg-alchemy-dark/80 p-6 h-full flex flex-col">
                {/* Header */}
                <div className="mb-4">
                  <span className="font-mono text-[10px] tracking-[0.2em] text-alchemy-cyan uppercase">
                    {project.category}
                  </span>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-alchemy-light mt-2 group-hover:text-alchemy-cyan transition-colors">
                    {project.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="font-body text-sm text-alchemy-gray leading-relaxed mb-6 flex-grow">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-[10px] tracking-wider px-2 py-1 border border-alchemy-steel/50 text-alchemy-gray rounded-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <MagneticButton
                  href={project.url}
                  className="!w-full !py-2.5 !text-xs"
                >
                  VISITAR WEB →
                </MagneticButton>

                {/* Hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-t from-alchemy-cyan/5 to-transparent" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
