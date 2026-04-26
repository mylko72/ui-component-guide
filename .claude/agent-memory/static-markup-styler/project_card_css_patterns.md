---
name: Card 컴포넌트 CSS 구현 패턴
description: BEM 기반 .card 컴포넌트 구조, .card--horizontal flex row 레이아웃, .card--interactive 호버 효과, 색상 변형 구현 방식
type: project
---

## 기본 구조 (BEM)
- `.card`: `display:flex; flex-direction:column; overflow:hidden;` + `box-shadow: var(--shadow-sm)` + `transition: box-shadow 200ms ease, transform 200ms ease`
- `.card__header`: `padding: var(--spacing-md)`; 선택적 — 기본 회색, `--primary` 변형은 파란 배경 + 흰 텍스트
- `.card__header--image`: `padding:0; overflow:hidden` — 이미지가 카드 상단을 꽉 채우는 커버형
- `.card__body`: `flex:1; display:flex; flex-direction:column; gap: var(--spacing-xs)`
- `.card__title`: `font-size: var(--font-size-lg)` (1.125rem), `font-weight:600`
- `.card__description`: `font-size: var(--font-size-sm)`, `color: var(--color-text-secondary)`
- `.card__footer`: `border-top`, `background: var(--color-bg-secondary)` + `--end` / `--between` 정렬 변형

## 가로형 (.card--horizontal)
- `flex-direction: row`
- `.card__image`: `width:160px; min-width:160px; max-width:160px; object-fit:cover; border-radius: var(--radius-md) 0 0 var(--radius-md)`
- `.card__body`: `min-width:0` (flex item 오버플로우 방지 필수)
- 모바일 `@media (max-width: 480px)`: `flex-direction:column`, 이미지 `width:100%; height:180px; border-radius: var(--radius-md) var(--radius-md) 0 0`

## 인터랙티브 (.card--interactive)
- `cursor:pointer`
- `:hover`: `box-shadow: var(--shadow-lg); transform: translateY(-3px); border-color: var(--color-border-hover)`
- `:active`: `transform: translateY(-1px); box-shadow: var(--shadow-md)`
- `:focus-visible`: `outline: 2px solid var(--color-primary); outline-offset: 2px`
- HTML에서 `tabindex="0"` 필수 (링크/버튼 래퍼면 불필요)

## 색상 변형
- `color-mix(in srgb, var(--color-primary) 10%, var(--color-bg))` 패턴으로 헤더 배경 만들기
- 변형: `--primary`, `--success`, `--warning`, `--error` — 모두 `border-left: 4px solid` 강조

## 그리드 헬퍼 (.card-grid)
- `grid-template-columns: 1fr` → 640px: `repeat(2,1fr)` → 1024px: `repeat(3,1fr)`

## 모션 접근성
- `@media (prefers-reduced-motion: reduce)`: `.card, .card--interactive { transition:none }`, `:hover { transform:none }`

**Why:** CSS-only 구현, JS 불필요, 다크 모드 CSS 변수로 자동 처리
**How to apply:** card.css 수정 시 위 패턴 기준으로 일관성 유지
