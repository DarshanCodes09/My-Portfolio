import { promises as fs } from 'fs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import path from 'path';

const COUNT_FILE = path.join(process.cwd(), 'data', 'visitor-count.json');
const TMP_COUNT_FILE = path.join('/tmp', 'visitor-count.json');
const BASE_COUNT = Number(process.env.VISITOR_COUNT_BASE || 0);
const COUNTAPI_NAMESPACE =
  process.env.VISITOR_COUNT_NAMESPACE || 'darshan-kushalkar-portfolio';
const COUNTER_KEY =
  process.env.VISITOR_COUNTER_KEY || `${COUNTAPI_NAMESPACE}-visitors`;
const COUNTER_API = 'https://countapi.mileshilliard.com/api/v1';

async function readFileCount(filePath: string): Promise<number | null> {
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(raw) as { count: number };
    return typeof data.count === 'number' ? data.count : null;
  } catch {
    return null;
  }
}

async function writeFileCount(
  filePath: string,
  count: number,
): Promise<boolean> {
  try {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify({ count }));
    return true;
  } catch {
    return false;
  }
}

async function readLocalCount(): Promise<number> {
  const primary = await readFileCount(COUNT_FILE);
  if (primary !== null) return primary;

  const tmp = await readFileCount(TMP_COUNT_FILE);
  if (tmp !== null) return tmp;

  return 0;
}

async function incrementLocalCount(): Promise<number | null> {
  const current = await readLocalCount();
  const next = current + 1;

  const wrotePrimary = await writeFileCount(COUNT_FILE, next);
  if (wrotePrimary) return next;

  const wroteTmp = await writeFileCount(TMP_COUNT_FILE, next);
  if (wroteTmp) return next;

  return null;
}

async function fetchRemoteCount(increment: boolean): Promise<number | null> {
  const endpoint = increment
    ? `${COUNTER_API}/hit/${encodeURIComponent(COUNTER_KEY)}`
    : `${COUNTER_API}/get/${encodeURIComponent(COUNTER_KEY)}`;

  try {
    const response = await fetch(endpoint, { cache: 'no-store' });
    if (!response.ok) return null;

    const data = (await response.json()) as { value?: number | string };
    const parsed = Number(data.value);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
  } catch {
    return null;
  }
}

function toPublicCount(raw: number | null): number | null {
  if (raw === null) return null;
  const total = BASE_COUNT + raw;
  return total > 0 ? total : null;
}

async function getVisitorCount(increment: boolean): Promise<number | null> {
  const isVercel = process.env.VERCEL === '1';

  if (isVercel) {
    return toPublicCount(await fetchRemoteCount(increment));
  }

  if (increment) {
    const local = await incrementLocalCount();
    if (local !== null) return toPublicCount(local);

    return toPublicCount(await fetchRemoteCount(true));
  }

  const hasLocalFile =
    (await readFileCount(COUNT_FILE)) !== null ||
    (await readFileCount(TMP_COUNT_FILE)) !== null;

  if (hasLocalFile) {
    return toPublicCount(await readLocalCount());
  }

  return toPublicCount(await fetchRemoteCount(false));
}

export async function GET() {
  const cookieStore = await cookies();
  const seen = cookieStore.get('visitor_seen');

  const count = await getVisitorCount(!seen);

  const response = NextResponse.json({
    count,
    available: count !== null,
  });

  if (!seen) {
    response.cookies.set('visitor_seen', '1', {
      maxAge: 60 * 60 * 24 * 365,
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
    });
  }

  return response;
}
