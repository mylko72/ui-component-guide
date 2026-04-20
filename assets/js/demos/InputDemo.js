/**
 * 파일 경로: assets/js/demos/InputDemo.js
 *
 * InputDemo — Input 컴포넌트 데모 페이지
 * DetailPage를 상속하여 getComponentInfo()와 _renderDemos()를 오버라이드
 *
 * 7개 섹션으로 구성:
 *   1. Default Input     — 기본 텍스트 입력 (sm/md/lg 크기)
 *   2. With Label & Helper — <label for> + aria-describedby 헬퍼 텍스트
 *   3. Error State       — data-error="true" + aria-invalid + 에러 메시지
 *   4. Leading Icon      — input 좌측 아이콘 (<i> 요소)
 *   5. Trailing Icon     — input 우측 아이콘 (<i> 요소)
 *   6. Password Toggle   — type="password" ↔ type="text" 전환
 *   7. Disabled Input    — disabled + opacity + pointer-events
 *
 * WCAG 2.1 접근성 준수:
 * - <label for> 연결 필수
 * - aria-describedby로 헬퍼/에러 메시지 연결
 * - aria-invalid="true" 에러 상태 명시
 * - 포커스 링 시각적 표시 (2px outline)
 * - 터치 타겟 최소 44px (WCAG 2.5.5)
 *
 * CSS 선택자: input[data-input] (input.css 기존 패턴과 일치)
 */

import DetailPage from '../pages/DetailPage.js';
import CodeBlock from '../ui/CodeBlock.js';

export default class InputDemo extends DetailPage {
  /**
   * 페이지 메타 정보 제공
   * DetailPage.render()의 헤더 영역에 표시됨
   * @returns {{ title: string, description: string }}
   */
  getComponentInfo() {
    return {
      title: 'Input',
      description:
        '사용자 텍스트 입력을 받는 기본 폼 요소입니다. ' +
        '라벨·헬퍼·에러 메시지, 아이콘 삽입, 비밀번호 토글, 비활성 상태를 지원합니다.',
    };
  }

  /**
   * Input 데모 섹션 HTML 반환
   * DetailPage.render()의 <main> 영역에 삽입됨
   * @returns {string} 7개 섹션 HTML
   */
  _renderDemos() {
    return `
      <article class="demo-page" aria-labelledby="input-demo-title">

        <!-- 데모 페이지 인트로 제목 (숨김 처리 — 스크린리더용) -->
        <h2 id="input-demo-title" class="demo-page-title" style="display:none;" aria-hidden="true">Input 데모</h2>

        ${this._renderDefaultSection()}
        ${this._renderLabelHelperSection()}
        ${this._renderErrorSection()}
        ${this._renderLeadingIconSection()}
        ${this._renderTrailingIconSection()}
        ${this._renderPasswordToggleSection()}
        ${this._renderDisabledSection()}

      </article>
    `;
  }

  /**
   * 섹션 1: Default Input
   * placeholder, size 변형(sm/md/lg) 기본 텍스트 입력 데모
   * @returns {string}
   * @private
   */
  _renderDefaultSection() {
    return `
      <!-- ============================================
           섹션 1: Default Input
           data-input 속성으로 컴포넌트 식별
           data-size="sm|md|lg" 크기 변형
           ============================================ -->
      <section class="demo-section" aria-labelledby="section-input-default">
        <h2 id="section-input-default" class="demo-section-title">Default Input</h2>
        <p class="demo-description">
          기본 텍스트 입력 필드입니다.
          <code>data-size</code> 속성으로 sm / md / lg 크기를 지정합니다.
        </p>

        <div class="demo-preview" style="flex-direction: column; align-items: stretch; gap: 12px; max-width: 400px;">
          <!-- sm: 소형 입력 필드 (32px) -->
          <input
            data-input
            data-size="sm"
            type="text"
            placeholder="Small input"
            aria-label="소형 텍스트 입력 예시"
          />

          <!-- md: 기본 크기 입력 필드 (44px, 기본값) -->
          <input
            data-input
            data-size="md"
            type="text"
            placeholder="Medium input"
            aria-label="중형 텍스트 입력 예시"
          />

          <!-- lg: 대형 입력 필드 (52px) -->
          <input
            data-input
            data-size="lg"
            type="text"
            placeholder="Large input"
            aria-label="대형 텍스트 입력 예시"
          />
        </div>

        <!-- 코드 블록 -->
        <div id="code-block-input-default" class="code-block-wrapper"></div>
      </section>
    `;
  }

  /**
   * 섹션 2: With Label & Helper
   * <label for> 연결 + aria-describedby 헬퍼 텍스트 접근성 패턴
   * @returns {string}
   * @private
   */
  _renderLabelHelperSection() {
    return `
      <!-- ============================================
           섹션 2: With Label & Helper
           <label for> — input id 연결: 클릭 영역 확대 + 스크린리더 연동
           aria-describedby — 헬퍼 텍스트를 추가 설명으로 연결
           ============================================ -->
      <section class="demo-section" aria-labelledby="section-input-label">
        <h2 id="section-input-label" class="demo-section-title">With Label &amp; Helper</h2>
        <p class="demo-description">
          <code>&lt;label for&gt;</code>로 레이블을 연결하고,
          <code>aria-describedby</code>로 헬퍼 텍스트를 스크린리더에 전달합니다.
        </p>

        <div class="demo-preview" style="flex-direction: column; align-items: stretch; gap: 20px; max-width: 400px;">
          <!-- 이메일 입력: 라벨 + 헬퍼 텍스트 -->
          <div class="input-field">
            <label class="input-label" for="demo-email">
              이메일 주소
            </label>
            <input
              data-input
              data-size="md"
              type="email"
              id="demo-email"
              name="email"
              placeholder="example@domain.com"
              aria-describedby="demo-email-helper"
              autocomplete="email"
            />
            <p class="input-helper" id="demo-email-helper">
              가입 시 사용한 이메일 주소를 입력하세요.
            </p>
          </div>

          <!-- 사용자명 입력: 라벨 + 필수(required) + 헬퍼 텍스트 -->
          <div class="input-field">
            <label class="input-label" for="demo-username">
              사용자명
              <!-- aria-hidden: 스크린리더는 "필수" 대신 aria-required로 인식 -->
              <span class="input-required" aria-hidden="true">*</span>
            </label>
            <input
              data-input
              data-size="md"
              type="text"
              id="demo-username"
              name="username"
              placeholder="영문·숫자 조합 4~20자"
              aria-describedby="demo-username-helper"
              aria-required="true"
              autocomplete="username"
            />
            <p class="input-helper" id="demo-username-helper">
              영문, 숫자, 언더스코어(_)만 사용할 수 있습니다.
            </p>
          </div>
        </div>

        <!-- 코드 블록 -->
        <div id="code-block-input-label" class="code-block-wrapper"></div>
      </section>
    `;
  }

  /**
   * 섹션 3: Error State
   * data-error="true" + aria-invalid="true" + 에러 메시지
   * @returns {string}
   * @private
   */
  _renderErrorSection() {
    return `
      <!-- ============================================
           섹션 3: Error State
           data-error="true": CSS 선택자로 빨간 테두리 적용
           aria-invalid="true": 스크린리더에 유효성 실패 전달
           aria-describedby → 에러 메시지 id 연결
           role="alert": 에러 메시지를 즉시 읽어줌
           ============================================ -->
      <section class="demo-section" aria-labelledby="section-input-error">
        <h2 id="section-input-error" class="demo-section-title">Error State</h2>
        <p class="demo-description">
          유효성 검사 실패 시 <code>data-error="true"</code>와
          <code>aria-invalid="true"</code>, 에러 메시지를 함께 제공합니다.
        </p>

        <div class="demo-preview" style="flex-direction: column; align-items: stretch; gap: 20px; max-width: 400px;">
          <!-- 이메일 에러 예시 -->
          <div class="input-field">
            <label class="input-label" for="demo-error-email">
              이메일 주소
            </label>
            <input
              data-input
              data-size="md"
              data-error="true"
              type="email"
              id="demo-error-email"
              name="error-email"
              value="invalid-email"
              aria-invalid="true"
              aria-describedby="demo-error-email-msg"
            />
            <p class="input-error-msg" id="demo-error-email-msg" role="alert">
              <i data-lucide="alert-circle" aria-hidden="true"></i>
              올바른 이메일 형식으로 입력해 주세요.
            </p>
          </div>

          <!-- 비밀번호 에러 예시 -->
          <div class="input-field">
            <label class="input-label" for="demo-error-pw">
              비밀번호
            </label>
            <input
              data-input
              data-size="md"
              data-error="true"
              type="password"
              id="demo-error-pw"
              name="error-password"
              value="abc"
              aria-invalid="true"
              aria-describedby="demo-error-pw-msg"
            />
            <p class="input-error-msg" id="demo-error-pw-msg" role="alert">
              <i data-lucide="alert-circle" aria-hidden="true"></i>
              비밀번호는 8자 이상이어야 합니다.
            </p>
          </div>
        </div>

        <!-- 코드 블록 -->
        <div id="code-block-input-error" class="code-block-wrapper"></div>
      </section>
    `;
  }

  /**
   * 섹션 4: Leading Icon
   * input 좌측에 <i> 아이콘 배치 (input-icon-wrap + padding-left 조정)
   * @returns {string}
   * @private
   */
  _renderLeadingIconSection() {
    return `
      <!-- ============================================
           섹션 4: Leading Icon
           .input-icon-wrap: 상대 위치 컨테이너
           .input-icon--leading: 절대 위치로 좌측 아이콘 배치
           data-icon="leading": input padding-left 확장
           ============================================ -->
      <section class="demo-section" aria-labelledby="section-input-leading">
        <h2 id="section-input-leading" class="demo-section-title">Leading Icon</h2>
        <p class="demo-description">
          입력 필드 좌측에 아이콘을 배치합니다.
          아이콘은 장식용(<code>aria-hidden="true"</code>)으로 처리합니다.
        </p>

        <div class="demo-preview" style="flex-direction: column; align-items: stretch; gap: 16px; max-width: 400px;">
          <!-- 검색 입력 (돋보기 아이콘) -->
          <div class="input-field">
            <label class="input-label" for="demo-search">검색</label>
            <div class="input-icon-wrap">
              <i class="input-icon input-icon--leading" data-lucide="search" aria-hidden="true"></i>
              <input
                data-input
                data-size="md"
                data-icon="leading"
                type="search"
                id="demo-search"
                name="search"
                placeholder="검색어를 입력하세요"
              />
            </div>
          </div>

          <!-- 사용자 이름 입력 (사람 아이콘) -->
          <div class="input-field">
            <label class="input-label" for="demo-user-leading">이름</label>
            <div class="input-icon-wrap">
              <i class="input-icon input-icon--leading" data-lucide="user" aria-hidden="true"></i>
              <input
                data-input
                data-size="md"
                data-icon="leading"
                type="text"
                id="demo-user-leading"
                name="user-name"
                placeholder="이름을 입력하세요"
              />
            </div>
          </div>

          <!-- 이메일 입력 (메일 아이콘) -->
          <div class="input-field">
            <label class="input-label" for="demo-mail-leading">이메일</label>
            <div class="input-icon-wrap">
              <i class="input-icon input-icon--leading" data-lucide="mail" aria-hidden="true"></i>
              <input
                data-input
                data-size="md"
                data-icon="leading"
                type="email"
                id="demo-mail-leading"
                name="mail-leading"
                placeholder="example@domain.com"
                autocomplete="email"
              />
            </div>
          </div>
        </div>

        <!-- 코드 블록 -->
        <div id="code-block-input-leading" class="code-block-wrapper"></div>
      </section>
    `;
  }

  /**
   * 섹션 5: Trailing Icon
   * input 우측에 <i> 아이콘 배치 (padding-right 조정)
   * @returns {string}
   * @private
   */
  _renderTrailingIconSection() {
    return `
      <!-- ============================================
           섹션 5: Trailing Icon
           .input-icon--trailing: 절대 위치로 우측 아이콘 배치
           data-icon="trailing": input padding-right 확장
           ============================================ -->
      <section class="demo-section" aria-labelledby="section-input-trailing">
        <h2 id="section-input-trailing" class="demo-section-title">Trailing Icon</h2>
        <p class="demo-description">
          입력 필드 우측에 아이콘을 배치합니다.
          상태 표시나 부가 기능 힌트에 활용합니다.
        </p>

        <div class="demo-preview" style="flex-direction: column; align-items: stretch; gap: 16px; max-width: 400px;">
          <!-- URL 입력 (외부 링크 아이콘) -->
          <div class="input-field">
            <label class="input-label" for="demo-url-trailing">웹사이트 URL</label>
            <div class="input-icon-wrap">
              <input
                data-input
                data-size="md"
                data-icon="trailing"
                type="url"
                id="demo-url-trailing"
                name="website-url"
                placeholder="https://example.com"
                autocomplete="url"
              />
              <i class="input-icon input-icon--trailing" data-lucide="external-link" aria-hidden="true"></i>
            </div>
          </div>

          <!-- 날짜 입력 (캘린더 아이콘) -->
          <div class="input-field">
            <label class="input-label" for="demo-date-trailing">날짜</label>
            <div class="input-icon-wrap">
              <input
                data-input
                data-size="md"
                data-icon="trailing"
                type="text"
                id="demo-date-trailing"
                name="date-trailing"
                placeholder="YYYY-MM-DD"
              />
              <i class="input-icon input-icon--trailing" data-lucide="calendar" aria-hidden="true"></i>
            </div>
          </div>

          <!-- 검증 완료 (체크 아이콘) — 성공 상태 힌트 -->
          <div class="input-field">
            <label class="input-label" for="demo-valid-trailing">닉네임</label>
            <div class="input-icon-wrap">
              <input
                data-input
                data-size="md"
                data-icon="trailing"
                type="text"
                id="demo-valid-trailing"
                name="nickname-trailing"
                value="awesome_user"
                aria-describedby="demo-valid-trailing-helper"
              />
              <i class="input-icon input-icon--trailing input-icon--success" data-lucide="check-circle" aria-hidden="true"></i>
            </div>
            <p class="input-helper input-helper--success" id="demo-valid-trailing-helper">
              사용 가능한 닉네임입니다.
            </p>
          </div>
        </div>

        <!-- 코드 블록 -->
        <div id="code-block-input-trailing" class="code-block-wrapper"></div>
      </section>
    `;
  }

  /**
   * 섹션 6: Password Toggle
   * type="password" ↔ type="text" 전환 토글 버튼
   * afterMount()에서 이벤트 바인딩
   * @returns {string}
   * @private
   */
  _renderPasswordToggleSection() {
    return `
      <!-- ============================================
           섹션 6: Password Toggle
           토글 버튼: aria-pressed 상태 + aria-label 동적 변경
           입력 type 속성: "password" ↔ "text" 교체
           아이콘: eye / eye-off lucide 아이콘 전환
           ============================================ -->
      <section class="demo-section" aria-labelledby="section-input-password">
        <h2 id="section-input-password" class="demo-section-title">Password Toggle</h2>
        <p class="demo-description">
          눈 아이콘 클릭으로 비밀번호 표시/숨김을 전환합니다.
          <code>aria-pressed</code>로 현재 상태를 스크린리더에 전달합니다.
        </p>

        <div class="demo-preview" style="flex-direction: column; align-items: stretch; gap: 20px; max-width: 400px;">
          <!-- 비밀번호 입력 1: 기본 -->
          <div class="input-field">
            <label class="input-label" for="demo-password-1">비밀번호</label>
            <div class="input-icon-wrap">
              <input
                data-input
                data-size="md"
                data-icon="trailing"
                type="password"
                id="demo-password-1"
                name="password-1"
                placeholder="비밀번호를 입력하세요"
                autocomplete="current-password"
                aria-describedby="demo-password-1-helper"
              />
              <!-- 토글 버튼: data-target으로 연결 대상 input id 지정 -->
              <button
                class="input-pw-toggle"
                type="button"
                data-target="demo-password-1"
                aria-label="비밀번호 표시"
                aria-pressed="false"
              >
                <i data-lucide="eye" aria-hidden="true"></i>
              </button>
            </div>
            <p class="input-helper" id="demo-password-1-helper">
              8자 이상, 대소문자·숫자·특수문자 조합을 권장합니다.
            </p>
          </div>

          <!-- 비밀번호 입력 2: 비밀번호 확인 -->
          <div class="input-field">
            <label class="input-label" for="demo-password-2">비밀번호 확인</label>
            <div class="input-icon-wrap">
              <input
                data-input
                data-size="md"
                data-icon="trailing"
                type="password"
                id="demo-password-2"
                name="password-2"
                placeholder="비밀번호를 다시 입력하세요"
                autocomplete="new-password"
              />
              <button
                class="input-pw-toggle"
                type="button"
                data-target="demo-password-2"
                aria-label="비밀번호 표시"
                aria-pressed="false"
              >
                <i data-lucide="eye" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- 코드 블록 -->
        <div id="code-block-input-password" class="code-block-wrapper"></div>
      </section>
    `;
  }

  /**
   * 섹션 7: Disabled Input
   * disabled 속성으로 비활성화 — opacity + cursor: not-allowed
   * @returns {string}
   * @private
   */
  _renderDisabledSection() {
    return `
      <!-- ============================================
           섹션 7: Disabled Input
           HTML disabled 속성: opacity 0.5 + cursor: not-allowed
           스크린리더: disabled 입력 자동으로 비활성 상태 안내
           ============================================ -->
      <section class="demo-section" aria-labelledby="section-input-disabled">
        <h2 id="section-input-disabled" class="demo-section-title">Disabled Input</h2>
        <p class="demo-description">
          <code>disabled</code> 속성 추가 시 반투명 처리되고 입력이 차단됩니다.
        </p>

        <div class="demo-preview" style="flex-direction: column; align-items: stretch; gap: 20px; max-width: 400px;">
          <!-- 단순 비활성 입력 -->
          <div class="input-field">
            <label class="input-label" for="demo-disabled-basic">
              기본 비활성
            </label>
            <input
              data-input
              data-size="md"
              type="text"
              id="demo-disabled-basic"
              name="disabled-basic"
              placeholder="입력할 수 없습니다"
              disabled
            />
          </div>

          <!-- 값이 있는 비활성 입력 -->
          <div class="input-field">
            <label class="input-label" for="demo-disabled-value">
              값이 있는 비활성
            </label>
            <input
              data-input
              data-size="md"
              type="text"
              id="demo-disabled-value"
              name="disabled-value"
              value="읽기 전용 값"
              disabled
            />
            <p class="input-helper">이 필드는 수정할 수 없습니다.</p>
          </div>

          <!-- 아이콘이 있는 비활성 입력 -->
          <div class="input-field">
            <label class="input-label" for="demo-disabled-icon">
              아이콘 포함 비활성
            </label>
            <div class="input-icon-wrap">
              <i class="input-icon input-icon--leading" data-lucide="lock" aria-hidden="true"></i>
              <input
                data-input
                data-size="md"
                data-icon="leading"
                type="text"
                id="demo-disabled-icon"
                name="disabled-icon"
                value="잠긴 필드"
                disabled
              />
            </div>
          </div>
        </div>

        <!-- 코드 블록 -->
        <div id="code-block-input-disabled" class="code-block-wrapper"></div>
      </section>
    `;
  }

  /**
   * 마운트 후 초기화
   * - 부모 afterMount() 먼저 호출 (페이지 스크롤 최상단)
   * - Lucide 아이콘 재초기화 (동적 렌더링 후 SVG 주입)
   * - 비밀번호 토글 이벤트 바인딩
   * - 7개 섹션별 CodeBlock 인스턴스 생성·마운트
   */
  afterMount() {
    // 부모 클래스 초기화: 페이지 스크롤 최상단
    super.afterMount();

    // Lucide 아이콘 재초기화: 동적 렌더링 후 아이콘 SVG 주입
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }

    // CodeBlock 인스턴스 배열 저장 (destroy()에서 정리용)
    this._codeBlocks = [];

    // 비밀번호 토글 이벤트 바인딩
    this._initPasswordToggles();

    // 7개 섹션별 코드 블록 생성
    this._initCodeBlock('input-default', {
      html: `<!-- 기본 텍스트 입력 (크기: sm / md / lg) -->
<input data-input data-size="sm" type="text" placeholder="Small input" aria-label="소형 입력" />
<input data-input data-size="md" type="text" placeholder="Medium input" aria-label="중형 입력" />
<input data-input data-size="lg" type="text" placeholder="Large input" aria-label="대형 입력" />`,
      css: `/* 베이스 input 스타일 */
input[data-input] {
  display: block;
  width: 100%;
  box-sizing: border-box;
  font-family: var(--font-family);
  color: var(--color-text);
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  outline: none;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

/* 크기 변형 */
input[data-input][data-size="sm"] { padding: 6px 10px;  font-size: var(--font-size-sm);   min-height: 32px; }
input[data-input][data-size="md"] { padding: 10px 14px; font-size: var(--font-size-base); min-height: 44px; }
input[data-input][data-size="lg"] { padding: 14px 18px; font-size: var(--font-size-lg);   min-height: 52px; }

/* 포커스 링 (WCAG 2.1) */
input[data-input]:focus:not(:disabled) {
  outline: 2px solid var(--color-primary);
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}`,
      js: `// 입력값 변경 감지 예시
const input = document.querySelector('[data-input]');
input.addEventListener('input', (e) => {
  console.log('입력값:', e.target.value);
});`
    });

    this._initCodeBlock('input-label', {
      html: `<!-- 라벨 + 헬퍼 텍스트 패턴 -->
<div class="input-field">
  <label class="input-label" for="email">
    이메일 주소
  </label>
  <input
    data-input data-size="md"
    type="email" id="email"
    placeholder="example@domain.com"
    aria-describedby="email-helper"
    autocomplete="email"
  />
  <p class="input-helper" id="email-helper">
    가입 시 사용한 이메일 주소를 입력하세요.
  </p>
</div>

<!-- 필수 입력 (*) -->
<div class="input-field">
  <label class="input-label" for="username">
    사용자명
    <span class="input-required" aria-hidden="true">*</span>
  </label>
  <input
    data-input data-size="md"
    type="text" id="username"
    aria-required="true"
    aria-describedby="username-helper"
  />
  <p class="input-helper" id="username-helper">
    영문, 숫자, 언더스코어(_)만 사용할 수 있습니다.
  </p>
</div>`,
      css: `/* 입력 필드 그룹 */
.input-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* 레이블 */
.input-label {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text);
}

/* 필수 표시 */
.input-required {
  color: var(--color-danger);
  margin-left: 1px;
}

/* 헬퍼 텍스트 */
.input-helper {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0;
}`,
      js: `// 필수 입력 유효성 검사 예시
const form = document.querySelector('form');
form.addEventListener('submit', (e) => {
  const input = form.querySelector('[aria-required="true"]');
  if (!input.value.trim()) {
    e.preventDefault();
    input.setAttribute('aria-invalid', 'true');
    input.setAttribute('data-error', 'true');
    input.focus();
  }
});`
    });

    this._initCodeBlock('input-error', {
      html: `<!-- 에러 상태: data-error + aria-invalid + role="alert" -->
<div class="input-field">
  <label class="input-label" for="error-email">이메일 주소</label>
  <input
    data-input data-size="md"
    data-error="true"
    type="email" id="error-email"
    value="invalid-email"
    aria-invalid="true"
    aria-describedby="error-email-msg"
  />
  <p class="input-error-msg" id="error-email-msg" role="alert">
    <i data-lucide="alert-circle" aria-hidden="true"></i>
    올바른 이메일 형식으로 입력해 주세요.
  </p>
</div>`,
      css: `/* 에러 상태: 빨간 테두리 + 연한 배경 */
input[data-input][data-error="true"] {
  border-color: var(--color-danger);
  background-color: color-mix(in srgb, var(--color-danger) 6%, var(--color-bg));
}

input[data-input][data-error="true"]:focus:not(:disabled) {
  outline: 2px solid var(--color-danger);
  border-color: var(--color-danger);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
}

/* 에러 메시지 */
.input-error-msg {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: var(--font-size-sm);
  color: var(--color-danger);
  margin: 0;
}`,
      js: `// 실시간 유효성 검사 예시
const emailInput = document.querySelector('#error-email');
const errorMsg   = document.querySelector('#error-email-msg');

emailInput.addEventListener('blur', () => {
  const valid = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(emailInput.value);
  emailInput.setAttribute('aria-invalid', String(!valid));
  emailInput.dataset.error = valid ? 'false' : 'true';
  errorMsg.hidden = valid;
});`
    });

    this._initCodeBlock('input-leading', {
      html: `<!-- 좌측 아이콘 (Leading Icon) -->
<div class="input-field">
  <label class="input-label" for="search">검색</label>
  <div class="input-icon-wrap">
    <i class="input-icon input-icon--leading"
       data-lucide="search" aria-hidden="true"></i>
    <input
      data-input data-size="md"
      data-icon="leading"
      type="search" id="search"
      placeholder="검색어를 입력하세요"
    />
  </div>
</div>`,
      css: `/* 아이콘 배치용 상대 위치 컨테이너 */
.input-icon-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

/* 공통 아이콘 스타일 */
.input-icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none; /* 장식용: 이벤트 무시 */
  color: var(--color-text-secondary);
  width: 16px;
  height: 16px;
}

/* 좌측 아이콘 */
.input-icon--leading { left: 12px; }

/* 좌측 아이콘 여백 확보 */
input[data-input][data-icon="leading"] { padding-left: 38px; }`,
      js: `// 검색 입력 예시
const searchInput = document.querySelector('#search');
searchInput.addEventListener('input', (e) => {
  console.log('검색어:', e.target.value.trim());
});`
    });

    this._initCodeBlock('input-trailing', {
      html: `<!-- 우측 아이콘 (Trailing Icon) -->
<div class="input-field">
  <label class="input-label" for="website">웹사이트 URL</label>
  <div class="input-icon-wrap">
    <input
      data-input data-size="md"
      data-icon="trailing"
      type="url" id="website"
      placeholder="https://example.com"
    />
    <i class="input-icon input-icon--trailing"
       data-lucide="external-link" aria-hidden="true"></i>
  </div>
</div>

<!-- 성공 상태 트레일링 아이콘 -->
<div class="input-field">
  <label class="input-label" for="nickname">닉네임</label>
  <div class="input-icon-wrap">
    <input
      data-input data-size="md"
      data-icon="trailing"
      type="text" id="nickname"
      value="awesome_user"
      aria-describedby="nickname-helper"
    />
    <i class="input-icon input-icon--trailing input-icon--success"
       data-lucide="check-circle" aria-hidden="true"></i>
  </div>
  <p class="input-helper input-helper--success" id="nickname-helper">
    사용 가능한 닉네임입니다.
  </p>
</div>`,
      css: `/* 우측 아이콘 */
.input-icon--trailing { right: 12px; }

/* 우측 아이콘 여백 확보 */
input[data-input][data-icon="trailing"] { padding-right: 38px; }

/* 성공 상태 아이콘·헬퍼 */
.input-icon--success  { color: var(--color-success); }
.input-helper--success { color: var(--color-success); }`,
      js: `// 성공 상태 동적 적용 예시
const input   = document.querySelector('#nickname');
const checkEl = document.querySelector('.input-icon--success');

input.addEventListener('blur', () => {
  const valid = input.value.length >= 4;
  checkEl.style.display = valid ? 'block' : 'none';
});`
    });

    this._initCodeBlock('input-password', {
      html: `<!-- 비밀번호 표시/숨김 토글 -->
<div class="input-field">
  <label class="input-label" for="password">비밀번호</label>
  <div class="input-icon-wrap">
    <input
      data-input data-size="md"
      data-icon="trailing"
      type="password" id="password"
      placeholder="비밀번호를 입력하세요"
      autocomplete="current-password"
    />
    <!-- data-target: 연결할 input의 id -->
    <button
      class="input-pw-toggle"
      type="button"
      data-target="password"
      aria-label="비밀번호 표시"
      aria-pressed="false"
    >
      <i data-lucide="eye" aria-hidden="true"></i>
    </button>
  </div>
</div>`,
      css: `/* 비밀번호 토글 버튼 */
.input-pw-toggle {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: color var(--transition-fast), background-color var(--transition-fast);
}

.input-pw-toggle:hover {
  color: var(--color-text);
  background-color: var(--color-bg-secondary);
}

.input-pw-toggle:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 1px;
}

/* 표시 중 상태: 아이콘 primary 색상으로 강조 */
.input-pw-toggle[aria-pressed="true"] {
  color: var(--color-primary);
}`,
      js: `// 비밀번호 표시/숨김 토글
const toggleBtn = document.querySelector('.input-pw-toggle');
const pwInput   = document.querySelector('#password');

toggleBtn.addEventListener('click', () => {
  const isVisible = pwInput.type === 'text';

  // type 전환
  pwInput.type = isVisible ? 'password' : 'text';

  // 접근성 상태 업데이트
  toggleBtn.setAttribute('aria-pressed', String(!isVisible));
  toggleBtn.setAttribute(
    'aria-label',
    isVisible ? '비밀번호 표시' : '비밀번호 숨김'
  );

  // 아이콘 교체 (eye ↔ eye-off)
  const icon = toggleBtn.querySelector('i');
  icon.setAttribute('data-lucide', isVisible ? 'eye' : 'eye-off');
  lucide.createIcons();
});`
    });

    this._initCodeBlock('input-disabled', {
      html: `<!-- 비활성 입력 -->
<div class="input-field">
  <label class="input-label" for="disabled-basic">비활성 입력</label>
  <input
    data-input data-size="md"
    type="text" id="disabled-basic"
    placeholder="입력할 수 없습니다"
    disabled
  />
</div>

<!-- 값이 있는 비활성 입력 -->
<div class="input-field">
  <label class="input-label" for="disabled-value">읽기 전용 값</label>
  <input
    data-input data-size="md"
    type="text" id="disabled-value"
    value="변경 불가 값"
    disabled
  />
</div>`,
      css: `/* 비활성 상태 */
input[data-input]:disabled,
input[data-input][disabled] {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
  background-color: var(--color-bg-secondary);
}`,
      js: `// 조건부 비활성화 예시
const input  = document.querySelector('#disabled-basic');
const toggle = document.querySelector('#toggle-btn');

toggle.addEventListener('click', () => {
  input.disabled = !input.disabled;
  toggle.textContent = input.disabled ? '활성화' : '비활성화';
});`
    });
  }

  /**
   * 비밀번호 토글 버튼 이벤트 바인딩
   * - data-target 속성으로 연결된 input을 찾아 type 전환
   * - aria-pressed, aria-label 동적 업데이트
   * - lucide 아이콘 eye ↔ eye-off 교체
   * @private
   */
  _initPasswordToggles() {
    const toggleButtons = this.element.querySelectorAll('.input-pw-toggle');

    toggleButtons.forEach((btn) => {
      const handleToggle = () => {
        // data-target으로 연결된 input 탐색
        const targetId = btn.dataset.target;
        const input = this.element.querySelector(`#${targetId}`);
        if (!input) return;

        // 현재 표시 상태 확인 후 반전
        const isCurrentlyVisible = input.type === 'text';
        const nowVisible = !isCurrentlyVisible;

        // input type 전환
        input.type = nowVisible ? 'text' : 'password';

        // aria 상태 업데이트
        btn.setAttribute('aria-pressed', String(nowVisible));
        btn.setAttribute('aria-label', nowVisible ? '비밀번호 숨김' : '비밀번호 표시');

        // lucide 아이콘 교체: eye ↔ eye-off
        const icon = btn.querySelector('i');
        if (icon) {
          icon.setAttribute('data-lucide', nowVisible ? 'eye-off' : 'eye');
          if (typeof lucide !== 'undefined') {
            lucide.createIcons();
          }
        }
      };

      // _addEventListener로 등록 → destroy() 시 자동 정리
      this._addEventListener(btn, 'click', handleToggle);

      // 키보드 접근성: Enter / Space 키 지원 (button은 기본 지원이지만 명시적으로 처리)
      this._addEventListener(btn, 'keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleToggle();
        }
      });
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
   * @param {string} sectionId - 섹션 ID (input-default, input-label 등)
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
