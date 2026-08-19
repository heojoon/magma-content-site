# summer-resort-top5 발행 사전 검증

- 콘텐츠 slug: `summer-resort-top5`
- 검증 결과: 통과
- 개발 API 호출: 미실행 — 대표의 개발 발행 승인 전 호출 금지
- 운영 API 호출: 미실행 — 두 번째 요청 전 호출 금지

## 정적 검증

- 최종 원고: `content-pipeline/drafts/summer-resort-top5-final.md`
- frontmatter `slug`: `summer-resort-top5`
- `draft: false` 확인
- 최종 원고에서 `draft: true`, `{{THUMBNAIL_PATH}}`, `{{LOOK_01_PATH}}`~`{{LOOK_05_PATH}}`, 이전 썸네일 확장자(`.jpg`·`.jpeg`·`.webp`)를 검색: 결과 없음
- README의 파일 매핑과 최종 원고를 대조: 썸네일 `/images/summer-resort-top5-thumbnail.png`, 본문 이미지 `/images/summer-resort-top5-look-01.png`~`05.png`가 일치
- 실제 PNG 파일: README 지정 썸네일 1장 + 코디 이미지 5장, 총 6장. 모두 비어 있지 않은 PNG 파일로 확인.
  - 썸네일: 1536×1024
  - Look 01: 1024×1536
  - Look 02: 1122×1402
  - Look 03: 1024×1536
  - Look 04: 1024×1536
  - Look 05: 1122×1402

## 브라우저 렌더 검증

- Playwright `1.62.1`과 Chromium으로 로컬 HTTP 서버에서 검토 HTML을 실제 렌더했습니다.
- 검토 HTML: `content-pipeline/reviews/summer-resort-top5-review.html`
- 최종 원고 렌더 스냅샷: `content-pipeline/reviews/summer-resort-top5-final-rendered.html`
  - 원본 Markdown을 이 스냅샷으로 변환했습니다. 브라우저가 Markdown 파일을 iframe 문서로 렌더하지 않는 MIME 제약을 피하기 위한 검토용 파일입니다.
- 실행 명령: `node scripts/verify-summer-resort-review.mjs`
- 현재 실행 결과: 검토 HTML HTTP `200`; `<img>` 6개가 모두 `complete: true`, 자연 크기 양수, 화면 표시 상태로 확인됐습니다.
- 현재 실행 결과: HTML의 이미지 소스는 README의 6개 실제 PNG에 대응하고, 최종 원고 iframe이 로드되어 본문 텍스트 4,478자를 확인했습니다.
- 시각 확인: 전체 페이지 스크린샷 `content-pipeline/reviews/summer-resort-top5-review-rendered.png`에서 이미지 6장과 원고 프리뷰가 깨짐 없이 표시됐습니다.

## 회귀 검증

- `npm test` 통과: 7개 테스트 파일, 36개 테스트.

## 이번 검증의 로컬 서버

- 검증용 서버: Python `http.server`, `127.0.0.1:4173`.
- 검증 URL: `http://127.0.0.1:4173/content-pipeline/reviews/summer-resort-top5-review.html`
- 이 서버는 Playwright 검증을 위한 로컬 프로세스이며, 외부 공개 또는 운영 발행을 의미하지 않습니다.

## API 호출 기록

없음. 승인 전에는 개발 API를 호출하지 않았습니다.

## 상태

`Blocked — 대표의 개발 발행 승인 대기`
