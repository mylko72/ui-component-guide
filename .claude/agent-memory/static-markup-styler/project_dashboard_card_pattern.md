---
name: 대시보드 컴포넌트 카드 마크업 패턴
description: DashboardPage의 24개 컴포넌트 카드 HTML 구조 및 CSS 클래스 설계 결정 사항
type: project
---

DashboardPage.js는 18개 구현 카드 + 6개 Coming Soon 카드로 구성된 그리드 마크업을 사용한다.

**카드 구조 (구현 완료):**
- `<article role="article" class="component-card" tabindex="0" data-route="/경로">`
- 내부: `.card-header` > `.card-icon` + `.card-badge.badge-success`
- 내부: `.card-body` > `.card-title` + `.card-description`
- 내부: `.card-footer` > `.card-rating` > `.card-stars` + `.card-rating-text`

**카드 구조 (Coming Soon):**
- `<article role="article" class="component-card component-card--coming-soon" aria-disabled="true" tabindex="-1">`
- 배지: `.card-badge.badge-gray` + "Coming Soon" 텍스트
- rating/footer 섹션 없음 (미구현 상태 표현)

**CSS 클래스 매핑:**
- `.components-section` = `.category-section` 시맨틱 별칭
- `.components-grid` = `.card-grid` 시맨틱 별칭 (둘 다 동일 grid 스타일)
- `.badge-success` = `--color-success` 배경 (초록)
- `.badge-gray` = `--color-border` 배경 (회색)

**접근성 수치:**
- 구현 카드 18개: tabindex="0", aria-label="[이름] 컴포넌트로 이동"
- Coming Soon 6개: tabindex="-1", aria-disabled="true"
- 모든 아이콘: aria-hidden="true"
- 섹션: aria-labelledby로 h2 연결

**Why:** Task 010-A 요구사항 — 순수 정적 마크업만, JS 동작은 Task 010-B에서 구현
**How to apply:** DashboardPage 수정 시 위 구조 패턴 유지. data-route 속성이 라우터 연결 훅 역할을 한다.
