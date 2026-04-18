# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: code-block.spec.js >> CodeBlock 컴포넌트 >> 키보드: End 키로 마지막 탭 이동
- Location: tests\code-block.spec.js:200:3

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:4173/tests/code-block.html
Call log:
  - navigating to "http://localhost:4173/tests/code-block.html", waiting until "load"

```

# Test source

```ts
  1   | /**
  2   |  * CodeBlock 컴포넌트 Playwright 테스트
  3   |  *
  4   |  * 검증 항목:
  5   |  * 1. 초기 렌더링 (HTML 탭 활성)
  6   |  * 2. 탭 전환 (클릭)
  7   |  * 3. View/Hide Code 토글
  8   |  * 4. 클립보드 복사 (Copied! 피드백)
  9   |  * 5. 키보드 네비게이션 (ArrowRight/Left/Home/End, Enter/Space)
  10  |  * 6. ARIA 속성 검증
  11  |  */
  12  | 
  13  | const { test, expect } = require('@playwright/test');
  14  | 
  15  | // 정적 서버 기준 테스트 HTML 경로 (playwright.config.js의 baseURL 사용)
  16  | const PAGE_URL = '/tests/code-block.html';
  17  | 
  18  | test.describe('CodeBlock 컴포넌트', () => {
  19  |   test.beforeEach(async ({ page }) => {
> 20  |     await page.goto(PAGE_URL);
      |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:4173/tests/code-block.html
  21  |     // 컴포넌트가 마운트될 때까지 대기
  22  |     await page.waitForSelector('.code-block');
  23  |   });
  24  | 
  25  |   // ─────────────────────────────────────────────
  26  |   // 1. 초기 렌더링
  27  |   // ─────────────────────────────────────────────
  28  |   test('초기 렌더링: HTML 탭이 활성화되어 있어야 한다', async ({ page }) => {
  29  |     const htmlTab = page.locator('[role="tab"][data-tab="html"]');
  30  |     const cssTab  = page.locator('[role="tab"][data-tab="css"]');
  31  |     const jsTab   = page.locator('[role="tab"][data-tab="js"]');
  32  | 
  33  |     await expect(htmlTab).toHaveAttribute('aria-selected', 'true');
  34  |     await expect(cssTab).toHaveAttribute('aria-selected', 'false');
  35  |     await expect(jsTab).toHaveAttribute('aria-selected', 'false');
  36  |   });
  37  | 
  38  |   test('초기 렌더링: HTML 패널만 표시되어야 한다', async ({ page }) => {
  39  |     const htmlPanel = page.locator('[role="tabpanel"][aria-expanded="true"]');
  40  |     await expect(htmlPanel).toHaveCount(1);
  41  | 
  42  |     // hidden 속성으로 나머지 패널이 숨겨졌는지 확인
  43  |     const hiddenPanels = page.locator('[role="tabpanel"][hidden]');
  44  |     await expect(hiddenPanels).toHaveCount(2);
  45  |   });
  46  | 
  47  |   test('초기 렌더링: View Code 버튼이 표시되어야 한다', async ({ page }) => {
  48  |     const toggleBtn = page.locator('.code-block__toggle');
  49  |     await expect(toggleBtn).toHaveText('View Code');
  50  |     await expect(toggleBtn).toHaveAttribute('aria-expanded', 'false');
  51  |   });
  52  | 
  53  |   // ─────────────────────────────────────────────
  54  |   // 2. 탭 전환 (클릭)
  55  |   // ─────────────────────────────────────────────
  56  |   test('탭 전환: CSS 탭 클릭 시 CSS 패널이 표시되어야 한다', async ({ page }) => {
  57  |     const cssTab = page.locator('[role="tab"][data-tab="css"]');
  58  |     await cssTab.click();
  59  | 
  60  |     await expect(cssTab).toHaveAttribute('aria-selected', 'true');
  61  | 
  62  |     const cssPanel = page.locator('[role="tabpanel"][aria-expanded="true"]');
  63  |     await expect(cssPanel).toHaveCount(1);
  64  | 
  65  |     // CSS 패널에 hidden이 없어야 함
  66  |     const cssPanelEl = page.locator('[role="tabpanel"][id$="-panel-css"]');
  67  |     await expect(cssPanelEl).not.toHaveAttribute('hidden');
  68  |   });
  69  | 
  70  |   test('탭 전환: JS 탭 클릭 시 JS 패널이 표시되어야 한다', async ({ page }) => {
  71  |     const jsTab = page.locator('[role="tab"][data-tab="js"]');
  72  |     await jsTab.click();
  73  | 
  74  |     await expect(jsTab).toHaveAttribute('aria-selected', 'true');
  75  | 
  76  |     const jsPanel = page.locator('[role="tabpanel"][id$="-panel-js"]');
  77  |     await expect(jsPanel).not.toHaveAttribute('hidden');
  78  |   });
  79  | 
  80  |   test('탭 전환: 이전 탭 패널은 숨겨져야 한다', async ({ page }) => {
  81  |     // CSS로 전환
  82  |     await page.locator('[role="tab"][data-tab="css"]').click();
  83  | 
  84  |     const htmlPanel = page.locator('[role="tabpanel"][id$="-panel-html"]');
  85  |     await expect(htmlPanel).toHaveAttribute('hidden', '');
  86  |   });
  87  | 
  88  |   // ─────────────────────────────────────────────
  89  |   // 3. View/Hide Code 토글
  90  |   // ─────────────────────────────────────────────
  91  |   test('토글: View Code 클릭 시 패널이 확장되어야 한다', async ({ page }) => {
  92  |     const toggleBtn = page.locator('.code-block__toggle');
  93  |     await toggleBtn.click();
  94  | 
  95  |     await expect(toggleBtn).toHaveText('Hide Code');
  96  |     await expect(toggleBtn).toHaveAttribute('aria-expanded', 'true');
  97  | 
  98  |     // 활성 패널에 expanded 클래스 추가 확인
  99  |     const activePanel = page.locator('[role="tabpanel"][aria-expanded="true"]');
  100 |     await expect(activePanel).toHaveClass(/expanded/);
  101 |   });
  102 | 
  103 |   test('토글: Hide Code 클릭 시 패널이 축소되어야 한다', async ({ page }) => {
  104 |     const toggleBtn = page.locator('.code-block__toggle');
  105 | 
  106 |     // 먼저 확장
  107 |     await toggleBtn.click();
  108 |     await expect(toggleBtn).toHaveText('Hide Code');
  109 | 
  110 |     // 다시 축소
  111 |     await toggleBtn.click();
  112 |     await expect(toggleBtn).toHaveText('View Code');
  113 |     await expect(toggleBtn).toHaveAttribute('aria-expanded', 'false');
  114 | 
  115 |     const activePanel = page.locator('[role="tabpanel"][aria-expanded="true"]');
  116 |     await expect(activePanel).not.toHaveClass(/expanded/);
  117 |   });
  118 | 
  119 |   // ─────────────────────────────────────────────
  120 |   // 4. 클립보드 복사
```