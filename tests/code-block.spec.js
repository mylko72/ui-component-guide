/**
 * CodeBlock 컴포넌트 Playwright 테스트
 *
 * 검증 항목:
 * 1. 초기 렌더링 (HTML 탭 활성)
 * 2. 탭 전환 (클릭)
 * 3. View/Hide Code 토글
 * 4. 클립보드 복사 (Copied! 피드백)
 * 5. 키보드 네비게이션 (ArrowRight/Left/Home/End, Enter/Space)
 * 6. ARIA 속성 검증
 */

const { test, expect } = require('@playwright/test');

// 정적 서버 기준 테스트 HTML 경로 (playwright.config.js의 baseURL 사용)
const PAGE_URL = '/tests/code-block.html';

test.describe('CodeBlock 컴포넌트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE_URL);
    // 컴포넌트가 마운트될 때까지 대기
    await page.waitForSelector('.code-block');
  });

  // ─────────────────────────────────────────────
  // 1. 초기 렌더링
  // ─────────────────────────────────────────────
  test('초기 렌더링: HTML 탭이 활성화되어 있어야 한다', async ({ page }) => {
    const htmlTab = page.locator('[role="tab"][data-tab="html"]');
    const cssTab  = page.locator('[role="tab"][data-tab="css"]');
    const jsTab   = page.locator('[role="tab"][data-tab="js"]');

    await expect(htmlTab).toHaveAttribute('aria-selected', 'true');
    await expect(cssTab).toHaveAttribute('aria-selected', 'false');
    await expect(jsTab).toHaveAttribute('aria-selected', 'false');
  });

  test('초기 렌더링: HTML 패널만 표시되어야 한다', async ({ page }) => {
    const htmlPanel = page.locator('[role="tabpanel"][aria-expanded="true"]');
    await expect(htmlPanel).toHaveCount(1);

    // hidden 속성으로 나머지 패널이 숨겨졌는지 확인
    const hiddenPanels = page.locator('[role="tabpanel"][hidden]');
    await expect(hiddenPanels).toHaveCount(2);
  });

  test('초기 렌더링: View Code 버튼이 표시되어야 한다', async ({ page }) => {
    const toggleBtn = page.locator('.code-block__toggle');
    await expect(toggleBtn).toHaveText('View Code');
    await expect(toggleBtn).toHaveAttribute('aria-expanded', 'false');
  });

  // ─────────────────────────────────────────────
  // 2. 탭 전환 (클릭)
  // ─────────────────────────────────────────────
  test('탭 전환: CSS 탭 클릭 시 CSS 패널이 표시되어야 한다', async ({ page }) => {
    const cssTab = page.locator('[role="tab"][data-tab="css"]');
    await cssTab.click();

    await expect(cssTab).toHaveAttribute('aria-selected', 'true');

    const cssPanel = page.locator('[role="tabpanel"][aria-expanded="true"]');
    await expect(cssPanel).toHaveCount(1);

    // CSS 패널에 hidden이 없어야 함
    const cssPanelEl = page.locator('[role="tabpanel"][id$="-panel-css"]');
    await expect(cssPanelEl).not.toHaveAttribute('hidden');
  });

  test('탭 전환: JS 탭 클릭 시 JS 패널이 표시되어야 한다', async ({ page }) => {
    const jsTab = page.locator('[role="tab"][data-tab="js"]');
    await jsTab.click();

    await expect(jsTab).toHaveAttribute('aria-selected', 'true');

    const jsPanel = page.locator('[role="tabpanel"][id$="-panel-js"]');
    await expect(jsPanel).not.toHaveAttribute('hidden');
  });

  test('탭 전환: 이전 탭 패널은 숨겨져야 한다', async ({ page }) => {
    // CSS로 전환
    await page.locator('[role="tab"][data-tab="css"]').click();

    const htmlPanel = page.locator('[role="tabpanel"][id$="-panel-html"]');
    await expect(htmlPanel).toHaveAttribute('hidden', '');
  });

  // ─────────────────────────────────────────────
  // 3. View/Hide Code 토글
  // ─────────────────────────────────────────────
  test('토글: View Code 클릭 시 패널이 확장되어야 한다', async ({ page }) => {
    const toggleBtn = page.locator('.code-block__toggle');
    await toggleBtn.click();

    await expect(toggleBtn).toHaveText('Hide Code');
    await expect(toggleBtn).toHaveAttribute('aria-expanded', 'true');

    // 활성 패널에 expanded 클래스 추가 확인
    const activePanel = page.locator('[role="tabpanel"][aria-expanded="true"]');
    await expect(activePanel).toHaveClass(/expanded/);
  });

  test('토글: Hide Code 클릭 시 패널이 축소되어야 한다', async ({ page }) => {
    const toggleBtn = page.locator('.code-block__toggle');

    // 먼저 확장
    await toggleBtn.click();
    await expect(toggleBtn).toHaveText('Hide Code');

    // 다시 축소
    await toggleBtn.click();
    await expect(toggleBtn).toHaveText('View Code');
    await expect(toggleBtn).toHaveAttribute('aria-expanded', 'false');

    const activePanel = page.locator('[role="tabpanel"][aria-expanded="true"]');
    await expect(activePanel).not.toHaveClass(/expanded/);
  });

  // ─────────────────────────────────────────────
  // 4. 클립보드 복사
  // ─────────────────────────────────────────────
  test('복사: Copy 클릭 시 Copied! 피드백이 2초간 표시되어야 한다', async ({ page }) => {
    const copyBtn = page.locator('.code-block__copy');
    await copyBtn.click();

    // 즉시 Copied! 로 변경
    await expect(copyBtn).toHaveText('Copied!');
    await expect(copyBtn).toHaveClass(/copied/);

    // 2초 후 Copy로 복원 (2.1초 대기)
    await page.waitForTimeout(2100);
    await expect(copyBtn).toHaveText('Copy');
    await expect(copyBtn).not.toHaveClass(/copied/);
  });

  // ─────────────────────────────────────────────
  // 5. 키보드 네비게이션
  // ─────────────────────────────────────────────
  test('키보드: ArrowRight로 다음 탭 전환 (HTML → CSS)', async ({ page }) => {
    const htmlTab = page.locator('[role="tab"][data-tab="html"]');
    await htmlTab.focus();
    await page.keyboard.press('ArrowRight');

    const cssTab = page.locator('[role="tab"][data-tab="css"]');
    await expect(cssTab).toHaveAttribute('aria-selected', 'true');
    await expect(cssTab).toBeFocused();
  });

  test('키보드: ArrowLeft로 이전 탭 전환 (CSS → HTML)', async ({ page }) => {
    // 먼저 CSS로 이동
    const cssTab = page.locator('[role="tab"][data-tab="css"]');
    await cssTab.click();
    await cssTab.focus();

    await page.keyboard.press('ArrowLeft');

    const htmlTab = page.locator('[role="tab"][data-tab="html"]');
    await expect(htmlTab).toHaveAttribute('aria-selected', 'true');
    await expect(htmlTab).toBeFocused();
  });

  test('키보드: ArrowRight 순환 (JS → HTML)', async ({ page }) => {
    // JS 탭으로 이동
    const jsTab = page.locator('[role="tab"][data-tab="js"]');
    await jsTab.click();
    await jsTab.focus();

    // 마지막 탭에서 ArrowRight → 첫 번째 탭으로 순환
    await page.keyboard.press('ArrowRight');

    const htmlTab = page.locator('[role="tab"][data-tab="html"]');
    await expect(htmlTab).toHaveAttribute('aria-selected', 'true');
    await expect(htmlTab).toBeFocused();
  });

  test('키보드: ArrowLeft 역방향 순환 (HTML → JS)', async ({ page }) => {
    const htmlTab = page.locator('[role="tab"][data-tab="html"]');
    await htmlTab.focus();

    // 첫 번째 탭에서 ArrowLeft → 마지막 탭으로 순환
    await page.keyboard.press('ArrowLeft');

    const jsTab = page.locator('[role="tab"][data-tab="js"]');
    await expect(jsTab).toHaveAttribute('aria-selected', 'true');
    await expect(jsTab).toBeFocused();
  });

  test('키보드: Home 키로 첫 번째 탭 이동', async ({ page }) => {
    // JS 탭으로 먼저 이동
    const jsTab = page.locator('[role="tab"][data-tab="js"]');
    await jsTab.click();
    await jsTab.focus();

    await page.keyboard.press('Home');

    const htmlTab = page.locator('[role="tab"][data-tab="html"]');
    await expect(htmlTab).toHaveAttribute('aria-selected', 'true');
  });

  test('키보드: End 키로 마지막 탭 이동', async ({ page }) => {
    const htmlTab = page.locator('[role="tab"][data-tab="html"]');
    await htmlTab.focus();

    await page.keyboard.press('End');

    const jsTab = page.locator('[role="tab"][data-tab="js"]');
    await expect(jsTab).toHaveAttribute('aria-selected', 'true');
  });

  test('키보드: Enter로 토글 버튼 활성화', async ({ page }) => {
    const toggleBtn = page.locator('.code-block__toggle');
    await toggleBtn.focus();
    await page.keyboard.press('Enter');

    await expect(toggleBtn).toHaveText('Hide Code');
    await expect(toggleBtn).toHaveAttribute('aria-expanded', 'true');
  });

  test('키보드: Space로 토글 버튼 활성화', async ({ page }) => {
    const toggleBtn = page.locator('.code-block__toggle');
    await toggleBtn.focus();
    await page.keyboard.press('Space');

    await expect(toggleBtn).toHaveText('Hide Code');
    await expect(toggleBtn).toHaveAttribute('aria-expanded', 'true');
  });

  // ─────────────────────────────────────────────
  // 6. ARIA 속성 검증
  // ─────────────────────────────────────────────
  test('ARIA: tablist에 role=tablist와 aria-label이 있어야 한다', async ({ page }) => {
    const tablist = page.locator('[role="tablist"]');
    await expect(tablist).toHaveAttribute('aria-label', '코드 언어 선택');
  });

  test('ARIA: 각 tab 버튼에 aria-controls가 올바르게 연결되어야 한다', async ({ page }) => {
    const htmlTab = page.locator('[role="tab"][data-tab="html"]');
    const controlsId = await htmlTab.getAttribute('aria-controls');

    // 연결된 패널이 실제로 존재해야 함
    const panel = page.locator(`#${controlsId}`);
    await expect(panel).toHaveCount(1);
    await expect(panel).toHaveAttribute('role', 'tabpanel');
  });

  test('ARIA: tabpanel에 aria-labelledby가 tab과 연결되어야 한다', async ({ page }) => {
    const htmlTab = page.locator('[role="tab"][data-tab="html"]');
    const tabId = await htmlTab.getAttribute('id');

    const panel = page.locator(`[role="tabpanel"][aria-labelledby="${tabId}"]`);
    await expect(panel).toHaveCount(1);
  });

  test('ARIA: 비활성 탭은 tabindex="-1"이어야 한다', async ({ page }) => {
    const cssTab = page.locator('[role="tab"][data-tab="css"]');
    const jsTab  = page.locator('[role="tab"][data-tab="js"]');

    await expect(cssTab).toHaveAttribute('tabindex', '-1');
    await expect(jsTab).toHaveAttribute('tabindex', '-1');
  });

  test('ARIA: 활성 탭은 tabindex="0"이어야 한다', async ({ page }) => {
    const htmlTab = page.locator('[role="tab"][data-tab="html"]');
    await expect(htmlTab).toHaveAttribute('tabindex', '0');
  });
});
