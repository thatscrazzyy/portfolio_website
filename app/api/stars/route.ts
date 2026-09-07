import { env } from 'cloudflare:workers';
import { cleanTransmission } from './moderation';
type StarRow = { id: string; x: number; y: number; size: number; color: string; glow: number; created_at: string; message: string; callsign: string };
const database = () => (env as unknown as { DB: D1Database }).DB;
const toStar = (r: StarRow) => ({ id: r.id, x: r.x, y: r.y, size: r.size, color: r.color, glow: r.glow, createdAt: r.created_at, message: r.message, callsign: r.callsign });
const sessionKey = (request: Request) => request.headers.get('cookie')?.match(/(?:^|;\s*)sky_session=([a-f0-9-]{36})(?:;|$)/)?.[1];
const noCache = { 'Cache-Control': 'no-store' };

export async function GET(request: Request) {
  try {
    const key = sessionKey(request) || crypto.randomUUID();
    const [result, existing] = await Promise.all([
      database().prepare('SELECT id, x, y, size, color, glow, created_at, message, callsign FROM constellation_stars ORDER BY created_at ASC').all<StarRow>(),
      database().prepare('SELECT id FROM constellation_stars WHERE visitor_key = ?').bind(key).first(),
    ]);
    return Response.json({ stars: (result.results ?? []).map(toStar), hasPlaced: !!existing }, { headers: { ...noCache, 'Set-Cookie': 'sky_session=' + key + '; Path=/; HttpOnly; SameSite=Strict' + (new URL(request.url).protocol === 'https:' ? '; Secure' : '') } });
  } catch { return Response.json({ error: 'The sky is temporarily out of range.' }, { status: 503, headers: noCache }); }
}

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return Response.json({ error: 'Unknown transmission origin.' }, { status: 403 });
  const key = sessionKey(request);
  if (!key) return Response.json({ error: 'Reload the sky before transmitting.' }, { status: 400 });
  let x: number, y: number, message: string, callsign: string;
  try {
    const raw = await request.text();
    if (raw.length > 2048) throw new Error('Keep your transmission short.');
    const body = JSON.parse(raw);
    if (!body || typeof body.x !== 'number' || typeof body.y !== 'number' || !Number.isFinite(body.x) || !Number.isFinite(body.y) || body.x < 0 || body.x > 100 || body.y < 0 || body.y > 100) throw new Error('Choose a position in the sky.');
    x = body.x; y = body.y;
    message = cleanTransmission(body.message ?? '', 160);
    callsign = cleanTransmission(body.callsign ?? '', 24);
  } catch (error) {
    return Response.json({ error: error instanceof SyntaxError ? 'Unreadable transmission.' : error instanceof Error ? error.message : 'Unreadable transmission.' }, { status: 400 });
  }
  try {
    const colors = ['#eaf5ff', '#c8e6ff', '#ffffff', '#b8d7ff'];
    const star = { id: crypto.randomUUID(), x, y, message, callsign: callsign || 'Unknown explorer', size: 2 + Math.random() * 2, color: colors[Math.floor(Math.random() * colors.length)], glow: 3 + Math.random() * 7, createdAt: new Date().toISOString() };
    const inserted = await database().prepare('INSERT INTO constellation_stars (id, x, y, size, color, glow, created_at, message, callsign, visitor_key) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(visitor_key) DO NOTHING').bind(star.id, x, y, star.size, star.color, star.glow, star.createdAt, message, star.callsign, key).run();
    if (!inserted.meta.changes) return Response.json({ error: 'You’re already written into the sky this session.' }, { status: 409, headers: noCache });
    return Response.json({ star }, { status: 201, headers: noCache });
  } catch { return Response.json({ error: 'Signal lost. Please try again.' }, { status: 503, headers: noCache }); }
}
