import React from 'react';
import * as THREE from 'three';

export const Screen = () => {
  const frameWidth = 52;
  const frameHeight = 32;
  const thickness = 1;

  return (
    <group position={[0, 0, 25]}>
      {/* The Projection Surface */}
      <mesh receiveShadow>
        <planeGeometry args={[50, 30]} />
        <meshStandardMaterial 
          color="#eeeeee" // White-ish to catch the light better
          roughness={0.9} 
          metalness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* The Frame */}
      {/* Top */}
      <mesh position={[0, 15.5, 0.1]} castShadow>
        <boxGeometry args={[frameWidth, 1, thickness]} />
        <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Bottom */}
      <mesh position={[0, -15.5, 0.1]} castShadow>
        <boxGeometry args={[frameWidth, 1, thickness]} />
        <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Left */}
      <mesh position={[-25.5, 0, 0.1]} castShadow>
        <boxGeometry args={[1, frameHeight, thickness]} />
        <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Right */}
      <mesh position={[25.5, 0, 0.1]} castShadow>
        <boxGeometry args={[1, frameHeight, thickness]} />
        <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
};