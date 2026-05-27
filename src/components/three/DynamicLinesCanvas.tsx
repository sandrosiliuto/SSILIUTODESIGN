'use client';

import { Suspense, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import dynamic from 'next/dynamic';
import { useMousePosition } from '@/hooks/useMousePosition';
import { useScrollProgress } from '@/hooks/useScrollProgress';

const PostProcessingScene = dynamic(
  () => import('./PostProcessing'),
  { ssr: false }
);

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

export default function DynamicLinesCanvas() {
  const mouseRef = useMousePosition();
  const scrollRef = useScrollProgress();
  const containerRef = useRef<HTMLDivElement>(null);

  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.opacity = '1';
    }
  }, []);

  if (typeof window !== 'undefined' && !hasWebGL()) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-screen pointer-events-none"
      style={{ zIndex: 0, opacity: 0, transition: 'opacity 1s ease' }}
      aria-hidden="true"
    >
      <div className="absolute inset-0 pointer-events-auto">
        <Canvas
          camera={{
            position: [0, 0, 14],
            fov: 55,
            near: 0.1,
            far: 100,
          }}
          dpr={[1, isMobile ? 1.5 : 2]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
            stencil: false,
            depth: true,
          }}
          style={{ width: '100%', height: '100%' }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
          }}
        >
          <Suspense fallback={null}>
            <PostProcessingScene
              mouseRef={mouseRef}
              scrollRef={scrollRef}
              numPoints={isMobile ? 80 : 160}
              withBloom={!isMobile}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 0%, rgba(5,5,5,0.6) 60%, #050505 100%)',
        }}
      />
    </div>
  );
}
