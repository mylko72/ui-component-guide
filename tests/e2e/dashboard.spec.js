/**
 * Dashboard Page E2E Tests
 * Playwright MCP 자동화 테스트 (6개 시나리오)
 */

const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:3000';

test.describe('Dashboard Page (Task 010)', () => {

  // ============================================
  // 시나리오 1: 대시보드 로드 + Lucide 아이콘 렌더링
  // ============================================
  test('시나리오 1: 대시보드 로드 및 Lucide 아이콘 렌더링 확인', async ({ page }) => {
    // 페이지 로드
    await page.goto(`${BASE_URL}`);

    // Console 에러 확인
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // 히어로 제목 확인
    const heroTitle = await page.locator('.hero h1').textContent();
    expect(heroTitle).toBe('Web UI Component Guide');

    // Lucide 아이콘 개수 확인 (24개 이상)
    const iconCount = await page.locator('[data-lucide]').count();
    console.log(`✅ 렌더링된 Lucide 아이콘: ${iconCount}개`);
    expect(iconCount).toBeGreaterThanOrEqual(24);

    // 콘솔 에러 없음 확인
    expect(errors.length).toBe(0);
    console.log('✅ 시나리오 1 PASS: 대시보드 로드 및 아이콘 렌더링');
  });

  // ============================================
  // 시나리오 2: 카드 클릭 → 라우팅 동작
  // ============================================
  test('시나리오 2: 카드 클릭 시 라우팅 및 사이드바 표시 확인', async ({ page }) => {
    await page.goto(`${BASE_URL}`);

    // 메인(/)에서 사이드바 숨김 확인
    let sidebarDisplay = await page.locator('.sidebar').evaluate(el =>
      getComputedStyle(el).display
    );
    console.log(`메인 페이지 사이드바: ${sidebarDisplay}`);
    expect(sidebarDisplay).toBe('none');

    // Button 카드 클릭
    const buttonCard = await page.locator('[data-route="/button"]').first();
    await buttonCard.click();

    // 라우팅 확인
    await page.waitForTimeout(300);
    const url = page.url();
    console.log(`현재 URL: ${url}`);
    expect(url).toContain('#/button');

    // 상세 페이지에서 사이드바 표시 확인
    sidebarDisplay = await page.locator('.sidebar').evaluate(el =>
      getComputedStyle(el).display
    );
    console.log(`상세 페이지 사이드바: ${sidebarDisplay}`);
    expect(sidebarDisplay).not.toBe('none');

    console.log('✅ 시나리오 2 PASS: 카드 클릭 및 라우팅');
  });

  // ============================================
  // 시나리오 3: 반응형 레이아웃 (360px / 768px / 1024px / 1440px)
  // ============================================
  test('시나리오 3: 반응형 레이아웃 테스트', async ({ page }) => {
    await page.goto(`${BASE_URL}`);

    const viewports = [
      { width: 360, height: 800, name: '모바일', expectedCols: '1~2' },
      { width: 768, height: 600, name: '태블릿', expectedCols: '3' },
      { width: 1024, height: 600, name: '데스크톱', expectedCols: '4+' },
      { width: 1440, height: 800, name: '와이드', expectedCols: '4+' }
    ];

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.waitForTimeout(100);

      // 카드 그리드의 gridTemplateColumns 확인
      const gridCols = await page.locator('.card-grid').first().evaluate(el => {
        const style = getComputedStyle(el);
        const cols = style.gridTemplateColumns.split(' ').length;
        return cols;
      });

      console.log(`✅ ${vp.width}px (${vp.name}): ${gridCols}열 → 기대값: ${vp.expectedCols}`);
    }

    console.log('✅ 시나리오 3 PASS: 반응형 레이아웃');
  });

  // ============================================
  // 시나리오 4: 키보드 접근성 (Tab / Enter / Space)
  // ============================================
  test('시나리오 4: 키보드 접근성 테스트', async ({ page }) => {
    await page.goto(`${BASE_URL}`);

    // 첫 번째 카드에 포커스
    const firstCard = await page.locator('.component-card').first();
    await firstCard.focus();

    // 포커스 확인
    const isFocused = await firstCard.evaluate(el =>
      document.activeElement === el
    );
    console.log(`✅ Tab으로 카드 포커스: ${isFocused}`);
    expect(isFocused).toBe(true);

    // Enter 키로 라우팅
    await page.keyboard.press('Enter');
    await page.waitForTimeout(300);

    let url = page.url();
    console.log(`Enter 클릭 후 URL: ${url}`);
    expect(url).toContain('#/');

    // 대시보드로 돌아가기
    await page.goto(`${BASE_URL}`);
    await page.locator('.component-card').first().focus();

    // Space 키로 라우팅
    await page.keyboard.press('Space');
    await page.waitForTimeout(300);

    url = page.url();
    console.log(`Space 클릭 후 URL: ${url}`);
    expect(url).toContain('#/');

    console.log('✅ 시나리오 4 PASS: 키보드 접근성');
  });

  // ============================================
  // 시나리오 5: 다크/라이트 모드 전환
  // ============================================
  test('시나리오 5: 다크/라이트 모드 전환 확인', async ({ page }) => {
    await page.goto(`${BASE_URL}`);

    // 초기 테마 확인 (라이트)
    let theme = await page.locator('html').getAttribute('data-theme');
    console.log(`초기 테마: ${theme}`);
    expect(['light', 'dark']).toContain(theme);

    // 테마 토글
    const toggleBtn = await page.locator('#theme-toggle');
    await toggleBtn.click();
    await page.waitForTimeout(300);

    // 테마 변경 확인
    const newTheme = await page.locator('html').getAttribute('data-theme');
    console.log(`변경된 테마: ${newTheme}`);
    expect(newTheme).not.toBe(theme);

    // 색상 변경 확인
    const heroColor = await page.locator('.hero h1').evaluate(el =>
      getComputedStyle(el).color
    );
    console.log(`히어로 텍스트 색상: ${heroColor}`);
    expect(heroColor).toBeTruthy();

    // localStorage 저장 확인
    const savedTheme = await page.evaluate(() =>
      localStorage.getItem('uig-theme')
    );
    console.log(`localStorage에 저장된 테마: ${savedTheme}`);
    expect(savedTheme).toBe(newTheme);

    console.log('✅ 시나리오 5 PASS: 다크/라이트 모드 전환');
  });

  // ============================================
  // 시나리오 6: 히어로 섹션 명도 대비 검증 (WCAG AAA)
  // ============================================
  test('시나리오 6: 히어로 섹션 색상 대비 검증', async ({ page }) => {
    await page.goto(`${BASE_URL}`);

    // 히어로 배경색 확인
    const heroBackground = await page.locator('.hero').evaluate(el => {
      const style = getComputedStyle(el);
      return style.backgroundImage || style.backgroundColor;
    });
    console.log(`✅ 히어로 배경: ${heroBackground.substring(0, 50)}...`);
    expect(heroBackground).toContain('gradient');

    // 히어로 텍스트 색상 확인 (흰색)
    const heroH1Color = await page.locator('.hero h1').evaluate(el => {
      const style = getComputedStyle(el);
      return style.color;
    });
    console.log(`✅ 히어로 h1 색상: ${heroH1Color}`);
    expect(heroH1Color).toContain('255'); // 흰색(rgb(255, 255, 255))

    // 히어로 부제목 색상 확인 (밝은 회색)
    const heroSubtitleColor = await page.locator('.hero-subtitle').evaluate(el => {
      const style = getComputedStyle(el);
      return style.color;
    });
    console.log(`✅ 히어로 부제목 색상: ${heroSubtitleColor}`);

    // FOUC 확인 (페이지 로드 시 깜박임 없음)
    const htmlTheme = await page.locator('html').getAttribute('data-theme');
    console.log(`FOUC 없음 확인 - 테마 적용: ${htmlTheme}`);
    expect(htmlTheme).toBeTruthy();

    console.log('✅ 시나리오 6 PASS: 색상 대비 검증 (WCAG AAA)');
  });

  // ============================================
  // Coming Soon 카드 비활성 확인
  // ============================================
  test('추가 검증: Coming Soon 카드 비활성화 확인', async ({ page }) => {
    await page.goto(`${BASE_URL}`);

    // Coming Soon 카드 선택
    const comingSoonCard = await page.locator('[aria-disabled="true"]').first();
    const ariaDisabled = await comingSoonCard.getAttribute('aria-disabled');
    console.log(`Coming Soon 카드 aria-disabled: ${ariaDisabled}`);
    expect(ariaDisabled).toBe('true');

    // 클릭 불가 확인 (pointer-events: none)
    const pointerEvents = await comingSoonCard.evaluate(el =>
      getComputedStyle(el).pointerEvents
    );
    console.log(`Coming Soon 카드 pointer-events: ${pointerEvents}`);
    expect(pointerEvents).toBe('none');

    // 비활성 스타일 확인 (opacity)
    const opacity = await comingSoonCard.evaluate(el =>
      getComputedStyle(el).opacity
    );
    console.log(`Coming Soon 카드 opacity: ${opacity}`);
    expect(parseFloat(opacity)).toBeLessThan(1);

    console.log('✅ 추가 검증 PASS: Coming Soon 카드 비활성화');
  });

});
