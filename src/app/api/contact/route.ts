import { NextRequest, NextResponse } from 'next/server';
import * as z from 'zod';

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters.')
    .max(100),
  email: z.string().trim().email('Please enter a valid email address.'),
  message: z
    .string()
    .trim()
    .min(10, 'Message must be at least 10 characters.')
    .max(1000, 'Message must not exceed 1000 characters.'),
  website: z.string().max(0).optional(),
});

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');

  if (forwarded) return forwarded.split(',')[0].trim();
  if (realIP) return realIP;
  if (cfConnectingIP) return cfConnectingIP;

  return 'unknown';
}

function checkRateLimit(clientIP: string): {
  allowed: boolean;
  remaining: number;
} {
  const now = Date.now();
  const clientData = rateLimitStore.get(clientIP);

  if (!clientData || now > clientData.resetTime) {
    rateLimitStore.set(clientIP, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1 };
  }

  if (clientData.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, remaining: 0 };
  }

  clientData.count++;
  rateLimitStore.set(clientIP, clientData);

  return {
    allowed: true,
    remaining: RATE_LIMIT_MAX_REQUESTS - clientData.count,
  };
}

function escapeTelegramHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

async function sendToTelegram(data: {
  name: string;
  email: string;
  message: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
  const telegramChatId = process.env.TELEGRAM_CHAT_ID;

  if (!telegramToken || !telegramChatId) {
    return { ok: false, error: 'Telegram bot is not configured.' };
  }

  const submittedAt = new Date().toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata',
  });

  const text = [
    '🔔 <b>New Contact Form Submission</b>',
    '',
    `👤 <b>Name:</b> ${escapeTelegramHtml(data.name)}`,
    `📧 <b>Email:</b> ${escapeTelegramHtml(data.email)}`,
    '',
    '💬 <b>Message:</b>',
    escapeTelegramHtml(data.message),
    '',
    `⏰ <b>Submitted:</b> ${escapeTelegramHtml(submittedAt)}`,
  ].join('\n');

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${telegramToken}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        }),
      },
    );

    const result = (await response.json()) as {
      ok: boolean;
      description?: string;
    };

    if (!response.ok || !result.ok) {
      console.error('[contact] Telegram error:', result.description);
      return {
        ok: false,
        error: result.description || 'Failed to send message via Telegram.',
      };
    }

    return { ok: true };
  } catch (error) {
    console.error('[contact] Telegram request failed:', error);
    return { ok: false, error: 'Failed to reach Telegram.' };
  }
}

export async function POST(request: NextRequest) {
  try {
    const clientIP = getClientIP(request);
    const rateLimit = checkRateLimit(clientIP);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Too many requests. Please try again in a minute.',
          retryAfter: RATE_LIMIT_WINDOW / 1000,
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': RATE_LIMIT_MAX_REQUESTS.toString(),
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          },
        },
      );
    }

    const body = await request.json();
    const validatedData = contactSchema.parse(body);

    if (validatedData.website) {
      return NextResponse.json(
        { message: 'Message sent successfully!', success: true },
        { status: 200 },
      );
    }

    const result = await sendToTelegram(validatedData);

    if (!result.ok) {
      return NextResponse.json(
        {
          error:
            result.error === 'Telegram bot is not configured.'
              ? 'Contact form is not configured yet. Email me directly at thedarshan.dev@gmail.com'
              : 'Failed to send message. Please try again or email me directly.',
        },
        {
          status:
            result.error === 'Telegram bot is not configured.' ? 503 : 500,
        },
      );
    }

    return NextResponse.json(
      {
        message: 'Message sent successfully!',
        success: true,
      },
      {
        headers: {
          'X-RateLimit-Limit': RATE_LIMIT_MAX_REQUESTS.toString(),
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
        },
      },
    );
  } catch (error) {
    console.error('[contact] API error:', error);

    if (error instanceof z.ZodError) {
      const firstError = error.errors[0]?.message ?? 'Invalid form data';
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
