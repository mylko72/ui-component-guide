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
 * - _renderDemos() 메서드만 오버라이드하여 컴포넌트별 섹션 제공
 * - 예: ButtonDemo extends DetailPage { _renderDemos() { ... } }
 *
 * 생명주기:
 * - render() → mount() → afterMount() → destroy()
 */

import Component from '../core/Component.js';
import CodeBlock from '../ui/CodeBlock.js';

export default class DetailPage extends Component {
  /**
   * 컴포넌트 정보 (서브클래스에서 설정)
   * @returns {Object} { title, description, componentName, demoHtml, demoCss, demoJs }
   */
  getComponentInfo() {
    return {
      title: '컴포넌트 이름',
      description: '컴포넌트 설명',
      componentName: 'component',
    };
  }

  /**
   * 데모 섹션 렌더링 (서브클래스에서 오버라이드)
   * @returns {string} 데모 HTML
   */
  _renderDemos() {
    return '<p>데모 콘텐츠를 여기에 추가하세요.</p>';
  }

  /**
   * 페이지 레이아웃 전체 렌더링
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
            <span>← 돌아가기</span>
          </a>
          <h1 class="detail-title">${info.title}</h1>
          <p class="detail-description">${info.description}</p>
        </header>

        <!-- ============================================
             2단 컨텐츠 레이아웃: 사이드바 + 메인
             반응형: 768px 이하에서 스택 레이아웃
             ============================================ -->
        <div class="detail-content">

          <!-- 좌측 사이드바: 데모 섹션 목차 (향후 구현) -->
          <aside class="detail-sidebar" aria-label="페이지 목차">
            <!-- 추후 구현: 자동 생성된 목차 네비게이션 -->
          </aside>

          <!-- 우측 메인 콘텐츠: 데모 섹션 -->
          <main class="detail-main">
            ${this._renderDemos()}
          </main>

        </div>

        <!-- ============================================
             푸터: 이전/다음 컴포넌트 네비게이션
             ============================================ -->
        <footer class="detail-footer">
          <nav class="detail-footer-nav" aria-label="컴포넌트 네비게이션">
            <a href="#/" class="detail-footer-link" aria-label="이전 컴포넌트로 이동">
              <span class="detail-footer-label">이전</span>
            </a>
            <a href="#/" class="detail-footer-link" aria-label="다음 컴포넌트로 이동">
              <span class="detail-footer-label">다음</span>
            </a>
          </nav>
        </footer>

      </div>
    `;
  }

  /**
   * 마운트 후 초기화
   * - CodeBlock 인스턴스 생성
   * - 사이드바 활성 상태 표시
   * - 이벤트 리스너 등록
   */
  afterMount() {
    // 뒤로 가기 링크 이벤트 (라우터가 처리)
    const backLink = this._query('.detail-back-link');
    if (backLink) {
      this._addEventListener(backLink, 'click', (e) => {
        // 라우터가 해시 변경으로 자동 처리
      });
    }

    // 코드 블록 초기화 (서브클래스에서 CodeBlock 인스턴스 생성 시)
    // 예: const codeBlock = new CodeBlock(selector, codes)
    //     codeBlock.mount()
    //     codeBlock.afterMount()

    // 페이지 스크롤 최상단으로
    window.scrollTo(0, 0);
  }

  /**
   * 이벤트 리스너 등록 (메모리 관리)
   * @param {HTMLElement} target - 대상 엘리먼트
   * @param {string} event - 이벤트명
   * @param {Function} callback - 콜백 함수
   */
  _addEventListener(target, event, callback) {
    if (!target) return;
    target.addEventListener(event, callback);
    this._eventListeners.push({ target, event, callback });
  }
}
