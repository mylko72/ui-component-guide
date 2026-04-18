# Web UI Component Guide 개발 로드맵

프레임워크 없이 순수 HTML/CSS/ES6 클래스 기반으로 구현하는 한국형 웹접근성(KWCAG 2.2) 준수 UI 컴포넌트 가이드

## 개요

**Web UI Component Guide**는 프레임워크 도입이 어려운 환경의 프론트엔드 개발자, 웹접근성 담당자, 프로토타이핑 개발자를 위한 UI 컴포넌트 레퍼런스로 다음 기능을 제공합니다:

- **18개 컴포넌트 가이드**: 폼 요소(7), 레이아웃(5), 피드백(6) 컴포넌트의 라이브 데모 + HTML/CSS/JS 소스코드
- **즉시 복사/재사용**: 탭별 소스코드 확인, 클립보드 복사, 컴포넌트 독립 추출(Level 2)
- **접근성 완비**: KWCAG 2.2 준수, ARIA 패턴, 키보드 내비게이션, 다크/라이트 모드
- **의존성 제로**: npm 불필요, Lucide Icons CDN만 허용, 브라우저에서 직접 실행

### 기술 스택

| 항목 | 내용 |
|------|------|
| 기술 | 순수 HTML5 + CSS3 + JavaScript ES6+ |
| 라이브러리 | Lucide Icons CDN (유일한 예외) |
| 접근성 | KWCAG 2.2, Lighthouse 95점+ |
| 반응형 | 360px ~ 1440px |
| 테마 | 다크/라이트 모드 (localStorage 저장) |

### 예상 일정

| 항목 | 값 |
|------|---|
| 총 예상 기간 | 8~9일 |
| 구현 컴포넌트 | 18개 |
| Coming Soon | 6개 (카드만 표시) |

---

## 개발 워크플로우

1. **작업 계획**
   - 기존 코드베이스를 학습하고 현재 상태를 파악
   - 새로운 작업을 포함하도록 `ROADMAP.md` 업데이트
   - 우선순위 작업은 마지막 완료된 작업 다음에 삽입

2. **작업 생성**
   - 기존 코드베이스를 학습하고 현재 상태를 파악
   - `/tasks` 디렉토리에 새 작업 파일 생성
   - 명명 형식: `XXX-description.md` (예: `001-setup.md`)
   - 고수준 명세서, 관련 파일, 수락 기준, 구현 단계 포함
   - API/비즈니스 로직 작업 시 "## 테스트 체크리스트" 섹션 필수 포함 (Playwright MCP 테스트 시나리오 작성)
   - 예시를 위해 `/tasks` 디렉토리의 마지막 완료된 작업 참조

3. **작업 구현**
   - 작업 파일의 명세서를 따름
   - 기능과 기능성 구현
   - Playwright MCP로 주요 인터랙션 및 접근성 테스트 수행
   - 각 단계 후 작업 파일 내 단계 진행 상황 업데이트
   - 각 단계 완료 후 중단하고 추가 지시를 기다림

4. **로드맵 업데이트**
   - 로드맵에서 완료된 작업을 완료 표시로 갱신

---

## 의사결정 완료 (2026-04-16)

> PRD 섹션 14의 미결 질문 3개가 확정되었습니다. 개발 착수 가능합니다.

| ID | 질문 | 결정 | 상태 |
|----|------|------|------|
| Q-A | JS 파일 로딩 방식 (전역 네임스페이스 vs ES6 Modules) | **ES6 Modules** | ✅ 확정 |
| Q-B | 컴포넌트 독립성 Level 2 범위 (CSS만 vs CSS+JS) | **CSS + JS 독립** | ✅ 확정 |
| Q-C | 다크모드 첫 방문 초기값 (시스템 감지 vs 항상 라이트) | **시스템 감지 자동 적용** | ✅ 확정 |

---

## 개발 단계

### Phase 0: 프로젝트 세팅 (0.5일) ✅

- **Task 001: 폴더 구조 생성 및 프로젝트 초기화** ✅ - 완료
  - ✅ PRD 섹션 5 기준 전체 디렉토리/파일 구조 생성
  - ✅ `index.html` 기본 쉘 작성 (CSS/JS 로딩 순서 정의)
  - ✅ `assets/css/`, `assets/js/core/`, `assets/js/theme/`, `assets/js/ui/`, `assets/js/demos/`, `assets/js/pages/` 디렉토리 생성
  - ✅ 18개 컴포넌트 CSS 빈 파일 + 18개 Demo JS 빈 파일 생성
  - 예상 소요: 0.25일
  - 의존성: 없음

- **Task 002: 디자인 토큰 및 기본 스타일시트 구축** ✅ - 완료
  - ✅ `tokens.css` 작성: 라이트/다크 CSS 변수 전체 (색상, 타이포그래피, 간격, 그림자, 전환 속도)
  - ✅ `reset.css` 작성: 브라우저 리셋 + 기본 스타일 (Pretendard 폰트, box-sizing 등)
  - ✅ FOUC 방지 인라인 스크립트 작성 (`<head>` 최상단)
  - ✅ Lucide Icons CDN 연결 및 동작 확인
  - 예상 소요: 0.25일
  - 의존성: Task 001

### Phase 1: 코어 클래스 구현 (1일) ✅

- **Task 003: EventBus 및 Component 기본 클래스 구현** ✅ - 완료
  - ✅ `EventBus.js`: pub/sub 이벤트 시스템 (`on`, `off`, `emit`, `clear`) — ES6 named export
  - ✅ `Component.js`: 기본 클래스 (`render`, `mount`, `afterMount`, `destroy`, `_query`, `_addEventListener`, `_removeEventListener`, `setState`) — ES6 default export
  - ✅ ES6 Modules 방식: `export class EventBus {}` / `export default class Component {}`
  - ✅ 내부 저장소: Map 기반 이벤트별 콜백 배열 관리
  - ✅ 메모리 관리: EventBus `off()` 완전 제거, Component `destroy()` 전체 정리
  - ✅ 에러 처리: emit 콜백 실행 중 예외 catch, 로깅
  - 예상 소요: 0.3일
  - 의존성: Task 001

- **Task 004: Router 구현 (해시 기반 SPA)** ✅ - 완료
  - ✅ `Router.js`: 해시 기반 라우터 (`constructor`, `navigate`, `back`, `_handleHashChange`)
  - ✅ 18개 컴포넌트 라우트 등록 (`#/button`, `#/input`, ... `#/skeleton`)
  - ✅ 대시보드 라우트 (`#/`)
  - ✅ 브라우저 뒤로/앞으로 가기 정상 동작 확인
  - 예상 소요: 0.3일
  - 의존성: Task 003 (EventBus)

- **Task 005: ThemeManager 구현 (다크/라이트 모드)** ✅ - 완료
  - ✅ `ThemeManager.js`: `init`, `apply`, `toggle`, `getCurrent`, `getSystemPreference` — ES6 export
  - ✅ `<html data-theme="dark|light">` 속성 제어
  - ✅ localStorage `uig-theme` 키 저장/복원
  - ✅ 첫 방문: OS `prefers-color-scheme` 감지 → 다크/라이트 자동 결정 → localStorage 저장 ✅ (Q-C 확정)
  - ✅ `prefers-reduced-motion` 존중하는 전환 애니메이션
  - 예상 소요: 0.2일
  - 의존성: Task 002 (tokens.css)

- **Task 006: App.js 진입점 컨트롤러 구현** ✅ - 완료
  - ✅ `App.js`: `_initTheme`, `_initLayout`, `_initRouter`, `_initLucide`
  - ✅ 헤더 렌더링 골격 (로고, 가이드명, 버전, 테마 토글, GitHub 링크)
  - ✅ DOMContentLoaded 시 App 초기화
  - ✅ `lucide.createIcons()` 래퍼 (페이지 전환 시 재호출)
  - 예상 소요: 0.2일
  - 의존성: Task 003, Task 004, Task 005

### Phase 2: 공통 UI 및 레이아웃 (1일) ✅

- **Task 007: 앱 레이아웃 CSS 기반 구축 (헤더 + 사이드바)** ✅ - 완료
  > **주요 결정**: 메인화면(대시보드)과 서브화면(상세 페이지)은 **서로 다른 레이아웃**을 사용합니다.
  > - **메인화면**: 헤더만, 사이드바 없음, 중앙 정렬 (Task 010)
  > - **서브화면**: 헤더 + 좌 사이드바(240px) + 우 콘텐츠 2단 레이아웃 (Task 011)
  
  - ✅ `layout.css` 작성: 재사용 가능한 CSS 컴포넌트 (헤더, 사이드바 등)
  - ✅ **헤더 UI 완성**: 로고 + 가이드명 + spacer + 버전 배지 + 테마 토글 버튼 + GitHub 링크
    - ✅ 테마 토글 버튼: `aria-label` 동적 변경, 아이콘 전환 (moon/sun)
  - ✅ **사이드바 UI**: 카테고리별 컴포넌트 목록 (폼 요소/레이아웃/피드백), 현재 페이지 활성 표시
    - ✅ 240px 고정폭, sticky 포지셀
    - ✅ 모바일 시 슬라이드 오버레이 (햄버거 메뉴)
  - ✅ **건너뛰기 링크** (`.skip-nav`) 구현
  - ✅ **반응형**: Desktop(1024px+), Tablet(768~1023px), Mobile(<768px)
  - ✅ Playwright MCP 테스트: 헤더/사이드바 렌더링, 반응형 레이아웃
  - 예상 소요: 0.4일
  - 의존성: Task 006

- **Task 008: CodeBlock 컴포넌트 구현 (탭 전환 + 확장형)** ✅ - 완료
  - ✅ `CodeBlock.js` + `code-block.css` 구현
  - ✅ HTML/CSS/JS 탭 전환 (해당 코드가 없는 탭은 숨김)
  - ✅ 기본 8줄 미리보기 + 하단 페이드 오버레이
  - ✅ View Code/Hide Code 토글 (`max-height` CSS transition)
  - ✅ Copy 버튼: `navigator.clipboard.writeText()` + fallback `execCommand('copy')` + "Copied!" 2초 피드백
  - ✅ 코드 배경 다크 고정 (`#1e293b`), plain text monospace
  - ✅ ARIA: `role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-expanded`, `aria-controls`
  - ✅ 키보드: Arrow Left/Right 탭 전환, Home/End, Enter/Space
  - ✅ Playwright MCP 테스트: 탭 전환 동작, 확장/축소, 복사 기능, 키보드 접근성
  - 예상 소요: 0.3일
  - 의존성: Task 003 (Component)

- **Task 009: ToastManager 및 ModalManager 구현** ✅ - 완료
  - ✅ `ToastManager.js`: Singleton, `show({message, type, duration, action})`, `dismiss(id)`, `_render`
  - ✅ Toast ARIA: `aria-live="polite"` (Info/Success), `aria-live="assertive"` (Error)
  - ✅ `ModalManager.js`: Singleton, `open({title, content, onConfirm, onCancel, size})`, `close`, `_trapFocus`
  - ✅ Modal 포커스 트랩: 열림 시 내부 순환, 닫힘 시 트리거 복원, Esc 닫기, `body.overflow` 제어
  - ✅ Modal ARIA: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, `aria-hidden` 외부 콘텐츠
  - ✅ Playwright MCP 테스트: Toast 표시/자동 닫힘, Modal 열기/닫기/포커스 트랩/Esc 키
  - 예상 소요: 0.3일
  - 의존성: Task 003 (Component)

### Phase 3: 대시보드 페이지 — 메인 화면 및 진입점 (0.5일) ✅

> **주요 결정사항**: 대시보드는 별개의 서브 화면이 아닌 **메인 화면이자 진입점**입니다. (PRD T-06)
> 사용자는 접속 시 곧바로 대시보드 카드 그리드를 보게 되며, 각 카드 클릭 → 상세 페이지 이동 구조입니다.

- **Task 010: DashboardPage 구현 (메인 화면)** ✅ - 완료
  > **메인화면의 특별한 레이아웃**: 서브화면과 달리 사이드바가 없고, 컨텐츠는 화면 중앙에 정렬됩니다.
  > 참고: https://nextjs.org/ (상단 텍스트 + 아래 카드 그리드)
  
  - ✅ `DashboardPage.js` + `dashboard.css` 구현
  - ✅ **화면 구성**: 헤더 **ONLY** (사이드바 없음) + 중앙 정렬 카드 그리드
  - ✅ **상단 카피 섹션**: 
    - h1: "Web UI Component Guide" (프로젝트 제목)
    - 한 줄 설명 + 핵심 가치 포인트
  - ✅ **반응형 카드 그리드**: `auto-fill`, `minmax(200px, 1fr)` 
    - 모바일(< 768px): 1~2열
    - 태블릿(768px ~ 1023px): 3열
    - 데스크탑(≥ 1024px): 4열 이상
  - ✅ **카드 요소**: Lucide 아이콘 + 컴포넌트명 + 간단한 설명 + 사용빈도(★별점) + 상태 배지
  - ✅ **카테고리별 섹션**: 
    - 폼 요소 (7개)
    - 레이아웃 (5개)
    - 피드백 (6개)
    - 탐색 (Coming Soon 카드만)
    - 데이터 (Coming Soon 카드만)
  - ✅ **구현 컴포넌트 카드** (18개): 클릭/Enter/Space 시 해당 상세 페이지(`#/button`, `#/input` 등)로 라우팅 (이벤트 위임 패턴)
  - ✅ **Coming Soon 카드** (6개): 비활성 스타일, 클릭 불가(`aria-disabled="true"` 감지), "Coming Soon" 배지, 상세 페이지 없음
  - ✅ **상세 페이지 CSS 준비**: `detail.css` 스켈레톤 생성 (향후 서브화면 2단 레이아웃 구조 가이드 주석 포함)
  - ✅ **App.js**: `window.router` 전역 노출 (데모/콘솔 테스트용, `toastManager`/`modalManager`와 동일 방식)
  - ✅ **메모리 관리**: `destroy()` 시 이벤트 리스너 자동 제거 (`_addEventListener` 추적 활용), 핸들러 참조 null 해제
  - ✅ **테스트 시나리오 문서**: `tests/scenarios/dashboard.test-scenario.md` 작성 (6개 시나리오 + Playwright 구현 참고 코드)
  - 예상 소요: 0.5일
  - 의존성: Task 007 (헤더/사이드바 CSS), Task 006 (App/Router)

### Phase 4: 폼 요소 컴포넌트 구현 (2일)

> **Task 011의 특별 역할**: 첫 번째 컴포넌트 구현 시 **상세 페이지(DetailPage) 기본 구조**를 함께 구현합니다.
> Task 012 이후는 DetailPage 구조를 재사용하여 빠르게 진행합니다.

- **Task 011: Button 컴포넌트 + DetailPage 서브화면 기본 구조** - 우선순위
  > **서브화면 레이아웃**: 메인화면과 달리 사이드바가 있는 2단 레이아웃입니다. (PRD T-07)
  > 참고: https://my-vue-component.netlify.app/tab
  
  - **Button 컴포넌트**:
    - `ButtonDemo.js` + `assets/css/components/button.css` 구현
    - 변형: Primary / Secondary / Outline / Ghost / Danger / Icon 버튼 / Loading / Disabled / sm/md/lg
    - 컴포넌트 독립성 검증: `tokens.css` + `button.css`만으로 스타일 완성
  - **DetailPage.js 서브화면 기본 구조 구현** (최초 1회, Task 012~028에서 재사용):
    - **2단 레이아웃**: 헤더 + [좌: 사이드바(240px) | 우: 콘텐츠 영역]
    - **좌 사이드바**: 컴포넌트 목록 네비게이션 (현재 페이지 활성 표시)
    - **우 콘텐츠 영역**:
      - `h1`: 컴포넌트명 + 간단한 설명 + 태그(ARIA, 키보드 등) 표시
      - `h2`: 각 데모 변형별 제목 (예: "기본 사용법", "크기 변형")
      - 데모 미리보기 영역: 반응형, 가로 스크롤 없음
      - CodeBlock 컴포넌트 연동: HTML/CSS/JS 탭 전환, 확장/축소, 복사 기능
    - **모바일 반응형** (<768px): 사이드바 숨김 → 햄버거 메뉴 + 슬라이드 오버레이
  - **Playwright MCP 테스트**:
    - Button 모든 변형 렌더링 확인
    - 클릭 인터랙션, Disabled 상태, 키보드 접근 확인
    - DetailPage 레이아웃: 2단 레이아웃 구조 확인, 사이드바 네비게이션 작동
    - 모바일 반응형: 사이드바 숨김 확인, 햄버거 메뉴 동작
    - CodeBlock: 탭 전환, 확장/축소, 복사 기능 동작 확인
  - 예상 소요: 0.4일
  - 의존성: Task 008 (CodeBlock), Task 010 (Dashboard)

- **Task 012: Input 컴포넌트 구현**
  - `InputDemo.js` + `assets/css/components/input.css` 구현
  - 변형: Default / 레이블+도움말 / Error / Leading Icon / Trailing Icon / 비밀번호(토글) / Disabled
  - ARIA: `aria-invalid`, `aria-describedby`, `<label for>` 연결
  - DetailPage에 Input 데모 페이지 구성 (Task 011의 구조 재사용)
  - Playwright MCP 테스트: 입력 동작, 에러 상태, 비밀번호 토글, 접근성 속성 확인
  - 예상 소요: 0.3일
  - 의존성: Task 011 (DetailPage 구조 확정)

- **Task 013: Checkbox 컴포넌트 구현**
  - `CheckboxDemo.js` + `assets/css/components/checkbox.css` 구현
  - 변형: Default / Group / Indeterminate
  - ARIA: `role="checkbox"`, `aria-checked="mixed"` (indeterminate)
  - 키보드: Space 토글
  - Playwright MCP 테스트: 체크/언체크, Indeterminate 상태, 그룹 동작
  - 예상 소요: 0.2일
  - 의존성: Task 011

- **Task 014: Radio 컴포넌트 구현**
  - `RadioDemo.js` + `assets/css/components/radio.css` 구현
  - 변형: Default / Group / 세로 배치 / Disabled
  - ARIA: `role="radiogroup"`, `role="radio"`
  - 키보드: Arrow Up/Down 이동, Space 선택
  - Playwright MCP 테스트: 라디오 선택, 그룹 내 단일 선택, 키보드 탐색
  - 예상 소요: 0.2일
  - 의존성: Task 011

- **Task 015: Switch 컴포넌트 구현**
  - `SwitchDemo.js` + `assets/css/components/switch.css` 구현
  - 변형: Default / 레이블 포함 / sm/lg / Disabled
  - ARIA: `role="switch"`, `aria-checked`
  - 키보드: Space/Enter 토글
  - Playwright MCP 테스트: 토글 동작, 크기 변형, Disabled 상태
  - 예상 소요: 0.2일
  - 의존성: Task 011

- **Task 016: Select 컴포넌트 구현 (커스텀 드롭다운)**
  - `SelectDemo.js` + `assets/css/components/select.css` 구현
  - 완전 커스텀 구현 (네이티브 `<select>` 미사용)
  - 변형: Default / 검색 포함 / 비활성
  - ARIA Combobox Pattern: `role="combobox"`, `aria-expanded`, `aria-haspopup="listbox"`, `role="listbox"`, `role="option"`, `aria-selected`, `aria-activedescendant`
  - 키보드: Enter/Space 열기/닫기, Arrow Down/Up 이동, Home/End, Esc 닫기, Typeahead
  - Playwright MCP 테스트: 열기/닫기, 옵션 선택, 검색 필터, 키보드 전체 동작, ARIA 속성 검증
  - 예상 소요: 0.4일
  - 의존성: Task 011

- **Task 017: Textarea 컴포넌트 구현**
  - `TextareaDemo.js` + `assets/css/components/textarea.css` 구현
  - 변형: Default / 자동 높이 / 글자수 카운터 / Disabled
  - ARIA: `aria-describedby` (글자수, 도움말)
  - Playwright MCP 테스트: 입력, 자동 높이 조절, 글자수 카운트, Disabled 상태
  - 예상 소요: 0.2일
  - 의존성: Task 011

### Phase 5: 레이아웃 컴포넌트 구현 (1.5일)

- **Task 018: Card 컴포넌트 구현** - 우선순위
  - `CardDemo.js` + `assets/css/components/card.css` 구현
  - 변형: 기본 / 헤더+푸터 / 가로형 / 인터랙티브
  - Playwright MCP 테스트: 각 변형 렌더링, 인터랙티브 카드 동작
  - 예상 소요: 0.2일
  - 의존성: Task 011

- **Task 019: Accordion 컴포넌트 구현**
  - `AccordionDemo.js` + `assets/css/components/accordion.css` 구현
  - 변형: 단일 열림 / 다중 열림 / 아이콘 포함
  - ARIA: `aria-expanded`, `aria-controls`, `aria-labelledby`
  - 키보드: Enter/Space 토글, Arrow Up/Down 항목 이동
  - Playwright MCP 테스트: 열기/닫기, 단일/다중 모드, 키보드 탐색
  - 예상 소요: 0.3일
  - 의존성: Task 011

- **Task 020: Tabs 컴포넌트 구현**
  - `TabsDemo.js` + `assets/css/components/tabs.css` 구현
  - 변형: 수평 기본 / 언더라인 / Pills / 수직
  - ARIA: `role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected`
  - 키보드: Arrow Left/Right(수평) 또는 Arrow Up/Down(수직) 탭 전환, Home/End
  - Playwright MCP 테스트: 탭 전환, 패널 콘텐츠 변경, 키보드 탐색, ARIA 상태
  - 예상 소요: 0.3일
  - 의존성: Task 011

- **Task 021: Modal 컴포넌트 구현**
  - `ModalDemo.js` + `assets/css/components/modal.css` 구현
  - 변형: 기본 / 폼 포함 / 확인 다이얼로그
  - ModalManager 연동 (예외적 의존 허용)
  - ARIA: `role="dialog"`, `aria-modal`, `aria-labelledby`
  - 포커스 트랩: 열림 시 내부 순환, 닫힘 시 트리거 복원, Esc 닫기
  - `body.overflow` 제어, 외부 콘텐츠 `aria-hidden`
  - Playwright MCP 테스트: 열기/닫기, 포커스 트랩 순환, Esc 키, 오버레이 클릭 닫기
  - 예상 소요: 0.3일
  - 의존성: Task 009 (ModalManager), Task 011

- **Task 022: Dropdown 컴포넌트 구현**
  - `DropdownDemo.js` + `assets/css/components/dropdown.css` 구현
  - 변형: 기본 / 아이콘 포함 / 구분선 / 비활성 항목
  - ARIA: `role="menu"`, `role="menuitem"`, `aria-haspopup`, `aria-expanded`
  - 키보드: Enter/Space 열기, Arrow Down/Up 이동, Esc 닫기
  - 외부 클릭 닫기
  - Playwright MCP 테스트: 열기/닫기, 항목 선택, 비활성 항목, 키보드 탐색, 외부 클릭
  - 예상 소요: 0.3일
  - 의존성: Task 011

### Phase 6: 피드백 컴포넌트 구현 (1.5일)

- **Task 023: Toast 컴포넌트 구현** - 우선순위
  - `ToastDemo.js` + `assets/css/components/toast.css` 구현
  - ToastManager 연동 (예외적 의존 허용)
  - 변형: Info / Success / Warning / Error / 액션 포함
  - ARIA: `aria-live="polite"` (Info/Success), `aria-live="assertive"` (Error)
  - 자동 닫힘 + 수동 닫기 버튼
  - Playwright MCP 테스트: 각 타입 표시, 자동 닫힘 타이밍, 수동 닫기, 스택 동작
  - 예상 소요: 0.25일
  - 의존성: Task 009 (ToastManager), Task 011

- **Task 024: Alert 컴포넌트 구현**
  - `AlertDemo.js` + `assets/css/components/alert.css` 구현
  - 변형: Info / Success / Warning / Error / 닫기 버튼
  - ARIA: `role="alert"`
  - Playwright MCP 테스트: 각 타입 렌더링, 닫기 버튼 동작
  - 예상 소요: 0.2일
  - 의존성: Task 011

- **Task 025: Badge 컴포넌트 구현**
  - `BadgeDemo.js` + `assets/css/components/badge.css` 구현
  - 변형: 색상 6종 / Outlined / Dot 인디케이터 / Sizes
  - Playwright MCP 테스트: 각 변형 렌더링, 크기 확인
  - 예상 소요: 0.15일
  - 의존성: Task 011

- **Task 026: Tooltip 컴포넌트 구현**
  - `TooltipDemo.js` + `assets/css/components/tooltip.css` 구현
  - 변형: 상/하/좌/우 위치 / 지연 표시
  - ARIA: `role="tooltip"`, `aria-describedby`
  - 호버 + 포커스 시 표시, 마우스 아웃 + 블러 시 숨김
  - Playwright MCP 테스트: 4방향 표시, 지연 동작, 키보드 포커스 표시
  - 예상 소요: 0.25일
  - 의존성: Task 011

- **Task 027: Progress 컴포넌트 구현**
  - `ProgressDemo.js` + `assets/css/components/progress.css` 구현
  - 변형: 선형 / 원형 / Indeterminate / 레이블
  - ARIA: `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
  - Playwright MCP 테스트: 값 변경 반영, Indeterminate 애니메이션, ARIA 속성
  - 예상 소요: 0.3일
  - 의존성: Task 011

- **Task 028: Skeleton 컴포넌트 구현**
  - `SkeletonDemo.js` + `assets/css/components/skeleton.css` 구현
  - 변형: 텍스트 / 카드 / 테이블 행 / 아바타
  - ARIA: `aria-busy="true"`, `aria-label="로딩 중"`
  - 펄스 애니메이션 (`@keyframes`)
  - Playwright MCP 테스트: 각 변형 렌더링, 애니메이션 동작, ARIA 속성
  - 예상 소요: 0.2일
  - 의존성: Task 011

### Phase 7: 마무리 및 품질 검증 (1일)

- **Task 029: 반응형 전체 검토 및 모바일 최적화** - 우선순위
  - 360px / 768px / 1024px / 1440px 에서 전체 페이지 검증
  - 대시보드 카드 그리드: 모바일 1~2열, 태블릿 3열, 데스크탑 4열+
  - 모바일 햄버거 메뉴 + 사이드바 슬라이드 오버레이 동작 확인
  - 데모 미리보기 영역: 가로 스크롤 없이 모든 화면에서 표시
  - 코드 블록 반응형 처리
  - Playwright MCP 테스트: 각 브레이크포인트에서 레이아웃 검증, 가로 스크롤 없음 확인
  - 예상 소요: 0.3일
  - 의존성: Phase 4~6 전체 완료

- **Task 030: 접근성 전체 검토 (KWCAG 2.2)**
  - 건너뛰기 링크 동작 확인
  - 모든 아이콘 `aria-hidden="true"` 또는 의미 있는 레이블 확인
  - 모든 인터랙티브 요소 키보드만으로 완전 조작 가능 확인
  - 모달 포커스 트랩 + Esc 닫기 + 트리거 복원 확인
  - 제목 계층 (h1 > h2 > h3) 논리적 순서 검증
  - 폼 레이블 연결 (`<label for>` 또는 `aria-labelledby`) 검증
  - Lighthouse Accessibility 95점 이상 (라이트/다크 모두)
  - 포커스 표시 `:focus-visible` 2px 링 (라이트/다크 모두 명확)
  - 명도 대비: 일반 텍스트 4.5:1 이상, 큰 텍스트 3:1 이상
  - Playwright MCP 테스트: 전체 키보드 내비게이션 플로우, ARIA 속성 일괄 검증
  - 예상 소요: 0.3일
  - 의존성: Task 029

- **Task 031: 다크모드 전체 검토 및 색상 대비 검증**
  - 모든 18개 컴포넌트 + 대시보드 + 코드 블록의 다크/라이트 모드 시각 검증
  - 색상 대비 기준 충족 확인 (다크 모드 포함)
  - 테마 전환 시 모든 색상 즉시 반영 확인
  - localStorage 저장/복원 확인 (새로고침 후 유지)
  - 첫 방문 시 OS 설정 감지 동작 확인
  - FOUC(깜박임) 없음 확인
  - Playwright MCP 테스트: 테마 토글 전환, localStorage 저장/복원, 색상 반영 확인
  - 예상 소요: 0.2일
  - 의존성: Task 029

- **Task 032: 컴포넌트 독립성 검증 (Level 2 — CSS + JS)** ✅ 확정
  - Level 1 검증: 각 Demo 클래스가 다른 Demo를 호출하지 않음 (Modal/Toast 예외)
  - **Level 2 CSS 검증**: `tokens.css` + `components/xxx.css` 만으로 스타일 완성 (18개 전체)
  - **Level 2 JS 검증**: `Component.js` + `XxxDemo.js` + `assets/js/core/` 필수 파일만으로 JS 기능 동작
  - CSS 교차 참조 확인: 컴포넌트 CSS가 타 컴포넌트 클래스를 참조하지 않음
  - 포터블 테스트: 최소 3개 컴포넌트(Button, Accordion, Modal)를 빈 HTML + 필수 JS에서 독립 동작 확인
  - ES6 Modules 구조에서 의존성 체인 검증 (import 추적)
  - Playwright MCP 테스트: 독립 HTML 파일에서 컴포넌트 렌더링 및 동작 확인
  - 예상 소요: 0.2일
  - 의존성: Task 030

---

## 완성 기준 체크리스트

### 기능

- [ ] 대시보드: 18개 구현 컴포넌트 카드 + 6개 Coming Soon 카드 노출
- [ ] 대시보드에서 카드 클릭 시 상세 페이지 이동
- [ ] 상세 페이지: 모든 컴포넌트 2개 이상 데모 변형 동작
- [ ] 코드 블록: HTML/CSS/JS 탭 전환 동작
- [ ] 코드 블록: 8줄 미리보기 > View Code > 확장 > Hide Code > 축소
- [ ] 클립보드 복사 동작 (성공 피드백 "Copied!" 2초)
- [ ] 브라우저 뒤로/앞으로 가기 정상 동작
- [ ] 모든 인터랙티브 컴포넌트 키보드만으로 완전 조작 가능

### 다크/라이트 모드

- [ ] 헤더 테마 토글 버튼 동작
- [ ] 전환 시 모든 색상 즉시 반영 (CSS 변수 기반)
- [ ] localStorage에 저장, 새로고침 후 유지
- [ ] 첫 방문 시 OS 설정 자동 감지 적용
- [ ] FOUC(깜박임) 없음

### 컴포넌트 독립성

- [ ] Level 1: 각 Demo 클래스가 다른 Demo를 호출하지 않음
- [ ] Level 2: `tokens.css` + `components/xxx.css` 만으로 CSS 스타일 완성
- [ ] Level 2: 각 컴포넌트 JS가 동일 범주 외 Demo에 의존하지 않음

### 접근성 (KWCAG 2.2)

- [ ] 건너뛰기 링크 동작
- [ ] 모든 아이콘 `aria-hidden="true"` 또는 의미 있는 레이블
- [ ] 모달 포커스 트랩 + Esc 닫기 + 트리거 포커스 복원
- [ ] Lighthouse Accessibility 95점 이상 (라이트/다크 모두)
- [ ] 주요 컴포넌트 스크린리더 동작 확인

### 반응형

- [ ] 360px ~ 1440px 가로 스크롤 없음
- [ ] 모바일 햄버거 메뉴 + 사이드바 슬라이드 동작

---

## 진행 현황 요약

| Phase | 구분 | Task 범위 | 예상 소요 | 진행률 | 상태 |
|-------|------|-----------|-----------|--------|------|
| Phase 0 | 프로젝트 세팅 | Task 001~002 | 0.5일 | 100% | ✅ 완료 |
| Phase 1 | 코어 클래스 | Task 003~006 | 1일 | 100% | ✅ 완료 |
| Phase 2 | 공통 UI/레이아웃 | Task 007~009 | 1일 | 100% | ✅ 완료 |
| Phase 3 | 대시보드 (메인 화면/진입점) | Task 010 | 0.5일 | 100% | ✅ 완료 |
| Phase 4 | 폼 요소 (7개) + DetailPage 구조 | Task 011~017 | 2일 | 0% | 대기 |
| Phase 5 | 레이아웃 (5개) | Task 018~022 | 1.5일 | 0% | 대기 |
| Phase 6 | 피드백 (6개) | Task 023~028 | 1.5일 | 0% | 대기 |
| Phase 7 | 마무리/검증 | Task 029~032 | 1일 | 0% | 대기 |
| **합계** | | **32개 Task** | **9일** | **31%** | |

---

## 의존성 다이어그램

```
Phase 0: 세팅
  Task 001 (폴더 구조) ─────┬───> Task 002 (토큰/스타일)
                            │
Phase 1: 코어              v
  Task 003 (EventBus/Component) ──┬──> Task 004 (Router)
          │                       │
          v                       v
  Task 005 (ThemeManager)   Task 006 (App.js) <── Task 004, 005
                                  │
Phase 2: 공통 UI                  v
  Task 007 (레이아웃) <────── Task 006
  Task 008 (CodeBlock) <───── Task 003
  Task 009 (Toast/Modal Manager) < Task 003
                                  │
Phase 3: 대시보드 (메인 화면)        v
  Task 010 (카드 그리드 대시보드) <── Task 007, 006
            ↓ (사용자 입장에서 진입점)
Phase 4~6: 컴포넌트                v
  Task 011 (Button + DetailPage 구조) <── Task 008, 010
  Task 012~028 <── Task 011 (DetailPage 구조 재사용)
  Task 021 (Modal) <── Task 009 (ModalManager)
  Task 023 (Toast) <── Task 009 (ToastManager)
                                  │
Phase 7: 마무리                   v
  Task 029 (반응형) <── Phase 4~6 전체
  Task 030 (접근성) <── Task 029
  Task 031 (다크모드) <── Task 029
  Task 032 (독립성) <── Task 030
```

---

*로드맵 버전: v1.2 | 작성일: 2026-04-16 | 최종 업데이트: 2026-04-18 | PRD 기준: v1.2 (2026-04-15) | 미결사항 확정: 2026-04-16*
**의사결정 완료**: Q-A(ES6 Modules) ✅ | Q-B(CSS+JS 독립) ✅ | Q-C(시스템 감지) ✅ → **개발 착수 가능**
**📊 진행 상황**: Phase 0~3 완료 (10/32 Tasks 완료, 31%)
