// src/components/Screen.jsx
import React, { useRef, useState } from 'react';
import * as THREE from 'three';
import { Text, useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

const SECTIONS = 4;

export const Screen = () => {
  const frameWidth = 52;
  const frameHeight = 32;
  const thickness = 1;

  const scroll = useScroll();
  const [section, setSection] = useState(0);
  const sectionRef = useRef(0);

  useFrame(() => {
    const offset = scroll.offset; // 0–1
    const current = Math.round(offset * (SECTIONS - 1));
    if (current !== sectionRef.current) {
      sectionRef.current = current;
      setSection(current);
    }
  });

  const getSlideContent = () => {
    switch (section) {
      case 0:
        return {
          heading: 'Samarth Jagtap',
          sub: 'Software Engineer · AI · 3D · Filmmaking',
        };
      case 1:
        return {
          heading: 'Featured Projects',
          sub: 'Quickdrop · Winning Data Platform · Travel Discovery App',
        };
      case 2:
        return {
          heading: 'Tech Stack',
          sub: 'React · Three.js · Python · Node · Postgres · AWS / GCP',
        };
      case 3:
      default:
        return {
          heading: 'Now Casting',
          sub: "Open to internships & collabs — let’s build something wild.",
        };
    }
  };

  const content = getSlideContent();

  return (
    <group position={[0, 0, 25]}>
      {/* Dark wall behind screen */}
      <mesh receiveShadow>
        <planeGeometry args={[60, 35]} />
        <meshStandardMaterial color="#050505" />
      </mesh>

      {/* The Projection Surface (white rectangle like the image) */}
      <mesh position={[0, 0, 0.01]} receiveShadow>
        <planeGeometry args={[46, 22]} />
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.9}
          metalness={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Frame (thin black border) */}
      <mesh position={[0, 11.5, 0.02]} castShadow>
        <boxGeometry args={[48, 1, thickness]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0, -11.5, 0.02]} castShadow>
        <boxGeometry args={[48, 1, thickness]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[-24, 0, 0.02]} castShadow>
        <boxGeometry args={[1, 23, thickness]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[24, 0, 0.02]} castShadow>
        <boxGeometry args={[1, 23, thickness]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* Curtains (simple red planes on each side) */}
      <mesh position={[-29, 0, -1]} castShadow>
        <planeGeometry args={[10, 35]} />
        <meshStandardMaterial
          color="#7f1d1d"
          roughness={0.7}
          metalness={0.05}
        />
      </mesh>
      <mesh position={[29, 0, -1]} castShadow>
        <planeGeometry args={[10, 35]} />
        <meshStandardMaterial
          color="#7f1d1d"
          roughness={0.7}
          metalness={0.05}
        />
      </mesh>

      {/* PROJECTED TEXT */}
      <Text
        position={[0, 3, 0.03]}
        fontSize={3}
        maxWidth={36}
        textAlign="center"
        color="#111111"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="#fefefe"
      >
        {content.heading}
      </Text>

      <Text
        position={[0, -3, 0.03]}
        fontSize={1.3}
        maxWidth={40}
        textAlign="center"
        color="#222222"
        anchorX="center"
        anchorY="middle"
      >
        {content.sub}
      </Text>
    </group>
  );
};
