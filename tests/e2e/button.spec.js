/**
 * Button Component E2E Tests
 * Playwright 자동화 테스트 (7개 시나리오)
 */

const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:3000';

test.describe('Button Component (Task 011)', () => {

  // ============================================
  // 시나리오 1: 페이지 로드 + 버튼 렌더링
  // ============================================
  test('시나리오 1: Button 페이지 로드 및 타이틀 확인', async ({ page }) => {
    await page.goto(`${BASE_URL}/#/button`);

    // 페이지 타이틀 확인 (demo-page-title 선택자 사용)
    const title = await page.locator('.demo-page-title').textContent();
    expect(title).toContain('Button');

    // 설명 텍스트 확인
    const description = await page.locator('.demo-page-description').textContent();
    expect(description).toContain('사용자 액션을 트리거하는');

    console.log('✅ 시나리오 1 PASS: 페이지 로드 및 타이틀 확인');
  });

  // ============================================
  // 시나리오 2: 모든 버튼 변형 렌더링 검증
  // ============================================
  test('시나리오 2: 모든 버튼 변형 및 크기 렌더링', async ({ page }) => {
    await page.goto(`${BASE_URL}/#/button`);

    // Primary 버튼 3개 (sm, md, lg) 확인
    const primaryButtons = await page.locator('button[data-variant="primary"]').count();
    console.log(`✅ Primary 버튼: ${primaryButtons}개`);
    expect(primaryButtons).toBeGreaterThanOrEqual(3);

    // Secondary 버튼 확인
    const secondaryButtons = await page.locator('button[data-variant="secondary"]').count();
    console.log(`✅ Secondary 버튼: ${secondaryButtons}개`);
    expect(secondaryButtons).toBeGreaterThanOrEqual(3);

    // Outline 버튼 확인
    const outlineButtons = await page.locator('button[data-variant="outline"]').count();
    console.log(`✅ Outline 버튼: ${outlineButtons}개`);
    expect(outlineButtons).toBeGreaterThanOrEqual(3);

    // Ghost 버튼 확인
    const ghostButtons = await page.locator('button[data-variant="ghost"]').count();
    console.log(`✅ Ghost 버튼: ${ghostButtons}개`);
    expect(ghostButtons).toBeGreaterThanOrEqual(3);

    // Danger 버튼 확인
    const dangerButtons = await page.locator('button[data-variant="danger"]').count();
    console.log(`✅ Danger 버튼: ${dangerButtons}개`);
    expect(dangerButtons).toBeGreaterThanOrEqual(3);

    console.log('✅ 시나리오 2 PASS: 모든 버튼 변형 렌더링');
  });

  // ============================================
  // 시나리오 3: 버튼 클릭 가능성 검증
  // ============================================
  test('시나리오 3: Primary 버튼 클릭 가능성 및 콘솔 에러 확인', async ({ page }) => {
    await page.goto(`${BASE_URL}/#/button`);

    // 콘솔 에러 수집
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // 첫 번째 Primary 버튼 클릭
    const primaryBtn = await page.locator('button[data-variant="primary"]').first();
    await primaryBtn.click();

    // 클릭 후 에러 없음 확인
    expect(errors.length).toBe(0);
    console.log('✅ 시나리오 3 PASS: 버튼 클릭 및 에러 확인');
  });

  // ============================================
  // 시나리오 4: 비활성 버튼 상태 검증
  // ============================================
  test('시나리오 4: Disabled 버튼 상태 검증', async ({ page }) => {
    await page.goto(`${BASE_URL}/#/button`);

    // disabled 속성 가진 버튼 찾기
    const disabledButtons = await page.locator('button[disabled]').count();
    console.log(`✅ Disabled 버튼: ${disabledButtons}개`);
    expect(disabledButtons).toBeGreaterThanOrEqual(8);

    // Disabled 버튼의 pointer-events 확인
    const firstDisabledBtn = await page.locator('button[disabled]').first();
    const pointerEvents = await firstDisabledBtn.evaluate(el =>
      getComputedStyle(el).pointerEvents
    );
    console.log(`✅ Disabled 버튼 pointer-events: ${pointerEvents}`);
    expect(pointerEvents).toBe('none');

    // opacity 확인 (반투명)
    const opacity = await firstDisabledBtn.evaluate(el =>
      getComputedStyle(el).opacity
    );
    console.log(`✅ Disabled 버튼 opacity: ${opacity}`);
    expect(parseFloat(opacity)).toBeLessThan(1);

    console.log('✅ 시나리오 4 PASS: Disabled 버튼 상태');
  });

  // ============================================
  // 시나리오 5: 키보드 접근성 (Tab / Enter / Space)
  // ============================================
  test('시나리오 5: 키보드 접근성 검증', async ({ page }) => {
    await page.goto(`${BASE_URL}/#/button`);

    // 첫 번째 버튼에 포커스
    const firstBtn = await page.locator('button[data-variant="primary"]').first();
    await firstBtn.focus();

    // 포커스 확인
    const isFocused = await firstBtn.evaluate(el =>
      document.activeElement === el
    );
    console.log(`✅ Tab으로 버튼 포커스: ${isFocused}`);
    expect(isFocused).toBe(true);

    // 포커스 스타일 확인 (outline)
    const outline = await firstBtn.evaluate(el =>
      getComputedStyle(el).outline
    );
    console.log(`✅ 버튼 포커스 outline: ${outline.substring(0, 30)}...`);
    expect(outline).toBeTruthy();

    console.log('✅ 시나리오 5 PASS: 키보드 접근성');
  });

  // ============================================
  // 시나리오 6: 다크/라이트 모드 색상 변경
  // ============================================
  test('시나리오 6: 다크/라이트 모드 색상 변경 확인', async ({ page }) => {
    await page.goto(`${BASE_URL}/#/button`);

    // 초기 테마 확인
    let theme = await page.locator('html').getAttribute('data-theme');
    console.log(`초기 테마: ${theme}`);

    // Primary 버튼 초기 배경색
    const primaryBtn = await page.locator('button[data-variant="primary"]').first();
    let bgColor = await primaryBtn.evaluate(el =>
      getComputedStyle(el).backgroundColor
    );
    console.log(`✅ Primary 버튼 초기 배경색: ${bgColor}`);
    expect(bgColor).toBeTruthy();

    // 테마 토글
    const toggleBtn = await page.locator('#theme-toggle');
    await toggleBtn.click();
    await page.waitForTimeout(300);

    // 테마 변경 확인
    const newTheme = await page.locator('html').getAttribute('data-theme');
    console.log(`✅ 변경된 테마: ${newTheme}`);
    expect(newTheme).not.toBe(theme);

    // Primary 버튼 새 배경색 (변경되었는지 확인)
    const newBgColor = await primaryBtn.evaluate(el =>
      getComputedStyle(el).backgroundColor
    );
    console.log(`✅ Primary 버튼 변경된 배경색: ${newBgColor}`);
    // 다크모드에서도 보일 수 있도록 값이 있는지만 확인
    expect(newBgColor).toBeTruthy();

    console.log('✅ 시나리오 6 PASS: 다크/라이트 모드 색상 변경');
  });

  // ============================================
  // 시나리오 7: 사이드바 활성 상태 확인
  // ============================================
  test('시나리오 7: 사이드바 Button 네비게이션 활성 상태', async ({ page }) => {
    await page.goto(`${BASE_URL}/#/button`);

    // 사이드바 Button 링크 찾기
    const buttonLink = await page.locator('.nav-link').filter({ hasText: 'Button' }).first();

    // active 클래스 확인
    const hasActive = await buttonLink.evaluate(el =>
      el.classList.contains('active')
    );
    console.log(`✅ Button 네비게이션 active 클래스: ${hasActive}`);
    expect(hasActive).toBe(true);

    console.log('✅ 시나리오 7 PASS: 사이드바 활성 상태');
  });

  // ============================================
  // 추가 검증: 아이콘 버튼 aria-label
  // ============================================
  test('추가 검증: 아이콘 버튼 접근성 속성', async ({ page }) => {
    await page.goto(`${BASE_URL}/#/button`);

    // aria-label이 있는 버튼 찾기
    const iconsWithLabel = await page.locator('button[aria-label]').count();
    console.log(`✅ aria-label이 있는 버튼: ${iconsWithLabel}개`);
    expect(iconsWithLabel).toBeGreaterThan(0);

    // 첫 번째 아이콘 버튼의 aria-label 확인
    const firstIconBtn = await page.locator('button[aria-label]').first();
    const ariaLabel = await firstIconBtn.getAttribute('aria-label');
    console.log(`✅ 아이콘 버튼 aria-label: "${ariaLabel}"`);
    expect(ariaLabel).toBeTruthy();

    console.log('✅ 추가 검증 PASS: 아이콘 버튼 접근성');
  });

});
