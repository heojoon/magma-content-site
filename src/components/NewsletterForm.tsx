'use client';

import { FormEvent, useState } from 'react';

import { normalizeAndValidateEmail } from '@/lib/newsletter';

const unavailableMessage = '현재 구독 요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.';
const alreadySubscribedMessage = '이미 구독된 이메일입니다.';
const successMessage = '구독해 주셔서 감사합니다.';

type Status =
  | { kind: 'idle'; message: '' }
  | { kind: 'pending'; message: '구독 요청 중' }
  | { kind: 'success'; message: typeof successMessage }
  | { kind: 'error'; message: string };

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>({ kind: 'idle', message: '' });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validatedEmail = normalizeAndValidateEmail(email);
    if (!validatedEmail.ok) {
      setStatus({ kind: 'error', message: validatedEmail.message });
      return;
    }

    setStatus({ kind: 'pending', message: '구독 요청 중' });

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: validatedEmail.email }),
      });

      if (response.status === 409) {
        const responseBody: unknown = await response.json();
        if (
          typeof responseBody === 'object' &&
          responseBody !== null &&
          'kind' in responseBody &&
          responseBody.kind === 'alreadySubscribed'
        ) {
          setStatus({ kind: 'error', message: alreadySubscribedMessage });
          return;
        }
      }

      if (response.status !== 201) {
        setStatus({ kind: 'error', message: unavailableMessage });
        return;
      }

      setEmail('');
      setStatus({ kind: 'success', message: successMessage });
    } catch {
      setStatus({ kind: 'error', message: unavailableMessage });
    }
  }

  const isPending = status.kind === 'pending';

  return (
    <form className="mt-6" onSubmit={handleSubmit}>
      <label className="mb-2 block text-sm font-bold text-primary" htmlFor="newsletter-email">
        이메일 주소
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          autoComplete="email"
          className="min-w-0 flex-1 rounded-ui border border-line bg-canvas px-4 py-3 text-sm text-ink outline-none placeholder:text-ink-muted focus:border-primary"
          disabled={isPending}
          id="newsletter-email"
          name="email"
          onChange={(event) => setEmail(event.target.value)}
          required
          type="email"
          value={email}
        />
        <button
          aria-busy={isPending}
          className="rounded-ui bg-primary px-5 py-3 text-sm font-bold text-card hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isPending}
          type="submit"
        >
          {isPending ? '구독 요청 중' : '구독하기'}
        </button>
      </div>
      <p aria-live="polite" className="mt-3 text-sm text-ink-sub" role="status">
        {status.message}
      </p>
    </form>
  );
}
