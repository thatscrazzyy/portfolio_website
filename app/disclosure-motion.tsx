'use client';
import { useEffect } from 'react';

export default function DisclosureMotion() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const cleanups: Array<() => void> = [];
    document.querySelectorAll<HTMLDetailsElement>('details').forEach(details => {
      const summary = details.querySelector<HTMLElement>(':scope > summary');
      if (!summary) return;
      let animation: Animation | undefined;
      let expanded = details.open;
      const clear = () => {
        details.style.removeProperty('height');
        details.style.removeProperty('overflow');
      };
      const click = (event: MouseEvent) => {
        if ((event.target as Element).closest('summary') !== summary || reduced.matches) return;
        event.preventDefault();
        const from = details.getBoundingClientRect().height;
        expanded = animation ? !expanded : !details.open;
        animation?.cancel();
        clear();
        const styles = getComputedStyle(details);
        const edges = parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom) + parseFloat(styles.borderTopWidth) + parseFloat(styles.borderBottomWidth);
        details.open = true;
        const to = expanded ? details.getBoundingClientRect().height : summary.getBoundingClientRect().height + edges;
        details.dataset.expanding = String(expanded);
        details.style.overflow = 'hidden';
        animation = details.animate([{ height: from + 'px' }, { height: to + 'px' }], {
          duration: Math.min(360, 220 + Math.abs(to - from) * .12),
          easing: 'cubic-bezier(.22, 1, .36, 1)',
        });
        animation.onfinish = () => {
          details.open = expanded;
          animation = undefined;
          delete details.dataset.expanding;
          clear();
          // Opening already fires a native toggle. Notify scroll effects after the height settles too.
          details.dispatchEvent(new Event('toggle'));
        };
      };
      summary.addEventListener('click', click);
      cleanups.push(() => { summary.removeEventListener('click', click); animation?.cancel(); clear(); delete details.dataset.expanding; });
    });
    return () => cleanups.forEach(cleanup => cleanup());
  }, []);
  return null;
}
