/**
 * Common Utilities - 정적 HTML 페이지 공통 유틸리티
 * 테마 관리, 사이드바 네비게이션, CodeBlock 초기화, 아이콘 렌더링
 *
 * file:// 프로토콜 호환성: ES6 모듈 없이 일반 스크립트로 작성
 * 모든 pages/*.html에서 공동으로 로드됨
 */

/**
 * 테마 토글 버튼 초기화
 * - 버튼 클릭 시 data-theme 전환 (dark ↔ light)
 * - localStorage에 저장
 * - Lucide 아이콘 색상 업데이트
 */
function initTheme() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;

  btn.addEventListener('click', () => {
    // 현재 테마 읽기
    const current = document.documentElement.getAttribute('data-theme');
    // 반대 테마로 토글
    const next = current === 'dark' ? 'light' : 'dark';

    // 테마 적용
    document.documentElement.setAttribute('data-theme', next);

    // localStorage에 저장
    localStorage.setItem('uig-theme', next);

    // Lucide 아이콘 재렌더링 (색상 변경)
    if (window.lucide) {
      window.lucide.createIcons();
    }
  });
}

/**
 * 사이드바 네비게이션 초기화
 * - 현재 페이지 URL 기준으로 active 링크 설정
 * - active 링크에 aria-current="page" 속성 추가
 */
function initSidebarNav() {
  const currentPath = window.location.pathname;
  const links = document.querySelectorAll('.nav-link');

  links.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    // pages/ 경로 정규화
    // ../pages/button.html → button.html
    // ./button.html → button.html
    const normalizedHref = href.replace('../pages/', '').replace('./', '');

    // 현재 경로가 링크의 href로 끝나는지 확인
    if (currentPath.endsWith(normalizedHref) || currentPath.endsWith('/' + normalizedHref)) {
      // active 클래스 추가
      link.classList.add('active');
      // 접근성: 현재 페이지 표시
      link.setAttribute('aria-current', 'page');
    } else {
      // active 클래스 제거
      link.classList.remove('active');
      // aria-current 제거
      link.removeAttribute('aria-current');
    }
  });
}

/**
 * CodeBlock 컴포넌트 초기화
 * - [data-code-block] 요소를 CodeBlock으로 초기화
 * - CodeBlock.js가 로드되지 않은 경우 스킵
 */
function initCodeBlocks() {
  // CodeBlock 클래스가 없으면 스킵 (code-block.js 미로드 상태)
  if (typeof CodeBlock === 'undefined') return;

  // 페이지 내 모든 CodeBlock 요소 초기화
  CodeBlock.init(document);
}

/**
 * Lucide Icons 초기화
 * - SVG 아이콘을 렌더링
 * - CDN에서 로드된 lucide 라이브러리 사용
 */
function initIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

/**
 * DOMContentLoaded 이벤트 리스너
 * - 페이지 로드 완료 후 위 4개 함수를 순서대로 호출
 */
document.addEventListener('DOMContentLoaded', () => {
  // 1. 테마 토글 버튼 초기화
  initTheme();

  // 2. 사이드바 현재 페이지 활성화
  initSidebarNav();

  // 3. CodeBlock 초기화
  initCodeBlocks();

  // 4. Lucide 아이콘 렌더링
  initIcons();
});
