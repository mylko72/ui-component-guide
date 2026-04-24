/**
 * Modal Component - 다이얼로그 모달
 *
 * 기능:
 * - dialog.showModal() / dialog.close() 네이티브 API 활용
 * - 포커스 트랩 (Tab이 모달 내부에서만 순환)
 * - Esc 키로 닫기 (dialog 기본 동작 위임)
 * - Body 스크롤 락 (overflow: hidden)
 * - 닫은 후 트리거 버튼으로 포커스 복원
 * - data-initialized로 중복 초기화 방지
 *
 * JS 없을 때: <dialog> 요소가 열린 상태(open 속성)로 페이지에 정적 표시
 * file:// 프로토콜 호환성: ES6 모듈 없는 일반 스크립트
 */

class Modal {
  /**
   * 포커스 가능한 요소 선택자 목록
   * 포커스 트랩에서 이동 가능한 요소를 탐색하는 데 사용
   */
  static FOCUSABLE_SELECTOR = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
  ].join(', ');

  /**
   * 페이지 내 모든 [data-modal-trigger] 요소를 찾아 Modal 초기화
   * data-initialized 속성으로 중복 초기화 방지
   *
   * @param {Document|HTMLElement} container - 탐색 범위 (기본값: document)
   */
  static init(container = document) {
    container.querySelectorAll('[data-modal-trigger]').forEach(trigger => {
      // 이미 초기화된 트리거는 건너뜀
      if (trigger.dataset.initialized) return;

      // 초기화 표시
      trigger.dataset.initialized = 'true';

      // Modal 인스턴스 생성 및 이벤트 설정
      new Modal(trigger)._setup();
    });
  }

  /**
   * Modal 인스턴스 생성
   * @param {HTMLElement} trigger - [data-modal-trigger] 버튼 요소
   */
  constructor(trigger) {
    this.trigger = trigger;

    // 트리거의 data-modal-target 속성값으로 대상 dialog 요소 탐색
    this.targetId = trigger.getAttribute('data-modal-target');
    this.dialog = document.getElementById(this.targetId);

    if (!this.dialog) {
      console.warn(`Modal: dialog#${this.targetId} 를 찾을 수 없습니다.`);
      return;
    }

    // JS 활성화 상태에서 open 속성 제거
    // (JS 없을 때는 open 속성으로 정적 표시, JS 있을 때는 showModal()이 open 관리)
    if (this.dialog.hasAttribute('open')) {
      this.dialog.removeAttribute('open');
    }

    // 닫기 버튼 ([data-modal-close] 속성 요소)
    this.closeBtns = this.dialog.querySelectorAll('[data-modal-close]');

    // keydown 이벤트 핸들러를 바인딩하여 저장 (removeEventListener를 위해)
    this._boundHandleKeydown = this._handleKeydown.bind(this);

    // 오버레이 클릭 핸들러도 바인딩하여 저장
    this._boundHandleOverlayClick = this._handleOverlayClick.bind(this);
  }

  /**
   * 이벤트 리스너 등록
   * 트리거 클릭, 닫기 버튼 클릭, dialog close 이벤트를 연결
   */
  _setup() {
    if (!this.dialog) return;

    // 트리거 버튼 클릭 → 모달 열기
    this.trigger.addEventListener('click', () => this._open());

    // 닫기 버튼들 클릭 → 모달 닫기
    this.closeBtns.forEach(btn => {
      btn.addEventListener('click', () => this.dialog.close());
    });

    // dialog close 이벤트 (Esc 또는 dialog.close() 호출 시)
    // 포커스 복원 및 스크롤 락 해제
    this.dialog.addEventListener('close', () => this._onClose());
  }

  /**
   * 모달 열기
   * - dialog.showModal() 호출
   * - 포커스 트랩 등록
   * - 오버레이(배경) 클릭 감지 등록
   * - Body 스크롤 락
   */
  _open() {
    // 이미 열려 있으면 중복 열기 방지
    if (this.dialog.open) return;

    // 네이티브 dialog showModal: backdrop 자동 생성 및 Esc 처리 위임
    this.dialog.showModal();

    // Body 스크롤 잠금
    document.body.style.overflow = 'hidden';

    // 포커스 트랩 keydown 이벤트 등록
    this.dialog.addEventListener('keydown', this._boundHandleKeydown);

    // 배경(backdrop) 클릭 시 닫기: dialog 영역 바깥 클릭 감지
    this.dialog.addEventListener('click', this._boundHandleOverlayClick);

    // 모달 내 첫 번째 포커스 가능 요소로 포커스 이동
    // requestAnimationFrame으로 렌더링 이후 실행 보장
    requestAnimationFrame(() => this._focusFirstElement());
  }

  /**
   * 모달 닫힘 후 처리
   * dialog close 이벤트에서 호출됨
   * - 이벤트 리스너 제거
   * - Body 스크롤 락 해제
   * - 트리거 버튼으로 포커스 복원
   */
  _onClose() {
    // 이벤트 리스너 정리 (메모리 누수 방지)
    this.dialog.removeEventListener('keydown', this._boundHandleKeydown);
    this.dialog.removeEventListener('click', this._boundHandleOverlayClick);

    // Body 스크롤 락 해제
    document.body.style.overflow = '';

    // 트리거 버튼으로 포커스 복원 (키보드 사용자 UX)
    this.trigger.focus();
  }

  /**
   * 포커스 트랩 키다운 핸들러
   * Tab / Shift+Tab 을 가로채 dialog 내부에서만 순환하도록 처리
   * Esc는 dialog 네이티브 동작에 위임 (자동으로 close 이벤트 발생)
   *
   * @param {KeyboardEvent} e
   */
  _handleKeydown(e) {
    if (e.key !== 'Tab') return;

    // 현재 포커스 가능한 요소 목록 (동적으로 매번 쿼리: disabled 상태 변경 대응)
    const focusableElements = Array.from(
      this.dialog.querySelectorAll(Modal.FOCUSABLE_SELECTOR)
    ).filter(el => !el.closest('[hidden]') && el.offsetParent !== null);

    if (focusableElements.length === 0) {
      // 포커스 가능한 요소가 없으면 Tab 동작 차단
      e.preventDefault();
      return;
    }

    const firstEl = focusableElements[0];
    const lastEl = focusableElements[focusableElements.length - 1];
    const activeEl = document.activeElement;

    if (e.shiftKey) {
      // Shift+Tab: 첫 번째 요소에서 → 마지막 요소로 순환
      if (activeEl === firstEl || !this.dialog.contains(activeEl)) {
        e.preventDefault();
        lastEl.focus();
      }
    } else {
      // Tab: 마지막 요소에서 → 첫 번째 요소로 순환
      if (activeEl === lastEl || !this.dialog.contains(activeEl)) {
        e.preventDefault();
        firstEl.focus();
      }
    }
  }

  /**
   * 오버레이(배경) 클릭 감지
   * dialog 요소 자체(backdrop 영역)를 클릭했을 때 닫기
   * dialog 내부 콘텐츠 클릭은 무시
   *
   * @param {MouseEvent} e
   */
  _handleOverlayClick(e) {
    // dialog 요소의 bounding box 밖을 클릭했으면 닫기
    const rect = this.dialog.getBoundingClientRect();
    const isOutside =
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom;

    if (isOutside) {
      this.dialog.close();
    }
  }

  /**
   * 모달 내 포커스 이동
   * 우선순위:
   * 1. autofocus 속성이 있는 요소 (showModal()이 자동 처리하므로 건너뜀)
   * 2. 첫 번째 포커스 가능 요소
   * 3. 포커스 가능한 요소가 없으면 dialog 자체
   */
  _focusFirstElement() {
    // autofocus 속성이 있는 요소는 showModal()이 자동으로 포커스
    // 이미 dialog 내부 요소에 포커스가 있으면 건너뜀
    if (this.dialog.contains(document.activeElement) && document.activeElement !== this.dialog) {
      return;
    }

    const focusableElements = Array.from(
      this.dialog.querySelectorAll(Modal.FOCUSABLE_SELECTOR)
    ).filter(el => !el.closest('[hidden]') && el.offsetParent !== null);

    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    } else {
      // 포커스 가능한 요소가 없으면 dialog 자체에 포커스
      this.dialog.setAttribute('tabindex', '-1');
      this.dialog.focus();
    }
  }
}

/**
 * DOMContentLoaded 이벤트에서 자동 초기화
 * 페이지 로드 완료 후 모든 [data-modal-trigger] 요소 초기화
 */
document.addEventListener('DOMContentLoaded', () => {
  Modal.init();
});
