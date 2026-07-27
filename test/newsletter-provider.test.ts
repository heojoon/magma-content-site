import { describe, expect, it } from 'vitest';

import { subscribeWithProvider, type NewsletterProvider } from '@/lib/newsletter';

describe('subscribeWithProvider', () => {
  it.each([
    { kind: 'subscribed' },
    { kind: 'alreadySubscribed' },
  ] as const)('preserves a provider $kind outcome', async (outcome) => {
    const provider: NewsletterProvider = {
      subscribe: async () => outcome,
    };

    await expect(subscribeWithProvider(provider, 'hello@example.com')).resolves.toEqual(outcome);
  });

  it('returns unavailable without exposing a provider error', async () => {
    const provider: NewsletterProvider = {
      subscribe: async () => {
        throw new Error('provider secret failure');
      },
    };

    await expect(subscribeWithProvider(provider, 'hello@example.com')).resolves.toEqual({
      kind: 'unavailable',
    });
  });
});
