'use client';

import { useEffect, useState } from 'react';

type WallStar = { id: string; x: number; y: number; size: number; color: string; glow: number; createdAt: string };

export default function ConstellationWall() {
  const [stars, setStars] = useState<WallStar[]>([]); const [locked, setLocked] = useState(false); const [pending, setPending] = useState(false); const [error, setError] = useState('');
  useEffect(() => {
    try { setLocked(window.localStorage.getItem('samarth-constellation-stamped') === '1'); } catch { /* storage can be unavailable */ }
    fetch('/api/stars', { cache: 'no-store' }).then(response => response.ok ? response.json() as Promise<{ stars: WallStar[] }> : Promise.reject()).then(data => setStars(data.stars)).catch(() => setError('THE SKY IS LOADING SLOWLY.'));
  }, []);
  const placeStar = async (event: React.PointerEvent<HTMLDivElement>) => {
    if (locked || pending) return;
    const rect = event.currentTarget.getBoundingClientRect(); const x = Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100)); const y = Math.max(0, Math.min(100, ((event.clientY - rect.top) / rect.height) * 100));
    setPending(true); setError('');
    try {
      const response = await fetch('/api/stars', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ x, y }) }); if (!response.ok) throw new Error('unavailable');
      const data = await response.json() as { star: WallStar }; setStars(current => [...current, data.star]); setLocked(true); try { window.localStorage.setItem('samarth-constellation-stamped', '1'); } catch { /* best effort */ }
    } catch { setError('COORDINATES LOST. TRY AGAIN.'); } finally { setPending(false); }
  };
  return <section id="constellation" className="constellation-section"><div className="constellation-heading"><span className="mono">✦</span><h2>CONSTELLATION WALL</h2><p className="mono">LEAVE ONE STAR. STAY IN THE RECORD.</p></div><div className={`constellation-field${locked ? ' is-locked' : ''}`} onPointerUp={placeStar} role="application" aria-label={locked ? 'Your star is already in the constellation' : 'Tap or click to place one star'} tabIndex={0}><div className="constellation-grid" aria-hidden="true" />{stars.map(star => <span key={star.id} className="wall-star" style={{ left: `${star.x}%`, top: `${star.y}%`, width: `${star.size}px`, height: `${star.size}px`, background: star.color, boxShadow: `0 0 ${star.glow}px ${star.color}` }} aria-hidden="true" />)}<div className="constellation-copy" aria-live="polite">{locked ? 'YOU’RE WRITTEN INTO THE SKY.' : pending ? 'CALCULATING ORBIT…' : 'TAP ANYWHERE TO ADD ONE STAR.'}</div></div>{error && <p className="mono constellation-error" role="status">{error}</p>}</section>;
}
