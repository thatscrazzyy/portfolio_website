// src/components/Seats.jsx
import React from 'react';

export const Seats = () => {
  const rows = 6;        // number of seat rows
  const cols = 12;       // seats per row
  const spacingX = 2.2;  // left/right spacing
  const spacingZ = 2.3;  // front/back spacing

  const meshes = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = (c - (cols - 1) / 2) * spacingX; // center the grid
      const z = 16 + r * spacingZ;               // push seats toward the screen

      meshes.push(
        <group key={`${r}-${c}`} position={[x, -4, z]}>
          {/* base cushion */}
          <mesh castShadow>
            <boxGeometry args={[1.7, 0.7, 1.4]} />
            <meshStandardMaterial
              color="#7f1d1d" // deep red
              roughness={0.4}
              metalness={0.1}
            />
          </mesh>
          {/* backrest */}
          <mesh position={[0, 0.9, -0.3]} castShadow>
            <boxGeometry args={[1.7, 1.4, 0.5]} />
            <meshStandardMaterial
              color="#991b1b"
              roughness={0.4}
              metalness={0.1}
            />
          </mesh>
        </group>
      );
    }
  }

  return <group>{meshes}</group>;
};
