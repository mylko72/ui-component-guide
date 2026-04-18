/**
 * DashboardPage - 메인 대시보드 페이지
 * 24개 컴포넌트 카드 그리드 (18개 구현 + 6개 Coming Soon)
 */

import Component from '../core/Component.js';

export default class DashboardPage extends Component {
  render() {
    return `
      <!-- 대시보드 루트 컨테이너 -->
      <div class="dashboard-page">

        <!-- =============================================
             Hero 섹션: 프로젝트 소개
             ============================================= -->
        <section class="hero" aria-labelledby="hero-title">
          <h1 id="hero-title">Web UI Component Guide</h1>
          <p class="hero-subtitle">
            순수 HTML/CSS/ES6 기반 한국형 웹접근성(KWCAG 2.2) 준수 UI 컴포넌트 라이브러리<br>
            <strong>18개 구현 완료</strong> · <strong>6개 Coming Soon</strong>
          </p>
        </section>

        <!-- =============================================
             폼 요소 카테고리 섹션 (7개 카드)
             ============================================= -->
        <section class="components-section" aria-labelledby="section-form">
          <h2 id="section-form" class="category-title">폼 요소</h2>

          <!-- 카드 그리드: auto-fill 반응형 -->
          <div class="components-grid card-grid" role="list">

            <!-- Button 카드 -->
            <article
              role="article"
              class="component-card"
              tabindex="0"
              data-route="/button"
              aria-label="Button 컴포넌트로 이동"
            >
              <!-- 카드 헤더: 아이콘 + 구현 상태 배지 -->
              <div class="card-header">
                <div class="card-icon" aria-hidden="true">
                  <i data-lucide="square" aria-hidden="true"></i>
                </div>
                <!-- 구현 완료 배지 -->
                <span class="card-badge badge badge-success" role="status" aria-label="구현 완료">Implemented</span>
              </div>

              <!-- 카드 본문: 타이틀 + 설명 -->
              <div class="card-body">
                <h3 class="card-title">Button</h3>
                <p class="card-description">다양한 변형과 크기의 버튼 컴포넌트. 아이콘, 로딩 상태 지원</p>
              </div>

              <!-- 카드 푸터: 별점 -->
              <div class="card-footer">
                <div class="card-rating" aria-label="평점 5점 만점에 5점">
                  <span class="card-stars" aria-hidden="true">★★★★★</span>
                  <span class="card-rating-text">5.0</span>
                </div>
              </div>
            </article>

            <!-- Input 카드 -->
            <article
              role="article"
              class="component-card"
              tabindex="0"
              data-route="/input"
              aria-label="Input 컴포넌트로 이동"
            >
              <div class="card-header">
                <div class="card-icon" aria-hidden="true">
                  <i data-lucide="type" aria-hidden="true"></i>
                </div>
                <span class="card-badge badge badge-success" role="status" aria-label="구현 완료">Implemented</span>
              </div>
              <div class="card-body">
                <h3 class="card-title">Input</h3>
                <p class="card-description">텍스트 입력 필드. 유효성 검사, 아이콘, 에러 상태 지원</p>
              </div>
              <div class="card-footer">
                <div class="card-rating" aria-label="평점 5점 만점에 5점">
                  <span class="card-stars" aria-hidden="true">★★★★★</span>
                  <span class="card-rating-text">5.0</span>
                </div>
              </div>
            </article>

            <!-- Checkbox 카드 -->
            <article
              role="article"
              class="component-card"
              tabindex="0"
              data-route="/checkbox"
              aria-label="Checkbox 컴포넌트로 이동"
            >
              <div class="card-header">
                <div class="card-icon" aria-hidden="true">
                  <i data-lucide="square-check" aria-hidden="true"></i>
                </div>
                <span class="card-badge badge badge-success" role="status" aria-label="구현 완료">Implemented</span>
              </div>
              <div class="card-body">
                <h3 class="card-title">Checkbox</h3>
                <p class="card-description">단일/그룹 체크박스. 중간 상태(indeterminate) 지원</p>
              </div>
              <div class="card-footer">
                <div class="card-rating" aria-label="평점 5점 만점에 4점">
                  <span class="card-stars" aria-hidden="true">★★★★☆</span>
                  <span class="card-rating-text">4.0</span>
                </div>
              </div>
            </article>

            <!-- Radio 카드 -->
            <article
              role="article"
              class="component-card"
              tabindex="0"
              data-route="/radio"
              aria-label="Radio 컴포넌트로 이동"
            >
              <div class="card-header">
                <div class="card-icon" aria-hidden="true">
                  <i data-lucide="circle-dot" aria-hidden="true"></i>
                </div>
                <span class="card-badge badge badge-success" role="status" aria-label="구현 완료">Implemented</span>
              </div>
              <div class="card-body">
                <h3 class="card-title">Radio</h3>
                <p class="card-description">라디오 버튼 그룹. 단일 선택, 키보드 화살표 탐색 지원</p>
              </div>
              <div class="card-footer">
                <div class="card-rating" aria-label="평점 5점 만점에 4점">
                  <span class="card-stars" aria-hidden="true">★★★★☆</span>
                  <span class="card-rating-text">4.0</span>
                </div>
              </div>
            </article>

            <!-- Switch 카드 -->
            <article
              role="article"
              class="component-card"
              tabindex="0"
              data-route="/switch"
              aria-label="Switch 컴포넌트로 이동"
            >
              <div class="card-header">
                <div class="card-icon" aria-hidden="true">
                  <i data-lucide="toggle-left" aria-hidden="true"></i>
                </div>
                <span class="card-badge badge badge-success" role="status" aria-label="구현 완료">Implemented</span>
              </div>
              <div class="card-body">
                <h3 class="card-title">Switch</h3>
                <p class="card-description">토글 스위치. ON/OFF 상태 전환, aria-checked 접근성 지원</p>
              </div>
              <div class="card-footer">
                <div class="card-rating" aria-label="평점 5점 만점에 4점">
                  <span class="card-stars" aria-hidden="true">★★★★☆</span>
                  <span class="card-rating-text">4.0</span>
                </div>
              </div>
            </article>

            <!-- Select 카드 -->
            <article
              role="article"
              class="component-card"
              tabindex="0"
              data-route="/select"
              aria-label="Select 컴포넌트로 이동"
            >
              <div class="card-header">
                <div class="card-icon" aria-hidden="true">
                  <i data-lucide="list" aria-hidden="true"></i>
                </div>
                <span class="card-badge badge badge-success" role="status" aria-label="구현 완료">Implemented</span>
              </div>
              <div class="card-body">
                <h3 class="card-title">Select</h3>
                <p class="card-description">드롭다운 선택 필드. 그룹화, 비활성화 옵션 지원</p>
              </div>
              <div class="card-footer">
                <div class="card-rating" aria-label="평점 5점 만점에 4점">
                  <span class="card-stars" aria-hidden="true">★★★★☆</span>
                  <span class="card-rating-text">4.0</span>
                </div>
              </div>
            </article>

            <!-- Textarea 카드 -->
            <article
              role="article"
              class="component-card"
              tabindex="0"
              data-route="/textarea"
              aria-label="Textarea 컴포넌트로 이동"
            >
              <div class="card-header">
                <div class="card-icon" aria-hidden="true">
                  <i data-lucide="align-left" aria-hidden="true"></i>
                </div>
                <span class="card-badge badge badge-success" role="status" aria-label="구현 완료">Implemented</span>
              </div>
              <div class="card-body">
                <h3 class="card-title">Textarea</h3>
                <p class="card-description">다중 줄 텍스트 입력. 자동 높이 조절, 글자 수 카운터 지원</p>
              </div>
              <div class="card-footer">
                <div class="card-rating" aria-label="평점 5점 만점에 3점">
                  <span class="card-stars" aria-hidden="true">★★★☆☆</span>
                  <span class="card-rating-text">3.0</span>
                </div>
              </div>
            </article>

          </div><!-- /.components-grid (폼 요소) -->
        </section>

        <!-- =============================================
             레이아웃 카테고리 섹션 (5개 카드)
             ============================================= -->
        <section class="components-section" aria-labelledby="section-layout">
          <h2 id="section-layout" class="category-title">레이아웃</h2>

          <div class="components-grid card-grid" role="list">

            <!-- Card 카드 -->
            <article
              role="article"
              class="component-card"
              tabindex="0"
              data-route="/card"
              aria-label="Card 컴포넌트로 이동"
            >
              <div class="card-header">
                <div class="card-icon" aria-hidden="true">
                  <i data-lucide="layout-grid" aria-hidden="true"></i>
                </div>
                <span class="card-badge badge badge-success" role="status" aria-label="구현 완료">Implemented</span>
              </div>
              <div class="card-body">
                <h3 class="card-title">Card</h3>
                <p class="card-description">콘텐츠 카드 컨테이너. 헤더, 푸터, 이미지 슬롯 지원</p>
              </div>
              <div class="card-footer">
                <div class="card-rating" aria-label="평점 5점 만점에 5점">
                  <span class="card-stars" aria-hidden="true">★★★★★</span>
                  <span class="card-rating-text">5.0</span>
                </div>
              </div>
            </article>

            <!-- Accordion 카드 -->
            <article
              role="article"
              class="component-card"
              tabindex="0"
              data-route="/accordion"
              aria-label="Accordion 컴포넌트로 이동"
            >
              <div class="card-header">
                <div class="card-icon" aria-hidden="true">
                  <i data-lucide="chevrons-down" aria-hidden="true"></i>
                </div>
                <span class="card-badge badge badge-success" role="status" aria-label="구현 완료">Implemented</span>
              </div>
              <div class="card-body">
                <h3 class="card-title">Accordion</h3>
                <p class="card-description">접기/펼치기 패널. 단일/다중 열림, aria-expanded 지원</p>
              </div>
              <div class="card-footer">
                <div class="card-rating" aria-label="평점 5점 만점에 4점">
                  <span class="card-stars" aria-hidden="true">★★★★☆</span>
                  <span class="card-rating-text">4.0</span>
                </div>
              </div>
            </article>

            <!-- Tabs 카드 -->
            <article
              role="article"
              class="component-card"
              tabindex="0"
              data-route="/tabs"
              aria-label="Tabs 컴포넌트로 이동"
            >
              <div class="card-header">
                <div class="card-icon" aria-hidden="true">
                  <i data-lucide="layout-panel-top" aria-hidden="true"></i>
                </div>
                <span class="card-badge badge badge-success" role="status" aria-label="구현 완료">Implemented</span>
              </div>
              <div class="card-body">
                <h3 class="card-title">Tabs</h3>
                <p class="card-description">탭 패널 전환. role="tablist" WAI-ARIA 패턴 준수</p>
              </div>
              <div class="card-footer">
                <div class="card-rating" aria-label="평점 5점 만점에 5점">
                  <span class="card-stars" aria-hidden="true">★★★★★</span>
                  <span class="card-rating-text">5.0</span>
                </div>
              </div>
            </article>

            <!-- Modal 카드 -->
            <article
              role="article"
              class="component-card"
              tabindex="0"
              data-route="/modal"
              aria-label="Modal 컴포넌트로 이동"
            >
              <div class="card-header">
                <div class="card-icon" aria-hidden="true">
                  <i data-lucide="square-dashed" aria-hidden="true"></i>
                </div>
                <span class="card-badge badge badge-success" role="status" aria-label="구현 완료">Implemented</span>
              </div>
              <div class="card-body">
                <h3 class="card-title">Modal</h3>
                <p class="card-description">다이얼로그 모달. 포커스 트랩, ESC 닫기, 다크 모드 지원</p>
              </div>
              <div class="card-footer">
                <div class="card-rating" aria-label="평점 5점 만점에 5점">
                  <span class="card-stars" aria-hidden="true">★★★★★</span>
                  <span class="card-rating-text">5.0</span>
                </div>
              </div>
            </article>

            <!-- Dropdown 카드 -->
            <article
              role="article"
              class="component-card"
              tabindex="0"
              data-route="/dropdown"
              aria-label="Dropdown 컴포넌트로 이동"
            >
              <div class="card-header">
                <div class="card-icon" aria-hidden="true">
                  <i data-lucide="menu" aria-hidden="true"></i>
                </div>
                <span class="card-badge badge badge-success" role="status" aria-label="구현 완료">Implemented</span>
              </div>
              <div class="card-body">
                <h3 class="card-title">Dropdown</h3>
                <p class="card-description">컨텍스트 메뉴 드롭다운. 위치 자동 조정, 키보드 탐색</p>
              </div>
              <div class="card-footer">
                <div class="card-rating" aria-label="평점 5점 만점에 4점">
                  <span class="card-stars" aria-hidden="true">★★★★☆</span>
                  <span class="card-rating-text">4.0</span>
                </div>
              </div>
            </article>

          </div><!-- /.components-grid (레이아웃) -->
        </section>

        <!-- =============================================
             피드백 카테고리 섹션 (6개 카드)
             ============================================= -->
        <section class="components-section" aria-labelledby="section-feedback">
          <h2 id="section-feedback" class="category-title">피드백</h2>

          <div class="components-grid card-grid" role="list">

            <!-- Toast 카드 -->
            <article
              role="article"
              class="component-card"
              tabindex="0"
              data-route="/toast"
              aria-label="Toast 컴포넌트로 이동"
            >
              <div class="card-header">
                <div class="card-icon" aria-hidden="true">
                  <i data-lucide="bell" aria-hidden="true"></i>
                </div>
                <span class="card-badge badge badge-success" role="status" aria-label="구현 완료">Implemented</span>
              </div>
              <div class="card-body">
                <h3 class="card-title">Toast</h3>
                <p class="card-description">일시적 알림 메시지. 자동 소멸, 스택 관리, 4가지 타입</p>
              </div>
              <div class="card-footer">
                <div class="card-rating" aria-label="평점 5점 만점에 4점">
                  <span class="card-stars" aria-hidden="true">★★★★☆</span>
                  <span class="card-rating-text">4.0</span>
                </div>
              </div>
            </article>

            <!-- Alert 카드 -->
            <article
              role="article"
              class="component-card"
              tabindex="0"
              data-route="/alert"
              aria-label="Alert 컴포넌트로 이동"
            >
              <div class="card-header">
                <div class="card-icon" aria-hidden="true">
                  <i data-lucide="alert-circle" aria-hidden="true"></i>
                </div>
                <span class="card-badge badge badge-success" role="status" aria-label="구현 완료">Implemented</span>
              </div>
              <div class="card-body">
                <h3 class="card-title">Alert</h3>
                <p class="card-description">인라인 경고/정보 메시지. role="alert" 라이브 리전 지원</p>
              </div>
              <div class="card-footer">
                <div class="card-rating" aria-label="평점 5점 만점에 5점">
                  <span class="card-stars" aria-hidden="true">★★★★★</span>
                  <span class="card-rating-text">5.0</span>
                </div>
              </div>
            </article>

            <!-- Badge 카드 -->
            <article
              role="article"
              class="component-card"
              tabindex="0"
              data-route="/badge"
              aria-label="Badge 컴포넌트로 이동"
            >
              <div class="card-header">
                <div class="card-icon" aria-hidden="true">
                  <i data-lucide="tag" aria-hidden="true"></i>
                </div>
                <span class="card-badge badge badge-success" role="status" aria-label="구현 완료">Implemented</span>
              </div>
              <div class="card-body">
                <h3 class="card-title">Badge</h3>
                <p class="card-description">상태 표시 뱃지. 색상 변형, 아이콘, 숫자 카운트 지원</p>
              </div>
              <div class="card-footer">
                <div class="card-rating" aria-label="평점 5점 만점에 3점">
                  <span class="card-stars" aria-hidden="true">★★★☆☆</span>
                  <span class="card-rating-text">3.0</span>
                </div>
              </div>
            </article>

            <!-- Tooltip 카드 -->
            <article
              role="article"
              class="component-card"
              tabindex="0"
              data-route="/tooltip"
              aria-label="Tooltip 컴포넌트로 이동"
            >
              <div class="card-header">
                <div class="card-icon" aria-hidden="true">
                  <i data-lucide="help-circle" aria-hidden="true"></i>
                </div>
                <span class="card-badge badge badge-success" role="status" aria-label="구현 완료">Implemented</span>
              </div>
              <div class="card-body">
                <h3 class="card-title">Tooltip</h3>
                <p class="card-description">호버/포커스 툴팁. 4방향 위치, aria-describedby 연결</p>
              </div>
              <div class="card-footer">
                <div class="card-rating" aria-label="평점 5점 만점에 3점">
                  <span class="card-stars" aria-hidden="true">★★★☆☆</span>
                  <span class="card-rating-text">3.0</span>
                </div>
              </div>
            </article>

            <!-- Progress 카드 -->
            <article
              role="article"
              class="component-card"
              tabindex="0"
              data-route="/progress"
              aria-label="Progress 컴포넌트로 이동"
            >
              <div class="card-header">
                <div class="card-icon" aria-hidden="true">
                  <i data-lucide="activity" aria-hidden="true"></i>
                </div>
                <span class="card-badge badge badge-success" role="status" aria-label="구현 완료">Implemented</span>
              </div>
              <div class="card-body">
                <h3 class="card-title">Progress</h3>
                <p class="card-description">진행률 표시바. role="progressbar", 애니메이션 지원</p>
              </div>
              <div class="card-footer">
                <div class="card-rating" aria-label="평점 5점 만점에 4점">
                  <span class="card-stars" aria-hidden="true">★★★★☆</span>
                  <span class="card-rating-text">4.0</span>
                </div>
              </div>
            </article>

            <!-- Skeleton 카드 -->
            <article
              role="article"
              class="component-card"
              tabindex="0"
              data-route="/skeleton"
              aria-label="Skeleton 컴포넌트로 이동"
            >
              <div class="card-header">
                <div class="card-icon" aria-hidden="true">
                  <i data-lucide="loader" aria-hidden="true"></i>
                </div>
                <span class="card-badge badge badge-success" role="status" aria-label="구현 완료">Implemented</span>
              </div>
              <div class="card-body">
                <h3 class="card-title">Skeleton</h3>
                <p class="card-description">콘텐츠 로딩 플레이스홀더. 펄스 애니메이션, aria-busy 지원</p>
              </div>
              <div class="card-footer">
                <div class="card-rating" aria-label="평점 5점 만점에 3점">
                  <span class="card-stars" aria-hidden="true">★★★☆☆</span>
                  <span class="card-rating-text">3.0</span>
                </div>
              </div>
            </article>

          </div><!-- /.components-grid (피드백) -->
        </section>

        <!-- =============================================
             Coming Soon 카테고리 섹션 (6개 카드)
             탐색 3개 + 데이터 3개
             ============================================= -->
        <section class="components-section" aria-labelledby="section-coming-soon">
          <h2 id="section-coming-soon" class="category-title">Coming Soon</h2>

          <div class="components-grid card-grid" role="list">

            <!-- Breadcrumb - Coming Soon (탐색) -->
            <article
              role="article"
              class="component-card component-card--coming-soon"
              aria-disabled="true"
              aria-label="Breadcrumb 컴포넌트 - 준비 중"
              tabindex="-1"
            >
              <div class="card-header">
                <!-- 탐색 아이콘: home (breadcrumb 경로 탐색 상징) -->
                <div class="card-icon" aria-hidden="true">
                  <i data-lucide="home" aria-hidden="true"></i>
                </div>
                <!-- Coming Soon 상태 배지 -->
                <span class="card-badge badge badge-gray" role="status" aria-label="준비 중">Coming Soon</span>
              </div>
              <div class="card-body">
                <h3 class="card-title">Breadcrumb</h3>
                <!-- 카테고리 정보 표시 -->
                <p class="card-description">탐색 · 현재 위치 경로 표시 컴포넌트</p>
              </div>
            </article>

            <!-- Pagination - Coming Soon (탐색) -->
            <article
              role="article"
              class="component-card component-card--coming-soon"
              aria-disabled="true"
              aria-label="Pagination 컴포넌트 - 준비 중"
              tabindex="-1"
            >
              <div class="card-header">
                <div class="card-icon" aria-hidden="true">
                  <i data-lucide="chevrons-right" aria-hidden="true"></i>
                </div>
                <span class="card-badge badge badge-gray" role="status" aria-label="준비 중">Coming Soon</span>
              </div>
              <div class="card-body">
                <h3 class="card-title">Pagination</h3>
                <p class="card-description">탐색 · 페이지 번호 탐색 컴포넌트</p>
              </div>
            </article>

            <!-- Stepper - Coming Soon (탐색) -->
            <article
              role="article"
              class="component-card component-card--coming-soon"
              aria-disabled="true"
              aria-label="Stepper 컴포넌트 - 준비 중"
              tabindex="-1"
            >
              <div class="card-header">
                <div class="card-icon" aria-hidden="true">
                  <i data-lucide="milestone" aria-hidden="true"></i>
                </div>
                <span class="card-badge badge badge-gray" role="status" aria-label="준비 중">Coming Soon</span>
              </div>
              <div class="card-body">
                <h3 class="card-title">Stepper</h3>
                <p class="card-description">탐색 · 단계별 진행 표시 컴포넌트</p>
              </div>
            </article>

            <!-- DataTable - Coming Soon (데이터) -->
            <article
              role="article"
              class="component-card component-card--coming-soon"
              aria-disabled="true"
              aria-label="DataTable 컴포넌트 - 준비 중"
              tabindex="-1"
            >
              <div class="card-header">
                <div class="card-icon" aria-hidden="true">
                  <i data-lucide="table" aria-hidden="true"></i>
                </div>
                <span class="card-badge badge badge-gray" role="status" aria-label="준비 중">Coming Soon</span>
              </div>
              <div class="card-body">
                <h3 class="card-title">DataTable</h3>
                <p class="card-description">데이터 · 정렬, 필터, 페이지네이션 테이블</p>
              </div>
            </article>

            <!-- Calendar - Coming Soon (데이터) -->
            <article
              role="article"
              class="component-card component-card--coming-soon"
              aria-disabled="true"
              aria-label="Calendar 컴포넌트 - 준비 중"
              tabindex="-1"
            >
              <div class="card-header">
                <div class="card-icon" aria-hidden="true">
                  <i data-lucide="calendar" aria-hidden="true"></i>
                </div>
                <span class="card-badge badge badge-gray" role="status" aria-label="준비 중">Coming Soon</span>
              </div>
              <div class="card-body">
                <h3 class="card-title">Calendar</h3>
                <p class="card-description">데이터 · 날짜 선택 캘린더 컴포넌트</p>
              </div>
            </article>

            <!-- Chart - Coming Soon (데이터) -->
            <article
              role="article"
              class="component-card component-card--coming-soon"
              aria-disabled="true"
              aria-label="Chart 컴포넌트 - 준비 중"
              tabindex="-1"
            >
              <div class="card-header">
                <div class="card-icon" aria-hidden="true">
                  <i data-lucide="bar-chart-2" aria-hidden="true"></i>
                </div>
                <span class="card-badge badge badge-gray" role="status" aria-label="준비 중">Coming Soon</span>
              </div>
              <div class="card-body">
                <h3 class="card-title">Chart</h3>
                <p class="card-description">데이터 · 바/라인/파이 차트 시각화</p>
              </div>
            </article>

          </div><!-- /.components-grid (Coming Soon) -->
        </section>

        <!-- 대시보드 푸터 -->
        <footer class="footer-info" role="contentinfo">
          <p>© 2026 Web UI Component Guide. 순수 HTML/CSS/ES6 기반 웹 컴포넌트 라이브러리</p>
        </footer>

      </div><!-- /.dashboard-page -->
    `;
  }

  mount() {
    // 부모 클래스 mount() 호출: render() 결과를 DOM에 삽입
    // afterMount()는 Router가 mount() 후 별도로 호출하므로 여기서 호출하지 않음
    super.mount();
  }

  /**
   * DOM 마운트 완료 후 초기화
   * - 이벤트 위임으로 카드 클릭/키보드 처리
   * - coming-soon 카드 클릭 차단
   */
  afterMount() {
    // 라우터가 없으면 경고 후 종료
    if (!window.router) {
      console.warn('DashboardPage: window.router가 없습니다. 카드 클릭 이벤트를 등록할 수 없습니다.');
      return;
    }

    const dashboardEl = this.element.querySelector('.dashboard-page');
    if (!dashboardEl) return;

    // 이벤트 위임: 대시보드 루트에서 클릭/키다운 이벤트를 한 번에 관리
    // 개별 카드마다 리스너를 붙이는 것보다 메모리 효율적
    this._handleCardClick = (event) => {
      const card = event.target.closest('.component-card');
      if (!card) return;

      // coming-soon 카드: aria-disabled="true" 이면 동작하지 않음
      if (card.getAttribute('aria-disabled') === 'true') return;

      const route = card.dataset.route;
      if (!route) return;

      window.router.navigate(route);
    };

    this._handleCardKeydown = (event) => {
      // Enter 또는 Space 키로 카드 활성화 (키보드 접근성)
      if (event.key !== 'Enter' && event.key !== ' ') return;

      const card = event.target.closest('.component-card');
      if (!card) return;

      // coming-soon 카드: aria-disabled="true" 이면 동작하지 않음
      if (card.getAttribute('aria-disabled') === 'true') return;

      const route = card.dataset.route;
      if (!route) return;

      // Space 키 기본 동작(스크롤) 방지
      event.preventDefault();
      window.router.navigate(route);
    };

    // _addEventListener()로 등록 → destroy() 시 자동 제거
    this._addEventListener(dashboardEl, 'click', this._handleCardClick);
    this._addEventListener(dashboardEl, 'keydown', this._handleCardKeydown);
  }

  destroy() {
    // 부모 클래스 destroy() 호출: _eventListeners 일괄 제거 + innerHTML 초기화
    super.destroy();

    // 핸들러 참조 해제 (가비지 컬렉션 보조)
    this._handleCardClick = null;
    this._handleCardKeydown = null;
  }
}
