'use client';

import { useEffect, useState } from 'react';

type Stamp = { id: string; createdAt: string; color: string; symbol: string };

const statusLines = [
  'STATUS: PROBABLY OVERTHINKING IT',
  'STATUS: SHIP IT, THEN CHECK THE LOGS',
  'STATUS: ASK ME ABOUT THE ROBOT',
  'STATUS: THE ASTRONAUT HAS A PLAN',
  'STATUS: NOMINALLY STABLE',
];

export default function EasterEggs() {
  const [recruiterOpen, setRecruiterOpen] = useState(false);
  const [stampCount, setStampCount] = useState<number | null>(null);
  const [stamps, setStamps] = useState<Stamp[]>([]);
  const [stampMessage, setStampMessage] = useState('');
  const [astronautMessage, setAstronautMessage] = useState('');

  useEffect(() => {
    let disposed = false;
    let lastPointer = 0;
    const loadStamps = async () => {
      try {
        const response = await fetch('/api/stamp', { cache: 'no-store' });
        if (!response.ok) return;
        const data = await response.json() as { count: number; stamps: Stamp[] };
        if (!disposed) {
          setStampCount(data.count);
          setStamps(data.stamps);
        }
      } catch {
        // The easter egg stays optional if the stamp service is unavailable.
      }
    };
    void loadStamps();

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

    const prompt = document.querySelector<HTMLElement>('.quirk-prompt');
    let line = 0;
    const statusTimer = window.setInterval(() => {
      if (!prompt) return;
      line = (line + 1) % statusLines.length;
      prompt.textContent = statusLines[line];
    }, 4200);

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
      disposed = true;
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('pointermove', addStar);
      window.clearInterval(statusTimer);
      astronaut?.removeEventListener('click', clickAstronaut);
      astronaut?.removeEventListener('keydown', keyAstronaut);
    };
  }, []);

  const leaveStamp = async () => {
    setStampMessage('PRINTING YOUR MARK…');
    try {
      const response = await fetch('/api/stamp', { method: 'POST' });
      if (!response.ok) throw new Error('stamp unavailable');
      const data = await response.json() as { count: number; stamps: Stamp[] };
      setStampCount(data.count);
      setStamps(data.stamps);
      setStampMessage('STAMPED. YOU WERE HERE.');
    } catch {
      setStampMessage('THE STAMP PRINTER JAMMED. TRY AGAIN.');
    }
    window.setTimeout(() => setStampMessage(''), 3000);
  };

  return <>
    <div className="stamp-widget">
      <button type="button" className="stamp-button" onClick={leaveStamp}>
        <span className="stamp-glyph" aria-hidden="true">✦</span>
        <span><small className="mono">VISITOR LOG</small>LEAVE A STAMP <strong>{stampCount ?? '·'}</strong></span>
      </button>
      {stampMessage && <p className="stamp-message mono" role="status">{stampMessage}</p>}
      <div className="stamp-wall" aria-label="Recent visitor stamps">{stamps.slice(0, 8).map(stamp => <span key={stamp.id} className={`visitor-stamp ${stamp.color}`} title="A visitor was here">{stamp.symbol}</span>)}</div>
    </div>
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
