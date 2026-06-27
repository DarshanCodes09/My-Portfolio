import { promises as fs } from 'fs';
import path from 'path';

const TOKEN_FILE = path.join(process.cwd(), 'data', 'spotify-token.json');

export async function getStoredRefreshToken(): Promise<string | null> {
  const fromEnv = process.env.SPOTIFY_REFRESH_TOKEN?.trim();
  if (fromEnv) return fromEnv;

  try {
    const raw = await fs.readFile(TOKEN_FILE, 'utf-8');
    const data = JSON.parse(raw) as { refresh_token?: string };
    return data.refresh_token?.trim() || null;
  } catch {
    return null;
  }
}

export async function saveRefreshToken(token: string) {
  await fs.mkdir(path.dirname(TOKEN_FILE), { recursive: true });
  await fs.writeFile(
    TOKEN_FILE,
    JSON.stringify({ refresh_token: token.trim() }, null, 2),
  );
}
