import React, { useRef, useLayoutEffect } from 'react';
import * as THREE from 'three';

export const Seats = () => {
  const meshRef = useRef();
  const rows = 15;      // Increased rows for more depth
  const cols = 14;      // Seats per row
  const spacingX = 2.0; 
  const spacingZ = 2.0; 

  useLayoutEffect(() => {
    const dummy = new THREE.Object3D();
    let index = 0;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // Calculate position
        const x = (c - (cols - 1) / 2) * spacingX;
        
        // Curve the seating slightly like a real theater
        const curve = Math.abs(x) * 0.2; 
        const z = 12 + r * spacingZ + curve; 
        
        // Create the seat curve (stadium seating style)
        const y = -4 + (r * 0.2); 

        dummy.position.set(x, y, z);
        
        // Rotate slightly towards center screen
        dummy.lookAt(0, -2, 25); 
        
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(index++, dummy.matrix);
      }
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, []);

  return (
    <instancedMesh 
      ref={meshRef} 
      args={[null, null, rows * cols]} 
      castShadow 
      receiveShadow
    >
      {/* Simple seat geometry: Base + Back merged visually */}
      <boxGeometry args={[1.5, 1.5, 1.5]} />
      <meshStandardMaterial 
        color="#500000" 
        roughness={0.8}
        metalness={0.1}
      />
    </instancedMesh>
  );
};