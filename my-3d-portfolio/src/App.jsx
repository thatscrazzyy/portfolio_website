// src/App.jsx
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ScrollControls, Float, SpotLight, Sparkles, useScroll } from '@react-three/drei';
import * as THREE from 'three';

import { Overlay } from './components/Overlay';
import { Projector } from './components/Projector';
import { Screen } from './components/Screen';
import { Seats } from './components/Seats';   // ⬅️ new

const SECTIONS = 4;

const Background = () => (
  <group>
    <fog attach="fog" args={['#050000', 5, 45]} />
    <Sparkles count={300} scale={20} size={3} speed={0.4} opacity={0.4} color="#ff0000" />
  </group>
);

const SceneDirector = ({ projectorRef, lightRef }) => {
  const scroll = useScroll();

  useFrame((state) => {
    const r2 = scroll.range(1 / SECTIONS, 1 / SECTIONS);
    const r3 = scroll.range(2 / SECTIONS, 1 / SECTIONS);
    const r4 = scroll.range(3 / SECTIONS, 1 / SECTIONS);

    const targetX = 0 + r2 * 4 - r3 * 8 + r4 * 4;
    const targetY = 0 - r2 * 1 + r4 * 1;
    const targetZ = 0 + r2 * 5 - r3 * 2 + r4 * 5;

    const rotY = 0 - r2 * 0.3 + r3 * 0.3;

    if (projectorRef.current) {
      projectorRef.current.position.lerp(new THREE.Vector3(targetX, targetY, targetZ), 0.04);
      projectorRef.current.rotation.y = THREE.MathUtils.lerp(
        projectorRef.current.rotation.y,
        rotY,
        0.05
      );
      projectorRef.current.position.y += Math.sin(state.clock.elapsedTime) * 0.002;
    }

    if (lightRef.current && projectorRef.current) {
      const lightPos = projectorRef.current.position.clone().add(new THREE.Vector3(0, 0, 2));
      lightRef.current.position.lerp(lightPos, 0.1);
      lightRef.current.target.position.set(targetX * 0.5, targetY, 25);
      lightRef.current.target.updateMatrixWorld();
    }
  });

  return null;
};

const Experience = () => {
  const projectorRef = useRef();
  const lightRef = useRef();

  return (
    <>
      <SceneDirector projectorRef={projectorRef} lightRef={lightRef} />

      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
        <Projector ref={projectorRef} scale={0.4} />
      </Float>

      <SpotLight
        ref={lightRef}
        position={[0, 0, 0]}
        distance={40}
        angle={0.6}
        attenuation={10}
        anglePower={4}
        color="#fff5d6"
        castShadow
        penumbra={0.2}
      />

      <Screen />
      <Seats />       {/* ⬅️ rows of red seats */}
      <Background />
      <Overlay />
    </>
  );
};

export default function App() {
  return (
    <div className="w-full h-screen bg-[#050000]">
      <Canvas shadows camera={{ position: [0, 0, 10], fov: 35 }}>
        <ambientLight intensity={0.15} color="#ff0000" />
        <ScrollControls pages={SECTIONS} damping={0.2}>
          <Experience />
        </ScrollControls>
      </Canvas>
    </div>
  );
}
