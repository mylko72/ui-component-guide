---
name: ToastManager 싱글톤 패턴
description: 전역 Toast 알림 싱글톤 구현 패턴 — exit 애니메이션 중 _render 충돌 처리, aria-live 타입별 분기
type: reference
---

## 싱글톤 구현
- `constructor()`에서 `ToastManager.instance` 확인 후 기존 인스턴스 반환
- `export default new ToastManager()`로 모듈 레벨 단일 인스턴스 노출

## aria-live 타입 분기
- `info`, `success` → `aria-live="polite"` (현재 작업 방해 없이 읽음)
- `warning`, `error` → `aria-live="assertive"` (즉시 인터럽트)

## exit 애니메이션 중 _render 충돌 방지
- `dismiss(id)` 시 `.toast--exit` 클래스를 추가하고 `animationend` 이벤트 후 실제 배열 제거
- `_render()` 호출 시 `.toast--exit` 상태인 요소 ID를 `exitingIds` Set으로 추적
- 새 innerHTML 교체 전 exit 중인 DOM 요소를 cloneNode로 보존 후 재삽입

## 타이머 관리
- `this.timers = {}` 맵으로 `{ toastId: timeoutId }` 관리
- `dismiss()` 시 `clearTimeout` + `delete this.timers[id]` 쌍으로 정리
- `duration = 0`이면 자동 닫힘 없음

## 컨테이너 초기화
- `_initContainer()`: `document.getElementById('toast-container')` 먼저 확인, 없을 때만 생성
- `role="region"`, `aria-label="알림"` 적용
