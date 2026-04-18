---
name: Playwright file:// 프로토콜 ES6 모듈 CORS 문제
description: Playwright에서 file:// 로 ES6 import 사용 시 CORS 오류 → 정적 서버 필요
type: feedback
---

Playwright 테스트에서 `file://` URL로 ES6 `import/export` 모듈을 사용하면 CORS 정책으로 모듈 로딩이 차단된다.

**Why:** 브라우저는 `file://` 간 교차 출처 요청을 차단한다. `type="module"` 스크립트는 반드시 HTTP 서버를 통해 제공해야 한다.

**How to apply:** `playwright.config.js`에 `webServer` 설정을 추가해 `npx serve`로 정적 서버를 띄우고, 테스트 URL은 `http://localhost:{port}/tests/xxx.html` 형식으로 지정한다.
