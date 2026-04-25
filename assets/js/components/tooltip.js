/**
 * Tooltip Component - WAI-ARIA tooltip 패턴 구현
 *
 * 기능:
 * - mouseover/mouseout 이벤트로 마우스 호버 시 표시/숨김
 * - focus/blur 이벤트로 키보드 포커스 시 표시/숨김
 * - aria-describedby로 트리거와 툴팁 콘텐츠 연결
 * - aria-expanded로 현재 표시 상태 스크린 리더에 전달
 * - data-initialized로 중복 초기화 방지
 *
 * 점진적 강화:
 * - JS 비활성화 시: CSS :hover/:focus-within으로 자동 표시
 * - JS 활성화 후: data-js-loaded 속성 추가 후 .tooltip--visible 클래스로 제어
 *
 * WAI-ARIA 참고: https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/
 * file:// 프로토콜 호환성: ES6 모듈 없음 (일반 스크립트)
 */

class Tooltip {
  /**
   * Tooltip 인스턴스 생성
   * @param {HTMLElement} container - [data-component="tooltip"] 요소
   */
  constructor(container) {
    this.container = container;

    // 트리거 버튼 탐색
    this.trigger = container.querySelector('[data-tooltip-trigger]');

    // 툴팁 콘텐츠 패널 탐색
    this.content = container.querySelector('[data-tooltip-content]');

    // 툴팁 표시 여부 상태
    this.isVisible = false;

    // blur 딜레이 타이머 (mouseout → blur 전환 시 깜빡임 방지)
    this._hideTimer = null;

    // 이벤트 핸들러 참조 보관 (나중에 removeEventListener에 사용)
    this._boundHandlers = {};
  }

  /**
   * public static init(container)
   * - container 내 모든 [data-component="tooltip"] 요소를 찾아 초기화
   * - data-initialized 속성으로 중복 초기화 방지
   * @param {Document|HTMLElement} container - 탐색 범위 (기본값: document)
   */
  static init(container = document) {
    container.querySelectorAll('[data-component="tooltip"]').forEach(el => {
      // 이미 초기화된 컨테이너는 건너뜀
      if (el.dataset.initialized) return;

      // 트리거 또는 콘텐츠가 없으면 건너뜀
      const trigger = el.querySelector('[data-tooltip-trigger]');
      const content = el.querySelector('[data-tooltip-content]');
      if (!trigger || !content) return;

      // 초기화 표시
      el.dataset.initialized = 'true';

      // JS 제어 모드로 전환 (CSS :hover 폴백 비활성화)
      el.dataset.jsLoaded = 'true';

      // Tooltip 인스턴스 생성 및 이벤트 등록
      new Tooltip(el)._setup();
    });
  }

  /**
   * aria 속성 초기 설정 및 이벤트 리스너 등록
   */
  _setup() {
    // content 요소에 고유 ID가 없으면 자동 생성
    if (!this.content.id) {
      this.content.id = `tooltip-${Math.random().toString(36).slice(2, 9)}`;
    }

    // aria-describedby: 트리거와 툴팁 콘텐츠를 스크린 리더용으로 연결
    // 이미 설정되어 있으면 덮어쓰지 않음
    if (!this.trigger.getAttribute('aria-describedby')) {
      this.trigger.setAttribute('aria-describedby', this.content.id);
    }

    // aria-expanded: 초기 상태는 닫힘
    this.trigger.setAttribute('aria-expanded', 'false');

    // 이벤트 핸들러를 바인딩하여 참조 보관
    this._boundHandlers = {
      mouseenter: () => this._show(),
      mouseleave: () => this._scheduleHide(),
      focus: () => this._show(),
      blur: () => this._scheduleHide(),
      // 키보드 Escape 키로 닫기
      keydown: (e) => this._handleKeydown(e),
    };

    // 트리거에 이벤트 등록
    this.trigger.addEventListener('mouseenter', this._boundHandlers.mouseenter);
    this.trigger.addEventListener('mouseleave', this._boundHandlers.mouseleave);
    this.trigger.addEventListener('focus', this._boundHandlers.focus);
    this.trigger.addEventListener('blur', this._boundHandlers.blur);
    this.trigger.addEventListener('keydown', this._boundHandlers.keydown);
  }

  /**
   * 툴팁 표시
   * - .tooltip--visible 클래스 추가
   * - aria-expanded 업데이트
   */
  _show() {
    // 예약된 숨김 타이머 취소 (마우스가 빠르게 재진입 시)
    if (this._hideTimer) {
      clearTimeout(this._hideTimer);
      this._hideTimer = null;
    }

    if (this.isVisible) return;
    this.isVisible = true;

    this.content.classList.add('tooltip--visible');
    this.trigger.setAttribute('aria-expanded', 'true');
  }

  /**
   * 툴팁 숨김 예약
   * - 짧은 딜레이 후 실제로 숨김 처리
   * - blur/mouseleave가 연달아 발생할 때 깜빡임 방지
   */
  _scheduleHide() {
    this._hideTimer = setTimeout(() => {
      this._hide();
      this._hideTimer = null;
    }, 100);
  }

  /**
   * 툴팁 숨김
   * - .tooltip--visible 클래스 제거
   * - aria-expanded 업데이트
   */
  _hide() {
    if (!this.isVisible) return;
    this.isVisible = false;

    this.content.classList.remove('tooltip--visible');
    this.trigger.setAttribute('aria-expanded', 'false');
  }

  /**
   * 키보드 이벤트 처리
   * - Escape: 툴팁 닫기
   * @param {KeyboardEvent} e - 키보드 이벤트
   */
  _handleKeydown(e) {
    if (e.key === 'Escape' && this.isVisible) {
      e.preventDefault();
      this._hide();
    }
  }

  /**
   * 인스턴스 정리 (이벤트 리스너 해제)
   * 동적으로 컴포넌트를 제거할 때 호출
   */
  destroy() {
    if (this._hideTimer) {
      clearTimeout(this._hideTimer);
    }

    this.trigger.removeEventListener('mouseenter', this._boundHandlers.mouseenter);
    this.trigger.removeEventListener('mouseleave', this._boundHandlers.mouseleave);
    this.trigger.removeEventListener('focus', this._boundHandlers.focus);
    this.trigger.removeEventListener('blur', this._boundHandlers.blur);
    this.trigger.removeEventListener('keydown', this._boundHandlers.keydown);

    // 초기화 상태 초기화 (재초기화 가능하게)
    delete this.container.dataset.initialized;
    delete this.container.dataset.jsLoaded;
  }
}

/**
 * DOMContentLoaded 이벤트에서 자동 초기화
 * - 페이지 로드 완료 후 모든 Tooltip 컴포넌트 초기화
 */
document.addEventListener('DOMContentLoaded', () => {
  Tooltip.init();
});
