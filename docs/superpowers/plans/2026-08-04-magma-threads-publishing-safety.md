# MAGMA Threads v1.2 게시 안전장치 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task.

**Goal:** 후보·최종 승인을 유지한 채 Threads 연결, 90일 이력, 로컬 기록 중복 검사와 단일 요청 안전정지를 v1.2 워크플로에 등록한다.

**Architecture:** BlueKiwi는 워크플로 정의와 승인 상태만 보관한다. Threads 자격증명은 실행 중인 Hermes가 Bitwarden에서 시작 시 주입한 환경에서만 읽고, 단계 출력은 상태 코드·해시·검사 결과만 기록한다. 단일 HTTP 게시 통합이 없으면 게시하지 않고 운영자 확인으로 끝낸다.

**Tech Stack:** BlueKiwi workflow MCP, Hermes Bitwarden Secrets Manager, Threads 읽기 전용 API, Markdown 내부 로그.

## Global Constraints

- 후보 선택 승인과 실제 게시 승인은 각각 독립 Gate로 유지한다.
- Threads 토큰·사용자 ID·계정 식별값·원문 응답은 BlueKiwi, 파일, 로그, 출력, context snapshot에 저장하거나 표시하지 않는다.
- BlueKiwi credential을 생성·연결·저장하지 않는다. 실행 중인 Hermes의 Bitwarden 주입 환경만 참조한다.
- 초안 작성 단계에서 `/me` 읽기 전용 연결 검사, 최근 90일 Threads 이력, 로컬 `content/posts/`·`publish-log.md` 중복 검사를 수행한다.
- 최종 승인 뒤 단일 HTTP 게시 통합이 확인된 경우에만 POST 한 번을 전송한다. 그렇지 않으면 `manual-confirmation-required`로 종료한다.
- 응답이 불명확하면 자동 재시도·자동 재게시·동일 payload 재전송을 하지 않고 `publish-uncertain`으로 남긴다.

### Task 1: 활성 스냅샷과 보류 태스크 보존 확인

**Objective:** v1.1의 최신 노드·태스크 상태를 읽고, 실행 중인 Task #1을 취소하지 않고 보류로 둔다.

**Files:**
- Read: BlueKiwi workflow ID 6, task ID 1
- Produce: 변경 전/후 검증 요약

- [ ] `list_workflows(slim=false)`로 workflow ID 6의 8개 단계와 ID를 새로 조회한다.
- [ ] `list_tasks(workflow_id=6)` 및 `advance(task_id=1, peek=true)`로 Task #1이 3단계 Gate에서 pending인지 확인한다.
- [ ] Task #1에 `cancel_task` 또는 `advance`를 호출하지 않는다.
- [ ] 검증: Task #1의 상태가 `running`, 현재 단계가 3이고 새 버전 생성 전 외부 게시 로그가 없는지 확인한다.

**Interface:** 입력은 workflow 6의 최신 노드 배열과 task 1 상태다. 출력은 v1.2 생성 요청에 사용할 전체 노드 배열과 “v1.1 태스크 보류” 상태다.

### Task 2: 초안·연결·중복 사전점검 단계 정의

**Objective:** 기존 6단계를 하나의 상세 action으로 교체해 후보 승인 뒤 연결·중복 검사를 초안 작성 전에 강제한다.

**Files:**
- Modify in new version: 기존 step 6 `선택 후보 초안·중복 사전점검`
- Produce: `publish-ready.md`, redacted preflight summary, 내부 payload hash

- [ ] 새 instruction의 첫 줄을 `## MAGMA 콘텐츠 편집·연결·중복 점검자`로 시작한다.
- [ ] 후보 선택 승인 확인, Hermes Bitwarden 주입 환경 참조, `/me` GET 1회, 원격 90일 이력 읽기, `content/posts/`·`publish-log.md` 검사, payload 비노출 검사를 최소 6개 번호 단계로 명시한다.
- [ ] 연결 실패는 `connection-blocked`, 원격 이력 불확실성은 `history-unconfirmed`, 중복은 `duplicate-blocked`로 기록하고 최종 승인으로 진행하지 않게 한다.
- [ ] `/me`·원격 조회 결과는 HTTP 상태 범주·성공 여부·중복 상태만 남기며 토큰·사용자 ID·사용자명·원문 응답을 남기지 않게 한다.
- [ ] 검증: instruction이 80단어 이상이며 Role, 번호 단계, Output, Verification을 모두 포함하는지 확인한다.

**Interface:** 입력은 step 5의 `selection-approval.md`와 Gate 응답 객체다. 출력은 `publish-ready.md`, redacted preflight 상태, `payload_sha256`, `duplicate_key`이며 외부 본문과 분리된다.

### Task 3: 실제 게시 승인 Gate의 안전 신호 강화

**Objective:** 기존 step 7의 승인 분리를 유지하고, 시크릿 없는 사전점검 상태만 대표에게 보인다.

**Files:**
- Modify in new version: 기존 step 7 `실제 게시 승인`
- Produce: `publish-approval.md`, Gate 응답 객체

- [ ] `bk-options`의 게시 승인·수정 후 재검토·보류와 `bk-textarea` 메모 흐름을 유지한다.
- [ ] 연결 상태, 원격 90일 이력 확인, 로컬 기록 확인, 중복 결과, payload 비노출 검사를 통과/차단 코드로만 보여주도록 지시한다.
- [ ] 토큰·사용자 ID·계정 이름·원문 응답·HTTP 헤더를 검토 화면과 output에서 금지한다.
- [ ] preflight가 `connection-blocked`, `history-unconfirmed`, `duplicate-blocked` 중 하나면 게시 승인 옵션을 제공하지 않게 한다.
- [ ] 검증: Gate instruction이 80단어 이상이고 `selections`, `comment`, `fields`, `option_comments`의 분리 처리를 포함하는지 확인한다.

**Interface:** 입력은 Task 2의 `publish-ready.md`와 상태 코드다. 출력은 명시적 게시 승인 또는 수정/보류이며, 외부 게시 호출 권한은 명시적 승인에만 부여된다.

### Task 4: 단일 요청·불명확 응답 정지 규칙 정의

**Objective:** 기존 loop step 8을 단일 HTTP 게시 통합과 확인 대기 상태를 강제하는 instruction으로 교체한다.

**Files:**
- Modify in new version: 기존 step 8 `게시·검증·기록 및 다음 회차`
- Produce: `publish-log.md`의 회차 레코드, 상태 코드

- [ ] 최종 승인 직후 immutable `attempt_id`, `payload_sha256`, `duplicate_key`를 생성하고 기록하도록 한다.
- [ ] 단일 HTTP 게시 엔드포인트가 확인될 때만 POST 한 번을 전송하고, 없으면 `manual-confirmation-required`로 외부 호출 없이 종료하도록 한다.
- [ ] 타임아웃, 비2xx, 파싱 실패, URL·게시 ID 누락은 `publish-uncertain`으로 기록하고 자동 재전송·재시도·루프백을 금지하도록 한다.
- [ ] 명확한 성공 응답만 `published`로 기록하고, 내부 로그에는 상태·시각·해시·중복 키·검사 결과만 기록하도록 한다.
- [ ] 검증: loop instruction이 80단어 이상이며 termination 마지막 줄이 “사용자가 다음 회차를 시작하지 않거나, published·manual-confirmation-required·publish-uncertain·차단 상태 중 하나가 기록되면 종료한다.”인지 확인한다.

**Interface:** 입력은 Task 3의 명시적 승인과 Task 2의 redacted preflight 결과다. 출력은 `published`, `manual-confirmation-required`, `publish-uncertain`, 또는 차단 상태 중 하나다.

### Task 5: v1.2 등록·검증

**Objective:** ID 6에서 새 버전을 만들고 서버의 노드 검증 결과를 확인한다.

**Files:**
- Modify: BlueKiwi workflow family root 5 / active v1.1 workflow 6
- Produce: workflow v1.2 등록 결과

- [ ] `update_workflow(workflow_id=6, create_new_version=true, version="1.2", nodes=[전체 8단계])`를 한 번 호출한다.
- [ ] 응답에 `node_verification`이 있으면 `mismatch === false`와 expected/actual node 수 일치를 확인한다.
- [ ] mismatch가 true면 추가 node 변경을 하지 않고 중단한다.
- [ ] `list_workflows(slim=false)`로 v1.2가 active이며 후보 선택·최종 승인 Gate가 유지되고 6·7·8단계의 안전 규칙이 반영됐는지 확인한다.
- [ ] 검증: 새 버전의 BlueKiwi credential_id는 모두 null이며 task 1은 여전히 보류 상태다.

## Plan Self-Review

- [x] 승인 분리, Bitwarden 전용, `/me`, 90일 원격·로컬 중복, 단일 POST, 불명확 응답 정지를 모두 포함했다.
- [x] 의존 작업의 입력·출력 인터페이스와 상태 코드를 명시했다.
- [x] TBD·TODO·생략된 검증 항목이 없다.
