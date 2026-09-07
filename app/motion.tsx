'use client';
import { useEffect } from 'react';
export default function Motion() {
  useEffect(() => {
    let disposed = false;
    let revert = () => {};
    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    const start = async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);
      if (disposed) return;
      gsap.registerPlugin(ScrollTrigger);
      const media = gsap.matchMedia();
      revert = () => media.revert();
      media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.hero h1 span', { y: 22, opacity: 0, stagger: .09, duration: 1.1, ease: 'power3.out', clearProps: 'all' });
      gsap.from('.intro, .hero-note, .scroll-link', { opacity: 0, y: 15, stagger: .12, duration: .8, delay: .5, clearProps: 'all' });
      gsap.to('.astronaut-layer', { y: -9, rotation: .6, duration: 4.5, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      gsap.to('.hero-image', { yPercent: 4, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } });
      gsap.utils.toArray<HTMLElement>('.project, .selected-work, .about, .experience, .contact, .quote-strip').forEach((element) => {
        gsap.from(element, { y: 18, opacity: 0, duration: .85, ease: 'power2.out', clearProps: 'all', scrollTrigger: { trigger: element, start: 'top 96%', once: true } });
      });
      gsap.to('.reading-progress', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: true } });
      const refresh = () => ScrollTrigger.refresh();
      document.querySelectorAll('img').forEach(img => { if (!img.complete) img.addEventListener('load', refresh, { once: true }); });
      document.querySelectorAll('details').forEach(detail => detail.addEventListener('toggle', refresh));
      document.fonts.ready.then(refresh);
        return () => {
        document.querySelectorAll('img').forEach(img => img.removeEventListener('load', refresh));
        document.querySelectorAll('details').forEach(detail => detail.removeEventListener('toggle', refresh));
      };
      });
    };
    if ('requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(() => void start(), { timeout: 800 });
    } else {
      timeoutId = setTimeout(() => void start(), 250);
    }
    return () => {
      disposed = true;
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
      if (timeoutId !== undefined) clearTimeout(timeoutId);
      revert();
    };
  }, []);
  return <div className="reading-progress" aria-hidden="true"/>;
}
