/**
 * ModalManager - 전역 모달 관리 싱글톤
 *
 * 사용 예시:
 *   import modalManager from './ui/ModalManager.js';
 *
 *   // 기본 확인 모달
 *   modalManager.open({
 *     title: '삭제 확인',
 *     content: '<p>정말로 삭제하시겠습니까?</p>',
 *     onConfirm: () => deleteItem(),
 *     onCancel: () => console.log('취소됨'),
 *   });
 *
 *   // 크기 및 닫기 제어
 *   modalManager.open({
 *     title: '약관 동의',
 *     content: longHtmlString,
 *     size: 'lg',
 *     dismissible: false,
 *     onConfirm: () => agree(),
 *   });
 *
 *   // 수동 닫기
 *   modalManager.close();
 */

// 포커스 가능한 요소 선택자 (WAI-ARIA Authoring Practices 기준)
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  'details > summary',
].join(', ');

class ModalManager {
  constructor() {
    // 싱글톤 패턴: 이미 인스턴스가 있으면 반환
    if (ModalManager.instance) {
      return ModalManager.instance;
    }

    // 현재 열린 모달 정보 (null이면 닫힌 상태)
    this.currentModal = null;

    // 모달 열기 직전에 포커스된 요소 (닫힐 때 복원용)
    this._previousFocusElement = null;

    // 이벤트 핸들러 참조 보관 (정확한 removeEventListener를 위해 바인딩된 함수 저장)
    this._boundHandleKeydown = this._handleKeydown.bind(this);
    this._boundHandleOverlayClick = this._handleOverlayClick.bind(this);

    // #modal-container DOM 초기화
    this._initContainer();

    // 싱글톤 인스턴스 저장
    ModalManager.instance = this;
  }

  // ─────────────────────────────────────────────
  // Public API
  // ─────────────────────────────────────────────

  /**
   * 모달 열기
   * @param {Object} options
   * @param {string}   options.title              - 모달 제목 (필수)
   * @param {string}   options.content            - 모달 본문 HTML 문자열 (필수)
   * @param {Function} [options.onConfirm]        - 확인 버튼 클릭 콜백
   * @param {Function} [options.onCancel]         - 취소 버튼 클릭 또는 닫기 콜백
   * @param {string}   [options.size='md']        - 'sm' | 'md' | 'lg'
   * @param {boolean}  [options.dismissible=true] - 외부 클릭/Esc 키로 닫기 허용 여부
   */
  open({
    title,
    content,
    onConfirm = null,
    onCancel = null,
    size = 'md',
    dismissible = true,
  } = {}) {
    if (!title || !content) {
      console.warn('ModalManager.open: title과 content는 필수입니다.');
      return;
    }

    // 기존 모달이 열려 있으면 먼저 닫기 (스택 없이 단일 모달)
    if (this.currentModal) {
      this.close();
    }

    // 모달 열기 직전 포커스 요소 저장 (닫힘 후 복원용)
    this._previousFocusElement = document.activeElement;

    // 현재 모달 정보 저장
    this.currentModal = { title, content, onConfirm, onCancel, size, dismissible };

    // DOM 생성 및 컨테이너에 삽입
    const modalEl = this._buildModalElement(this.currentModal);
    this._container.appendChild(modalEl);

    // body 스크롤 잠금
    document.body.style.overflow = 'hidden';

    // 모달 외부 요소에 aria-hidden 적용 (스크린 리더가 배경 콘텐츠를 읽지 않도록)
    this._setAriaHiddenOnBackground(true);

    // 키보드 이벤트 등록 (Esc, Tab)
    document.addEventListener('keydown', this._boundHandleKeydown);

    // 오버레이 클릭 이벤트 등록
    const overlay = this._container.querySelector('.modal-overlay');
    if (overlay) {
      overlay.addEventListener('click', this._boundHandleOverlayClick);
    }

    // 포커스 설정: 모달 내 첫 번째 포커스 가능한 요소로 이동
    // requestAnimationFrame으로 DOM 페인트 후 포커스 (렌더링 타이밍 보장)
    requestAnimationFrame(() => {
      this._focusFirstElement();
    });
  }

  /**
   * 모달 닫기
   * - DOM 제거, body.overflow 복원, 포커스 복원, 리스너 제거
   * @param {boolean} [triggerCancel=false] - onCancel 콜백 호출 여부
   */
  close(triggerCancel = false) {
    if (!this.currentModal) return;

    const { onCancel } = this.currentModal;

    // 이벤트 리스너 제거
    document.removeEventListener('keydown', this._boundHandleKeydown);

    const overlay = this._container.querySelector('.modal-overlay');
    if (overlay) {
      overlay.removeEventListener('click', this._boundHandleOverlayClick);
    }

    // DOM 제거
    this._container.innerHTML = '';

    // body 스크롤 복원
    document.body.style.overflow = 'auto';

    // 배경 요소 aria-hidden 해제
    this._setAriaHiddenOnBackground(false);

    // 현재 모달 정보 초기화
    this.currentModal = null;

    // 포커스 복원: 모달 열기 전 요소로 이동
    if (this._previousFocusElement && typeof this._previousFocusElement.focus === 'function') {
      this._previousFocusElement.focus();
    }
    this._previousFocusElement = null;

    // onCancel 콜백 호출 (dismissible 닫기, 취소 버튼, Esc 시)
    if (triggerCancel && typeof onCancel === 'function') {
      onCancel();
    }
  }

  // ─────────────────────────────────────────────
  // Private: 초기화
  // ─────────────────────────────────────────────

  /**
   * body 하단에 #modal-container 생성
   * 이미 존재하는 경우 재사용
   */
  _initContainer() {
    let container = document.getElementById('modal-container');

    if (!container) {
      container = document.createElement('div');
      container.id = 'modal-container';
      document.body.appendChild(container);
    }

    this._container = container;
  }

  // ─────────────────────────────────────────────
  // Private: DOM 빌드
  // ─────────────────────────────────────────────

  /**
   * 모달 DOM 요소 생성
   * @param {Object} modalData - 모달 옵션 객체
   * @returns {HTMLElement} 오버레이 엘리먼트
   */
  _buildModalElement(modalData) {
    const { title, content, size } = modalData;

    // 모달 제목 ID (aria-labelledby 연결용)
    const titleId = 'modal-title';

    // 오버레이 (배경 어둡게)
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';

    // 다이얼로그 컨테이너
    const dialog = document.createElement('div');
    dialog.className = `modal modal--${size}`;
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');
    dialog.setAttribute('aria-labelledby', titleId);

    // 모달 내부 HTML 구성
    dialog.innerHTML = `
      <div class="modal__header">
        <h2 class="modal__title" id="${titleId}">${this._escapeHtml(title)}</h2>
        <button
          class="modal__close"
          type="button"
          aria-label="모달 닫기"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
      <div class="modal__body">
        ${content}
      </div>
      <div class="modal__footer">
        <button class="modal__btn modal__btn--cancel" type="button">취소</button>
        <button class="modal__btn modal__btn--confirm" type="button">확인</button>
      </div>
    `.trim();

    // 닫기 버튼 이벤트
    const closeBtn = dialog.querySelector('.modal__close');
    closeBtn.addEventListener('click', () => this.close(true));

    // 취소 버튼 이벤트
    const cancelBtn = dialog.querySelector('.modal__btn--cancel');
    cancelBtn.addEventListener('click', () => this.close(true));

    // 확인 버튼 이벤트
    const confirmBtn = dialog.querySelector('.modal__btn--confirm');
    confirmBtn.addEventListener('click', () => {
      const { onConfirm } = this.currentModal || {};
      if (typeof onConfirm === 'function') {
        onConfirm();
      }
      this.close(false);
    });

    overlay.appendChild(dialog);
    return overlay;
  }

  // ─────────────────────────────────────────────
  // Private: 포커스 관리
  // ─────────────────────────────────────────────

  /**
   * 모달 내 포커스 가능한 요소 목록 반환
   * @returns {HTMLElement[]}
   */
  _getFocusableElements() {
    const dialog = this._container.querySelector('.modal');
    if (!dialog) return [];
    return Array.from(dialog.querySelectorAll(FOCUSABLE_SELECTOR));
  }

  /**
   * 모달 내 첫 번째 포커스 가능한 요소로 포커스 이동
   */
  _focusFirstElement() {
    const focusable = this._getFocusableElements();
    if (focusable.length > 0) {
      focusable[0].focus();
    } else {
      // 포커스 가능한 요소가 없으면 다이얼로그 자체에 포커스
      const dialog = this._container.querySelector('.modal');
      if (dialog) {
        dialog.setAttribute('tabindex', '-1');
        dialog.focus();
      }
    }
  }

  /**
   * Tab 키 포커스 트랩: 모달 내 포커스 순환
   * @param {KeyboardEvent} event
   */
  _trapFocus(event) {
    const focusable = this._getFocusableElements();
    if (focusable.length === 0) return;

    const firstEl = focusable[0];
    const lastEl = focusable[focusable.length - 1];
    const activeEl = document.activeElement;

    if (event.shiftKey) {
      // Shift+Tab: 뒤로 이동 → 처음 요소에서 마지막으로 순환
      if (activeEl === firstEl || !focusable.includes(activeEl)) {
        event.preventDefault();
        lastEl.focus();
      }
    } else {
      // Tab: 앞으로 이동 → 마지막 요소에서 처음으로 순환
      if (activeEl === lastEl || !focusable.includes(activeEl)) {
        event.preventDefault();
        firstEl.focus();
      }
    }
  }

  // ─────────────────────────────────────────────
  // Private: 이벤트 핸들러
  // ─────────────────────────────────────────────

  /**
   * 키보드 이벤트 처리 (Esc: 닫기, Tab: 포커스 트랩)
   * @param {KeyboardEvent} event
   */
  _handleKeydown(event) {
    if (!this.currentModal) return;

    if (event.key === 'Escape') {
      // dismissible이 true일 때만 Esc로 닫기
      if (this.currentModal.dismissible) {
        event.preventDefault();
        this.close(true);
      }
    } else if (event.key === 'Tab') {
      this._trapFocus(event);
    }
  }

  /**
   * 오버레이 클릭 이벤트 처리 (배경 클릭 시 닫기)
   * @param {MouseEvent} event
   */
  _handleOverlayClick(event) {
    if (!this.currentModal) return;
    if (!this.currentModal.dismissible) return;

    // 오버레이 자체 클릭인지 확인 (모달 내부 클릭은 무시)
    if (event.target === event.currentTarget) {
      this.close(true);
    }
  }

  // ─────────────────────────────────────────────
  // Private: ARIA 관리
  // ─────────────────────────────────────────────

  /**
   * 모달 외부 주요 요소에 aria-hidden 속성 적용/해제
   * 모달이 열릴 때 배경 콘텐츠를 스크린 리더로부터 숨기기 위함
   * @param {boolean} hidden - true: 숨김, false: 복원
   */
  _setAriaHiddenOnBackground(hidden) {
    // body의 직계 자식 중 #modal-container를 제외한 요소에 적용
    const bodyChildren = Array.from(document.body.children);
    bodyChildren.forEach(child => {
      if (child.id === 'modal-container') return;

      if (hidden) {
        // 기존 aria-hidden 값을 data 속성으로 보관 (복원 시 사용)
        const existing = child.getAttribute('aria-hidden');
        if (existing !== null) {
          child.setAttribute('data-modal-aria-hidden-backup', existing);
        }
        child.setAttribute('aria-hidden', 'true');
      } else {
        // 원래 값이 있었으면 복원, 없었으면 속성 제거
        const backup = child.getAttribute('data-modal-aria-hidden-backup');
        if (backup !== null) {
          child.setAttribute('aria-hidden', backup);
          child.removeAttribute('data-modal-aria-hidden-backup');
        } else {
          child.removeAttribute('aria-hidden');
        }
      }
    });
  }

  // ─────────────────────────────────────────────
  // Private: 유틸리티
  // ─────────────────────────────────────────────

  /**
   * XSS 방지를 위한 HTML 특수문자 이스케이프 (title 등 텍스트 노드용)
   * content는 HTML 문자열을 그대로 허용하므로 이스케이프하지 않음
   * @param {string} str
   * @returns {string}
   */
  _escapeHtml(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }
}

// 싱글톤 인스턴스를 모듈 기본 export로 노출
export default new ModalManager();
