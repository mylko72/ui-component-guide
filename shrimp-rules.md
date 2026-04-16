# Web UI Component Guide - 개발 규칙

프레임워크 없이 순수 HTML/CSS/ES6 클래스 기반으로 구현하는 한국형 웹접근성(KWCAG 2.2) 준수 UI 컴포넌트 가이드 개발을 위한 AI 에이전트 규칙.

---

## 1. 프로젝트 개요

### 기술 스택
- **언어**: HTML5, CSS3, JavaScript ES6+ (프레임워크 없음)
- **모듈 시스템**: ES6 Modules (`import`/`export`)
- **외부 라이브러리**: **Lucide Icons CDN만 허용**
- **서버**: HTTP 서버 필수 (로컬 파일 프로토콜 불가)

### 핵심 목표
- KWCAG 2.2 준수, Lighthouse Accessibility 95점 이상
- 360px ~ 1440px 반응형 완전 구현
- 다크/라이트 모드 지원 (CSS 변수 기반, localStorage 저장)
- 18개 컴포넌트 구현: Form(7), Layout(5), Feedback(6)
- 모든 인터랙티브 요소 키보드만으로 완전 조작 가능

### 주요 의사결정 사항 (2026-04-16 확정)
| 항목 | 결정 |
|------|------|
| JS 로딩 방식 | **ES6 Modules** |
| 컴포넌트 독립성 범위 | **CSS + JS 독립 (Level 2)** |
| 다크모드 첫 방문 초기값 | **OS `prefers-color-scheme` 자동 감지** |

---

## 2. 프로젝트 아키텍처

### 디렉토리 구조
```
project-root/
├── index.html                      # 메인 HTML (모듈 진입점)
├── assets/
│   ├── css/
│   │   ├── tokens.css              # 디자인 토큰 (색상, 타이포그래피, 간격)
│   │   ├── reset.css               # 브라우저 리셋 + 기본 스타일
│   │   ├── layout.css              # 공통 레이아웃 (헤더, 사이드바)
│   │   └── components/
│   │       ├── button.css          # 버튼 컴포넌트 스타일
│   │       ├── input.css           # 입력 필드 스타일
│   │       ├── ... (16개 더)
│   │       └── skeleton.css
│   └── js/
│       ├── App.js                  # 진입점 컨트롤러
│       ├── core/
│       │   ├── Component.js        # 컴포넌트 기본 클래스
│       │   ├── EventBus.js         # 이벤트 시스템
│       │   ├── Router.js           # 라우터
│       │   └── ThemeManager.js     # 테마 관리
│       ├── ui/
│       │   ├── CodeBlock.js        # CodeBlock 컴포넌트
│       │   ├── ToastManager.js     # Toast 관리자 (Singleton)
│       │   └── ModalManager.js     # Modal 관리자 (Singleton)
│       ├── pages/
│       │   ├── DashboardPage.js    # 대시보드 페이지
│       │   └── DetailPage.js       # 컴포넌트 상세 페이지
│       └── demos/                  # 컴포넌트 Demo 클래스 (18개)
│           ├── ButtonDemo.js
│           ├── InputDemo.js
│           ├── ... (16개 더)
│           └── SkeletonDemo.js
└── docs/
    ├── ROADMAP.md                  # 개발 로드맵 (32개 Task)
    └── PRD.md                       # 제품 요구사항 명세
```

### 핵심 설계 원칙
1. **의존성 주입은 최소화**: EventBus, Manager 클래스 사용으로 느슨한 결합 유지
2. **CSS 독립성**: 각 컴포넌트 CSS는 `tokens.css` + `components/xxx.css`만으로 동작
3. **JS 독립성**: 같은 범주 외 Demo 클래스 호출 금지 (Modal/Toast 예외)
4. **모듈화**: 각 파일은 하나의 클래스 또는 기능을 담당

---

## 3. 코드 표준

### 포매팅 및 네이밍
- **들여쓰기**: 2칸 (스페이스)
- **줄 끝**: LF (`\n`)
- **변수/함수**: `camelCase` (e.g., `isOpen`, `getTheme()`)
- **클래스/컴포넌트**: `PascalCase` (e.g., `ButtonDemo`, `ThemeManager`)
- **상수**: `SCREAMING_SNAKE_CASE` (e.g., `MAX_RETRY_COUNT`)
- **Private 메서드/속성**: `_underscore` prefix (e.g., `_query()`, `_initTheme()`)

### 주석 및 문서화
- **언어**: 한국어로 작성
- **주석 스타일**:
  ```javascript
  // 단일 줄 주석: 이렇게 작성
  
  /**
   * 다중 줄 주석 (JSDoc 스타일)
   * - 복잡한 로직 또는 공개 메서드만
   * @param {string} text - 매개변수 설명
   * @returns {boolean} 반환값 설명
   */
  ```

### 파일 내 구조
```javascript
// 1. import 문 (상단)
import { EventBus } from '../core/EventBus.js';
import Component from '../core/Component.js';

// 2. 상수 정의
const DEFAULT_DELAY = 2000;

// 3. 클래스 선언
export default class ButtonDemo extends Component {
  // 4. constructor
  constructor() {
    super();
    this.state = {};
  }

  // 5. 생명주기 메서드 (순서대로)
  render() { }
  mount() { }
  afterMount() { }
  destroy() { }

  // 6. 공개 메서드
  somePublicMethod() { }

  // 7. Private 메서드 (언더스코어 prefix)
  _query() { }
  _bindEvents() { }
}
```

---

## 4. ES6 Modules 표준

### import/export 규칙
```javascript
// ✅ 올바른 방식

// core/Component.js
export default class Component { }

// core/EventBus.js
export class EventBus { }
export const eventBus = new EventBus();

// demos/ButtonDemo.js
import Component from '../core/Component.js';
import { EventBus } from '../core/EventBus.js';

export default class ButtonDemo extends Component { }
```

### 금지 사항
- ❌ CommonJS (`module.exports`, `require()`)
- ❌ 동적 import (성능 저하)
- ❌ 상대 경로에 파일 확장자 생략 (.js 필수)
- ❌ 순환 의존 (import A → B → A)

---

## 5. 컴포넌트 구현 표준

### Component 기본 클래스 상속
모든 Demo 클래스는 `Component`를 상속하고 다음 생명주기를 구현:

```javascript
export default class ButtonDemo extends Component {
  // 1. HTML 마크업 반환 (DOM 구조 정의)
  render() {
    return `
      <div class="demo-section">
        <button class="btn btn-primary" id="btn-demo">클릭</button>
      </div>
    `;
  }

  // 2. DOM 마운트 시 호출 (이벤트 바인딩)
  mount() {
    this.button = this._query('#btn-demo');
    this.button.addEventListener('click', () => this._onClick());
  }

  // 3. 마운트 후 비동기 작업 (초기화 완료)
  afterMount() {
    // 필요시 초기 상태 설정, 다른 컴포넌트 알림 등
  }

  // 4. 언마운트 시 호출 (정리)
  destroy() {
    if (this.button) {
      this.button.removeEventListener('click', () => this._onClick());
    }
  }

  // 5. Private 헬퍼
  _query(selector) {
    return this.element.querySelector(selector);
  }

  _onClick() {
    // 이벤트 처리 로직
  }
}
```

### ARIA 및 접근성 필수 속성
모든 인터랙티브 요소:
- `role` (button, checkbox, etc.)
- `aria-*` (aria-label, aria-expanded, aria-pressed, etc.)
- `tabindex` (0 = 자동 탭 오더, -1 = 탭 제외)
- `:focus-visible` CSS 스타일 (2px 외각선, 명도 대비 4.5:1 이상)

```html
<!-- ✅ 올바른 ARIA -->
<button class="btn" role="button" aria-label="메뉴 열기" aria-expanded="false">
  <i data-lucide="menu"></i>
</button>

<!-- ❌ 잘못된 예 -->
<div class="btn-fake" onclick="...">클릭</div>
```

### 키보드 네비게이션
| 컴포넌트 | 필수 키 | 동작 |
|---------|--------|------|
| Button | Enter, Space | 활성화 |
| Checkbox/Radio | Space | 선택 토글 |
| Select/Dropdown | Enter, Arrow Up/Down, Esc | 열기/닫기, 이동, 닫기 |
| Modal | Esc | 닫기, Trap Focus |
| Tabs | Arrow Left/Right (수평), Home, End | 탭 전환 |
| Accordion | Enter/Space, Arrow Up/Down | 토글, 항목 이동 |

---

## 6. CSS 독립성 (Level 2)

### 규칙
- **필수**: `tokens.css` + `components/xxx.css`만으로 스타일 완성
- **허용**: `layout.css` 공통 사용, 다크/라이트 모드는 CSS 변수 기반
- **금지**:
  - 컴포넌트 CSS 간 교차 참조 (e.g., button.css에서 .input 선택자 참조)
  - 다른 컴포넌트 클래스명 사용
  - 인라인 스타일 (style="...")
  - !important 남용

### CSS 변수 (tokens.css)
```css
/* 라이트/다크 모드 동시 정의 */
:root[data-theme="light"] {
  --color-primary: #3b82f6;
  --color-text: #1f2937;
  --spacing-sm: 0.5rem;
}

:root[data-theme="dark"] {
  --color-primary: #60a5fa;
  --color-text: #f3f4f6;
  --spacing-sm: 0.5rem;
}

/* 사용 */
.btn {
  background-color: var(--color-primary);
  color: var(--color-text);
  padding: var(--spacing-sm);
}
```

### 반응형 디자인
```css
/* 모바일 우선 (Mobile First) */
.card {
  grid-column: 1 / -1;  /* 모바일: 전체 너비 */
}

@media (min-width: 768px) {
  .card {
    grid-column: span 3;  /* 태블릿: 3열 */
  }
}

@media (min-width: 1024px) {
  .card {
    grid-column: span 2;  /* 데스크탑: 2열 */
  }
}
```

---

## 7. JS 독립성 (Level 2)

### 컴포넌트 간 의존 규칙

| 관계 | 상황 | 허용 여부 |
|-----|------|---------|
| Button ↔ Input | 같은 폼 범주 | ❌ 금지 |
| Button → ModalManager | Manager 클래스 | ✅ 허용 |
| ButtonDemo ↔ InputDemo | 같은 범주 Demo | ❌ 금지 |
| AnyDemo → EventBus | 느슨한 결합 | ✅ 권장 |
| Modal ↔ ModalManager | 기본 Manager | ✅ 허용 |

### EventBus 사용 패턴 (느슨한 결합)
```javascript
// ❌ 강한 결합 (금지)
class CheckboxDemo extends Component {
  _onChange() {
    // 다른 Demo의 메서드 직접 호출
    inputDemo.updateValue(this.value);  // ❌ 금지
  }
}

// ✅ 느슨한 결합 (권장)
class CheckboxDemo extends Component {
  _onChange() {
    // EventBus로 이벤트 발행
    eventBus.emit('checkbox:change', { value: this.value });
  }
}

class InputDemo extends Component {
  afterMount() {
    // 다른 Demo의 이벤트 구독
    eventBus.on('checkbox:change', (data) => {
      this.updateValue(data.value);
    });
  }
}
```

---

## 8. 워크플로우 표준

### Task 기반 개발
1. **`docs/ROADMAP.md` 확인**: 현재 Task 번호, 의존성, 예상 소요 시간
2. **Task 파일 참조**: `/tasks/XXX-description.md`에서 명세서 확인
3. **구현**: 명세서의 "## 구현 가이드" 섹션 따르기
4. **테스트**: "## 테스트 체크리스트" 섹션으로 Playwright MCP 테스트
5. **진행 업데이트**: Task 파일의 완료된 단계에 체크 표시
6. **로드맵 갱신**: ROADMAP.md의 진행 현황 업데이트

### Task 파일 구조 (참고: /tasks/000-sample.md)
```markdown
# Task 001: 폴더 구조 생성 및 프로젝트 초기화

## 명세서
- 요구사항 1
- 요구사항 2

## 구현 가이드
### 단계 1: 디렉토리 생성
- assets/css/
- assets/js/

### 단계 2: 파일 생성
- index.html

## 테스트 체크리스트
- [ ] 모든 디렉토리 생성 확인
- [ ] HTTP 서버로 index.html 로드 확인

## 진행 상황
- [x] 단계 1: 디렉토리 생성
- [ ] 단계 2: 파일 생성
- [ ] 단계 3: 테스트
```

### Playwright MCP 테스트 시나리오
모든 컴포넌트 Task는 다음을 포함:

```markdown
## 테스트 체크리스트 (Playwright MCP)

### 상호작용 테스트
- [ ] 컴포넌트 렌더링 확인
- [ ] 클릭/입력 이벤트 동작
- [ ] 상태 변경 반영

### 접근성 테스트
- [ ] 키보드 네비게이션 완전 동작
- [ ] ARIA 속성 검증
- [ ] 스크린리더 아웃풋 확인

### 다크/라이트 모드 테스트
- [ ] 테마 전환 시 색상 즉시 반영
- [ ] localStorage에 저장됨
```

---

## 9. AI 의사결정 기준

### 우선순위 (낮음 → 높음)
1. 추측, 가정 (최악)
2. 웹 검색, 일반적 지식
3. 프로젝트 코드 참조
4. Task 파일 명세서
5. ROADMAP.md의 구현 가이드
6. PRD.md의 명시적 요구사항 (최고)

### 모호한 상황 처리
| 상황 | 우선순위 |
|------|---------|
| 코드 스타일 모호 | ROADMAP.md Phase 0 Task 002 (토큰/스타일) |
| 컴포넌트 구조 모호 | ROADMAP.md Phase 1 Task 003 (Component 기본 클래스) |
| ARIA 속성 미정 | 해당 Task의 "## 구현 가이드" 섹션 |
| CSS 변수명 미정 | tokens.css 기존 정의 따르기 |

### Framework/라이브러리 추가
- **원칙**: 절대 금지
- **예외 검토**: PRD.md 재확인, 필요성 극도로 정당화 필요
- **거부 기준**: "Lucide Icons CDN만 허용"이 명시되어 있음

---

## 10. 금지 사항 (⚠️ 필수 준수)

### 기술적 금지
- ❌ npm 패키지 설치 (Lucide Icons CDN 외)
- ❌ React, Vue, Angular 등 프레임워크 도입
- ❌ TypeScript 도입 (순수 JavaScript만)
- ❌ 번들러 도입 (webpack, Vite, Rollup 등)
- ❌ 빌드 도구 사용 (Gulp, Grunt 등)
- ❌ Task Runner 도입 (npm scripts는 HTTP 서버 실행만)

### 코드 구조 금지
- ❌ 컴포넌트 간 강한 결합 (Demo 클래스 직접 호출)
- ❌ CSS 컴포넌트 간 교차 참조
- ❌ 순환 의존 (import A → B → A)
- ❌ 전역 변수 (모든 상태는 클래스 속성 또는 Manager)
- ❌ eval() 사용

### 성능/UX 금지
- ❌ FOUC(Flash of Unstyled Content) 발생 (head에 초기화 스크립트 필수)
- ❌ FOUT(Flash of Unstyled Text) 발생
- ❌ 과도한 동기 작업 (DOM 접근 최소화)
- ❌ 메모리 누수 (destroy()에서 이벤트 리스너 제거)

### 접근성 금지
- ❌ ARIA 속성 없는 커스텀 컴포넌트
- ❌ 마우스만으로 조작 가능한 기능
- ❌ 명도 대비 4.5:1 미만
- ❌ 포커스 표시 제거

---

## 11. 다크/라이트 모드 규칙

### 구현 방식
1. **HTML 속성**: `<html data-theme="light|dark">`
2. **CSS 변수**: `:root[data-theme="light|dark"]` 정의
3. **localStorage 키**: `uig-theme`
4. **첫 방문**: `window.matchMedia('(prefers-color-scheme: dark)').matches` 감지

### 초기화 순서 (FOUC 방지)
```html
<head>
  <!-- 1. 최상단: FOUC 방지 인라인 스크립트 -->
  <script>
    const theme = localStorage.getItem('uig-theme') ||
                  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  </script>

  <!-- 2. 스타일시트 로드 -->
  <link rel="stylesheet" href="assets/css/tokens.css">
  <link rel="stylesheet" href="assets/css/reset.css">
</head>
```

### 전환 애니메이션
- `prefers-reduced-motion` 존중
- 존중할 경우: 애니메이션 제거
- 미존중할 경우: `transition: all 0.3s ease` 정도 허용

---

## 12. 주요 파일 상호작용

### 필수 다중 파일 조정

| 작업 | 영향 파일 |
|------|----------|
| 새 컴포넌트 추가 | `assets/js/demos/XXXDemo.js` + `assets/css/components/xxx.css` + `docs/ROADMAP.md` |
| 디자인 토큰 변경 | `assets/css/tokens.css` (모든 컴포넌트에 영향) |
| Router 라우트 추가 | `assets/js/core/Router.js` + `assets/js/pages/DashboardPage.js` |
| 레이아웃 변경 | `assets/css/layout.css` + `index.html` |
| 테마 변수 추가 | `assets/css/tokens.css` + 해당 컴포넌트 CSS |

### 동시 수정 체크리스트
- [ ] CSS 변경 시 다크/라이트 모드 모두 검증
- [ ] 컴포넌트 추가 시 ROADMAP.md의 디렉토리 목록 업데이트
- [ ] HTML 구조 변경 시 ARIA 속성도 함께 검토
- [ ] 라우팅 추가 시 사이드바 메뉴에 항목 추가

---

## 13. 참고 자료

- **ROADMAP.md**: 32개 Task의 상세 명세 및 의존성 다이어그램
- **PRD.md**: 제품 요구사항 명세 (섹션 14: 미결 의사결정 3개 완료)
- **Task 파일**: `/tasks/` 디렉토리의 각 개별 Task 명세
- **실행 방법**: `python -m http.server 8000` (로컬 HTTP 서버)

---

**문서 버전**: v1.0 | **작성일**: 2026-04-16 | **기준**: ROADMAP.md v1.1, PRD.md v1.2
**AI 의사결정 자동화 완료**: 프레임워크 선택 금지, 라이브러리 추가 금지, ES6 Modules 강제
