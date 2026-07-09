# AGENTS.md — 에이전트 작업 지도

이 저장소를 수정하는 AI 에이전트(헤르메스·Codex)를 위한 안내입니다.

## 무엇 하는 저장소인가

MAGMA(3040 남성 패션 브랜드)의 회사소개 사이트. Next.js + Tailwind v4.
3탭 — 홈(모션그래픽 히어로) · 블로그(패션 글) · 실적(데이터 리포트).
콘텐츠는 `content/posts`(블로그)·`content/reports`(실적) 마크다운이 진실원천,
페이지는 빌드 타임 정적 생성, 서버 코드는 발행 API 하나입니다.

## 수정 지점 지도

| 바꾸고 싶은 것 | 만지는 파일 |
| --- | --- |
| 회사 이름·태그라인·링크·CTA | `site.config.ts` (여기만) |
| 색·글꼴·모서리 | `DESIGN.md` 먼저 고치고 → `src/styles/tokens.css` 반영 |
| 글 | `content/posts/*.md` (또는 발행 API) |
| 히어로 영역·모션 | `src/components/Hero.tsx` |
| CTA 버튼 | `src/components/CtaSlot.tsx` + `site.config.ts` 의 `cta` |
| 히어로 배경 영상 | `src/components/HeroMedia.tsx` (이 파일 하나) |
| 룩북 이미지 자리 | `src/components/ImageSlot.tsx` 를 쓰는 곳 |

## 지켜야 할 계약 (바꾸지 말 것)

1. **frontmatter 필드명**: `title` `description` `date` `tags` `thumbnail` `draft` `period`(reports 전용) —
   외부 도구(oh-my-wiki 내보내기·bluekiwi 발행 워크플로우)가 이 이름에 의존합니다.
2. **slug**: 파일명 = slug, `^[a-z0-9]+(-[a-z0-9]+)*$` (한글·대문자·공백 금지).
3. **발행 API 계약**: `POST /api/posts` · `collection: "posts"(기본)|"reports"` ·
   응답 `{collection, slug, url, mode, commitUrl?}` (README 참조).
4. **색상은 토큰 경유만**: 컴포넌트에 hex 를 직접 쓰지 말고 `tokens.css` 변수를
   참조하는 유틸리티(`bg-canvas` `text-ink` `text-primary` `text-accent` 등)를 사용.
5. **의존성 추가 금지가 기본값**: 새 패키지가 필요하면 먼저 이유를 설명하고 승인받을 것.
6. **카피 톤**: 과장·느낌표 남발 금지 (DESIGN.md 브랜드 무드 참조).

## 발행 API 의 환경별 동작

| 환경 | 저장 방식 |
| --- | --- |
| 배포(Vercel) | GitHub Contents API 로 `content/posts/{slug}.md` 커밋 → 자동 재배포 |
| 로컬 dev (`GITHUB_TOKEN` 없음) | `content/posts/` 에 파일 직접 쓰기 |

환경변수: `PUBLISH_API_KEY`(인증) · `GITHUB_TOKEN`(fine-grained, contents 쓰기만) · `GITHUB_REPO`.

## 명령

| 명령 | 용도 |
| --- | --- |
| `npm run dev` | 개발 서버 (http://localhost:3000) |
| `npm run build` | 프로덕션 빌드 — **이것이 이 저장소의 테스트입니다** (통과 = 정상) |

## 확장 슬롯 (강의 유닛별)

- `scripts/` — 6.2 oh-my-wiki → content/posts 내보내기 파이프 자리 (지금은 빈 폴더)
- `CtaSlot` — 6.6 에서 구현. `site.config.ts` 의 `cta.enabled` 가 스위치
- `DESIGN.md` + `tokens.css` — 6.7 에서 통째로 교체 (문서 먼저, 코드 다음)
- `Hero.tsx` — 6.7 에서 모션 추가 (구조 변경 없이 이 파일만)
- `HeroMedia.tsx` — 6.7 에서 <video> 배경 영상 (지금은 브랜드 그라디언트)
- `content/reports/` — 7.4 실적 리포트 (발행 API collection:"reports")
- 실적 상세의 대시보드 임베드 — 7.5 BI 대시보드 <iframe> 자리
