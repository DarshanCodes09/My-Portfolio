'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

const IDLE_MESSAGE = 'Not listening to Spotify right now.';
const STORAGE_KEY = 'spotify-last-track';

type SpotifyTrackData = {
  playing: true;
  isPlaying: boolean;
  title: string;
  artist: string;
  songUrl: string;
  label: string;
};

type SpotifyIdleData = {
  playing: false;
  idle: true;
  message: string;
  setupRequired?: boolean;
};

type SpotifyData = SpotifyTrackData | SpotifyIdleData;

const IDLE_STATE: SpotifyIdleData = {
  playing: false,
  idle: true,
  message: IDLE_MESSAGE,
};

function loadCachedTrack(): SpotifyTrackData | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;

    const data = parsed as Record<string, unknown>;
    if (
      typeof data.title !== 'string' ||
      data.title.length === 0 ||
      typeof data.songUrl !== 'string' ||
      typeof data.artist !== 'string'
    ) {
      return null;
    }

    return {
      playing: true,
      isPlaying: false,
      title: data.title,
      artist: data.artist,
      songUrl: data.songUrl,
      label: 'Last Played',
    };
  } catch {
    return null;
  }
}

function saveCachedTrack(track: SpotifyTrackData) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        title: track.title,
        artist: track.artist,
        songUrl: track.songUrl,
      }),
    );
  } catch {
    // ignore quota / private browsing errors
  }
}

function resolveDisplayData(data: SpotifyData): SpotifyData {
  if (data.playing) return data;
  if (data.setupRequired) return data;

  const cached = loadCachedTrack();
  if (cached) return cached;

  return data;
}

function parseSpotifyResponse(json: unknown): SpotifyData {
  if (!json || typeof json !== 'object') return IDLE_STATE;

  const data = json as Record<string, unknown>;

  if (
    data.playing === true &&
    typeof data.title === 'string' &&
    data.title.length > 0 &&
    typeof data.songUrl === 'string' &&
    typeof data.artist === 'string'
  ) {
    return {
      playing: true,
      isPlaying: Boolean(data.isPlaying),
      title: data.title,
      artist: data.artist,
      songUrl: data.songUrl,
      label:
        typeof data.label === 'string'
          ? data.label
          : data.isPlaying
            ? 'Now Playing'
            : 'Last Played',
    };
  }

  if (typeof data.message === 'string' && data.message.length > 0) {
    return {
      playing: false,
      idle: true,
      message: data.message,
      setupRequired: Boolean(data.setupRequired),
    };
  }

  return IDLE_STATE;
}

function SpotifyIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

export default function SpotifyNowPlaying() {
  const [data, setData] = useState<SpotifyData | null>(null);
  const [loaded, setLoaded] = useState(false);

  const applySpotifyData = useCallback((next: SpotifyData) => {
    if (next.playing) {
      saveCachedTrack(next);
    }
    setData(resolveDisplayData(next));
  }, []);

  const fetchSpotify = useCallback(async () => {
    try {
      const res = await fetch(`/api/spotify?t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' },
      });

      if (!res.ok) {
        applySpotifyData(IDLE_STATE);
        return;
      }

      const contentType = res.headers.get('content-type') ?? '';
      if (!contentType.includes('application/json')) {
        applySpotifyData(IDLE_STATE);
        return;
      }

      const json: unknown = await res.json();
      applySpotifyData(parseSpotifyResponse(json));
    } catch {
      applySpotifyData(IDLE_STATE);
    } finally {
      setLoaded(true);
    }
  }, [applySpotifyData]);

  useEffect(() => {
    fetchSpotify();
    const interval = setInterval(fetchSpotify, 5000);

    const handleOnline = () => {
      setData(null);
      setLoaded(false);
      fetchSpotify();
    };

    window.addEventListener('online', handleOnline);
    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
    };
  }, [fetchSpotify]);

  if (!loaded || !data) return null;

  if (!data.playing) {
    return (
      <div className="mb-6">
        <p className="inline-flex max-w-full items-center gap-2 text-[12px] text-zinc-500 sm:text-[13px]">
          <SpotifyIcon className="size-3.5 shrink-0 text-[#1DB954] sm:size-4" />
          <span>{data.message}</span>
        </p>
        {data.setupRequired && (
          <p className="text-muted mt-2 text-[11px]">
            <Link href="/spotify-setup" className="text-link text-[11px]">
              Connect Spotify
            </Link>{' '}
            to show your last played track.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="mb-6">
      <Link
        href={data.songUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex max-w-full items-center gap-2 text-[12px] transition-opacity hover:opacity-90 sm:text-[13px]"
      >
        {data.isPlaying && (
          <span className="relative flex size-2 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#1DB954] opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-[#1DB954]" />
          </span>
        )}

        <SpotifyIcon className="size-3.5 shrink-0 text-[#1DB954] sm:size-4" />

        <span className="shrink-0 font-medium text-zinc-500 dark:text-zinc-500">
          {data.label}
        </span>

        <span className="shrink-0 text-zinc-400 dark:text-zinc-600">—</span>

        <span className="truncate font-medium text-zinc-800 dark:text-zinc-200">
          {data.title}
        </span>

        <span className="shrink-0 text-zinc-400 dark:text-zinc-600">·</span>

        <span className="truncate text-zinc-500 dark:text-zinc-400">
          {data.artist}
        </span>
      </Link>
    </div>
  );
}
