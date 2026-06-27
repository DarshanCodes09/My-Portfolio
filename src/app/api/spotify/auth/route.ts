import { getSpotifyAuthUrl } from '@/lib/spotify';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const state = crypto.randomUUID();
    const response = NextResponse.redirect(getSpotifyAuthUrl(state));
    response.cookies.set('spotify_auth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600,
      path: '/',
    });
    return response;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Spotify auth failed';
    return NextResponse.redirect(
      new URL(
        `/spotify-setup?error=${encodeURIComponent(message)}`,
        process.env.NEXT_PUBLIC_URL || 'http://127.0.0.1:3000',
      ),
    );
  }
}
