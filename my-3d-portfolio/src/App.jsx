import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ScrollControls, Scroll, useScroll, Float, Sparkles, SpotLight } from '@react-three/drei';
import * as THREE from 'three';
import { Github, ExternalLink, Mail, Clapperboard, Film, Video } from 'lucide-react';

/**
 * CINEMATIC 3D PORTFOLIO
 * Features:
 * 1. A procedurally generated 3D Projector (no external assets).
 * 2. Scroll-driven animation logic.
 * 3. Dynamic lighting that reveals content.
 */

// --- Constants ---
const SECTION_HEIGHT = 1; // Base scroll unit
const SECTIONS = 4;
const BEAM_COLOR = '#fff5b6'; // Warm movie light

// --- 3D Components ---

/**
 * The Hero Projector Model
 * Built using primitives to ensure it runs without 404ing on external .glb files
 */
const RetroProjector = React.forwardRef(({ ...props }, ref) => {
  return (
    <group ref={ref} {...props} dispose={null}>
      {/* Main Body */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 2, 3]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.6} />
      </mesh>
      
      {/* Lens Barrel */}
      <mesh position={[0, 0, 1.8]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.6, 0.7, 1, 32]} />
        <meshStandardMaterial color="#111" roughness={0.2} metalness={0.8} />
      </mesh>
      
      {/* Lens Glass (Emissive) */}
      <mesh position={[0, 0, 2.31]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.1, 32]} />
        <meshStandardMaterial color="#555" emissive="#fff" emissiveIntensity={0.2} roughness={0} metalness={1} />
      </mesh>

      {/* Film Reels (Top) */}
      <group position={[0, 1.5, 0]}>
         {/* Reel 1 */}
         <mesh position={[0, 0, -0.8]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[1.2, 1.2, 0.2, 32]} />
            <meshStandardMaterial color="#333" />
         </mesh>
         {/* Reel 2 */}
         <mesh position={[0, 0, 0.8]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[1.2, 1.2, 0.2, 32]} />
            <meshStandardMaterial color="#333" />
         </mesh>
      </group>

      {/* Side Detail (Motor housing) */}
      <mesh position={[0.9, 0, 0]}>
         <boxGeometry args={[0.5, 1.5, 1.5]} />
         <meshStandardMaterial color="#222" />
      </mesh>
    </group>
  );
});

/**
 * The "Beam" of light
 * A visible cone that simulates volumetric lighting
 */
const LightBeam = ({ intensity }) => {
  const mesh = useRef();
  
  useFrame(() => {
    if (mesh.current) {
        // Subtle flicker effect
        mesh.current.material.opacity = 0.1 + (Math.random() * 0.05 * intensity);
    }
  });

  return (
    <mesh ref={mesh} position={[0, 0, 6]} rotation={[Math.PI / 2, 0, 0]}>
      <coneGeometry args={[2, 8, 32, 1, true]} />
      <meshBasicMaterial 
        color={BEAM_COLOR} 
        transparent 
        opacity={0.1} 
        side={THREE.DoubleSide} 
        depthWrite={false} 
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};

/**
 * Main Scene Logic
 * Controls the movement of the projector based on scroll
 */
const SceneDirector = () => {
  const scroll = useScroll();
  const projectorRef = useRef();
  const lightRef = useRef();
  const { width, height } = useThree((state) => state.viewport);

  useFrame((state, delta) => {
    // Current scroll position (0 to 1)
    const r1 = scroll.range(0 / SECTIONS, 1 / SECTIONS); // Home
    const r2 = scroll.range(1 / SECTIONS, 1 / SECTIONS); // Projects
    const r3 = scroll.range(2 / SECTIONS, 1 / SECTIONS); // Skills
    const r4 = scroll.range(3 / SECTIONS, 1 / SECTIONS); // Contact

    // Interpolate Position
    // We move the projector to "look" at different parts of the screen
    const targetX = 0 + (r2 * 3) - (r3 * 6) + (r4 * 3); 
    const targetY = 0 - (r2 * 2) - (r3 * 0) + (r4 * 2);
    const targetZ = 0 + (r2 * 2) - (r3 * 1) + (r4 * 2);
    
    // Rotate to face content
    const rotY = 0 - (r2 * 0.5) + (r3 * 0.5);
    
    // Smooth Animation (Damping)
    if (projectorRef.current) {
        projectorRef.current.position.lerp(new THREE.Vector3(targetX, targetY, targetZ), 0.05);
        projectorRef.current.rotation.y = THREE.MathUtils.lerp(projectorRef.current.rotation.y, rotY, 0.05);
    }

    // Light Intensity Logic
    // Brighten when settled on a section, dim during transition
    const isTransitioning = (scroll.scroll.current * SECTIONS) % 1 > 0.8 || (scroll.scroll.current * SECTIONS) % 1 < 0.2;
    const targetIntensity = isTransitioning ? 2 : 10;
    
    if (lightRef.current) {
        lightRef.current.intensity = THREE.MathUtils.lerp(lightRef.current.intensity, targetIntensity, 0.1);
        // Spotlight movement
        lightRef.current.position.lerp(new THREE.Vector3(targetX, targetY, targetZ + 2.5), 0.1);
        lightRef.current.target.position.set(targetX, targetY, 20);
        lightRef.current.target.updateMatrixWorld();
    }
  });

  return (
    <>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <group ref={projectorRef}>
            <RetroProjector scale={0.5} />
            <LightBeam intensity={1} />
        </group>
      </Float>

      {/* The Actual Light Source */}
      <SpotLight 
        ref={lightRef}
        position={[0, 0, 2]} 
        distance={20} 
        angle={0.5} 
        attenuation={5} 
        anglePower={5} 
        color={BEAM_COLOR}
      />
    </>
  );
};

// --- HTML Content (Overlay) ---

const Section = ({ children, className = "" }) => (
  <section className={`h-screen flex flex-col justify-center p-10 ${className}`}>
    {children}
  </section>
);

const ProjectCard = ({ title, tech, desc }) => (
  <div className="bg-black/80 backdrop-blur-md border border-white/10 p-6 rounded-sm max-w-md hover:border-red-500/50 transition-colors group">
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-2xl font-serif font-bold text-white group-hover:text-red-500 transition-colors">{title}</h3>
      <Film className="text-gray-600 group-hover:text-red-500" size={20} />
    </div>
    <p className="text-gray-400 text-sm mb-4 leading-relaxed font-mono">{desc}</p>
    <div className="flex flex-wrap gap-2">
      {tech.map((t, i) => (
        <span key={i} className="text-xs bg-white/5 px-2 py-1 rounded text-yellow-500/80 border border-white/5">{t}</span>
      ))}
    </div>
  </div>
);

const HtmlOverlay = () => {
  return (
    <Scroll html>
      <div className="w-screen text-white font-sans selection:bg-red-500 selection:text-white">
        
        {/* SECTION 1: HERO */}
        <Section className="items-center text-center">
          <h1 className="text-7xl md:text-9xl font-black font-serif tracking-tighter mb-4 opacity-90 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            DIRECTOR
          </h1>
          <p className="text-xl md:text-2xl font-light text-gray-400 max-w-2xl">
            Bringing code to the big screen.
          </p>
          <div className="mt-8 animate-bounce text-yellow-500/50 text-xs font-mono uppercase tracking-widest">
            Scroll to begin projection
          </div>
        </Section>

        {/* SECTION 2: PROJECTS (Aligned Right) */}
        <Section className="items-end pr-10 md:pr-32">
          <div className="mb-12 text-right">
             <h2 className="text-5xl font-serif font-bold mb-2">Selected Works</h2>
             <div className="h-1 w-24 bg-red-600 ml-auto" />
          </div>
          <div className="grid gap-6">
            <ProjectCard 
              title="Neural Network"
              desc="A visualizer for AI decision making processes rendered in real-time WebGL."
              tech={['Python', 'Three.js', 'PyTorch']}
            />
            <ProjectCard 
              title="CineStream"
              desc="High-throughput video encoding pipeline designed for 4K streaming services."
              tech={['Go', 'AWS Lambda', 'FFmpeg']}
            />
          </div>
        </Section>

        {/* SECTION 3: SKILLS (Aligned Left) */}
        <Section className="items-start pl-10 md:pl-32">
          <div className="mb-12">
             <h2 className="text-5xl font-serif font-bold mb-2">Tech Stack</h2>
             <div className="h-1 w-24 bg-red-600 mr-auto" />
          </div>
          <div className="grid grid-cols-2 gap-8 max-w-2xl bg-black/60 p-8 border border-white/10 backdrop-blur-sm">
            <div>
              <h3 className="text-yellow-500 font-mono text-xs tracking-widest uppercase mb-4">Frontend</h3>
              <ul className="space-y-2 text-gray-300 font-light">
                <li>React / Next.js</li>
                <li>Three.js / R3F</li>
                <li>Tailwind CSS</li>
                <li>TypeScript</li>
              </ul>
            </div>
            <div>
              <h3 className="text-yellow-500 font-mono text-xs tracking-widest uppercase mb-4">Backend</h3>
              <ul className="space-y-2 text-gray-300 font-light">
                <li>Node.js</li>
                <li>Python / Django</li>
                <li>PostgreSQL</li>
                <li>Docker / K8s</li>
              </ul>
            </div>
          </div>
        </Section>

        {/* SECTION 4: CONTACT (Centered) */}
        <Section className="items-center text-center">
          <div className="bg-gray-900 border border-white/10 p-12 max-w-2xl relative shadow-2xl">
             <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-600 p-3 rounded-full">
                <Clapperboard size={32} color="white" />
             </div>
             
             <h2 className="text-4xl font-serif font-bold mb-6 mt-4">That's a Wrap.</h2>
             <p className="text-gray-400 mb-8 text-lg">
                Ready to start production on your next big idea? Let's talk.
             </p>
             
             <div className="flex justify-center gap-6">
               <button className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold hover:bg-gray-200 transition-colors">
                 <Mail size={18} /> Contact Me
               </button>
               <button className="flex items-center gap-2 px-6 py-3 border border-white/30 text-white font-bold hover:bg-white/10 transition-colors">
                 <Github size={18} /> GitHub
               </button>
             </div>
          </div>
          <footer className="mt-20 text-gray-600 text-xs font-mono uppercase tracking-widest">
             © 2024 Director Portfolio • Built with React Three Fiber
          </footer>
        </Section>

      </div>
    </Scroll>
  );
}

// --- Background ---

const Background = () => {
    return (
        <group>
             {/* Dust motes floating in the air */}
             <Sparkles count={200} scale={12} size={2} speed={0.4} opacity={0.2} color="#fff" />
             {/* A subtle floor grid that fades out */}
             <gridHelper args={[20, 20, 0xffffff, 0x444444]} position={[0, -4, 0]} />
        </group>
    )
}

// --- Main App ---

export default function App() {
  return (
    <div className="w-full h-screen bg-[#050505]">
      <Canvas shadows camera={{ position: [0, 0, 10], fov: 35 }}>
        {/* Ambient light for base visibility */}
        <ambientLight intensity={0.2} />
        
        {/* Scroll Controls Container */}
        <ScrollControls pages={4} damping={0.2}>
          
          {/* The Content Overlay (HTML) */}
          <HtmlOverlay />
          
          {/* The 3D Logic */}
          <SceneDirector />
          
          {/* Environment */}
          <Background />

        </ScrollControls>
      </Canvas>
    </div>
  );
}