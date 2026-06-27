import { saveRefreshToken } from '@/lib/spotify-token';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const refreshToken = body?.refreshToken?.trim();

    if (!refreshToken || refreshToken.length < 20) {
      return NextResponse.json(
        { error: 'Invalid refresh token' },
        { status: 400 },
      );
    }

    if (process.env.VERCEL) {
      return NextResponse.json({
        success: false,
        vercel: true,
        message:
          'On Vercel, add SPOTIFY_REFRESH_TOKEN in Project Settings → Environment Variables, then redeploy.',
        refreshToken,
      });
    }

    try {
      await saveRefreshToken(refreshToken);
      return NextResponse.json({ success: true });
    } catch {
      return NextResponse.json({
        success: false,
        message:
          'Could not save to file. Add SPOTIFY_REFRESH_TOKEN to .env.local instead.',
        refreshToken,
      });
    }
  } catch {
    return NextResponse.json(
      { error: 'Failed to save token' },
      { status: 500 },
    );
  }
}
