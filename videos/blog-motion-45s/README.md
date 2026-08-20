# MAGMA 여름 휴양지 모션그래픽 자산 묶음

## 결과물

| 구분 | 상대 경로 | 사양 |
| --- | --- | --- |
| 마스터 | `renders/final.mp4` | 45초, 1920×1080, 30fps, H.264 + AAC 무보컬 BGM |
| 승인 미리보기 | `renders/preview-v0.mp4` | 45초, 1920×1080, 30fps, H.264 + AAC |
| 웹 히어로 루프 | `../../public/hero.mp4` | 12초, 1920×1080, 30fps, H.264, 오디오·자막·로고 없음 |
| HyperFrames 소스 | `hyperframes/index.html` | MAGMA 다크 에디토리얼 마스터 소스 |
| BGM 기록 | `acestep-bgm-record.json` | ACE-Step 생성 기록. 키 값은 포함하지 않음 |

## 제작 기준

- 컨셉: A. 여행의 선
- 디자인 정본: BlueKiwi `MAGMA Brand Design System` ID 4, v1.0.0
- 적용: 니어블랙 `#141414`, 웜 오프화이트 전경, 테라코타 `#C05621` 한 점, 세리프 디스플레이
- 수정: 0/2회 사용

## 검사

- HyperFrames check: 통과. 오류 0건, 레이아웃 0건, 텍스트 15개 WCAG AA 통과.
- 사이트 빌드: `npm run build` 통과.
- 실제 페이지 재생: `http://127.0.0.1:3003/`에서 `/hero.mp4`를 확인. `autoplay`, `muted`, `loop`, `playsInline`은 모두 true이며, 영상은 재생 중이고 1920×1080으로 로드됨.
- 사이트 수정 범위: `site.config.ts`의 `hero.video`만 `"/hero.mp4"`로 변경. `HeroMedia.tsx`는 변경하지 않음.

## 체크섬

- `renders/final.mp4`: `d51854865d9838d0e55c99e07f4b385be18284353876fb683e4cbf9c9a14cdb3`
- `../../public/hero.mp4`: `2043ed2c7cc143fca0950f8efe641c4f1018c912af4c5e916a8c2908b7136712`

## 참고

`hyperframes/assets/`에는 로컬 렌더에 필요한 입력 이미지와 BGM 파일이 포함됩니다. `acestep-bgm-record.json`에는 생성 메타데이터만 보관하며, `ACE_MUSIC_API_KEY` 값은 기록하지 않습니다.
