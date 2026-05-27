'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Navbar from '@/components/ui/Navbar';
import ScrollProgress from '@/components/ui/ScrollProgress';
import CustomCursor from '@/components/ui/CustomCursor';
import HeroSection from '@/components/sections/HeroSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import AboutSection from '@/components/sections/AboutSection';
import ContactSection from '@/components/sections/ContactSection';

const DynamicLinesCanvas = dynamic(() => import('@/components/three/DynamicLinesCanvas'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 flex items-center justify-center text-alchemy-cyan text-sm tracking-widest z-0">
      INICIANDO NÚCLEO 3D…
    </div>
  ),
});

export default function Home() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const sections = ['#proyectos', '#sobre-mi', '#contacto'];
    sections.forEach((id) => {
      gsap.from(id + ' .gsap-reveal', {
        scrollTrigger: {
          trigger: id,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <>
      <DynamicLinesCanvas />
      <CustomCursor />
      <ScrollProgress />
      <Navbar />

      <main className="relative z-10">
        <HeroSection />
        <ProjectsSection />
        <AboutSection />
        <ContactSection />
      </main>
    </>
  );
}
