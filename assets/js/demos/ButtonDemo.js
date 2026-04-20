/**
 * 파일 경로: assets/js/demos/ButtonDemo.js
 *
 * ButtonDemo — Button 컴포넌트 데모 페이지
 * DetailPage를 상속하여 _renderDemos()만 오버라이드
 *
 * 8개 섹션으로 구성:
 *   1. Primary   — 주요 액션 버튼 (sm/md/lg)
 *   2. Secondary — 보조 액션 버튼 (sm/md/lg)
 *   3. Outline   — 테두리 버튼 (sm/md/lg)
 *   4. Ghost     — 배경 없는 버튼 (sm/md/lg)
 *   5. Danger    — 파괴적 액션 버튼 (sm/md/lg)
 *   6. Icon      — 아이콘 전용 + 아이콘+텍스트 조합
 *   7. Loading   — 로딩 스피너 상태 (sm/md/lg + 변형별)
 *   8. Disabled  — 비활성 상태 (sm/md/lg + 변형별)
 *
 * WCAG 2.2 접근성 준수:
 * - 아이콘 버튼 aria-label 필수
 * - 로딩 버튼 aria-busy="true"
 * - 비활성 버튼 disabled 속성
 */

import DetailPage from '../pages/DetailPage.js';
import CodeBlock from '../ui/CodeBlock.js';

export default class ButtonDemo extends DetailPage {
  /**
   * 페이지 메타 정보 제공
   * DetailPage.render()의 헤더 영역에 표시됨
   * @returns {{ title: string, description: string }}
   */
  getComponentInfo() {
    return {
      title: 'Button',
      description:
        '사용자 액션을 트리거하는 기본 인터랙티브 요소입니다. ' +
        '5가지 변형(variant)과 3가지 크기(size), 아이콘·로딩·비활성 상태를 지원합니다.',
    };
  }

  /**
   * Button 데모 섹션 HTML 반환
   * DetailPage.render()의 <main> 영역에 삽입됨
   * @returns {string} 8개 섹션 HTML
   */
  _renderDemos() {
    return `
      <article class="demo-page" aria-labelledby="button-demo-title">

        <!-- 데모 페이지 인트로 제목 (h2: detail-header h1 아래 계층) -->
        <h2 id="button-demo-title" class="demo-page-title" style="display:none;" aria-hidden="true">Button 데모</h2>

        ${this._renderPrimarySection()}
        ${this._renderSecondarySection()}
        ${this._renderOutlineSection()}
        ${this._renderGhostSection()}
        ${this._renderDangerSection()}
        ${this._renderIconSection()}
        ${this._renderLoadingSection()}
        ${this._renderDisabledSection()}

      </article>
    `;
  }

  /**
   * 섹션 1: Primary 버튼
   * 주요 액션(저장, 제출, 확인 등)에 사용하는 파란색 버튼
   * @returns {string}
   * @private
   */
  _renderPrimarySection() {
    return `
      <!-- ============================================
           섹션 1: Primary 버튼
           파란색 배경(--color-primary), 흰 텍스트
           대비비 4.5:1 이상 확보
           ============================================ -->
      <section class="demo-section" aria-labelledby="section-primary">
        <h2 id="section-primary" class="demo-section-title">Primary</h2>
        <p class="demo-description">주요 액션(저장, 제출, 확인 등)에 사용하는 기본 버튼입니다.</p>

        <div class="demo-preview" role="group" aria-label="Primary 버튼 크기 데모">
          <!-- sm: 소형 보조 액션 -->
          <button data-variant="primary" data-size="sm" type="button">
            Small
          </button>

          <!-- md: 기본 크기 (대부분의 UI에서 사용) -->
          <button data-variant="primary" data-size="md" type="button">
            Medium
          </button>

          <!-- lg: 히어로·CTA 영역 대형 버튼 -->
          <button data-variant="primary" data-size="lg" type="button">
            Large
          </button>
        </div>

        <!-- 코드 블록 -->
        <div id="code-block-primary" class="code-block-wrapper"></div>
      </section>
    `;
  }

  /**
   * 섹션 2: Secondary 버튼
   * 보조 액션(취소, 뒤로 등)에 사용하는 회색 버튼
   * @returns {string}
   * @private
   */
  _renderSecondarySection() {
    return `
      <!-- ============================================
           섹션 2: Secondary 버튼
           회색 배경(#6b7280), 흰 텍스트
           다크 모드에서는 #9ca3af로 자동 조정
           ============================================ -->
      <section class="demo-section" aria-labelledby="section-secondary">
        <h2 id="section-secondary" class="demo-section-title">Secondary</h2>
        <p class="demo-description">보조 액션(취소, 뒤로 등)에 사용하는 회색 버튼입니다.</p>

        <div class="demo-preview" role="group" aria-label="Secondary 버튼 크기 데모">
          <button data-variant="secondary" data-size="sm" type="button">
            Small
          </button>

          <button data-variant="secondary" data-size="md" type="button">
            Medium
          </button>

          <button data-variant="secondary" data-size="lg" type="button">
            Large
          </button>
        </div>

        <!-- 코드 블록 -->
        <div id="code-block-secondary" class="code-block-wrapper"></div>
      </section>
    `;
  }

  /**
   * 섹션 3: Outline 버튼
   * 투명 배경 + 테두리만 있는 버튼 (덜 강조된 액션용)
   * @returns {string}
   * @private
   */
  _renderOutlineSection() {
    return `
      <!-- ============================================
           섹션 3: Outline 버튼
           투명 배경 + 테두리만 있는 버튼
           호버 시 primary 색상 테두리·텍스트로 변경
           ============================================ -->
      <section class="demo-section" aria-labelledby="section-outline">
        <h2 id="section-outline" class="demo-section-title">Outline</h2>
        <p class="demo-description">투명 배경에 테두리만 있는 버튼입니다. 덜 강조된 액션에 사용합니다.</p>

        <div class="demo-preview" role="group" aria-label="Outline 버튼 크기 데모">
          <button data-variant="outline" data-size="sm" type="button">
            Small
          </button>

          <button data-variant="outline" data-size="md" type="button">
            Medium
          </button>

          <button data-variant="outline" data-size="lg" type="button">
            Large
          </button>
        </div>

        <!-- 코드 블록 -->
        <div id="code-block-outline" class="code-block-wrapper"></div>
      </section>
    `;
  }

  /**
   * 섹션 4: Ghost 버튼
   * 배경·테두리 없음, 호버 시에만 배경 표시
   * @returns {string}
   * @private
   */
  _renderGhostSection() {
    return `
      <!-- ============================================
           섹션 4: Ghost 버튼
           배경·테두리 없음, 호버 시만 배경 표시
           툴바, 메뉴 아이템 등 최소 시각 강조 상황에 사용
           ============================================ -->
      <section class="demo-section" aria-labelledby="section-ghost">
        <h2 id="section-ghost" class="demo-section-title">Ghost</h2>
        <p class="demo-description">배경과 테두리가 없는 버튼입니다. 호버 시에만 배경이 나타납니다.</p>

        <div class="demo-preview" role="group" aria-label="Ghost 버튼 크기 데모">
          <button data-variant="ghost" data-size="sm" type="button">
            Small
          </button>

          <button data-variant="ghost" data-size="md" type="button">
            Medium
          </button>

          <button data-variant="ghost" data-size="lg" type="button">
            Large
          </button>
        </div>

        <!-- 코드 블록 -->
        <div id="code-block-ghost" class="code-block-wrapper"></div>
      </section>
    `;
  }

  /**
   * 섹션 5: Danger 버튼
   * 삭제·초기화 등 파괴적 액션에 사용하는 빨간색 버튼
   * @returns {string}
   * @private
   */
  _renderDangerSection() {
    return `
      <!-- ============================================
           섹션 5: Danger 버튼
           파괴적 액션(삭제, 초기화 등)에 사용
           빨간색 배경(--color-danger), 흰 텍스트
           ============================================ -->
      <section class="demo-section" aria-labelledby="section-danger">
        <h2 id="section-danger" class="demo-section-title">Danger</h2>
        <p class="demo-description">삭제·초기화 등 파괴적 액션에 사용하는 경고 버튼입니다.</p>

        <div class="demo-preview" role="group" aria-label="Danger 버튼 크기 데모">
          <button data-variant="danger" data-size="sm" type="button">
            Small
          </button>

          <button data-variant="danger" data-size="md" type="button">
            Medium
          </button>

          <button data-variant="danger" data-size="lg" type="button">
            Large
          </button>
        </div>

        <!-- 코드 블록 -->
        <div id="code-block-danger" class="code-block-wrapper"></div>
      </section>
    `;
  }

  /**
   * 섹션 6: Icon 버튼
   * 아이콘 전용 정사각형 버튼 + 아이콘+텍스트 조합
   * @returns {string}
   * @private
   */
  _renderIconSection() {
    return `
      <!-- ============================================
           섹션 6: Icon 버튼
           자식이 <i>만 있을 때 CSS :has()로 정사각형 치수 자동 적용
           접근성: aria-label 필수 (시각 텍스트가 없으므로)
           아이콘 <i>에는 aria-hidden="true" 처리
           ============================================ -->
      <section class="demo-section" aria-labelledby="section-icon">
        <h2 id="section-icon" class="demo-section-title">Icon</h2>
        <p class="demo-description">
          아이콘만 포함하는 정사각형 버튼입니다.
          시각적 텍스트가 없으므로 <code>aria-label</code>로 목적을 명시해야 합니다.
        </p>

        <div class="demo-preview" role="group" aria-label="Icon 버튼 크기 데모">
          <!-- sm 아이콘 버튼: 32×32px -->
          <button
            data-variant="primary"
            data-size="sm"
            type="button"
            aria-label="검색"
          >
            <i data-lucide="search" aria-hidden="true"></i>
          </button>

          <!-- md 아이콘 버튼: 40×40px -->
          <button
            data-variant="primary"
            data-size="md"
            type="button"
            aria-label="검색"
          >
            <i data-lucide="search" aria-hidden="true"></i>
          </button>

          <!-- lg 아이콘 버튼: 48×48px -->
          <button
            data-variant="primary"
            data-size="lg"
            type="button"
            aria-label="검색"
          >
            <i data-lucide="search" aria-hidden="true"></i>
          </button>

          <!-- outline 변형 아이콘 버튼 -->
          <button
            data-variant="outline"
            data-size="md"
            type="button"
            aria-label="설정"
          >
            <i data-lucide="settings" aria-hidden="true"></i>
          </button>

          <!-- ghost 변형 아이콘 버튼 -->
          <button
            data-variant="ghost"
            data-size="md"
            type="button"
            aria-label="더 보기"
          >
            <i data-lucide="more-horizontal" aria-hidden="true"></i>
          </button>

          <!-- danger 변형 아이콘 버튼 -->
          <button
            data-variant="danger"
            data-size="md"
            type="button"
            aria-label="삭제"
          >
            <i data-lucide="trash-2" aria-hidden="true"></i>
          </button>
        </div>

        <!-- 아이콘 + 텍스트 조합: padding은 CSS :not(:has(>i:only-child))로 복원 -->
        <h3 class="demo-subsection-title">아이콘 + 텍스트 조합</h3>
        <div class="demo-preview" role="group" aria-label="아이콘과 텍스트 조합 버튼 데모">
          <!-- 아이콘이 텍스트 앞에 오는 경우 (leading icon) -->
          <button data-variant="primary" data-size="sm" type="button">
            <i data-lucide="plus" aria-hidden="true"></i>
            추가
          </button>

          <button data-variant="primary" data-size="md" type="button">
            <i data-lucide="download" aria-hidden="true"></i>
            다운로드
          </button>

          <button data-variant="danger" data-size="md" type="button">
            <i data-lucide="trash-2" aria-hidden="true"></i>
            삭제
          </button>

          <!-- 아이콘이 텍스트 뒤에 오는 경우 (trailing icon) -->
          <button data-variant="secondary" data-size="md" type="button">
            저장
            <i data-lucide="save" aria-hidden="true"></i>
          </button>

          <button data-variant="outline" data-size="md" type="button">
            공유
            <i data-lucide="share-2" aria-hidden="true"></i>
          </button>
        </div>

        <!-- 코드 블록 -->
        <div id="code-block-icon" class="code-block-wrapper"></div>
      </section>
    `;
  }

  /**
   * 섹션 7: Loading 버튼
   * data-loading="true" + aria-busy="true"로 로딩 상태 표현
   * @returns {string}
   * @private
   */
  _renderLoadingSection() {
    return `
      <!-- ============================================
           섹션 7: Loading 버튼
           data-loading="true": CSS ::after 스피너 활성화
           cursor: wait + pointer-events: none 자동 적용
           aria-busy="true": 스크린리더에 로딩 상태 전달
           ============================================ -->
      <section class="demo-section" aria-labelledby="section-loading">
        <h2 id="section-loading" class="demo-section-title">Loading</h2>
        <p class="demo-description">
          비동기 작업 진행 중임을 나타내는 버튼입니다.
          <code>data-loading="true"</code>를 추가하면 스피너가 표시되고 클릭이 차단됩니다.
        </p>

        <div class="demo-preview" role="group" aria-label="Loading 버튼 크기 데모">
          <!-- sm 로딩 버튼 -->
          <button
            data-variant="primary"
            data-size="sm"
            data-loading="true"
            type="button"
            aria-busy="true"
            aria-label="처리 중"
          >
            Loading...
          </button>

          <!-- md 로딩 버튼 -->
          <button
            data-variant="primary"
            data-size="md"
            data-loading="true"
            type="button"
            aria-busy="true"
            aria-label="처리 중"
          >
            Loading...
          </button>

          <!-- lg 로딩 버튼 -->
          <button
            data-variant="primary"
            data-size="lg"
            data-loading="true"
            type="button"
            aria-busy="true"
            aria-label="처리 중"
          >
            Loading...
          </button>
        </div>

        <!-- 변형별 로딩 상태: 스피너 색상이 variant에 따라 자동 조정됨 -->
        <h3 class="demo-subsection-title">변형별 로딩 상태</h3>
        <div class="demo-preview" role="group" aria-label="변형별 로딩 버튼 데모">
          <button
            data-variant="secondary"
            data-size="md"
            data-loading="true"
            type="button"
            aria-busy="true"
            aria-label="처리 중"
          >
            저장 중...
          </button>

          <button
            data-variant="outline"
            data-size="md"
            data-loading="true"
            type="button"
            aria-busy="true"
            aria-label="처리 중"
          >
            불러오는 중...
          </button>

          <button
            data-variant="ghost"
            data-size="md"
            data-loading="true"
            type="button"
            aria-busy="true"
            aria-label="처리 중"
          >
            처리 중...
          </button>

          <button
            data-variant="danger"
            data-size="md"
            data-loading="true"
            type="button"
            aria-busy="true"
            aria-label="삭제 중"
          >
            삭제 중...
          </button>
        </div>

        <!-- 코드 블록 -->
        <div id="code-block-loading" class="code-block-wrapper"></div>
      </section>
    `;
  }

  /**
   * 섹션 8: Disabled 버튼
   * HTML disabled 속성으로 비활성화 (opacity 0.5 + pointer-events: none)
   * @returns {string}
   * @private
   */
  _renderDisabledSection() {
    return `
      <!-- ============================================
           섹션 8: Disabled 버튼
           HTML disabled 속성: opacity 0.5 + cursor: not-allowed + pointer-events: none
           스크린리더: disabled 버튼은 자동으로 비활성 상태 안내
           ============================================ -->
      <section class="demo-section" aria-labelledby="section-disabled">
        <h2 id="section-disabled" class="demo-section-title">Disabled</h2>
        <p class="demo-description">
          비활성화된 버튼입니다.
          <code>disabled</code> 속성 추가 시 반투명 처리되고 클릭이 차단됩니다.
        </p>

        <div class="demo-preview" role="group" aria-label="Disabled 버튼 크기 데모">
          <!-- sm 비활성 버튼 -->
          <button
            data-variant="primary"
            data-size="sm"
            type="button"
            disabled
          >
            Disabled
          </button>

          <!-- md 비활성 버튼 -->
          <button
            data-variant="primary"
            data-size="md"
            type="button"
            disabled
          >
            Disabled
          </button>

          <!-- lg 비활성 버튼 -->
          <button
            data-variant="primary"
            data-size="lg"
            type="button"
            disabled
          >
            Disabled
          </button>
        </div>

        <!-- 변형별 비활성 상태: 모든 variant에서 동일한 opacity 처리 -->
        <h3 class="demo-subsection-title">변형별 비활성 상태</h3>
        <div class="demo-preview" role="group" aria-label="변형별 비활성 버튼 데모">
          <button data-variant="primary"   data-size="md" type="button" disabled>Primary</button>
          <button data-variant="secondary" data-size="md" type="button" disabled>Secondary</button>
          <button data-variant="outline"   data-size="md" type="button" disabled>Outline</button>
          <button data-variant="ghost"     data-size="md" type="button" disabled>Ghost</button>
          <button data-variant="danger"    data-size="md" type="button" disabled>Danger</button>
        </div>

        <!-- 코드 블록 -->
        <div id="code-block-disabled" class="code-block-wrapper"></div>
      </section>
    `;
  }

  /**
   * 마운트 후 초기화
   * - 부모 afterMount() 먼저 호출 (scrollTo 포함)
   * - Lucide 아이콘 재초기화 (아이콘 버튼 섹션을 위해 필요)
   * - 8개 섹션별 CodeBlock 인스턴스 생성·마운트
   */
  afterMount() {
    // 부모 클래스 초기화: 페이지 스크롤 최상단
    super.afterMount();

    // Lucide 아이콘 재초기화: 동적 렌더링 후 아이콘 SVG 주입
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }

    // CodeBlock 인스턴스 배열 저장 (destroy() 에서 정리용)
    this._codeBlocks = [];

    // 8개 섹션별 코드 블록 생성
    this._initCodeBlock('primary', {
      html: `<button data-variant="primary" data-size="md">버튼</button>`,
      css: `button[data-variant="primary"] {
  background-color: var(--color-primary);
  color: white;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-weight: 500;
}`,
      js: `document.querySelector('button').addEventListener('click', () => {
  console.log('Primary 버튼 클릭');
});`
    });

    this._initCodeBlock('secondary', {
      html: `<button data-variant="secondary" data-size="md">버튼</button>`,
      css: `button[data-variant="secondary"] {
  background-color: var(--color-secondary);
  color: white;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-weight: 500;
}`,
      js: `document.querySelector('button').addEventListener('click', () => {
  console.log('Secondary 버튼 클릭');
});`
    });

    this._initCodeBlock('outline', {
      html: `<button data-variant="outline" data-size="md">버튼</button>`,
      css: `button[data-variant="outline"] {
  background-color: transparent;
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}`,
      js: `document.querySelector('button').addEventListener('click', () => {
  console.log('Outline 버튼 클릭');
});`
    });

    this._initCodeBlock('ghost', {
      html: `<button data-variant="ghost" data-size="md">버튼</button>`,
      css: `button[data-variant="ghost"] {
  background-color: transparent;
  color: var(--color-text);
  border: none;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

button[data-variant="ghost"]:hover {
  background-color: var(--color-bg-secondary);
}`,
      js: `document.querySelector('button').addEventListener('click', () => {
  console.log('Ghost 버튼 클릭');
});`
    });

    this._initCodeBlock('danger', {
      html: `<button data-variant="danger" data-size="md">삭제</button>`,
      css: `button[data-variant="danger"] {
  background-color: var(--color-danger);
  color: white;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-weight: 500;
}`,
      js: `document.querySelector('button').addEventListener('click', () => {
  if (confirm('정말 삭제하시겠습니까?')) {
    console.log('항목 삭제됨');
  }
});`
    });

    this._initCodeBlock('icon', {
      html: `<button data-variant="primary" aria-label="검색">
  <i data-lucide="search" aria-hidden="true"></i>
</button>`,
      css: `button:has(> i:only-child) {
  width: 40px;
  height: 40px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}`,
      js: `document.querySelector('button').addEventListener('click', () => {
  console.log('검색 버튼 클릭');
});`
    });

    this._initCodeBlock('loading', {
      html: `<button data-variant="primary" data-loading="true"
        aria-busy="true" aria-label="처리 중">
  Loading...
</button>`,
      css: `button[data-loading="true"]::after {
  content: '';
  display: inline-block;
  width: 12px;
  height: 12px;
  margin-left: 6px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}`,
      js: `async function handleClick() {
  const btn = document.querySelector('button');
  btn.setAttribute('data-loading', 'true');
  btn.setAttribute('aria-busy', 'true');

  await new Promise(r => setTimeout(r, 2000));

  btn.removeAttribute('data-loading');
  btn.setAttribute('aria-busy', 'false');
}`
    });

    this._initCodeBlock('disabled', {
      html: `<button data-variant="primary" disabled>
  비활성 버튼
</button>`,
      css: `button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}`,
      js: `// disabled 버튼은 클릭 이벤트 발생 안 함
const btn = document.querySelector('button[disabled]');
btn.addEventListener('click', () => {
  console.log('이 메시지는 나타나지 않음');
});`
    });
  }

  /**
   * 리소스 정리
   * - CodeBlock 인스턴스들 destroy()
   * - 부모 destroy()가 _eventListeners 일괄 제거
   */
  destroy() {
    // CodeBlock 인스턴스 정리
    if (this._codeBlocks && Array.isArray(this._codeBlocks)) {
      this._codeBlocks.forEach(cb => {
        if (cb && typeof cb.destroy === 'function') {
          cb.destroy();
        }
      });
      this._codeBlocks = null;
    }

    super.destroy();
  }

  /**
   * CodeBlock 인스턴스 생성·마운트 헬퍼
   * @param {string} sectionId - 섹션 ID (primary, secondary 등)
   * @param {Object} codes - { html, css, js } 코드 객체
   * @private
   */
  _initCodeBlock(sectionId, codes) {
    const containerId = `code-block-${sectionId}`;
    const container = this.element.querySelector(`#${containerId}`);
    if (!container) return;

    try {
      const codeBlock = new CodeBlock(container, codes);
      codeBlock.mount();
      codeBlock.afterMount();
      this._codeBlocks.push(codeBlock);
    } catch (error) {
      console.error(`CodeBlock 초기화 실패: ${sectionId}`, error);
    }
  }
}
