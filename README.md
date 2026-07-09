# magma-content-site

MAGMA(3040 남성 패션 브랜드)의 회사소개 사이트 스타터입니다.
인프런 「Hermes × Codex 가상 오피스」의 섹션 6(콘텐츠 블로그)과
섹션 7(데이터 실적 보고)이 이 저장소 위에서 함께 진행됩니다.

> 교육 실습용 스타터입니다. 홈 히어로는 나중에 모션그래픽 영상으로 채우는 자리입니다.

## 준비물

- Node.js 20 이상 (`node -v` 로 확인)

## 바로 띄우기

```bash
npm install
npm run dev
```

브라우저에서 http://localhost:3000 을 열면 사이트가 보입니다.

## 구조 한눈에

```
site.config.ts        회사 정체성 (이름·태그라인·링크·CTA) — 가장 먼저 여러분 회사로 바꾸는 파일
DESIGN.md             브랜드 디자인 정본 — 색·글꼴·사용 규칙
content/posts/        블로그 글 (마크다운 1파일 = 1글)
content/reports/      실적 보고 리포트 (마크다운)
src/styles/tokens.css DESIGN.md 를 코드로 옮긴 디자인 토큰
src/components/       Hero(히어로) · PostCard(글 카드) · CtaSlot(CTA 자리) · Header · Footer
src/components/HeroMedia.tsx  홈 히어로 배경 — 여기에 영상을 넣습니다
src/lib/posts.ts      글 읽기 (frontmatter 파싱·정렬·draft 제외)
src/lib/publish.ts    발행 API 내부 로직
src/app/api/posts/    발행 API 엔드포인트 (POST /api/posts)
scripts/              (비어 있음) 6.2 oh-my-wiki 내보내기 파이프가 들어올 자리
```

## 글 쓰는 두 가지 방법

**① 파일로** — `content/posts/my-post.md` 를 만들고 커밋·푸시하면
배포가 자동으로 다시 실행되면서 글이 올라갑니다.

```markdown
---
title: "글 제목 (한글 가능)"
description: "목록에 보이는 한 줄 요약"
date: 2026-07-08
tags: [태그]
---

본문은 마크다운으로 씁니다.
```

파일명이 곧 주소(slug)가 되므로 **영문 소문자·숫자·하이픈만** 사용하세요.
`draft: true` 를 넣으면 발행 전 글로 감춰집니다.

**② 발행 API 로** — 에이전트·자동화 도구가 쓰는 길입니다.

```bash
curl -X POST https://{내-배포-주소}/api/posts \
  -H "Authorization: Bearer {PUBLISH_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"title":"첫 자동 발행","description":"발행 API 테스트","content":"본문입니다."}'
```

실적 보고를 올리려면 `"collection": "reports"` 를 함께 보냅니다(기본값은 `"posts"` = 블로그).

| 응답 코드 | 의미 |
| --- | --- |
| 201 | 발행 성공 — `slug`·`url` 반환 |
| 400 | collection 값이 posts·reports 가 아님 |
| 401 | 인증 키 불일치 |
| 409 | 같은 slug 의 글이 이미 있음 |
| 422 | 필수 필드 누락·형식 오류 (`fields` 에 상세) |

로컬(`npm run dev`)에서는 GitHub 설정 없이도 `content/posts/` 에 파일을 직접 써서
바로 확인할 수 있습니다. 배포 환경에서는 GitHub 커밋을 통해 발행됩니다.

## Vercel 배포

1. 이 저장소를 여러분 GitHub 계정으로 가져옵니다 (fork 또는 새 repo 로 push).
2. https://vercel.com 에 GitHub 계정으로 가입 후 **Add New → Project** 에서 저장소를 Import 합니다.
3. Environment Variables 에 아래 3개를 넣습니다 (`.env.example` 참고).
   - `PUBLISH_API_KEY` — 직접 만든 긴 임의 문자열
   - `GITHUB_TOKEN` — fine-grained PAT (이 저장소 한정, Contents: Read and write)
   - `GITHUB_REPO` — `여러분계정/저장소이름`
4. Deploy 를 누르면 끝. 이후 push 할 때마다 자동으로 다시 배포됩니다.

## 문제가 생기면

| 증상 | 확인할 것 |
| --- | --- |
| `npm install` 실패 | `node -v` 가 20 이상인지 |
| 3000 포트 사용 중 | `PORT=3001 npm run dev` |
| 글이 목록에 안 보임 | frontmatter 에 title·description·date 가 다 있는지, `draft: true` 는 아닌지 |
| 발행 API 401 | Authorization 헤더의 키가 배포 환경변수와 같은지 |
| 발행 API 500 (배포에서) | `GITHUB_TOKEN`·`GITHUB_REPO` 환경변수가 설정됐는지 |

## 앞으로 이 저장소가 커지는 자리

| 실습 | 자리 |
| --- | --- |
| 6.2 콘텐츠 백엔드 (oh-my-wiki) | `scripts/` 에 내보내기 파이프 추가 |
| 6.5 블로그 자동 발행 (bluekiwi) | 발행 API 를 워크플로우에서 호출 |
| 6.6 SNS + CTA | `site.config.ts` 의 cta 활성화 + `CtaSlot` 구현 |
| 6.7 디자인 마감 | `DESIGN.md`·`tokens.css` 교체 + `Hero` 에 모션 |
