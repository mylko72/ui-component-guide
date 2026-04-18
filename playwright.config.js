// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * Playwright 설정 - CodeBlock 컴포넌트 테스트
 * 내장 정적 서버(http-server)로 ES6 모듈 CORS 문제 방지
 */
module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: false,
  reporter: 'list',
  use: {
    // 정적 서버 베이스 URL
    baseURL: 'http://localhost:4173',
    // 클립보드 권한 기본 허용
    permissions: ['clipboard-read', 'clipboard-write'],
    headless: true,
  },
  // 테스트 전 정적 파일 서버 자동 기동
  webServer: {
    command: 'npx serve . -p 4173 --no-clipboard',
    url: 'http://localhost:4173',
    reuseExistingServer: true,
    timeout: 30000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
