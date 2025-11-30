import React, { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ScrollControls, Float, Sparkles, useScroll } from '@react-three/drei';
import * as THREE from 'three';

import { Projector } from './components/Projector';
import { Screen } from './components/Screen';
import { Seats } from './components/Seats';
import { Floor } from './components/Floor';

const SECTIONS = 6;

const SceneLogic = ({ projectorRef, projectorLightRef }) => {
  const scroll = useScroll();
  const { camera } = useThree();

  useFrame((state) => {
    const offset = scroll.offset; // 0 → 1

    // Projector moves left → right as you scroll
    const projectorX = -12 + offset * 24; // -12 to +12

    if (projectorRef.current) {
      projectorRef.current.position.x = THREE.MathUtils.lerp(
        projectorRef.current.position.x,
        projectorX,
        0.05
      );
      projectorRef.current.position.y = 1.5 + Math.sin(state.clock.elapsedTime) * 0.3;
      projectorRef.current.position.z = -5; // behind the seats

      // Aim at the screen
      projectorRef.current.lookAt(0, 3, 20);
    }

    // Move the projector light with the projector
    if (projectorLightRef.current && projectorRef.current) {
      projectorLightRef.current.position.copy(projectorRef.current.position);
      projectorLightRef.current.target.position.set(0, 3, 20);
      projectorLightRef.current.target.updateMatrixWorld();
    }

    // Camera lightly follows the projector sideways
    const camX = projectorX * 0.2;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, camX, 0.05);
    camera.position.y = 3;
    camera.position.z = -12;

    camera.lookAt(0, 4, 20);
  });

  return null;
};

export default function App() {
  const projectorRef = useRef();
  const projectorLightRef = useRef();

  return (
    <div className="w-full h-screen bg-black">
      <Canvas
        shadows
        camera={{ position: [0, 3, -12], fov: 50 }}
      >
        {/* Solid black background */}
        <color attach="background" args={['#000000']} />

        {/* Fog for depth */}
        <fog attach="fog" args={['#020202', 15, 80]} />

        {/* Basic global lighting */}
        <ambientLight intensity={0.4} />
        <hemisphereLight
          skyColor="#331111"
          groundColor="#000000"
          intensity={0.4}
        />

        {/* Overhead "house" light over the seats */}
        <spotLight
          position={[0, 25, 15]}
          angle={Math.PI / 3}
          penumbra={0.5}
          intensity={1.5}
          color="#ffedd6"
          castShadow
        />

        {/* Projector spotlight (linked in SceneLogic) */}
        <spotLight
          ref={projectorLightRef}
          angle={0.4}
          intensity={8}
          distance={80}
          penumbra={0.6}
          castShadow
        />

        {/* --- MAIN SCENE CONTROLLED BY SCROLL --- */}
        <ScrollControls pages={SECTIONS} damping={0.2}>
          <SceneLogic
            projectorRef={projectorRef}
            projectorLightRef={projectorLightRef}
          />

          {/* Projector at the back */}
          <Float speed={2} rotationIntensity={0.1} floatIntensity={0}>
            <Projector ref={projectorRef} scale={0.5} />
          </Float>

          {/* Curved screen with scroll-driven credits */}
          <Screen />

          {/* Seats & floor */}
          <Seats />
          <Floor />

          {/* Dust / particles in air */}
          <Sparkles
            count={400}
            scale={[40, 20, 40]}
            size={1}
            speed={0.4}
            opacity={0.3}
          />
        </ScrollControls>
      </Canvas>
    </div>
  );
}
