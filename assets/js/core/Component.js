/**
 * Component - 모든 UI 컴포넌트의 기본 클래스
 * 생명주기 관리 및 공통 유틸리티 제공
 *
 * 생명주기: constructor → mount() → render() → afterMount() → destroy()
 */

export default class Component {
  /**
   * 컴포넌트 인스턴스 생성
   * @param {string|HTMLElement} selector - CSS 선택자 또는 DOM 엘리먼트
   */
  constructor(selector) {
    // 엘리먼트 할당
    if (typeof selector === 'string') {
      this.element = this._query(selector);
    } else if (selector instanceof HTMLElement) {
      this.element = selector;
    } else {
      console.warn('Component: 유효한 selector 또는 HTMLElement를 제공해야 합니다.');
      this.element = null;
    }

    // 컴포넌트 상태 (서브클래스에서 오버라이드)
    this.state = {};

    // 이벤트 리스너 추적용 (메모리 관리)
    this._eventListeners = [];
  }

  /**
   * HTML 렌더링 (서브클래스에서 구현)
   * @returns {string} HTML 마크업
   */
  render() {
    console.warn('Component: render() 메서드는 서브클래스에서 구현해야 합니다.');
    return '';
  }

  /**
   * DOM 마운트 (서브클래스에서 필요시 오버라이드)
   * render() 후 DOM 요소에 마크업 적용
   */
  mount() {
    if (!this.element) {
      console.error('Component: 유효한 엘리먼트가 없습니다.');
      return;
    }

    const html = this.render();
    this.element.innerHTML = html;
  }

  /**
   * 마운트 후 초기화 (서브클래스에서 필요시 오버라이드)
   * 이벤트 리스너 등록, 초기 상태 설정 등
   */
  afterMount() {
    // 서브클래스에서 구현
  }

  /**
   * 컴포넌트 정리 및 메모리 해제 (서브클래스에서 구현)
   * 이벤트 리스너 제거, 상태 초기화 등
   */
  destroy() {
    // 모든 추적된 이벤트 리스너 제거
    this._eventListeners.forEach(({ target, event, callback }) => {
      target.removeEventListener(event, callback);
    });
    this._eventListeners = [];

    // 엘리먼트 정리
    if (this.element) {
      this.element.innerHTML = '';
    }

    // 상태 초기화
    this.state = {};
  }

  /**
   * 엘리먼트 조회 유틸 (내부/외부 선택자)
   * @param {string} selector - CSS 선택자
   * @returns {HTMLElement|null} 찾은 엘리먼트 또는 null
   */
  _query(selector) {
    if (typeof selector !== 'string') {
      console.warn('Component._query: 선택자는 문자열이어야 합니다.');
      return null;
    }

    // 절대 경로 선택자인 경우 document에서 조회
    if (selector.startsWith('#') && !this.element) {
      return document.querySelector(selector);
    }

    // this.element가 존재하면 범위 내에서 조회
    if (this.element) {
      return this.element.querySelector(selector);
    }

    // 둘 다 없으면 document에서 조회
    return document.querySelector(selector);
  }

  /**
   * 이벤트 리스너 추가 및 추적 (destroy 시 자동 제거)
   * @param {HTMLElement} target - 이벤트 타겟
   * @param {string} event - 이벤트 타입
   * @param {Function} callback - 콜백 함수
   */
  _addEventListener(target, event, callback) {
    if (!(target instanceof HTMLElement)) {
      console.warn('Component._addEventListener: 첫 인자는 HTMLElement여야 합니다.');
      return;
    }

    target.addEventListener(event, callback);
    // 메모리 관리를 위해 추적
    this._eventListeners.push({ target, event, callback });
  }

  /**
   * 이벤트 리스너 제거
   * @param {HTMLElement} target - 이벤트 타겟
   * @param {string} event - 이벤트 타입
   * @param {Function} callback - 콜백 함수
   */
  _removeEventListener(target, event, callback) {
    target.removeEventListener(event, callback);

    const index = this._eventListeners.findIndex(
      listener => listener.target === target && listener.event === event && listener.callback === callback
    );

    if (index > -1) {
      this._eventListeners.splice(index, 1);
    }
  }

  /**
   * 상태 업데이트 (필요시 리렌더링)
   * @param {Object} newState - 새로운 상태
   * @param {boolean} shouldRerender - 즉시 리렌더링 여부
   */
  setState(newState, shouldRerender = true) {
    this.state = { ...this.state, ...newState };

    if (shouldRerender) {
      this.mount();
      this.afterMount();
    }
  }
}
