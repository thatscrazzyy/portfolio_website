import React, { useRef } from 'react';
import * as THREE from 'three';
import { Text, useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

// Serif font for title
const FONT_URL =
  'https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD-vYSZviVYUb_rj3ij__anTJ.woff';

// Edit this to be your "credits" / portfolio content
const CREDITS = [
  { size: 5, text: 'SAMARTH JAGTAP', color: '#ffffff', font: FONT_URL },
  { size: 1.8, text: 'DIRECTOR & DEVELOPER', color: '#dc2626', font: '' },
  { size: 2, text: '', color: '#000000' },

  { size: 3.5, text: 'FEATURED PROJECTS', color: '#ffffff', font: FONT_URL },
  {
    size: 1.8,
    text: 'Quickdrop • Travel Discovery • Winning Platform',
    color: '#cccccc',
    font: '',
  },
  { size: 2, text: '', color: '#000000' },

  { size: 3.5, text: 'TECH STACK', color: '#ffffff', font: FONT_URL },
  {
    size: 1.8,
    text: 'React • Three.js • Python • Node • AWS • GCP',
    color: '#cccccc',
    font: '',
  },
  { size: 2, text: '', color: '#000000' },

  { size: 3.5, text: 'CONTACT', color: '#ffffff', font: FONT_URL },
  {
    size: 1.8,
    text: 'Open for collaborations & cool ideas',
    color: '#cccccc',
    font: '',
  },
];

export const Screen = () => {
  const scroll = useScroll();
  const textGroup = useRef();

  // Screen dimensions and curvature
  const screenWidth = 55;
  const screenHeight = 28;
  const curveRadius = 70;

  const thetaLength = screenWidth / curveRadius; // radians of arc
  const thetaStart = -thetaLength / 2;

  // Camera is at z = -12 looking +z, so put screen in front
  const SCREEN_Z = 20;

  useFrame(() => {
    if (!textGroup.current) return;

    const offset = scroll.offset; // 0 → 1 across all ScrollControls pages
    const baseY = -10; // starting vertical offset
    const scrollRange = 50; // how far the credits travel up

    textGroup.current.position.y = baseY + offset * scrollRange;
  });

  return (
    <group position={[0, 3, SCREEN_Z]}>
      {/* Curved screen surface */}
      <mesh receiveShadow>
        <cylinderGeometry
          args={[curveRadius, curveRadius, screenHeight, 64, 1, true, thetaStart, thetaLength]}
        />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0.2}
          roughness={0.4}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Scrolling credits slightly in front of the screen */}
      <group ref={textGroup} position={[0, -10, 1]}>
        {/* Face the camera (camera is on negative z looking toward positive z) */}
        <group rotation={[0, Math.PI, 0]}>
          {CREDITS.map((item, index) => {
            const yPos = -index * 2.8;
            return (
              <Text
                key={index}
                position={[0, yPos, 0]}
                fontSize={item.size}
                color={item.color}
                anchorX="center"
                anchorY="middle"
                font={item.font || undefined}
                outlineWidth={0.02}
                outlineColor="#000000"
              >
                {item.text}
              </Text>
            );
          })}
        </group>
      </group>

      {/* Black bars above and below to fake letterbox / cropping */}
      <mesh position={[0, screenHeight / 2 + 5, 1.5]}>
        <planeGeometry args={[screenWidth + 20, 15]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      <mesh position={[0, -screenHeight / 2 - 5, 1.5]}>
        <planeGeometry args={[screenWidth + 20, 15]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
    </group>
  );
};
