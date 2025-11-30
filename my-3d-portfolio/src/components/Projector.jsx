import React, { useRef, useImperativeHandle } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const THEME = { primary: '#dc2626', beam: '#fff5d6' };

const LightBeam = () => {
  const mesh = useRef();
  useFrame((state) => {
    if (mesh.current) {
      // Flicker effect
      mesh.current.material.opacity = 0.06 + Math.sin(state.clock.elapsedTime * 15) * 0.02;
    }
  });

  return (
    // Position at the lens (Z=2.2) and point towards +Z
    <mesh ref={mesh} position={[0, 0.2, 2.2]} rotation={[-Math.PI / 2, 0, 0]}>
      {/* Cone geometry: radiusTop, radiusBottom, height, segments */}
      {/* Starts small (0.1), expands to 6 over a distance of 25 */}
      <cylinderGeometry args={[0.1, 6, 25, 32, 1, true]} />
      {/* Shift geometry center so the tip is at (0,0,0) */}
      <meshBasicMaterial
        color={THEME.beam}
        transparent
        opacity={0.06}
        side={THREE.DoubleSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};

export const Projector = React.forwardRef(({ ...props }, ref) => {
  const internalRef = useRef();
  const reel1 = useRef();
  const reel2 = useRef();

  useImperativeHandle(ref, () => internalRef.current);

  useFrame((state, delta) => {
    if (reel1.current && reel2.current) {
      reel1.current.rotation.z -= delta * 2;
      reel2.current.rotation.z -= delta * 2;
    }
  });

  return (
    <group ref={internalRef} {...props} dispose={null}>
      {/* Chassis */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2, 2.5, 4]} />
        <meshStandardMaterial color="#111" roughness={0.5} metalness={0.4} />
      </mesh>

      {/* Lens */}
      <mesh position={[0, 0.2, 2.2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.8, 0.9, 0.6, 32]} />
        <meshStandardMaterial color="#222" metalness={0.8} />
      </mesh>
      
      {/* Reels */}
      <group position={[0, 1.8, -0.5]}>
         <group ref={reel1} position={[0, 0.5, -1]}>
            <mesh rotation={[0, 0, Math.PI/2]}>
              <cylinderGeometry args={[1.4, 1.4, 0.3, 32]} />
              <meshStandardMaterial color="#050505" />
            </mesh>
         </group>
         <group ref={reel2} position={[0, 0.5, 0.8]}>
            <mesh rotation={[0, 0, Math.PI/2]}>
              <cylinderGeometry args={[1.4, 1.4, 0.3, 32]} />
              <meshStandardMaterial color="#050505" />
            </mesh>
         </group>
      </group>

      {/* Beam */}
      <LightBeam />
    </group>
  );
});