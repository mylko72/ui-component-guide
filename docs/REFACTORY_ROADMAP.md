# Web UI Component Guide — 리팩토링 로드맵

> **문서 정보**
> - 버전: v1.0 (Phase 1 완료)
> - 작성일: 2026-04-21
> - 최종 업데이트: 2026-04-22
> - 기반 PRD: `docs/Refactory_PRD.md` v1.0
> - 기반 ROADMAP: `docs/ROADMAP.md` v1.2
> - 진행 상황: Phase 1 완료 (4/4 Tasks) ✅ → Phase 2 준비

---

## 프로젝트 개요

### 목표

현재 SPA(Single Page Application) 구조를 **정적 HTML 우선(Static HTML First)** + **점진적 향상(Progressive Enhancement)** 아키텍처로 전환합니다.

### 핵심 문제

| 문제 | 영향 | 심각도 |
|------|------|--------|
| HTML이 JS 템플릿 문자열로 생성 | 비기술 작업자가 마크업 수정 불가 | 높음 |
| JS 비활성화 시 빈 화면 표시 | Progressive Enhancement 위반 | 높음 |
| 모든 CSS를 `index.html`에서 전역 로드 | 불필요한 의존성, 페이지별 최적화 불가 | 중간 |
| 초기화 메서드가 모두 private (`_xxx`) | 외부에서 컴포넌트 재초기화 불가 | 중간 |

### 예상 결과

```
[현재]                          [목표]
index.html (단일)        →      index.html + pages/*.html (18개)
JS 템플릿 문자열         →      정적 HTML 마크업
Hash Router (SPA)        →      직접 파일 참조
전역 CSS 로드            →      페이지별 필요 CSS만 로드
private init()           →      public static init()
JS 없으면 빈 화면        →      JS 없어도 HTML+CSS 표시
```

### 목표 파일 구조

```
ui-component-guide/
├── index.html                      # 대시보드 (정적 HTML로 전환)
├── pages/                          # 컴포넌트 상세 페이지 (18개 HTML)
│   ├── button.html, badge.html     # 완성 컴포넌트 마이그레이션
│   ├── input.html, checkbox.html   # 정적 컴포넌트 (6개 신규)
│   └── accordion.html, tabs.html   # 인터랙션 컴포넌트 (7개 신규)
├── assets/
│   ├── css/
│   │   ├── tokens.css              # 변경 없음
│   │   ├── reset.css               # 변경 없음
│   │   ├── common.css              # [신규] 공통 레이아웃 통합
│   │   └── components/*.css        # 변경 없음
│   └── js/
│       ├── common.js               # [신규] 공통 유틸리티
│       └── components/             # [신규] 컴포넌트별 독립 JS
│           ├── accordion.js, tabs.js, modal.js
│           ├── dropdown.js, toast.js, alert.js
│           ├── tooltip.js, select.js, progress.js
│           └── code-block.js
```

### 현재 구현 상태

| 상태 | 컴포넌트 | 비고 |
|------|---------|------|
| 완전 구현 (2개) | Button, Badge | `_renderDemos()` 완전 구현됨 |
| Stub (16개) | Input, Checkbox, Radio, Switch, Select, Textarea, Card, Accordion, Tabs, Modal, Dropdown, Toast, Alert, Tooltip, Progress, Skeleton | 빈 껍데기만 존재 |

---

## 개발 워크플로우

1. **작업 계획**: 이 로드맵을 기준으로 Phase 순서대로 진행
2. **작업 생성**: `/tasks` 디렉토리에 세부 작업 파일 생성 (`XXX-description.md`)
3. **작업 구현**: 각 Task의 완료 기준(Acceptance Criteria)을 기준으로 구현
4. **로드맵 업데이트**: 완료 시 해당 항목 `✅` 표시

---

## Phase 1: 인프라 구축 ✅

> **왜 먼저 하는가**: 모든 정적 HTML 페이지가 공유하는 공통 레이아웃 CSS와 유틸리티 JS가 없으면 이후 어떤 컴포넌트 페이지도 만들 수 없습니다. 인프라가 확정되어야 각 컴포넌트 페이지가 일관된 구조를 가질 수 있습니다.

### Task 1-01: `assets/css/common.css` 생성 ✅

**[R-02, R-03]**

**설명**

기존에 `index.html`에서 개별 로드하던 레이아웃 관련 CSS 4개 파일을 하나의 `common.css`로 통합합니다. 이 파일은 모든 `pages/*.html`이 공통으로 로드하는 유일한 레이아웃 파일입니다.

**통합 대상**

- `assets/css/layout.css` — 헤더, 메인 컨테이너
- `assets/css/code-block.css` — CodeBlock 스타일
- `assets/css/pages/dashboard.css` — 대시보드 전용 레이아웃
- `assets/css/pages/detail.css` — 상세 페이지 2단 레이아웃

**포함할 CSS 클래스 목록**

```css
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

**관련 파일**

- `TO_CREATE`: `assets/css/common.css`
- `TO_MODIFY`: 기존 4개 파일에 `/* DEPRECATED: common.css로 통합됨 */` 주석 추가
- `REFERENCE`: `assets/css/layout.css`, `assets/css/code-block.css`, `assets/css/pages/dashboard.css`, `assets/css/pages/detail.css`

**의존성**: 없음

**완료 기준 (Acceptance Criteria)**

- [x] `assets/css/common.css` 파일이 생성된다
- [x] 헤더, 사이드바, 상세 페이지 2단 레이아웃, CodeBlock, 건너뛰기 링크 스타일이 포함된다
- [x] 기존 4개 CSS 파일에 DEPRECATED 주석이 추가된다
- [x] `common.css`만으로 상세 페이지 레이아웃이 정상 표시된다 (브라우저 확인)

---

### Task 1-02: `assets/js/common.js` 생성 ✅

**[R-02, R-04]**

**설명**

모든 `pages/*.html`에서 공통으로 필요한 JavaScript 기능을 하나의 일반 스크립트(`type` 속성 없음)로 제공합니다. `file://` 프로토콜에서 직접 열 수 있도록 ES6 모듈이 아닌 일반 스크립트로 작성합니다.

**포함할 함수**

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

// 현재 페이지 URL 기준으로 사이드바 활성 링크 설정
function initSidebarNav() {
  const currentPath = window.location.pathname;
  const links = document.querySelectorAll('.nav-link');
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    if (currentPath.endsWith(href.replace('../pages/', ''))) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
}

// 페이지 내 모든 [data-code-block] 요소를 CodeBlock으로 초기화
function initCodeBlocks() {
  if (typeof CodeBlock === 'undefined') return;
  document.querySelectorAll('[data-code-block]').forEach(el => {
    CodeBlock.init(el);
  });
}

// Lucide 아이콘 렌더링
function initIcons() {
  if (window.lucide) window.lucide.createIcons();
}

// 진입점
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initSidebarNav();
  initCodeBlocks();
  initIcons();
});
```

**관련 파일**

- `TO_CREATE`: `assets/js/common.js`
- `REFERENCE`: `assets/js/core/ThemeManager.js`, `assets/js/ui/CodeBlock.js`

**의존성**: Task 1-01 (공통 CSS가 있어야 레이아웃 테스트 가능)

**완료 기준 (Acceptance Criteria)**

- [x] `assets/js/common.js` 파일이 생성된다
- [x] `initTheme()`, `initSidebarNav()`, `initCodeBlocks()`, `initIcons()` 함수가 포함된다
- [x] `DOMContentLoaded` 이벤트에서 위 4개 함수가 순서대로 호출된다
- [x] ES6 모듈 문법(`import`/`export`) 없이 일반 스크립트로 작성된다 (`file://` 프로토콜 호환)
- [x] 테마 토글 버튼 클릭 시 `data-theme` 속성이 변경되고 `localStorage`에 저장된다

---

### Task 1-03: `assets/js/components/` 디렉토리 및 `code-block.js` 생성 ✅

**[R-03, R-04]**

**설명**

컴포넌트별 독립 JS를 담을 디렉토리를 생성하고, 모든 페이지에서 필요한 `CodeBlock` public init() API를 먼저 구현합니다. 이 파일은 정적 컴포넌트 페이지(Button, Badge 등)에서도 코드 예시 탭 기능을 제공하는 데 사용됩니다.

**public init() 패턴**

```javascript
/**
 * CodeBlock 컴포넌트
 * - HTML/CSS/JS 탭 전환, 확장/축소, 클립보드 복사
 */
class CodeBlock {
  constructor(element) {
    this.el = element;
    this._initialized = false;
  }

  /**
   * public static init — 외부 호출 진입점
   * @param {HTMLElement|Document} container - 탐색 범위 (기본: document)
   */
  static init(container = document) {
    container.querySelectorAll('[data-code-block]').forEach(el => {
      if (el.dataset.initialized) return; // 중복 초기화 방지
      el.dataset.initialized = 'true';
      new CodeBlock(el)._setup();
    });
  }

  _setup() {
    // 탭 전환, 확장/축소, 클립보드 복사 이벤트 등록
  }
}

// 페이지 로드 시 자동 초기화
document.addEventListener('DOMContentLoaded', () => CodeBlock.init());
```

**관련 파일**

- `TO_CREATE`: `assets/js/components/` 디렉토리
- `TO_CREATE`: `assets/js/components/code-block.js`
- `REFERENCE`: `assets/js/ui/CodeBlock.js` (기존 ES6 모듈 버전 참조)

**의존성**: Task 1-01, Task 1-02

**완료 기준 (Acceptance Criteria)**

- [x] `assets/js/components/` 디렉토리가 생성된다
- [x] `assets/js/components/code-block.js`에 `CodeBlock.init(container?)` public API가 구현된다
- [x] `data-initialized` 속성으로 중복 초기화가 방지된다
- [x] 일반 스크립트로 작성되어 `file://` 프로토콜에서 동작한다
- [x] `<script src="../assets/js/components/code-block.js">` 로드 후 콘솔에서 `CodeBlock.init()` 호출이 가능하다

---

### Task 1-04: `pages/` 디렉토리 및 `index.html` 정적 변환 ✅

**[R-01, R-02]**

**설명**

정적 HTML 페이지를 담을 `pages/` 디렉토리를 생성하고, 현재 SPA 셸(`index.html`)을 완전한 정적 대시보드 HTML로 전환합니다. SPA의 `DashboardPage.js`가 동적으로 생성하던 카드 그리드를 정적 HTML로 직접 작성합니다.

**정적 HTML 페이지 표준 구조**

```html
<!DOCTYPE html>
<html lang="ko" data-theme="light">
<head>
  <!-- FOUC 방지: 반드시 최상단에 위치 -->
  <script>
    const t = localStorage.getItem('uig-theme');
    const s = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', t || s);
  </script>

  <meta charset="UTF-8">
  <title>[컴포넌트명] | Web UI Component Guide</title>

  <!-- 공통 스타일 (순서 고정) -->
  <link rel="stylesheet" href="../assets/css/tokens.css">
  <link rel="stylesheet" href="../assets/css/reset.css">
  <link rel="stylesheet" href="../assets/css/common.css">

  <!-- 페이지 전용 컴포넌트 CSS -->
  <link rel="stylesheet" href="../assets/css/components/[컴포넌트명].css">
</head>
<body>

  <a href="#main" class="skip-nav">본문으로 이동</a>

  <header class="header">
    <!-- 정적 헤더 마크업 -->
  </header>

  <div class="detail-page">
    <aside class="detail-sidebar">
      <!-- 정적 사이드바 네비게이션 -->
      <!-- 상대 경로 기준: pages/ 하위 → ../index.html, ./accordion.html -->
    </aside>
    <main id="main" class="detail-main">
      <!-- 컴포넌트 데모 HTML -->
    </main>
  </div>

  <!-- Lucide Icons CDN -->
  <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>
  <!-- 공통 유틸리티 -->
  <script src="../assets/js/common.js"></script>
  <!-- 인터랙션 컴포넌트만 해당 JS 로드 -->
  <!-- <script src="../assets/js/components/accordion.js"></script> -->
</body>
</html>
```

**관련 파일**

- `TO_CREATE`: `pages/` 디렉토리
- `TO_MODIFY`: `index.html` (SPA 셸 → 정적 대시보드 HTML)
- `REFERENCE`: `assets/js/pages/DashboardPage.js` (카드 그리드 마크업 추출)

**의존성**: Task 1-01, Task 1-02

**완료 기준 (Acceptance Criteria)**

- [x] `pages/` 디렉토리가 생성된다
- [x] `index.html`이 JS 없이도 카드 그리드 레이아웃이 표시된다
- [x] `index.html`에 18개 구현 컴포넌트 카드 링크(`pages/button.html` 등)가 포함된다
- [x] 테마 토글 버튼이 동작한다
- [x] FOUC(깜박임) 없이 저장된 테마가 즉시 적용된다

---

### M1 마일스톤 체크리스트 — 인프라 완료 ✅

```
[x] assets/css/common.css 생성 완료 (기존 4개 CSS 통합)
[x] assets/js/common.js 생성 완료 (테마, 사이드바, CodeBlock, Lucide)
[x] assets/js/components/ 디렉토리 생성 완료
[x] assets/js/components/code-block.js public init() API 완성
[x] pages/ 디렉토리 생성 완료
[x] index.html 정적 변환 완료 (JS 비활성화 시 카드 그리드 표시)
```

---

## Phase 2: 완전 구현 컴포넌트 마이그레이션

> **왜 이 순서인가**: 이미 완전히 구현된 Button, Badge는 마이그레이션 패턴을 확립하기에 가장 적합합니다. `_renderDemos()`의 HTML을 그대로 추출하여 정적 파일로 만들 수 있어 위험도가 낮습니다. 이 단계에서 확립한 패턴이 Phase 3 전체에 적용됩니다.

### Task 2-01: `pages/button.html` 생성

**[R-01, R-02, R-03]**

**설명**

`ButtonDemo.js`의 `_renderDemos()` 메서드가 동적으로 생성하던 HTML을 추출하여 정적 `pages/button.html`로 작성합니다. Button은 정적 컴포넌트이므로 별도 JS 파일이 필요 없습니다.

**마이그레이션 패턴**

```
[현재] assets/js/demos/ButtonDemo.js
  → _renderPrimarySection(), _renderSecondarySection() 등이 HTML 반환
  → DetailPage.render()가 레이아웃 포함 전체 HTML 반환

[변환 후] pages/button.html
  → 위 메서드들이 반환하는 HTML을 직접 정적으로 작성
  → assets/js/components/button.js 없음 (정적 컴포넌트)
  → CodeBlock 기능은 code-block.js로 제공
```

**포함할 데모 섹션**

- Primary (sm/md/lg)
- Secondary (sm/md/lg)
- Outline (sm/md/lg)
- Ghost (sm/md/lg)
- Danger (sm/md/lg)
- Icon 전용 + 아이콘+텍스트 조합
- Loading (sm/md/lg + 변형별)
- Disabled (sm/md/lg + 변형별)

**로드할 파일**

```html
<link rel="stylesheet" href="../assets/css/tokens.css">
<link rel="stylesheet" href="../assets/css/reset.css">
<link rel="stylesheet" href="../assets/css/common.css">
<link rel="stylesheet" href="../assets/css/components/button.css">
<!-- JS: common.js + code-block.js만 로드 (button.js 없음) -->
<script src="../assets/js/common.js"></script>
<script src="../assets/js/components/code-block.js"></script>
```

**관련 파일**

- `TO_CREATE`: `pages/button.html`
- `REFERENCE`: `assets/js/demos/ButtonDemo.js`, `assets/css/components/button.css`
- `TO_MODIFY` (나중에): `assets/js/demos/ButtonDemo.js`에 DEPRECATED 주석 추가

**의존성**: Phase 1 전체 완료 (M1)

**완료 기준 (Acceptance Criteria)**

- [ ] `pages/button.html`이 생성된다
- [ ] 브라우저에서 JS를 비활성화해도 8개 섹션의 HTML+CSS가 표시된다
- [ ] Network 탭에서 `modal.css`, `accordion.css` 등이 로드되지 않는다 (button.css만 로드)
- [ ] CodeBlock의 HTML/CSS/JS 탭 전환이 동작한다
- [ ] 테마 토글이 동작하고 페이지 재진입 시 테마가 유지된다

---

### Task 2-02: `pages/badge.html` 생성

**[R-01, R-02, R-03]**

**설명**

`BadgeDemo.js`의 데모 HTML을 정적 `pages/badge.html`로 변환합니다. Badge도 정적 컴포넌트이므로 JS 파일 없이 CSS만으로 동작합니다.

**포함할 데모 섹션**

- 색상 6종 (Neutral, Primary, Success, Warning, Error, Info)
- Outlined 변형
- Dot 인디케이터
- Sizes (sm/md/lg)

**관련 파일**

- `TO_CREATE`: `pages/badge.html`
- `REFERENCE`: `assets/js/demos/BadgeDemo.js`, `assets/css/components/badge.css`

**의존성**: Task 2-01 (button.html의 패턴 확립 후)

**완료 기준 (Acceptance Criteria)**

- [ ] `pages/badge.html`이 생성된다
- [ ] JS 비활성화 시 모든 Badge 변형이 표시된다
- [ ] badge.css만 컴포넌트 CSS로 로드된다
- [ ] 사이드바 네비게이션에서 Badge 항목이 활성 상태로 표시된다

---

### M2 마일스톤 체크리스트 — 첫 번째 완전 마이그레이션 완료

```
[ ] pages/button.html — 정적 HTML, JS 없이 8개 섹션 표시 확인
[ ] pages/badge.html — 정적 HTML, JS 없이 전체 변형 표시 확인
[ ] 마이그레이션 패턴 확립 (Phase 3 적용 준비)
[ ] 테마 전환 동작 확인 (button.html, badge.html 모두)
[ ] 사이드바 active 링크 동작 확인
```

---

## Phase 3-A: 정적 컴포넌트 신규 구현

> **왜 이 순서인가**: JS가 전혀 필요 없는 정적 컴포넌트(Input, Checkbox, Radio, Switch, Textarea, Select 기본)를 먼저 구현합니다. 새로운 인프라(common.css, common.js)만으로 완성할 수 있어 위험도가 낮고, 패턴을 반복 적용하면서 속도를 높일 수 있습니다.

**각 컴포넌트 공통 작업 패턴**

```
1. pages/[컴포넌트명].html 생성
   - 완전한 정적 HTML 마크업 작성
   - 공통 레이아웃 (헤더, 사이드바) 포함
   - 해당 컴포넌트 CSS만 로드

2. 기존 assets/js/demos/[컴포넌트명]Demo.js에 DEPRECATED 주석 추가
   // DEPRECATED: pages/[컴포넌트명].html 로 대체됨

3. 검증
   - JS 비활성화 → HTML+CSS 정상 표시 확인
   - Network 탭 → 해당 CSS만 로드 확인
```

---

### Task 3A-01: `pages/input.html` 생성

**[R-01, R-02, R-03]**

**포함할 데모 섹션**

- Default
- 레이블 + 도움말
- Error 상태 (`aria-invalid`, `aria-describedby`)
- Leading Icon / Trailing Icon
- 비밀번호 토글 (JS 없을 때: 일반 텍스트 input으로 표시)
- Disabled

**관련 파일**

- `TO_CREATE`: `pages/input.html`
- `REFERENCE`: `assets/js/demos/InputDemo.js`, `assets/css/components/input.css`

**완료 기준 (Acceptance Criteria)**

- [ ] `pages/input.html`이 생성된다
- [ ] JS 비활성화 시 모든 Input 변형이 표시된다
- [ ] `aria-invalid`, `aria-describedby` 속성이 정적으로 작성되어 있다
- [ ] input.css만 컴포넌트 CSS로 로드된다

---

### Task 3A-02: `pages/checkbox.html` 생성

**[R-01, R-02, R-03]**

**포함할 데모 섹션**

- Default (단일 체크박스)
- Group (복수 체크박스)
- Indeterminate 시각 표현 (CSS로 스타일링, JS 없이 정적 표시)
- Disabled

**WCAG 준수 마크업 패턴**

```html
<!-- :checked CSS pseudo-class 활용 — JS 없이 동작 -->
<input type="checkbox" id="chk-1" class="checkbox">
<label for="chk-1">체크박스 레이블</label>
```

**관련 파일**

- `TO_CREATE`: `pages/checkbox.html`
- `REFERENCE`: `assets/js/demos/CheckboxDemo.js`, `assets/css/components/checkbox.css`

**완료 기준 (Acceptance Criteria)**

- [ ] `pages/checkbox.html`이 생성된다
- [ ] JS 없이 체크박스 체크/언체크가 `:checked` CSS로 스타일링된다
- [ ] Indeterminate 상태가 정적으로 시각 표현된다
- [ ] checkbox.css만 컴포넌트 CSS로 로드된다

---

### Task 3A-03: `pages/radio.html` 생성

**[R-01, R-02, R-03]**

**포함할 데모 섹션**

- Default
- Group (라디오 그룹 — 단일 선택)
- 세로 배치
- Disabled

**WCAG 준수 마크업 패턴**

```html
<!-- role="radiogroup" + :checked CSS pseudo-class 활용 -->
<fieldset>
  <legend>그룹명</legend>
  <input type="radio" id="radio-1" name="group-1" class="radio">
  <label for="radio-1">옵션 1</label>
</fieldset>
```

**관련 파일**

- `TO_CREATE`: `pages/radio.html`
- `REFERENCE`: `assets/js/demos/RadioDemo.js`, `assets/css/components/radio.css`

**완료 기준 (Acceptance Criteria)**

- [ ] `pages/radio.html`이 생성된다
- [ ] JS 없이 라디오 선택이 `:checked` CSS로 스타일링된다
- [ ] `<fieldset>`/`<legend>` 패턴으로 그룹 접근성이 보장된다
- [ ] radio.css만 컴포넌트 CSS로 로드된다

---

### Task 3A-04: `pages/switch.html` 생성

**[R-01, R-02, R-03]**

**포함할 데모 섹션**

- Default
- 레이블 포함 (좌/우)
- sm / lg 크기
- Disabled

**CSS-only 토글 패턴**

```html
<!-- checkbox + label 패턴으로 CSS-only 구현 -->
<input type="checkbox" id="switch-1" class="switch-input" role="switch" aria-checked="false">
<label for="switch-1" class="switch-label">Switch 레이블</label>
```

**관련 파일**

- `TO_CREATE`: `pages/switch.html`
- `REFERENCE`: `assets/js/demos/SwitchDemo.js`, `assets/css/components/switch.css`

**완료 기준 (Acceptance Criteria)**

- [ ] `pages/switch.html`이 생성된다
- [ ] JS 없이 토글 시각 전환이 CSS `:checked`로 동작한다
- [ ] `role="switch"` 속성이 정적으로 작성되어 있다
- [ ] switch.css만 컴포넌트 CSS로 로드된다

---

### Task 3A-05: `pages/textarea.html` 생성

**[R-01, R-02, R-03]**

**포함할 데모 섹션**

- Default
- 자동 높이 (JS 없을 때: 고정 높이로 표시)
- 글자수 카운터 (JS 없을 때: 정적 최대 글자수만 표시)
- Disabled

**관련 파일**

- `TO_CREATE`: `pages/textarea.html`
- `REFERENCE`: `assets/js/demos/TextareaDemo.js`, `assets/css/components/textarea.css`

**완료 기준 (Acceptance Criteria)**

- [ ] `pages/textarea.html`이 생성된다
- [ ] JS 없이 기본 Textarea가 표시된다
- [ ] `aria-describedby`로 글자수 힌트가 연결되어 있다
- [ ] textarea.css만 컴포넌트 CSS로 로드된다

---

### Task 3A-06: `pages/select.html` 생성

**[R-01, R-02, R-03]**

**설명**

Select 컴포넌트는 네이티브 `<select>`를 기본으로 표시하고, `assets/js/components/select.js` 로드 시 커스텀 드롭다운으로 점진적 강화합니다.

**포함할 데모 섹션**

- 네이티브 Select 기본 (JS 없이 완전 동작)
- 커스텀 드롭다운 (JS 로드 시 점진적 강화)
- 검색 포함 (JS 필요)
- Disabled

**관련 파일**

- `TO_CREATE`: `pages/select.html`
- `TO_CREATE`: `assets/js/components/select.js` (Task 3C에서 상세 구현, 이 Task에서는 stub)
- `REFERENCE`: `assets/js/demos/SelectDemo.js`, `assets/css/components/select.css`

**완료 기준 (Acceptance Criteria)**

- [ ] `pages/select.html`이 생성된다
- [ ] JS 없이 네이티브 `<select>` 요소가 표시된다
- [ ] select.css만 컴포넌트 CSS로 로드된다
- [ ] `select.js` stub 파일이 생성된다 (Phase 3-C에서 완성)

---

### M3 (일부) 마일스톤 체크리스트 — 정적 컴포넌트 완료

```
[ ] pages/input.html — JS 비활성화 시 표시 확인
[ ] pages/checkbox.html — JS 비활성화 시 표시 확인
[ ] pages/radio.html — JS 비활성화 시 표시 확인
[ ] pages/switch.html — JS 비활성화 시 표시 확인
[ ] pages/textarea.html — JS 비활성화 시 표시 확인
[ ] pages/select.html — 네이티브 select JS 비활성화 시 표시 확인
[ ] 모든 정적 컴포넌트 페이지에서 해당 CSS만 로드 확인
```

---

## Phase 3-B: CSS 강화 컴포넌트 구현

> **왜 이 순서인가**: Card, Skeleton, Alert은 JS 없이도 CSS 애니메이션이나 CSS 전용 구조로 대부분 표현 가능합니다. 정적 컴포넌트(3-A)보다는 복잡하지만, JS 인터랙션 컴포넌트(3-C)보다는 단순합니다. 중간 난이도 단계로 배치합니다.

### Task 3B-01: `pages/card.html` 생성

**[R-01, R-02, R-03]**

**포함할 데모 섹션**

- 기본 Card
- 헤더 + 푸터 포함
- 가로형 (이미지 + 텍스트)
- 인터랙티브 (호버 효과, CSS-only)

**관련 파일**

- `TO_CREATE`: `pages/card.html`
- `REFERENCE`: `assets/js/demos/CardDemo.js`, `assets/css/components/card.css`

**완료 기준 (Acceptance Criteria)**

- [ ] `pages/card.html`이 생성된다
- [ ] JS 없이 모든 Card 변형이 표시된다
- [ ] 인터랙티브 Card의 호버 효과가 CSS `:hover`로 동작한다
- [ ] card.css만 컴포넌트 CSS로 로드된다

---

### Task 3B-02: `pages/skeleton.html` 생성

**[R-01, R-02, R-03]**

**설명**

Skeleton은 CSS 애니메이션(`@keyframes`)만으로 완성됩니다. JS가 없어도 펄스 애니메이션이 동작합니다.

**포함할 데모 섹션**

- 텍스트 Skeleton
- 카드 Skeleton
- 테이블 행 Skeleton
- 아바타 Skeleton

**ARIA 마크업 패턴**

```html
<div class="skeleton" aria-busy="true" aria-label="로딩 중">
  <div class="skeleton__line"></div>
  <div class="skeleton__line skeleton__line--short"></div>
</div>
```

**관련 파일**

- `TO_CREATE`: `pages/skeleton.html`
- `REFERENCE`: `assets/js/demos/SkeletonDemo.js`, `assets/css/components/skeleton.css`

**완료 기준 (Acceptance Criteria)**

- [ ] `pages/skeleton.html`이 생성된다
- [ ] JS 없이 펄스 애니메이션이 CSS로 동작한다
- [ ] `aria-busy="true"`, `aria-label="로딩 중"` 속성이 정적으로 작성되어 있다
- [ ] skeleton.css만 컴포넌트 CSS로 로드된다

---

### Task 3B-03: `pages/alert.html` 생성

**[R-01, R-02, R-03]**

**설명**

Alert은 닫기 버튼 기능만 JS가 필요합니다. JS 없을 때는 닫기 버튼이 비활성 상태로 표시됩니다. JS 로드 시 `alert.js`가 닫기 기능을 점진적으로 강화합니다.

**포함할 데모 섹션**

- Info / Success / Warning / Error
- 닫기 버튼 포함 (JS 없을 때: 버튼 표시되나 닫히지 않음)
- 아이콘 + 제목 포함

**관련 파일**

- `TO_CREATE`: `pages/alert.html`
- `TO_CREATE`: `assets/js/components/alert.js` (닫기 버튼 동작)
- `REFERENCE`: `assets/js/demos/AlertDemo.js`, `assets/css/components/alert.css`

**완료 기준 (Acceptance Criteria)**

- [ ] `pages/alert.html`이 생성된다
- [ ] JS 없이 Alert 박스가 정적으로 표시된다
- [ ] `role="alert"` 속성이 정적으로 작성되어 있다
- [ ] `alert.js` 로드 시 닫기 버튼이 동작한다 (`Alert.init()` 호출)
- [ ] alert.css만 컴포넌트 CSS로 로드된다

---

### M3 마일스톤 체크리스트 — 정적 + CSS 강화 컴포넌트 전체 완료

```
[ ] Phase 3-A 완료 (8개 정적 컴포넌트 pages/*.html)
[ ] pages/card.html — JS 비활성화 시 모든 변형 표시 확인
[ ] pages/skeleton.html — CSS 펄스 애니메이션 동작 확인
[ ] pages/alert.html — 정적 Alert 표시, alert.js 닫기 버튼 동작 확인
[ ] 모든 페이지에서 컴포넌트별 독립 CSS 로드 확인 (Network 탭)
```

---

## Phase 3-C: JS 인터랙션 컴포넌트 구현

> **왜 이 순서인가**: JS 인터랙션이 필요한 컴포넌트는 각각 `pages/*.html` (정적 HTML 마크업)과 `assets/js/components/*.js` (public init() API) 두 파일을 동시에 만들어야 합니다. 인프라와 정적 컴포넌트 패턴이 확립된 후에야 JS 인터랙션 작업을 안전하게 진행할 수 있습니다. Accordion → Tabs → Dropdown → Tooltip → Progress → Modal → Toast 순서로 진행합니다(단순 → 복잡).

**인터랙션 컴포넌트 공통 패턴**

```
1. pages/[컴포넌트명].html 생성
   - JS 없을 때 초기 상태 정의:
     Accordion: 모든 패널이 펼쳐진 상태
     Tabs: 첫 번째 탭 내용만 표시
     Modal: <dialog> 요소가 페이지 내 표시
     Dropdown: 목록이 펼쳐진 상태

2. assets/js/components/[컴포넌트명].js 생성
   - Class 문법, public static init(container?) API
   - data-initialized 중복 초기화 방지
   - DOMContentLoaded 자동 초기화
   - 일반 스크립트 (file:// 호환)

3. pages/[컴포넌트명].html에 JS 로드 태그 추가
   <script src="../assets/js/components/[컴포넌트명].js"></script>
```

---

### Task 3C-01: `pages/accordion.html` + `accordion.js`

**[R-01, R-02, R-03, R-04]**

**JS 없을 때**: 모든 패널이 펼쳐진 상태로 표시

**public API 시그니처**

```javascript
class Accordion {
  static init(container = document) { ... }  // Accordion.init(container?)
}
```

**ARIA 마크업 패턴**

```html
<div data-component="accordion">
  <button data-accordion-trigger aria-expanded="true" aria-controls="panel-1">항목 1</button>
  <div id="panel-1" data-accordion-panel>내용 1</div>
</div>
```

**관련 파일**

- `TO_CREATE`: `pages/accordion.html`, `assets/js/components/accordion.js`
- `REFERENCE`: `assets/js/demos/AccordionDemo.js`, `assets/css/components/accordion.css`

**완료 기준 (Acceptance Criteria)**

- [ ] `pages/accordion.html`이 JS 없이 모든 패널이 펼쳐진 상태로 표시된다
- [ ] JS 로드 시 단일/다중 열림 모드가 동작한다
- [ ] `Accordion.init()` 외부 호출이 가능하다 (콘솔에서 확인)
- [ ] `data-initialized`로 중복 초기화가 방지된다
- [ ] `aria-expanded`, `aria-controls`, `aria-labelledby` 속성이 JS로 관리된다
- [ ] 키보드: Enter/Space 토글, Arrow Up/Down 항목 이동이 동작한다

---

### Task 3C-02: `pages/tabs.html` + `tabs.js`

**[R-01, R-02, R-03, R-04]**

**JS 없을 때**: 첫 번째 탭 내용만 CSS로 표시

**public API 시그니처**

```javascript
class Tabs {
  static init(container = document) { ... }  // Tabs.init(container?)
}
```

**관련 파일**

- `TO_CREATE`: `pages/tabs.html`, `assets/js/components/tabs.js`
- `REFERENCE`: `assets/js/demos/TabsDemo.js`, `assets/css/components/tabs.css`

**완료 기준 (Acceptance Criteria)**

- [ ] `pages/tabs.html`이 JS 없이 첫 번째 탭 내용이 표시된다
- [ ] JS 로드 시 탭 전환이 동작한다
- [ ] `role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected` 속성이 관리된다
- [ ] 키보드: Arrow Left/Right 탭 전환, Home/End가 동작한다
- [ ] `Tabs.init()` 외부 호출이 가능하다

---

### Task 3C-03: `pages/dropdown.html` + `dropdown.js`

**[R-01, R-02, R-03, R-04]**

**JS 없을 때**: 드롭다운 목록이 펼쳐진 상태로 표시

**public API 시그니처**

```javascript
class Dropdown {
  static init(container = document) { ... }  // Dropdown.init(container?)
}
```

**관련 파일**

- `TO_CREATE`: `pages/dropdown.html`, `assets/js/components/dropdown.js`
- `REFERENCE`: `assets/js/demos/DropdownDemo.js`, `assets/css/components/dropdown.css`

**완료 기준 (Acceptance Criteria)**

- [ ] `pages/dropdown.html`이 JS 없이 목록이 펼쳐진 상태로 표시된다
- [ ] JS 로드 시 열기/닫기, 외부 클릭 닫기가 동작한다
- [ ] `role="menu"`, `role="menuitem"`, `aria-haspopup`, `aria-expanded` 속성이 관리된다
- [ ] 키보드: Enter/Space 열기, Arrow Down/Up 이동, Esc 닫기가 동작한다
- [ ] `Dropdown.init()` 외부 호출이 가능하다

---

### Task 3C-04: `pages/tooltip.html` + `tooltip.js`

**[R-01, R-02, R-03, R-04]**

**JS 없을 때**: CSS `:hover`로 기본 Tooltip이 표시됨

**public API 시그니처**

```javascript
class Tooltip {
  static init(container = document) { ... }  // Tooltip.init(container?)
}
```

**관련 파일**

- `TO_CREATE`: `pages/tooltip.html`, `assets/js/components/tooltip.js`
- `REFERENCE`: `assets/js/demos/TooltipDemo.js`, `assets/css/components/tooltip.css`

**완료 기준 (Acceptance Criteria)**

- [ ] `pages/tooltip.html`이 JS 없이 CSS `:hover`로 Tooltip이 표시된다
- [ ] JS 로드 시 포커스 표시, 위치 계산이 추가된다
- [ ] `role="tooltip"`, `aria-describedby` 속성이 관리된다
- [ ] `Tooltip.init()` 외부 호출이 가능하다

---

### Task 3C-05: `pages/progress.html` + `progress.js`

**[R-01, R-02, R-03, R-04]**

**JS 없을 때**: 네이티브 `<progress>` 요소로 표시

**public API 시그니처**

```javascript
class Progress {
  static init(container = document) { ... }  // Progress.init(container?)
}
```

**관련 파일**

- `TO_CREATE`: `pages/progress.html`, `assets/js/components/progress.js`
- `REFERENCE`: `assets/js/demos/ProgressDemo.js`, `assets/css/components/progress.css`

**완료 기준 (Acceptance Criteria)**

- [ ] `pages/progress.html`이 JS 없이 네이티브 `<progress>` 요소가 표시된다
- [ ] JS 로드 시 커스텀 스타일 Progress 및 Indeterminate 애니메이션이 활성화된다
- [ ] `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax` 속성이 관리된다
- [ ] `Progress.init()` 외부 호출이 가능하다

---

### Task 3C-06: `pages/modal.html` + `modal.js`

**[R-01, R-02, R-03, R-04]**

**JS 없을 때**: `<dialog>` 요소의 내용이 페이지 내 정적으로 표시

**public API 시그니처**

```javascript
class Modal {
  static init(container = document) { ... }  // Modal.init(container?)
}
```

**완료 기준 (Acceptance Criteria)**

- [ ] `pages/modal.html`이 JS 없이 `<dialog>` 내용이 정적으로 표시된다
- [ ] JS 로드 시 열기/닫기, 포커스 트랩, Esc 닫기, body scroll lock이 동작한다
- [ ] `role="dialog"`, `aria-modal`, `aria-labelledby` 속성이 관리된다
- [ ] 닫힌 후 트리거 버튼으로 포커스가 복원된다
- [ ] `Modal.init()` 외부 호출이 가능하다

**관련 파일**

- `TO_CREATE`: `pages/modal.html`, `assets/js/components/modal.js`
- `REFERENCE`: `assets/js/demos/ModalDemo.js`, `assets/js/ui/ModalManager.js`, `assets/css/components/modal.css`

---

### Task 3C-07: `pages/toast.html` + `toast.js`

**[R-01, R-02, R-03, R-04]**

**JS 없을 때**: Toast 예시가 정적 카드 형태로 페이지에 표시

**public API 시그니처**

```javascript
class Toast {
  static show(options) { ... }      // Toast.show({ message, type, duration })
  static init(container = document) { ... }  // Toast.init(container?)
}
```

**완료 기준 (Acceptance Criteria)**

- [ ] `pages/toast.html`이 JS 없이 Toast 예시가 정적으로 표시된다
- [ ] JS 로드 시 `Toast.show()` 호출로 Toast가 생성/제거된다
- [ ] `aria-live="polite"` (Info/Success), `aria-live="assertive"` (Error) 속성이 적용된다
- [ ] 자동 닫힘 + 수동 닫기 버튼이 동작한다
- [ ] `Toast.show()` 외부 호출이 가능하다

**관련 파일**

- `TO_CREATE`: `pages/toast.html`, `assets/js/components/toast.js`
- `REFERENCE`: `assets/js/demos/ToastDemo.js`, `assets/js/ui/ToastManager.js`, `assets/css/components/toast.css`

---

### Task 3C-08: `select.js` 완성 (Task 3A-06 이어서)

**[R-04]**

**설명**

Task 3A-06에서 stub으로 생성한 `select.js`를 완성합니다. 네이티브 `<select>` 위에 커스텀 드롭다운 UI를 점진적으로 강화합니다.

**public API 시그니처**

```javascript
class Select {
  static init(container = document) { ... }  // Select.init(container?)
}
```

**완료 기준 (Acceptance Criteria)**

- [ ] JS 로드 시 네이티브 `<select>`가 커스텀 드롭다운으로 점진적 강화된다
- [ ] ARIA Combobox 패턴이 적용된다 (`role="combobox"`, `aria-expanded`, `aria-haspopup="listbox"`)
- [ ] 키보드: Enter/Space 열기, Arrow Down/Up 이동, Esc 닫기, Typeahead가 동작한다
- [ ] `Select.init()` 외부 호출이 가능하다

---

### M4 마일스톤 체크리스트 — 인터랙션 컴포넌트 전체 완료

```
[ ] pages/accordion.html + accordion.js — Accordion.init() 외부 호출 확인
[ ] pages/tabs.html + tabs.js — Tabs.init() 외부 호출 확인
[ ] pages/dropdown.html + dropdown.js — Dropdown.init() 외부 호출 확인
[ ] pages/tooltip.html + tooltip.js — Tooltip.init() 외부 호출 확인
[ ] pages/progress.html + progress.js — Progress.init() 외부 호출 확인
[ ] pages/modal.html + modal.js — Modal.init() 포커스 트랩 동작 확인
[ ] pages/toast.html + toast.js — Toast.show() 외부 호출 확인
[ ] select.js 완성 — Select.init() 커스텀 드롭다운 동작 확인
[ ] 모든 인터랙션 컴포넌트: JS 없이 초기 HTML 상태 표시 확인
[ ] 모든 인터랙션 컴포넌트: ARIA 접근성 검증 통과
```

---

## Phase 4: 레거시 정리 및 최종 검증

> **왜 마지막인가**: 레거시 SPA 코드(App.js, Router.js, demos/*.js 등)는 모든 `pages/*.html`이 완성된 후에야 안전하게 제거할 수 있습니다. 제거 전 모든 기능이 정적 페이지에서 동작함을 검증해야 합니다.

### Task 4-01: Playwright 자동화 테스트 실행 및 검증

**[S-01 ~ S-07 성공 기준 전체]**

**설명**

모든 `pages/*.html` 완성 후 Playwright로 5가지 검증 시나리오를 자동화하여 실행합니다.

**테스트 파일 위치**: `tests/scenarios/static-pages.test.js`

**TC-01: 정적 페이지 로드 테스트**

```javascript
// 18개 pages/*.html 모두 로드하여 기본 레이아웃 확인
test.describe('정적 HTML 페이지 로드', () => {
  const pages = [
    'button', 'badge', 'input', 'checkbox', 'radio',
    'switch', 'textarea', 'select', 'card', 'skeleton',
    'alert', 'accordion', 'tabs', 'dropdown', 'tooltip',
    'progress', 'modal', 'toast'
  ];
  pages.forEach(name => {
    test(`pages/${name}.html 로드 확인`, async ({ page }) => {
      await page.goto(`file:///[절대경로]/pages/${name}.html`);
      await expect(page.locator('.detail-page')).toBeVisible();
      await expect(page.locator('.detail-sidebar')).toBeVisible();
      await expect(page.locator('#main')).toBeVisible();
    });
  });
});
```

**TC-02: JS 비활성화 시 표시 확인 (S-01)**

```javascript
test.describe('JS 비활성화 Progressive Enhancement', () => {
  test('button.html — JS 없이 Primary 버튼 표시', async ({ browser }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto(`file:///[절대경로]/pages/button.html`);
    await expect(page.locator('[data-variant="primary"]')).toBeVisible();
    await ctx.close();
  });

  test('accordion.html — JS 없이 모든 패널 펼쳐진 상태', async ({ browser }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto(`file:///[절대경로]/pages/accordion.html`);
    const panels = page.locator('[data-accordion-panel]');
    await expect(panels.first()).toBeVisible();
    await ctx.close();
  });
});
```

**TC-03: 컴포넌트 독립 CSS 로드 확인 (S-02)**

```javascript
test('button.html — modal.css 미로드 확인', async ({ page }) => {
  const cssRequests = [];
  page.on('request', req => {
    if (req.resourceType() === 'stylesheet') cssRequests.push(req.url());
  });
  await page.goto(`file:///[절대경로]/pages/button.html`);
  const hasModalCss = cssRequests.some(url => url.includes('modal.css'));
  expect(hasModalCss).toBe(false);
  const hasButtonCss = cssRequests.some(url => url.includes('button.css'));
  expect(hasButtonCss).toBe(true);
});
```

**TC-04: public init() 외부 호출 확인 (S-03, S-04)**

```javascript
test('Accordion.init() 동적 HTML 초기화', async ({ page }) => {
  await page.goto(`file:///[절대경로]/pages/accordion.html`);
  await page.evaluate(() => {
    const el = document.createElement('div');
    el.setAttribute('data-component', 'accordion');
    el.innerHTML = `
      <button data-accordion-trigger>동적 항목</button>
      <div data-accordion-panel>동적 내용</div>
    `;
    document.body.appendChild(el);
    Accordion.init(document.body);
  });
  await page.click('[data-accordion-trigger]:last-of-type');
  await expect(page.locator('[data-accordion-panel]:last-of-type')).toBeVisible();
});
```

**TC-05: 테마 전환 확인 (S-05)**

```javascript
test('테마 전환 및 localStorage 저장', async ({ page }) => {
  await page.goto(`file:///[절대경로]/pages/button.html`);
  const initialTheme = await page.getAttribute('html', 'data-theme');
  await page.click('#theme-toggle');
  const newTheme = await page.getAttribute('html', 'data-theme');
  expect(newTheme).not.toBe(initialTheme);

  // 페이지 이동 후 테마 유지 확인
  await page.goto(`file:///[절대경로]/pages/badge.html`);
  const persistedTheme = await page.getAttribute('html', 'data-theme');
  expect(persistedTheme).toBe(newTheme);
});
```

**TC-06: ARIA 접근성 확인 (S-06)**

```javascript
test('Accordion ARIA 속성 검증', async ({ page }) => {
  await page.goto(`file:///[절대경로]/pages/accordion.html`);
  const trigger = page.locator('[data-accordion-trigger]').first();
  await expect(trigger).toHaveAttribute('aria-expanded');
  await expect(trigger).toHaveAttribute('aria-controls');
  await trigger.click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
});
```

**TC-07: JS 템플릿 리터럴 HTML 생성 코드 없음 (S-07)**

- `pages/*.html` 파일 내 `innerHTML` / 템플릿 리터럴 HTML 생성 코드 미존재 검증
- 코드 리뷰로 수동 확인

**TC-08: FOUC 없음 확인**

```javascript
test('button.html — FOUC 없이 테마 즉시 적용', async ({ page }) => {
  await page.context().addInitScript(() => {
    localStorage.setItem('uig-theme', 'dark');
  });
  await page.goto(`file:///[절대경로]/pages/button.html`);
  // 첫 프레임에서 이미 dark 테마가 적용되어야 함
  const theme = await page.getAttribute('html', 'data-theme');
  expect(theme).toBe('dark');
});
```

**관련 파일**

- `TO_CREATE`: `tests/scenarios/static-pages.test.js`
- `REFERENCE`: `playwright.config.js`, `tests/scenarios/` 기존 파일

**완료 기준 (Acceptance Criteria)**

- [ ] TC-01 ~ TC-08 모든 테스트가 Pass 상태다
- [ ] 18개 `pages/*.html` 로드 테스트가 모두 통과한다
- [ ] JS 비활성화 시 정적/인터랙션 컴포넌트 구분 동작이 확인된다
- [ ] 6개 인터랙션 컴포넌트의 `public static init()` 외부 호출 테스트가 통과한다

---

### Task 4-02: 레거시 SPA 코드 제거

**[S-08]**

**설명**

모든 `pages/*.html`과 `index.html` 정적 전환이 완료된 후 레거시 SPA 관련 파일을 제거합니다. 제거 전 반드시 Task 4-01의 모든 테스트가 통과해야 합니다.

**제거 순서 및 대상**

| 단계 | 파일/디렉토리 | 이유 |
|------|-------------|------|
| 1 | `assets/js/demos/*.js` (18개) | `pages/*.html`로 완전 대체됨 |
| 2 | `assets/js/pages/DashboardPage.js` | `index.html` 정적 전환으로 대체됨 |
| 3 | `assets/js/pages/DetailPage.js` | 모든 상세 페이지 정적 전환으로 대체됨 |
| 4 | `assets/js/core/Router.js` | SPA 라우팅 불필요 |
| 5 | `assets/js/App.js` | SPA 진입점 불필요 |
| 6 | `assets/css/layout.css` | `common.css`로 통합됨 |
| 7 | `assets/css/code-block.css` | `common.css`로 통합됨 |
| 8 | `assets/css/pages/dashboard.css` | `common.css`로 통합됨 |
| 9 | `assets/css/pages/detail.css` | `common.css`로 통합됨 |

**관련 파일**

- `TO_MODIFY`: `index.html` (SPA 스크립트 태그 제거)
- `TO_DELETE`: 위 표의 파일/디렉토리 전체

**완료 기준 (Acceptance Criteria)**

- [ ] Task 4-01 테스트가 모두 통과한 후에만 진행한다
- [ ] `assets/js/demos/*.js` 18개가 제거된다
- [ ] `assets/js/App.js`, `Router.js`, `DashboardPage.js`, `DetailPage.js`가 제거된다
- [ ] 레거시 CSS 4개 파일이 제거된다
- [ ] 삭제 후 `index.html`과 `pages/*.html` 모두 정상 표시된다
- [ ] Task 4-01 테스트가 삭제 후에도 모두 Pass를 유지한다

---

### Task 4-03: Lighthouse 접근성 검증

**[S-06, S-10]**

**설명**

모든 `pages/*.html`에 대해 Lighthouse Accessibility 점수를 측정합니다.

**측정 대상**: 18개 pages/*.html + index.html (총 19개)

**완료 기준 (Acceptance Criteria)**

- [ ] 19개 모든 페이지에서 Lighthouse Accessibility 95점 이상을 달성한다
- [ ] 다크/라이트 모드 모두에서 색상 대비 기준을 통과한다
- [ ] 건너뛰기 링크가 Tab 키 진입 시 표시된다
- [ ] 사이드바 현재 페이지 링크에 `aria-current="page"`가 적용된다

---

### M5 마일스톤 체크리스트 — 최종 완료

```
[ ] TC-01 ~ TC-08 Playwright 테스트 전체 Pass
[ ] 레거시 SPA 코드 완전 제거 완료
[ ] 레거시 CSS 4개 파일 제거 완료
[ ] 19개 페이지 Lighthouse Accessibility 95점 이상
[ ] 5가지 검증 시나리오 전체 통과:
    [ ] 시나리오 1: JS 비활성화 표시 확인
    [ ] 시나리오 2: 컴포넌트별 독립 CSS/JS 로드 확인
    [ ] 시나리오 3: 동적 HTML 추가 후 public init() 호출 확인
    [ ] 시나리오 4: ARIA 속성 및 접근성 검증
    [ ] 시나리오 5: 테마 전환 기능 검증
[ ] 성공 기준 S-01 ~ S-07 (필수) 모두 충족
```

---

## 전체 일정표

| Phase | 내용 | 예상 소요 | 마일스톤 |
|-------|------|---------|---------|
| Phase 1 | 인프라 구축 (common.css, common.js, 디렉토리) | 1.0일 | M1 |
| Phase 2 | 완전 구현 컴포넌트 마이그레이션 (Button, Badge) | 0.5일 | M2 |
| Phase 3-A | 정적 컴포넌트 (6개: Input~Select) | 1.5일 | M3(일부) |
| Phase 3-B | CSS 강화 컴포넌트 (3개: Card, Skeleton, Alert) | 0.5일 | M3 |
| Phase 3-C | JS 인터랙션 컴포넌트 (8개: Accordion~Select.js) | 2.5일 | M4 |
| Phase 4 | 레거시 정리 및 최종 검증 (Playwright + Lighthouse) | 1.0일 | M5 |
| **합계** | | **7.0일** | |

### 주간 계획 (예시)

```
Day 1: Phase 1 (인프라 구축)
  - common.css, common.js 생성
  - code-block.js 생성
  - pages/ 디렉토리 및 index.html 정적 전환

Day 2 AM: Phase 2 (Button, Badge 마이그레이션)

Day 2 PM ~ Day 3 PM: Phase 3-A (Input, Checkbox, Radio, Switch, Textarea, Select)

Day 3 PM ~ Day 4 AM: Phase 3-B (Card, Skeleton, Alert)

Day 4 PM ~ Day 6 AM: Phase 3-C (Accordion, Tabs, Dropdown, Tooltip, Progress, Modal, Toast, Select.js)

Day 6 PM ~ Day 7: Phase 4 (Playwright 테스트, 레거시 제거, Lighthouse)
```

---

## 성공 기준

### 필수 기준 (Must Have)

| ID | 기준 | 측정 방법 |
|----|------|---------|
| S-01 | JS 비활성화 시 모든 `pages/*.html`에서 HTML+CSS 표시 | JS 비활성화 후 수동 확인 + TC-02 |
| S-02 | 각 페이지에서 해당 컴포넌트 CSS만 로드 | Network 탭 확인 + TC-03 |
| S-03 | 모든 인터랙션 컴포넌트에 `public static init()` 존재 | 코드 리뷰 + TC-04 |
| S-04 | 동적 HTML 추가 후 `init()` 호출 시 정상 동작 | TC-04 Playwright 자동화 |
| S-05 | 테마 전환이 모든 정적 페이지에서 동작 | TC-05 Playwright 자동화 |
| S-06 | Lighthouse Accessibility 95점 이상 (모든 페이지) | Task 4-03 |
| S-07 | `pages/*.html`에 JS 템플릿 리터럴 HTML 생성 코드 없음 | 코드 리뷰 + TC-07 |

### 권장 기준 (Nice to Have)

| ID | 기준 | 측정 방법 |
|----|------|---------|
| S-08 | 레거시 SPA 코드 완전 제거 | 파일 존재 여부 확인 (Task 4-02) |
| S-09 | `tokens.css` + `components/xxx.css`만으로 컴포넌트 스타일 완성 | 독립 HTML 파일 테스트 |
| S-10 | KWCAG 2.2 스크린리더 동작 확인 (NVDA + Chrome) | 수동 테스트 |
| S-11 | 모든 Playwright 자동화 테스트 통과 (TC-01 ~ TC-08) | CI 실행 |

---

## 리스크 및 고려사항

### R-RISK-01: `file://` 프로토콜 제약

**내용**: ES6 모듈(`type="module"`)은 `file://` 프로토콜에서 CORS 오류 발생

**대응 방안**:
- `assets/js/common.js` — 일반 스크립트로 작성 (모듈 없음)
- `assets/js/components/*.js` — 전역 변수 방식 또는 IIFE 패턴 사용
- 기존 SPA 코드(`assets/js/core/`, `assets/js/demos/`)는 ES6 모듈 유지 (레거시 제거 전까지)

```javascript
// 금지 (file:// 에서 동작 안 함)
// <script type="module" src="../assets/js/components/accordion.js"></script>

// 권장 (file:// 호환)
// <script src="../assets/js/components/accordion.js"></script>
// accordion.js 내부: class Accordion { ... } (전역)
```

### R-RISK-02: 사이드바 상대 경로

**내용**: `pages/*.html`에서 사이드바의 상대 경로가 `pages/` 하위 기준이어야 함

**대응 방안**:
```html
<!-- pages/button.html의 사이드바 링크 -->
<a href="../index.html" class="nav-link">대시보드</a>
<a href="./accordion.html" class="nav-link">Accordion</a>
<a href="./button.html" class="nav-link active" aria-current="page">Button</a>
```

**initSidebarNav()에서 자동 처리**: `common.js`의 `initSidebarNav()`가 현재 `pathname` 기준으로 active 링크를 자동 설정

### R-RISK-03: 중복 초기화 방지

**내용**: `public static init()`이 여러 번 호출될 때 이미 초기화된 요소가 재초기화되면 이벤트 리스너가 중복 등록됨

**대응 방안**:
```javascript
static init(container = document) {
  container.querySelectorAll('[data-component="accordion"]').forEach(el => {
    if (el.dataset.initialized) return; // 반드시 체크
    el.dataset.initialized = 'true';
    new Accordion(el)._setup();
  });
}
```

### R-RISK-04: 기존 SPA와 정적 페이지 병렬 운영 기간

**내용**: Phase 2~3 진행 중에는 SPA(`index.html` + `App.js`)와 정적 페이지(`pages/*.html`)가 동시에 존재

**대응 방안**:
- `index.html`을 정적 대시보드로 먼저 전환하여 SPA 의존 끊기 (Task 1-04)
- 레거시 코드에 DEPRECATED 주석을 단계적으로 추가
- Phase 4에서 일괄 제거

---

*로드맵 버전: v1.0 | 작성일: 2026-04-21 | 기반 PRD: docs/Refactory_PRD.md v1.0*
