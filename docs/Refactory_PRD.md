# 리팩토링 PRD — SPA → 정적 멀티 페이지 아키텍처 전환

> **문서 정보**
> - 버전: v1.0
> - 작성일: 2026-04-21
> - 대상 프로젝트: Web UI Component Guide
> - 참조 문서: `docs/PRD.md` (v1.2), `docs/ROADMAP.md` (v1.2)

---

## 1. 프로젝트 개요

### 1.1 배경

현재 Web UI Component Guide는 단일 `index.html`에서 ES6 모듈 기반 Hash Router로 동작하는 **SPA(Single Page Application)** 구조입니다.

모든 컴포넌트 데모 HTML이 JavaScript 템플릿 리터럴로 동적 생성되며, `DOMContentLoaded` 이후 JS가 실행되어야만 화면이 표시됩니다. 이 구조는 초기 개발 속도를 높였으나, 이제 아래와 같은 문제를 야기합니다.

### 1.2 핵심 문제

| 문제 | 영향 | 심각도 |
|------|------|--------|
| HTML이 JS 템플릿 문자열로 생성 | 비기술 작업자가 마크업 수정 불가 | 높음 |
| JS 비활성화 시 빈 화면 표시 | 점진적 향상(Progressive Enhancement) 위반 | 높음 |
| 모든 CSS를 `index.html`에서 전역 로드 | 불필요한 의존성, 페이지별 최적화 불가 | 중간 |
| 초기화 메서드가 모두 private (`_xxx`) | 외부에서 컴포넌트 재초기화 불가 | 중간 |
| SPA Hash Router 의존 | 직접 URL 접근 불가, 검색 색인 불리 | 낮음 |

### 1.3 리팩토링 목표

이 PRD는 현재 SPA 구조를 **정적 HTML 우선(Static HTML First)** + **점진적 향상(Progressive Enhancement)** 아키텍처로 전환하는 작업의 요구사항을 정의합니다.



```
[현재]                          [목표]
index.html (단일)        →      index.html + pages/*.html (19개)
JS 템플릿 문자열         →      정적 HTML 마크업
Hash Router (SPA)        →      직접 파일 참조
전역 CSS 로드            →      페이지별 필요 CSS만 로드
private init()           →      public static init()
JS 없으면 빈 화면        →      JS 없어도 HTML+CSS 표시
```

### 1.4 리팩토링 방향
컴포넌트 가이드는 학습을 위한 가이드가 아닌 웹개발시 프로덕션 단계에서 바로 적용 가능한 실용적인 예제를 담은 UI 컴포넌트를 제작하는 방향성을 가져야 한다. 실무에서 퍼블리셔와 개발자가 수정하고 기능을 추가하도록 확장성을 담보해야 한다.

---

## 2. 주요 요구사항

### R-01. 마크업 분리 (Markup Separation)

**요구사항**: 모든 컴포넌트 데모 HTML은 JavaScript 코드가 아닌 독립적인 `.html` 파일로 존재해야 합니다.

**현재 문제**:
```javascript
// 현재: ButtonDemo.js 내 _renderPrimarySection()
_renderPrimarySection() {
  return `
    <section class="demo-section" aria-labelledby="section-primary">
      <h2>Primary</h2>
      <button data-variant="primary" data-size="md">Medium</button>
    </section>
  `;
}
```

**목표 상태**:
```html
<!-- pages/button.html -->
<section class="demo-section" aria-labelledby="section-primary">
  <h2>Primary</h2>
  <button data-variant="primary" data-size="md">Medium</button>
</section>
```

**수용 기준**:
- 모든 컴포넌트 데모 HTML은 `pages/*.html` 파일로 존재한다
- JS 파일에서 HTML 마크업을 생성하는 템플릿 리터럴이 없어야 한다
- 비개발자가 텍스트 에디터로 `.html` 파일을 직접 편집할 수 있어야 한다

---

### R-02. JS 없이 HTML+CSS 표시 (Progressive Enhancement)

**요구사항**: JavaScript를 비활성화한 상태에서도 HTML 구조와 CSS 스타일이 정상적으로 표시되어야 합니다.

**현재 문제**:
- `index.html`의 `<div id="app-content">` 내부가 JS 없으면 비어 있음
- 모든 컴포넌트 마크업이 JS 실행 후 동적 주입됨

**목표 상태**:
- 각 `pages/*.html`에 완전한 HTML 마크업이 존재
- CSS 파일만으로 기본 레이아웃과 스타일 표시 가능
- JS는 인터랙션(Accordion 열기/닫기, Tabs 전환 등)만 담당

**컴포넌트별 JS 의존도 분류**:

| 분류 | 컴포넌트 | JS 없이 가능한 것 |
|------|---------|-----------------|
| 정적 컴포넌트 (8개) | Button, Input, Checkbox, Radio, Switch, Select, Textarea, Badge | 100% — JS 불필요 |
| 인터랙션 필요 (10개) | Accordion, Tabs, Modal, Dropdown, Toast, Alert, Card, Tooltip, Progress, Skeleton | HTML+CSS 구조 표시 가능, 인터랙션은 JS 필요 |

**수용 기준**:
- 브라우저에서 JS를 비활성화해도 각 페이지의 HTML 구조와 CSS 스타일이 표시된다
- 정적 컴포넌트 8개는 JS 없이 완전히 동작한다
- 인터랙션 컴포넌트 10개는 JS 없이도 초기 상태 HTML+CSS가 표시된다

---

### R-03. 컴포넌트별 독립적 CSS/JS 로드 (Component Isolation)

**요구사항**: 각 페이지는 해당 컴포넌트에 필요한 CSS와 JS만 로드해야 합니다.

**현재 문제**:
```html
<!-- index.html: 18개 컴포넌트 CSS 전체 로드 -->
<link rel="stylesheet" href="assets/css/components/button.css">
<link rel="stylesheet" href="assets/css/components/input.css">
<!-- ... 16개 더 ... -->
```

**목표 상태**:
```html
<!-- pages/button.html: button 관련 CSS만 로드 -->
<link rel="stylesheet" href="../assets/css/tokens.css">
<link rel="stylesheet" href="../assets/css/reset.css">
<link rel="stylesheet" href="../assets/css/common.css">
<link rel="stylesheet" href="../assets/css/components/button.css">
```

**공통 CSS (`assets/css/common.css`) 구성**:
- 헤더 레이아웃
- 사이드바 레이아웃
- 상세 페이지 레이아웃 (`.detail-page`, `.detail-header`, `.detail-content`)
- 데모 섹션 레이아웃 (`.demo-section`, `.demo-preview`)
- CodeBlock 스타일

**수용 기준**:
- 각 `pages/*.html`은 해당 컴포넌트 CSS만 개별 로드한다
- Button 페이지에서 Modal CSS가 로드되지 않는다
- 공통 레이아웃은 `assets/css/common.css` 한 파일로 통합된다

---

### R-04. 공개 초기화 API (Public Init API)

**요구사항**: 모든 컴포넌트 클래스는 외부에서 호출 가능한 `public static init()` 메서드를 제공해야 합니다.

**현재 문제**:
```javascript
// 현재: private 생명주기 — 외부에서 호출 불가
class AccordionDemo extends Component {
  mount() { /* private, 상속 통해서만 호출 */ }
  afterMount() { /* private */ }
}
```

**목표 상태**:
```javascript
// 목표: public static init() — 외부에서 직접 호출 가능
class Accordion {
  static init(container = document) {
    const elements = container.querySelectorAll('[data-component="accordion"]');
    elements.forEach(el => new Accordion(el).mount());
  }
}

// 사용 예시 (동적으로 HTML 추가 후 재초기화)
document.body.appendChild(newAccordionHTML);
Accordion.init(document.body); // 새로 추가된 요소만 초기화
```

**수용 기준**:
- 모든 인터랙션 컴포넌트 클래스에 `static init(container?)` 메서드가 존재한다
- `init()`은 지정된 `container` 내의 해당 컴포넌트 요소를 모두 초기화한다
- 동적으로 추가된 HTML에 `init()`을 호출하면 정상 동작한다
- `init()`을 여러 번 호출해도 중복 초기화되지 않는다 (idempotent)

---

## 3. 목표 아키텍처

### 3.1 파일 구조

```
ui-component-guide/
│
├── index.html                      # 대시보드 (컴포넌트 카드 그리드)
│
├── pages/                          # 컴포넌트 상세 페이지 (18개)
│   ├── button.html
│   ├── input.html
│   ├── checkbox.html
│   ├── radio.html
│   ├── switch.html
│   ├── select.html
│   ├── textarea.html
│   ├── badge.html
│   ├── card.html
│   ├── accordion.html
│   ├── tabs.html
│   ├── modal.html
│   ├── dropdown.html
│   ├── toast.html
│   ├── alert.html
│   ├── tooltip.html
│   ├── progress.html
│   └── skeleton.html
│
├── assets/
│   ├── css/
│   │   ├── tokens.css              # 디자인 토큰 (변경 없음)
│   │   ├── reset.css               # 브라우저 리셋 (변경 없음)
│   │   ├── common.css              # [신규] 공통 레이아웃 통합 파일
│   │   │                           # (layout.css + code-block.css + dashboard.css
│   │   │                           #  + pages/dashboard.css + pages/detail.css 통합)
│   │   └── components/             # 개별 컴포넌트 CSS (변경 없음)
│   │       └── *.css (18개)
│   │
│   └── js/
│       ├── common.js               # [신규] 공통 유틸리티 통합 파일
│       │                           # (테마 토글, CodeBlock 초기화, 사이드바 내비게이션)
│       │
│       └── components/             # [신규] 컴포넌트별 독립 JS
│           ├── accordion.js        # Accordion.init() public API
│           ├── tabs.js             # Tabs.init() public API
│           ├── modal.js            # Modal.init() public API
│           ├── dropdown.js         # Dropdown.init() public API
│           ├── toast.js            # Toast.init() public API
│           ├── alert.js            # Alert.init() public API
│           ├── tooltip.js          # Tooltip.init() public API
│           ├── select.js           # Select.init() public API
│           └── code-block.js       # CodeBlock.init() public API
│
│   [레거시 — 점진적 제거 대상]
│   └── js/
│       ├── core/                   # EventBus, Router, Component (유지)
│       ├── ui/                     # ToastManager, ModalManager (유지)
│       ├── demos/                  # XxxDemo.js (단계적 대체)
│       ├── pages/                  # DashboardPage, DetailPage (단계적 대체)
│       └── App.js                  # SPA 진입점 (최종 제거 대상)
```

### 3.2 페이지별 HTML 구조

각 `pages/*.html`은 완전한 독립 문서로, 아래 구조를 가집니다:

```html
<!DOCTYPE html>
<html lang="ko" data-theme="light">
<head>
  <!-- FOUC 방지 -->
  <script>
    const t = localStorage.getItem('uig-theme');
    const s = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', t || s);
  </script>

  <meta charset="UTF-8">
  <title>[컴포넌트명] | Web UI Component Guide</title>

  <!-- 공통 스타일 -->
  <link rel="stylesheet" href="../assets/css/tokens.css">
  <link rel="stylesheet" href="../assets/css/reset.css">
  <link rel="stylesheet" href="../assets/css/common.css">

  <!-- 이 페이지 전용 컴포넌트 CSS만 로드 -->
  <link rel="stylesheet" href="../assets/css/components/[컴포넌트명].css">
</head>
<body>

  <!-- 건너뛰기 링크 -->
  <a href="#main" class="skip-nav">본문으로 이동</a>

  <!-- 헤더 (정적 마크업) -->
  <header class="header">...</header>

  <!-- 2단 레이아웃 -->
  <div class="detail-page">
    <aside class="detail-sidebar">
      <!-- 사이드바 네비게이션 (정적 마크업) -->
    </aside>

    <main id="main" class="detail-main">
      <!-- 컴포넌트 데모 HTML (정적 마크업) -->
    </main>
  </div>

  <!-- Lucide Icons CDN -->
  <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>

  <!-- 공통 유틸리티 -->
  <script src="../assets/js/common.js"></script>

  <!-- 인터랙션 컴포넌트만 해당 JS 로드 (정적 컴포넌트는 생략) -->
  <!-- <script src="../assets/js/components/accordion.js"></script> -->

</body>
</html>
```

---

## 4. 컴포넌트별 구현 범위

### 4.1 정적 컴포넌트 (8개) — JS 불필요

데모 HTML은 `pages/*.html`에 정적으로 작성되며, JS 없이 완전 동작합니다.

| 컴포넌트 | HTML 파일 | JS 파일 | 비고 |
|---------|----------|--------|------|
| Button | `pages/button.html` | 없음 | CSS만으로 모든 variant 표시 |
| Input | `pages/input.html` | 없음 | 비밀번호 토글 제외 순수 HTML |
| Checkbox | `pages/checkbox.html` | 없음 | `:checked` CSS pseudo-class 활용 |
| Radio | `pages/radio.html` | 없음 | `:checked` CSS pseudo-class 활용 |
| Switch | `pages/switch.html` | 없음 | CSS-only 토글 가능 (checkbox 활용) |
| Textarea | `pages/textarea.html` | 없음 | 글자수 카운터는 JS 선택적 강화 |
| Badge | `pages/badge.html` | 없음 | 순수 CSS 컴포넌트 |
| Select (기본) | `pages/select.html` | `assets/js/components/select.js` | 네이티브 select 기본 표시, 커스텀은 JS 강화 |

> **참고**: Select 컴포넌트는 네이티브 `<select>`를 기본으로 표시하고, JS 로드 시 커스텀 드롭다운으로 점진적 강화합니다.

---

### 4.2 인터랙션 컴포넌트 (10개) — JS로 점진적 강화

기본 HTML+CSS 구조는 JS 없이 표시되며, JS 로드 후 인터랙션이 활성화됩니다.

| 컴포넌트 | HTML 파일 | JS 파일 | JS 없을 때 표시 |
|---------|----------|--------|----------------|
| Accordion | `pages/accordion.html` | `assets/js/components/accordion.js` | 모든 패널이 펼쳐진 상태로 표시 |
| Tabs | `pages/tabs.html` | `assets/js/components/tabs.js` | 첫 번째 탭 내용만 표시 |
| Modal | `pages/modal.html` | `assets/js/components/modal.js` | 모달 내용이 페이지 내 `<dialog>` 요소로 표시 |
| Dropdown | `pages/dropdown.html` | `assets/js/components/dropdown.js` | 드롭다운 목록이 펼쳐진 상태로 표시 |
| Toast | `pages/toast.html` | `assets/js/components/toast.js` | Toast 예시가 정적으로 표시 |
| Alert | `pages/alert.html` | `assets/js/components/alert.js` | Alert 박스 정적 표시, 닫기 버튼 비활성 |
| Card | `pages/card.html` | 없음 | 인터랙티브 Card는 JS 선택적 강화 |
| Tooltip | `pages/tooltip.html` | `assets/js/components/tooltip.js` | CSS `:hover`로 기본 표시 |
| Progress | `pages/progress.html` | `assets/js/components/progress.js` | `<progress>` 네이티브 요소로 표시 |
| Skeleton | `pages/skeleton.html` | 없음 | CSS 애니메이션만으로 표시 |

---

## 5. 공통 유틸리티 설계

### 5.1 `assets/css/common.css` — 공통 레이아웃 CSS

현재 `index.html`에서 개별 로드하던 레이아웃 관련 CSS를 하나로 통합합니다.

**통합 대상**:
- `assets/css/layout.css` — 헤더, 메인 컨테이너 레이아웃
- `assets/css/code-block.css` — CodeBlock 컴포넌트 스타일
- `assets/css/pages/dashboard.css` — 대시보드 페이지 레이아웃 (index.html 전용)
- `assets/css/pages/detail.css` — 상세 페이지 레이아웃 (pages/*.html 공통)

**공통 CSS 포함 항목**:

```css
/* common.css 구성 목록 */

/* 1. 전체 페이지 레이아웃 */
.header { ... }
.header-container { ... }
.header-brand { ... }
.theme-toggle { ... }

/* 2. 상세 페이지 2단 레이아웃 */
.detail-page { ... }
.detail-header { ... }
.detail-sidebar { ... }
.detail-main { ... }
.detail-content { ... }
.detail-footer { ... }

/* 3. 사이드바 네비게이션 */
.sidebar-nav { ... }
.nav-section { ... }
.nav-list { ... }
.nav-link { ... }
.nav-link.active { ... }

/* 4. 데모 섹션 */
.demo-section { ... }
.demo-preview { ... }
.demo-description { ... }

/* 5. CodeBlock */
.code-block { ... }
.code-block__header { ... }
.code-block__tab { ... }
.code-block__panel { ... }
.code-block__footer { ... }

/* 6. 건너뛰기 링크 */
.skip-nav { ... }
```

---

### 5.2 `assets/js/common.js` — 공통 JavaScript 유틸리티

모든 `pages/*.html`에서 공통으로 필요한 JavaScript 기능을 하나의 파일로 제공합니다.

**포함 기능**:

#### 5.2.1 테마 관리

```javascript
// 테마 토글 버튼 이벤트 등록
function initTheme() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('uig-theme', next);
    if (window.lucide) window.lucide.createIcons();
  });
}
```

#### 5.2.2 CodeBlock 초기화

```javascript
// 페이지 내 모든 [data-code-block] 요소를 CodeBlock으로 초기화
function initCodeBlocks() {
  document.querySelectorAll('[data-code-block]').forEach(el => {
    CodeBlock.init(el); // public static init() 사용
  });
}
```

#### 5.2.3 사이드바 네비게이션 활성 상태

```javascript
// 현재 페이지 URL 기준으로 사이드바 활성 링크 설정
function initSidebarNav() {
  const currentPath = window.location.pathname;
  const links = document.querySelectorAll('.nav-link');
  links.forEach(link => {
    if (link.getAttribute('href') === currentPath ||
        currentPath.includes(link.getAttribute('href').replace('../pages/', ''))) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
}
```

#### 5.2.4 Lucide 아이콘 초기화

```javascript
// DOMContentLoaded 후 Lucide 아이콘 렌더링
function initIcons() {
  if (window.lucide) window.lucide.createIcons();
}
```

#### 5.2.5 진입점

```javascript
// common.js 진입점 — DOMContentLoaded 후 순서대로 실행
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initSidebarNav();
  initCodeBlocks();
  initIcons();
});
```

---

### 5.3 `assets/js/components/*.js` — 컴포넌트 독립 JS

각 컴포넌트는 Class 문법으로 작성되며, `public static init()` API를 반드시 제공합니다.

**공통 패턴**:

```javascript
/**
 * Accordion 컴포넌트
 * - JS 없이: 모든 패널이 펼쳐진 상태로 CSS 표시
 * - JS 있을 때: 단일/다중 열림 모드, ARIA 속성 관리
 */
class Accordion {
  constructor(element) {
    this.el = element;
    this._initialized = false; // 중복 초기화 방지
  }

  /**
   * public static init — 외부 호출 진입점
   * @param {HTMLElement|Document} container - 탐색 범위 (기본: document)
   */
  static init(container = document) {
    container.querySelectorAll('[data-component="accordion"]').forEach(el => {
      // 중복 초기화 방지
      if (el.dataset.initialized) return;
      el.dataset.initialized = 'true';
      new Accordion(el)._setup();
    });
  }

  _setup() {
    // ARIA 속성 설정
    // 이벤트 리스너 등록
    // 초기 상태 적용
  }
}

// 페이지 로드 시 자동 초기화
document.addEventListener('DOMContentLoaded', () => Accordion.init());
```

**각 컴포넌트 JS 파일 책임**:

| 파일 | 책임 | public API |
|------|------|-----------|
| `accordion.js` | 항목 열기/닫기, 단일/다중 모드, ARIA 관리 | `Accordion.init(container?)` |
| `tabs.js` | 탭 전환, 패널 표시/숨김, ARIA 관리 | `Tabs.init(container?)` |
| `modal.js` | 열기/닫기, 포커스 트랩, Esc 키, body scroll lock | `Modal.init(container?)` |
| `dropdown.js` | 열기/닫기, 항목 선택, 외부 클릭 닫기 | `Dropdown.init(container?)` |
| `toast.js` | Toast 생성/제거, 자동 닫힘, 스택 관리 | `Toast.show(options)` |
| `alert.js` | 닫기 버튼 동작 | `Alert.init(container?)` |
| `tooltip.js` | 호버/포커스 표시, 위치 계산 | `Tooltip.init(container?)` |
| `select.js` | 커스텀 드롭다운, Typeahead, ARIA Combobox | `Select.init(container?)` |
| `code-block.js` | HTML/CSS/JS 탭, 확장/축소, 클립보드 복사 | `CodeBlock.init(container?)` |
| `progress.js` | 값 업데이트, Indeterminate 애니메이션 | `Progress.init(container?)` |

---

## 6. 마이그레이션 전략

### 6.1 개요

현재 구현 상태를 기준으로 3개 컴포넌트는 완전 구현, 15개는 stub 상태입니다.

| 상태 | 컴포넌트 | 비고 |
|------|---------|------|
| 완전 구현 (3개) | Button, Badge, (공통 레이아웃) | `_renderDemos()` 완전 구현됨 |
| Stub (15개) | Input, Checkbox, Radio, Switch, Select, Textarea, Card, Accordion, Tabs, Modal, Dropdown, Toast, Alert, Tooltip, Progress, Skeleton | `render()` 빈 껍데기만 존재 |

### 6.2 3단계 마이그레이션 계획

#### 6.2.1 단계 1 — 인프라 구축 (선행 작업)

SPA를 그대로 유지하면서 새 파일 구조의 기반을 만듭니다.

```
작업 목록:
  [ ] assets/css/common.css 생성 (기존 CSS 파일들을 통합)
  [ ] assets/js/common.js 생성 (테마, 사이드바, CodeBlock, Lucide)
  [ ] assets/js/components/ 디렉토리 생성
  [ ] pages/ 디렉토리 생성
  [ ] index.html의 대시보드 페이지 정적 변환 (SPA Shell → 완전한 HTML)
```

#### 6.2.2 단계 2 — 완전 구현 컴포넌트 우선 마이그레이션

완전히 구현된 3개 컴포넌트를 먼저 정적 HTML로 전환합니다. 이 단계에서 마이그레이션 패턴을 확립합니다.

**Button 마이그레이션 상세 (예시)**:

```
[현재] assets/js/demos/ButtonDemo.js
  → _renderDemos() 에서 HTML 생성
  → DetailPage.render() 에서 레이아웃 생성

[변환 후] pages/button.html
  → DetailPage + ButtonDemo의 HTML을 정적으로 직접 작성
  → assets/js/components/button.js 는 불필요 (정적 컴포넌트)
  → 공통 CodeBlock 기능은 assets/js/components/code-block.js 로 제공

작업 목록:
  [ ] pages/button.html 생성 (ButtonDemo._renderDemos() HTML을 직접 작성)
  [ ] pages/badge.html 생성
  [ ] assets/js/components/code-block.js 생성 (CodeBlock public init() API)
  [ ] pages/button.html에서 code-block.js 동작 확인
  [ ] JS 비활성화 시 button.html 표시 확인
```

#### 6.2.3 단계 3 — Stub 컴포넌트 신규 구현 (정적 HTML 우선)

15개 stub 컴포넌트를 처음부터 정적 HTML 방식으로 구현합니다.

**구현 순서**:

```
1순위 — 정적 컴포넌트 (JS 불필요):
  Input → Checkbox → Radio → Switch → Textarea → Select(기본)

2순위 — CSS 강화 컴포넌트:
  Card → Skeleton → Alert → Badge(이미 완료)

3순위 — JS 인터랙션 컴포넌트:
  Accordion → Tabs → Dropdown → Tooltip → Progress → Modal → Toast
```

**각 Stub 컴포넌트 작업 패턴**:

```
1. pages/[컴포넌트명].html 생성
   - 완전한 정적 HTML 마크업 작성
   - 공통 레이아웃 (헤더, 사이드바) 포함
   - 해당 컴포넌트 CSS만 로드

2. (인터랙션 컴포넌트만) assets/js/components/[컴포넌트명].js 생성
   - Class 문법, public static init() API
   - data-initialized 중복 방지

3. 기존 assets/js/demos/[컴포넌트명]Demo.js 제거 예정 표시
   - 주석: "DEPRECATED: pages/[컴포넌트명].html 로 대체됨"

4. 검증
   - JS 비활성화 시 HTML+CSS 표시 확인
   - JS 활성화 시 인터랙션 동작 확인
   - public init() 외부 호출 확인
```

---

### 6.3 기존 코드 처리 방침

| 파일/디렉토리 | 처리 방침 | 시점 |
|-------------|---------|------|
| `assets/js/demos/*.js` | 단계적 Deprecated 처리 후 제거 | 대응 `pages/*.html` 완성 시 |
| `assets/js/pages/DetailPage.js` | SPA 유지 기간 동안 보존, 최종 제거 | 모든 pages/*.html 완성 시 |
| `assets/js/pages/DashboardPage.js` | index.html 정적 전환 완료 후 제거 | 단계 1 완료 시 |
| `assets/js/core/Router.js` | SPA 유지 기간 동안 보존, 최종 제거 | 모든 pages/*.html 완성 시 |
| `assets/js/App.js` | 최종 제거 대상 | 모든 마이그레이션 완료 시 |
| `assets/css/layout.css` | `common.css`로 통합 후 제거 | 단계 1 완료 시 |
| `assets/css/code-block.css` | `common.css`로 통합 후 제거 | 단계 1 완료 시 |
| `assets/css/pages/dashboard.css` | `common.css`로 통합 후 제거 | 단계 1 완료 시 |
| `assets/css/pages/detail.css` | `common.css`로 통합 후 제거 | 단계 1 완료 시 |

---

## 7. 테스트 계획

### 7.1 검증 시나리오

#### 시나리오 1 — JS 비활성화 표시 확인

```
목적: Progressive Enhancement 요구사항(R-02) 검증

절차:
  1. 브라우저 개발자 도구에서 JavaScript 비활성화
  2. 각 pages/*.html 파일 직접 열기
  3. 아래 항목 확인:

확인 항목:
  [ ] 헤더 레이아웃이 표시된다
  [ ] 사이드바 네비게이션이 표시된다
  [ ] 컴포넌트 데모 HTML이 표시된다
  [ ] 기본 CSS 스타일이 적용된다 (색상, 간격, 폰트)
  [ ] 정적 컴포넌트 8개는 완전히 동작한다 (클릭, 포커스 등)
  [ ] 인터랙션 컴포넌트는 초기 HTML 상태로 표시된다
    - Accordion: 모든 패널이 펼쳐져 있다
    - Tabs: 첫 번째 탭 내용이 표시된다
    - Modal: 다이얼로그 내용이 페이지에 표시된다
```

#### 시나리오 2 — 컴포넌트별 독립 CSS/JS 로드 확인

```
목적: 컴포넌트 독립성 요구사항(R-03) 검증

절차:
  1. 각 pages/*.html 파일을 브라우저 개발자 도구로 열기
  2. Network 탭에서 로드된 CSS/JS 파일 목록 확인

확인 항목:
  [ ] pages/button.html: modal.css, accordion.css 등이 로드되지 않는다
  [ ] pages/accordion.html: button.css, tabs.css 등이 로드되지 않는다
  [ ] 모든 페이지에서 tokens.css, reset.css, common.css는 로드된다
  [ ] 각 페이지에서 해당 컴포넌트 CSS만 추가로 로드된다
  [ ] 정적 컴포넌트 페이지에는 불필요한 JS 파일이 로드되지 않는다
```

#### 시나리오 3 — 동적 HTML 추가 후 public init() 호출 확인

```
목적: 공개 초기화 API 요구사항(R-04) 검증

절차:
  1. 브라우저 콘솔에서 동적으로 컴포넌트 HTML 추가
  2. public init() 호출
  3. 인터랙션 동작 확인

예시 (Accordion):
  // 1. 동적으로 Accordion HTML 추가
  const newAccordion = document.createElement('div');
  newAccordion.setAttribute('data-component', 'accordion');
  newAccordion.innerHTML = `
    <button data-accordion-trigger>항목 1</button>
    <div data-accordion-panel>내용 1</div>
  `;
  document.body.appendChild(newAccordion);

  // 2. public init() 호출
  Accordion.init(document.body);

  // 3. 확인
  // 새로 추가된 Accordion이 정상 동작하는가?

확인 항목:
  [ ] Accordion.init() — 새로 추가된 요소가 초기화된다
  [ ] Tabs.init() — 새로 추가된 탭 그룹이 동작한다
  [ ] Dropdown.init() — 새로 추가된 드롭다운이 열리고 닫힌다
  [ ] init() 중복 호출 시 이미 초기화된 요소가 재초기화되지 않는다
```

#### 시나리오 4 — ARIA 속성 및 접근성 검증

```
목적: KWCAG 2.2 준수 및 접근성 요구사항 검증

도구: Playwright, axe-core, NVDA + Chrome

확인 항목:
  [ ] 모든 pages/*.html에서 Lighthouse Accessibility 95점 이상
  [ ] 건너뛰기 링크 동작 (Tab 키 진입 시 표시)
  [ ] 사이드바 현재 페이지 링크에 aria-current="page" 적용
  [ ] 인터랙션 컴포넌트 ARIA 패턴 준수:
    - Accordion: aria-expanded, aria-controls, aria-labelledby
    - Tabs: role="tablist", role="tab", role="tabpanel", aria-selected
    - Modal: role="dialog", aria-modal, aria-labelledby, 포커스 트랩
    - Dropdown: role="menu", role="menuitem", aria-haspopup, aria-expanded
  [ ] 모든 아이콘 aria-hidden="true" 또는 의미 있는 aria-label
  [ ] 색상 대비 기준 충족 (라이트/다크 모두)
```

#### 시나리오 5 — 테마 전환 기능 검증

```
목적: 다크/라이트 모드가 정적 멀티 페이지에서도 동작하는지 확인

확인 항목:
  [ ] 각 pages/*.html에서 테마 토글 버튼 동작
  [ ] 테마 변경 시 data-theme 속성 변경
  [ ] localStorage에 테마 저장 (페이지 이동 후에도 유지)
  [ ] 다른 pages/*.html로 이동 후 이전에 선택한 테마 유지
  [ ] FOUC(깜박임) 없이 페이지 로드 시 저장된 테마 즉시 적용
```

---

### 7.2 Playwright 자동화 테스트

각 `pages/*.html`에 대해 아래 테스트를 Playwright로 자동화합니다.

```javascript
// tests/scenarios/static-pages.test.js (예시 구조)

// 1. 모든 정적 페이지 로드 테스트
test.describe('정적 HTML 페이지 로드', () => {
  const pages = ['button', 'input', 'checkbox', /* ... */];
  pages.forEach(name => {
    test(`pages/${name}.html 로드`, async ({ page }) => {
      await page.goto(`pages/${name}.html`);
      await expect(page.locator('.detail-page')).toBeVisible();
      await expect(page.locator('.detail-sidebar')).toBeVisible();
    });
  });
});

// 2. JS 비활성화 테스트
test('JS 비활성화 시 페이지 표시', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('pages/button.html');
  await expect(page.locator('[data-variant="primary"]')).toBeVisible();
});

// 3. 공개 초기화 API 테스트
test('Accordion.init() 외부 호출', async ({ page }) => {
  await page.goto('pages/accordion.html');
  await page.evaluate(() => {
    const el = document.createElement('div');
    el.setAttribute('data-component', 'accordion');
    el.innerHTML = '<button data-accordion-trigger>동적</button><div data-accordion-panel>내용</div>';
    document.body.appendChild(el);
    Accordion.init(document.body);
  });
  await page.click('[data-accordion-trigger]:last-of-type');
  await expect(page.locator('[data-accordion-panel]:last-of-type')).toBeVisible();
});
```

---

## 8. 예상 일정 및 마일스톤

### 8.1 전체 일정 개요

| 단계 | 내용 | 예상 소요 |
|------|------|---------|
| 단계 1 | 인프라 구축 (common.css, common.js, 디렉토리) | 1.0일 |
| 단계 2 | 완전 구현 컴포넌트 마이그레이션 (Button, Badge) | 0.5일 |
| 단계 3-A | 정적 컴포넌트 구현 (6개: Input, Checkbox, Radio, Switch, Textarea, Select) | 1.5일 |
| 단계 3-B | CSS 강화 컴포넌트 구현 (3개: Card, Skeleton, Alert) | 0.5일 |
| 단계 3-C | JS 인터랙션 컴포넌트 구현 (7개: Accordion, Tabs, Dropdown, Tooltip, Progress, Modal, Toast) | 2.5일 |
| 단계 4 | 레거시 코드 정리 및 최종 검증 | 1.0일 |
| **합계** | | **7.0일** |

### 8.2 마일스톤

#### M1 — 인프라 완료 (단계 1 완료)

```
완료 기준:
  [ ] assets/css/common.css 생성 완료 (기존 4개 CSS 통합)
  [ ] assets/js/common.js 생성 완료 (테마, 사이드바, CodeBlock, Lucide)
  [ ] assets/js/components/ 디렉토리 생성
  [ ] pages/ 디렉토리 생성
  [ ] index.html 정적 변환 완료 (대시보드 HTML 정적 마크업)
  [ ] code-block.js public init() API 완성
```

#### M2 — 첫 번째 완전 마이그레이션 완료 (단계 2 완료)

```
완료 기준:
  [ ] pages/button.html — 정적 HTML, JS 없이 표시 확인
  [ ] pages/badge.html — 정적 HTML, JS 없이 표시 확인
  [ ] 마이그레이션 패턴 문서화 (다른 컴포넌트 적용 가이드)
  [ ] 테마 전환 기능 동작 확인
  [ ] Playwright 기본 테스트 통과
```

#### M3 — 정적 컴포넌트 전체 완료 (단계 3-A, 3-B 완료)

```
완료 기준:
  [ ] 8개 정적 컴포넌트 pages/*.html 완성
  [ ] Card, Skeleton, Alert pages/*.html 완성
  [ ] 모든 페이지에서 JS 비활성화 시 표시 확인
  [ ] 컴포넌트별 독립 CSS 로드 확인
```

#### M4 — 인터랙션 컴포넌트 전체 완료 (단계 3-C 완료)

```
완료 기준:
  [ ] 7개 인터랙션 컴포넌트 pages/*.html 완성
  [ ] 각 컴포넌트 assets/js/components/*.js public init() API 완성
  [ ] 동적 초기화 시나리오 검증 통과
  [ ] ARIA 접근성 검증 통과
```

#### M5 — 최종 완료 (단계 4 완료)

```
완료 기준:
  [ ] 레거시 SPA 코드(App.js, Router.js, demos/*.js, pages/DetailPage.js) 제거 완료
  [ ] 통합된 CSS 파일 정리 완료
  [ ] 전체 Playwright 자동화 테스트 통과
  [ ] Lighthouse Accessibility 95점 이상 (모든 pages/*.html)
  [ ] 5가지 검증 시나리오 전체 통과
```

---

## 9. 성공 기준

### 9.1 필수 성공 기준 (Must Have)

| ID | 기준 | 측정 방법 |
|----|------|---------|
| S-01 | JS 비활성화 시 모든 `pages/*.html`에서 HTML+CSS 표시 | 브라우저 JS 비활성화 후 수동 확인 |
| S-02 | 각 페이지에서 해당 컴포넌트 CSS만 로드 | Network 탭 파일 목록 확인 |
| S-03 | 모든 인터랙션 컴포넌트에 `public static init()` 존재 | 코드 리뷰 + 콘솔 호출 확인 |
| S-04 | 동적 HTML 추가 후 `init()` 호출 시 정상 동작 | Playwright 자동화 테스트 |
| S-05 | 테마 전환이 모든 정적 페이지에서 동작 | 각 pages/*.html에서 수동 확인 |
| S-06 | Lighthouse Accessibility 95점 이상 (모든 페이지) | Lighthouse CI 실행 |
| S-07 | `pages/*.html`에 JS 템플릿 리터럴 HTML 생성 코드 없음 | 코드 리뷰 |

### 9.2 권장 성공 기준 (Nice to Have)

| ID | 기준 | 측정 방법 |
|----|------|---------|
| S-08 | 레거시 SPA 코드 완전 제거 | 파일 존재 여부 확인 |
| S-09 | `tokens.css` + `components/xxx.css`만으로 컴포넌트 스타일 완성 (Level 2 CSS 독립성 유지) | 독립 HTML 파일 테스트 |
| S-10 | KWCAG 2.2 스크린리더 동작 확인 (NVDA + Chrome) | 수동 테스트 |
| S-11 | 모든 Playwright 자동화 테스트 통과 | CI/CD 파이프라인 |

---

## 10. 의존성 및 전제조건

### 10.1 기존 코드 의존성

이 리팩토링 작업은 현재 `docs/PRD.md`에 정의된 기술 요구사항을 그대로 계승합니다:

- 순수 HTML5 + CSS3 + JavaScript ES6+ (프레임워크 없음)
- Lucide Icons CDN 유일한 예외 허용
- KWCAG 2.2 접근성 준수
- 다크/라이트 모드 (localStorage 저장)
- 컴포넌트 독립성 Level 2 유지

### 10.2 새로운 제약사항

- 각 `pages/*.html`은 서버 없이 파일 시스템에서 직접 열 수 있어야 합니다 (`file://` 프로토콜 지원)
  - ES6 모듈(`type="module"`)을 JS 파일에 사용할 경우 HTTP 서버 필요 → `common.js`는 일반 스크립트로 작성
  - `assets/js/components/*.js`는 전역 변수 방식 또는 IIFE 패턴 사용
- 사이드바의 상대 경로는 `pages/` 하위에서의 경로를 기준으로 합니다 (`../index.html`, `./accordion.html`)

---

## 11. 변경 이력

| 버전 | 날짜 | 내용 |
|------|------|------|
| v1.0 | 2026-04-21 | 최초 작성 — SPA → 정적 멀티 페이지 아키텍처 리팩토링 PRD |

---

*PRD 작성: 2026-04-21 | 기반 PRD: docs/PRD.md v1.2 | 기반 ROADMAP: docs/ROADMAP.md v1.2*
