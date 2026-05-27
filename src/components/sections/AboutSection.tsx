'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const SKILLS = [
  { name: 'React / Next.js', level: 95 },
  { name: 'Three.js / R3F', level: 90 },
  { name: 'TypeScript', level: 92 },
  { name: 'GSAP / Animaciones', level: 88 },
  { name: 'Tailwind / CSS', level: 94 },
  { name: 'GLSL / Shaders', level: 75 },
  { name: 'Diseño UI/UX', level: 85 },
  { name: 'Vercel / DevOps', level: 80 },
];

const SERVICES = [
  {
    num: '01',
    title: 'Experiencias Web 3D',
    desc: 'Webs inmersivas con Three.js, React Three Fiber y postprocesado visual de alto nivel.',
  },
  {
    num: '02',
    title: 'Diseño Interactivo',
    desc: 'Interfaces que responden al cursor, al scroll y al gesto del usuario con microanimaciones precisas.',
  },
  {
    num: '03',
    title: 'Frontend Senior',
    desc: 'Arquitectura escalable, performance óptimo y código limpio para proyectos de alto impacto.',
  },
  {
    num: '04',
    title: 'Identidad Digital',
    desc: 'Diseño de marca, sistemas de diseño y asset kits para startups y estudios creativos.',
  },
];

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const barsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    barsRef.current.forEach((bar, i) => {
      if (!bar) return;
      const width = bar.dataset.level || '0';
      gsap.fromTo(
        bar,
        { width: '0%' },
        {
          width: `${width}%`,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: bar,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
          delay: i * 0.08,
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      id="sobre-mi"
      ref={sectionRef}
      className="relative py-32 px-6 z-10"
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-20">
          <span className="font-mono text-xs tracking-[0.3em] text-alchemy-cyan uppercase block mb-4">
            Sobre mí
          </span>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold gradient-text mb-6">
            DIGITAL ALCHEMIST
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Bio */}
          <div className="space-y-6">
            <p className="font-body text-lg text-alchemy-light leading-relaxed">
              Soy <span className="text-alchemy-cyan font-semibold">Sandro Siliuto</span>, diseñador y desarrollador frontend senior especializado en experiencias web 3D e interactivas.
            </p>
            <p className="font-body text-alchemy-gray leading-relaxed">
              Mi trabajo fusiona el arte visual con la ingeniería de software. Cada proyecto es una oportunidad para explorar los límites entre lo estético y lo técnico, creando piezas que no solo se ven, sino que se sienten.
            </p>
            <p className="font-body text-alchemy-gray leading-relaxed">
              Desde shaders GLSL hasta arquitecturas React escalables, mi stack abarca todo el espectro del desarrollo frontend creativo. He trabajado con marcas que buscan diferenciarse a través de la tecnología.
            </p>

            <div className="pt-4">
              <span className="font-mono text-[10px] tracking-[0.2em] text-alchemy-magenta uppercase block mb-4">
                Stack Técnico
              </span>
              <div className="space-y-3">
                {SKILLS.map((skill, i) => (
                  <div key={skill.name}>
                    <div className="flex justify-between mb-1">
                      <span className="font-mono text-xs text-alchemy-gray">{skill.name}</span>
                      <span className="font-mono text-xs text-alchemy-cyan">{skill.level}%</span>
                    </div>
                    <div className="w-full h-[2px] bg-alchemy-steel/30 rounded-full overflow-hidden">
                      <div
                        ref={(el) => { if (el) barsRef.current[i] = el; }}
                        data-level={skill.level}
                        className="h-full bg-gradient-to-r from-alchemy-cyan to-alchemy-magenta rounded-full"
                        style={{ width: '0%' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-6">
            <span className="font-mono text-[10px] tracking-[0.2em] text-alchemy-magenta uppercase block mb-4">
              Servicios
            </span>
            <div className="space-y-4">
              {SERVICES.map((service) => (
                <div
                  key={service.num}
                  className="cyber-border bg-alchemy-dark/60 backdrop-blur-sm p-6 group hover:bg-alchemy-dark/80 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <span className="font-mono text-2xl font-bold text-alchemy-cyan/40 group-hover:text-alchemy-cyan transition-colors">
                      {service.num}
                    </span>
                    <div>
                      <h4 className="font-display text-lg font-semibold text-alchemy-light mb-2 group-hover:text-alchemy-cyan transition-colors">
                        {service.title}
                      </h4>
                      <p className="font-body text-sm text-alchemy-gray leading-relaxed">
                        {service.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
