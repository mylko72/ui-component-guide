---
name: Modal 컴포넌트 패턴 (정적 HTML + JS)
description: dialog 네이티브 API, 포커스 트랩, ARIA, body.overflow, autofocus 감지, open 속성 정적 표시 구현 레퍼런스
type: reference
---

## 구현 위치 (정적 HTML 버전)
- `assets/js/components/modal.js` — Modal 클래스, static init(), 포커스 트랩
- `assets/css/components/modal.css` — dialog 리셋 + ::backdrop 스타일
- `pages/modal.html` — 4개 데모 섹션 (Basic, Size Variants, Form, Danger)

## 정적 HTML 패턴 핵심
- `<dialog open>` 속성으로 JS 없을 때 정적 표시
- JS 초기화 시 `dialog.removeAttribute('open')` → showModal()로 제어 전환
- `data-modal-trigger` + `data-modal-target` 속성으로 트리거-dialog 연결
- `data-modal-close` 속성 요소들에 이벤트 자동 연결

## JS 없을 때 (정적) 동작
- `<dialog open>` → CSS `dialog[open] { display: block }` → 페이지에 정적 표시
- `dialog::backdrop`은 showModal() 전용이므로 배경 없음

## 구현 위치 (동적 렌더링 구버전)
- `assets/js/ui/ModalManager.js`
- `assets/css/components/modal.css`

## 핵심 패턴

### 싱글톤
```js
if (ModalManager.instance) return ModalManager.instance;
ModalManager.instance = this;
export default new ModalManager();
```

### 포커스 트랩 (_trapFocus)
- `FOCUSABLE_SELECTOR`로 `dialog.querySelectorAll(...)` → Array
- Shift+Tab: activeEl === firstEl → lastEl.focus()
- Tab: activeEl === lastEl → firstEl.focus()
- focusable 목록에 없으면 첫 번째로 되돌림 (포커스 이탈 방지)
- open() 후 `requestAnimationFrame(() => focusFirstElement())`로 타이밍 보장

### 배경 aria-hidden
- `document.body.children` (body 직계 자식)만 대상
- `#modal-container`는 건너뜀
- 기존 aria-hidden 값을 `data-modal-aria-hidden-backup`에 백업 후 복원

### 이벤트 리스너 메모리 정리
- constructor에서 `this._boundHandleKeydown = this._handleKeydown.bind(this)` 바인딩 저장
- close()에서 `removeEventListener`로 정확히 제거
- overlay 클릭도 같은 방식으로 관리

### 중복 open() 방어
```js
if (this.currentModal) this.close();
```

### body 스크롤 잠금
- open: `document.body.style.overflow = 'hidden'`
- close: `document.body.style.overflow = 'auto'`

## CSS 구조
- `.modal-overlay`: fixed + flex 중앙 정렬, 페이드인 애니메이션
- `.modal--sm/md/lg`: max-width 400/560/800px
- 모바일(@media ≤767px): align-items: flex-end → 하단 시트 형태
- CSS 변수(`--color-bg`, `--color-text` 등) 완전 활용 → 다크 모드 자동 대응

## 검증된 동작
- role=dialog, aria-modal=true, aria-labelledby=modal-title
- onConfirm: 확인 버튼 클릭 시만 호출, close(false)
- onCancel: 취소/닫기/Esc/외부클릭 시 호출, close(true)
- dismissible=false: Esc, 외부 클릭 무시
- 단일 모달 스택: open() 중복 시 기존 close() 후 새 모달
