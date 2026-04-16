/**
 * ThemeManager - 다크/라이트 모드 관리
 * localStorage 및 OS 설정 기반 테마 관리
 *
 * 사용: await themeManager.init();
 *      themeManager.toggle();
 *      themeManager.getCurrent();
 */

class ThemeManager {
  constructor() {
    // 저장소 키
    this.STORAGE_KEY = 'uig-theme';

    // 지원하는 테마
    this.THEMES = {
      LIGHT: 'light',
      DARK: 'dark'
    };

    // 현재 테마
    this._currentTheme = null;
  }

  /**
   * 테마 매니저 초기화
   * 1. localStorage에서 저장된 테마 확인
   * 2. 없으면 OS 설정 감지
   * 3. 결과 적용 및 저장
   */
  async init() {
    // localStorage에서 저장된 테마 확인
    const savedTheme = localStorage.getItem(this.STORAGE_KEY);

    if (savedTheme && (savedTheme === this.THEMES.LIGHT || savedTheme === this.THEMES.DARK)) {
      this.apply(savedTheme);
      return;
    }

    // 저장된 테마가 없으면 OS 설정 감지
    const systemTheme = this.getSystemPreference();
    this.apply(systemTheme);
  }

  /**
   * 테마 적용
   * @param {string} theme - 적용할 테마 ('light' 또는 'dark')
   */
  apply(theme) {
    // 유효한 테마인지 확인
    if (theme !== this.THEMES.LIGHT && theme !== this.THEMES.DARK) {
      console.warn(`ThemeManager: "${theme}"은 유효하지 않은 테마입니다. 'light' 또는 'dark'를 사용하세요.`);
      return;
    }

    // HTML 루트 엘리먼트에 data-theme 속성 설정
    document.documentElement.setAttribute('data-theme', theme);

    // 현재 테마 저장
    this._currentTheme = theme;

    // localStorage에 저장
    localStorage.setItem(this.STORAGE_KEY, theme);

    // 테마 변경 이벤트 발행
    window.dispatchEvent(
      new CustomEvent('theme-changed', {
        detail: { theme }
      })
    );
  }

  /**
   * 테마 전환 (현재 테마의 반대값으로 변경)
   */
  toggle() {
    const nextTheme = this._currentTheme === this.THEMES.LIGHT ? this.THEMES.DARK : this.THEMES.LIGHT;
    this.apply(nextTheme);
  }

  /**
   * 현재 적용된 테마 반환
   * @returns {string} 'light' 또는 'dark'
   */
  getCurrent() {
    return this._currentTheme;
  }

  /**
   * OS의 색상 스킴 설정 감지
   * @returns {string} 'dark' 또는 'light'
   */
  getSystemPreference() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? this.THEMES.DARK : this.THEMES.LIGHT;
  }

  /**
   * 특정 테마로 강제 설정 (init 스킵)
   * @param {string} theme - 설정할 테마
   */
  set(theme) {
    this.apply(theme);
  }

  /**
   * 테마 초기화 (기본값으로 복원)
   */
  reset() {
    localStorage.removeItem(this.STORAGE_KEY);
    const systemTheme = this.getSystemPreference();
    this.apply(systemTheme);
  }
}

// 싱글톤 인스턴스 생성 및 내보내기
const themeManager = new ThemeManager();
export default themeManager;
