import { ArrowRight, Plus } from 'lucide-react';
import DjEgg from './dj-egg';

const featured = [
  { name: 'QuickDrop', image: '/images/quickdrop-orbit.webp', tags: ['FULL STACK', 'AWS / GCP'], href: 'https://quickdrop-9a015.web.app/', bullets: [
    'Built session-based file sharing with separate AWS and GCP architectures.',
    'Transferred 500 MB in about 50 seconds on local Wi-Fi during testing.',
    'Used Cloud Storage, Cloud Run, and automated one-hour cleanup on GCP.',
    'Built the AWS variant with S3 pre-signed URLs, Lambda, and API Gateway.',
    'Load-tested with k6 for 500 to 2,000 concurrent light users.',
  ] },
  { name: 'UTA Datathon', image: '/images/datathon-base.webp', tags: ['NEXT.JS', 'FIREBASE'], href: 'https://famous-lily-a54f63.netlify.app/', bullets: [
    'Built registration, QR lookup, and check-in for 400+ participants.',
    'Reduced scanning, lookup, and confirmation from about a minute to 10 seconds.',
    'Designed a Firestore schema connecting QR links to registration records.',
    'Handled roughly 1,000 database reads and writes per minute in testing.',
    'Supported peak registration and check-in loads of 250+ concurrent users.',
  ] },
  { name: 'Map Daddy', image: '/images/map-daddy-lander.webp', tags: ['RASPBERRY PI', 'CREATIVE TECH'], href: 'https://github.com/thatscrazzyy/map-daddy', bullets: [
    'Separated a browser-based controller from a Raspberry Pi 4B rendering receiver.',
    'Reached a projection-ready display in under 10 seconds from a fresh boot.',
    'Tested playback with 30 images and 10 videos.',
    'Used cached media and hardware acceleration for stable 720p playback at 30 FPS.',
    'Kept control latency under 500 ms during testing.',
    'Added multi-corner mapping to fit projections to different surfaces.',
    'Designed for live events, DJ visuals, and low-cost projection installations.',
  ] },
];
const explorations = [
  { id: 'autonomy', name: 'AUTONOMY', art: 'lunar', tag: 'ROBOTICS / VISION', href: 'https://igvc-web.vercel.app/', bullets: [
    'Built sensor processing for an autonomous vehicle with a stable 30 FPS inference loop.',
    'Used OpenCV for lane detection and YOLO for pedestrian and stop-sign detection.',
    'Integrated three front-facing LiDAR scan zones for obstacle avoidance.',
    'Achieved 95% obstacle-avoidance success across 20+ test runs.',
    'Supported 20+ emergency-stop tests for manual and autonomous safety controls.',
  ] },
  { id: 'mcp-platform', name: 'MCP AGENT PLATFORM', art: 'mcp-art', tag: 'SCOPED TOOLS / APPLIED AI', bullets: [
    'Deployed an MCP-based agent platform in a live customer environment.',
    'Gave agents scoped tools to work with business data.',
    'Added approval workflows, audit logs, and rollback for consequential actions.',
    'Matched permissions to the risk of each action across multiple tool integrations.',
  ] },
  { id: 'ai-dev-team', name: 'AI DEV TEAM', art: 'agent-art', tag: '16 AGENTS / SHARED STATE', bullets: [
    'Built 16 specialized agents for engineering and documentation across my apps.',
    'Used Notion as a shared state layer for the team.',
    'Separated shared agent behavior from app-specific memory.',
    'Kept each agent’s context relevant as the number of agents and apps grew.',
  ] },
  { id: 'sidequest', name: 'SIDEQUEST', art: 'green', tag: 'iOS / SOCIAL PLAY', bullets: [
    'Prototyped a 10-screen iMessage app for sending friends time-bound challenges.',
    'Built it with Swift, UIKit, and Firebase, then tested it with 10 friends.',
    'Implemented five quest states, from pending to completed or expired.',
    'Used anonymous sign-in and Keychain persistence to simplify onboarding.',
    'Achieved status updates in under one second during testing with Firestore listeners.',
  ] },
];

export function FeaturedProjects() {
  return <section id="projects" className="projects">
    <div className="eyebrow mono"><span>01.</span><a href="https://github.com/thatscrazzyy" target="_blank" rel="noreferrer">VIEW GITHUB <ArrowRight size={16}/></a></div>
    <h2 className="featured-title">FEATURED PROJECTS</h2>
    <div className="project-list">{featured.map((p, i) => <details className="project project-disclosure" key={p.name}>
      <summary><span className="project-number mono">0{i + 1}</span>
        <div className="project-art"><img src={p.image} alt="" loading="lazy" width="1536" height="1024"/><span className="art-cross">+</span></div>
        <div className="project-info"><h3>{p.name}</h3><div className="tags">{p.tags.map(t => <span key={t}>{t}</span>)}</div></div>
        <span className="project-hint mono">MISSION BRIEF <Plus size={16}/></span>
      </summary>
      <div className="project-brief"><ul>{p.bullets.map(b => <li key={b}>{b}</li>)}</ul><a className="outline-link mono" href={p.href} target="_blank" rel="noreferrer">OPEN PROJECT ↗</a></div>
    </details>)}</div>
  </section>;
}

export function Explorations() {
  return <section className="selected-work" id="selected-work">
    <div className="section-heading"><span className="mono">02.</span><h2>MORE EXPLORATIONS</h2><a className="meta mono" href="https://github.com/thatscrazzyy" target="_blank" rel="noreferrer">MORE PROJECTS <ArrowRight size={15}/></a></div>
    <div className="work-grid">{explorations.map((p, i) => <details id={p.id} className="work-tile exploration-disclosure" key={p.id}>
      <summary><div className={'tile-image ' + p.art}/><h3 className="mono">0{i + 1}. {p.name}</h3><p className="mono">{p.tag}</p><span className="project-hint mono">EXPLORE <Plus size={16}/></span></summary>
      <div className="project-brief"><ul>{p.bullets.map(b => <li key={b}>{b}</li>)}</ul>{p.href && <a className="outline-link mono" href={p.href} target="_blank" rel="noreferrer">TEAM WEBSITE ↗</a>}
      {p.id === 'sidequest' && <details className="sidequest dj-secret" id="dj-secret"><summary className="mono">OFF THE CLOCK <span>+</span></summary><DjEgg/></details>}</div>
    </details>)}</div>
  </section>;
}
