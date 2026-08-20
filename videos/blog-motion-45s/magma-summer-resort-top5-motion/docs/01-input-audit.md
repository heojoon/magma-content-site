# 입력 감사 — 2026 여름 휴양지 남성 패션 탑5 코디

## 제작 계약

- 마스터: 45초, 16:9, HyperFrames 기반 로컬 MP4 렌더
- 마스터 출력: `videos/blog-motion-45s/renders/final.mp4`
- 웹 루프: 승인 이미지 기반, 12초, 16:9, 무음·무자막·무로고
- 웹 루프 출력: `public/hero.mp4`
- 사이트 연결: `site.config.ts`의 `hero.video`만 `"/hero.mp4"`로 변경
- 수정 한도: 승인 후 수정은 최대 2회
- 음악: ACE-Step 무보컬 BGM. 사용 프롬프트는 작업 요청에 기록된 문구를 그대로 사용.

## 원문

- 경로: `content/posts/summer-resort-top5.md`
- 제목: `2026 여름 휴양지 남성 패션: 여행 동선을 잇는 다섯 코디`
- 핵심 메시지: 새 옷 다섯 벌을 늘리는 대신, 셔츠·팬츠·가벼운 겉옷의 역할을 여행 동선에 맞춰 바꿔 입는다.
- 내러티브 순서: 출발·이동 → 늦은 아침·카페 → 해 질 무렵 산책 → 저녁 식사 → 귀가·도시 복귀.

## 시각 자산

| 순서 | 경로 | 규격 | 역할 | 상태 |
| --- | --- | --- | --- | --- |
| 0 | `public/images/summer-resort-top5-thumbnail.png` | 1536×1024 PNG | 오프닝·엔딩용 룩북 집합 | 확인됨 |
| 1 | `public/images/summer-resort-top5-look-01.png` | 1024×1536 PNG | 출발·장거리 이동 | 확인됨 |
| 2 | `public/images/summer-resort-top5-look-02.png` | 1122×1402 PNG | 늦은 아침·로컬 카페 | 확인됨 |
| 3 | `public/images/summer-resort-top5-look-03.png` | 1024×1536 PNG | 해 질 무렵 산책 | 확인됨 |
| 4 | `public/images/summer-resort-top5-look-04.png` | 1024×1536 PNG | 예약한 저녁 식사 | 확인됨 |
| 5 | `public/images/summer-resort-top5-look-05.png` | 1122×1402 PNG | 귀가·도시 복귀 | 확인됨 |

- 모든 입력은 PNG이며, 이미지 README에 텍스트·숫자·워드마크·로고·워터마크가 없다고 기록돼 있다.
- 콘택트시트: `videos/blog-motion-45s/contact-sheet.png`

## 적용 디자인 근거

### 우선 정본

사용자 지정 BlueKiwi `MAGMA Brand Design System` (ID 4, v1.0.0, published)을 적용한다.

- 캔버스: 니어블랙 `#141414`
- 전경: 웜 오프화이트 `#F4F1EA` / 본문 `#EDEAE3`
- 강조: 테라코타 `#C05621`, 화면당 한두 점
- 표면: `#1E1E1E`, 웜 다크 보더 `#2E2A26`
- 디스플레이: `Noto Serif KR, Georgia, serif`, 700, 넓은 자간 약 `0.18em`
- 본문: `Noto Sans KR, Inter, system-ui, sans-serif`
- 모션: 절제된 흐름. 네온, 과한 그라데이션, 순수 블랙, 순백 본문은 배제.

`/home/user/.hermes/company/04-디자인시스템.md`에는 과거의 파치먼트·딥 틸 규칙이 남아 있으나, 본 작업에서는 사용자가 명시한 BlueKiwi 등록 정본을 우선한다.

## 구현 경계

- `src/components/HeroMedia.tsx`는 읽기 전용으로 유지한다. 이미 `autoPlay`, `muted`, `loop`, `playsInline`을 제공한다.
- 기존 작업 트리에 다른 변경사항이 존재한다. 본 작업은 지정된 영상 폴더, `public/hero.mp4`, `site.config.ts`의 hero.video 한 줄만 변경 대상으로 한다.
- 자동재생 검증은 빌드 후 실제 렌더된 `<video>`의 `autoplay`, `muted`, `loop`, `playsinline`, `source[src="/hero.mp4"]`를 확인한다.
