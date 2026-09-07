import { env } from 'cloudflare:workers';

const colors = ['rust', 'moss', 'ochre', 'cream'] as const;
const symbols = ['✦', '✧', '✶', '✹', '✷'] as const;

type StampRow = {
  id: string;
  created_at: string;
  color: string;
  symbol: string;
};

function database(): D1Database {
  return (env as unknown as { DB: D1Database }).DB;
}

async function snapshot() {
  const db = database();
  const [countResult, stampsResult] = await db.batch([
    db.prepare('SELECT COUNT(*) AS count FROM visitor_stamps'),
    db.prepare('SELECT id, created_at, color, symbol FROM visitor_stamps ORDER BY created_at DESC LIMIT 18'),
  ]);
  const count = Number((countResult.results[0] as { count?: number | string } | undefined)?.count ?? 0);
  return {
    count,
    stamps: (stampsResult.results as StampRow[]).map(({ id, created_at, color, symbol }) => ({ id, createdAt: created_at, color, symbol })),
  };
}

export async function GET() {
  try {
    return Response.json(await snapshot(), { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return Response.json({ count: 0, stamps: [], unavailable: true }, { status: 503 });
  }
}

export async function POST() {
  try {
    const db = database();
    const stamp = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      color: colors[Math.floor(Math.random() * colors.length)],
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
    };
    await db.prepare('INSERT INTO visitor_stamps (id, created_at, color, symbol) VALUES (?, ?, ?, ?)')
      .bind(stamp.id, stamp.createdAt, stamp.color, stamp.symbol)
      .run();
    return Response.json({ ...(await snapshot()), stamp }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return Response.json({ error: 'The stamp printer is temporarily offline.' }, { status: 503 });
  }
}
