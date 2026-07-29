import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import NewsletterSection from '@/components/NewsletterSection';

describe('NewsletterSection', () => {
  it('renders the update purpose, subscription form, and opt-out assurance', () => {
    render(<NewsletterSection />);

    expect(screen.getByRole('heading', { name: '콘텐츠 업데이트' })).toBeTruthy();
    expect(screen.getByText('새로운 글과 브랜드 소식을 이메일로 알려드립니다.')).toBeTruthy();
    expect(screen.getByLabelText('이메일 주소')).toBeTruthy();
    expect(screen.getByText('언제든 수신 거부')).toBeTruthy();
  });

  it('places the newsletter section after the brand introduction and before latest blog posts', () => {
    const pageSource = readFileSync(resolve(process.cwd(), 'src/app/page.tsx'), 'utf8');

    const brandIntroductionIndex = pageSource.indexOf('브랜드 소개 스트립');
    const newsletterSectionIndex = pageSource.indexOf('<NewsletterSection />');
    const latestBlogIndex = pageSource.indexOf('최신 블로그');

    expect(brandIntroductionIndex).toBeGreaterThan(-1);
    expect(newsletterSectionIndex).toBeGreaterThan(brandIntroductionIndex);
    expect(latestBlogIndex).toBeGreaterThan(newsletterSectionIndex);
  });
});
