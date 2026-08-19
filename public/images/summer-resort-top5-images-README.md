# summer-resort-top5 이미지 제작 README

콘텐츠: 2026 여름 휴양지에서 빛나는 남성 패션 탑5 코디
작업자: Mia / MAGMA 전략기획실
제작일: 2026-08-14

## 적용 디자인 시스템

- BlueKiwi 조회 상태: 활성 사용자 컨텍스트는 없었음(`active: null`).
- 적용한 등록 시스템: MAGMA Brand Design System
  - id: 4
  - slug: `magma-brand-design-system`
  - version: `1.0.0`
  - category/surface: Fashion Brand / web
  - registry status: published, system `is_active: true`
- 핵심 토큰/무드:
  - 니어블랙/딥 틸 계열 그림자, 웜 오프화이트 전경, 테라코타 한 점 강조.
  - 따뜻한 자연광, 절제된 룩북 톤, 과시보다 단정한 성인 남성의 여행 장면.
- 함께 확인한 회사 기준: `~/.hermes/company/04-디자인시스템.md`
  - 딥 틸, 파치먼트, 테라코타, 따뜻한 자연 톤, 네온·요란한 그라데이션·과장 금지.

## 제작 및 권한 메모

- 제작 방식: Hermes `image_generate` / OpenAI `gpt-image-2-medium` 텍스트 투 이미지 생성.
- 외부 사진·브랜드 로고·상표 이미지는 사용하지 않음.
- 이미지 안에는 의도적으로 글자, 숫자, 워드마크, 로고, 워터마크, 간판 텍스트를 넣지 않음.
- 검수 방식: 생성 후 각 파일을 시각 점검했고, 눈에 띄는 글자·숫자·로고·워터마크·간판 텍스트는 발견하지 못함.

## 파일 매핑

| 원고 슬롯 | 실제 상대 경로 | 이미지 설명 | 대체 텍스트 |
| --- | --- | --- | --- |
| `{{THUMBNAIL_PATH}}` | `/images/summer-resort-top5-thumbnail.png` | 다섯 코디의 핵심 옷을 따뜻한 휴양지 건축과 자연광 위에 펼친 룩북형 썸네일. 파치먼트 스톤, 웜 오프화이트 의류, 딥 틸 그림자, 테라코타 오브제로 MAGMA 톤을 통일. | 여름 휴양지 여행 동선을 위한 남성 코디 다섯 가지를 따뜻한 자연광 아래 정돈해 놓은 룩북 이미지 |
| `{{LOOK_01_PATH}}` | `/images/summer-resort-top5-look-01.png` | 출발·장거리 이동 장면. 오픈칼라 셔츠, 단순한 이너, 이지 테이퍼드 팬츠, 로우 프로파일 스니커즈, 작은 여행 가방으로 이동의 첫 장면을 표현. | 오픈칼라 셔츠와 이지 테이퍼드 팬츠를 입고 여행지 이동 공간을 걷는 남성 |
| `{{LOOK_02_PATH}}` | `/images/summer-resort-top5-look-02.png` | 늦은 아침·로컬 카페 장면. 질감 있는 니트 폴로와 스트레이트 팬츠, 간결한 신발, 테라코타 컵과 벽면으로 낮 시간의 단정함을 표현. | 니트 폴로와 스트레이트 팬츠를 입고 조용한 카페 테라스에 앉은 남성 |
| `{{LOOK_03_PATH}}` | `/images/summer-resort-top5-look-03.png` | 해 질 무렵 산책 장면. 오버셔츠, 무지 티셔츠, 롱 쇼츠, 슬립온/로퍼형 신발로 편안하지만 흐트러지지 않는 해안 산책 룩을 표현. | 오버셔츠와 티셔츠, 롱 쇼츠를 입고 해 질 무렵 해안 산책로를 걷는 남성 |
| `{{LOOK_04_PATH}}` | `/images/summer-resort-top5-look-04.png` | 예약한 저녁 식사 장면. 가벼운 재킷형 셋업과 간결한 이너, 저녁 다이닝 공간의 낮은 조도로 한 단계 정돈된 차림을 표현. | 가벼운 셋업과 간결한 이너를 입고 저녁 식사 공간 앞에 선 남성 |
| `{{LOOK_05_PATH}}` | `/images/summer-resort-top5-look-05.png` | 귀가·도시 복귀 장면. 롱슬리브 니트/셔츠 역할의 상의, 단정한 팬츠, 여행 가방으로 휴양지에서 도시 일상으로 돌아오는 전환을 표현. | 긴소매 니트와 단정한 팬츠를 입고 여행 가방과 함께 숙소를 나서는 남성 |

## 원고 반영 제안

프론트매터와 본문 `<img>` 슬롯은 다음 값으로 치환하면 됩니다.

```yaml
thumbnail: "/images/summer-resort-top5-thumbnail.png"
images:
  - "/images/summer-resort-top5-look-01.png"
  - "/images/summer-resort-top5-look-02.png"
  - "/images/summer-resort-top5-look-03.png"
  - "/images/summer-resort-top5-look-04.png"
  - "/images/summer-resort-top5-look-05.png"
```

## 검수 체크리스트

- [x] 썸네일 1장 생성.
- [x] 코디별 이미지 5장 생성.
- [x] 각 이미지가 원고의 5개 코디와 1:1로 연결됨.
- [x] 전체 이미지에 따뜻한 자연 톤과 절제된 룩북 무드 적용.
- [x] 네온, 요란한 그라데이션, 불꽃, 용암, 과도한 럭셔리, 근육 과시형 이미지를 피함.
- [x] 이미지 안 글자·숫자·워드마크·로고·워터마크·간판 텍스트 없음으로 점검.
