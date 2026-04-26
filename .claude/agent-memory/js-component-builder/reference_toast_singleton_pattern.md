---
name: ToastManager 싱글톤 패턴
description: 전역 Toast 알림 싱글톤 구현 패턴 — 위치별 컨테이너 동적 생성, exit 애니메이션 충돌 처리, aria-live 타입별 분기
type: reference
---

## 싱글톤 구현
- `constructor()`에서 `Toast.instance` 확인 후 기존 인스턴스 반환
- `document.addEventListener('DOMContentLoaded', ...)` 블록에서 `window.toast = new Toast()` 전역 노출
- ES6 모듈 없음 (file:// 호환)

## 위치별 컨테이너 관리
- `this.containers = {}` 맵으로 `{ position: HTMLElement }` 관리
- `_initContainer(position)`: `document.getElementById('toast-container-' + position)` 먼저 확인, 없을 때만 생성
- 컨테이너 클래스: `.toast-container.toast-container--{position}` (6개 위치 지원)
- `_cleanEmptyContainers()`: 토스트가 없는 컨테이너를 DOM에서 제거 (레이아웃 영향 방지)

## 위치별 CSS 방향
- `bottom-*` 컨테이너: `flex-direction: column-reverse` (새 토스트가 위로 쌓임)
- `top-*` 컨테이너: `flex-direction: column` (새 토스트가 아래로 쌓임)
- 좌측 위치(`*-left`): `toast-enter-left` / `toast-exit-left` 애니메이션 (translateX 반대 방향)
- 상단 위치(`top-*`): `toast-enter-top` / `toast-exit-top` 애니메이션 (translateY 위 방향)

## aria-live 타입 분기
- `info`, `success` → `role="status"`, `aria-live="polite"` (현재 작업 방해 없이 읽음)
- `warning`, `error` → `role="alert"`, `aria-live="assertive"` (즉시 인터럽트)

## exit 애니메이션 중 충돌 방지
- `dismiss(id)` 시 `.toast--exit` 클래스를 추가하고 `animationend` 이벤트 후 실제 DOM 제거
- `this.exitingIds = new Set()`으로 중복 dismiss 방지 (`if (exitingIds.has(id)) return`)
- `prefers-reduced-motion` 감지: `window.matchMedia(...).matches` 시 즉시 `_remove(id)` 호출

## 타이머 관리
- `this.timers = {}` 맵으로 `{ toastId: timeoutId }` 관리
- `dismiss()` 시 `clearTimeout` + `delete this.timers[id]` 쌍으로 정리
- `duration = 0`이면 자동 닫힘 없음

## 선언적 초기화 (data 속성 방식)
- `static init(container)`: `[data-toast-trigger]` 버튼에 클릭 이벤트 등록
- `data-toast-type`, `data-toast-message`, `data-toast-duration`, `data-toast-position` 속성 읽기
- 액션 버튼(`onAction` 콜백)은 JS API에서만 가능 (data 속성으로 함수 전달 불가)

## XSS 방지
- `_escapeHtml(str)`: `document.createElement('div').textContent = str; return div.innerHTML`
- 메시지는 반드시 이스케이프 후 innerHTML 삽입

## 편의 메서드
- `toast.info(msg, opts)`, `toast.success(msg, opts)`, `toast.warning(msg, opts)`, `toast.error(msg, opts)`
- `toast.dismiss(id)`, `toast.dismissAll()`

## 데모 페이지 버튼 스타일
- toast.html은 `button.css`를 추가 로드 (`link rel="stylesheet" href="../assets/css/components/button.css"`)
- 데모 버튼은 BEM 클래스(`btn btn--primary`) 대신 프로젝트 표준 `data-variant` + `data-size` 속성 사용
- 아이콘 size는 인라인 style 없이 `button[data-variant] i { width: 1em; height: 1em; }` 자동 적용

## E2E 테스트
- `tests/e2e/toast.spec.js`: 32개 시나리오 전체 통과
- 사이드바 active 테스트: `window.location.pathname` 기반이라 정적 서버 URL 구조 따라 분기 필요
  (common.js의 initSidebarNav가 pathname.endsWith(normalizedHref)로 매칭)

## 구현 파일
- JS: `assets/js/components/toast.js`
- CSS: `assets/css/components/toast.css`
- 데모: `pages/toast.html`
- E2E: `tests/e2e/toast.spec.js`
