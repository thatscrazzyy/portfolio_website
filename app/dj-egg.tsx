'use client';

import { useEffect, useRef, useState } from 'react';

export default function DjEgg() {
  const [playing, setPlaying] = useState(false);
  const [message, setMessage] = useState('');
  const stopRef = useRef<() => void>(() => {});

  useEffect(() => {
    const stopWhenHidden = () => { if (document.hidden) stopRef.current(); };
    document.addEventListener('visibilitychange', stopWhenHidden);
    const details = document.getElementById('sidequest') as HTMLDetailsElement | null;
    const stopWhenClosed = () => { if (!details?.open) stopRef.current(); };
    details?.addEventListener('toggle', stopWhenClosed);
    return () => {
      stopRef.current();
      document.removeEventListener('visibilitychange', stopWhenHidden);
      details?.removeEventListener('toggle', stopWhenClosed);
    };
  }, []);

  const toggle = () => {
    if (playing) { stopRef.current(); return; }
    try {
      const audio = new AudioContext();
      let timer = 0;
      stopRef.current = () => {
        window.clearTimeout(timer);
        void audio.close();
        setPlaying(false);
        stopRef.current = () => {};
      };
      setPlaying(true);
      setMessage('MISSION CONTROL HAS LOST AUX PRIVILEGES.');
      void audio.resume().then(() => {
        if (audio.state === 'closed') return;
        const start = audio.currentTime + 0.05;
        for (let beat = 0; beat < 16; beat++) {
          const time = start + beat * 0.5;
          const kick = audio.createOscillator();
          const gain = audio.createGain();
          kick.frequency.setValueAtTime(130, time);
          kick.frequency.exponentialRampToValueAtTime(42, time + 0.18);
          gain.gain.setValueAtTime(0.0001, time);
          gain.gain.exponentialRampToValueAtTime(0.16, time + 0.008);
          gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.3);
          kick.connect(gain).connect(audio.destination);
          kick.start(time); kick.stop(time + 0.32);

          const blip = audio.createOscillator();
          const level = audio.createGain();
          blip.type = 'triangle';
          blip.frequency.value = [220, 261.63, 329.63, 293.66][beat % 4];
          level.gain.setValueAtTime(0.0001, time + 0.25);
          level.gain.exponentialRampToValueAtTime(0.045, time + 0.26);
          level.gain.exponentialRampToValueAtTime(0.0001, time + 0.46);
          blip.connect(level).connect(audio.destination);
          blip.start(time + 0.25); blip.stop(time + 0.48);
        }
        timer = window.setTimeout(() => stopRef.current(), 8300);
      }).catch(() => {
        stopRef.current();
        setMessage('THE AUX CABLE IS ACTING UP. TRY AGAIN.');
      });
    } catch { setMessage('THIS BROWSER COULD NOT START THE DECKS.'); }
  };

  return <div className={`dj-egg${playing ? ' is-playing' : ''}`}>
    <p>I also DJ. Turns out I like mixing things that probably shouldn’t go together.</p>
    <button type="button" className="dj-trigger mono" onClick={toggle} aria-pressed={playing} aria-label={playing ? 'Stop the beat' : 'Drop the bass: play an eight-second beat'}>
      <span>{playing ? 'STOP THE BEAT ■' : 'DROP THE BASS ↗'}</span>
      <span className="dj-levels" aria-hidden="true">{[0,1,2,3,4,5,6].map(i => <i key={i} style={{ animationDelay: `-${i * 0.13}s` }}/>)}</span>
    </button>
    <small className="mono dj-message" role="status">{message || 'A SMALL DETOUR. SOUND ON?'}</small>
  </div>;
}
