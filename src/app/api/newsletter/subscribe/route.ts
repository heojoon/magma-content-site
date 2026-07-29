import { NextResponse } from 'next/server';

import { createJsonNewsletterProvider } from '@/lib/newsletter-store';
import {
  normalizeAndValidateEmail,
  subscribeWithProvider,
  type NewsletterProvider,
} from '@/lib/newsletter';

const provider = createJsonNewsletterProvider();

export function createSubscribeHandler(newsletterProvider: NewsletterProvider) {
  return async function POST(request: Request) {
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: '올바른 이메일 주소를 입력해 주세요.' }, { status: 422 });
    }

    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
      return NextResponse.json({ error: '올바른 이메일 주소를 입력해 주세요.' }, { status: 422 });
    }

    const validation = normalizeAndValidateEmail((body as { email?: unknown }).email);
    if (!validation.ok) {
      return NextResponse.json({ error: validation.message }, { status: 422 });
    }

    const outcome = await subscribeWithProvider(newsletterProvider, validation.email);
    if (outcome.kind === 'subscribed') {
      return NextResponse.json(outcome, { status: 201 });
    }

    if (outcome.kind === 'alreadySubscribed') {
      return NextResponse.json(outcome, { status: 409 });
    }

    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  };
}

export const POST = createSubscribeHandler(provider);
