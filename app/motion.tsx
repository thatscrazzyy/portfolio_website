'use client';
import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
export default function Motion() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.hero h1 span', { y: 45, opacity: 0, stagger: .09, duration: 1.1, ease: 'power3.out', clearProps: 'all' });
      gsap.from('.intro, .hero-note, .scroll-link', { opacity: 0, y: 15, stagger: .12, duration: .8, delay: .5, clearProps: 'all' });
      gsap.to('.hero-image', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } });
      gsap.utils.toArray<HTMLElement>('.project, .selected-work, .about, .experience, .contact, .quote-strip').forEach((element) => {
        gsap.from(element, { y: 30, opacity: 0, duration: .85, ease: 'power2.out', clearProps: 'all', scrollTrigger: { trigger: element, start: 'top 96%', once: true } });
      });
      gsap.to('.reading-progress', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: true } });
      gsap.to('.explore-panel svg', { rotationY: 360, duration: 20, repeat: -1, ease: 'none' });
    });
    return () => media.revert();
  }, []);
  return <div className="reading-progress" aria-hidden="true"/>;
}
