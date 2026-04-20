---
name: DetailPage 상속 패턴
description: DetailPage 기반 클래스와 Demo 서브클래스 구현 패턴 (Task 011-B)
type: reference
---

## 패턴 개요

모든 컴포넌트 데모 페이지는 `DetailPage`를 상속하고 두 메서드만 오버라이드한다.

### 오버라이드 대상

1. `getComponentInfo()` — `{ title, description }` 반환 (헤더 영역 표시)
2. `_renderDemos()` — 데모 섹션 HTML 문자열 반환 (main 영역에 삽입)

### DetailPage 책임

- 18개 컴포넌트 목록 사이드바 (`COMPONENT_NAVIGATION` 상수)
- 이전/다음 컴포넌트 푸터 링크 (`ALL_COMPONENTS` flat 배열로 탐색)
- 현재 경로 활성 표시: `aria-current="page"` + `.active` 클래스
- `afterMount()`에서 `window.scrollTo(0, 0)` 처리

### Demo 서브클래스 패턴

```js
import DetailPage from '../pages/DetailPage.js';

export default class ButtonDemo extends DetailPage {
  getComponentInfo() {
    return { title: 'Button', description: '...' };
  }

  _renderDemos() {
    return `<article class="demo-page">...</article>`;
  }

  afterMount() {
    super.afterMount(); // scrollTo 포함
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  destroy() {
    super.destroy();
  }
}
```

### Router 연동

`Router.js`가 `new componentClass(this.rootElement)` → `mount()` → `afterMount()` 순서로 호출.
`DetailPage`는 `Component`를 상속하므로 `mount()`는 그대로 `super.mount()` (render() → innerHTML).

### 주의 사항

- `detail-sidebar` (`.detail-sidebar`): 페이지 인라인 사이드바 — layout.css의 `.sidebar`(전역)와 별개
- App.js의 `setupNavigation()`이 전역 `.sidebar` `.nav-link`를 관리 → 충돌 없음
- 다른 Demo 파일(InputDemo 등)이 아직 `Component` 직접 상속 stub 상태임 → Task 012~028에서 DetailPage로 전환 필요
