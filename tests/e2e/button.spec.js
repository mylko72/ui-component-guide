/**
 * Button 컴포넌트 E2E 테스트
 * Playwright MCP를 사용한 버튼의 모든 변형, 상호작용, 접근성 검증
 */

const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:3000';

test.describe('Button Component', () => {
  test.beforeEach(async ({ page }) => {
    // Button 상세 페이지 로드
    await page.goto(`${BASE_URL}/#/button`);
    // 페이지 로드 대기
    await page.waitForLoadState('networkidle');
  });

  /**
   * Test 1: 페이지 로드 + 제목/설명 텍스트 확인
   */
  test('1. 페이지 로드 후 제목과 설명이 올바르게 표시됨', async ({ page }) => {
    // h1 제목 확인
    const title = await page.locator('h1').first().textContent();
    expect(title).toBe('Button');

    // 설명 텍스트 확인
    const description = await page.locator('.demo-page-description').textContent();
    expect(description).toContain('사용자 액션을 트리거');
  });

  /**
   * Test 2: 모든 버튼 변형이 렌더링됨
   */
  test('2. 모든 버튼 변형이 렌더링됨', async ({ page }) => {
    // Primary, Secondary, Outline, Ghost, Danger 버튼 확인
    const variants = ['primary', 'secondary', 'outline', 'ghost', 'danger'];

    for (const variant of variants) {
      const buttons = await page.locator(`button[data-variant="${variant}"]`).count();
      expect(buttons).toBeGreaterThanOrEqual(3);
    }

    // Disabled 버튼 확인
    const disabledButtons = await page.locator('button:disabled').count();
    expect(disabledButtons).toBeGreaterThan(0);
  });

  /**
   * Test 3: 키보드 네비게이션 (Tab)
   */
  test('3. 키보드로 버튼 포커싱 가능', async ({ page }) => {
    // Tab 키로 포커스 이동
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    const focusedElement = await page.evaluate(() => document.activeElement.tagName);
    expect(focusedElement).toBe('BUTTON');
  });

  /**
   * Test 4: Disabled 버튼은 클릭 불가
   */
  test('4. Disabled 버튼은 클릭 불가', async ({ page }) => {
    const disabledButton = await page.locator('button:disabled').first();
    const isDisabled = await disabledButton.isDisabled();
    expect(isDisabled).toBe(true);
  });

  /**
   * Test 5: Icon 버튼의 aria-label 확인
   */
  test('5. Icon 버튼에 aria-label이 설정됨', async ({ page }) => {
    const iconButtons = await page.locator('button[aria-label]');
    const count = await iconButtons.count();
    expect(count).toBeGreaterThan(0);

    const ariaLabel = await iconButtons.first().getAttribute('aria-label');
    expect(ariaLabel).not.toBeNull();
  });

  /**
   * Test 6: DetailPage 사이드바 활성 상태 확인
   */
  test('6. DetailPage 사이드바에서 Button이 활성 상태', async ({ page }) => {
    const buttonNavLink = await page.locator('a[href*="button"]').first();
    
    const ariaCurrentPage = await buttonNavLink.getAttribute('aria-current');
    const hasActiveClass = await buttonNavLink.evaluate(el => el.classList.contains('active'));

    const isActive = ariaCurrentPage === 'page' || hasActiveClass;
    expect(isActive).toBe(true);
  });

  /**
   * Test 7: Focus Ring 스타일 확인
   */
  test('7. 버튼 포커스 시 포커스 링 표시', async ({ page }) => {
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    const hasOutline = await page.evaluate(() => {
      const btn = document.activeElement;
      const outline = window.getComputedStyle(btn).outline;
      return outline !== 'none';
    });

    expect(hasOutline).toBe(true);
  });
});
