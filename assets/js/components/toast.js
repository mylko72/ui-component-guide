/**
 * Toast Component - WAI-ARIA live region 패턴 구현
 *
 * 기능:
 * - 동적 토스트 알림 생성 및 제거
 * - 타입별 스타일 (info, success, warning, error)
 * - 위치 제어 (top-right, top-left, bottom-right, bottom-left, top-center, bottom-center)
 * - 자동 사라짐 타이머 관리 (duration=0이면 자동 닫힘 없음)
 * - exit 애니메이션 중 _render 충돌 방지 (exitingIds Set으로 추적)
 * - 수동 닫기 (X 버튼)
 *
 * 접근성:
 * - info/success → aria-live="polite" (현재 작업 방해 없이 읽음)
 * - warning/error → aria-live="assertive" (즉시 인터럽트)
 * - role="status" 또는 role="alert"
 * - 닫기 버튼: aria-label 제공
 *
 * WAI-ARIA 참고: https://www.w3.org/WAI/ARIA/apg/patterns/alert/
 * file:// 프로토콜 호환성: ES6 모듈 없음 (일반 스크립트)
 */

class Toast {
  /**
   * Toast 싱글톤 인스턴스 생성
   * - 이미 인스턴스가 존재하면 기존 인스턴스 반환
   */
  constructor() {
    // 싱글톤 패턴: 전역에 단 하나의 인스턴스만 유지
    if (Toast.instance) {
      return Toast.instance;
    }
    Toast.instance = this;

    // 현재 표시 중인 토스트 목록
    // { id, type, message, duration, position, actionLabel, onAction }
    this.toasts = [];

    // 자동 닫힘 타이머 맵: { toastId: timeoutId }
    this.timers = {};

    // exit 애니메이션 중인 토스트 ID 추적 (DOM 충돌 방지)
    this.exitingIds = new Set();

    // 위치별 컨테이너 맵: { position: HTMLElement }
    this.containers = {};

    // 다음 토스트 ID (순차 증가)
    this._nextId = 1;
  }

  /**
   * static init(container)
   * - 페이지 내 [data-toast-trigger] 버튼을 찾아 클릭 이벤트 연결
   * - data-initialized로 중복 초기화 방지
   * @param {Document|HTMLElement} container - 탐색 범위 (기본값: document)
   */
  static init(container = document) {
    // 버튼 클릭으로 토스트를 트리거하는 data 속성 방식 초기화
    container.querySelectorAll('[data-toast-trigger]').forEach(btn => {
      // 중복 초기화 방지
      if (btn.dataset.initialized) return;
      btn.dataset.initialized = 'true';

      btn.addEventListener('click', () => {
        // 버튼의 data 속성에서 설정값 읽기
        const type     = btn.dataset.toastType     || 'info';
        const message  = btn.dataset.toastMessage  || '알림 메시지입니다.';
        const duration = btn.dataset.toastDuration !== undefined
          ? parseInt(btn.dataset.toastDuration, 10)
          : 3000;
        const position = btn.dataset.toastPosition || 'bottom-right';

        // 전역 싱글톤 인스턴스로 토스트 표시
        Toast.instance.show({ type, message, duration, position });
      });
    });
  }

  /**
   * 토스트 표시
   * @param {Object} options - 토스트 옵션
   * @param {string} [options.type='info'] - 타입: info | success | warning | error
   * @param {string} [options.message=''] - 표시할 메시지
   * @param {number} [options.duration=3000] - 자동 닫힘 시간(ms), 0이면 수동 닫기만 가능
   * @param {string} [options.position='bottom-right'] - 위치: top-right | top-left | bottom-right | bottom-left | top-center | bottom-center
   * @param {string} [options.actionLabel=''] - 액션 버튼 레이블 (선택)
   * @param {Function} [options.onAction=null] - 액션 버튼 클릭 콜백 (선택)
   * @returns {string} 생성된 토스트 ID
   */
  show({ type = 'info', message = '', duration = 3000, position = 'bottom-right', actionLabel = '', onAction = null } = {}) {
    // 고유 ID 생성
    const id = `toast-${this._nextId++}`;

    // 토스트 데이터 등록
    this.toasts.push({ id, type, message, duration, position, actionLabel, onAction });

    // 위치별 컨테이너 초기화 (없으면 생성)
    this._initContainer(position);

    // DOM에 토스트 요소 추가
    this._renderOne(id, { type, message, position, actionLabel, onAction });

    // 자동 닫힘 타이머 설정
    if (duration > 0) {
      this.timers[id] = setTimeout(() => {
        this.dismiss(id);
      }, duration);
    }

    return id;
  }

  /**
   * 토스트 닫기 (exit 애니메이션 후 제거)
   * @param {string} id - 닫을 토스트 ID
   */
  dismiss(id) {
    // 이미 닫히는 중이면 무시
    if (this.exitingIds.has(id)) return;

    const toastEl = document.getElementById(id);
    if (!toastEl) return;

    // exit 애니메이션 시작
    this.exitingIds.add(id);
    toastEl.classList.add('toast--exit');

    // 타이머 정리 (수동 닫기 시 자동 닫힘 취소)
    if (this.timers[id]) {
      clearTimeout(this.timers[id]);
      delete this.timers[id];
    }

    // 애니메이션 종료 후 실제 DOM 제거
    const onAnimationEnd = () => {
      toastEl.removeEventListener('animationend', onAnimationEnd);
      this._remove(id);
    };

    toastEl.addEventListener('animationend', onAnimationEnd);

    // prefers-reduced-motion: 애니메이션이 없으면 즉시 제거
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) {
      this._remove(id);
    }
  }

  /**
   * 모든 토스트 즉시 닫기
   */
  dismissAll() {
    // 현재 ID 목록을 복사해서 순회 (dismiss 중 배열 변경 방지)
    const ids = this.toasts.map(t => t.id);
    ids.forEach(id => this.dismiss(id));
  }

  /**
   * 위치별 컨테이너 초기화
   * - 이미 존재하면 재사용, 없으면 생성
   * @param {string} position - 위치 문자열
   */
  _initContainer(position) {
    // 이미 생성된 컨테이너가 있으면 재사용
    if (this.containers[position] && document.body.contains(this.containers[position])) {
      return;
    }

    // position별 컨테이너 ID
    const containerId = `toast-container-${position}`;
    let containerEl = document.getElementById(containerId);

    if (!containerEl) {
      containerEl = document.createElement('div');
      containerEl.id = containerId;
      containerEl.className = `toast-container toast-container--${position}`;

      // 접근성: 컨테이너는 region으로 마크업
      containerEl.setAttribute('role', 'region');
      containerEl.setAttribute('aria-label', '알림');
      containerEl.setAttribute('aria-live', 'off'); // 개별 토스트에서 live region 처리

      document.body.appendChild(containerEl);
    }

    this.containers[position] = containerEl;
  }

  /**
   * 단일 토스트 DOM 요소 생성 및 컨테이너에 삽입
   * @param {string} id - 토스트 ID
   * @param {Object} opts - 토스트 옵션
   */
  _renderOne(id, { type, message, position, actionLabel, onAction }) {
    const container = this.containers[position];
    if (!container) return;

    // 토스트 요소 생성
    const toastEl = document.createElement('div');
    toastEl.id = id;
    toastEl.className = `toast toast--${type}`;

    // 접근성 설정
    // info/success → status(polite), warning/error → alert(assertive)
    const isUrgent = type === 'warning' || type === 'error';
    toastEl.setAttribute('role', isUrgent ? 'alert' : 'status');
    toastEl.setAttribute('aria-live', isUrgent ? 'assertive' : 'polite');
    toastEl.setAttribute('aria-atomic', 'true');

    // 타입별 아이콘 (Lucide icon data 속성 사용)
    const iconMap = {
      info:    'info',
      success: 'check-circle',
      warning: 'alert-triangle',
      error:   'x-circle',
    };

    // 스크린 리더용 타입 레이블 (한국어)
    const typeLabels = {
      info:    '안내',
      success: '성공',
      warning: '경고',
      error:   '오류',
    };

    // 토스트 내부 HTML 구성
    let actionsHtml = '';
    if (actionLabel) {
      actionsHtml = `
        <button
          type="button"
          class="toast__action"
          aria-label="${actionLabel}"
        >${actionLabel}</button>
      `;
    }

    toastEl.innerHTML = `
      <span class="toast__icon" aria-hidden="true">
        <i data-lucide="${iconMap[type] || 'info'}" style="width:18px;height:18px;"></i>
      </span>
      <span class="toast__sr-type">${typeLabels[type] || type}:</span>
      <span class="toast__message">${this._escapeHtml(message)}</span>
      ${actionsHtml}
      <button
        type="button"
        class="toast__close"
        aria-label="알림 닫기"
      >
        <i data-lucide="x" style="width:14px;height:14px;" aria-hidden="true"></i>
      </button>
    `;

    // 닫기 버튼 이벤트
    const closeBtn = toastEl.querySelector('.toast__close');
    closeBtn.addEventListener('click', () => this.dismiss(id));

    // 액션 버튼 이벤트
    if (actionLabel && onAction) {
      const actionBtn = toastEl.querySelector('.toast__action');
      actionBtn.addEventListener('click', () => {
        onAction();
        this.dismiss(id);
      });
    }

    // 컨테이너에 삽입
    container.appendChild(toastEl);

    // Lucide 아이콘 렌더링 (전역 lucide 객체가 있을 때만)
    if (window.lucide) {
      window.lucide.createIcons({ nodes: [toastEl] });
    }
  }

  /**
   * 토스트 데이터 및 DOM에서 완전 제거
   * @param {string} id - 제거할 토스트 ID
   */
  _remove(id) {
    // DOM 제거
    const toastEl = document.getElementById(id);
    if (toastEl) {
      toastEl.remove();
    }

    // 데이터 배열에서 제거
    this.toasts = this.toasts.filter(t => t.id !== id);

    // exitingIds에서 제거
    this.exitingIds.delete(id);

    // 타이머 정리
    if (this.timers[id]) {
      clearTimeout(this.timers[id]);
      delete this.timers[id];
    }

    // 빈 컨테이너 정리
    this._cleanEmptyContainers();
  }

  /**
   * 토스트가 없는 컨테이너 제거
   * - 위치별 컨테이너가 비어있으면 DOM에서 제거하여 레이아웃 영향 방지
   */
  _cleanEmptyContainers() {
    Object.keys(this.containers).forEach(position => {
      const containerEl = this.containers[position];
      if (containerEl && containerEl.children.length === 0) {
        containerEl.remove();
        delete this.containers[position];
      }
    });
  }

  /**
   * HTML 특수문자 이스케이프 (XSS 방지)
   * @param {string} str - 이스케이프할 문자열
   * @returns {string} 이스케이프된 문자열
   */
  _escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /**
   * 편의 메서드: info 토스트 표시
   * @param {string} message - 메시지
   * @param {Object} [options={}] - 추가 옵션
   * @returns {string} 토스트 ID
   */
  info(message, options = {}) {
    return this.show({ ...options, type: 'info', message });
  }

  /**
   * 편의 메서드: success 토스트 표시
   * @param {string} message - 메시지
   * @param {Object} [options={}] - 추가 옵션
   * @returns {string} 토스트 ID
   */
  success(message, options = {}) {
    return this.show({ ...options, type: 'success', message });
  }

  /**
   * 편의 메서드: warning 토스트 표시
   * @param {string} message - 메시지
   * @param {Object} [options={}] - 추가 옵션
   * @returns {string} 토스트 ID
   */
  warning(message, options = {}) {
    return this.show({ ...options, type: 'warning', message });
  }

  /**
   * 편의 메서드: error 토스트 표시
   * @param {string} message - 메시지
   * @param {Object} [options={}] - 추가 옵션
   * @returns {string} 토스트 ID
   */
  error(message, options = {}) {
    return this.show({ ...options, type: 'error', message });
  }
}

/**
 * DOMContentLoaded 이벤트에서 자동 초기화
 * - data-toast-trigger 버튼 이벤트 연결
 * - 전역 toast 인스턴스 노출 (window.toast)
 */
document.addEventListener('DOMContentLoaded', () => {
  // 전역 싱글톤 인스턴스 생성
  window.toast = new Toast();

  // 페이지 내 data-toast-trigger 버튼 초기화
  Toast.init();
});
