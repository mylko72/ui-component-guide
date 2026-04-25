/**
 * Accordion Component - WAI-ARIA Accordion 패턴 구현
 *
 * 기능:
 * - 버튼 클릭으로 aria-expanded 토글 및 패널 display 제어
 * - 단일 열림 모드 (data-accordion-mode="single")
 * - 다중 열림 모드 (data-accordion-mode="multiple", 기본값)
 * - 키보드 네비게이션 (Enter/Space: 토글, Arrow Up/Down: 항목 이동, Home/End)
 * - 포커스 관리
 * - data-initialized로 중복 초기화 방지
 *
 * 점진적 강화:
 * - JS 비활성화 시: 모든 패널이 펼쳐진 상태로 표시 (aria-expanded="true" 마크업 기본값)
 * - JS 활성화 후: Accordion.init()이 패널 표시/숨김 제어
 *
 * WAI-ARIA 참고: https://www.w3.org/WAI/ARIA/apg/patterns/accordion/
 * file:// 프로토콜 호환성: ES6 모듈 없음 (일반 스크립트)
 */

class Accordion {
  /**
   * Accordion 인스턴스 생성
   * @param {HTMLElement} container - [data-component="accordion"] 요소
   */
  constructor(container) {
    this.container = container;

    // 열림 모드: "single" | "multiple" (기본값: multiple)
    this.mode = container.dataset.accordionMode || 'multiple';

    // 컨테이너 내 모든 트리거 버튼 수집
    this.triggers = Array.from(
      container.querySelectorAll('[data-accordion-trigger]')
    );

    // 각 트리거와 연결된 패널 수집 (aria-controls 속성 기준)
    this.panels = this.triggers.map(trigger => {
      const panelId = trigger.getAttribute('aria-controls');
      return panelId ? document.getElementById(panelId) : null;
    });
  }

  /**
   * public static init(container)
   * - container 내 모든 [data-component="accordion"] 요소를 찾아 초기화
   * - data-initialized 속성으로 중복 초기화 방지
   * @param {Document|HTMLElement} container - 탐색 범위 (기본값: document)
   */
  static init(container = document) {
    container.querySelectorAll('[data-component="accordion"]').forEach(el => {
      // 이미 초기화된 컨테이너는 건너뜀
      if (el.dataset.initialized) return;

      // 초기화 표시
      el.dataset.initialized = 'true';

      // Accordion 인스턴스 생성 및 이벤트 등록
      new Accordion(el)._setup();
    });
  }

  /**
   * 이벤트 리스너 등록 및 초기 상태 설정
   */
  _setup() {
    // 초기 상태 동기화: 마크업의 aria-expanded 기준으로 패널 표시
    this._syncInitialState();

    // 클릭 이벤트: 컨테이너에 이벤트 위임 등록 (성능 최적화)
    this.container.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-accordion-trigger]');
      if (!trigger || !this.triggers.includes(trigger)) return;

      // 비활성화(disabled) 트리거는 클릭 무시
      if (trigger.disabled || trigger.getAttribute('aria-disabled') === 'true') return;

      this._togglePanel(trigger);
    });

    // 키보드 이벤트: WAI-ARIA Accordion 키보드 상호작용 명세 준수
    this.container.addEventListener('keydown', (e) => {
      this._handleKeydown(e);
    });
  }

  /**
   * 초기 상태 동기화
   * - 마크업의 aria-expanded 값을 기준으로 패널 display 제어
   * - 점진적 강화: JS 없을 때 모든 패널이 펼쳐진 상태이므로
   *   JS 활성화 후 aria-expanded="false"인 패널은 즉시 숨김
   */
  _syncInitialState() {
    this.triggers.forEach((trigger, index) => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
      const panel = this.panels[index];

      if (panel) {
        // JS 없을 때 펼쳐진 상태를 JS가 제어하도록 전환
        panel.style.display = isExpanded ? '' : 'none';
      }
    });
  }

  /**
   * 패널 토글
   * - 단일 모드: 다른 패널을 모두 닫고 클릭한 패널만 토글
   * - 다중 모드: 클릭한 패널만 독립적으로 토글
   * @param {HTMLElement} trigger - 클릭된 트리거 버튼
   */
  _togglePanel(trigger) {
    const targetIndex = this.triggers.indexOf(trigger);
    if (targetIndex === -1) return;

    const targetPanel = this.panels[targetIndex];
    const isCurrentlyExpanded = trigger.getAttribute('aria-expanded') === 'true';

    if (this.mode === 'single') {
      // 단일 모드: 현재 열린 패널이 클릭된 경우 → 닫기
      //           다른 패널이 클릭된 경우 → 기존 패널 닫고 새 패널 열기
      this.triggers.forEach((t, i) => {
        const isTarget = i === targetIndex;
        // 현재 클릭한 트리거: 토글 / 나머지: 무조건 닫기
        const shouldExpand = isTarget ? !isCurrentlyExpanded : false;

        t.setAttribute('aria-expanded', shouldExpand ? 'true' : 'false');

        const panel = this.panels[i];
        if (panel) {
          panel.style.display = shouldExpand ? '' : 'none';
        }
      });
    } else {
      // 다중 모드: 클릭한 패널만 토글
      const newExpanded = !isCurrentlyExpanded;
      trigger.setAttribute('aria-expanded', newExpanded ? 'true' : 'false');

      if (targetPanel) {
        targetPanel.style.display = newExpanded ? '' : 'none';
      }
    }
  }

  /**
   * 키보드 이벤트 처리
   * WAI-ARIA Accordion 키보드 명세:
   * - Enter / Space: 포커스된 트리거의 패널 토글
   * - Arrow Down: 다음 트리거로 포커스 이동
   * - Arrow Up: 이전 트리거로 포커스 이동
   * - Home: 첫 번째 트리거로 포커스 이동
   * - End: 마지막 트리거로 포커스 이동
   * @param {KeyboardEvent} e - 키보드 이벤트
   */
  _handleKeydown(e) {
    const trigger = e.target.closest('[data-accordion-trigger]');
    if (!trigger || !this.triggers.includes(trigger)) return;

    const currentIndex = this.triggers.indexOf(trigger);

    // 비활성화된 트리거를 제외한 목록
    const enabledTriggers = this.triggers.filter(
      t => !t.disabled && t.getAttribute('aria-disabled') !== 'true'
    );

    switch (e.key) {
      case 'Enter':
      case ' ':
        // 패널 토글
        e.preventDefault();
        if (!trigger.disabled && trigger.getAttribute('aria-disabled') !== 'true') {
          this._togglePanel(trigger);
        }
        break;

      case 'ArrowDown':
        // 다음 트리거로 포커스 이동 (순환)
        e.preventDefault();
        this._focusAdjacentTrigger(currentIndex, 1);
        break;

      case 'ArrowUp':
        // 이전 트리거로 포커스 이동 (순환)
        e.preventDefault();
        this._focusAdjacentTrigger(currentIndex, -1);
        break;

      case 'Home':
        // 첫 번째 활성화 가능한 트리거로 포커스 이동
        e.preventDefault();
        if (enabledTriggers.length > 0) {
          enabledTriggers[0].focus();
        }
        break;

      case 'End':
        // 마지막 활성화 가능한 트리거로 포커스 이동
        e.preventDefault();
        if (enabledTriggers.length > 0) {
          enabledTriggers[enabledTriggers.length - 1].focus();
        }
        break;

      default:
        return;
    }
  }

  /**
   * 현재 인덱스에서 방향에 따라 다음 활성화 가능한 트리거로 포커스 이동
   * - 비활성화(disabled) 트리거는 건너뜀
   * - 순환(wrap-around) 지원
   * @param {number} currentIndex - 현재 트리거 인덱스
   * @param {number} direction - 이동 방향 (+1: 다음, -1: 이전)
   */
  _focusAdjacentTrigger(currentIndex, direction) {
    const total = this.triggers.length;
    let index = currentIndex;

    // 최대 total 번 반복하여 무한 루프 방지
    for (let i = 0; i < total; i++) {
      // 순환 계산: (index + direction + total) % total
      index = (index + direction + total) % total;
      const candidate = this.triggers[index];

      // 비활성화 트리거는 건너뜀
      if (!candidate.disabled && candidate.getAttribute('aria-disabled') !== 'true') {
        candidate.focus();
        return;
      }
    }
  }
}

/**
 * DOMContentLoaded 이벤트에서 자동 초기화
 * - 페이지 로드 완료 후 모든 Accordion 컴포넌트 초기화
 */
document.addEventListener('DOMContentLoaded', () => {
  Accordion.init();
});
