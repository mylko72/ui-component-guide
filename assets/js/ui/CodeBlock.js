/**
 * CodeBlock - 코드 뷰어 컴포넌트
 *
 * HTML/CSS/JS 탭 전환, 8줄 미리보기, View/Hide 토글, 클립보드 복사 기능 제공
 * WAI-ARIA Tabs 패턴 준수 (role=tablist / tab / tabpanel)
 *
 * 사용 예시:
 *   const codeBlock = new CodeBlock('#my-code-block', {
 *     html: '<button>클릭</button>',
 *     css:  '.btn { color: red; }',
 *     js:   'document.querySelector(".btn").addEventListener("click", () => {});'
 *   });
 *   codeBlock.mount();
 *   codeBlock.afterMount();
 */

import Component from '../core/Component.js';

// 지원하는 탭 목록 (순서 고정)
const TABS = ['html', 'css', 'js'];

// 탭 레이블 표시용 매핑
const TAB_LABELS = { html: 'HTML', css: 'CSS', js: 'JS' };

export default class CodeBlock extends Component {
  /**
   * @param {string|HTMLElement} selector - 마운트 대상
   * @param {Object} codes - 각 탭별 코드 문자열 { html, css, js }
   */
  constructor(selector, codes = {}) {
    super(selector);

    // 각 탭 코드 (없는 탭은 빈 문자열)
    this.codes = {
      html: codes.html || '',
      css:  codes.css  || '',
      js:   codes.js   || '',
    };

    // 초기 상태
    this.state = {
      activeTab: 'html',
      isExpanded: false,
    };

    // 고유 ID - 여러 인스턴스 공존 시 ARIA id 충돌 방지
    this._uid = `cb-${Math.random().toString(36).slice(2, 8)}`;

    // 2초 복사 피드백 타이머 참조 (중복 방지)
    this._copyTimer = null;

    // 키보드 핸들러를 인스턴스 속성으로 저장 (bind 결과 유지 → 정확한 제거 가능)
    this._handleTabKeydown = this._onTabKeydown.bind(this);
    this._handleToggleKeydown = this._onToggleKeydown.bind(this);
  }

  // ─────────────────────────────────────────────
  // 렌더링
  // ─────────────────────────────────────────────

  /**
   * 컴포넌트 마크업 반환
   * - tablist / tab / tabpanel 구조
   * - footer: View/Hide Code 토글 + Copy 버튼
   */
  render() {
    const { activeTab, isExpanded } = this.state;
    const uid = this._uid;

    // 탭 버튼 목록 생성
    const tabButtons = TABS.map(tab => {
      const isActive = tab === activeTab;
      return `
        <button
          class="code-block__tab"
          role="tab"
          id="${uid}-tab-${tab}"
          aria-selected="${isActive}"
          aria-controls="${uid}-panel-${tab}"
          tabindex="${isActive ? '0' : '-1'}"
          data-tab="${tab}"
        >${TAB_LABELS[tab]}</button>`;
    }).join('');

    // 탭 패널 목록 생성
    const tabPanels = TABS.map(tab => {
      const isActive = tab === activeTab;
      // HTML 특수문자 이스케이프 (코드를 안전하게 표시)
      const escaped = this._escapeHtml(this.codes[tab]);
      return `
        <div
          class="code-block__panel${isExpanded ? ' expanded' : ''}"
          role="tabpanel"
          id="${uid}-panel-${tab}"
          aria-labelledby="${uid}-tab-${tab}"
          aria-expanded="${isActive}"
          tabindex="0"
          ${isActive ? '' : 'hidden'}
        ><pre class="code-block__content"><code>${escaped}</code></pre></div>`;
    }).join('');

    const toggleLabel = isExpanded ? 'Hide Code' : 'View Code';

    return `
      <div class="code-block">
        <!-- 탭 헤더 -->
        <div
          class="code-block__header"
          role="tablist"
          aria-label="코드 언어 선택"
          id="${uid}-tablist"
        >${tabButtons}
        </div>

        <!-- 탭 패널 영역 -->
        <div class="code-block__panels">
          ${tabPanels}
        </div>

        <!-- 푸터: 토글 + 복사 -->
        <div class="code-block__footer">
          <button
            class="code-block__toggle"
            aria-expanded="${isExpanded}"
            aria-controls="${uid}-panel-${activeTab}"
            id="${uid}-toggle"
          >${toggleLabel}</button>

          <button
            class="code-block__copy"
            aria-label="${TAB_LABELS[activeTab]} 코드 복사"
            id="${uid}-copy"
          >Copy</button>
        </div>
      </div>`;
  }

  // ─────────────────────────────────────────────
  // 생명주기
  // ─────────────────────────────────────────────

  /**
   * 이벤트 등록
   * - 탭 클릭 / 키보드 네비게이션
   * - View/Hide 토글 클릭 / 키보드
   * - Copy 버튼 클릭
   */
  afterMount() {
    // 탭 버튼 이벤트
    TABS.forEach(tab => {
      const btn = this._query(`#${this._uid}-tab-${tab}`);
      if (!btn) return;
      this._addEventListener(btn, 'click', () => this._switchTab(tab));
    });

    // tablist 키보드 네비게이션 (이벤트 위임)
    const tablist = this._query(`#${this._uid}-tablist`);
    if (tablist) {
      this._addEventListener(tablist, 'keydown', this._handleTabKeydown);
    }

    // View/Hide 토글 버튼
    const toggleBtn = this._query(`#${this._uid}-toggle`);
    if (toggleBtn) {
      this._addEventListener(toggleBtn, 'click', () => this._toggleExpand());
      this._addEventListener(toggleBtn, 'keydown', this._handleToggleKeydown);
    }

    // Copy 버튼
    const copyBtn = this._query(`#${this._uid}-copy`);
    if (copyBtn) {
      this._addEventListener(copyBtn, 'click', () => this._copyCode());
    }
  }

  /**
   * 컴포넌트 정리
   * - _eventListeners는 부모 destroy()가 일괄 제거
   * - 복사 타이머만 별도 정리
   */
  destroy() {
    if (this._copyTimer) {
      clearTimeout(this._copyTimer);
      this._copyTimer = null;
    }
    super.destroy();
  }

  // ─────────────────────────────────────────────
  // 탭 전환
  // ─────────────────────────────────────────────

  /**
   * 활성 탭 변경 - 전체 리렌더 없이 DOM만 업데이트
   * @param {string} tabName - 'html' | 'css' | 'js'
   */
  _switchTab(tabName) {
    if (this.state.activeTab === tabName) return;

    const prevTab = this.state.activeTab;
    this.state.activeTab = tabName;

    // 이전 탭 비활성화
    const prevBtn   = this._query(`#${this._uid}-tab-${prevTab}`);
    const prevPanel = this._query(`#${this._uid}-panel-${prevTab}`);
    if (prevBtn) {
      prevBtn.setAttribute('aria-selected', 'false');
      prevBtn.setAttribute('tabindex', '-1');
    }
    if (prevPanel) {
      prevPanel.setAttribute('aria-expanded', 'false');
      prevPanel.setAttribute('hidden', '');
    }

    // 새 탭 활성화
    const nextBtn   = this._query(`#${this._uid}-tab-${tabName}`);
    const nextPanel = this._query(`#${this._uid}-panel-${tabName}`);
    if (nextBtn) {
      nextBtn.setAttribute('aria-selected', 'true');
      nextBtn.setAttribute('tabindex', '0');
      nextBtn.focus();
    }
    if (nextPanel) {
      nextPanel.setAttribute('aria-expanded', 'true');
      nextPanel.removeAttribute('hidden');
    }

    // Copy 버튼의 aria-label 갱신
    const copyBtn = this._query(`#${this._uid}-copy`);
    if (copyBtn) {
      copyBtn.setAttribute('aria-label', `${TAB_LABELS[tabName]} 코드 복사`);
    }

    // 토글 버튼의 aria-controls 갱신 (활성 패널 연결)
    const toggleBtn = this._query(`#${this._uid}-toggle`);
    if (toggleBtn) {
      toggleBtn.setAttribute('aria-controls', `${this._uid}-panel-${tabName}`);
    }
  }

  // ─────────────────────────────────────────────
  // 확장/축소 토글
  // ─────────────────────────────────────────────

  /**
   * 현재 활성 패널의 확장/축소 토글
   * 모든 패널에 일괄 적용 (탭 전환 시 상태 유지)
   */
  _toggleExpand() {
    const isExpanded = !this.state.isExpanded;
    this.state.isExpanded = isExpanded;

    // 모든 패널에 expanded 클래스 적용/제거
    TABS.forEach(tab => {
      const panel = this._query(`#${this._uid}-panel-${tab}`);
      if (!panel) return;
      if (isExpanded) {
        panel.classList.add('expanded');
      } else {
        panel.classList.remove('expanded');
      }
    });

    // 토글 버튼 상태 업데이트
    const toggleBtn = this._query(`#${this._uid}-toggle`);
    if (toggleBtn) {
      toggleBtn.setAttribute('aria-expanded', String(isExpanded));
      toggleBtn.textContent = isExpanded ? 'Hide Code' : 'View Code';
    }
  }

  // ─────────────────────────────────────────────
  // 클립보드 복사
  // ─────────────────────────────────────────────

  /**
   * 현재 활성 탭의 코드를 클립보드에 복사
   * navigator.clipboard API 우선, 실패 시 execCommand fallback
   */
  async _copyCode() {
    const code = this.codes[this.state.activeTab];
    const copyBtn = this._query(`#${this._uid}-copy`);

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(code);
      } else {
        // 구형 브라우저 fallback
        this._copyFallback(code);
      }
      this._showCopySuccess(copyBtn);
    } catch (err) {
      // clipboard API 거부 시 fallback 시도
      try {
        this._copyFallback(code);
        this._showCopySuccess(copyBtn);
      } catch {
        console.error('CodeBlock: 클립보드 복사 실패', err);
      }
    }
  }

  /**
   * execCommand 기반 fallback 복사
   * @param {string} text - 복사할 텍스트
   */
  _copyFallback(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    // 화면에 보이지 않도록 처리
    textarea.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0;';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }

  /**
   * 복사 성공 시 버튼 2초 피드백
   * @param {HTMLElement} btn - Copy 버튼 엘리먼트
   */
  _showCopySuccess(btn) {
    if (!btn) return;

    btn.textContent = 'Copied!';
    btn.classList.add('copied');
    btn.setAttribute('aria-label', '복사 완료');

    // 이전 타이머 취소 (연속 클릭 방지)
    if (this._copyTimer) clearTimeout(this._copyTimer);

    this._copyTimer = setTimeout(() => {
      btn.textContent = 'Copy';
      btn.classList.remove('copied');
      btn.setAttribute('aria-label', `${TAB_LABELS[this.state.activeTab]} 코드 복사`);
      this._copyTimer = null;
    }, 2000);
  }

  // ─────────────────────────────────────────────
  // 키보드 네비게이션
  // ─────────────────────────────────────────────

  /**
   * tablist 내 키보드 네비게이션
   * ArrowRight/Left: 다음/이전 탭 (순환)
   * Home: 첫 번째 탭
   * End: 마지막 탭
   * @param {KeyboardEvent} e
   */
  _onTabKeydown(e) {
    const currentIndex = TABS.indexOf(this.state.activeTab);

    switch (e.key) {
      case 'ArrowRight': {
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % TABS.length;
        this._switchTab(TABS[nextIndex]);
        break;
      }
      case 'ArrowLeft': {
        e.preventDefault();
        const prevIndex = (currentIndex - 1 + TABS.length) % TABS.length;
        this._switchTab(TABS[prevIndex]);
        break;
      }
      case 'Home':
        e.preventDefault();
        this._switchTab(TABS[0]);
        break;
      case 'End':
        e.preventDefault();
        this._switchTab(TABS[TABS.length - 1]);
        break;
      default:
        break;
    }
  }

  /**
   * 토글 버튼 키보드 핸들러
   * Enter / Space: 확장/축소 토글
   * @param {KeyboardEvent} e
   */
  _onToggleKeydown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this._toggleExpand();
    }
  }

  // ─────────────────────────────────────────────
  // 유틸리티
  // ─────────────────────────────────────────────

  /**
   * HTML 특수문자 이스케이프 (XSS 방지 및 코드 표시용)
   * @param {string} str
   * @returns {string}
   */
  _escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }
}
