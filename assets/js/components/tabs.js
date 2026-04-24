/**
 * Tabs Component - WAI-ARIA Tabs 패턴 구현
 *
 * 기능:
 * - 탭 클릭으로 패널 전환
 * - 키보드 네비게이션 (Arrow Left/Right, Home, End)
 * - Roving tabindex 방식으로 포커스 관리
 * - ARIA 완전 구현 (role, aria-selected, aria-controls, aria-labelledby)
 *
 * WAI-ARIA 참고: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
 * file:// 프로토콜 호환성: ES6 모듈 없음 (일반 스크립트)
 */

class Tabs {
  /**
   * Tabs 인스턴스 생성
   * @param {HTMLElement} tablist - role="tablist" 요소
   */
  constructor(tablist) {
    this.tablist = tablist;

    // tablist 내의 모든 탭 버튼 수집
    this.tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));

    // 각 탭과 연결된 패널 수집 (aria-controls 속성 기준)
    this.panels = this.tabs.map(tab => {
      const panelId = tab.getAttribute('aria-controls');
      return panelId ? document.getElementById(panelId) : null;
    });
  }

  /**
   * public static init(container)
   * - container 내 모든 [role="tablist"] 요소를 찾아 Tabs 초기화
   * - data-initialized 속성으로 중복 초기화 방지
   * @param {Document|HTMLElement} container - 탐색 범위 (기본값: document)
   */
  static init(container = document) {
    container.querySelectorAll('[role="tablist"]').forEach(tablist => {
      // 중복 초기화 방지: 이미 처리된 tablist는 스킵
      if (tablist.dataset.initialized) return;

      // .code-block__header 내부의 탭 목록은 CodeBlock이 관리하므로 제외
      if (tablist.closest('[data-code-block]') || tablist.closest('.code-block')) return;

      // 초기화 표시
      tablist.dataset.initialized = 'true';

      // Tabs 인스턴스 생성 및 이벤트 등록
      new Tabs(tablist)._setup();
    });
  }

  /**
   * 이벤트 리스너 등록 및 초기 상태 설정
   * - 클릭 이벤트 (이벤트 위임)
   * - 키보드 이벤트 (Arrow Left/Right, Home, End)
   * - 초기 활성 탭 상태 동기화
   */
  _setup() {
    // 초기 상태 동기화: 마크업의 aria-selected 기준으로 패널 표시
    this._syncInitialState();

    // 클릭 이벤트: tablist에 위임 등록 (성능 최적화)
    this.tablist.addEventListener('click', (e) => {
      const tab = e.target.closest('[role="tab"]');
      if (!tab || !this.tabs.includes(tab)) return;

      // 비활성화(disabled) 탭은 클릭 무시
      if (tab.disabled || tab.getAttribute('aria-disabled') === 'true') return;

      this._activateTab(tab);
    });

    // 키보드 이벤트: WAI-ARIA Tabs 키보드 상호작용 명세 준수
    this.tablist.addEventListener('keydown', (e) => {
      this._handleKeydown(e);
    });
  }

  /**
   * 초기 상태 동기화
   * - 마크업에서 aria-selected="true"인 탭을 활성 탭으로 설정
   * - 활성 탭이 없으면 첫 번째 탭을 활성화
   * - Roving tabindex 초기화
   */
  _syncInitialState() {
    // aria-selected="true"인 탭 찾기
    const selectedTab = this.tabs.find(
      tab => tab.getAttribute('aria-selected') === 'true'
    );

    // 활성 탭이 없으면 첫 번째 탭 활성화
    const activeTab = selectedTab || this.tabs[0];

    if (!activeTab) return;

    // 모든 탭을 비활성화 후 하나만 활성화
    this.tabs.forEach((tab, index) => {
      const isActive = tab === activeTab;

      // aria-selected 동기화
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');

      // Roving tabindex: 활성 탭만 tabindex=0, 나머지는 -1
      tab.setAttribute('tabindex', isActive ? '0' : '-1');

      // 연결된 패널 표시/숨김 동기화
      const panel = this.panels[index];
      if (panel) {
        panel.style.display = isActive ? '' : 'none';
      }
    });
  }

  /**
   * 탭 활성화
   * - 클릭 또는 키보드로 탭 선택 시 호출
   * - aria-selected 토글, 패널 display 제어, tabindex 갱신
   * @param {HTMLElement} targetTab - 활성화할 탭 버튼 요소
   */
  _activateTab(targetTab) {
    const targetIndex = this.tabs.indexOf(targetTab);
    if (targetIndex === -1) return;

    this.tabs.forEach((tab, index) => {
      const isTarget = index === targetIndex;

      // aria-selected 갱신
      tab.setAttribute('aria-selected', isTarget ? 'true' : 'false');

      // Roving tabindex: 활성 탭만 tabindex=0
      tab.setAttribute('tabindex', isTarget ? '0' : '-1');

      // 패널 표시/숨김 제어
      const panel = this.panels[index];
      if (panel) {
        panel.style.display = isTarget ? '' : 'none';
      }
    });

    // 활성화된 탭으로 포커스 이동 (키보드 접근성)
    targetTab.focus();
  }

  /**
   * 키보드 이벤트 처리
   * WAI-ARIA Tabs 키보드 명세:
   * - ArrowLeft / ArrowRight: 이전/다음 탭으로 이동 (순환)
   * - Home: 첫 번째 탭으로 이동
   * - End: 마지막 탭으로 이동
   * - Enter / Space: 포커스된 탭 활성화 (자동 활성화 모드에서는 불필요하지만 명세상 지원)
   * @param {KeyboardEvent} e - 키보드 이벤트
   */
  _handleKeydown(e) {
    // 이벤트가 발생한 탭 찾기
    const focusedTab = e.target.closest('[role="tab"]');
    if (!focusedTab || !this.tabs.includes(focusedTab)) return;

    const currentIndex = this.tabs.indexOf(focusedTab);
    // 비활성화된 탭을 제외한 탭 목록
    const enabledTabs = this.tabs.filter(
      tab => !tab.disabled && tab.getAttribute('aria-disabled') !== 'true'
    );

    let nextTab = null;

    switch (e.key) {
      case 'ArrowRight':
        // 다음 탭으로 이동 (마지막 탭에서 첫 번째 탭으로 순환)
        e.preventDefault();
        nextTab = this._getNextEnabledTab(currentIndex, 1);
        break;

      case 'ArrowLeft':
        // 이전 탭으로 이동 (첫 번째 탭에서 마지막 탭으로 순환)
        e.preventDefault();
        nextTab = this._getNextEnabledTab(currentIndex, -1);
        break;

      case 'Home':
        // 첫 번째 활성화 가능한 탭으로 이동
        e.preventDefault();
        nextTab = enabledTabs[0] || null;
        break;

      case 'End':
        // 마지막 활성화 가능한 탭으로 이동
        e.preventDefault();
        nextTab = enabledTabs[enabledTabs.length - 1] || null;
        break;

      case 'Enter':
      case ' ':
        // 포커스된 탭 활성화 (자동 활성화 모드 보완)
        e.preventDefault();
        nextTab = focusedTab;
        break;

      default:
        return;
    }

    if (nextTab) {
      this._activateTab(nextTab);
    }
  }

  /**
   * 현재 인덱스에서 방향에 따라 다음 활성화 가능한 탭 찾기
   * - 비활성화(disabled) 탭은 건너뜀
   * - 순환(wrap-around) 지원
   * @param {number} currentIndex - 현재 탭 인덱스
   * @param {number} direction - 이동 방향 (+1: 다음, -1: 이전)
   * @returns {HTMLElement|null} - 다음 탭 요소 또는 null
   */
  _getNextEnabledTab(currentIndex, direction) {
    const total = this.tabs.length;
    let index = currentIndex;

    // 최대 total 번 반복하여 무한 루프 방지
    for (let i = 0; i < total; i++) {
      // 순환 계산: (index + direction + total) % total
      index = (index + direction + total) % total;
      const tab = this.tabs[index];

      // 비활성화 탭은 건너뜀
      if (!tab.disabled && tab.getAttribute('aria-disabled') !== 'true') {
        return tab;
      }
    }

    // 활성화 가능한 탭이 없는 경우 (모두 disabled) null 반환
    return null;
  }
}

/**
 * DOMContentLoaded 이벤트에서 자동 초기화
 * - 페이지 로드 완료 후 모든 Tabs 컴포넌트 초기화
 * - CodeBlock 내 role="tablist"는 제외 (CodeBlock이 별도 관리)
 */
document.addEventListener('DOMContentLoaded', () => {
  Tabs.init();
});
