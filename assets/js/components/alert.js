/**
 * Alert 컴포넌트
 * - 정보, 성공, 경고, 오류 4가지 상태
 * - 닫기 버튼으로 수동 제거
 * - role="alert" ARIA 패턴으로 스크린리더 즉시 공지
 */
class Alert {
  /**
   * Alert 컴포넌트 초기화
   * @param {Document|HTMLElement} container - 초기화 범위 (기본: document)
   */
  static init(container = document) {
    container.querySelectorAll('[data-alert]').forEach(el => {
      // 중복 초기화 방지
      if (el.dataset.initialized) return;
      el.dataset.initialized = 'true';

      // 닫기 버튼 이벤트 등록
      const closeBtn = el.querySelector('[data-alert-close]');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          el.remove();
        });
      }
    });
  }
}

// 페이지 로드 시 자동 초기화
document.addEventListener('DOMContentLoaded', () => {
  Alert.init();
});
