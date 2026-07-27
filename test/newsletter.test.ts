import { describe, expect, it } from 'vitest';

import { normalizeAndValidateEmail } from '@/lib/newsletter';

const invalidEmail = {
  ok: false,
  message: '올바른 이메일 주소를 입력해 주세요.',
} as const;

describe('normalizeAndValidateEmail', () => {
  it('trims a valid email address', () => {
    expect(normalizeAndValidateEmail('  hello@example.com  ')).toEqual({
      ok: true,
      email: 'hello@example.com',
    });
  });

  it.each([
    ['an address containing whitespace', 'hello @example.com'],
    ['an address without a domain dot', 'hello@example'],
    ['an empty string', ''],
    ['a non-string value', null],
    ['an address longer than 254 characters', `${'a'.repeat(243)}@example.com`],
  ])('rejects %s', (_description, value) => {
    expect(normalizeAndValidateEmail(value)).toEqual(invalidEmail);
  });
});
