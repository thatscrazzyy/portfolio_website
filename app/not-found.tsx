import LostSignal from './lost-signal';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <main className={styles.page}>
      <img className={styles.planet} src="/images/space-background-ascii.webp" alt="" width={2400} height={4267} />
      <header className={styles.header}>
        <a href="/">SAMARTH JAGTAP.</a>
        <span>MISSION CONTROL / SIGNAL LOST</span>
      </header>
      <div className={styles.content}>
        <section className={styles.message} aria-labelledby="lost-title">
          <p className={styles.kicker}>UNSCHEDULED SPACEWALK</p>
          <div className={styles.code} aria-hidden="true">404<span>✦</span></div>
          <h1 id="lost-title">Houston, we have<br />a wrong turn.</h1>
          <p className={styles.description}>This page has drifted out of orbit. Or it never existed.<br className={styles.desktopBreak} /> Mission Control is choosing to call this “exploration.”</p>
          <div className={styles.actions}>
            <a className={styles.home} href="/">BACK TO EARTH <span aria-hidden="true">↗</span></a>
            <a className={styles.projects} href="/#projects">EXPLORE THE WORK <span aria-hidden="true">→</span></a>
          </div>
          <LostSignal />
        </section>
        <img className={styles.astronaut} src="/images/astronaut-layer.webp" alt="An astronaut floating through space, equally unsure how we got here" width={2400} height={4267} />
      </div>
      <footer className={styles.footer}><span>COORDINATES: ¯\_(ツ)_/¯</span><span>OXYGEN: FINE. DIRECTIONS: QUESTIONABLE.</span></footer>
    </main>
  );
}
