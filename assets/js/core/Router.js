/**
 * Router - 해시 기반 SPA 라우팅 시스템
 * 경로별 컴포넌트 렌더링 및 생명주기 관리
 *
 * 사용: const router = new Router('#app-content');
 *      router.register('/button', ButtonDemo);
 *      router.navigate('/button');
 */

import { EventBus } from './EventBus.js';

export default class Router {
  /**
   * 라우터 인스턴스 생성
   * @param {string} rootSelector - 콘텐츠를 렌더링할 루트 엘리먼트 선택자
   * @param {boolean} autoInit - 자동 초기화 여부 (기본값: true)
   */
  constructor(rootSelector, autoInit = true) {
    // 루트 엘리먼트
    this.rootElement = document.querySelector(rootSelector);
    if (!this.rootElement) {
      console.error(`Router: "${rootSelector}" 엘리먼트를 찾을 수 없습니다.`);
      return;
    }

    // 라우트 저장소: { '/path': ComponentClass, ... }
    this.routes = {};

    // 현재 활성화된 컴포넌트 인스턴스
    this._currentComponent = null;

    // 라우트 변경 이벤트를 전달하기 위한 EventBus 인스턴스
    this.eventBus = new EventBus();

    // hashchange 이벤트 리스너 등록
    window.addEventListener('hashchange', () => this._handleHashChange());

    // 자동 초기화 (false면 나중에 수동으로 호출)
    if (autoInit) {
      this._handleHashChange();
    }
  }

  /**
   * 라우트 등록
   * @param {string} path - 라우트 경로 (예: '/button')
   * @param {Class} componentClass - 컴포넌트 클래스 (Component를 상속한 클래스)
   */
  register(path, componentClass) {
    // 경로 정규화: '/' 로 시작하지 않으면 추가
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;

    if (typeof componentClass !== 'function') {
      console.warn(`Router: "${normalizedPath}"의 컴포넌트는 클래스여야 합니다.`);
      return;
    }

    this.routes[normalizedPath] = componentClass;
  }

  /**
   * 특정 경로로 네비게이트
   * @param {string} path - 이동할 경로
   */
  navigate(path) {
    // 경로 정규화
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;

    // 해시 변경 (hashchange 이벤트 자동 트리거)
    window.location.hash = `#${normalizedPath}`;
  }

  /**
   * 브라우저 뒤로 가기
   */
  back() {
    window.history.back();
  }

  /**
   * 브라우저 앞으로 가기
   */
  forward() {
    window.history.forward();
  }

  /**
   * 현재 경로 반환
   * @returns {string} 현재 경로
   */
  getCurrentPath() {
    // 해시에서 '#' 제거 및 쿼리스트링 제거
    const hash = window.location.hash.slice(1) || '/';
    return hash.split('?')[0];
  }

  /**
   * 해시 변경 감지 및 처리 (내부 메서드)
   * @private
   */
  _handleHashChange() {
    const currentPath = this.getCurrentPath();

    // 등록되지 않은 경로인 경우 기본 경로('/')로 리다이렉트
    const componentClass = this.routes[currentPath] || this.routes['/'];

    if (!componentClass) {
      console.error(`Router: "${currentPath}" 경로의 컴포넌트를 찾을 수 없습니다.`);
      return;
    }

    // 이전 컴포넌트 정리
    if (this._currentComponent) {
      this._currentComponent.destroy();
    }

    // 새 컴포넌트 인스턴스 생성
    this._currentComponent = new componentClass(this.rootElement);

    // 컴포넌트 생명주기 실행
    this._currentComponent.mount();
    this._currentComponent.afterMount();

    // routeChange 이벤트 발행: App.js 등 외부에서 네비게이션 상태 동기화에 활용
    this.eventBus.emit('routeChange', currentPath);
  }
}
