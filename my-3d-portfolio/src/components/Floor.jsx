import React from 'react';

export const Floor = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4.8, 20]} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial 
        color="#1a0505" 
        roughness={0.9} 
        metalness={0.1} 
      />
    </mesh>
  );
};