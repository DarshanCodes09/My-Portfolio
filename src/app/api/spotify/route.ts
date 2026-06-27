import { SPOTIFY_API_URL, getSpotifyAccessToken } from '@/lib/spotify';
import { getStoredRefreshToken } from '@/lib/spotify-token';
import { NextResponse } from 'next/server';

const IDLE_MESSAGE = 'Not listening to Spotify right now.';

type SpotifyArtist = { name: string };
type SpotifyTrack = {
  name: string;
  artists: SpotifyArtist[];
  album: { images: { url: string }[] };
  external_urls: { spotify: string };
  duration_ms: number;
};

function idleResponse() {
  return NextResponse.json(
    {
      playing: false,
      idle: true,
      message: IDLE_MESSAGE,
    },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        Pragma: 'no-cache',
      },
    },
  );
}

function trackResponse(track: ReturnType<typeof formatTrack>) {
  return NextResponse.json(track, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      Pragma: 'no-cache',
    },
  });
}

function formatTrack(track: SpotifyTrack, isPlaying: boolean, progress = 0) {
  return {
    playing: true,
    isPlaying,
    title: track.name,
    artist: track.artists.map((a) => a.name).join(', '),
    albumImageUrl: track.album.images[0]?.url ?? '',
    songUrl: track.external_urls.spotify,
    progress,
    duration: track.duration_ms,
    label: isPlaying ? 'Now Playing' : 'Last Played',
  };
}

async function getRecentlyPlayedTrack(
  accessToken: string,
): Promise<ReturnType<typeof formatTrack> | null> {
  const recentResponse = await fetch(
    `${SPOTIFY_API_URL}/me/player/recently-played?limit=1`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    },
  );

  if (!recentResponse.ok) return null;

  const recent = await recentResponse.json();
  const track = recent.items?.[0]?.track as SpotifyTrack | undefined;
  if (!track) return null;

  return formatTrack(track, false, 0);
}

export const dynamic = 'force-dynamic';

export async function GET() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = await getStoredRefreshToken();

  if (!clientId || !clientSecret || !refreshToken) {
    return idleResponse();
  }

  const accessToken = await getSpotifyAccessToken();
  if (!accessToken) {
    return idleResponse();
  }

  try {
    const currentResponse = await fetch(
      `${SPOTIFY_API_URL}/me/player/currently-playing`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: 'no-store',
      },
    );

    if (currentResponse.status === 200) {
      const song = await currentResponse.json();
      if (song?.item) {
        return trackResponse(
          formatTrack(
            song.item,
            Boolean(song.is_playing),
            song.progress_ms ?? 0,
          ),
        );
      }
    }

    // 204 = nothing playing; also fall back when 200 has no track or
    // currently-playing is unavailable (e.g. 403 without Premium)
    const recentTrack = await getRecentlyPlayedTrack(accessToken);
    if (recentTrack) return trackResponse(recentTrack);
  } catch {
    // fall through to idle
  }

  return idleResponse();
}
