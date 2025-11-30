import React, { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ScrollControls, Float, SpotLight, Sparkles, useScroll, HemisphereLight } from '@react-three/drei';
import * as THREE from 'three';

import { Projector } from './components/Projector';
import { Screen } from './components/Screen';
import { Seats } from './components/Seats';
import { Floor } from './components/Floor'; 

const SECTIONS = 6;

const SceneLogic = ({ projectorRef, lightRef }) => {
  const scroll = useScroll();
  const { camera } = useThree();

  useFrame((state) => {
    const offset = scroll.offset; 
    
    // Projector Movement
    const projectorX = -12 + (offset * 24); 
    
    if (projectorRef.current) {
      projectorRef.current.position.x = THREE.MathUtils.lerp(projectorRef.current.position.x, projectorX, 0.05);
      projectorRef.current.position.y = 1.5 + Math.sin(state.clock.elapsedTime) * 0.3;
      // Always look at center of screen
      projectorRef.current.lookAt(0, 2.5, 25);
    }

    if (lightRef.current && projectorRef.current) {
      lightRef.current.position.copy(projectorRef.current.position);
      lightRef.current.target.position.set(0, 2.5, 25);
      lightRef.current.target.updateMatrixWorld();
    }

    // Camera follow
    const camX = projectorX * 0.2; 
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, camX, 0.05);
    // Look slightly above center screen
    camera.lookAt(0, 4, 25);
  });

  return null;
};

export default function App() {
  const projectorRef = useRef();
  const lightRef = useRef();

  return (
    <div className="w-full h-screen bg-black">
      <Canvas shadows camera={{ position: [0, 3, -12], fov: 50 }}>
        
        <fog attach="fog" args={['#020202', 15, 60]} />
        
        {/* --- LIGHTING SETUP --- */}
        
        {/* 1. Ambient Fill - Soft light so nothing is pitch black */}
        <HemisphereLight skyColor="#331111" groundColor="#000000" intensity={0.5} />

        {/* 2. House Lights - Top-down spotlight to illuminate seats */}
        <SpotLight
          position={[0, 20, 15]}
          angle={0.8}
          penumbra={0.5}
          intensity={2}
          color="#ffedd6" // Warm theater light
          castShadow
          target-position={[0, 0, 15]}
        />

        {/* 3. Projector Beam Light (Brightest) */}
        <SpotLight
          ref={lightRef}
          distance={60}
          angle={0.4}
          attenuation={5}
          anglePower={4}
          color="#fff"
          intensity={400}
          castShadow
        />

        {/* --- SCENE CONTENT --- */}

        <ScrollControls pages={SECTIONS} damping={0.2}>
          <SceneLogic projectorRef={projectorRef} lightRef={lightRef} />

          <Float speed={2} rotationIntensity={0.1} floatIntensity={0}>
            <Projector ref={projectorRef} scale={0.5} />
          </Float>

          <Screen />
          <Seats />
          <Floor />
          
          <Sparkles count={400} scale={[40, 20, 40]} size={1} speed={0.4} opacity={0.3} color="#fff" />
        </ScrollControls>
      </Canvas>
    </div>
  );
}