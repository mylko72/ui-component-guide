/**
 * 파일 경로: assets/js/demos/ButtonDemo.js
 *
 * ButtonDemo — Button 컴포넌트 데모 페이지
 * 8개 섹션 × 3개 크기 = 24개 버튼 데모
 * WCAG 2.2 접근성 준수 마크업 포함
 *
 * Router는 App.js에서 주입 (Router.js → App.js → ButtonDemo 순으로 로드)
 * import Router from '../core/Router.js'; ← 직접 import 불필요
 */
import Component from '../core/Component.js';

export default class ButtonDemo extends Component {
  render() {
    return `
      <!-- ============================================
           Button 컴포넌트 데모 페이지
           8개 변형 섹션: Primary / Secondary / Outline /
           Ghost / Danger / Icon / Loading / Disabled
           각 섹션: sm / md / lg 크기 데모
           ============================================ -->
      <article class="demo-page" aria-labelledby="button-demo-title">

        <!-- 페이지 헤더 -->
        <header class="demo-page-header">
          <h1 id="button-demo-title" class="demo-page-title">Button</h1>
          <p class="demo-page-description">
            사용자 액션을 트리거하는 기본 인터랙티브 요소입니다.
            5가지 변형(variant)과 3가지 크기(size), 아이콘·로딩·비활성 상태를 지원합니다.
          </p>
        </header>

        <!-- ============================================
             섹션 1: Primary 버튼
             주요 액션에 사용. 파란색 배경(#3b82f6), 흰 텍스트
             대비비: 4.5:1 이상 확보
             ============================================ -->
        <section class="demo-section" aria-labelledby="section-primary">
          <h2 id="section-primary" class="demo-section-title">Primary</h2>
          <p class="demo-description">주요 액션(저장, 제출, 확인 등)에 사용하는 기본 버튼입니다.</p>

          <div class="demo-preview" role="group" aria-label="Primary 버튼 크기 데모">
            <!-- sm: 소형 보조 액션 -->
            <button data-variant="primary" data-size="sm" type="button">
              Small
            </button>

            <!-- md: 기본 크기 (대부분의 UI) -->
            <button data-variant="primary" data-size="md" type="button">
              Medium
            </button>

            <!-- lg: 히어로·CTA 영역 대형 버튼 -->
            <button data-variant="primary" data-size="lg" type="button">
              Large
            </button>
          </div>
        </section>

        <!-- ============================================
             섹션 2: Secondary 버튼
             보조 액션에 사용. 회색 배경(#6b7280), 흰 텍스트
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
        </section>

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
        </section>

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
        </section>

        <!-- ============================================
             섹션 5: Danger 버튼
             파괴적 액션(삭제, 초기화 등)에 사용
             빨간색 배경(#ef4444), 흰 텍스트
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
        </section>

        <!-- ============================================
             섹션 6: Icon 버튼
             자식이 <i>만 있을 때 정사각형 치수 자동 적용
             접근성: aria-label 필수 (스크린리더 텍스트 제공)
             아이콘 <i>에 aria-hidden="true" 처리
             ============================================ -->
        <section class="demo-section" aria-labelledby="section-icon">
          <h2 id="section-icon" class="demo-section-title">Icon</h2>
          <p class="demo-description">
            아이콘만 포함하는 정사각형 버튼입니다.
            시각적 텍스트가 없으므로 <code>aria-label</code>로 목적을 명시해야 합니다.
          </p>

          <div class="demo-preview" role="group" aria-label="Icon 버튼 크기 데모">
            <!-- sm 아이콘 버튼: aria-label로 기능 명시 -->
            <button
              data-variant="primary"
              data-size="sm"
              type="button"
              aria-label="검색"
            >
              <!-- aria-hidden: 아이콘은 장식용이므로 스크린리더 무시 -->
              <i data-lucide="search" aria-hidden="true"></i>
            </button>

            <!-- md 아이콘 버튼 -->
            <button
              data-variant="primary"
              data-size="md"
              type="button"
              aria-label="검색"
            >
              <i data-lucide="search" aria-hidden="true"></i>
            </button>

            <!-- lg 아이콘 버튼 -->
            <button
              data-variant="primary"
              data-size="lg"
              type="button"
              aria-label="검색"
            >
              <i data-lucide="search" aria-hidden="true"></i>
            </button>

            <!-- outline 변형 아이콘 버튼 예시 -->
            <button
              data-variant="outline"
              data-size="md"
              type="button"
              aria-label="설정"
            >
              <i data-lucide="settings" aria-hidden="true"></i>
            </button>

            <!-- ghost 변형 아이콘 버튼 예시 -->
            <button
              data-variant="ghost"
              data-size="md"
              type="button"
              aria-label="더 보기"
            >
              <i data-lucide="more-horizontal" aria-hidden="true"></i>
            </button>

            <!-- danger 변형 아이콘 버튼 예시 -->
            <button
              data-variant="danger"
              data-size="md"
              type="button"
              aria-label="삭제"
            >
              <i data-lucide="trash-2" aria-hidden="true"></i>
            </button>
          </div>

          <!-- 아이콘+텍스트 조합 예시 -->
          <h3 class="demo-subsection-title">아이콘 + 텍스트 조합</h3>
          <div class="demo-preview" role="group" aria-label="아이콘과 텍스트 조합 버튼 데모">
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

            <button data-variant="secondary" data-size="md" type="button">
              저장
              <i data-lucide="save" aria-hidden="true"></i>
            </button>
          </div>
        </section>

        <!-- ============================================
             섹션 7: Loading 버튼
             data-loading="true": ::after 스피너 활성화
             cursor: wait + pointer-events: none 자동 적용
             aria-busy="true"로 스크린리더에 로딩 상태 전달
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

          <!-- 다양한 변형의 로딩 상태 예시 -->
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
        </section>

        <!-- ============================================
             섹션 8: Disabled 버튼
             HTML disabled 속성으로 비활성화
             opacity 0.5 + cursor not-allowed + pointer-events none
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

          <!-- 다양한 변형의 비활성 상태 예시 -->
          <h3 class="demo-subsection-title">변형별 비활성 상태</h3>
          <div class="demo-preview" role="group" aria-label="변형별 비활성 버튼 데모">
            <button data-variant="primary"   data-size="md" type="button" disabled>Primary</button>
            <button data-variant="secondary" data-size="md" type="button" disabled>Secondary</button>
            <button data-variant="outline"   data-size="md" type="button" disabled>Outline</button>
            <button data-variant="ghost"     data-size="md" type="button" disabled>Ghost</button>
            <button data-variant="danger"    data-size="md" type="button" disabled>Danger</button>
          </div>
        </section>

      </article>
    `;
  }

  afterMount() {
    /* lucide 아이콘 초기화
       lucide.createIcons()는 App.js 전역에서 호출되므로
       페이지 마운트 후 동적 렌더링된 아이콘 재처리 필요 */
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }

  destroy() {
    // 정리: 정적 데모라 별도 정리 없음
    // _query()는 Component 부모 클래스에서 이미 정의됨 — 재정의 불필요
  }
}
