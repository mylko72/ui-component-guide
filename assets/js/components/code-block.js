/**
 * CodeBlock Component - 코드 뷰어
 *
 * 기능:
 * - HTML/CSS/JS 탭 전환
 * - 확장/축소 (View Code / Hide Code)
 * - 클립보드 복사
 *
 * file:// 프로토콜 호환성: ES6 모듈 없음 (일반 스크립트)
 * 정적 HTML 마크업 기반 (동적 렌더링 없음)
 */

class CodeBlock {
  /**
   * CodeBlock 인스턴스 생성
   * @param {HTMLElement} element - [data-code-block] 요소
   */
  constructor(element) {
    this.el = element;
    this._setupTabs();
    this._setupToggle();
    this._setupCopy();
  }

  /**
   * public static init(container)
   * - [data-code-block] 요소를 모두 찾아 CodeBlock 초기화
   * - data-initialized 속성으로 중복 초기화 방지
   * @param {Document|HTMLElement} container - 탐색 범위 (기본값: document)
   */
  static init(container = document) {
    container.querySelectorAll('[data-code-block]').forEach(el => {
      // 중복 초기화 방지
      if (el.dataset.initialized) return;

      // 초기화 표시
      el.dataset.initialized = 'true';

      // CodeBlock 인스턴스 생성 및 초기화
      new CodeBlock(el);
    });
  }

  /**
   * 탭 전환 기능 설정
   * - [data-code-block-tab] 버튼 클릭 감지
   * - 활성 탭 전환
   */
  _setupTabs() {
    const tabs = this.el.querySelectorAll('[data-code-block-tab]');
    const panels = this.el.querySelectorAll('[data-code-block-panel]');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const tabName = tab.getAttribute('data-code-block-tab');

        // 모든 탭과 패널 비활성화
        tabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        panels.forEach(p => {
          p.classList.remove('active');
          p.setAttribute('aria-expanded', 'false');
        });

        // 클릭한 탭과 패널 활성화
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        const targetPanel = this.el.querySelector(
          `[data-code-block-panel="${tabName}"]`
        );
        if (targetPanel) {
          targetPanel.classList.add('active');
          targetPanel.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /**
   * 확장/축소 토글 버튼 설정
   * - View Code / Hide Code 토글
   * - [data-code-expand] 또는 .code-block__toggle 버튼
   */
  _setupToggle() {
    const toggleBtn = this.el.querySelector(
      '[data-code-expand], .code-block__toggle'
    );
    if (!toggleBtn) return;

    const panels = this.el.querySelectorAll('[data-code-block-panel]');

    toggleBtn.addEventListener('click', () => {
      const isExpanded = this.el.classList.contains('expanded');

      if (isExpanded) {
        // 축소
        this.el.classList.remove('expanded');
        toggleBtn.textContent = 'View Code';
        toggleBtn.setAttribute('aria-expanded', 'false');
        panels.forEach(p => p.classList.remove('expanded'));
      } else {
        // 확장
        this.el.classList.add('expanded');
        toggleBtn.textContent = 'Hide Code';
        toggleBtn.setAttribute('aria-expanded', 'true');
        panels.forEach(p => p.classList.add('expanded'));
      }
    });
  }

  /**
   * 클립보드 복사 버튼 설정
   * - [data-code-copy] 또는 .code-block__copy 버튼
   * - 현재 활성 탭의 코드 복사
   */
  _setupCopy() {
    const copyBtn = this.el.querySelector('[data-code-copy], .code-block__copy');
    if (!copyBtn) return;

    copyBtn.addEventListener('click', () => {
      // 활성 패널 찾기
      const activePanel = this.el.querySelector(
        '[data-code-block-panel].active, [data-code-block-panel][aria-expanded="true"]'
      );
      if (!activePanel) return;

      // 패널 내 코드 텍스트 추출
      const codeContent = activePanel.textContent.trim();
      if (!codeContent) return;

      // 클립보드 복사
      this._copyToClipboard(codeContent, copyBtn);
    });
  }

  /**
   * 클립보드에 텍스트 복사
   * - navigator.clipboard API 우선
   * - 실패 시 execCommand fallback
   * @param {string} text - 복사할 텍스트
   * @param {HTMLElement} btn - Copy 버튼
   */
  _copyToClipboard(text, btn) {
    // navigator.clipboard API 시도
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => this._showCopySuccess(btn))
        .catch(() => this._copyFallback(text, btn));
    } else {
      // 구형 브라우저 fallback
      this._copyFallback(text, btn);
    }
  }

  /**
   * execCommand 기반 fallback 복사
   * @param {string} text - 복사할 텍스트
   * @param {HTMLElement} btn - Copy 버튼
   */
  _copyFallback(text, btn) {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0;';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);

      this._showCopySuccess(btn);
    } catch (err) {
      console.error('CodeBlock: 클립보드 복사 실패', err);
    }
  }

  /**
   * 복사 성공 피드백 표시
   * - 2초 동안 "Copied!" 표시 후 원래대로 복원
   * @param {HTMLElement} btn - Copy 버튼
   */
  _showCopySuccess(btn) {
    const originalText = btn.textContent;

    // 피드백 표시
    btn.textContent = 'Copied!';
    btn.classList.add('copied');
    btn.setAttribute('aria-label', '복사 완료');

    // 2초 후 원래대로 복원
    setTimeout(() => {
      btn.textContent = originalText;
      btn.classList.remove('copied');
      btn.setAttribute('aria-label', '코드 복사');
    }, 2000);
  }
}

/**
 * DOMContentLoaded 이벤트에서 자동 초기화
 * - 페이지 로드 완료 후 모든 CodeBlock 초기화
 */
document.addEventListener('DOMContentLoaded', () => {
  CodeBlock.init();
});
