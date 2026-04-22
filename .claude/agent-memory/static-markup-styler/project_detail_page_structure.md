---
name: Detail Page 구조 패턴
description: pages/*.html 컴포넌트 상세 페이지의 레이아웃, CSS 클래스, JS 연동 패턴
type: project
---

## Detail Page 표준 구조

**파일 위치:** `pages/[component].html`

**CSS 로드 순서 (상대경로 `../assets/css/`):**
1. `tokens.css` — CSS 변수(색상, 간격, 타이포 등)
2. `reset.css` — 브라우저 스타일 초기화
3. `common.css` — 헤더/사이드바/레이아웃/CodeBlock 공통 스타일
4. `components/[component].css` — 컴포넌트 전용 스타일만 추가

**JS 로드 순서 (상대경로 `../assets/js/`):**
1. `https://unpkg.com/lucide@latest/dist/umd/lucide.min.js` — Lucide CDN
2. `components/code-block.js` — CodeBlock 탭/복사/토글
3. `common.js` — 테마 토글, 사이드바 active, CodeBlock 초기화, 아이콘 렌더링

**레이아웃 클래스 구조:**
```
.main-container
  main#main.main
    .detail-page                  ← max-width:1400px, padding, 2단 flex
      aside.detail-sidebar        ← width:240px, sticky, 사이드바 nav
      div.detail-main             ← flex:1, min-width:0
        article.demo-page         ← aria-labelledby="detail-title"
          header.detail-header    ← 뒤로가기 링크, h1, 설명
          section.demo-section    ← 8개 섹션
          footer.detail-footer    ← 이전/다음 네비게이션
```

**사이드바 네비게이션:**
- `initSidebarNav()`가 현재 URL 기반으로 `.nav-link.active` 자동 적용
- `href="./button.html"` (상대경로) 형식 사용
- 카테고리: 폼 요소(7개), 레이아웃(5개), 피드백(6개)

**FOUC 방지 스크립트 (head 최상단):**
```js
const theme = localStorage.getItem('uig-theme');
const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
document.documentElement.setAttribute('data-theme', theme || (systemDark ? 'dark' : 'light'));
```

## Demo Section 패턴

각 섹션(`section.demo-section`)에:
- `id="section-[name]"` + `aria-labelledby="heading-[name]"` 쌍
- `h2#heading-[name].demo-section-title`
- `p.demo-description` — 설명 텍스트
- `div.demo-preview[role="group"][aria-label="..."]` — 데모 버튼들
- `div[data-code-block]` — CodeBlock 컴포넌트

## CodeBlock 마크업 패턴

`[data-code-block]` 속성 div에 `data-html`, `data-css`, `data-js` 속성으로 코드 저장.
내부에 `.code-block` 구조를 직접 마크업하여 JS 비활성화 시에도 코드 표시 가능.

```html
<div data-code-block data-html='...' data-css='...' data-js='...'>
  <div class="code-block">
    <div class="code-block__header" role="tablist">
      <button class="code-block__tab active" role="tab" data-code-block-tab="html" aria-selected="true">HTML</button>
      <button class="code-block__tab" role="tab" data-code-block-tab="css" aria-selected="false">CSS</button>
      <button class="code-block__tab" role="tab" data-code-block-tab="js" aria-selected="false">JS</button>
    </div>
    <div class="code-block__panels">
      <div class="code-block__panel" data-code-block-panel="html" role="tabpanel" aria-expanded="true">
        <pre class="code-block__content">...</pre>
      </div>
      <!-- css, js 패널 동일 구조 (aria-expanded="false") -->
    </div>
    <div class="code-block__footer">
      <button class="code-block__toggle" data-code-expand aria-expanded="false">View Code</button>
      <button class="code-block__copy" data-code-copy aria-label="코드 복사">Copy</button>
    </div>
  </div>
</div>
```

**Why:** code-block.js의 `CodeBlock.init()`이 `[data-code-block]` 요소를 탐색하여 탭/토글/복사 이벤트 바인딩.
`data-initialized` 속성으로 중복 초기화 방지. common.js에서 `initCodeBlocks()` 자동 호출.

**How to apply:** 새 컴포넌트 페이지 생성 시 이 구조를 그대로 복제하여 사용.
CSS/JS 상대 경로는 `../assets/` 기준으로 작성.
