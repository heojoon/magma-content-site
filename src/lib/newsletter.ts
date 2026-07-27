const invalidEmail = {
  ok: false,
  message: '올바른 이메일 주소를 입력해 주세요.',
} as const;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type SubscribeOutcome =
  | { kind: 'subscribed' }
  | { kind: 'alreadySubscribed' }
  | { kind: 'unavailable' };

export interface NewsletterProvider {
  subscribe(email: string): Promise<SubscribeOutcome>;
}

export async function subscribeWithProvider(
  provider: NewsletterProvider,
  email: string,
): Promise<SubscribeOutcome> {
  try {
    return await provider.subscribe(email);
  } catch {
    return { kind: 'unavailable' };
  }
}

export function normalizeAndValidateEmail(value: unknown) {
  if (typeof value !== 'string') {
    return invalidEmail;
  }

  const email = value.trim();

  if (email.length > 254 || !emailPattern.test(email)) {
    return invalidEmail;
  }

  return { ok: true, email } as const;
}
