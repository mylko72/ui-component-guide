/**
 * Progress Component - WAI-ARIA progressbar 패턴 구현
 *
 * 기능:
 * - setValue(value)로 0~100 범위의 진행률 설정
 * - getValue()로 현재 진행률 반환
 * - increment(amount)로 진행률 증가
 * - reset()으로 진행률 0으로 초기화
 * - indeterminate 상태 토글 (불확정 진행)
 * - data-initialized로 중복 초기화 방지
 *
 * 점진적 강화:
 * - JS 비활성화 시: HTML의 style="--progress-value:N" 기반으로 CSS가 바 너비 제어
 * - JS 활성화 후: Progress.init()이 aria 속성 및 CSS 변수 동기화
 *
 * WAI-ARIA 참고: https://www.w3.org/WAI/ARIA/apg/patterns/progressbar/
 * file:// 프로토콜 호환성: ES6 모듈 없음 (일반 스크립트)
 */

class Progress {
  /**
   * Progress 인스턴스 생성
   * @param {HTMLElement} el - role="progressbar" 또는 [data-component="progress"] 요소
   */
  constructor(el) {
    // progressbar 역할 요소 (data-component="progress"인 경우 내부 탐색)
    this.el = el;

    // 진행률 바 요소
    this.bar = el.querySelector('.progress__bar');

    // 퍼센트 텍스트 표시 요소 (progress-wrapper 내에 있을 수 있음)
    // 가장 가까운 .progress-wrapper 부모에서 탐색
    const wrapper = el.closest('.progress-wrapper');
    this.valueText = wrapper
      ? wrapper.querySelector('.progress-value-text')
      : null;

    // 현재 진행률 (0~100)
    this._value = 0;

    // indeterminate(불확정) 상태 여부
    this._indeterminate = false;
  }

  /**
   * public static init(container)
   * - container 내 모든 [data-component="progress"] 요소를 찾아 초기화
   * - data-initialized 속성으로 중복 초기화 방지
   * @param {Document|HTMLElement} container - 탐색 범위 (기본값: document)
   */
  static init(container = document) {
    container.querySelectorAll('[data-component="progress"]').forEach(el => {
      // 이미 초기화된 요소는 건너뜀
      if (el.dataset.initialized) return;

      // .progress__bar가 없으면 건너뜀 (구조 불완전)
      if (!el.querySelector('.progress__bar')) return;

      // 초기화 표시
      el.dataset.initialized = 'true';

      // Progress 인스턴스 생성 및 초기 상태 설정
      const instance = new Progress(el);
      instance._setup();

      // 인스턴스를 요소에 저장 (외부에서 접근 가능)
      el._progressInstance = instance;
    });
  }

  /**
   * 초기화 설정: aria 속성 동기화 및 초기 값 적용
   */
  _setup() {
    // aria 필수 속성 설정
    this.el.setAttribute('role', 'progressbar');
    this.el.setAttribute('aria-valuemin', '0');
    this.el.setAttribute('aria-valuemax', '100');

    // aria-label이 없고 aria-labelledby도 없으면 기본 레이블 설정
    if (!this.el.getAttribute('aria-label') && !this.el.getAttribute('aria-labelledby')) {
      this.el.setAttribute('aria-label', '진행률');
    }

    // 마크업에 data-progress 또는 aria-valuenow가 있으면 그 값으로 초기화
    const initialValue = this._readInitialValue();
    this._applyValue(initialValue);
  }

  /**
   * 마크업에서 초기 진행률 값을 읽기
   * 우선순위: data-progress > aria-valuenow > CSS 변수 > 0
   * @returns {number} 초기 진행률 (0~100)
   */
  _readInitialValue() {
    // data-progress 속성 우선
    if (this.el.dataset.progress !== undefined) {
      const v = parseFloat(this.el.dataset.progress);
      if (!isNaN(v)) return this._clamp(v);
    }

    // aria-valuenow 속성
    const ariaValue = this.el.getAttribute('aria-valuenow');
    if (ariaValue !== null) {
      const v = parseFloat(ariaValue);
      if (!isNaN(v)) return this._clamp(v);
    }

    // CSS 변수 (style 속성에서 --progress-value 읽기)
    const style = this.bar ? this.bar.getAttribute('style') : '';
    if (style) {
      const match = style.match(/--progress-value\s*:\s*([\d.]+)/);
      if (match) {
        const v = parseFloat(match[1]);
        if (!isNaN(v)) return this._clamp(v);
      }
    }

    return 0;
  }

  /**
   * 진행률을 0~100으로 클램핑
   * @param {number} value - 원본 값
   * @returns {number} 클램핑된 값
   */
  _clamp(value) {
    return Math.min(100, Math.max(0, value));
  }

  /**
   * 진행률 값을 DOM에 실제로 적용
   * - CSS 변수 (--progress-value) 업데이트
   * - aria-valuenow 업데이트
   * - data-progress 업데이트
   * - 퍼센트 텍스트 업데이트
   * @param {number} value - 0~100 범위의 진행률
   */
  _applyValue(value) {
    this._value = value;

    // CSS 변수: .progress__bar의 width 제어
    if (this.bar) {
      this.bar.style.setProperty('--progress-value', String(value));
    }

    // aria-valuenow 업데이트 (스크린 리더 지원)
    this.el.setAttribute('aria-valuenow', String(value));

    // data-progress 속성 동기화
    this.el.dataset.progress = String(value);

    // 퍼센트 텍스트 업데이트
    if (this.valueText) {
      this.valueText.textContent = `${Math.round(value)}%`;
    }
  }

  /**
   * 진행률 설정 (public)
   * - 0~100 범위로 자동 클램핑
   * - indeterminate 상태였다면 해제
   * @param {number} value - 설정할 진행률 (0~100)
   * @returns {Progress} 메서드 체이닝 지원
   */
  setValue(value) {
    const clamped = this._clamp(parseFloat(value) || 0);

    // indeterminate 상태 해제
    if (this._indeterminate) {
      this._setIndeterminate(false);
    }

    this._applyValue(clamped);
    return this;
  }

  /**
   * 현재 진행률 반환 (public)
   * @returns {number} 현재 진행률 (0~100)
   */
  getValue() {
    return this._value;
  }

  /**
   * 진행률 증가 (public)
   * - 현재 값에 amount를 더함
   * - 100을 초과하면 100으로 클램핑
   * @param {number} amount - 증가량 (기본값: 10)
   * @returns {Progress} 메서드 체이닝 지원
   */
  increment(amount = 10) {
    return this.setValue(this._value + amount);
  }

  /**
   * 진행률 감소 (public)
   * - 현재 값에서 amount를 뺌
   * - 0 미만이면 0으로 클램핑
   * @param {number} amount - 감소량 (기본값: 10)
   * @returns {Progress} 메서드 체이닝 지원
   */
  decrement(amount = 10) {
    return this.setValue(this._value - amount);
  }

  /**
   * 진행률을 0으로 초기화 (public)
   * @returns {Progress} 메서드 체이닝 지원
   */
  reset() {
    return this.setValue(0);
  }

  /**
   * 진행률을 100으로 완료 처리 (public)
   * @returns {Progress} 메서드 체이닝 지원
   */
  complete() {
    return this.setValue(100);
  }

  /**
   * Indeterminate(불확정) 상태 설정/해제 (내부)
   * - 진행률을 알 수 없을 때 반복 애니메이션 표시
   * @param {boolean} active - true: 불확정 상태 활성, false: 해제
   */
  _setIndeterminate(active) {
    this._indeterminate = active;

    if (active) {
      // indeterminate 클래스 추가
      this.el.classList.add('progress--indeterminate');

      // aria: 불확정 상태는 aria-valuenow 제거
      this.el.removeAttribute('aria-valuenow');

      // 퍼센트 텍스트 숨김
      if (this.valueText) {
        this.valueText.textContent = '';
      }
    } else {
      // indeterminate 클래스 제거
      this.el.classList.remove('progress--indeterminate');

      // aria-valuenow 복원
      this.el.setAttribute('aria-valuenow', String(this._value));

      // 퍼센트 텍스트 복원
      if (this.valueText) {
        this.valueText.textContent = `${Math.round(this._value)}%`;
      }
    }
  }

  /**
   * Indeterminate 상태 토글 (public)
   * @param {boolean} [force] - 강제 설정값 (생략 시 현재 상태 반전)
   * @returns {Progress} 메서드 체이닝 지원
   */
  setIndeterminate(force) {
    const next = force !== undefined ? !!force : !this._indeterminate;
    this._setIndeterminate(next);
    return this;
  }

  /**
   * 현재 indeterminate 상태 여부 반환 (public)
   * @returns {boolean}
   */
  isIndeterminate() {
    return this._indeterminate;
  }

  /**
   * 인스턴스 정리 (public)
   * - 동적으로 컴포넌트를 제거할 때 호출
   * - Progress는 이벤트 리스너가 없으므로 초기화 상태만 해제
   */
  destroy() {
    // indeterminate 애니메이션 중이면 해제
    if (this._indeterminate) {
      this.el.classList.remove('progress--indeterminate');
    }

    // 초기화 상태 초기화 (재초기화 가능하게)
    delete this.el.dataset.initialized;
    delete this.el._progressInstance;
  }
}

/**
 * DOMContentLoaded 이벤트에서 자동 초기화
 * - 페이지 로드 완료 후 모든 Progress 컴포넌트 초기화
 */
document.addEventListener('DOMContentLoaded', () => {
  Progress.init();
});
