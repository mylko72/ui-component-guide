/**
 * App.js - 메인 애플리케이션 진입점
 * Router, ThemeManager 초기화 및 모든 라우트 등록
 */

// Core 모듈
import Router from './core/Router.js';
import themeManager from './core/ThemeManager.js';

// Pages
import DashboardPage from './pages/DashboardPage.js';

// Demo Components - 폼 요소 (7개)
import ButtonDemo from './demos/ButtonDemo.js';
import InputDemo from './demos/InputDemo.js';
import CheckboxDemo from './demos/CheckboxDemo.js';
import RadioDemo from './demos/RadioDemo.js';
import SwitchDemo from './demos/SwitchDemo.js';
import SelectDemo from './demos/SelectDemo.js';
import TextareaDemo from './demos/TextareaDemo.js';

// Demo Components - 레이아웃 (5개)
import CardDemo from './demos/CardDemo.js';
import AccordionDemo from './demos/AccordionDemo.js';
import TabsDemo from './demos/TabsDemo.js';
import ModalDemo from './demos/ModalDemo.js';
import DropdownDemo from './demos/DropdownDemo.js';

// Demo Components - 피드백 (6개)
import ToastDemo from './demos/ToastDemo.js';
import AlertDemo from './demos/AlertDemo.js';
import BadgeDemo from './demos/BadgeDemo.js';
import TooltipDemo from './demos/TooltipDemo.js';
import ProgressDemo from './demos/ProgressDemo.js';
import SkeletonDemo from './demos/SkeletonDemo.js';

/**
 * 애플리케이션 초기화
 */
async function initApp() {
  try {
    // 1. 테마 매니저 초기화
    await themeManager.init();

    // 2. 라우터 생성 및 라우트 등록
    const router = new Router('#app-content');

    // 대시보드 (메인 화면)
    router.register('/', DashboardPage);

    // 폼 요소 (7개)
    router.register('/button', ButtonDemo);
    router.register('/input', InputDemo);
    router.register('/checkbox', CheckboxDemo);
    router.register('/radio', RadioDemo);
    router.register('/switch', SwitchDemo);
    router.register('/select', SelectDemo);
    router.register('/textarea', TextareaDemo);

    // 레이아웃 (5개)
    router.register('/card', CardDemo);
    router.register('/accordion', AccordionDemo);
    router.register('/tabs', TabsDemo);
    router.register('/modal', ModalDemo);
    router.register('/dropdown', DropdownDemo);

    // 피드백 (6개)
    router.register('/toast', ToastDemo);
    router.register('/alert', AlertDemo);
    router.register('/badge', BadgeDemo);
    router.register('/tooltip', TooltipDemo);
    router.register('/progress', ProgressDemo);
    router.register('/skeleton', SkeletonDemo);

    // 3. 테마 토글 버튼 이벤트 등록
    setupThemeToggle();

    // 4. Lucide 아이콘 초기화 (테마 변경 후)
    if (window.lucide) {
      window.lucide.createIcons();
    }

    console.log('✅ 애플리케이션 초기화 완료');
  } catch (error) {
    console.error('❌ 애플리케이션 초기화 중 오류 발생:', error);
  }
}

/**
 * 테마 토글 버튼 설정
 */
function setupThemeToggle() {
  const themeToggleButton = document.getElementById('theme-toggle');
  if (!themeToggleButton) {
    console.warn('App: 테마 토글 버튼을 찾을 수 없습니다.');
    return;
  }

  // 버튼 클릭 이벤트
  themeToggleButton.addEventListener('click', () => {
    themeManager.toggle();

    // aria-label 업데이트
    const currentTheme = themeManager.getCurrent();
    const label = currentTheme === 'light' ? 'Dark Mode' : 'Light Mode';
    themeToggleButton.setAttribute('aria-label', label);

    // Lucide 아이콘 재초기화
    if (window.lucide) {
      window.lucide.createIcons();
    }
  });

  // 초기 aria-label 설정
  const initialTheme = themeManager.getCurrent();
  const initialLabel = initialTheme === 'light' ? 'Dark Mode' : 'Light Mode';
  themeToggleButton.setAttribute('aria-label', initialLabel);
}

// 애플리케이션 시작
document.addEventListener('DOMContentLoaded', initApp);
