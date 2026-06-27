import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const PENDING_COOKIE = 'spotify_refresh_token_pending';

export async function GET() {
  const cookieStore = await cookies();
  const pending = cookieStore.get(PENDING_COOKIE)?.value;

  if (!pending) {
    return NextResponse.json({ token: null });
  }

  const response = NextResponse.json({ token: pending });
  response.cookies.delete(PENDING_COOKIE);
  return response;
}
