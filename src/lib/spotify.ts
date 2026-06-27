import { getStoredRefreshToken } from '@/lib/spotify-token';

const SPOTIFY_ACCOUNTS_URL = 'https://accounts.spotify.com';
const SPOTIFY_API_URL = 'https://api.spotify.com/v1';

export const SPOTIFY_SCOPES = [
  'user-read-currently-playing',
  'user-read-playback-state',
  'user-read-recently-played',
].join(' ');

export function getSpotifyRedirectUri() {
  const base =
    process.env.SPOTIFY_REDIRECT_URI?.trim() ||
    process.env.NEXT_PUBLIC_URL?.trim() ||
    'http://127.0.0.1:3000';

  // Spotify rejects http://localhost — use loopback IP instead
  const normalized = base
    .replace(/\/$/, '')
    .replace('://localhost', '://127.0.0.1');

  return `${normalized}/api/spotify/callback`;
}

export function getSpotifyAuthUrl(state: string) {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  if (!clientId) {
    throw new Error('SPOTIFY_CLIENT_ID is not configured');
  }

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: getSpotifyRedirectUri(),
    scope: SPOTIFY_SCOPES,
    state,
  });

  return `${SPOTIFY_ACCOUNTS_URL}/authorize?${params.toString()}`;
}

export async function exchangeCodeForTokens(code: string) {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Spotify client credentials are not configured');
  }

  const response = await fetch(`${SPOTIFY_ACCOUNTS_URL}/api/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: getSpotifyRedirectUri(),
    }),
    cache: 'no-store',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error_description || data.error || 'Token exchange failed',
    );
  }

  return data as {
    access_token: string;
    refresh_token?: string;
    expires_in: number;
    scope: string;
    token_type: string;
  };
}

export async function getSpotifyAccessToken(): Promise<string | null> {
  const clientId = process.env.SPOTIFY_CLIENT_ID?.trim();
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET?.trim();
  const refreshToken = await getStoredRefreshToken();

  if (!clientId || !clientSecret || !refreshToken) {
    return null;
  }

  const response = await fetch(`${SPOTIFY_ACCOUNTS_URL}/api/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
    cache: 'no-store',
  });

  const data = await response.json();

  if (!response.ok) {
    if (process.env.NODE_ENV === 'development') {
      console.error(
        '[Spotify] Token refresh failed:',
        data.error,
        data.error_description,
      );
    }
    return null;
  }

  return data.access_token ?? null;
}

export { SPOTIFY_API_URL };
