'use client';

import { Suspense } from 'react';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { BlendFunction, KernelSize } from 'postprocessing';
import DynamicLineMesh from './DynamicLineMesh';

interface PostProcessingProps {
  mouseRef: React.MutableRefObject<{ x: number; y: number }>;
  scrollRef: React.MutableRefObject<number>;
  numPoints?: number;
  withBloom?: boolean;
}

export default function PostProcessingScene({
  mouseRef,
  scrollRef,
  numPoints = 160,
  withBloom = true,
}: PostProcessingProps) {
  return (
    <>
      <ambientLight intensity={0.04} />

      <DynamicLineMesh
        mouseRef={mouseRef}
        scrollRef={scrollRef}
        numPoints={numPoints}
      />

      {withBloom && (
        <Suspense fallback={null}>
          <EffectComposer multisampling={0}>
            <Bloom
              intensity={1.4}
              kernelSize={KernelSize.LARGE}
              luminanceThreshold={0.15}
              luminanceSmoothing={0.7}
              blendFunction={BlendFunction.ADD}
            />
            <Vignette
              darkness={0.7}
              offset={0.15}
              blendFunction={BlendFunction.NORMAL}
            />
          </EffectComposer>
        </Suspense>
      )}
    </>
  );
}
