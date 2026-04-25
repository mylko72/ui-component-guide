---
name: Dropdown 컴포넌트 패턴
description: WAI-ARIA menu/menuitem 패턴, 외부 클릭 닫기, roving tabindex, 키보드 탐색, aria-disabled 항목 처리 구현 레퍼런스
type: reference
---

## 핵심 구조

- `[data-component="dropdown"]` 컨테이너
- `[data-dropdown-trigger]` + `aria-haspopup="true"` + `aria-expanded="false"` 버튼
- `<ul role="menu">` → `<li role="none">` → `<button role="menuitem" tabindex="-1">` 구조
- `li[role="none"]`은 list item 역할을 억제 (menu 컨텍스트에서 중간 li가 접근성 혼란 방지)

## 점진적 강화

- JS 없을 때: 메뉴가 펼쳐진 상태 (display:none 없음)
- JS 활성화 후: `_setup()`에서 `_closeMenu()` 호출 → `display:none`으로 초기화

## 외부 클릭 닫기

- `_openMenu()`에서 `document.addEventListener('click', outsideClick)` 등록
- `_closeMenu()`에서 `document.removeEventListener('click', outsideClick)` 해제
- 메뉴가 열릴 때만 document 레벨 리스너를 attach/detach해서 성능 최적화
- `container.contains(e.target)` 체크로 내부 클릭 무시

## 포커스 이탈 감지

- `container.addEventListener('focusout', handler)` 등록
- `e.relatedTarget`이 컨테이너 외부면 닫기
- `focusout`이 `blur`보다 bubble-up하므로 컨테이너 레벨에서 한 번만 등록

## roving tabindex (포커스 관리)

- 모든 menuitem 초기 `tabindex="-1"`
- 현재 포커스 항목만 `tabindex="0"` + `data-focused="true"` 설정
- `_clearFocusHighlight()`: 이전 포커스 표시 제거 후 새 항목 지정
- `enabledItems = items.filter(item => item.getAttribute('aria-disabled') !== 'true')`로 비활성 건너뜀

## 키보드 명세 (WAI-ARIA Menu Button)

트리거에서:
- `Enter` / `Space`: 메뉴 열기
- `ArrowDown`: 메뉴 열고 첫 번째 항목으로
- `ArrowUp`: 메뉴 열고 마지막 항목으로

메뉴 내에서:
- `ArrowDown` / `ArrowUp`: 순환 탐색
- `Home` / `End`: 처음/마지막 이동
- `Enter` / `Space`: 항목 클릭 실행 (`element.click()`)
- `Escape`: 닫기 + 트리거로 포커스 복귀
- `Tab`: 닫기 (포커스는 자연 이동)

## aria-disabled 처리

- HTML: `aria-disabled="true"` (disabled 속성 아님)
- CSS: `pointer-events:none; opacity:0.5; cursor:not-allowed`
- JS: `_getEnabledItems()`에서 필터링 → 키보드 탐색 자동 건너뜀

## 구분선

- `<li role="separator" class="dropdown__divider" aria-hidden="true">`
- `role="separator"`: 접근성 구분 전달
- `aria-hidden="true"`: 불필요한 스크린 리더 읽기 방지 (role="separator"는 이미 구분 의미)

## 변형

- `.dropdown--right`: `left:auto; right:0`으로 우측 정렬
- `.dropdown__item--danger`: 빨간색 텍스트/배경으로 위험 액션 강조
- 트리거 chevron: `[data-dropdown-trigger][aria-expanded="true"] .dropdown__chevron { transform: rotate(180deg) }`
