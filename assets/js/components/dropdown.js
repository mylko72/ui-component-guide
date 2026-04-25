/**
 * Dropdown Component - WAI-ARIA menu/menuitem 패턴 구현
 *
 * 기능:
 * - 버튼 클릭으로 aria-expanded 토글 및 메뉴 display 제어
 * - 외부 클릭 시 자동 닫기
 * - 키보드 네비게이션 (Enter/Space: 열기, Arrow Down/Up: 이동, Esc: 닫기, Tab: 닫기)
 * - aria-disabled로 비활성 항목 처리
 * - data-initialized로 중복 초기화 방지
 *
 * 점진적 강화:
 * - JS 비활성화 시: 메뉴가 펼쳐진 상태로 표시 (display:none 없음)
 * - JS 활성화 후: Dropdown.init()이 메뉴 display 및 aria-expanded 제어
 *
 * WAI-ARIA 참고: https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/
 * file:// 프로토콜 호환성: ES6 모듈 없음 (일반 스크립트)
 */

class Dropdown {
  /**
   * Dropdown 인스턴스 생성
   * @param {HTMLElement} container - [data-component="dropdown"] 요소
   */
  constructor(container) {
    this.container = container;

    // 트리거 버튼 탐색
    this.trigger = container.querySelector('[data-dropdown-trigger]');

    // 메뉴 목록 탐색
    this.menu = container.querySelector('[role="menu"]');

    // 열림 상태
    this.isOpen = false;

    // 현재 포커스된 menuitem 인덱스 (-1: 없음)
    this.focusedIndex = -1;

    // 외부 클릭 핸들러 참조 (removeEventListener에 사용)
    this._boundHandlers = {};
  }

  /**
   * public static init(container)
   * - container 내 모든 [data-component="dropdown"] 요소를 찾아 초기화
   * - data-initialized 속성으로 중복 초기화 방지
   * @param {Document|HTMLElement} container - 탐색 범위 (기본값: document)
   */
  static init(container = document) {
    container.querySelectorAll('[data-component="dropdown"]').forEach(el => {
      // 이미 초기화된 컨테이너는 건너뜀
      if (el.dataset.initialized) return;

      // 트리거 또는 메뉴가 없으면 건너뜀
      const trigger = el.querySelector('[data-dropdown-trigger]');
      const menu = el.querySelector('[role="menu"]');
      if (!trigger || !menu) return;

      // 초기화 표시
      el.dataset.initialized = 'true';

      // Dropdown 인스턴스 생성 및 이벤트 등록
      new Dropdown(el)._setup();
    });
  }

  /**
   * 초기화 설정: aria 속성 세팅 및 이벤트 리스너 등록
   */
  _setup() {
    // 초기 상태: 메뉴 닫힘 (점진적 강화 - JS 없을 때는 펼쳐진 상태)
    this._closeMenu();

    // 트리거와 메뉴 ID 연결 (aria-controls가 없으면 자동 설정)
    if (!this.menu.id) {
      this.menu.id = `dropdown-menu-${Math.random().toString(36).slice(2, 9)}`;
    }
    if (!this.trigger.getAttribute('aria-controls')) {
      this.trigger.setAttribute('aria-controls', this.menu.id);
    }

    // 이벤트 핸들러 바인딩 (this 참조 고정)
    this._boundHandlers = {
      // 트리거 클릭: 메뉴 토글
      triggerClick: (e) => {
        e.stopPropagation();
        this._toggleMenu();
      },
      // 트리거 키보드 입력
      triggerKeydown: (e) => this._handleTriggerKeydown(e),
      // 메뉴 키보드 입력
      menuKeydown: (e) => this._handleMenuKeydown(e),
      // 외부 클릭: 메뉴 닫기
      outsideClick: (e) => this._handleOutsideClick(e),
      // 포커스가 드롭다운 외부로 이동 시 닫기
      focusout: (e) => this._handleFocusout(e),
    };

    // 트리거 이벤트 등록
    this.trigger.addEventListener('click', this._boundHandlers.triggerClick);
    this.trigger.addEventListener('keydown', this._boundHandlers.triggerKeydown);

    // 메뉴 키보드 이벤트 등록
    this.menu.addEventListener('keydown', this._boundHandlers.menuKeydown);

    // 컨테이너 focusout: 포커스가 드롭다운 밖으로 나가면 닫기
    this.container.addEventListener('focusout', this._boundHandlers.focusout);

    // 외부 클릭 감지: document 레벨에서 등록 (메뉴가 열릴 때마다 attach/detach)
  }

  /**
   * 메뉴 열기
   * - display 속성으로 메뉴 표시
   * - aria-expanded 업데이트
   * - 첫 번째 활성 항목으로 포커스 이동
   */
  _openMenu() {
    if (this.isOpen) return;
    this.isOpen = true;

    // 메뉴 표시
    this.menu.style.display = 'block';

    // 트리거 상태 업데이트
    this.trigger.setAttribute('aria-expanded', 'true');

    // 외부 클릭 감지 시작
    document.addEventListener('click', this._boundHandlers.outsideClick);

    // 첫 번째 활성 menuitem으로 포커스 이동
    this.focusedIndex = -1;
    this._focusNextItem(1);
  }

  /**
   * 메뉴 닫기
   * - display: none으로 메뉴 숨김
   * - aria-expanded 업데이트
   * - 외부 클릭 감지 해제
   */
  _closeMenu() {
    this.isOpen = false;
    this.focusedIndex = -1;

    // 메뉴 숨김
    this.menu.style.display = 'none';

    // 트리거 상태 업데이트
    this.trigger.setAttribute('aria-expanded', 'false');

    // 외부 클릭 감지 해제
    document.removeEventListener('click', this._boundHandlers.outsideClick);

    // 포커스 표시 초기화
    this._clearFocusHighlight();
  }

  /**
   * 메뉴 토글 (열기 ↔ 닫기)
   */
  _toggleMenu() {
    if (this.isOpen) {
      this._closeMenu();
      // 닫을 때 트리거로 포커스 복귀
      this.trigger.focus();
    } else {
      this._openMenu();
    }
  }

  /**
   * 활성화 가능한 menuitem 목록 반환
   * - aria-disabled="true"인 항목 제외
   * @returns {HTMLElement[]} 활성화 가능한 menuitem 배열
   */
  _getEnabledItems() {
    return Array.from(
      this.menu.querySelectorAll('[role="menuitem"]')
    ).filter(item => item.getAttribute('aria-disabled') !== 'true');
  }

  /**
   * 모든 menuitem 목록 반환 (비활성 포함)
   * @returns {HTMLElement[]} 모든 menuitem 배열
   */
  _getAllItems() {
    return Array.from(this.menu.querySelectorAll('[role="menuitem"]'));
  }

  /**
   * 포커스 강조 표시 초기화
   * - 모든 menuitem의 data-focused 속성 제거
   */
  _clearFocusHighlight() {
    this._getAllItems().forEach(item => {
      delete item.dataset.focused;
      item.setAttribute('tabindex', '-1');
    });
  }

  /**
   * 특정 인덱스의 menuitem에 포커스
   * @param {number} index - 포커스할 항목의 인덱스 (enabledItems 기준)
   */
  _focusItem(index) {
    const enabledItems = this._getEnabledItems();
    if (enabledItems.length === 0) return;

    // 인덱스 클램핑 (순환)
    this.focusedIndex = (index + enabledItems.length) % enabledItems.length;

    // 모든 항목 포커스 표시 초기화
    this._clearFocusHighlight();

    // 선택된 항목 포커스
    const targetItem = enabledItems[this.focusedIndex];
    targetItem.dataset.focused = 'true';
    targetItem.setAttribute('tabindex', '0');
    targetItem.focus();
  }

  /**
   * 현재 포커스 위치에서 방향에 따라 다음 항목으로 이동
   * @param {number} direction - +1: 다음, -1: 이전
   */
  _focusNextItem(direction) {
    const enabledItems = this._getEnabledItems();
    if (enabledItems.length === 0) return;

    if (this.focusedIndex === -1) {
      // 첫 진입: direction이 +1이면 첫 번째, -1이면 마지막
      this._focusItem(direction > 0 ? 0 : enabledItems.length - 1);
    } else {
      this._focusItem(this.focusedIndex + direction);
    }
  }

  /**
   * 트리거 버튼의 키보드 이벤트 처리
   * WAI-ARIA Menu Button 패턴:
   * - Enter / Space: 메뉴 열기, 첫 번째 항목으로 포커스
   * - Arrow Down: 메뉴 열기, 첫 번째 항목으로 포커스
   * - Arrow Up: 메뉴 열기, 마지막 항목으로 포커스
   * - Escape: 메뉴 닫기 (이미 닫혀 있으면 무시)
   * @param {KeyboardEvent} e - 키보드 이벤트
   */
  _handleTriggerKeydown(e) {
    switch (e.key) {
      case 'Enter':
      case ' ':
        // 기본 동작(폼 제출 등) 방지
        e.preventDefault();
        if (!this.isOpen) {
          this._openMenu();
        }
        break;

      case 'ArrowDown':
        // 메뉴 열고 첫 번째 항목으로 이동
        e.preventDefault();
        if (!this.isOpen) {
          this._openMenu();
        } else {
          this._focusNextItem(1);
        }
        break;

      case 'ArrowUp':
        // 메뉴 열고 마지막 항목으로 이동
        e.preventDefault();
        if (!this.isOpen) {
          this._openMenu();
          // openMenu에서 첫 번째로 이동하므로 마지막으로 재이동
          const enabledItems = this._getEnabledItems();
          if (enabledItems.length > 0) {
            this._focusItem(enabledItems.length - 1);
          }
        } else {
          this._focusNextItem(-1);
        }
        break;

      case 'Escape':
        if (this.isOpen) {
          e.preventDefault();
          this._closeMenu();
          this.trigger.focus();
        }
        break;

      default:
        break;
    }
  }

  /**
   * 메뉴 내 키보드 이벤트 처리
   * WAI-ARIA Menu 키보드 명세:
   * - Arrow Down: 다음 항목으로 포커스 이동 (순환)
   * - Arrow Up: 이전 항목으로 포커스 이동 (순환)
   * - Home: 첫 번째 항목으로 포커스 이동
   * - End: 마지막 항목으로 포커스 이동
   * - Enter / Space: 선택 (menuitem 클릭 이벤트 발생)
   * - Escape: 메뉴 닫기, 트리거로 포커스 복귀
   * - Tab: 메뉴 닫기
   * @param {KeyboardEvent} e - 키보드 이벤트
   */
  _handleMenuKeydown(e) {
    const enabledItems = this._getEnabledItems();

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        this._focusNextItem(1);
        break;

      case 'ArrowUp':
        e.preventDefault();
        this._focusNextItem(-1);
        break;

      case 'Home':
        e.preventDefault();
        this._focusItem(0);
        break;

      case 'End':
        e.preventDefault();
        this._focusItem(enabledItems.length - 1);
        break;

      case 'Enter':
      case ' ':
        // 현재 포커스된 항목 클릭 실행
        e.preventDefault();
        if (this.focusedIndex >= 0 && enabledItems[this.focusedIndex]) {
          enabledItems[this.focusedIndex].click();
        }
        break;

      case 'Escape':
        e.preventDefault();
        this._closeMenu();
        // 메뉴 닫은 후 트리거로 포커스 복귀
        this.trigger.focus();
        break;

      case 'Tab':
        // Tab 키로 나가면 메뉴 닫기 (포커스는 자연스럽게 이동)
        this._closeMenu();
        break;

      default:
        break;
    }
  }

  /**
   * 외부 클릭 감지 핸들러
   * - 드롭다운 컨테이너 외부를 클릭하면 메뉴 닫기
   * @param {MouseEvent} e - 클릭 이벤트
   */
  _handleOutsideClick(e) {
    // 컨테이너 내부 클릭은 무시
    if (this.container.contains(e.target)) return;

    this._closeMenu();
  }

  /**
   * 포커스 이탈 감지 핸들러
   * - 포커스가 드롭다운 컨테이너 밖으로 이동하면 메뉴 닫기
   * - relatedTarget이 null(다른 창으로 이동 등)이거나 컨테이너 외부면 닫기
   * @param {FocusEvent} e - 포커스 이벤트
   */
  _handleFocusout(e) {
    // relatedTarget: 포커스가 이동하는 대상 요소
    // null이면 창 밖으로 포커스가 나간 것
    const relatedTarget = e.relatedTarget;

    // 포커스가 컨테이너 내부로 이동하는 경우는 무시
    if (relatedTarget && this.container.contains(relatedTarget)) return;

    // 컨테이너 외부로 포커스가 이동 → 메뉴 닫기
    if (this.isOpen) {
      this._closeMenu();
    }
  }

  /**
   * 인스턴스 정리 (이벤트 리스너 해제)
   * 동적으로 컴포넌트를 제거할 때 호출
   */
  destroy() {
    // 외부 클릭 감지 해제
    document.removeEventListener('click', this._boundHandlers.outsideClick);

    // 트리거 이벤트 해제
    this.trigger.removeEventListener('click', this._boundHandlers.triggerClick);
    this.trigger.removeEventListener('keydown', this._boundHandlers.triggerKeydown);

    // 메뉴 이벤트 해제
    this.menu.removeEventListener('keydown', this._boundHandlers.menuKeydown);

    // 컨테이너 이벤트 해제
    this.container.removeEventListener('focusout', this._boundHandlers.focusout);

    // 초기화 상태 초기화 (재초기화 가능하게)
    delete this.container.dataset.initialized;
  }
}

/**
 * DOMContentLoaded 이벤트에서 자동 초기화
 * - 페이지 로드 완료 후 모든 Dropdown 컴포넌트 초기화
 */
document.addEventListener('DOMContentLoaded', () => {
  Dropdown.init();
});
