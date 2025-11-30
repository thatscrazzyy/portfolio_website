import React, { useRef, useState, useImperativeHandle } from 'react';
import { useFrame } from '@react-three/fiber';
import { useCursor } from '@react-three/drei';
import * as THREE from 'three';

const THEME = {
  primary: '#dc2626',
  beam: '#fff5d6',
};

/**
 * Volumetric Light Beam
 */
const LightBeam = ({ intensity, isOn }) => {
  const mesh = useRef();
  
  useFrame((state) => {
    if (mesh.current && isOn) {
      // Flicker effect
      mesh.current.material.opacity = 0.05 + (Math.sin(state.clock.elapsedTime * 10) * 0.02 * intensity);
      mesh.current.visible = true;
    } else if (mesh.current) {
      mesh.current.visible = false;
    }
  });

  return (
    <mesh ref={mesh} position={[0, 0.2, 9]} rotation={[Math.PI / 2, 0, 0]}>
      <coneGeometry args={[3.5, 14, 64, 1, true]} />
      <meshBasicMaterial 
        color={THEME.beam} 
        transparent 
        opacity={0} 
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
  const [isOn, setIsOn] = useState(true);
  const [hovered, setHover] = useState(false);
  
  // Change cursor on hover
  useCursor(hovered);

  // Expose the internal group ref to the parent
  useImperativeHandle(ref, () => internalRef.current);

  useFrame((state, delta) => {
    // Animate reels if the projector is "On"
    if (isOn && reel1.current && reel2.current) {
      reel1.current.rotation.z -= delta * 2;
      reel2.current.rotation.z -= delta * 2;
    }
  });

  const togglePower = (e) => {
    e.stopPropagation();
    setIsOn(!isOn);
  };

  return (
    <group 
      ref={internalRef} 
      {...props} 
      dispose={null}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
      onClick={togglePower}
    >
      <group scale={hovered ? 1.05 : 1} transition="scale 0.2s">
        {/* Main Chassis */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[2, 2.5, 3.5]} />
          <meshStandardMaterial color="#111" roughness={0.3} metalness={0.8} />
        </mesh>
        
        {/* Red Stripe Detail (Glows when hovered) */}
        <mesh position={[0, 0, 0]} scale={[1.01, 1.01, 0.9]}>
          <boxGeometry args={[2, 0.2, 3.5]} />
          <meshStandardMaterial 
            color={THEME.primary} 
            emissive={THEME.primary} 
            emissiveIntensity={isOn ? 0.8 : 0.2} 
          />
        </mesh>

        {/* Lens Assembly */}
        <group position={[0, 0.2, 2]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.8, 0.9, 0.5, 32]} />
            <meshStandardMaterial color="#222" metalness={0.9} />
          </mesh>
          <mesh position={[0, 0, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.7, 0.7, 1.2, 32]} />
            <meshStandardMaterial color="#333" metalness={0.5} />
          </mesh>
          <mesh position={[0, 0, 1.1]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.6, 0.6, 0.1, 32]} />
            <meshStandardMaterial 
              color="#88c" 
              emissive="#fff" 
              emissiveIntensity={isOn ? 0.5 : 0} 
              transparent 
              opacity={0.9} 
            />
          </mesh>
        </group>

        {/* Film Reels */}
        <group position={[0, 1.8, -0.5]}>
           <group ref={reel1} position={[0, 0.5, -1]}>
              <mesh rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[1.4, 1.4, 0.3, 32]} />
                <meshStandardMaterial color="#050505" />
              </mesh>
              <mesh rotation={[0, 0, Math.PI / 2]} scale={[1.01, 0.9, 1.01]}>
                 <cylinderGeometry args={[1.4, 1.4, 0.2, 32]} />
                 <meshStandardMaterial color={THEME.primary} />
              </mesh>
           </group>
           
           <group ref={reel2} position={[0, 0.5, 0.8]}>
              <mesh rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[1.4, 1.4, 0.3, 32]} />
                <meshStandardMaterial color="#050505" />
              </mesh>
           </group>
        </group>

        {/* The Light Beam */}
        <LightBeam intensity={1} isOn={isOn} />
      </group>
    </group>
  );
});