import { describe, expect, it } from 'vitest';

import { createSubscribeHandler } from '@/app/api/newsletter/subscribe/route';
import type { NewsletterProvider } from '@/lib/newsletter';

function request(body: string) {
  return new Request('http://localhost/api/newsletter/subscribe', {
    body,
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
  });
}

describe('POST /api/newsletter/subscribe', () => {
  it.each(['{', 'null', '[]', '{}', '{"email":"invalid"}'])('returns 422 for an invalid JSON body or email: %s', async (body) => {
    const handler = createSubscribeHandler({ subscribe: async () => ({ kind: 'subscribed' }) });

    const response = await handler(request(body));

    expect(response.status).toBe(422);
    await expect(response.json()).resolves.toEqual({ error: '올바른 이메일 주소를 입력해 주세요.' });
  });

  it('returns 201 and subscribed for a new normalized email', async () => {
    let subscribedEmail: string | undefined;
    const handler = createSubscribeHandler({
      subscribe: async (email) => {
        subscribedEmail = email;
        return { kind: 'subscribed' };
      },
    });

    const response = await handler(request('{"email":"  hello@example.com  "}'));

    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toEqual({ kind: 'subscribed' });
    expect(subscribedEmail).toBe('hello@example.com');
  });

  it('returns 409 and alreadySubscribed for an existing email', async () => {
    const handler = createSubscribeHandler({ subscribe: async () => ({ kind: 'alreadySubscribed' }) });

    const response = await handler(request('{"email":"hello@example.com"}'));

    expect(response.status).toBe(409);
    await expect(response.json()).resolves.toEqual({ kind: 'alreadySubscribed' });
  });

  it('returns a generic 500 error when storage fails', async () => {
    const provider: NewsletterProvider = {
      subscribe: async () => {
        throw new Error('storage secret failure');
      },
    };
    const handler = createSubscribeHandler(provider);

    const response = await handler(request('{"email":"hello@example.com"}'));

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({ error: '서버 오류' });
  });
});
