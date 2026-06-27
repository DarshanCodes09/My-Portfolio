'use client';

import Container from '@/components/common/Container';
import { spotifyConfig } from '@/config/Spotify';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';

const REDIRECT_URI = 'http://127.0.0.1:3000/api/spotify/callback';
const NETLIFY_REDIRECT = 'https://spotify-refresh-token-generator.netlify.app';
const SCOPES =
  'user-read-currently-playing user-read-playback-state user-read-recently-played';

function SpotifySetupContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [token, setToken] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const error = searchParams.get('error');
  const success = searchParams.get('success');

  async function saveToken(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveError('');

    try {
      const res = await fetch('/api/spotify/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: token }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save');
      }

      router.push('/spotify-setup?success=1');
      router.refresh();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save token');
    } finally {
      setSaving(false);
    }
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
            Spotify blocks insecure{' '}
            <code className="text-primary text-[12px]">localhost</code> redirect
            URIs. Use the secure method below.
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-[13px] text-red-400">
            Authorization failed: {error.replace(/_/g, ' ')}
          </div>
        )}

        {success ? (
          <div className="work-card space-y-5">
            <h2 className="text-primary text-[15px] font-semibold">
              Spotify connected successfully
            </h2>
            <p className="text-secondary text-[13px]">
              Your Now Playing widget will update within a few seconds. Open
              Spotify and play a song to test it.
            </p>
            <Link
              href="/"
              className="inline-flex rounded-lg bg-[#1DB954] px-4 py-2 text-[13px] font-semibold text-white hover:opacity-90"
            >
              Back to portfolio
            </Link>
          </div>
        ) : (
          <>
            <div className="work-card space-y-5 border-[#1DB954]/30">
              <h2 className="text-primary text-[15px] font-semibold">
                ✅ Works now — Last.fm (recommended)
              </h2>
              <p className="text-secondary text-[13px] leading-relaxed">
                Spotify&apos;s API is blocking your app even with Premium. Use
                Last.fm instead — it scrobbles from Spotify and works on
                portfolios like siddz.com.
              </p>
              <ol className="text-secondary space-y-2 text-[13px] leading-relaxed">
                <li>
                  1. Create a free account at{' '}
                  <a
                    href="https://www.last.fm/join"
                    className="text-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    last.fm
                  </a>
                </li>
                <li>
                  2. Connect Spotify: Last.fm → Settings →{' '}
                  <a
                    href="https://www.last.fm/settings/applications"
                    className="text-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Applications
                  </a>{' '}
                  → connect Spotify
                </li>
                <li>
                  3. Get a free API key at{' '}
                  <a
                    href="https://www.last.fm/api/account/create"
                    className="text-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    last.fm/api
                  </a>
                </li>
                <li>
                  4. Add to{' '}
                  <code className="text-primary text-[11px]">.env.local</code>:
                  <pre className="text-primary mt-2 rounded bg-zinc-100 p-3 text-[11px] dark:bg-zinc-800">{`LASTFM_API_KEY=your_api_key
LASTFM_USERNAME=your_lastfm_username`}</pre>
                </li>
                <li>5. Restart dev server and play a song on Spotify</li>
              </ol>
            </div>

            <div className="work-card space-y-5">
              <h2 className="text-primary text-[15px] font-semibold">
                Spotify token (when API unblocks)
              </h2>
              <ol className="text-secondary space-y-3 text-[13px] leading-relaxed">
                <li>
                  1. In{' '}
                  <a
                    href="https://developer.spotify.com/dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-link"
                  >
                    Spotify Dashboard
                  </a>
                  , add this redirect URI (HTTPS — accepted by Spotify):
                  <code className="text-primary mt-1 block rounded bg-zinc-100 px-2 py-1 text-[11px] dark:bg-zinc-800">
                    {NETLIFY_REDIRECT}
                  </code>
                </li>
                <li>
                  2. Open the{' '}
                  <a
                    href="https://spotify-refresh-token-generator.netlify.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-link"
                  >
                    token generator
                  </a>{' '}
                  and enter your Client ID &amp; Secret from{' '}
                  <code className="text-primary text-[11px]">.env.local</code>
                </li>
                <li>
                  3. Use these scopes:
                  <code className="text-primary mt-1 block rounded bg-zinc-100 px-2 py-1 text-[10px] leading-relaxed dark:bg-zinc-800">
                    {SCOPES}
                  </code>
                </li>
                <li>4. Authorize and copy the refresh token below</li>
              </ol>

              <form onSubmit={saveToken} className="space-y-3">
                <textarea
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Paste your Spotify refresh token here..."
                  className="min-h-[100px] w-full resize-none rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-[12px] text-zinc-900 placeholder:text-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
                  required
                />
                {saveError && (
                  <p className="text-[12px] text-red-400">{saveError}</p>
                )}
                <button
                  type="submit"
                  disabled={saving || !token.trim()}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#1DB954] px-5 py-2.5 text-[14px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  Save &amp; connect Spotify
                </button>
              </form>
            </div>

            <div className="work-card space-y-4">
              <h2 className="text-primary text-[15px] font-semibold">
                Alternative — Local redirect (127.0.0.1)
              </h2>
              <p className="text-secondary text-[13px]">
                If Spotify accepts loopback IPs, add this URI instead of
                localhost:
              </p>
              <code className="text-primary block rounded bg-zinc-100 px-2 py-1 text-[11px] dark:bg-zinc-800">
                {REDIRECT_URI}
              </code>
              <p className="text-muted text-[12px]">
                Then open your site at{' '}
                <a href="http://127.0.0.1:3000" className="text-link">
                  http://127.0.0.1:3000
                </a>{' '}
                (not localhost) and click below.
              </p>
              <a
                href="/api/spotify/auth"
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 px-4 py-2 text-[13px] font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Connect via 127.0.0.1
              </a>
            </div>

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
          </>
        )}
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
