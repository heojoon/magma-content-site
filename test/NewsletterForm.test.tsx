import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import NewsletterForm from '@/components/NewsletterForm';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('NewsletterForm', () => {
  it('posts a normalized valid email, clears the input, and announces success for 201', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ status: 201 });
    vi.stubGlobal('fetch', fetchMock);

    render(<NewsletterForm />);

    const emailInput = screen.getByLabelText('이메일 주소');
    fireEvent.change(emailInput, { target: { value: '  hello@example.com  ' } });
    fireEvent.submit(screen.getByRole('button', { name: '구독하기' }).closest('form')!);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'hello@example.com' }),
      });
    });

    expect((emailInput as HTMLInputElement).value).toBe('');
    expect(screen.getByRole('status').textContent).toBe('구독해 주셔서 감사합니다.');
  });

  it('shows the validation message without fetching for an invalid email', () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    render(<NewsletterForm />);

    fireEvent.change(screen.getByLabelText('이메일 주소'), { target: { value: 'invalid-email' } });
    fireEvent.submit(screen.getByRole('button', { name: '구독하기' }).closest('form')!);

    expect(fetchMock).not.toHaveBeenCalled();
    expect(screen.getByRole('status').textContent).toBe('올바른 이메일 주소를 입력해 주세요.');
  });

  it('disables submission and announces pending state while the request is in flight', async () => {
    let resolveRequest: (response: { status: number }) => void = () => {};
    vi.stubGlobal(
      'fetch',
      vi.fn().mockReturnValue(
        new Promise((resolve) => {
          resolveRequest = resolve;
        }),
      ),
    );

    render(<NewsletterForm />);

    fireEvent.change(screen.getByLabelText('이메일 주소'), { target: { value: 'hello@example.com' } });
    fireEvent.submit(screen.getByRole('button', { name: '구독하기' }).closest('form')!);

    const button = screen.getByRole('button', { name: '구독 요청 중' });
    expect((button as HTMLButtonElement).disabled).toBe(true);
    expect(button.getAttribute('aria-busy')).toBe('true');
    expect(screen.getByRole('status').textContent).toBe('구독 요청 중');

    resolveRequest({ status: 201 });
    await waitFor(() => expect(screen.getByRole('status').textContent).toBe('구독해 주셔서 감사합니다.'));
  });

  it('retains the input and announces an unavailable message after a failed request', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ status: 503 }));

    render(<NewsletterForm />);

    const emailInput = screen.getByLabelText('이메일 주소');
    fireEvent.change(emailInput, { target: { value: 'hello@example.com' } });
    fireEvent.submit(screen.getByRole('button', { name: '구독하기' }).closest('form')!);

    await waitFor(() => {
      expect(screen.getByRole('status').textContent).toBe(
        '현재 구독 요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.',
      );
    });
    expect((emailInput as HTMLInputElement).value).toBe('hello@example.com');
  });
});
