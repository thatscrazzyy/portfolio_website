'use client';
import { useEffect, useRef, useState } from 'react';
type WallStar = { id: string; x: number; y: number; size: number; color: string; glow: number; createdAt: string; message: string; callsign: string };
export default function ConstellationWall() {
  const [stars, setStars] = useState<WallStar[]>([]);
  const [locked, setLocked] = useState(false);
  const [ready, setReady] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [selected, setSelected] = useState<WallStar | null>(null);
  const [message, setMessage] = useState('');
  const [callsign, setCallsign] = useState('');
  const sending = useRef(false);
  const field = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/stars', { cache: 'no-store', signal: controller.signal }).then(async response => {
      if (!response.ok) throw new Error('The sky is out of range. Reload to reconnect.');
      return response.json() as Promise<{ stars: WallStar[]; hasPlaced: boolean }>;
    }).then(data => { setStars(data.stars); setLocked(data.hasPlaced); setReady(true); })
      .catch(error => { if (!controller.signal.aborted) setError(error.message); });
    return () => controller.abort();
  }, []);
  const transmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!position || !ready || locked || sending.current) return;
    sending.current = true; setPending(true); setError('');
    try {
      const response = await fetch('/api/stars', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...position, message, callsign }) });
      const data = await response.json() as { star: WallStar; error?: string };
      if (!response.ok) { if (response.status === 409) setLocked(true); throw new Error(data.error || 'Signal lost. Try again.'); }
      setStars(current => [...current, data.star]); setSelected(data.star); setLocked(true); setPosition(null);
    } catch (error) { setError(error instanceof Error ? error.message : 'Signal lost. Try again.'); }
    finally { sending.current = false; setPending(false); }
  };
  return <section id="constellation" className="constellation-section">
    <div className="constellation-heading"><span className="mono">✦</span><h2>CONSTELLATION WALL</h2><p className="mono">MISSION TRANSMISSIONS</p></div>
    <div className={'constellation-field' + (locked ? ' is-locked' : '')} ref={field}>
      <button type="button" className="sky-target" disabled={!ready || locked || pending} aria-label="Choose your star position. Click anywhere, or press Enter for the center." onClick={event => {
        const rect = field.current!.getBoundingClientRect();
        setPosition(event.detail === 0 ? { x: 50, y: 50 } : { x: Math.max(0, Math.min(100, (event.clientX - rect.left) / rect.width * 100)), y: Math.max(0, Math.min(100, (event.clientY - rect.top) / rect.height * 100)) });
        setSelected(null);
      }}/>
      <div className="constellation-grid" aria-hidden="true"/>
      {stars.map(star => <button type="button" key={star.id} className="star-hit" style={{ left: star.x + '%', top: star.y + '%' }} onClick={() => setSelected(star)} aria-label={'Read transmission from ' + (star.callsign || 'an earlier explorer')}>
        <span style={{ width: star.size, height: star.size, background: star.color, boxShadow: '0 0 ' + star.glow + 'px ' + star.color }}/>
      </button>)}
      {position && !locked && <span className="sky-position" style={{ left: position.x + '%', top: position.y + '%' }} aria-hidden="true">+</span>}
      <div className="constellation-copy" aria-live="polite">{locked ? 'YOU’RE WRITTEN INTO THE SKY. TAP A STAR TO LISTEN.' : !ready ? 'TUNING IN…' : 'CHOOSE YOUR COORDINATES. TAP A STAR TO LISTEN.'}</div>
    </div>
    {selected && <div className="radio-transmission" role="status"><small className="mono">INTERCEPTED / {selected.id.slice(0, 8).toUpperCase()}</small><h3>{selected.callsign || 'Unknown explorer'}</h3><p>{selected.message || 'A quiet visitor passed through this sector. Just a star, no transmission.'}</p><small className="mono">RECEIVED {selected.createdAt.slice(0, 10)} · END OF TRANSMISSION</small></div>}
    {position && !locked && <form className="transmission-form" onSubmit={transmit}>
      <p className="mono">UPLINK READY / {Math.round(position.x)} : {Math.round(position.y)}</p>
      <label>Call sign <span>(optional)</span><input maxLength={24} value={callsign} onChange={e => setCallsign(e.target.value)} placeholder="Unknown explorer" disabled={pending}/></label>
      <label>Mission transmission <span>(optional)</span><textarea maxLength={160} rows={3} value={message} onChange={e => setMessage(e.target.value)} placeholder="Made it to this corner of the universe. Nice place." disabled={pending}/></label>
      <small className="mono">{message.length}/160 · PUBLIC FREQUENCY. KEEP IT FRIENDLY.</small>
      <div className="transmission-actions"><button type="submit" disabled={pending}>{pending ? 'TRANSMITTING…' : 'SEND TO THE SKY ↗'}</button><button type="button" disabled={pending} onClick={() => setPosition(null)}>CANCEL</button></div>
    </form>}
    {error && <p className="constellation-error" role="alert">{error}</p>}
  </section>;
}
