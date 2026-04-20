---
name: Button 컴포넌트 CSS 구현 패턴
description: button.css 완성 패턴 — data-attribute 선택자, 아이콘 버튼, 접근성 처리, 다크 모드 예외
type: project
---

## Button 컴포넌트 CSS 구현 패턴 (Task 011-A)

**선택자 전략:** `button[data-variant]` 베이스, `button[data-variant="primary"]` 등 세부 variant, `:has(> svg:only-child)` 로 아이콘 전용 버튼 정사각형 처리.

**아이콘 버튼 패턴:**
- `:has(> i:only-child)` / `:has(> svg:only-child)` 로 padding:0 + 고정 width/height
- 텍스트+아이콘 혼합 시 `:not(:has(> i:only-child)):not(:has(> svg:only-child))` + `!important` 로 padding 복원

**Secondary 다크 모드 예외:**
- 라이트 모드 #6b7280은 흰 배경 대비 OK이지만 다크 배경(#111827)에서 대비 부족
- 다크 모드에서 `#9ca3af` + `color: #111827` 로 교체 → 대비 약 5.2:1 확보

**Loading 스피너 구현:**
- `::after` 의사 요소 + `border-top-color: transparent` + `@keyframes button-spin`
- primary/secondary/danger: 스피너 흰색 (`rgba(255,255,255,0.4)` / `#ffffff`)
- outline/ghost: 스피너 primary 색상 (`rgba(59,130,246,0.3)` / `var(--color-primary)`)

**접근성 필수 처리:**
- `:focus-visible` 2px outline + 2px offset (마우스 클릭에는 미적용)
- `pointer-events: none` + `opacity: 0.5` disabled 처리
- `prefers-reduced-motion: reduce` → `transition: none` + 스피너 `animation: none` + `transform: rotate(45deg)` 고정

**모바일 터치 타겟 (WCAG 2.5.5):**
- 텍스트 버튼: `min-height: 44px` (sm도 포함)
- 아이콘 전용 버튼: `width/height/min-height: 44px` 명시 재선언 필수 (min-height 단독 선언 시 정사각형 깨짐)

**Why:** 다크 모드 secondary 예외처리와 prefers-reduced-motion은 기존 스켈레톤에 없었으나 KWCAG 2.2 필수 항목.

**How to apply:** 이 프로젝트 신규 컴포넌트 CSS 작성 시 동일 패턴 적용. 특히 하드코딩 색상 사용 시 다크 모드 대비비 별도 검증 필요.
