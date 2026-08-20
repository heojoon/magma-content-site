# Preview v0 검증 기록

## ACE-Step

- 인증 상태: `ACE_MUSIC_API_KEY` configured (값 비출력)
- 엔드포인트 health: OK
- 생성 방식: Caption mode, 무보컬 BGM 프롬프트는 제작 계약의 요청 문구를 그대로 사용
- 생성 기록: `acestep-bgm-record.json`
- 연결 오디오: `hyperframes/assets/bgm.mp3`
- 검사: MP3 audio, 45.024초. HyperFrames 마스터에는 45초 구간으로 연결됨.

## HyperFrames

- 소스: `hyperframes/index.html`
- 미리보기: `renders/preview-v0.mp4`
- 규격: 1920×1080, 16:9, 30fps, 45.000초
- 오디오: AAC stereo, 영상 파일에 포함됨

## 자동 검사

- lint: 오류 0건. 경고 2건:
  - 동일 이미지가 블러 배경·전경·마무리 스트립에 재사용된다는 탐지 경고. 의도된 편집 구조다.
  - 한 HTML에 7개 장면이 배치돼 있다는 구조 경고. 45초 마스터의 한 파일 편집 선택이며 실행·렌더에는 문제 없음.
- validate: 콘솔 오류 없음, 텍스트 요소 15개 WCAG AA 통과.
- inspect: 9개 샘플 시점에서 레이아웃 문제 0건.
- 시각 검토: 05초·18초·36초 프레임을 검토했다. 텍스트 잘림·중첩, 피사체 가림, 의도치 않은 로고·워터마크를 발견하지 못했다.

## 검토 산출물

- `review/preview-05s.png`
- `review/preview-18s.png`
- `review/preview-36s.png`
- `review/preview-v0-contact-sheet.png`

## 수정 현황

- 사용 가능 수정 횟수: 2회
- 현재 사용 횟수: 0회
