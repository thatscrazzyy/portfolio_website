'use client';

import { useState } from 'react';
import styles from './not-found.module.css';

const transmissions = [
  'Standing by. Try hailing Mission Control.',
  'Copy that. Have you tried turning the universe off and on again?',
  'We found your page. Unfortunately, it is in another galaxy.',
  'Navigation update: left at the moon. Your other left.',
  'Good news: you discovered a new route. Bad news: it goes nowhere.',
  'Rescue approved. The “Back to Earth” button is your escape pod.',
];

export default function LostSignal() {
  const [transmission, setTransmission] = useState(0);
  return (
    <div className={styles.radio}>
      <button type="button" onClick={() => setTransmission(current => (current + 1) % transmissions.length)}>
        <span aria-hidden="true">◉</span> HAIL MISSION CONTROL
      </button>
      <p aria-live="polite" aria-atomic="true">{transmissions[transmission]}</p>
    </div>
  );
}
