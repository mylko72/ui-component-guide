/**
 * ToastManager - 전역 Toast 알림 관리 싱글톤
 *
 * 사용 예시:
 *   import toastManager from './ui/ToastManager.js';
 *
 *   // 기본 사용
 *   toastManager.show({ message: '저장되었습니다.', type: 'success' });
 *
 *   // 액션 버튼 포함
 *   toastManager.show({
 *     message: '항목이 삭제되었습니다.',
 *     type: 'warning',
 *     duration: 5000,
 *     action: { label: '실행 취소', callback: () => undoDelete() }
 *   });
 *
 *   // 수동 닫기
 *   const id = toastManager.show({ message: '처리 중...', type: 'info', duration: 0 });
 *   toastManager.dismiss(id);
 */

// 타입별 aria-live 정책 매핑
// info/success는 polite(현재 작업 방해 없이), warning/error는 assertive(즉시 읽어주기)
const ARIA_LIVE_MAP = {
  info: 'polite',
  success: 'polite',
  warning: 'assertive',
  error: 'assertive',
};

// 타입별 아이콘 SVG (인라인, 외부 라이브러리 의존 없음)
const ICON_MAP = {
  info: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
  success: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
  warning: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  error: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
};

// 타입별 한국어 접근성 레이블
const TYPE_LABEL_MAP = {
  info: '정보',
  success: '성공',
  warning: '경고',
  error: '오류',
};

class ToastManager {
  constructor() {
    // 싱글톤 패턴: 이미 인스턴스가 있으면 반환
    if (ToastManager.instance) {
      return ToastManager.instance;
    }

    // toast 목록 (배열)
    this.toasts = [];

    // 타이머 맵: { [toastId]: timeoutId }
    this.timers = {};

    // 고유 ID 카운터
    this._idCounter = 0;

    // toast-container DOM 초기화
    this._initContainer();

    // 싱글톤 인스턴스 저장
    ToastManager.instance = this;
  }

  // ─────────────────────────────────────────────
  // Public API
  // ─────────────────────────────────────────────

  /**
   * Toast 표시
   * @param {Object} options
   * @param {string}   options.message           - 표시할 메시지 (필수)
   * @param {string}   [options.type='info']     - 'info' | 'success' | 'warning' | 'error'
   * @param {number}   [options.duration=3000]   - 자동 닫힘 시간(ms). 0이면 자동 닫힘 없음
   * @param {Object}   [options.action]          - 액션 버튼 { label, callback }
   * @returns {string} 생성된 toast의 고유 id
   */
  show({ message, type = 'info', duration = 3000, action = null } = {}) {
    if (!message) {
      console.warn('ToastManager.show: message는 필수입니다.');
      return null;
    }

    // 유효하지 않은 type 방어
    const safeType = ARIA_LIVE_MAP[type] ? type : 'info';

    // 고유 ID 생성
    const id = `toast-${++this._idCounter}`;

    // toast 객체 생성
    const toast = {
      id,
      message,
      type: safeType,
      duration,
      action,
    };

    // 배열에 추가
    this.toasts.push(toast);

    // DOM 갱신
    this._render();

    // 자동 닫힘 타이머 설정 (duration > 0 일 때만)
    if (duration > 0) {
      this.timers[id] = setTimeout(() => {
        this.dismiss(id);
      }, duration);
    }

    return id;
  }

  /**
   * 특정 Toast 제거
   * @param {string} toastId - 제거할 toast의 id
   */
  dismiss(toastId) {
    // 타이머 정리 (중복 clearTimeout 방지)
    if (this.timers[toastId]) {
      clearTimeout(this.timers[toastId]);
      delete this.timers[toastId];
    }

    // exit 애니메이션 적용 후 DOM에서 제거
    const toastEl = this._container
      ? this._container.querySelector(`[data-toast-id="${toastId}"]`)
      : null;

    if (toastEl) {
      // exit 클래스 추가 → CSS transition 완료 후 배열/DOM 제거
      toastEl.classList.add('toast--exit');
      toastEl.addEventListener('animationend', () => {
        this._removeFromArray(toastId);
        this._render();
      }, { once: true });
    } else {
      // 컨테이너에 없는 경우(이미 제거된 경우) 배열에서만 제거
      this._removeFromArray(toastId);
      this._render();
    }
  }

  // ─────────────────────────────────────────────
  // Private: 초기화
  // ─────────────────────────────────────────────

  /**
   * body 하단에 #toast-container 생성
   * 이미 존재하는 경우 재사용 (페이지 새로고침 없이 재초기화 시 안전)
   */
  _initContainer() {
    // 기존 컨테이너 재사용 (중복 생성 방지)
    let container = document.getElementById('toast-container');

    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.setAttribute('role', 'region');
      container.setAttribute('aria-label', '알림');
      document.body.appendChild(container);
    }

    this._container = container;
  }

  // ─────────────────────────────────────────────
  // Private: 렌더링
  // ─────────────────────────────────────────────

  /**
   * this.toasts 배열을 기반으로 #toast-container의 innerHTML 갱신
   * 각 toast 엘리먼트: <div class="toast toast--{type}" role="alert" aria-live="{live}">
   */
  _render() {
    if (!this._container) return;

    // 배열이 비어있으면 컨테이너 초기화 후 종료
    if (this.toasts.length === 0) {
      this._container.innerHTML = '';
      return;
    }

    // 현재 exit 애니메이션 중인 요소 ID 목록 수집
    // (dismiss 후 animationend를 기다리는 toast를 _render가 덮어쓰지 않도록)
    const exitingIds = new Set();
    this._container.querySelectorAll('.toast--exit').forEach(el => {
      exitingIds.add(el.dataset.toastId);
    });

    // toast 배열을 HTML 문자열로 변환
    const html = this.toasts
      .filter(toast => !exitingIds.has(toast.id)) // exit 중인 toast는 제외 (이미 DOM에 있음)
      .map(toast => this._buildToastHtml(toast))
      .join('');

    // 기존 exit-중인 요소는 유지하고 나머지만 갱신
    // 전략: 전체 innerHTML 교체 후, exit 중이던 요소를 앞에 다시 삽입
    const exitingEls = [];
    exitingIds.forEach(id => {
      const el = this._container.querySelector(`[data-toast-id="${id}"]`);
      if (el) exitingEls.push(el.cloneNode(true));
    });

    this._container.innerHTML = html;

    // exit 중인 요소를 컨테이너 앞에 복원 (이벤트 재등록 필요 없음 - 이미 animationend 처리됨)
    exitingEls.forEach(el => {
      this._container.insertBefore(el, this._container.firstChild);
    });

    // 각 toast에 닫기 버튼 이벤트 등록
    this.toasts
      .filter(toast => !exitingIds.has(toast.id))
      .forEach(toast => {
        const closeBtn = this._container.querySelector(
          `[data-toast-id="${toast.id}"] .toast__close`
        );
        if (closeBtn) {
          closeBtn.addEventListener('click', () => this.dismiss(toast.id));
        }

        // 액션 버튼 이벤트 등록
        if (toast.action) {
          const actionBtn = this._container.querySelector(
            `[data-toast-id="${toast.id}"] .toast__action`
          );
          if (actionBtn) {
            actionBtn.addEventListener('click', () => {
              toast.action.callback();
              this.dismiss(toast.id);
            });
          }
        }
      });
  }

  /**
   * toast 객체 → HTML 문자열 변환
   * @param {Object} toast - toast 데이터 객체
   * @returns {string} HTML 문자열
   */
  _buildToastHtml(toast) {
    const { id, type, message, action } = toast;
    const ariaLive = ARIA_LIVE_MAP[type] || 'polite';
    const icon = ICON_MAP[type] || ICON_MAP.info;
    const typeLabel = TYPE_LABEL_MAP[type] || '';

    // 액션 버튼 HTML (있는 경우만)
    const actionHtml = action
      ? `<button class="toast__action" type="button">${this._escapeHtml(action.label)}</button>`
      : '';

    return `
      <div
        class="toast toast--${type}"
        role="alert"
        aria-live="${ariaLive}"
        aria-atomic="true"
        data-toast-id="${id}"
      >
        <span class="toast__icon" aria-hidden="true">${icon}</span>
        <span class="toast__sr-type" aria-hidden="true">${typeLabel}:</span>
        <span class="toast__message">${this._escapeHtml(message)}</span>
        ${actionHtml}
        <button
          class="toast__close"
          type="button"
          aria-label="알림 닫기"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>`.trim();
  }

  // ─────────────────────────────────────────────
  // Private: 유틸리티
  // ─────────────────────────────────────────────

  /**
   * this.toasts 배열에서 특정 id의 toast 제거
   * @param {string} toastId
   */
  _removeFromArray(toastId) {
    this.toasts = this.toasts.filter(t => t.id !== toastId);
  }

  /**
   * XSS 방지를 위한 HTML 특수문자 이스케이프
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
export default new ToastManager();
