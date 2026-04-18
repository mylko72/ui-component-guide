---
name: WAI-ARIA Tabs 패턴 구현 레퍼런스
description: role=tablist/tab/tabpanel 구조와 키보드 네비게이션 (ArrowRight/Left/Home/End) 구현 패턴
type: reference
---

## ARIA Tabs 패턴 핵심

- `role="tablist"` + `aria-label` — 탭 그룹 컨테이너
- `role="tab"` + `aria-selected` + `aria-controls` + `tabindex` — 탭 버튼
  - 활성 탭: `aria-selected="true"`, `tabindex="0"`
  - 비활성 탭: `aria-selected="false"`, `tabindex="-1"` (roving tabindex 패턴)
- `role="tabpanel"` + `aria-labelledby` + `tabindex="0"` — 탭 패널
  - 비활성 패널은 `hidden` 속성으로 숨김 (display:none 대신 사용)

## 키보드 네비게이션 (tablist 내 keydown)
- `ArrowRight`: 다음 탭 (끝에서 첫 번째로 순환)
- `ArrowLeft`: 이전 탭 (처음에서 마지막으로 역순환)
- `Home`: 첫 번째 탭
- `End`: 마지막 탭
- 탭 전환 시 포커스도 함께 이동 (`btn.focus()`)

## 구현 위치
`assets/js/ui/CodeBlock.js` — `_onTabKeydown()` 메서드 참고
