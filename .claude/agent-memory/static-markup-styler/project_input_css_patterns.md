---
name: Input 컴포넌트 CSS 구현 패턴
description: input.css 완성 패턴 — data-attribute 선택자, error 상태, 다크 모드 color-mix, 포커스 링, number 스피너 제거
type: project
---

## Input 컴포넌트 CSS 구현 패턴

**선택자 전략:** `input[data-input]` 베이스, `input[data-input][data-size="sm|md|lg"]` 크기 변형, `input[data-input][data-error="true"]` 에러 상태. button.css의 `[data-variant]` 패턴과 동일한 data-attribute 방식.

**Number 스피너 제거:**
- `::-webkit-outer-spin-button` / `::-webkit-inner-spin-button` → `display: none`
- Firefox: `input[type="number"] { -moz-appearance: textfield; }`

**포커스 링 구현:**
- input은 `:focus-visible`이 브라우저별로 불일치하므로 `:focus` 사용
- `outline: 2px solid var(--color-primary)` + `outline-offset: 0` (요구사항 준수)
- `box-shadow: 0 0 0 3px rgba(59,130,246,0.15)` — 내부 glow로 감지성 강화
- 에러 포커스: `outline-color: var(--color-danger)` + `rgba(239,68,68,0.15)` glow

**Error 상태 배경:**
- `color-mix(in srgb, var(--color-danger) 6%, var(--color-bg))` — tokens.css 변수만 사용하면서 연한 빨간 배경 구현
- 다크 모드에서는 6% → 10% 로 비율 상향 (어두운 배경에서 색상 대비 강화)

**Disabled 처리:** button.css와 동일 — `opacity: 0.5` + `cursor: not-allowed` + `pointer-events: none` + `background-color: var(--color-bg-secondary)`

**다크 모드:** tokens.css 변수 자동 대응이 기본. 포커스 glow와 error 배경만 `:root[data-theme="dark"]` 블록에서 별도 선언.

**크기 체계:** button.css와 정렬 — sm(32px/0.875rem), md(44px/1rem), lg(52px/1.125rem). 모바일에서 sm도 44px로 통일(WCAG 2.5.5).

**Why:** input은 button과 달리 `:focus-visible`을 사용하지 않음 — 폼 필드는 키보드/마우스 구분 없이 포커스 링이 항상 필요하기 때문.

**How to apply:** 신규 폼 컴포넌트(textarea, select 등) 작성 시 동일한 data-attribute 패턴 + color-mix 에러 배경 + `:focus` 포커스 링 방식 적용.

## Checkbox 컴포넌트 확장 패턴 (2026-04-20)

checkbox.css는 input.css 패턴을 계승하며 커스텀 체크박스 구현:

**숨김 기법:** `input[type="checkbox"][data-checkbox]`를 `position:absolute; clip:rect(0,0,0,0)` — `display:none` 대신 접근성 트리 유지.

**커스텀 박스 구조:**
- `label[data-checkbox-label]::before` — 18×18px 박스 (border: 1px solid, border-radius: 3px)
- `label[data-checkbox-label]::after` — CSS border trick 체크마크 (border-right + border-bottom 회전)
- indeterminate: `aria-checked="mixed"` 시 `::after`를 수평 대시(background-color:#fff, border:none)로 재정의

**포커스 링:** 숨겨진 input의 `:focus-visible`을 인접 label의 `::before`에 표현 (`outline: 2px solid + box-shadow glow`)

**크기 체계:** sm(14×14px), md(18×18px, 기본), lg(22×22px) — border-radius도 sm=3px, lg=4px로 스케일

**그룹 레이아웃 클래스:** `.checkbox-group` (수직), `.checkbox-group--inline` (수평), `.checkbox-group-label`, `.checkbox-helper`, `.checkbox-error-msg`
