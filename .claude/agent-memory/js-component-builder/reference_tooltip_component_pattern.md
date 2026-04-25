---
name: Tooltip 컴포넌트 패턴
description: WAI-ARIA tooltip 패턴, 점진적 강화(CSS :hover 폴백), disabled 버튼 처리 방법 레퍼런스
type: reference
---

## 마크업 구조

```html
<div class="tooltip" data-component="tooltip" data-tooltip-placement="top">
  <button
    type="button"
    data-tooltip-trigger
    aria-describedby="tooltip-1"
  >
    트리거
  </button>
  <div
    id="tooltip-1"
    class="tooltip__content"
    data-tooltip-content
    role="tooltip"
  >
    툴팁 내용
  </div>
</div>
```

핵심:
- `data-component="tooltip"`: init() 탐색 대상
- `data-tooltip-trigger`: 트리거 식별자 (button, span 모두 가능)
- `data-tooltip-content` + `role="tooltip"`: 콘텐츠 식별자
- `aria-describedby`: **정적 마크업에 작성** — JS 없어도 스크린 리더 연결
- `data-tooltip-placement`: top/bottom/left/right (CSS로 방향 제어)

## 점진적 강화 방식

```css
/* JS 없을 때: :hover/:focus-within 폴백 */
[data-component="tooltip"]:not([data-js-loaded]):hover [data-tooltip-content],
[data-component="tooltip"]:not([data-js-loaded]):focus-within [data-tooltip-content] {
  opacity: 1;
  visibility: visible;
}

/* JS 활성화 후: 클래스 기반 제어 */
[data-component="tooltip"][data-js-loaded] [data-tooltip-content].tooltip--visible {
  opacity: 1;
  visibility: visible;
}
```

JS init() 시 `el.dataset.jsLoaded = 'true'`를 설정하면 CSS 폴백이 비활성화되고 JS 클래스 제어로 전환됨.

## JS 구현 핵심

```js
_setup() {
  // aria-describedby가 없을 때만 추가 (이미 정적 작성된 것 우선)
  if (!this.trigger.getAttribute('aria-describedby')) {
    this.trigger.setAttribute('aria-describedby', this.content.id);
  }
  this.trigger.setAttribute('aria-expanded', 'false');

  // mouseenter/mouseleave + focus/blur 모두 처리
  // blur 딜레이 100ms: 마우스와 포커스 전환 시 깜빡임 방지
}
```

- `data-initialized`: 중복 초기화 방지
- `_hideTimer`: blur/mouseleave 연달아 발생 시 깜빡임 방지용 100ms 딜레이
- `Escape` 키: 표시 중인 툴팁 닫기
- `destroy()`: boundHandlers 참조 저장 후 removeEventListener로 정리

## disabled 버튼에 툴팁 연결하는 패턴

disabled 버튼은 이벤트를 받지 못하므로 래퍼 span 패턴 사용:

```html
<div data-component="tooltip">
  <!-- span이 이벤트 수신 + 키보드 포커스 -->
  <span data-tooltip-trigger tabindex="0" style="display:inline-flex;">
    <!-- aria-disabled: 이벤트는 허용하되 스크린 리더에 비활성 전달 -->
    <button type="button" aria-disabled="true"
      style="pointer-events:none;opacity:0.4;">
      비활성 버튼
    </button>
  </span>
  <div data-tooltip-content role="tooltip">
    권한이 없어 사용 불가
  </div>
</div>
```

disabled 속성 사용 시 mouseenter/focus 이벤트가 발생하지 않아 툴팁 표시 불가.

## 아이콘 버튼 접근성

```html
<!-- aria-label: 버튼 목적 (필수) -->
<!-- aria-describedby: 툴팁 추가 설명 (선택) -->
<button aria-label="설정" aria-describedby="tt-settings" data-tooltip-trigger>
  <i data-lucide="settings" aria-hidden="true"></i>
</button>
```

스크린 리더: "설정 버튼, 환경설정 열기" 형태로 읽음.

## 위치 계산 (CSS 방식)

JS 동적 위치 계산 없이 CSS `data-tooltip-placement` 속성 선택자로 처리:
- top: `bottom: calc(100% + 8px)` + translateX(-50%)
- bottom: `top: calc(100% + 8px)` + translateX(-50%)
- left: `right: calc(100% + 8px)` + translateY(-50%)
- right: `left: calc(100% + 8px)` + translateY(-50%)

화살표는 `::before` 의사 요소로 구현 (border-trick 방식).
