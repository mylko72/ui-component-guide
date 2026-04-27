---
name: Select 커스텀 컴포넌트 패턴
description: 네이티브 select를 숨기고 WAI-ARIA combobox/listbox로 강화하는 점진적 강화 패턴
type: reference
---

## 핵심 구조

- `select[data-select]` 속성 선택자로 타겟
- `el.closest('.select-wrap')` 없으면 건너뜀 (래퍼 필수)
- `el.disabled`이면 커스텀 UI 생성 안 함 (네이티브 그대로)
- JS 로드 후: 네이티브 select `display:none` + `aria-hidden="true"` + `tabindex="-1"`
- `.select-wrap[data-js-loaded="true"]` 마커로 CSS 조건부 적용

## 동적 생성 DOM 구조

```html
<div class="select-wrap" data-js-loaded="true">
  <!-- 네이티브 select: 숨김 (form submit용으로 유지) -->
  <select data-select data-initialized="true" style="display:none" aria-hidden="true" tabindex="-1">...</select>

  <!-- 커스텀 combobox 버튼 -->
  <button class="select-custom__button" role="combobox"
    aria-haspopup="listbox" aria-expanded="false"
    aria-controls="select-xxxxx-listbox">
    <span class="select-custom__value">선택된 텍스트</span>
    <span class="select-custom__arrow" aria-hidden="true"><svg ...></span>
  </button>

  <!-- 커스텀 listbox -->
  <ul id="select-xxxxx-listbox" class="select-custom__listbox"
    role="listbox" style="display:none">
    <li class="select-custom__group-label" role="presentation">그룹명</li>
    <li class="select-custom__option" role="option"
      tabindex="-1" data-value="kr" aria-selected="false">대한민국</li>
  </ul>
</div>
```

## ARIA 속성 상속 규칙

- `aria-required`, `aria-describedby`, `aria-invalid` → 네이티브에서 버튼으로 복사
- `label[for="..."]` 탐색 → `aria-labelledby` 설정 (없으면 `aria-label` 상속)
- `data-size`, `data-error`, `data-success` → 버튼에 dataset 복사

## 키보드 네비게이션

- ArrowDown: 닫혀 있으면 열기, 열려 있으면 다음 option
- ArrowUp: 닫혀 있으면 열고 마지막 option, 열려 있으면 이전 option
- Home/End: 첫/마지막 option
- Enter: 버튼이면 토글, option이면 선택
- Space: 버튼이면 열기, option이면 선택
- Esc: 닫기 + 버튼으로 포커스 복귀
- Tab: 닫기 (포커스 자연 이동)

## Typeahead

- `typeaheadBuffer` 문자열 누적, 500ms 후 초기화
- 단일 문자 반복 감지: `buffer.split('').every(c => c === buffer[0]) && buffer.length > 1`
- 반복 입력 시 현재 activeIndex+1부터 순환 검색
- `startsWith(searchStr)` 첫 매칭 option으로 `_setActiveOption(idx)`

## 선택 동기화

- `this.el.value = value` (네이티브 select value 업데이트)
- `new Event('change', { bubbles: true })` → `this.el.dispatchEvent()` (외부 리스너 연동)

## 외부 클릭 닫기

- `document.addEventListener('click', handler, true)` (capture phase)
- `this.wrap.contains(e.target)` 체크로 내부 클릭 무시
- listbox 열릴 때 attach, 닫힐 때 detach

## CSS 클래스

- `.select-custom__button` — combobox 역할 버튼
- `.select-custom__value` — 선택값 텍스트 (text-overflow: ellipsis)
- `.select-custom__arrow` — 화살표 SVG 아이콘 (열릴 때 rotate 180deg)
- `.select-custom__listbox` — position: absolute 드롭다운
- `.select-custom__option` — [data-active] 하이라이트, [aria-selected] 선택
- `.select-custom__group-label` — optgroup 레이블
- `.select-wrap--open` — 열림 상태 마커 클래스

## common.js 통합

```javascript
function initSelects() {
  if (typeof Select === 'undefined') return;
  Select.init(document);
}
// DOMContentLoaded 내에서 initCodeBlocks() 다음, initIcons() 이전에 호출
```
