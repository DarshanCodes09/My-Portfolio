'use client';

import Container from '@/components/common/Container';
import { spotifyConfig } from '@/config/Spotify';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

const NETLIFY_REDIRECT = 'https://spotify-refresh-token-generator.netlify.app';
const SCOPES =
  'user-read-currently-playing user-read-playback-state user-read-recently-played';

function SpotifySetupContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [token, setToken] = useState('');
  const [pendingToken, setPendingToken] = useState<string | null>(null);
  const [redirectUri, setRedirectUri] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const error = searchParams.get('error');
  const success = searchParams.get('success');

  useEffect(() => {
    if (success === 'vercel') {
      fetch('/api/spotify/pending-token')
        .then((res) => res.json())
        .then((data: { token?: string }) => {
          if (data.token) setPendingToken(data.token);
        })
        .catch(() => undefined);
    }
  }, [success]);

  useEffect(() => {
    setRedirectUri(`${window.location.origin}/api/spotify/callback`);
  }, []);

  async function saveToken(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveMessage('');

    try {
      const res = await fetch('/api/spotify/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: token }),
      });

      const data = await res.json();

      if (data.vercel || data.refreshToken) {
        setPendingToken(data.refreshToken || token);
        setSaveMessage(data.message);
        return;
      }

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save');
      }

      router.push('/spotify-setup?success=1');
      router.refresh();
    } catch (err) {
      setSaveMessage(
        err instanceof Error ? err.message : 'Failed to save token',
      );
    } finally {
      setSaving(false);
    }
  }

  function copyToken(value: string) {
    navigator.clipboard.writeText(value);
    setSaveMessage('Copied to clipboard!');
  }

  return (
    <Container className="py-16 md:py-24">
      <div className="mx-auto max-w-xl space-y-8">
        <div className="space-y-3">
          <p className="section-kicker">Spotify Integration</p>
          <h1 className="section-title text-2xl sm:text-3xl">
            Connect your Spotify account
          </h1>
          <p className="text-secondary text-[14px] leading-relaxed">
            On Vercel, Spotify requires three environment variables — the
            refresh token cannot be saved to disk. Add them in your Vercel
            project settings, then redeploy.
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-[13px] text-red-400">
            Authorization failed: {error.replace(/_/g, ' ')}
          </div>
        )}

        {(success === '1' || success === 'vercel') && !pendingToken && (
          <div className="work-card space-y-5">
            <h2 className="text-primary text-[15px] font-semibold">
              Spotify connected locally
            </h2>
            <p className="text-secondary text-[13px]">
              Your Now Playing widget should update within a few seconds.
            </p>
            <Link
              href="/"
              className="inline-flex rounded-lg bg-[#1DB954] px-4 py-2 text-[13px] font-semibold text-white hover:opacity-90"
            >
              Back to portfolio
            </Link>
          </div>
        )}

        {pendingToken && (
          <div className="work-card space-y-4 border-[#1DB954]/40">
            <h2 className="text-primary text-[15px] font-semibold">
              Add this to Vercel
            </h2>
            <p className="text-secondary text-[13px] leading-relaxed">
              In Vercel → your project → <strong>Settings</strong> →{' '}
              <strong>Environment Variables</strong>, add:
            </p>
            <pre className="text-primary overflow-x-auto rounded-lg bg-zinc-100 p-3 text-[11px] dark:bg-zinc-900">{`SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
SPOTIFY_REFRESH_TOKEN=${pendingToken}
NEXT_PUBLIC_URL=https://your-domain.vercel.app`}</pre>
            <button
              type="button"
              onClick={() => copyToken(pendingToken)}
              className="rounded-lg bg-[#1DB954] px-4 py-2 text-[13px] font-semibold text-white hover:opacity-90"
            >
              Copy refresh token
            </button>
            <p className="text-muted text-[12px]">
              After saving env vars, click <strong>Redeploy</strong> in Vercel.
            </p>
          </div>
        )}

        {!success && (
          <>
            <div className="work-card space-y-4">
              <h2 className="text-primary text-[15px] font-semibold">
                Step 1 — Spotify Developer Dashboard
              </h2>
              <ol className="text-secondary list-decimal space-y-2 pl-4 text-[13px] leading-relaxed">
                <li>
                  Open{' '}
                  <a
                    href="https://developer.spotify.com/dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-link"
                  >
                    developer.spotify.com/dashboard
                  </a>{' '}
                  and select your app.
                </li>
                <li>
                  Under <strong>Redirect URIs</strong>, add your production
                  callback:
                  {redirectUri && (
                    <code className="text-primary mt-1 block rounded bg-zinc-100 px-2 py-1 text-[11px] break-all dark:bg-zinc-800">
                      {redirectUri}
                    </code>
                  )}
                </li>
                <li>
                  Also add for local dev:
                  <code className="text-primary mt-1 block rounded bg-zinc-100 px-2 py-1 text-[11px] dark:bg-zinc-800">
                    http://127.0.0.1:3000/api/spotify/callback
                  </code>
                </li>
                <li>Copy your Client ID and Client Secret.</li>
              </ol>
            </div>

            <div className="work-card space-y-4">
              <h2 className="text-primary text-[15px] font-semibold">
                Step 2 — Get a refresh token
              </h2>
              <p className="text-secondary text-[13px]">
                Use the token generator (easiest) or connect directly on your
                deployed site.
              </p>
              <div className="space-y-3">
                <a
                  href="https://spotify-refresh-token-generator.netlify.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex rounded-lg bg-[#1DB954] px-4 py-2 text-[13px] font-semibold text-white hover:opacity-90"
                >
                  Open token generator
                </a>
                <p className="text-muted text-[12px]">
                  Redirect URI in generator:{' '}
                  <code className="text-primary text-[11px]">
                    {NETLIFY_REDIRECT}
                  </code>
                </p>
                <p className="text-muted text-[12px]">
                  Scopes:{' '}
                  <code className="text-primary text-[11px]">{SCOPES}</code>
                </p>
              </div>
              <a
                href="/api/spotify/auth"
                className="inline-flex rounded-lg border border-zinc-200 px-4 py-2 text-[13px] font-medium dark:border-zinc-700"
              >
                Or connect via OAuth on this site
              </a>
            </div>

            <div className="work-card space-y-4">
              <h2 className="text-primary text-[15px] font-semibold">
                Step 3 — Paste refresh token
              </h2>
              <form onSubmit={saveToken} className="space-y-3">
                <textarea
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Paste your Spotify refresh token here..."
                  className="min-h-[100px] w-full resize-none rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-[12px] text-zinc-900 placeholder:text-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
                />
                {saveMessage && (
                  <p className="text-[12px] text-zinc-500">{saveMessage}</p>
                )}
                <button
                  type="submit"
                  disabled={saving || !token.trim()}
                  className="rounded-lg bg-[#1DB954] px-5 py-2.5 text-[14px] font-semibold text-white disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save token'}
                </button>
              </form>
              <p className="text-muted text-[12px]">
                Local: saves to <code>data/spotify-token.json</code> or use{' '}
                <code>SPOTIFY_REFRESH_TOKEN</code> in <code>.env.local</code>.
                Vercel: must use env var.
              </p>
            </div>
          </>
        )}

        <p className="text-muted text-[12px]">
          Profile:{' '}
          <a
            href={spotifyConfig.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-link"
          >
            {spotifyConfig.profileUrl}
          </a>
        </p>
      </div>
    </Container>
  );
}

export default function SpotifySetupPage() {
  return (
    <Suspense>
      <SpotifySetupContent />
    </Suspense>
  );
}
