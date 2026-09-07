import { env } from 'cloudflare:workers';

type StarRow = { id: string; x: number; y: number; size: number; color: string; glow: number; created_at: string };
const database = () => (env as unknown as { DB: D1Database }).DB;
const toStar = (row: StarRow) => ({ id: row.id, x: row.x, y: row.y, size: row.size, color: row.color, glow: row.glow, createdAt: row.created_at });

export async function GET() {
  try {
    const result = await database().prepare('SELECT id, x, y, size, color, glow, created_at FROM constellation_stars ORDER BY created_at ASC LIMIT 3000').all<StarRow>();
    return Response.json({ stars: (result.results ?? []).map(toStar) }, { headers: { 'Cache-Control': 'no-store' } });
  } catch { return Response.json({ stars: [] }, { status: 503, headers: { 'Cache-Control': 'no-store' } }); }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as { x?: unknown; y?: unknown };
    const x = Number(body.x); const y = Number(body.y);
    if (!Number.isFinite(x) || !Number.isFinite(y) || x < 0 || x > 100 || y < 0 || y > 100) return Response.json({ error: 'Invalid coordinates' }, { status: 400 });
    const colors = ['#eaf5ff', '#c8e6ff', '#ffffff', '#b8d7ff'];
    const star = { id: crypto.randomUUID(), x, y, size: 2 + Math.random() * 2, color: colors[Math.floor(Math.random() * colors.length)], glow: 3 + Math.random() * 7, createdAt: new Date().toISOString() };
    await database().prepare('INSERT INTO constellation_stars (id, x, y, size, color, glow, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)').bind(star.id, star.x, star.y, star.size, star.color, star.glow, star.createdAt).run();
    return Response.json({ star }, { status: 201 });
  } catch { return Response.json({ error: 'Star field unavailable' }, { status: 503 }); }
}
