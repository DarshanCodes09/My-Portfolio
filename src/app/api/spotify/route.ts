import { SPOTIFY_API_URL, getSpotifyAccessToken } from '@/lib/spotify';
import { getStoredRefreshToken } from '@/lib/spotify-token';
import { NextResponse } from 'next/server';

type SpotifyArtist = { name: string };
type SpotifyTrack = {
  name: string;
  artists: SpotifyArtist[];
  album: { images: { url: string }[] };
  external_urls: { spotify: string };
  duration_ms: number;
};

function formatTrack(track: SpotifyTrack, isPlaying: boolean, progress = 0) {
  return {
    configured: true,
    source: 'spotify' as const,
    isPlaying,
    title: track.name,
    artist: track.artists.map((a) => a.name).join(', '),
    albumImageUrl: track.album.images[0]?.url ?? '',
    songUrl: track.external_urls.spotify,
    progress,
    duration: track.duration_ms,
    label: isPlaying ? 'Now Playing' : 'Last played',
  };
}

export const dynamic = 'force-dynamic';

export async function GET() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = await getStoredRefreshToken();

  if (clientId && clientSecret && refreshToken) {
    const accessToken = await getSpotifyAccessToken();

    if (!accessToken) {
      return NextResponse.json({
        configured: false,
        error: 'invalid_refresh_token',
      });
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
          return NextResponse.json(
            formatTrack(song.item, song.is_playing, song.progress_ms ?? 0),
          );
        }
      }

      if (currentResponse.status !== 403) {
        const recentResponse = await fetch(
          `${SPOTIFY_API_URL}/me/player/recently-played?limit=1`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
            cache: 'no-store',
          },
        );

        if (recentResponse.ok) {
          const recent = await recentResponse.json();
          const track = recent.items?.[0]?.track as SpotifyTrack | undefined;
          if (track) {
            return NextResponse.json(formatTrack(track, false, 0));
          }
        }
      }
    } catch {
      // fall through
    }
  }

  if (refreshToken) {
    return NextResponse.json({
      configured: true,
      error: 'premium_required',
      isPlaying: false,
    });
  }

  return NextResponse.json({
    configured: false,
    error: 'missing_credentials',
  });
}
