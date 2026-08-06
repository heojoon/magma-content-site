# MAGMA 뉴스레터 구독 폼 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task.

**Goal:** 홈의 브랜드 소개와 최신 글 사이에 이메일 기반 콘텐츠 업데이트 구독 폼을 추가하고, 승인된 `magma-mail` 테스트 리스트로 안전하게 구독 요청을 보낸다.

**Architecture:** 클라이언트 폼은 사이트 내부의 `POST /api/newsletter/subscribe`에 이메일만 보낸다. API 라우트는 입력을 다시 검증하고, 서버 전용 `magma-mail` 어댑터에 요청을 위임한다. 어댑터는 서비스 응답을 `subscribed`·`alreadySubscribed`·`unavailable`의 제한된 결과로 정규화하므로, 서비스 API 키·원문 오류·저장 구현은 브라우저에 노출되지 않는다.

**Tech Stack:** Next.js 16.2 App Router, React 19, TypeScript strict, Tailwind CSS v4, native `fetch`; 테스트는 Vitest, jsdom, React Testing Library, `@testing-library/user-event`를 개발 의존성으로 추가한다.

## Global Constraints

- 콘텐츠 업데이트 수신용 폼을 홈의 브랜드 소개와 최신 글 사이에 배치한다.
- 이메일 주소만 수집하고, 폼 근처에 구독 목적과 수신 거부 안내를 표시한다.
- 앞뒤 공백을 제거하고 기본 이메일 형식을 확인한다. 기존 주소는 신규 구독과 같은 성공 안내로 처리한다.
- 제출 중 스피너를 표시하고, 성공·실패는 토스트로 안내한다. 토스트는 화면낭독기에도 전달한다.
- 외부 뉴스레터 서비스에만 저장하고 사이트는 영구 저장하지 않는다. 서비스의 중복 안전성을 사용하며 서버 타임아웃과 최소한의 남용 방지를 둔다.
- 내부 테스트 환경에서 검증하고, 공개 승인은 별도 운영 검토로 분리한다.
- 조직에서 이미 승인한 뉴스레터 서비스와 테스트 리스트를 사용한다.
- 색상은 토큰 유틸리티만 사용하고 컴포넌트에 hex 값을 쓰지 않는다.
- 외부 폰트를 추가하지 않는다.
- 대시보드/발행 API 계약, Markdown 콘텐츠 파이프라인, 기존 전역 푸터는 변경하지 않는다.
- 실제 비밀값은 `.env.local`에만 두며, `.env.local` 또는 토큰을 읽거나 커밋하지 않는다.
- 새 의존성은 기본적으로 금지되어 있으므로, Task 1의 테스트 의존성 추가는 이 계획의 사용자 승인 후에만 수행한다.

## Execution Blocker: magma-mail API Contract

현재 저장소에는 `magma-mail` API 문서·기존 연동 코드·테스트 리스트 식별자가 없다. API 계약을 추정하거나 가짜 엔드포인트를 구현하지 않는다.

코드 작업을 시작하기 전에 운영 담당자가 아래 값을 제공해야 한다.

1. 구독 엔드포인트 URL과 HTTP 메서드
2. 인증 방식 및 서버 전용 환경변수 이름
3. 요청 JSON의 이메일 필드명과 테스트 리스트/세그먼트 필드명
4. 성공·이미 구독됨·유효성 오류·일시 장애의 HTTP 상태 및 응답 JSON 예시
5. 테스트 리스트 식별자와 double opt-in 사용 여부
6. 구독 목적·수신 거부 안내의 최종 문구

이 값이 제공되기 전에는 Task 1의 테스트 도구 설치까지만 가능하며, `src/lib/magmaMail.ts`와 실제 API 라우트 구현은 시작하지 않는다.

## Provider-neutral Interface Contract

외부 계약을 UI와 분리하기 위해 다음 인터페이스를 고정한다. `magma-mail`의 실제 요청/응답 매핑은 Task 4에서 공식 API 문서에만 근거해 이 인터페이스를 구현한다.

```ts
export type SubscribeOutcome =
  | { kind: "subscribed" }
  | { kind: "alreadySubscribed" }
  | { kind: "unavailable" };

export interface NewsletterProvider {
  subscribe(email: string): Promise<SubscribeOutcome>;
}

export type EmailValidation =
  | { ok: true; email: string }
  | { ok: false; message: string };

export function normalizeAndValidateEmail(value: unknown): EmailValidation;
```

The API contract consumed by the client is fixed regardless of provider:

```ts
// request
{ "email": "reader@example.com" }

// 201 for new or existing subscription
{ "message": "구독 요청을 받았습니다. 받은 편지함을 확인해 주세요." }

// 422 for malformed JSON or invalid email
{ "error": "올바른 이메일 주소를 입력해 주세요." }

// 503 for provider timeout or provider outage
{ "error": "현재 구독 요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요." }
```

## Task 1: Establish the test runner before production code

**Objective:** Add a reproducible TypeScript, component, and route test command before creating any newsletter production module.

**Files:**
- Modify: `package.json:6-31`
- Modify: `package-lock.json`
- Create: `vitest.config.ts`
- Create: `test/setup.ts`

**Interface produced:** `npm test` runs all `test/**/*.test.ts` and `test/**/*.test.tsx` files in jsdom. Test files can import `@/…` aliases and use `fetch` stubs without a live provider.

- [ ] Confirm that the plan approval authorizes adding only these development dependencies: `vitest`, `jsdom`, `@testing-library/react`, and `@testing-library/user-event`. Do not add any production dependency.
- [ ] Add `"test": "vitest run"` and `"test:watch": "vitest"` to `package.json` scripts.
- [ ] Install exactly `vitest`, `jsdom`, `@testing-library/react`, and `@testing-library/user-event` as development dependencies; inspect the resulting `package.json` and lockfile diff to confirm no runtime dependency changed.
- [ ] Create `vitest.config.ts` with `environment: "jsdom"`, `setupFiles: ["./test/setup.ts"]`, and aliases mapping `@` to `./src` and `@config` to `./site.config.ts`.
- [ ] Create an empty `test/setup.ts` with the comment `// Shared Vitest setup; keep this file free of production imports.` so the configuration has a stable setup entry without adding a fifth dependency.
- [ ] Create `test/smoke.test.ts` with `import { describe, expect, it } from "vitest";` and one assertion: `expect(1 + 1).toBe(2)`.
- [ ] Run `npm test` and record a passing smoke test before any newsletter production file exists.

**Verification:** `npm test` exits 0 and reports one passing smoke test. `npm run lint` still exits 0.

## Task 2: Define and test email normalization and validation (RED-GREEN-REFACTOR)

**Objective:** Create the pure, provider-independent input boundary used by both the browser and server.

**Files:**
- Create: `src/lib/newsletter.ts`
- Create: `test/newsletter.test.ts`

**Interface produced:** `normalizeAndValidateEmail(value: unknown): EmailValidation` where a valid result returns a trimmed email string and an invalid result returns the exact Korean message `올바른 이메일 주소를 입력해 주세요.`.

- [ ] In `test/newsletter.test.ts`, write a failing test that imports `normalizeAndValidateEmail` from `@/lib/newsletter` and expects `"  reader@example.com  "` to produce `{ ok: true, email: "reader@example.com" }`.
- [ ] Run `npm test -- test/newsletter.test.ts`; confirm RED occurs because `@/lib/newsletter` does not exist.
- [ ] Add a second failing test for `"reader@example"`, a third for an empty trimmed string, and a fourth for a non-string JSON value; each must expect `{ ok: false, message: "올바른 이메일 주소를 입력해 주세요." }`.
- [ ] Implement only `normalizeAndValidateEmail` in `src/lib/newsletter.ts`. It must reject values longer than 254 characters and use a conservative basic pattern that requires non-whitespace text before and after one `@`, plus a dot in the domain: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`.
- [ ] Run `npm test -- test/newsletter.test.ts`; confirm GREEN with all four cases passing.
- [ ] Refactor only duplicated test setup if present; rerun the same command and keep it green.

**Verification:** Valid input is trimmed, invalid input is rejected identically at this shared boundary, and no external API is called.

## Task 3: Add provider contract tests using a fake provider (RED-GREEN-REFACTOR)

**Objective:** Establish the exact internal result model and prove that provider-specific outcomes can be normalized before `magma-mail` is connected.

**Files:**
- Modify: `src/lib/newsletter.ts`
- Create: `test/newsletter-provider.test.ts`

**Interface consumed:** `SubscribeOutcome` and `NewsletterProvider` from `src/lib/newsletter.ts`.

**Interface produced:** `subscribeWithProvider(provider: NewsletterProvider, email: string): Promise<SubscribeOutcome>` returns only `subscribed`, `alreadySubscribed`, or `unavailable`; unexpected provider exceptions become `{ kind: "unavailable" }`.

- [ ] Write a failing test with an inline `NewsletterProvider` that resolves `{ kind: "subscribed" }`; expect `subscribeWithProvider` to preserve that result.
- [ ] Write a second failing test with a provider resolving `{ kind: "alreadySubscribed" }`; expect that result to be preserved.
- [ ] Write a third failing test with a provider that throws `new Error("network unavailable")`; expect `{ kind: "unavailable" }` without exposing the exception text.
- [ ] Run `npm test -- test/newsletter-provider.test.ts`; confirm RED because `subscribeWithProvider` is missing.
- [ ] Add the exported `SubscribeOutcome`, `NewsletterProvider`, and `subscribeWithProvider` definitions to `src/lib/newsletter.ts`. The implementation must catch unknown provider exceptions and return `{ kind: "unavailable" }`.
- [ ] Run `npm test -- test/newsletter-provider.test.ts`; confirm all cases are GREEN.

**Verification:** The client-facing system never branches on a provider’s raw response or error text.

## Task 4: Implement the magma-mail adapter only from the approved API contract

**Objective:** Translate the official `magma-mail` request/response contract into `NewsletterProvider` without leaking credentials or service details.

**Files:**
- Create: `src/lib/magmaMail.ts`
- Create: `test/magmaMail.test.ts`
- Modify: `.env.example:1-16`

**Interface consumed:** `NewsletterProvider` and `SubscribeOutcome` from `src/lib/newsletter.ts`.

**Interface produced:** `createMagmaMailProvider(options?: { fetchImpl?: typeof fetch }): NewsletterProvider`. The optional `fetchImpl` exists only to exercise the actual HTTP request shape in tests; production uses global `fetch`.

- [ ] Before editing this task’s production files, attach the six items in **Execution Blocker: magma-mail API Contract** to the implementation handoff. If any item is absent, stop at this task and do not create a speculative adapter.
- [ ] Write failing tests that inject `fetchImpl` and assert the exact official endpoint, HTTP method, required headers, request JSON, and timeout behavior documented by `magma-mail`.
- [ ] Add failing tests for each official response class: new subscription maps to `{ kind: "subscribed" }`, existing subscription maps to `{ kind: "alreadySubscribed" }`, and rate-limit/5xx/timeout maps to `{ kind: "unavailable" }`.
- [ ] Run `npm test -- test/magmaMail.test.ts`; confirm RED because `@/lib/magmaMail` is missing.
- [ ] Implement `createMagmaMailProvider` with `AbortSignal.timeout(8000)`, server-only `process.env` reads, and the exact approved environment-variable names. Do not add a `NEXT_PUBLIC_` prefixed key.
- [ ] Add only key names and Korean descriptions to `.env.example`; never add a real endpoint secret, test-list identifier, or token value.
- [ ] Run `npm test -- test/magmaMail.test.ts`; confirm GREEN.

**Verification:** Tests prove the official request shape; timeout and provider errors become `unavailable`; no secret appears in test assertions, `.env.example`, or browser code.

## Task 5: Add the internal subscribe API route (RED-GREEN-REFACTOR)

**Objective:** Expose one server endpoint that validates request bodies, delegates to `magma-mail`, and returns the fixed browser contract.

**Files:**
- Create: `src/app/api/newsletter/subscribe/route.ts`
- Create: `test/newsletter-route.test.ts`

**Interface consumed:** `normalizeAndValidateEmail`, `subscribeWithProvider`, `createMagmaMailProvider`, and the client response JSON defined in **Provider-neutral Interface Contract**.

**Interface produced:** `POST /api/newsletter/subscribe` accepts only `{ email: string }` and returns 201, 422, or 503 with the exact JSON messages defined above.

- [ ] Write a failing route test that sends a `NextRequest` with `body: JSON.stringify({ email: "  reader@example.com  " })` and a fake `NewsletterProvider` returning `subscribed`; expect status 201 and the success JSON.
- [ ] Write a second failing test for `alreadySubscribed`; expect the same 201 response and success JSON.
- [ ] Write a third failing test for malformed JSON; expect 422 and `{ error: "올바른 이메일 주소를 입력해 주세요." }`.
- [ ] Write a fourth failing test for an invalid email; expect the same 422 response.
- [ ] Write a fifth failing test for `unavailable`; expect 503 and `{ error: "현재 구독 요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요." }`.
- [ ] Run `npm test -- test/newsletter-route.test.ts`; confirm RED because the route does not exist.
- [ ] Implement a small exported route factory in `src/app/api/newsletter/subscribe/route.ts`, `createSubscribeHandler(provider: NewsletterProvider)`, and export `POST = createSubscribeHandler(createMagmaMailProvider())`. This allows tests to inject a fake provider while production uses `magma-mail`.
- [ ] Follow the existing `src/app/api/posts/route.ts` pattern: parse JSON in `try/catch`, return `NextResponse.json`, log unexpected server errors without returning details, and use Korean error messages.
- [ ] Run `npm test -- test/newsletter-route.test.ts`; confirm GREEN.

**Verification:** Browser callers can never reach an external provider directly, and raw provider errors are never included in API output.

## Task 6: Build the accessible client form and test its state transitions (RED-GREEN-REFACTOR)

**Objective:** Provide the requested spinner-and-toast experience without duplicate submissions or inaccessible status messages.

**Files:**
- Create: `src/components/NewsletterForm.tsx`
- Create: `test/NewsletterForm.test.tsx`

**Interface consumed:** the `POST /api/newsletter/subscribe` request/response contract.

**Interface produced:** `<NewsletterForm />` with one email input, one submit button, a submitting spinner, and a `role="status"` toast region.

- [ ] Write a failing test that renders `<NewsletterForm />`, enters `reader@example.com`, resolves `fetch` with the 201 success JSON, submits, and expects the input to be cleared plus the success message in a `role="status"` element.
- [ ] Write a failing test that enters `not-an-email`, submits, and expects no `fetch` call plus the exact validation message in the status element.
- [ ] Write a failing test that holds the `fetch` promise pending, submits once, and expects the submit button disabled, `aria-busy="true"`, and a visible spinner label `구독 요청 중`.
- [ ] Write a failing test that resolves `fetch` with 503; expect the failure message in the status element and the typed input value to remain.
- [ ] Run `npm test -- test/NewsletterForm.test.tsx`; confirm RED because the component is missing.
- [ ] Implement a client component using `useState`; use `type="email"`, `name="email"`, `autoComplete="email"`, `required`, a visible label, `disabled={isSubmitting}`, and `aria-live="polite"` on the status element.
- [ ] Use existing token utilities only: `bg-card`, `border-line`, `text-primary`, `text-ink-sub`, `bg-primary`, `text-card`, `rounded-ui`, and responsive flex/grid utilities. Do not introduce hex values, new fonts, or a global toast package.
- [ ] Run `npm test -- test/NewsletterForm.test.tsx`; confirm GREEN.

**Verification:** Keyboard users can label, enter, submit, observe status, and retry. A pending request cannot be submitted twice.

## Task 7: Insert the home-only newsletter section and verify page composition

**Objective:** Render the form precisely between the existing brand-introduction section and the latest-posts section without changing global footer behavior.

**Files:**
- Create: `src/components/NewsletterSection.tsx`
- Modify: `src/app/page.tsx:33` (insert immediately before the `/* 최신 블로그 */` section)
- Create: `test/NewsletterSection.test.tsx`

**Interface consumed:** `<NewsletterForm />`.

**Interface produced:** `<NewsletterSection />` renders an editorial heading, a concise content-update purpose statement, the form, and the agreed unsubscribe guidance.

- [ ] Write a failing component test that renders `<NewsletterSection />` and expects: a heading containing `콘텐츠 업데이트`, the purpose text, a `NewsletterForm` email input, and a visible sentence that says the recipient can unsubscribe at any time.
- [ ] Run `npm test -- test/NewsletterSection.test.tsx`; confirm RED because the component is missing.
- [ ] Implement `NewsletterSection` as a `<section className="container-page py-16">` with token-based card styling and no external link unless operations has supplied an approved privacy-policy URL.
- [ ] Import `NewsletterSection` in `src/app/page.tsx` and place `<NewsletterSection />` after the closing brand section at line 31 and before the latest-blog section beginning at line 33.
- [ ] Run `npm test -- test/NewsletterSection.test.tsx`; confirm GREEN.
- [ ] Start `npm run dev`, inspect `/` at desktop and mobile widths, and confirm the visual order is Hero → brand intro → newsletter → latest posts → reports → footer.

**Verification:** The newsletter is home-only; it is not inserted into `src/components/Footer.tsx` or `src/app/layout.tsx`.

## Task 8: Run internal acceptance checks and prepare the operating handoff

**Objective:** Verify code quality, privacy boundaries, and internal test-list behavior before requesting a separate public-release approval.

**Files:**
- Review: `src/lib/newsletter.ts`
- Review: `src/lib/magmaMail.ts`
- Review: `src/app/api/newsletter/subscribe/route.ts`
- Review: `src/components/NewsletterForm.tsx`
- Review: `src/components/NewsletterSection.tsx`
- Review: `.env.example`
- Review: `package.json`

- [ ] Run `npm test`; expected result: all unit, route, and component tests pass with exit code 0.
- [ ] Run `npm run lint`; expected result: ESLint exits 0.
- [ ] Run `npm run build`; expected result: Next production build exits 0 and includes `/api/newsletter/subscribe`.
- [ ] With only approved test credentials in `.env.local`, submit one new test-list email through the home form; confirm the approved `magma-mail` test list receives the subscription request or double-opt-in message.
- [ ] Submit the same test email again; confirm the UI emits the same success message and the provider does not create a duplicate subscriber.
- [ ] Submit malformed input; confirm no network request leaves the browser.
- [ ] Temporarily use an invalid test credential only in local `.env.local`; confirm a generic failure toast appears and no provider error, API key, endpoint secret, or request authorization header is visible in browser output.
- [ ] Restore the valid local test configuration before ending the internal test session.

**Verification:** Internal validation is complete only when all automated commands pass and all manual cases above pass against the test list.

## Public Release Hold

Do not make the feature public merely because internal tests pass. Release remains blocked until an operations owner approves all of the following:

1. `magma-mail` production audience/list and production server environment variables
2. Final subscription-purpose and unsubscribe wording
3. Privacy handling appropriate for the production audience
4. The selected double opt-in policy and the expected confirmation-email copy
5. Internal acceptance evidence from Task 8

## Plan Self-Review

- [x] Approved design decisions are represented: location, email-only collection, normalization, duplicate success behavior, spinner/toast UX, external storage, internal-only validation, and separate public approval.
- [x] Existing project rules are represented: token-only styles, no external fonts, no changes to unrelated content and dashboard paths, no secret access.
- [x] Task interfaces name consumed and produced contracts.
- [x] Every code task has a RED command, minimal GREEN implementation step, and verification.
- [x] The undocumented `magma-mail` API is a named execution blocker rather than an invented endpoint or fabricated response contract.
- [x] The plan intentionally contains no external API implementation until official contract data exists.
