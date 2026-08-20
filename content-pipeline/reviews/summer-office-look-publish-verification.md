# summer-office-look 운영 반영 검증 기록

- 상태: Passed — 운영 반영 검증 성공
- 검증 시각: 2026-08-20T08:40:49+09:00
- 검증 대상: `https://magma-content-site-six.vercel.app/blog/summer-office-look`
- 이 작업의 운영 API 추가 호출: 0회
- Vercel CLI 사용: 없음
- 비밀값/API key/token/cookie 기록: 없음

## 부모 deploy 결과 인수값

| 항목 | 값 |
| --- | --- |
| 운영 API HTTP 상태 | `201` |
| mode | `github` |
| 글 주소 | `https://magma-content-site-six.vercel.app/blog/summer-office-look` |
| commitUrl | `https://github.com/heojoon/magma-content-site/commit/172c6bfdb7c67960e882d000d90699f4eee5dd4b` |
| Vercel Ready | `true` |
| Vercel 기본 검증 | HTTP `200`, server `Vercel`, 이미지 참조 6개 complete |

## 운영 사이트 HTTP 및 렌더링 검증

- Playwright Chromium으로 운영 글 주소를 1회 로드했습니다.
- 페이지 HTTP 상태: `200`
- 응답 헤더 요지: server `Vercel`, `x-vercel-id` 확인, `cache-control: public, max-age=0, must-revalidate`
- 문서 제목: `여름 오피스룩: 하루의 장면을 잇는 다섯 조합 | MAGMA`
- H1: `여름 오피스룩: 하루의 장면을 잇는 다섯 조합`
- 본문 텍스트 길이: 4,836자
- 스크린샷: `/tmp/summer-office-look-prod-rendered.png`

## 이미지 6개 렌더링 확인

| 이미지 | HTTP/content-type | 브라우저 렌더링 |
| --- | --- | --- |
| `/images/summer-office-look/summer-office-look-thumbnail.png` | `200`, Next optimized `image/webp` | `complete=true`, visible=true, normalized source 일치, natural size `720×450` |
| `/images/summer-office-look/summer-office-look-look-01.png` | `200`, `image/png` | `complete=true`, visible=true, natural size `1600×1000` |
| `/images/summer-office-look/summer-office-look-look-02.png` | `200`, `image/png` | `complete=true`, visible=true, natural size `1600×1000` |
| `/images/summer-office-look/summer-office-look-look-03.png` | `200`, `image/png` | `complete=true`, visible=true, natural size `1600×1000` |
| `/images/summer-office-look/summer-office-look-look-04.png` | `200`, `image/png` | `complete=true`, visible=true, natural size `1600×1000` |
| `/images/summer-office-look/summer-office-look-look-05.png` | `200`, `image/png` | `complete=true`, visible=true, natural size `1600×1000` |

검증 결과: 운영 글에서 기대 이미지 6개가 각각 1개씩 매칭됐고, 6개 모두 `complete=true` 및 visible 상태로 실제 렌더링됐습니다.

## 금지/보안 확인

- 이 검증 작업에서는 `POST /api/posts` 또는 운영 API를 추가 호출하지 않았습니다.
- Vercel CLI를 사용하지 않았습니다.
- 문서에는 API key, token, cookie, 내부 인증 정보, 원문 secret 값을 남기지 않았습니다.

## 최종 판정

Passed — 운영 글 HTTP `200`, mode `github` deploy 결과, 글 주소, commitUrl, Vercel Ready, 운영 이미지 6개 렌더링 확인을 완료했습니다.
