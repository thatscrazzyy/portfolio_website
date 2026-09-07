'use client';

import { useEffect, useState } from 'react';

export default function EasterEggs() {
  const [recruiterOpen, setRecruiterOpen] = useState(false);
  const [astronautMessage, setAstronautMessage] = useState('');

  useEffect(() => {
    let lastPointer = 0;
    const sequence = 'hireme';
    let typed = '';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setRecruiterOpen(false);
      if (event.key.length !== 1) return;
      typed = `${typed}${event.key.toLowerCase()}`.slice(-sequence.length);
      if (typed === sequence) {
        setRecruiterOpen(true);
        typed = '';
      }
    };
    const astronaut = document.querySelector('.hero-scene');
    const clickAstronaut = () => {
      setAstronautMessage('MISSION UPDATE: STILL LOOKING FOR GOOD PROBLEMS.');
      window.setTimeout(() => setAstronautMessage(''), 3600);
    };
    const keyAstronaut = (event: Event) => {
      if ((event as KeyboardEvent).key === 'Enter' || (event as KeyboardEvent).key === ' ') {
        event.preventDefault();
        clickAstronaut();
      }
    };
    astronaut?.addEventListener('click', clickAstronaut);
    astronaut?.addEventListener('keydown', keyAstronaut);

    const addStar = (event: PointerEvent) => {
      const now = performance.now();
      if (now - lastPointer < 85) return;
      lastPointer = now;
      const star = document.createElement('span');
      star.className = 'constellation-star';
      star.textContent = Math.random() > 0.7 ? '✦' : '·';
      star.style.left = `${event.clientX}px`;
      star.style.top = `${event.clientY}px`;
      document.body.appendChild(star);
      window.setTimeout(() => star.remove(), 1100);
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('pointermove', addStar, { passive: true });
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('pointermove', addStar);
      astronaut?.removeEventListener('click', clickAstronaut);
      astronaut?.removeEventListener('keydown', keyAstronaut);
    };
  }, []);

  return <>
    {astronautMessage && <div className="astronaut-toast mono" role="status">{astronautMessage}</div>}
    {recruiterOpen && <div className="recruiter-overlay" role="presentation" onClick={() => setRecruiterOpen(false)}>
      <section className="recruiter-card" role="dialog" aria-modal="true" aria-labelledby="recruiter-title" onClick={event => event.stopPropagation()}>
        <button type="button" className="recruiter-close mono" onClick={() => setRecruiterOpen(false)} aria-label="Close recruiter mode">CLOSE ×</button>
        <p className="mono">CLASSIFIED RECRUITER CHANNEL</p>
        <h2 id="recruiter-title">YOU FOUND<br/>THE SHORTCUT.</h2>
        <p>I build useful software, explain the tradeoffs, and stay close to the people using it.</p>
        <div className="recruiter-links"><a href="mailto:thesamarthjagtap@gmail.com">EMAIL SAMARTH ↗</a><a href="https://www.linkedin.com/in/thesamarthjagtap/" target="_blank" rel="noreferrer">LINKEDIN ↗</a><a href="https://github.com/thatscrazzyy" target="_blank" rel="noreferrer">GITHUB ↗</a></div>
        <small className="mono">(The shortcut was H I R E M E. Obviously.)</small>
      </section>
    </div>}
  </>;
}
