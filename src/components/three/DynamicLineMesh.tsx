'use client';

import { useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// ── Paleta Digital Alchemy ─────────────────────────────────────────────────
const C_CYAN = new THREE.Color('#00BFFF');
const C_MAGENTA = new THREE.Color('#FF007F');
const C_STEEL = new THREE.Color('#2D2D44');
const C_LIGHT = new THREE.Color('#E0E6ED');

// ── Constantes ─────────────────────────────────────────────────────────────
const MAX_SEGMENTS = 10000;
const MOUSE_RADIUS = 5.0;
const CONNECTION_DIST = 2.8;

// ── Temp objects reutilizables ─────────────────────────────────────────────
const _tmpVec = new THREE.Vector3();
const _tmpVec2 = new THREE.Vector2();
const _raycaster = new THREE.Raycaster();
const _interPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
const _mouseWorld = new THREE.Vector3();

// ── Shaders GLSL para nodos luminosos ──────────────────────────────────────
const VERT_POINTS = /* glsl */ `
  attribute float aSize;
  attribute vec3  aColor;
  varying   vec3  vColor;

  void main() {
    vColor = aColor;
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (400.0 / -mvPos.z);
    gl_Position  = projectionMatrix * mvPos;
  }
`;

const FRAG_POINTS = /* glsl */ `
  varying vec3 vColor;

  void main() {
    vec2  uv   = gl_PointCoord - 0.5;
    float r    = length(uv) * 2.0;
    float core = 1.0 - smoothstep(0.0, 0.4, r);
    float halo = 1.0 - smoothstep(0.4, 1.0, r);
    float a    = core * 0.95 + halo * 0.3;
    if (a < 0.01) discard;
    gl_FragColor = vec4(vColor * (1.0 + core * 0.8), a);
  }
`;

// ────────────────────────────────────────────────────────────────────────────
interface DynamicLineMeshProps {
  mouseRef: React.MutableRefObject<{ x: number; y: number }>;
  scrollRef: React.MutableRefObject<number>;
  numPoints?: number;
}

function generateNetworkPoints(count: number): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  // Núcleo central denso
  for (let i = 0; i < count * 0.5; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = Math.pow(Math.random(), 1 / 3) * 3.5;
    points.push(new THREE.Vector3(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.sin(phi) * Math.sin(theta),
      r * Math.cos(phi) * 0.4
    ));
  }
  // Anillo orbital exterior
  for (let i = 0; i < count * 0.3; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 4 + Math.random() * 3;
    const y = (Math.random() - 0.5) * 2;
    points.push(new THREE.Vector3(
      Math.cos(angle) * radius,
      y,
      Math.sin(angle) * radius * 0.3
    ));
  }
  // Puntos dispersos lejanos
  for (let i = 0; i < count * 0.2; i++) {
    const theta = Math.random() * Math.PI * 2;
    const r = 6 + Math.random() * 4;
    points.push(new THREE.Vector3(
      Math.cos(theta) * r,
      (Math.random() - 0.5) * 6,
      (Math.random() - 0.5) * 2
    ));
  }
  return points;
}

export default function DynamicLineMesh({
  mouseRef,
  scrollRef,
  numPoints = 160,
}: DynamicLineMeshProps) {
  const { camera } = useThree();

  const rawPoints = useMemo(() => generateNetworkPoints(numPoints), [numPoints]);

  const nodes = useMemo(() => {
    return rawPoints.map((pos) => ({
      pos: pos.clone(),
      origPos: pos.clone(),
      vel: new THREE.Vector3(
        (Math.random() - 0.5) * 0.005,
        (Math.random() - 0.5) * 0.004,
        (Math.random() - 0.5) * 0.003,
      ),
      energy: 0,
      colorType: Math.random() < 0.35 ? 1 : 0, // 35% magenta, 65% cyan/steel
      baseSize: 1.8 + Math.random() * 2.2,
    }));
  }, [rawPoints]);

  // ── Geometría de LÍNEAS ─────────────────────────────────────────────────
  const lineGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(MAX_SEGMENTS * 2 * 3), 3),
    );
    geo.setAttribute(
      'color',
      new THREE.BufferAttribute(new Float32Array(MAX_SEGMENTS * 2 * 3), 3),
    );
    geo.setDrawRange(0, 0);
    return geo;
  }, []);

  const lineMat = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.75,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  );

  // ── Geometría de NODOS ──────────────────────────────────────────────────
  const { pointGeo, pointMat } = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(nodes.length * 3);
    const colors = new Float32Array(nodes.length * 3);
    const sizes = new Float32Array(nodes.length);

    nodes.forEach((n, i) => {
      positions[i * 3] = n.pos.x;
      positions[i * 3 + 1] = n.pos.y;
      positions[i * 3 + 2] = n.pos.z;

      const c = n.colorType === 1 ? C_MAGENTA : (Math.random() < 0.5 ? C_CYAN : C_STEEL);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      sizes[i] = n.baseSize;
    });

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));

    const mat = new THREE.ShaderMaterial({
      vertexShader: VERT_POINTS,
      fragmentShader: FRAG_POINTS,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    return { pointGeo: geo, pointMat: mat };
  }, [nodes]);

  // ── Cleanup ─────────────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      lineGeo.dispose();
      lineMat.dispose();
      pointGeo.dispose();
      pointMat.dispose();
    };
  }, [lineGeo, lineMat, pointGeo, pointMat]);

  // ── Loop de animación ───────────────────────────────────────────────────
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const scroll = scrollRef.current;
    const mouse = mouseRef.current;

    // Proyectar cursor al plano z=0 en espacio mundo
    _tmpVec2.set(mouse.x, mouse.y);
    _raycaster.setFromCamera(_tmpVec2, camera);
    const hit = _raycaster.ray.intersectPlane(_interPlane, _mouseWorld);
    if (!hit) _mouseWorld.set(0, 0, 0);

    // ── Actualizar nodos ─────────────────────────────────────────────────
    const pPos = pointGeo.attributes.position.array as Float32Array;
    const pCol = pointGeo.attributes.aColor.array as Float32Array;
    const pSiz = pointGeo.attributes.aSize.array as Float32Array;

    nodes.forEach((n, i) => {
      // Deriva suave
      n.pos.add(n.vel);

      // Rebote suave hacia posición original
      n.pos.lerp(n.origPos, 0.008);

      // Energía del ratón — lerp suave
      const distMouse = n.pos.distanceTo(_mouseWorld);
      const targetEnergy = Math.max(0, 1 - distMouse / MOUSE_RADIUS);
      n.energy += (targetEnergy - n.energy) * 0.07;

      // Repulsión suave del ratón
      if (distMouse < MOUSE_RADIUS && distMouse > 0.01) {
        const force = (1 - distMouse / MOUSE_RADIUS) * 0.025;
        _tmpVec.copy(n.pos).sub(_mouseWorld).normalize().multiplyScalar(force);
        n.pos.add(_tmpVec);
      }

      // Respiración sutil
      const breath = Math.sin(time * 0.5 + i * 0.37) * 0.012;
      n.pos.y += breath;

      // Escribir posición actualizada
      pPos[i * 3] = n.pos.x;
      pPos[i * 3 + 1] = n.pos.y;
      pPos[i * 3 + 2] = n.pos.z;

      // Interpolación de color: base → magenta/cyan según energía
      const base = n.colorType === 1 ? C_MAGENTA : C_CYAN;
      const targetColor = n.energy > 0.5 ? C_LIGHT : (n.energy > 0.2 ? C_MAGENTA : C_CYAN);
      const effectiveEnergy = Math.min(n.energy * 1.6, 1.0);

      pCol[i * 3] = base.r + (targetColor.r - base.r) * effectiveEnergy;
      pCol[i * 3 + 1] = base.g + (targetColor.g - base.g) * effectiveEnergy;
      pCol[i * 3 + 2] = base.b + (targetColor.b - base.b) * effectiveEnergy;

      // Tamaño crece al energizarse
      pSiz[i] = n.baseSize * (1 + n.energy * 2.5);
    });

    pointGeo.attributes.position.needsUpdate = true;
    pointGeo.attributes.aColor.needsUpdate = true;
    pointGeo.attributes.aSize.needsUpdate = true;

    // ── Construir segmentos de línea ─────────────────────────────────────
    const lPos = lineGeo.attributes.position.array as Float32Array;
    const lCol = lineGeo.attributes.color.array as Float32Array;
    let segCount = 0;

    for (let i = 0; i < nodes.length && segCount < MAX_SEGMENTS - 1; i++) {
      for (let j = i + 1; j < nodes.length && segCount < MAX_SEGMENTS - 1; j++) {
        const dist = nodes[i].pos.distanceTo(nodes[j].pos);
        if (dist >= CONNECTION_DIST) continue;

        const distAlpha = 1 - dist / CONNECTION_DIST;
        const energy = Math.max(nodes[i].energy, nodes[j].energy);
        const base = (nodes[i].colorType === 1 || nodes[j].colorType === 1)
          ? C_MAGENTA : C_CYAN;
        const targetColor = energy > 0.5 ? C_LIGHT : C_CYAN;
        const effEnergy = Math.min(energy * 1.6, 1.0);

        const r = (base.r + (targetColor.r - base.r) * effEnergy) * distAlpha;
        const g = (base.g + (targetColor.g - base.g) * effEnergy) * distAlpha;
        const b = (base.b + (targetColor.b - base.b) * effEnergy) * distAlpha;

        const idx = segCount * 6;
        lPos[idx] = nodes[i].pos.x; lPos[idx + 1] = nodes[i].pos.y; lPos[idx + 2] = nodes[i].pos.z;
        lPos[idx + 3] = nodes[j].pos.x; lPos[idx + 4] = nodes[j].pos.y; lPos[idx + 5] = nodes[j].pos.z;
        lCol[idx] = r; lCol[idx + 1] = g; lCol[idx + 2] = b;
        lCol[idx + 3] = r; lCol[idx + 4] = g; lCol[idx + 5] = b;

        segCount++;
      }
    }

    lineGeo.attributes.position.needsUpdate = true;
    lineGeo.attributes.color.needsUpdate = true;
    lineGeo.setDrawRange(0, segCount * 2);

    // ── Coreografía de cámara por scroll ─────────────────────────────────
    const camX = Math.sin(scroll * Math.PI * 1.6) * 5.5 + Math.sin(time * 0.08) * 0.4;
    const camY = Math.cos(scroll * Math.PI * 1.0) * 3.0 + Math.sin(time * 0.06) * 0.3;
    const camZ = Math.max(7.0, 14 - scroll * 6.0);

    camera.position.lerp(_tmpVec.set(camX, camY, camZ), 0.022);
    camera.lookAt(0, scroll * 1.5 - 0.5, 0);
    camera.updateMatrixWorld();
  });

  return (
    <group>
      <lineSegments geometry={lineGeo} material={lineMat} />
      <points geometry={pointGeo} material={pointMat} />
    </group>
  );
}
