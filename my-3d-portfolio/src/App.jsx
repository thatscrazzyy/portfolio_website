import React, { useRef, useState, useImperativeHandle } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ScrollControls, Scroll, useScroll, Float, Sparkles, SpotLight, useCursor } from '@react-three/drei';
import * as THREE from 'three';
import { Github, Mail, Clapperboard, Film, SkipForward } from 'lucide-react';

/**
 * CINEMATIC 3D PORTFOLIO - RED & BLACK EDITION
 * Consolidated Single-File Version for Preview Stability
 */

// --- Constants ---
const SECTIONS = 4;
const THEME = {
  primary: '#dc2626', // Red-600
  dark: '#050000',    // Deep Red/Black
  light: '#ffffff',
  beam: '#fff5d6',    // Warm projector light
};

// --- HTML Overlay Components ---

const Section = ({ children, className = "" }) => (
  <section className={`h-screen flex flex-col justify-center p-10 ${className}`}>
    {children}
  </section>
);

const ProjectCard = ({ title, tech, desc }) => (
  <div className="bg-black/90 border-l-4 border-red-600 p-6 max-w-md transform hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(220,38,38,0.2)] group pointer-events-auto cursor-default">
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-2xl font-serif font-bold text-white group-hover:text-red-500 transition-colors">{title}</h3>
      <Film className="text-red-600 opacity-50 group-hover:opacity-100" size={24} />
    </div>
    <p className="text-gray-400 text-sm mb-4 leading-relaxed font-mono">{desc}</p>
    <div className="flex flex-wrap gap-2">
      {tech.map((t, i) => (
        <span key={i} className="text-xs bg-red-900/20 px-2 py-1 text-red-400 border border-red-900/30 uppercase tracking-wider">{t}</span>
      ))}
    </div>
  </div>
);

const Overlay = () => {
  return (
    <Scroll html>
      <div className="w-screen text-white font-sans pointer-events-none">
        
        {/* HERO */}
        <Section className="items-center text-center">
          <div className="relative">
             <h1 className="text-8xl md:text-9xl font-black font-serif tracking-tighter mb-4 text-white drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]">
               DIRECTOR
             </h1>
             <div className="absolute -inset-1 bg-red-600/20 blur-xl -z-10 rounded-full"></div>
          </div>
          <p className="text-xl md:text-2xl font-light text-red-500 max-w-2xl uppercase tracking-[0.5em] mb-12">
            A Cinematic Portfolio
          </p>
          <div className="animate-pulse flex flex-col items-center gap-2">
            <span className="text-gray-500 text-xs font-mono uppercase">Scroll to Play</span>
            <SkipForward size={24} className="text-red-600 rotate-90" />
          </div>
        </Section>

        {/* PROJECTS */}
        <Section className="items-end pr-10 md:pr-40">
          <div className="mb-12 text-right">
             <h2 className="text-6xl font-serif font-bold mb-2 text-white">NOW SHOWING</h2>
             <div className="text-red-600 font-mono tracking-widest text-sm">HALL 01 • SELECTED WORKS</div>
          </div>
          <div className="grid gap-8">
            <ProjectCard 
              title="THE ALGORITHM"
              desc="A computer vision model that detects emotional shifts in real-time video feeds."
              tech={['Python', 'OpenCV', 'PyTorch']}
            />
            <ProjectCard 
              title="CLOUD ATLAS"
              desc="Scalable microservices architecture handling 10k+ requests/sec."
              tech={['Go', 'Kubernetes', 'AWS']}
            />
          </div>
        </Section>

        {/* SKILLS */}
        <Section className="items-start pl-10 md:pl-40">
          <div className="mb-12">
             <h2 className="text-6xl font-serif font-bold mb-2 text-white">CREDITS</h2>
             <div className="text-red-600 font-mono tracking-widest text-sm">CAST & CREW • TECH STACK</div>
          </div>
          <div className="grid grid-cols-2 gap-12 max-w-2xl bg-black/80 p-8 border border-red-900/30 backdrop-blur-sm pointer-events-auto">
            <div>
              <h3 className="text-red-500 font-bold text-lg tracking-widest uppercase mb-6 border-b border-red-900/50 pb-2">Starring</h3>
              <ul className="space-y-4 text-gray-300 font-mono text-sm">
                <li className="flex items-center gap-3"><span className="w-2 h-2 bg-red-600 rounded-full"></span>React / Next.js</li>
                <li className="flex items-center gap-3"><span className="w-2 h-2 bg-red-600 rounded-full"></span>Three.js / R3F</li>
              </ul>
            </div>
            <div>
              <h3 className="text-red-500 font-bold text-lg tracking-widest uppercase mb-6 border-b border-red-900/50 pb-2">Co-Starring</h3>
              <ul className="space-y-4 text-gray-300 font-mono text-sm">
                <li className="flex items-center gap-3"><span className="w-2 h-2 bg-red-600 rounded-full"></span>Node.js</li>
                <li className="flex items-center gap-3"><span className="w-2 h-2 bg-red-600 rounded-full"></span>PostgreSQL</li>
              </ul>
            </div>
          </div>
        </Section>

        {/* CONTACT */}
        <Section className="items-center text-center">
          <div className="bg-black border border-red-900/30 p-16 max-w-3xl relative shadow-[0_0_50px_rgba(220,38,38,0.1)] pointer-events-auto">
             <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-600 p-4 shadow-lg">
                <Clapperboard size={40} color="black" />
             </div>
             
             <h2 className="text-5xl font-serif font-bold mb-6 mt-6 text-white">IT'S A WRAP</h2>
             <p className="text-gray-400 mb-10 text-xl font-light">
                Available for new productions.
             </p>
             
             <div className="flex justify-center gap-8">
               <button className="flex items-center gap-3 px-8 py-4 bg-red-600 text-black font-bold uppercase tracking-widest hover:bg-red-500 transition-colors shadow-lg hover:shadow-red-600/50">
                 <Mail size={20} /> Contact
               </button>
               <button className="flex items-center gap-3 px-8 py-4 border border-red-600 text-red-500 font-bold uppercase tracking-widest hover:bg-red-900/20 transition-colors">
                 <Github size={20} /> GitHub
               </button>
             </div>
          </div>
          <footer className="mt-20 text-red-900/50 text-xs font-mono uppercase tracking-[0.3em]">
             © 2024 Director Portfolio • React Three Fiber
          </footer>
        </Section>

      </div>
    </Scroll>
  );
};

// --- 3D Components ---

/**
 * Volumetric Light Beam (Part of Projector)
 */
const LightBeam = ({ intensity, isOn }) => {
  const mesh = useRef();
  
  useFrame((state) => {
    if (mesh.current && isOn) {
      // Flicker effect simulating dust/old bulb
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

/**
 * Interactive Projector
 * Click to toggle light/animation, Hover for feedback
 */
const Projector = React.forwardRef(({ ...props }, ref) => {
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

/**
 * Cinema Screen
 * Catches the spotlight at the back of the room
 */
const Screen = () => {
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

// --- Scene Logic ---

/**
 * Scene Director
 * Controls the camera movement and spotlight aiming based on scroll
 */
const SceneDirector = ({ projectorRef, lightRef }) => {
  const scroll = useScroll();

  useFrame((state, delta) => {
    // Current scroll ranges (0 to 1)
    const r2 = scroll.range(1 / SECTIONS, 1 / SECTIONS);
    const r3 = scroll.range(2 / SECTIONS, 1 / SECTIONS);
    const r4 = scroll.range(3 / SECTIONS, 1 / SECTIONS);

    // 1. Move Projector through the room
    const targetX = 0 + (r2 * 4) - (r3 * 8) + (r4 * 4); 
    const targetY = 0 - (r2 * 1) + (r4 * 1);
    const targetZ = 0 + (r2 * 5) - (r3 * 2) + (r4 * 5);
    
    // Rotate slightly
    const rotY = 0 - (r2 * 0.3) + (r3 * 0.3);
    
    if (projectorRef.current) {
        projectorRef.current.position.lerp(new THREE.Vector3(targetX, targetY, targetZ), 0.04);
        projectorRef.current.rotation.y = THREE.MathUtils.lerp(projectorRef.current.rotation.y, rotY, 0.05);
        
        // Add subtle breathing motion
        projectorRef.current.position.y += Math.sin(state.clock.elapsedTime) * 0.002;
    }

    // 2. Control the Spotlight
    if (lightRef.current && projectorRef.current) {
        // Light originates from the projector
        const lightPos = projectorRef.current.position.clone().add(new THREE.Vector3(0, 0, 2));
        lightRef.current.position.lerp(lightPos, 0.1);
        
        // Target is the screen at Z=25
        lightRef.current.target.position.set(targetX * 0.5, targetY, 25);
        lightRef.current.target.updateMatrixWorld();
    }
  });

  return null;
};

const Background = () => (
  <group>
    <fog attach="fog" args={['#050000', 5, 45]} />
    <Sparkles count={300} scale={20} size={3} speed={0.4} opacity={0.4} color="#ff0000" />
    <gridHelper args={[50, 50, 0x330000, 0x110000]} position={[0, -4, 0]} />
  </group>
);

// --- Main App ---

export default function App() {
  const projectorRef = useRef();
  const lightRef = useRef();

  return (
    <div className="w-full h-screen bg-[#050000]">
      <Canvas shadows camera={{ position: [0, 0, 10], fov: 35 }}>
        <ambientLight intensity={0.1} color="#ff0000" />
        
        <ScrollControls pages={4} damping={0.2}>
          <SceneDirector projectorRef={projectorRef} lightRef={lightRef} />
          <Overlay />
          
          <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
             <Projector ref={projectorRef} scale={0.4} />
          </Float>

          <SpotLight 
            ref={lightRef}
            position={[0, 0, 0]} 
            distance={40} 
            angle={0.6} 
            attenuation={10} 
            anglePower={4} 
            color="#fff5d6"
            castShadow
            penumbra={0.2}
          />
          
          <Screen />
          <Background />
        </ScrollControls>
      </Canvas>
    </div>
  );
}