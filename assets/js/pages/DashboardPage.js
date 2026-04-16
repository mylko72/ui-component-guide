/**
 * DashboardPage - 메인 대시보드 페이지
 * 프로젝트 소개 및 컴포넌트 가이드 메인 화면
 */

import Component from '../core/Component.js';

export default class DashboardPage extends Component {
  render() {
    return `
      <div class="dashboard-page">
        <section class="hero">
          <h1>Web UI Component Guide</h1>
          <p class="hero-subtitle">순수 HTML/CSS/ES6 기반 한국형 웹접근성(KWCAG 2.2) 준수 UI 컴포넌트</p>
        </section>

        <section class="features">
          <h2>주요 특징</h2>
          <div class="features-grid">
            <div class="feature-card">
              <h3>웹접근성 준수</h3>
              <p>KWCAG 2.2 레벨 AA 준수로 모든 사용자가 쉽게 접근할 수 있습니다.</p>
            </div>
            <div class="feature-card">
              <h3>다크 모드 지원</h3>
              <p>라이트/다크 모드 자동 전환으로 사용자 환경에 맞는 경험을 제공합니다.</p>
            </div>
            <div class="feature-card">
              <h3>반응형 디자인</h3>
              <p>모바일부터 데스크톱까지 모든 기기에 최적화된 컴포넌트입니다.</p>
            </div>
            <div class="feature-card">
              <h3>순수 JavaScript</h3>
              <p>외부 라이브러리 의존 없이 순수 ES6 기반으로 개발되었습니다.</p>
            </div>
            <div class="feature-card">
              <h3>TypeScript 준비</h3>
              <p>향후 TypeScript 마이그레이션을 대비한 구조로 설계되었습니다.</p>
            </div>
            <div class="feature-card">
              <h3>모듈식 아키텍처</h3>
              <p>EventBus, Router, ThemeManager 등 재사용 가능한 핵심 모듈 포함.</p>
            </div>
          </div>
        </section>

        <section class="getting-started">
          <h2>시작하기</h2>
          <p>좌측 사이드바의 컴포넌트 카테고리를 선택하여 각 컴포넌트의 사용 예시를 확인하세요.</p>
          <div class="category-overview">
            <div class="category">
              <h3>🎛️ 폼 요소</h3>
              <p>Button, Input, Checkbox, Radio, Switch, Select, Textarea 등 입력 컴포넌트</p>
            </div>
            <div class="category">
              <h3>📦 레이아웃</h3>
              <p>Card, Accordion, Tabs, Modal, Dropdown 등 구조 및 배치 컴포넌트</p>
            </div>
            <div class="category">
              <h3>💬 피드백</h3>
              <p>Toast, Alert, Badge, Tooltip, Progress, Skeleton 등 사용자 피드백 컴포넌트</p>
            </div>
          </div>
        </section>

        <section class="tech-stack">
          <h2>기술 스택</h2>
          <ul class="tech-list">
            <li><strong>언어:</strong> HTML5, CSS3, JavaScript (ES6+)</li>
            <li><strong>접근성:</strong> KWCAG 2.2 Level AA</li>
            <li><strong>테마:</strong> CSS 변수 기반 다크/라이트 모드</li>
            <li><strong>아키텍처:</strong> Component 기반, EventBus, Router, ThemeManager</li>
            <li><strong>아이콘:</strong> Lucide Icons</li>
          </ul>
        </section>

        <section class="footer-info">
          <p>© 2026 Web UI Component Guide. 순수 HTML/CSS/ES6 기반 웹 컴포넌트 라이브러리</p>
        </section>
      </div>
    `;
  }

  mount() {
    super.mount();
  }

  afterMount() {
    // 초기화 필요 시 여기에 구현
  }

  destroy() {
    super.destroy();
  }
}
