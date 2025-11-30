import React from 'react';
import { Scroll } from '@react-three/drei';
import { Github, Mail, Clapperboard, Film, SkipForward } from 'lucide-react';

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

export const Overlay = () => {
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