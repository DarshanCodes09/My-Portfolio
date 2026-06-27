import { exchangeCodeForTokens } from '@/lib/spotify';
import { saveRefreshToken } from '@/lib/spotify-token';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://127.0.0.1:3000';

  if (error) {
    return NextResponse.redirect(
      new URL(`/spotify-setup?error=${encodeURIComponent(error)}`, baseUrl),
    );
  }

  if (!code || !state) {
    return NextResponse.redirect(
      new URL('/spotify-setup?error=missing_code', baseUrl),
    );
  }

  const cookieStore = await cookies();
  const storedState = cookieStore.get('spotify_auth_state')?.value;

  if (!storedState || storedState !== state) {
    return NextResponse.redirect(
      new URL('/spotify-setup?error=invalid_state', baseUrl),
    );
  }

  try {
    const tokens = await exchangeCodeForTokens(code);
    const refreshToken = tokens.refresh_token;

    if (!refreshToken) {
      return NextResponse.redirect(
        new URL('/spotify-setup?error=no_refresh_token', baseUrl),
      );
    }

    await saveRefreshToken(refreshToken);

    const response = NextResponse.redirect(
      new URL('/spotify-setup?success=1', baseUrl),
    );
    response.cookies.delete('spotify_auth_state');
    return response;
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Token exchange failed';
    return NextResponse.redirect(
      new URL(`/spotify-setup?error=${encodeURIComponent(message)}`, baseUrl),
    );
  }
}
