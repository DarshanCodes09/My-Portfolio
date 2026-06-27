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

    await saveRefreshToken(refreshToken);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'Failed to save token' },
      { status: 500 },
    );
  }
}
