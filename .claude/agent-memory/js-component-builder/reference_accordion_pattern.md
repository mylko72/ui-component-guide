---
name: Accordion 컴포넌트 패턴
description: data-component="accordion" 선택자, 단일/다중 열림 모드, :where([aria-expanded]) 아이콘 제어, 점진적 강화 구현 레퍼런스
type: reference
---

## Accordion 컴포넌트 구현 패턴

### 핵심 마크업 구조
- 컨테이너: `data-component="accordion"` — Accordion.init() 탐색 대상
- 모드 속성: `data-accordion-mode="single"|"multiple"` (기본값: multiple)
- 트리거: `data-accordion-trigger` + `aria-expanded="true"` + `aria-controls="panel-id"`
- 패널: `id="panel-id"` + `data-accordion-panel` + `role="region"` + `aria-labelledby="trigger-id"`
- 헤딩 래퍼: `<h3 class="accordion__heading">` — 시맨틱 구조 필수

### 점진적 강화 (Progressive Enhancement)
- JS 없을 때: 모든 패널이 `aria-expanded="true"`로 마크업되어 펼쳐진 상태
- JS 활성화 후: `_syncInitialState()`가 `aria-expanded="false"` 패널을 즉시 `display:none`으로 숨김
- Tabs와 반대: Tabs는 첫 번째만 표시(display:none 마크업), Accordion은 모두 표시(aria-expanded=true)

### CSS 상태 제어
- `:where([aria-expanded='true']) .accordion__icon` — 아이콘 180도 회전
- `:where([aria-expanded='true']).accordion__trigger` — 트리거 색상 변경
- `specificity: 0` — :where() 사용으로 우선순위 낮게 유지 (오버라이드 용이)

### 단일/다중 모드 분기
- `mode = container.dataset.accordionMode || 'multiple'`
- single: `_togglePanel`에서 전체 순회 → 대상만 토글, 나머지 무조건 닫기
- multiple: 클릭한 트리거의 `aria-expanded`만 토글

### 키보드 인터랙션
- Enter/Space: 토글 (e.preventDefault 필수)
- ArrowDown/Up: 순환 포커스 이동 (`_focusAdjacentTrigger`)
- Home/End: enabledTriggers 배열의 첫/마지막으로 이동
- disabled 항목: `_focusAdjacentTrigger` 순환 시 자동 건너뜀

### 접근성 포인트
- `role="region"` + `aria-labelledby`: 패널 영역을 랜드마크로 표시
- `aria-disabled="true"` + `disabled`: 스크린 리더 + 네이티브 동시 처리
- `data-initialized` 속성으로 중복 초기화 방지

### CSS 변형 클래스
- `.accordion--flush`: 외부 border/border-radius 제거, 구분선만 유지

### 파일 위치
- `assets/css/components/accordion.css`
- `assets/js/components/accordion.js`
- `pages/accordion.html`
