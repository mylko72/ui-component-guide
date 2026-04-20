/**
 * DetailPage - 모든 컴포넌트 상세 페이지의 기본 클래스
 * Task 011 ~ 028에서 상속받아 컴포넌트별 구현 완료
 *
 * 책임:
 * 1. 페이지 레이아웃 구조 제공 (.detail-page)
 * 2. 헤더 렌더링 (제목 + 설명 + 뒤로 가기)
 * 3. 2단 컨텐츠 레이아웃 (좌측 사이드바 + 우측 메인)
 * 4. 푸터 네비게이션 (이전/다음 컴포넌트)
 *
 * 서브클래스 구현:
 * - getComponentInfo() 오버라이드: 타이틀·설명 제공
 * - _renderDemos() 오버라이드: 컴포넌트별 데모 섹션 HTML 반환
 * - 예: class ButtonDemo extends DetailPage { ... }
 *
 * 생명주기:
 * - render() → mount() → afterMount() → destroy()
 */

import Component from '../core/Component.js';

/**
 * 사이드바에 표시할 전체 컴포넌트 목록
 * 카테고리별 그룹화, 순서대로 이전/다음 네비게이션에도 활용
 */
const COMPONENT_NAVIGATION = [
  {
    category: '폼 요소',
    items: [
      { label: 'Button',   path: '/button' },
      { label: 'Input',    path: '/input' },
      { label: 'Checkbox', path: '/checkbox' },
      { label: 'Radio',    path: '/radio' },
      { label: 'Switch',   path: '/switch' },
      { label: 'Select',   path: '/select' },
      { label: 'Textarea', path: '/textarea' },
    ],
  },
  {
    category: '레이아웃',
    items: [
      { label: 'Card',      path: '/card' },
      { label: 'Accordion', path: '/accordion' },
      { label: 'Tabs',      path: '/tabs' },
      { label: 'Modal',     path: '/modal' },
      { label: 'Dropdown',  path: '/dropdown' },
    ],
  },
  {
    category: '피드백',
    items: [
      { label: 'Toast',    path: '/toast' },
      { label: 'Alert',    path: '/alert' },
      { label: 'Badge',    path: '/badge' },
      { label: 'Tooltip',  path: '/tooltip' },
      { label: 'Progress', path: '/progress' },
      { label: 'Skeleton', path: '/skeleton' },
    ],
  },
];

/**
 * 전체 컴포넌트 목록을 평탄화(flat)한 배열
 * 이전/다음 네비게이션에서 인접 항목 탐색에 사용
 */
const ALL_COMPONENTS = COMPONENT_NAVIGATION.flatMap(group => group.items);

export default class DetailPage extends Component {
  /**
   * 컴포넌트 정보 (서브클래스에서 오버라이드)
   * @returns {{ title: string, description: string }} 페이지 메타 정보
   */
  getComponentInfo() {
    return {
      title: '컴포넌트 이름',
      description: '컴포넌트 설명을 여기에 작성하세요.',
    };
  }

  /**
   * 데모 섹션 HTML 반환 (서브클래스에서 오버라이드)
   * @returns {string} 데모 섹션 HTML 마크업
   */
  _renderDemos() {
    return '<p class="demo-description">데모 콘텐츠를 여기에 추가하세요.</p>';
  }

  /**
   * 현재 경로 추출
   * window.location.hash에서 '#' 제거
   * @returns {string} 현재 경로 (예: '/button')
   * @private
   */
  _getCurrentPath() {
    return window.location.hash.replace('#', '') || '/';
  }

  /**
   * 현재 경로 기준으로 이전/다음 컴포넌트 탐색
   * @returns {{ prev: Object|null, next: Object|null }}
   * @private
   */
  _getAdjacentComponents() {
    const currentPath = this._getCurrentPath();
    const index = ALL_COMPONENTS.findIndex(item => item.path === currentPath);

    return {
      prev: index > 0 ? ALL_COMPONENTS[index - 1] : null,
      next: index < ALL_COMPONENTS.length - 1 ? ALL_COMPONENTS[index + 1] : null,
    };
  }

  /**
   * 사이드바 네비게이션 HTML 렌더링
   * 현재 경로에 해당하는 항목에 aria-current="page" 적용
   * @returns {string} 사이드바 HTML
   * @private
   */
  _renderSidebar() {
    const currentPath = this._getCurrentPath();

    const sectionsHtml = COMPONENT_NAVIGATION.map(group => {
      const itemsHtml = group.items.map(item => {
        const isActive = item.path === currentPath;
        return `
          <li>
            <a
              href="#${item.path}"
              class="nav-link${isActive ? ' active' : ''}"
              ${isActive ? 'aria-current="page"' : ''}
            >${item.label}</a>
          </li>
        `;
      }).join('');

      return `
        <div class="nav-section">
          <p class="nav-section-title">${group.category}</p>
          <ul class="nav-list" role="list">
            ${itemsHtml}
          </ul>
        </div>
      `;
    }).join('');

    return `
      <nav class="sidebar-nav" aria-label="컴포넌트 목록 네비게이션">
        <!-- 대시보드로 돌아가기 링크 -->
        <div class="nav-section">
          <ul class="nav-list" role="list">
            <li>
              <a href="#/" class="nav-link" aria-label="대시보드로 돌아가기">
                ← 대시보드
              </a>
            </li>
          </ul>
        </div>
        ${sectionsHtml}
      </nav>
    `;
  }

  /**
   * 푸터 네비게이션 HTML 렌더링
   * 이전/다음 컴포넌트 링크를 동적으로 생성
   * @returns {string} 푸터 HTML
   * @private
   */
  _renderFooter() {
    const { prev, next } = this._getAdjacentComponents();

    const prevHtml = prev
      ? `
        <a href="#${prev.path}" class="detail-footer-link" aria-label="이전 컴포넌트: ${prev.label}">
          <span class="detail-footer-label">이전</span>
          <span>${prev.label}</span>
        </a>
      `
      : `
        <a href="#/" class="detail-footer-link" aria-label="대시보드로 이동">
          <span class="detail-footer-label">이전</span>
          <span>대시보드</span>
        </a>
      `;

    const nextHtml = next
      ? `
        <a href="#${next.path}" class="detail-footer-link" aria-label="다음 컴포넌트: ${next.label}">
          <span class="detail-footer-label">다음</span>
          <span>${next.label}</span>
        </a>
      `
      : `
        <a href="#/" class="detail-footer-link" aria-label="대시보드로 이동">
          <span class="detail-footer-label">다음</span>
          <span>대시보드</span>
        </a>
      `;

    return `
      <footer class="detail-footer">
        <nav class="detail-footer-nav" aria-label="컴포넌트 이전/다음 네비게이션">
          ${prevHtml}
          ${nextHtml}
        </nav>
      </footer>
    `;
  }

  /**
   * 전체 페이지 레이아웃 HTML 렌더링
   * 헤더 + 2단 컨텐츠(사이드바 + 메인) + 푸터 구조
   * @returns {string} 상세 페이지 전체 HTML
   */
  render() {
    const info = this.getComponentInfo();

    return `
      <!-- ============================================
           컴포넌트 상세 페이지 루트 컨테이너
           ============================================ -->
      <div class="detail-page" aria-label="${info.title} 컴포넌트 상세 페이지">

        <!-- ============================================
             헤더: 제목 + 설명 + 뒤로 가기
             ============================================ -->
        <header class="detail-header">
          <a href="#/" class="detail-back-link" aria-label="대시보드로 돌아가기">
            <span aria-hidden="true">←</span>
            <span>돌아가기</span>
          </a>
          <h1 class="detail-title">${info.title}</h1>
          <p class="detail-description">${info.description}</p>
        </header>

        <!-- ============================================
             2단 컨텐츠 레이아웃: 사이드바 + 메인
             반응형: 768px 이하에서 스택 레이아웃
             ============================================ -->
        <div class="detail-content">

          <!-- 좌측 사이드바: 전체 컴포넌트 목록 네비게이션 -->
          <aside class="detail-sidebar" aria-label="컴포넌트 목록">
            ${this._renderSidebar()}
          </aside>

          <!-- 우측 메인 콘텐츠: 데모 섹션 (서브클래스가 _renderDemos()로 제공) -->
          <main class="detail-main" id="main-content" tabindex="-1">
            ${this._renderDemos()}
          </main>

        </div>

        <!-- 이전/다음 컴포넌트 네비게이션 -->
        ${this._renderFooter()}

      </div>
    `;
  }

  /**
   * 마운트 후 초기화
   * - 페이지 최상단 스크롤 (.main 내부)
   * - Lucide 아이콘 재초기화 (서브클래스에서 아이콘을 사용하는 경우)
   */
  afterMount() {
    // 페이지 전환 시 최상단으로 스크롤 (.main 내부 스크롤 사용, 윈도우 스크롤 제거)
    const mainElement = document.querySelector('.main');
    if (mainElement) {
      mainElement.scrollTop = 0;
    }
  }

  /**
   * 리소스 정리
   * - 부모 클래스의 destroy()가 _eventListeners 일괄 제거 처리
   */
  destroy() {
    super.destroy();
  }
}
