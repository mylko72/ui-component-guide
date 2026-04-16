# PRD — 웹 UI 컴포넌트 가이드 v1.1

> **v1.0 → v1.1 변경 내역**
> - Q1~Q5 의사결정 반영 (멀티파일, HTML·CSS·JS 탭, Plain text, 커스텀 Select, 카드만 표시)
> - 추가 요구사항 반영: 다크/라이트 모드 토글 + localStorage 저장
> - 컴포넌트 독립성 검토 결과 반영 (독립성 수준 정의 및 설계 원칙)
> - ⚠️ 미결 질문 3개 → 개발 착수 전 확인 필요 (섹션 14)

---

## 1. 프로젝트 개요

| 항목 | 내용 |
|------|------|
| 프로젝트명 | Web UI Component Guide |
| 버전 | v1.1 (2026-04-15) |
| 플랫폼 | 웹 — 멀티 파일 구조 |
| 기술 스택 | 순수 HTML5 + CSS3 + JavaScript ES6+ |
| 예외 라이브러리 | Lucide Icons CDN (아이콘 전용) |

### 한 줄 설명

> 프레임워크 없이, 순수 HTML·CSS·ES6 클래스 기반으로 구현된
> 한국형 웹접근성(KWCAG 2.2) 준수 · 다크/라이트 모드 지원 · 컴포넌트 독립 UI 가이드

---

## 2. 목적 및 배경

### 해결하는 문제

- 프레임워크(React/Vue 등) 없이 웹 개발 시 참조할 수 있는 **표준화된 컴포넌트 레퍼런스 부재**
- 국내 서비스에 필수인 **한국형 웹접근성(KWCAG 2.2)** 을 실제 코드로 확인하기 어려움
- 컴포넌트 샘플과 소스코드를 **한 화면에서 즉시 확인**하는 문서가 드묾
- 각 컴포넌트를 **독립적으로 추출·재사용**하기 어려운 기존 가이드의 한계

### 핵심 가치

| 가치 | 설명 |
|------|------|
| 즉시 복사·사용 | HTML/CSS/JS 탭별 소스코드 제공, 클립보드 복사 |
| 접근성 완비 | ARIA, 키보드 내비게이션, KWCAG 2.2 준수 |
| 의존성 제로 | npm 불필요, CDN Lucide만 허용 |
| 컴포넌트 독립 | 각 컴포넌트 CSS·JS를 추출해도 독립 동작 |
| 다크/라이트 모드 | 사용자 설정을 localStorage에 저장·복원 |
| 교육 목적 | ES6 클래스 기반 구조 학습 레퍼런스 |

---

## 3. 타겟 사용자

| 대상 | 설명 |
|------|------|
| 프론트엔드 입문자 | 바닐라 JS로 UI를 만드는 방법을 학습하고자 하는 개발자 |
| 레거시 환경 개발자 | 정부·공공·기업 인트라 등 프레임워크 도입이 어려운 환경 |
| 웹접근성 담당자 | KWCAG 2.2 준수 코드 패턴이 필요한 담당자 |
| 프로토타이핑 개발자 | 빠른 마크업 참조가 필요한 모든 웹 개발자 |

---

## 4. 기술 요구사항 (12개 원칙)

### T-01. 노 프레임워크 / 노 라이브러리

- React, Vue, Angular, jQuery 등 일절 사용 금지
- npm 의존성 없이 브라우저에서 직접 실행
- CDN은 **Lucide Icons 단 하나만** 허용

### T-02. 순수 HTML5 + CSS3 + ES6+

- `class`, `arrow function`, `template literal`, `Promise`, `const`/`let` 사용
- CSS Custom Properties, Grid, Flexbox, `@keyframes`, `@media` 적극 활용
- `var` 사용 금지 (eslint-equivalent 원칙)

### T-03. Class 기반 모듈형 컴포넌트

```
UIGuide (전역 네임스페이스)
  ├── core/
  │   ├── EventBus       # pub/sub 이벤트 시스템
  │   ├── Router         # 해시 기반 SPA 라우터
  │   └── Component      # 추상 기본 클래스
  ├── theme/
  │   └── ThemeManager   # 다크/라이트 모드 관리
  ├── ui/
  │   ├── CodeBlock      # 탭 전환 + 확장형 코드 블록
  │   ├── ToastManager   # 전역 알림 (Singleton)
  │   └── ModalManager   # 전역 모달 (Singleton)
  ├── demos/
  │   └── [컴포넌트별 Demo 클래스 18개]
  ├── pages/
  │   ├── DashboardPage  # 메인 대시보드
  │   └── DetailPage     # 컴포넌트 상세
  └── App                # 진입점 컨트롤러
```

### T-04. 한국형 웹접근성 (KWCAG 2.2) 준수

**참고:** https://a11ykr.github.io/kwcag22/

| 항목 | 구현 방법 |
|------|----------|
| 건너뛰기 링크 | `.skip-nav` — Tab 키 진입 시 표시 |
| 이미지 대체 텍스트 | `alt` 또는 `aria-label` 필수 |
| 명확한 레이블 | 모든 인터랙티브 요소에 의미 있는 텍스트 |
| 색상 비의존 | 아이콘+텍스트 병행, 패턴 병행 |
| 명도 대비 | 일반 텍스트 4.5:1↑, 큰 텍스트 3:1↑ (라이트·다크 모두 충족) |
| 키보드 완전 접근 | Tab / Shift+Tab / Arrow / Enter / Esc / Home / End |
| 포커스 표시 | `:focus-visible` 2px 링 (라이트·다크 모두 명확히) |
| 제목 계층 | h1 → h2 → h3 논리적 순서 준수 |
| 동적 콘텐츠 | `aria-live`, `role="status"`, `role="alert"` |
| 폼 레이블 연결 | `<label for>` 또는 `aria-labelledby` 필수 |
| 모달 포커스 트랩 | 열림 시 내부 순환, 닫힘 시 트리거 버튼 복원 |
| ARIA 패턴 | Tab, Accordion, Dialog, Switch, Listbox, Menu 준수 |
| 다크모드 대비 | 다크모드 전환 후에도 모든 색상 대비 기준 유지 |

### T-05. 컴포넌트 목록

> 총 **18개 구현** + **6개 Coming Soon** (섹션 6 참조)
> **참고:** https://ui.shadcn.com/docs/components

### T-06. 메인: 대시보드 (카드 그리드)

- 반응형 카드 그리드 (`auto-fill`, `minmax(200px, 1fr)`)
- 카드 구성: Lucide 아이콘 + 컴포넌트명 + 설명 + 사용빈도(★) + 상태 배지
- 카테고리별 섹션: `폼 요소 / 레이아웃 / 피드백 / 탐색(Coming Soon) / 데이터(Coming Soon)`
- Coming Soon 컴포넌트: **대시보드 카드에만 표시** (상세 페이지 없음)

### T-07. 서브화면: 2단 레이아웃

**참고:** https://my-vue-component.netlify.app/tab

```
┌──────────────────────────────────────────────────────────┐
│  HEADER (sticky, 56px)  Logo | (spacer) | 테마토글 | ...  │
├────────────────┬─────────────────────────────────────────┤
│                │                                         │
│  LEFT SIDEBAR  │  RIGHT CONTENT                          │
│  240px, sticky │  ┌───────────────────────────────────┐  │
│                │  │  h1: 컴포넌트명                    │  │
│  [← 대시보드] │  │  설명 + 태그(ARIA, 키보드 등)      │  │
│                │  ├───────────────────────────────────┤  │
│  ── 폼 요소 ─ │  │  h2: 기본 사용법                   │  │
│  • Button  ←  │  │  [데모 미리보기 영역]              │  │
│  • Input      │  │  [코드 블록 (탭: HTML/CSS/JS)]     │  │
│  • Checkbox   │  ├───────────────────────────────────┤  │
│  • Radio      │  │  h2: 크기 변형                     │  │
│  • Switch     │  │  ...                               │  │
│  • Select     │  └───────────────────────────────────┘  │
│  • Textarea   │                                         │
│               │                                         │
│  ── 레이아웃─ │                                         │
│  ...          │                                         │
└────────────────┴─────────────────────────────────────────┘
```

- 사이드바: `position: sticky; top: 56px; height: calc(100vh - 56px); overflow-y: auto`
- 모바일(< 768px): 사이드바 숨김 → 햄버거 버튼 → 슬라이드 오버레이

### T-08. 소스코드 블록 (HTML·CSS·JS 탭 전환 + 확장형)

**참고:** https://ui.shadcn.com/docs/components/radix/accordion

```
┌──────────────────────────────────────────────────────┐
│  [HTML] [CSS] [JS]   ←─ 탭 (해당 코드가 없으면 탭 숨김) │
├──────────────────────────────────────────────────────┤
│  <div class="accordion">                             │
│    <div class="accordion__item">                     │
│      <button class="accordion__trigger"              │  ← 기본: 8줄
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ (fade 처리)  │
├──────────────────────────────────────────────────────┤
│  [Copy]   [↕ View Code]                             │  ← 하단 바
└──────────────────────────────────────────────────────┘

[View Code 클릭 후]
┌──────────────────────────────────────────────────────┐
│  [HTML] [CSS] [JS]                                   │
├──────────────────────────────────────────────────────┤
│  <div class="accordion">                             │
│    <div class="accordion__item">                     │
│      ...                                             │  ← 전체 코드
│      ... (스크롤 가능)                               │
│  </div>                                              │
├──────────────────────────────────────────────────────┤
│  [Copy]   [↑ Hide Code]                             │
└──────────────────────────────────────────────────────┘
```

- **코드 탭**: HTML / CSS / JS — 해당 코드가 없는 탭은 숨김 처리
- **Syntax Highlighting**: 적용하지 않음 (plain text, monospace 폰트)
- **코드 배경**: 다크 고정 (`#1e293b`) — 페이지 테마와 무관하게 항상 다크
- **기본 상태**: 8줄 미리보기 + 하단 페이드 오버레이
- **View Code 클릭**: `max-height` CSS transition으로 세로 확장 → 스크롤 가능
- **Hide Code 클릭**: 다시 축소 (동일 버튼 토글)
- **Copy 버튼**: `navigator.clipboard.writeText()` → 성공 시 "Copied!" 2초 표시 → fallback `execCommand('copy')`
- **ARIA**: `aria-expanded="false/true"`, `aria-controls`, 버튼 레이블 동적 변경

### T-09. 반응형 레이아웃

| 브레이크포인트 | 레이아웃 변화 |
|--------------|-------------|
| Desktop (≥ 1024px) | 사이드바 240px 고정 + 콘텐츠 영역 |
| Tablet (768 ~ 1023px) | 사이드바 숨김 → 햄버거 → 오버레이 |
| Mobile (< 768px) | 1단 레이아웃, 대시보드 카드 1~2열, 햄버거 메뉴 |
| 데모 미리보기 | 가로 스크롤 없이 모든 화면 크기에서 표시 |

### T-10. 아이콘: Lucide Icons (예외 허용)

**참고:** https://lucide.dev/guide/lucide/

- CDN: `<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js">`
- 사용: `<i data-lucide="icon-name" aria-hidden="true"></i>`
- 초기화: 페이지 렌더링·전환 시마다 `lucide.createIcons()` 재호출
- 장식용 아이콘: `aria-hidden="true"` 필수

### T-11. 다크/라이트 모드 (신규)

#### 동작 흐름

```
첫 방문
  ├── localStorage 'uig-theme' 값 확인
  │   ├── 값 있음 → 저장된 테마 적용
  │   └── 값 없음 → OS 설정 감지 (prefers-color-scheme)
  │                  ├── dark  → 다크 모드 적용
  │                  └── light → 라이트 모드 적용
  └── 이후 토글 버튼 클릭 → 반대 테마 적용 + localStorage 갱신
```

#### ThemeManager 클래스 명세

```javascript
class ThemeManager {
  static STORAGE_KEY = 'uig-theme';

  // 1. 초기화 — 페이지 로드 시 가장 먼저 호출 (FOUC 방지)
  static init()

  // 2. 테마 적용 — <html data-theme="dark|light"> 설정 + localStorage 저장
  static apply(theme: 'dark' | 'light')

  // 3. 토글 — 현재 테마의 반대로 전환
  static toggle()

  // 4. 현재 테마 반환
  static getCurrent(): 'dark' | 'light'

  // 5. 시스템 설정 감지
  static getSystemPreference(): 'dark' | 'light'
}
```

#### FOUC(Flash of Unstyled Content) 방지

```html
<!-- <head> 최상단, CSS 로드 전에 인라인으로 실행 -->
<script>
  (function() {
    const saved = localStorage.getItem('uig-theme');
    const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', saved || system);
  })();
</script>
```

#### 테마 토글 버튼 (헤더 우측)

```html
<button class="theme-toggle"
  id="theme-btn"
  type="button"
  aria-label="다크 모드로 전환">
  <i data-lucide="moon" aria-hidden="true"></i>   <!-- 라이트 모드일 때 표시 -->
  <i data-lucide="sun"  aria-hidden="true"></i>   <!-- 다크 모드일 때 표시 -->
</button>
```

- 토글 시 `aria-label` 동적 변경: `"다크 모드로 전환"` ↔ `"라이트 모드로 전환"`
- CSS: 현재 테마에 따라 해당 아이콘만 표시 (`display: none/block`)

#### 테마 전환 애니메이션

```css
/* prefers-reduced-motion 존중 */
@media (prefers-reduced-motion: no-preference) {
  :root, :root * {
    transition: background-color 0.2s ease, border-color 0.2s ease;
    /* color는 transition 제외 — 가독성 즉시 반영 */
  }
}
```

#### 다크모드 CSS 토큰 (제안값 — 확인 요청)

```css
/* ── 라이트 모드 (기본) ───────────────────────────────── */
:root,
[data-theme="light"] {
  --c-bg:      #ffffff;
  --c-bg-2:    #f8fafc;
  --c-bg-3:    #f1f5f9;
  --c-border:  #e2e8f0;
  --c-border-2:#cbd5e1;
  --c-text:    #0f172a;
  --c-text-2:  #475569;
  --c-text-3:  #94a3b8;

  --c-primary:   #3b82f6;
  --c-primary-d: #2563eb;
  --c-primary-l: #eff6ff;
  --c-success:   #16a34a;
  --c-success-l: #f0fdf4;
  --c-warning:   #d97706;
  --c-warning-l: #fffbeb;
  --c-danger:    #dc2626;
  --c-danger-l:  #fef2f2;
  --c-info:      #0284c7;
  --c-info-l:    #f0f9ff;
}

/* ── 다크 모드 ─────────────────────────────────────────── */
[data-theme="dark"] {
  --c-bg:      #0f172a;   /* Slate 900 */
  --c-bg-2:    #1e293b;   /* Slate 800 */
  --c-bg-3:    #334155;   /* Slate 700 */
  --c-border:  #334155;
  --c-border-2:#475569;
  --c-text:    #f1f5f9;   /* Slate 100 */
  --c-text-2:  #94a3b8;   /* Slate 400 */
  --c-text-3:  #64748b;   /* Slate 500 */

  --c-primary:   #60a5fa;   /* Blue 400 — 다크에서 밝게 */
  --c-primary-d: #3b82f6;
  --c-primary-l: #172554;   /* 다크 배경용 강조 배경 */
  --c-success:   #4ade80;   /* Green 400 */
  --c-success-l: #052e16;
  --c-warning:   #fbbf24;   /* Amber 400 */
  --c-warning-l: #451a03;
  --c-danger:    #f87171;   /* Red 400 */
  --c-danger-l:  #450a0a;
  --c-info:      #38bdf8;   /* Sky 400 */
  --c-info-l:    #082f49;
}
```

#### 다크모드 색상 대비 검증 (KWCAG 2.2 기준)

| 조합 | 대비율 | 기준 |
|------|-------|------|
| `--c-text` (#f1f5f9) on `--c-bg` (#0f172a) | ~18:1 | ✅ AAA |
| `--c-text-2` (#94a3b8) on `--c-bg` | ~5.2:1 | ✅ AA |
| `--c-primary` (#60a5fa) on `--c-bg` | ~5.0:1 | ✅ AA |
| `--c-danger` (#f87171) on `--c-bg` | ~4.8:1 | ✅ AA |
| `--c-success` (#4ade80) on `--c-bg` | ~7.5:1 | ✅ AAA |

### T-12. 컴포넌트 독립성 (신규)

#### 독립성 목표 수준

컴포넌트 독립성은 두 레벨로 정의하며, **Level 2 (포터블 독립)** 를 목표로 합니다.

| 수준 | 정의 | 목표 |
|------|------|------|
| Level 1 — 가이드 내 독립 | 각 Demo 클래스가 다른 Demo에 의존하지 않음 | ✅ 필수 |
| Level 2 — 포터블 독립 | 컴포넌트 CSS·HTML·JS를 복사해서 빈 HTML에 붙여넣으면 동작 | ✅ 목표 |

#### Level 2 달성 조건

**CSS 독립 원칙:**
- `components/button.css`는 `tokens.css`의 CSS 변수만 참조
- 타 컴포넌트 CSS 클래스 참조 금지 (`.btn`이 `.input__wrapper`를 참조하면 안 됨)
- `tokens.css` + `components/xxx.css` 두 파일만으로 스타일 완성

**JS 독립 원칙:**
- 각 `XxxDemo.js`의 의존: `Component.js` (기본 클래스) 하나만
- 단, `ModalDemo.js` → `ModalManager`, `ToastDemo.js` → `ToastManager` 는 예외 허용
  (Modal/Toast는 전역 UI 유틸이므로 의존 인정)
- Demo 클래스 간 상호 의존 금지 (`ButtonDemo`가 `InputDemo`를 호출하면 안 됨)

**포터블 사용 예시 (목표):**

```html
<!-- 다른 프로젝트에서 Button만 쓰고 싶을 때 -->
<link rel="stylesheet" href="tokens.css">
<link rel="stylesheet" href="components/button.css">

<button class="btn btn--primary">클릭</button>

<!-- JS 기능이 필요 없으면 JS 불필요, CSS만으로 스타일 적용 -->
```

#### 의존성 맵

```
tokens.css              ← 모든 CSS의 공통 의존
  ├── components/button.css
  ├── components/input.css
  ├── components/modal.css
  └── ... (각 컴포넌트 독립)

Component.js            ← 모든 Demo.js의 공통 의존
  ├── ButtonDemo.js
  ├── InputDemo.js
  ├── ModalDemo.js  ──→ ModalManager.js (예외 허용)
  ├── ToastDemo.js  ──→ ToastManager.js (예외 허용)
  └── ... (각 Demo 독립)
```

---

## 5. 파일 구조 (멀티 파일)

```
ui-component-guide/
│
├── index.html                      # 진입점 (스크립트 로딩 순서 정의)
│
├── assets/
│   ├── css/
│   │   ├── tokens.css              # ★ 디자인 토큰 (라이트/다크 CSS 변수)
│   │   ├── reset.css               # 브라우저 리셋 + 기본 스타일
│   │   ├── layout.css              # 앱 레이아웃 (header, sidebar, main)
│   │   ├── dashboard.css           # 대시보드 전용
│   │   ├── detail.css              # 상세 페이지 전용 (demo-section, demo-preview)
│   │   ├── code-block.css          # 코드 블록 (탭, 확장/축소)
│   │   └── components/             # ← 각 파일이 tokens.css만 의존
│   │       ├── button.css
│   │       ├── input.css
│   │       ├── checkbox.css
│   │       ├── radio.css
│   │       ├── switch.css
│   │       ├── select.css
│   │       ├── textarea.css
│   │       ├── card.css
│   │       ├── accordion.css
│   │       ├── tabs.css
│   │       ├── modal.css
│   │       ├── dropdown.css
│   │       ├── toast.css
│   │       ├── alert.css
│   │       ├── badge.css
│   │       ├── tooltip.css
│   │       ├── progress.css
│   │       └── skeleton.css
│   │
│   └── js/
│       ├── core/
│       │   ├── EventBus.js         # pub/sub (의존 없음)
│       │   ├── Router.js           # 해시 라우터 (EventBus 의존)
│       │   └── Component.js        # 추상 기본 클래스 (의존 없음)
│       │
│       ├── theme/
│       │   └── ThemeManager.js     # 다크/라이트 모드 (의존 없음)
│       │
│       ├── ui/
│       │   ├── CodeBlock.js        # 탭 전환 + 확장형 코드 블록 (Component 의존)
│       │   ├── ToastManager.js     # 전역 알림 Singleton (Component 의존)
│       │   └── ModalManager.js     # 전역 모달 Singleton (Component 의존)
│       │
│       ├── demos/
│       │   ├── ButtonDemo.js       # Component만 의존
│       │   ├── InputDemo.js
│       │   ├── CheckboxDemo.js
│       │   ├── RadioDemo.js
│       │   ├── SwitchDemo.js
│       │   ├── SelectDemo.js
│       │   ├── TextareaDemo.js
│       │   ├── CardDemo.js
│       │   ├── AccordionDemo.js
│       │   ├── TabsDemo.js
│       │   ├── ModalDemo.js        # Component + ModalManager 의존
│       │   ├── DropdownDemo.js
│       │   ├── ToastDemo.js        # Component + ToastManager 의존
│       │   ├── AlertDemo.js
│       │   ├── BadgeDemo.js
│       │   ├── TooltipDemo.js
│       │   ├── ProgressDemo.js
│       │   └── SkeletonDemo.js
│       │
│       ├── pages/
│       │   ├── DashboardPage.js    # Component 의존
│       │   └── DetailPage.js       # Component + Demo 클래스들 의존
│       │
│       └── App.js                  # 최종 통합 진입점
```

### CSS 로딩 순서 (index.html)

```html
<link rel="stylesheet" href="assets/css/tokens.css">
<link rel="stylesheet" href="assets/css/reset.css">
<link rel="stylesheet" href="assets/css/layout.css">
<link rel="stylesheet" href="assets/css/dashboard.css">
<link rel="stylesheet" href="assets/css/detail.css">
<link rel="stylesheet" href="assets/css/code-block.css">
<!-- 컴포넌트 CSS (순서 무관, 독립적) -->
<link rel="stylesheet" href="assets/css/components/button.css">
<link rel="stylesheet" href="assets/css/components/input.css">
... (18개)
```

### JS 로딩 순서 (index.html)

> ⚠️ **섹션 14 미결 질문 A 참조** — 로딩 방식 확정 후 최종 결정

```html
<!-- FOUC 방지 인라인 스크립트 (CSS 앞에 위치) -->
<script>/* ThemeManager.init() 인라인 */</script>

<!-- Lucide CDN -->
<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>

<!-- 의존 순서대로 로딩 -->
<script src="assets/js/core/EventBus.js"></script>
<script src="assets/js/core/Component.js"></script>
<script src="assets/js/core/Router.js"></script>
<script src="assets/js/theme/ThemeManager.js"></script>
<script src="assets/js/ui/CodeBlock.js"></script>
<script src="assets/js/ui/ToastManager.js"></script>
<script src="assets/js/ui/ModalManager.js"></script>
<!-- demos (순서 무관) -->
<script src="assets/js/demos/ButtonDemo.js"></script>
... (18개)
<!-- pages -->
<script src="assets/js/pages/DashboardPage.js"></script>
<script src="assets/js/pages/DetailPage.js"></script>
<!-- 마지막 -->
<script src="assets/js/App.js"></script>
```

---

## 6. 컴포넌트 목록 및 구현 계획

### Phase 1 — 폼 요소 · 사용빈도 최상 (★★★★★)

| 순번 | 컴포넌트 | Lucide 아이콘 | 핵심 데모 변형 | 주요 ARIA |
|------|---------|-------------|------------|---------|
| 1 | **Button** | `mouse-pointer-click` | Primary / Secondary / Outline / Ghost / Danger / Icon버튼 / Loading / Disabled / sm·md·lg | — |
| 2 | **Input** | `text-cursor-input` | Default / 레이블+도움말 / Error / Leading Icon / Trailing Icon / 비밀번호(토글) / Disabled | `aria-invalid`, `aria-describedby` |
| 3 | **Checkbox** | `check-square` | Default / Group / Indeterminate | `role="checkbox"`, `aria-checked="mixed"` |
| 4 | **Radio** | `circle-dot` | Default / Group / 세로 배치 / Disabled | `role="radiogroup"`, `role="radio"` |
| 5 | **Switch** | `toggle-left` | Default / 레이블 포함 / sm·lg / Disabled | `role="switch"`, `aria-checked` |
| 6 | **Select** | `chevron-down` | Default / 검색 포함 / 비활성 | `role="combobox"`, `aria-expanded`, `aria-activedescendant` |
| 7 | **Textarea** | `align-left` | Default / 자동 높이 / 글자수 카운터 / Disabled | `aria-describedby` |

### Phase 2 — 레이아웃 · 사용빈도 높음 (★★★★)

| 순번 | 컴포넌트 | Lucide 아이콘 | 핵심 데모 변형 | 주요 ARIA |
|------|---------|-------------|------------|---------|
| 8 | **Card** | `layout-panel-left` | 기본 / 헤더+푸터 / 가로형 / 인터랙티브 | — |
| 9 | **Accordion** | `chevrons-up-down` | 단일 열림 / 다중 열림 / 아이콘 포함 | `aria-expanded`, `aria-controls`, `aria-labelledby` |
| 10 | **Tabs** | `panel-top` | 수평 기본 / 언더라인 / Pills / 수직 | `role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected` |
| 11 | **Modal** | `square-x` | 기본 / 폼 포함 / 확인 다이얼로그 | `role="dialog"`, `aria-modal`, `aria-labelledby`, 포커스 트랩 |
| 12 | **Dropdown** | `menu` | 기본 / 아이콘 포함 / 구분선 / 비활성 항목 | `role="menu"`, `role="menuitem"`, `aria-haspopup`, `aria-expanded` |

### Phase 3 — 피드백 · 사용빈도 높음 (★★★★)

| 순번 | 컴포넌트 | Lucide 아이콘 | 핵심 데모 변형 | 주요 ARIA |
|------|---------|-------------|------------|---------|
| 13 | **Toast** | `bell` | Info / Success / Warning / Error / 액션 포함 | `aria-live="polite"` (Info/Success), `aria-live="assertive"` (Error) |
| 14 | **Alert** | `triangle-alert` | Info / Success / Warning / Error / 닫기 버튼 | `role="alert"` |
| 15 | **Badge** | `tag` | 색상 6종 / Outlined / Dot 인디케이터 / Sizes | — |
| 16 | **Tooltip** | `info` | 상/하/좌/우 / 지연 표시 | `role="tooltip"`, `aria-describedby` |
| 17 | **Progress** | `loader` | 선형 / 원형 / Indeterminate / 레이블 | `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax` |
| 18 | **Skeleton** | `square` | 텍스트 / 카드 / 테이블 행 / 아바타 | `aria-busy="true"`, `aria-label="로딩 중"` |

### Phase 4 — Coming Soon (대시보드 카드만 표시, 상세 페이지 없음)

| 순번 | 컴포넌트 | 예정 ARIA |
|------|---------|---------|
| 19 | **Breadcrumb** | `aria-label="breadcrumb"`, `aria-current="page"` |
| 20 | **Pagination** | `role="navigation"`, `aria-label="페이지 탐색"` |
| 21 | **Table** | `role="columnheader"`, `aria-sort` |
| 22 | **Stepper** | `aria-current="step"` |
| 23 | **Date Picker** | `role="grid"`, `aria-selected` |
| 24 | **Slider** | `role="slider"`, `aria-valuenow` |

---

## 7. 라우팅 설계 (Hash Router)

```
#/            → DashboardPage
#/button      → DetailPage('button')
#/input       → DetailPage('input')
#/checkbox    → DetailPage('checkbox')
#/radio       → DetailPage('radio')
#/switch      → DetailPage('switch')
#/select      → DetailPage('select')
#/textarea    → DetailPage('textarea')
#/card        → DetailPage('card')
#/accordion   → DetailPage('accordion')
#/tabs        → DetailPage('tabs')
#/modal       → DetailPage('modal')
#/dropdown    → DetailPage('dropdown')
#/toast       → DetailPage('toast')
#/alert       → DetailPage('alert')
#/badge       → DetailPage('badge')
#/tooltip     → DetailPage('tooltip')
#/progress    → DetailPage('progress')
#/skeleton    → DetailPage('skeleton')

# Phase 4 — Coming Soon은 라우트 없음 (대시보드 카드만)
```

---

## 8. 디자인 시스템

### 타이포그래피

```css
--font:       'Pretendard', 'Apple SD Gothic Neo', 'Malgun Gothic',
              -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
--font-mono:  'Fira Code', 'Cascadia Code', Consolas, 'Courier New', monospace;
```

### 간격 시스템 (4px 기반)

```
4 / 8 / 12 / 16 / 20 / 24 / 32 / 48 / 64 (px)
```

### 그림자

```css
--shadow-sm: 0 1px 2px rgba(0,0,0,.05);
--shadow:    0 1px 3px rgba(0,0,0,.10), 0 1px 2px rgba(0,0,0,.06);
--shadow-md: 0 4px 6px rgba(0,0,0,.07), 0 2px 4px rgba(0,0,0,.06);
--shadow-lg: 0 10px 15px rgba(0,0,0,.10), 0 4px 6px rgba(0,0,0,.05);
```

> 다크모드에서 그림자는 자동으로 대비 감소 — 별도 조정 없음

### 전환 속도

```css
--transition: 150ms cubic-bezier(0.4, 0, 0.2, 1);  /* 인터랙션 */
--transition-slow: 300ms cubic-bezier(0.4, 0, 0.2, 1);  /* 테마 전환 */
```

### 기본 헤더 레이아웃

```
[로고] [가이드명]     ──(spacer)──     [v1.1] [테마토글☀/🌙] [GitHub]
```

---

## 9. JS 클래스 설계

```
EventBus
  ├── on(event: string, handler: Function): void
  ├── off(event: string, handler: Function): void
  └── emit(event: string, data?: any): void

Router
  ├── constructor(routes: { [path: string]: Function })
  ├── navigate(path: string): void
  ├── back(): void
  └── _handleHashChange(): void  [private]

Component  (abstract)
  ├── constructor(container: HTMLElement, options?: object)
  ├── render(): string           [override 필수 — HTML 문자열 반환]
  ├── mount(): void              [render() → innerHTML → afterMount()]
  ├── afterMount(): void         [override 권장 — DOM 접근, 이벤트 바인딩]
  ├── destroy(): void            [이벤트 해제 + DOM 정리]
  └── _query(selector): Element [this.container.querySelector 단축]

ThemeManager  (static class)
  ├── STORAGE_KEY: 'uig-theme'
  ├── init(): void
  ├── apply(theme: 'dark'|'light'): void
  ├── toggle(): void
  ├── getCurrent(): 'dark'|'light'
  └── getSystemPreference(): 'dark'|'light'

CodeBlock extends Component
  ├── constructor(container, { tabs: [{lang, code}], defaultLang })
  ├── _switchTab(lang): void    [탭 전환]
  ├── _toggle(): void           [코드 확장/축소]
  └── _copy(): void             [클립보드 복사]

ToastManager  (Singleton)
  ├── show({ message, type, duration?, action? }): string  [toast id 반환]
  ├── dismiss(id: string): void
  └── _render(toast): HTMLElement

ModalManager  (Singleton)
  ├── open({ title, content, onConfirm?, onCancel?, size? }): void
  ├── close(): void
  └── _trapFocus(e: KeyboardEvent): void

[18개 XxxDemo] extends Component
  └── render(): string  [각 컴포넌트 데모 HTML 반환]

DashboardPage extends Component
  └── render(): string  [카드 그리드 HTML]

DetailPage extends Component
  ├── constructor(container, { componentId: string })
  ├── render(): string  [2단 레이아웃 HTML]
  ├── _getDemo(): Component  [componentId → 해당 Demo 클래스 인스턴스]
  └── afterMount(): void    [CodeBlock 인스턴스 생성 + 이벤트 바인딩]

App
  ├── constructor()
  ├── _initTheme(): void      [ThemeManager.init()]
  ├── _initLayout(): void     [헤더 렌더링, 테마토글 버튼 바인딩]
  ├── _initRouter(): void     [Router 인스턴스 생성 + 라우트 등록]
  └── _initLucide(): void     [lucide.createIcons() 래퍼]
```

---

## 10. 주요 구현 상세

### Select 커스텀 드롭다운 (완전 커스텀, a11y 완비)

```
역할 모델: ARIA Combobox Pattern
  - 트리거: role="combobox", aria-expanded, aria-haspopup="listbox"
  - 목록: role="listbox"
  - 옵션: role="option", aria-selected
  - 검색: input[type="text"] (선택적)
  - aria-activedescendant: 현재 포커스된 옵션 ID

키보드 동작:
  - Enter / Space: 드롭다운 열기/닫기, 옵션 선택
  - Arrow Down/Up: 옵션 이동 (열려 있을 때)
  - Home / End: 첫/마지막 옵션으로 이동
  - Esc: 드롭다운 닫기, 트리거로 포커스 복원
  - 문자 타이핑: 해당 첫 글자 옵션으로 점프 (typeahead)
```

### Modal 포커스 트랩

```
열림 시:
  1. body.style.overflow = 'hidden'
  2. aria-hidden="true" → 모달 외부 콘텐츠
  3. 모달 내 첫 번째 포커스 가능 요소에 focus()
  4. Tab/Shift+Tab 이벤트 인터셉트 → 모달 내부만 순환

닫힘 시:
  1. body.style.overflow 복원
  2. aria-hidden 제거
  3. 모달 열었던 트리거 버튼으로 focus() 복원
  4. Esc 키도 닫기 처리
```

### CodeBlock 탭 전환 상세

```
초기화 옵션:
  tabs: [
    { lang: 'HTML', code: '...' },
    { lang: 'CSS',  code: '...' },   ← 없으면 탭 숨김
    { lang: 'JS',   code: '...' },   ← 없으면 탭 숨김
  ]

탭 ARIA:
  - 탭 컨테이너: role="tablist"
  - 각 탭 버튼: role="tab", aria-selected, aria-controls
  - 코드 영역: role="tabpanel", aria-labelledby

키보드:
  - Arrow Left/Right: 탭 전환
  - Home/End: 첫/마지막 탭으로 이동
  - Enter/Space: 탭 선택
```

---

## 11. 완성 기준 (Definition of Done)

### 기능

- [ ] 대시보드: 18개 구현 컴포넌트 카드 + 6개 Coming Soon 카드 노출
- [ ] 대시보드 → 카드 클릭 → 상세 페이지 이동
- [ ] 상세 페이지: 모든 컴포넌트 2개 이상 데모 변형 동작
- [ ] 코드 블록: HTML/CSS/JS 탭 전환 동작
- [ ] 코드 블록: 8줄 미리보기 → View Code 클릭 → 확장 → Hide Code 축소
- [ ] 클립보드 복사 동작 (성공 피드백)
- [ ] 브라우저 뒤로/앞으로 가기가 라우터에서 정상 동작
- [ ] 모든 인터랙티브 컴포넌트 키보드만으로 완전 조작 가능

### 다크/라이트 모드

- [ ] 헤더 테마 토글 버튼 동작
- [ ] 전환 시 모든 색상 즉시 반영 (CSS 변수 기반)
- [ ] localStorage에 저장 → 새로고침 후 유지
- [ ] 첫 방문 시 OS 설정 자동 감지 적용
- [ ] FOUC(깜박임) 없음

### 컴포넌트 독립성

- [ ] 각 Demo 클래스가 다른 Demo를 호출하지 않음 (Level 1)
- [ ] `tokens.css` + `components/xxx.css` 만으로 CSS 스타일 완성 (Level 2)
- [ ] 각 컴포넌트 JS가 동일 컴포넌트 범주 외 Demo에 의존하지 않음 (Level 2)

### 접근성

- [ ] 건너뛰기 링크 동작
- [ ] 모든 아이콘 `aria-hidden="true"` 또는 의미 있는 레이블
- [ ] 모달 포커스 트랩 + Esc 닫기 + 트리거 포커스 복원
- [ ] Lighthouse Accessibility 95점 이상 (라이트·다크 모두)
- [ ] 주요 컴포넌트 스크린리더 동작 확인 (NVDA + Chrome)

### 반응형

- [ ] 360px ~ 1440px 가로 스크롤 없음
- [ ] 모바일 햄버거 → 사이드바 슬라이드 동작

---

## 12. 개발 순서

```
0단계 — 세팅 (0.5일)
  ├── 폴더 구조 생성
  ├── index.html 기본 쉘
  ├── tokens.css (라이트+다크 전체)
  ├── FOUC 방지 인라인 스크립트
  └── Lucide CDN 연결 확인

1단계 — 코어 클래스 (1일)
  ├── EventBus.js
  ├── Component.js (추상 기본)
  ├── Router.js
  ├── ThemeManager.js
  └── App.js 뼈대

2단계 — 공통 UI + 레이아웃 (1일)
  ├── layout.css + reset.css
  ├── 헤더 (테마 토글 버튼 포함)
  ├── 사이드바 (햄버거 포함)
  ├── 대시보드 레이아웃
  ├── CodeBlock.js + code-block.css
  └── ToastManager + ModalManager

3단계 — 대시보드 (0.5일)
  ├── DashboardPage.js
  ├── dashboard.css
  └── 18개 컴포넌트 카드 + 6개 Coming Soon

4단계 — Phase 1: 폼 요소 (2일)
  Button → Input → Checkbox → Radio → Switch → Select → Textarea

5단계 — Phase 2: 레이아웃 컴포넌트 (1.5일)
  Card → Accordion → Tabs → Modal → Dropdown

6단계 — Phase 3: 피드백 컴포넌트 (1.5일)
  Toast → Alert → Badge → Tooltip → Progress → Skeleton

7단계 — 마무리 (1일)
  ├── 반응형 전체 검토 + 모바일 최적화
  ├── 접근성 전체 검토 (키보드, 스크린리더)
  ├── 다크모드 전체 검토 (색상 대비, 가독성)
  └── 컴포넌트 독립성 검증 (Level 2)

총 예상: 8~9일
```

---

## 13. 의사결정 완료 목록

| # | 항목 | 결정 |
|---|------|------|
| Q1 | 파일 구조 | ✅ **멀티 파일** |
| Q2 | 소스코드 탭 | ✅ **HTML·CSS·JS 탭 전환** |
| Q3 | Syntax Highlighting | ✅ **Plain text (미적용)** |
| Q4 | Select 구현 | ✅ **완전 커스텀 (a11y 완비)** |
| Q5 | Coming Soon | ✅ **대시보드 카드만 표시** |
| 추가 | 다크/라이트 모드 | ✅ **localStorage 저장** |
| 추가 | 컴포넌트 독립성 | ✅ **Level 2 목표** |

---

## 14. ✅ 의사결정 완료 — 미결 질문 확정 (2026-04-16)

### Q-A. JS 파일 로딩 방식 (아키텍처 핵심)

멀티 파일 구조에서 JS 파일 간 의존성을 어떻게 연결할까요?

| 방법 | 설명 | 장점 | 단점 |
|------|------|------|------|
| A. `<script>` 순서 로딩 | 각 파일에서 `window.UIGuide.Xxx = class {...}` 로 전역 등록. `index.html`에서 의존 순서대로 `<script>` 태그 나열 | `file://` 프로토콜에서도 동작. 서버 불필요 | 전역 네임스페이스 오염. ES6 모듈 문법이 아님 |
| **✅ B. ES6 Native Modules** | `export class Xxx` / `import { Xxx } from './xxx.js'`. `<script type="module">` 사용 | 진정한 ES6 모듈. 깔끔한 의존성 선언 | HTTP 서버 필수 (`file://` 에서 CORS 오류). VS Code Live Server 등 필요 |

> **결정:** **B (ES6 Modules)** — 배포 환경 기준, 진정한 모듈 문법 적용

---

### Q-B. 컴포넌트 독립성 Level 2 범위

Level 2 목표는 "컴포넌트 CSS·HTML을 복사해서 빈 HTML에서 동작"인데, JS 기능이 있는 컴포넌트(Accordion, Tabs 등)의 경우 어떤 수준까지 독립을 보장할까요?

| 옵션 | 설명 |
|------|------|
| CSS 독립만 | `tokens.css` + `components/xxx.css` 복사 시 스타일은 완성. JS 기능은 가이드의 Demo 클래스 사용. |
| **✅ CSS + JS 독립** | 각 컴포넌트 CSS + 해당 XxxDemo.js + Component.js 복사 시 기능까지 동작. |

> **결정:** **CSS + JS 독립** — Level 2 본래 목적에 충실, 포터블 재사용 극대화

---

### Q-C. 다크모드 첫 방문 초기값

OS 시스템 설정을 자동으로 감지하여 다크모드를 적용할까요?

| 옵션 | 동작 |
|------|------|
| **✅ A. 시스템 감지 자동 적용** | 첫 방문 시 `prefers-color-scheme` 감지 → 다크/라이트 자동 결정 → localStorage 저장 |
| B. 항상 라이트로 시작 | 첫 방문 시 항상 라이트 모드 → 사용자가 직접 토글 |

> **결정:** **A (시스템 감지)** — 사용자 경험 및 a11y 측면에서 최적

---

*PRD 버전: v1.2 | 작성일: 2026-04-15 | 미결 질문 확정: 2026-04-16*
