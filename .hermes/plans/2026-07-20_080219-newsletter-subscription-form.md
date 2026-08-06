# 뉴스레터 구독 폼 Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** MAGMA 사이트의 방문자가 이메일 주소를 입력해 선택된 뉴스레터 발송 서비스에 안전하게 구독 요청을 보낼 수 있게 한다.

**Architecture:** 전역 푸터에 클라이언트 구독 폼을 배치하고, 브라우저는 내부 `POST /api/newsletter/subscribe`만 호출한다. 서버 라우트가 입력을 검증한 뒤 환경변수로 구성한 발송 서비스 어댑터를 호출하므로 서비스 API 키는 브라우저에 노출되지 않는다.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript strict mode, Tailwind CSS v4, 네이티브 `fetch`.

---

## 현재 컨텍스트 및 전제

- 현재 사이트에는 뉴스레터·이메일·구독 관련 구현이 없다.
- 전역 푸터는 `src/components/Footer.tsx`에서 렌더되며, `src/app/layout.tsx`가 모든 페이지에 푸터를 포함한다.
- 기존 API는 `src/app/api/posts/route.ts`의 `NextRequest`/`NextResponse` 패턴과 한국어 오류 메시지 형식을 따른다.
- `package.json`에 테스트 러너가 없으므로, 이번 범위의 기본 검증은 `npm run lint`, `npm run build`, 개발 서버에서의 수동 API/브라우저 확인이다. 테스트 러너나 외부 UI/메일 패키지는 추가하지 않는다.
- 브랜드 스타일은 `DESIGN.md`와 `src/styles/tokens.css` 토큰을 따라야 하며, 컴포넌트에서 hex 색상을 직접 쓰지 않는다.
- 구독 서비스(예: Brevo, Mailchimp, Buttondown, 자체 CRM), 리스트 ID, double opt-in 정책은 아직 결정되지 않았다. 실제 구현 전 이 결정을 확정해야 한다.
- `company/README.md`는 현재 워크스페이스에 존재하지 않아 확인할 수 없었다.

## 구현 순서

### Task 1: 구독 운영 계약 확정

**Objective:** 코드가 아닌 운영 결정을 먼저 고정해 API 계약과 개인정보 처리를 명확히 한다.

**Files:**
- Modify (결정 기록이 필요할 경우): `README.md` 또는 별도 운영 문서 경로
- Create (배포 시): `.env.local` — 저장소에 커밋하지 않음

**Step 1: 발송 서비스와 대상 리스트를 결정한다.**
- 선택 서비스의 서버 API 엔드포인트, 인증 방식, 구독자 식별 필드, 리스트/세그먼트 ID를 확인한다.
- 서비스 API 키와 리스트 ID는 서버 전용 환경변수로만 보관한다.

**Step 2: 동의·확인 정책을 정한다.**
- 수집 항목은 이메일 주소만으로 제한한다.
- double opt-in 사용 여부와 이미 구독된 주소의 UI 문구를 확정한다.
- 개인정보처리방침 URL이 있다면 폼 근처에 연결할지 결정한다.

**Step 3: 사용자 응답 규칙을 정한다.**
- 성공, 형식 오류, 이미 구독됨, 서비스 장애의 사용자 문구를 확정한다.
- 외부 서비스의 상세 오류나 API 키 관련 정보는 클라이언트에 전달하지 않는다는 규칙을 확정한다.

**Verification:** 운영 담당자가 서비스·리스트·동의 정책·환경변수 이름을 승인한다.

### Task 2: 서버 측 구독 어댑터와 환경변수 계약 작성

**Objective:** 특정 발송 서비스의 구현을 폼과 API 라우트에서 분리한다.

**Files:**
- Create: `src/lib/newsletter.ts`
- Create or modify: `.env.example` (키 이름만 기재하고 실제 값 제외)

**Step 1: 최소 도메인 타입을 정의한다.**
- `subscribe(email: string)`의 성공·중복·외부 실패 결과를 표현하는 타입을 만든다.
- `email` 이외의 개인정보 필드나 범용 마케팅 자동화 기능은 추가하지 않는다.

**Step 2: 선택한 서비스의 서버 API 호출을 구현한다.**
- 서버 런타임에서만 `process.env`를 읽는다.
- `fetch` 요청에 타임아웃/실패 처리를 넣고, 공급자별 응답을 내부 결과 타입으로 변환한다.
- 비밀값 미설정 상태는 운영 로그에는 식별 가능하게 남기되, 사용자에게는 일반적인 장애 메시지만 반환한다.

**Step 3: 환경변수 템플릿을 추가한다.**
- 예: `NEWSLETTER_PROVIDER_API_KEY`, `NEWSLETTER_AUDIENCE_ID`처럼 선택 서비스에 맞춘 키 이름과 용도를 `.env.example`에 기록한다.
- `.env.local` 및 실제 키가 Git 추적 대상이 아닌지 확인한다.

**Verification:** 로컬에서 환경변수가 없을 때 안전하게 실패하고, 테스트용 자격증명으로 어댑터가 선택 서비스의 sandbox/테스트 리스트에만 요청하는지 확인한다.

### Task 3: 내부 구독 API 라우트 구현

**Objective:** 브라우저에 외부 서비스 자격증명을 노출하지 않는 단일 구독 엔드포인트를 만든다.

**Files:**
- Create: `src/app/api/newsletter/subscribe/route.ts`
- Use: `src/lib/newsletter.ts`

**Step 1: 요청 본문 계약을 제한한다.**
- JSON 본문에서 `email` 문자열만 읽는다.
- 빈 값, 과도하게 긴 값, 기본 이메일 형식 위반을 `422`로 처리한다.

**Step 2: 어댑터 결과를 HTTP 응답으로 매핑한다.**
- 새 구독 성공은 `201`과 성공 메시지로 반환한다.
- 기존 구독자는 정책에 따라 성공과 동일한 안내 또는 명확한 중복 안내로 반환한다.
- 서비스 장애는 상세 원인 없이 `502` 또는 `503`과 일반 메시지로 반환한다.

**Step 3: 예상 밖 오류를 보호한다.**
- 서버 로그에는 오류 문맥을 남기되, API 응답에는 공급자 원문 오류·토큰·환경변수 값을 포함하지 않는다.

**Verification:** 개발 서버에서 `curl` 또는 브라우저 네트워크 탭으로 잘못된 본문, 유효 이메일, 중복 이메일, 공급자 장애를 각각 확인한다.

### Task 4: 재사용 가능한 뉴스레터 폼 UI 구현

**Objective:** 이메일 입력·제출·상태 표시를 담당하는 접근 가능한 클라이언트 컴포넌트를 만든다.

**Files:**
- Create: `src/components/NewsletterForm.tsx`
- Use: `src/app/api/newsletter/subscribe/route.ts`

**Step 1: 폼의 접근성 구조를 작성한다.**
- 보이는 라벨 또는 동등한 접근 가능한 라벨, `type="email"`, `required`, 자동완성 `email`을 사용한다.
- 제출 버튼과 성공/오류 상태 영역에 적절한 `aria` 속성을 적용한다.

**Step 2: 제출 상태를 구현한다.**
- 제출 중 버튼을 비활성화하고 중복 요청을 막는다.
- 성공 시 이메일 입력을 비우고 안내를 표시한다.
- 검증·서버 오류 시 입력값은 보존하고 사용자가 다시 시도할 수 있게 한다.

**Step 3: 브랜드 토큰만 사용해 스타일을 적용한다.**
- `bg-card`, `border-line`, `text-primary`, `text-ink-sub`, `bg-primary`, `text-card` 같은 기존 토큰 유틸리티를 사용한다.
- 테라코타 강조는 화면 내 한두 점 원칙을 지키며, 새 색상 토큰이나 외부 폰트를 추가하지 않는다.

**Verification:** 키보드만으로 이메일 입력, 제출, 오류 확인, 재시도가 가능한지 확인한다. 모바일 폭과 데스크톱 폭에서 입력과 버튼이 넘치지 않는지 확인한다.

### Task 5: 전역 푸터에 폼 연결

**Objective:** 모든 페이지에서 일관되게 뉴스레터 구독 폼을 제공한다.

**Files:**
- Modify: `src/components/Footer.tsx:3-20`
- Use: `src/components/NewsletterForm.tsx`

**Step 1: 푸터의 정보 구조를 조정한다.**
- 기존 회사명·외부 링크·저작권 표기를 유지한다.
- 폼에는 짧고 비과장적인 설명(예: 저널 및 브랜드 소식 수신)을 붙인다.

**Step 2: 반응형 레이아웃을 맞춘다.**
- 작은 화면에서는 기존 푸터 정보와 폼이 자연스럽게 세로 배치되도록 한다.
- 넓은 화면에서는 링크/저작권 정보와 폼이 읽기 좋은 간격을 유지하도록 한다.

**Step 3: 개인정보 고지를 연결한다.**
- Task 1에서 URL이 확정된 경우에만 고지 링크를 노출한다.
- URL이 아직 없다면 허위 링크나 임시 약관을 추가하지 않는다.

**Verification:** 홈·블로그·리포트·회사소개 페이지에서 푸터가 동일하게 노출되고, 기존 외부 링크가 유지되는지 확인한다.

### Task 6: 통합 검증과 배포 전 점검

**Objective:** 실제 구독 경로, 보안 경계, 빌드 호환성을 확인한다.

**Files:**
- Review: `src/components/NewsletterForm.tsx`
- Review: `src/components/Footer.tsx`
- Review: `src/app/api/newsletter/subscribe/route.ts`
- Review: `src/lib/newsletter.ts`
- Review: `.env.example`

**Step 1: 정적 검사와 프로덕션 빌드를 실행한다.**

Run: `npm run lint`
Expected: exit code 0.

Run: `npm run build`
Expected: exit code 0, 새 API 라우트와 페이지 렌더가 빌드에 포함됨.

**Step 2: 실제 통합 흐름을 확인한다.**
- 테스트 이메일로 폼을 제출하고, 선택 서비스의 테스트 리스트/관리 콘솔에서 구독 요청 또는 double opt-in 발송을 확인한다.
- 동일 주소 재제출, 잘못된 이메일, 환경변수 누락을 확인한다.

**Step 3: 비밀정보와 회귀를 점검한다.**
- 브라우저 번들·네트워크 응답에 API 키 또는 공급자 인증 헤더가 없는지 확인한다.
- 기존 푸터 링크, `npm run lint`, `npm run build`가 모두 유지되는지 확인한다.

## 파일 변경 예상 목록

- Create: `src/lib/newsletter.ts`
- Create: `src/app/api/newsletter/subscribe/route.ts`
- Create: `src/components/NewsletterForm.tsx`
- Modify: `src/components/Footer.tsx`
- Create or modify: `.env.example`
- Optional modify: 운영 결정 기록 문서 또는 개인정보처리방침 링크를 보유한 설정 파일

## 위험·트레이드오프·미결 사항

- **발송 서비스 미결정:** 서비스마다 중복 구독과 double opt-in 응답이 달라 Task 1의 확정 없이는 API 구현을 시작하지 않는다.
- **개인정보 처리:** 이메일도 개인정보이므로 목적·보관·수신거부·동의 문구는 운영 및 법무 검토가 필요하다.
- **봇/남용 방지:** 초기 범위는 서버 검증과 중복 제출 차단으로 제한한다. 트래픽 또는 스팸 징후가 확인되면 별도 범위로 rate limit/honeypot/CAPTCHA를 검토한다.
- **테스트 전략:** 현재 테스트 러너가 없으므로 이번 구현에서 의존성 추가 없이 린트·빌드·수동 통합 검증을 우선한다. 구독 로직이 커지면 다음 단계로 어댑터 단위 테스트 도입을 별도 승인받는다.
- **커밋:** 사용자 지시에 따라 현재는 구현·커밋하지 않는다. 구현 시에는 작업 단위별 변경을 검토한 뒤 프로젝트 규칙에 맞춰 커밋 여부를 결정한다.
