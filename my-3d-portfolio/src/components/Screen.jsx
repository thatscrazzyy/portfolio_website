import React, { useRef } from 'react';
import * as THREE from 'three';
import { Text, useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

// New Font URL (serif style like the overlay)
const FONT_URL = "https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD-vYSZviVYUb_rj3ij__anTJ.woff";

const CREDITS = [
  // Main Title: Large, White, Serif
  { size: 5, text: "SAMARTH JAGTAP", color: "#ffffff", font: FONT_URL },
  // Subtitle: Red, Monospace style for contrast
  { size: 1.8, text: "DIRECTOR & DEVELOPER", color: "#dc2626", font: "" }, // Use default font for contrast
  { size: 2, text: "", color: "#000" }, // spacer
  // Section Headers
  { size: 3.5, text: "FEATURED PROJECTS", color: "#ffffff", font: FONT_URL },
  { size: 1.8, text: "Project Alpha • The Algorithm • Vision", color: "#cccccc", font: "" },
  { size: 2, text: "", color: "#000" }, // spacer
  { size: 3.5, text: "TECH STACK", color: "#ffffff", font: FONT_URL },
  { size: 1.8, text: "React • Three.js • Python • AWS", color: "#cccccc", font: "" },
  { size: 2, text: "", color: "#000" }, // spacer
  { size: 3.5, text: "CONTACT", color: "#ffffff", font: FONT_URL },
  { size: 1.8, text: "open for collaborations", color: "#cccccc", font: "" },
];

export const Screen = () => {
  const scroll = useScroll();
  const textGroup = useRef();

  // Screen Curve Settings
  const screenWidth = 55; 
  const screenHeight = 28;
  const curveRadius = 70; 
  const thetaLength = screenWidth / curveRadius; 
  const thetaStart = -thetaLength / 2;
  const sagitta = curveRadius - Math.sqrt(Math.pow(curveRadius, 2) - Math.pow(screenWidth / 2, 2));
  const textZ = -sagitta - 0.5;

  useFrame(() => {
    // Scroll Text UP faster
    const targetY = -20 + (scroll.offset * 50); 
    if(textGroup.current) {
      textGroup.current.position.y = targetY;
    }
  });

  return (
    <group position={[0, 3, 25]}>
      
      {/* Curved Screen Surface */}
      <mesh position={[0, 0, -curveRadius]} receiveShadow>
        <cylinderGeometry args={[curveRadius, curveRadius, screenHeight, 64, 1, true, thetaStart, thetaLength]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0.3}
          roughness={0.4}
          side={THREE.BackSide} 
        />
      </mesh>

      {/* CREDITS GROUP */}
      <group ref={textGroup} position={[0, -10, textZ]}> 
        {/* Rotate 180 deg to face camera */}
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
                  font={item.font || undefined} // Use custom font if specified
                  outlineWidth={0.02}
                  outlineColor="#000000"
                >
                  {item.text}
                  {/* Add emissive material for a glowing effect */}
                  <meshStandardMaterial
                    color={item.color}
                    emissive={item.color}
                    emissiveIntensity={0.6}
                  />
                </Text>
              );
            })}
        </group>
      </group>

      {/* Masking Bars */}
      <mesh position={[0, screenHeight/2 + 5, textZ + 0.5]}>
         <planeGeometry args={[screenWidth + 20, 15]} />
         <meshBasicMaterial color="#000" />
      </mesh>
      <mesh position={[0, -screenHeight/2 - 5, textZ + 0.5]}>
         <planeGeometry args={[screenWidth + 20, 15]} />
         <meshBasicMaterial color="#000" />
      </mesh>

    </group>
  );
};