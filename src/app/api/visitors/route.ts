import { promises as fs } from 'fs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import path from 'path';

const COUNT_FILE = path.join(process.cwd(), 'data', 'visitor-count.json');
const TMP_COUNT_FILE = path.join('/tmp', 'visitor-count.json');
const BASE_COUNT = Number(process.env.VISITOR_COUNT_BASE || 0);
const COUNTAPI_NAMESPACE =
  process.env.VISITOR_COUNT_NAMESPACE || 'darshan-kushalkar-portfolio';

async function readFileCount(filePath: string): Promise<number | null> {
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(raw) as { count: number };
    return data.count || 0;
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

async function fetchCountApi(increment: boolean): Promise<number | null> {
  const endpoint = increment
    ? `https://api.countapi.xyz/hit/${encodeURIComponent(COUNTAPI_NAMESPACE)}/visitors`
    : `https://api.countapi.xyz/get/${encodeURIComponent(COUNTAPI_NAMESPACE)}/visitors`;

  try {
    const response = await fetch(endpoint, { cache: 'no-store' });
    if (!response.ok) return null;

    const data = (await response.json()) as { value?: number };
    return typeof data.value === 'number' ? data.value : null;
  } catch {
    return null;
  }
}

async function getVisitorCount(increment: boolean): Promise<number> {
  if (increment) {
    const local = await incrementLocalCount();
    if (local !== null) return BASE_COUNT + local;

    const remote = await fetchCountApi(true);
    if (remote !== null) return BASE_COUNT + remote;
  } else {
    const local = await readLocalCount();
    if (local > 0 || (await readFileCount(COUNT_FILE)) !== null) {
      return BASE_COUNT + local;
    }

    const remote = await fetchCountApi(false);
    if (remote !== null) return BASE_COUNT + remote;
  }

  return BASE_COUNT + (await readLocalCount());
}

export async function GET() {
  const cookieStore = await cookies();
  const seen = cookieStore.get('visitor_seen');

  const count = await getVisitorCount(!seen);

  const response = NextResponse.json({ count });

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
