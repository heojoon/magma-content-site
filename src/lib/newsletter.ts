const invalidEmail = {
  ok: false,
  message: '올바른 이메일 주소를 입력해 주세요.',
} as const;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
