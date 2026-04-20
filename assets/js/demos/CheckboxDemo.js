/**
 * 파일 경로: assets/js/demos/CheckboxDemo.js
 *
 * CheckboxDemo — Checkbox 컴포넌트 데모 페이지
 * DetailPage를 상속하여 getComponentInfo()와 _renderDemos()를 오버라이드
 *
 * 5개 섹션으로 구성:
 *   1. Basic Checkbox      — 기본 단일 체크박스
 *   2. Checkbox Group      — fieldset + legend로 묶인 체크박스 그룹
 *   3. Indeterminate       — 부모 체크박스 + 3개 자식 (mixed 상태 포함)
 *   4. Disabled Checkbox   — disabled 상태 (체크/비체크)
 *   5. Label과 함께        — <label for>로 연결된 접근성 패턴 + 설명 텍스트
 *
 * CSS 선택자 패턴 (checkbox.css와 일치):
 *   - input[type="checkbox"][data-checkbox]: 네이티브 체크박스 숨김 처리
 *   - label[data-checkbox-label]: 커스텀 체크박스 외형 + 레이블 텍스트
 *   - aria-checked="mixed": indeterminate(부분 선택) 상태 CSS 처리
 *
 * WCAG 2.1 접근성 준수:
 *   - <label for> 연결로 클릭 영역 확대 + 스크린리더 연동
 *   - aria-checked="true|false|mixed" 명시적 상태 전달
 *   - 포커스 링: input:focus-visible → label::before에 outline 표시
 *   - aria-disabled="true" + disabled 속성으로 비활성 상태 전달
 *   - fieldset + legend로 그룹 의미 전달
 */

import DetailPage from '../pages/DetailPage.js';
import CodeBlock from '../ui/CodeBlock.js';

export default class CheckboxDemo extends DetailPage {
  /**
   * 페이지 메타 정보 제공
   * DetailPage.render()의 헤더 영역에 표시됨
   * @returns {{ title: string, description: string }}
   */
  getComponentInfo() {
    return {
      title: 'Checkbox',
      description:
        '사용자가 하나 이상의 항목을 선택할 수 있는 폼 요소입니다. ' +
        '단일 선택, 그룹 선택, 부분 선택(Indeterminate), 비활성 상태를 지원합니다.',
    };
  }

  /**
   * Checkbox 데모 섹션 HTML 반환
   * DetailPage.render()의 <main> 영역에 삽입됨
   * @returns {string} 5개 섹션 HTML
   */
  _renderDemos() {
    return `
      <article class="demo-page" aria-labelledby="checkbox-demo-title">

        <!-- 데모 페이지 인트로 제목 (스크린리더용, 시각적 숨김) -->
        <h2 id="checkbox-demo-title" class="demo-page-title" style="display:none;" aria-hidden="true">Checkbox 데모</h2>

        ${this._renderBasicSection()}
        ${this._renderGroupSection()}
        ${this._renderIndeterminateSection()}
        ${this._renderDisabledSection()}
        ${this._renderLabelSection()}

      </article>
    `;
  }

  /**
   * 섹션 1: Basic Checkbox
   * input[data-checkbox] + label[data-checkbox-label] 기본 패턴
   * @returns {string}
   * @private
   */
  _renderBasicSection() {
    return `
      <!-- ============================================
           섹션 1: Basic Checkbox
           input[data-checkbox]: 시각적 숨김 처리 (SR 접근성 유지)
           label[data-checkbox-label]: ::before(박스) + ::after(체크마크) 로
           커스텀 체크박스 외형 구현
           ============================================ -->
      <section class="demo-section" aria-labelledby="section-checkbox-basic">
        <h2 id="section-checkbox-basic" class="demo-section-title">Basic Checkbox</h2>
        <p class="demo-description">
          기본 체크박스 컴포넌트입니다.
          <code>input[data-checkbox]</code>과 <code>label[data-checkbox-label]</code>을
          함께 사용하여 커스텀 체크박스를 구현합니다.
        </p>

        <div class="demo-preview" style="flex-direction: column; align-items: flex-start; gap: 4px;">
          <!-- 비체크 상태 -->
          <input
            type="checkbox"
            data-checkbox
            id="basic-unchecked"
            aria-checked="false"
          />
          <label data-checkbox-label for="basic-unchecked">
            기본 체크박스 (비체크)
          </label>

          <!-- 체크 상태 -->
          <input
            type="checkbox"
            data-checkbox
            id="basic-checked"
            checked
            aria-checked="true"
          />
          <label data-checkbox-label for="basic-checked">
            기본 체크박스 (체크됨)
          </label>
        </div>

        <!-- 코드 블록 -->
        <div id="code-block-checkbox-basic" class="code-block-wrapper"></div>
      </section>
    `;
  }

  /**
   * 섹션 2: Checkbox Group
   * fieldset + legend로 묶인 체크박스 그룹
   * @returns {string}
   * @private
   */
  _renderGroupSection() {
    return `
      <!-- ============================================
           섹션 2: Checkbox Group
           <fieldset> + <legend>: 관련 체크박스 의미적 그룹화
           스크린리더: "좋아하는 프레임워크 선택 [그룹] React 체크박스" 형식으로 읽음
           .checkbox-group: 수직 배치 컨테이너
           ============================================ -->
      <section class="demo-section" aria-labelledby="section-checkbox-group">
        <h2 id="section-checkbox-group" class="demo-section-title">Checkbox Group</h2>
        <p class="demo-description">
          <code>&lt;fieldset&gt;</code>과 <code>&lt;legend&gt;</code>로
          관련 체크박스를 의미적으로 그룹화합니다.
          스크린리더가 그룹명을 각 항목과 함께 읽어줍니다.
        </p>

        <div class="demo-preview">
          <fieldset style="border: none; padding: 0; margin: 0;">
            <legend class="checkbox-group-label">좋아하는 프레임워크 선택</legend>

            <div class="checkbox-group" style="margin-top: 8px;">
              <div>
                <input
                  type="checkbox"
                  data-checkbox
                  id="group-react"
                  name="frameworks"
                  value="react"
                  checked
                  aria-checked="true"
                />
                <label data-checkbox-label for="group-react">React</label>
              </div>

              <div>
                <input
                  type="checkbox"
                  data-checkbox
                  id="group-vue"
                  name="frameworks"
                  value="vue"
                  aria-checked="false"
                />
                <label data-checkbox-label for="group-vue">Vue</label>
              </div>

              <div>
                <input
                  type="checkbox"
                  data-checkbox
                  id="group-svelte"
                  name="frameworks"
                  value="svelte"
                  checked
                  aria-checked="true"
                />
                <label data-checkbox-label for="group-svelte">Svelte</label>
              </div>

              <div>
                <input
                  type="checkbox"
                  data-checkbox
                  id="group-angular"
                  name="frameworks"
                  value="angular"
                  aria-checked="false"
                />
                <label data-checkbox-label for="group-angular">Angular</label>
              </div>
            </div>
          </fieldset>
        </div>

        <!-- 코드 블록 -->
        <div id="code-block-checkbox-group" class="code-block-wrapper"></div>
      </section>
    `;
  }

  /**
   * 섹션 3: Indeterminate
   * 부모 체크박스 + 3개 자식 (2개 체크 → aria-checked="mixed")
   * afterMount()에서 자식 변경 감지 → 부모 상태 자동 업데이트
   * @returns {string}
   * @private
   */
  _renderIndeterminateSection() {
    return `
      <!-- ============================================
           섹션 3: Indeterminate (부분 선택)
           부모: aria-checked="mixed" → CSS :indeterminate 가상 클래스로
           대시(-) 아이콘 표시
           자식 변경 감지:
             - 전체 체크   → aria-checked="true"
             - 전체 해제   → aria-checked="false"
             - 일부만 체크 → aria-checked="mixed"
           ============================================ -->
      <section class="demo-section" aria-labelledby="section-checkbox-indeterminate">
        <h2 id="section-checkbox-indeterminate" class="demo-section-title">Indeterminate</h2>
        <p class="demo-description">
          자식 항목 중 일부만 선택된 경우 부모 체크박스가
          <code>aria-checked="mixed"</code>(부분 선택) 상태로 표시됩니다.
          부모를 클릭하면 전체 선택/해제가 토글됩니다.
        </p>

        <div class="demo-preview" style="flex-direction: column; align-items: flex-start; gap: 8px;">
          <!-- 부모 체크박스 (전체 선택/해제 제어) -->
          <div>
            <input
              type="checkbox"
              data-checkbox
              id="parent-checkbox"
              aria-checked="mixed"
              data-parent="checkbox-children-group"
            />
            <!-- bold: 부모임을 시각적으로 강조 -->
            <label data-checkbox-label for="parent-checkbox" style="font-weight: 600;">
              전체 선택
            </label>
          </div>

          <!-- 자식 체크박스 그룹 (들여쓰기로 계층 표현) -->
          <div
            id="checkbox-children-group"
            class="checkbox-group"
            role="group"
            aria-label="하위 항목 선택"
            style="padding-left: 26px; border-left: 2px solid var(--color-border); margin-left: 9px;"
          >
            <div>
              <input
                type="checkbox"
                data-checkbox
                id="child-option-1"
                name="options"
                value="option1"
                checked
                aria-checked="true"
                data-child-group="checkbox-children-group"
              />
              <label data-checkbox-label for="child-option-1">항목 A</label>
            </div>

            <div>
              <input
                type="checkbox"
                data-checkbox
                id="child-option-2"
                name="options"
                value="option2"
                checked
                aria-checked="true"
                data-child-group="checkbox-children-group"
              />
              <label data-checkbox-label for="child-option-2">항목 B</label>
            </div>

            <div>
              <input
                type="checkbox"
                data-checkbox
                id="child-option-3"
                name="options"
                value="option3"
                aria-checked="false"
                data-child-group="checkbox-children-group"
              />
              <label data-checkbox-label for="child-option-3">항목 C</label>
            </div>
          </div>
        </div>

        <!-- 코드 블록 -->
        <div id="code-block-checkbox-indeterminate" class="code-block-wrapper"></div>
      </section>
    `;
  }

  /**
   * 섹션 4: Disabled Checkbox
   * disabled 상태 체크박스 — 체크/비체크 두 가지 모두 표시
   * @returns {string}
   * @private
   */
  _renderDisabledSection() {
    return `
      <!-- ============================================
           섹션 4: Disabled Checkbox
           disabled 속성: label에 opacity: 0.5 + cursor: not-allowed 적용
           aria-disabled="true": 스크린리더에 비활성 상태 전달
           ============================================ -->
      <section class="demo-section" aria-labelledby="section-checkbox-disabled">
        <h2 id="section-checkbox-disabled" class="demo-section-title">Disabled Checkbox</h2>
        <p class="demo-description">
          <code>disabled</code> 속성 추가 시 반투명 처리되고 상호작용이 차단됩니다.
        </p>

        <div class="demo-preview" style="flex-direction: column; align-items: flex-start; gap: 4px;">
          <!-- 비활성 + 비체크 -->
          <input
            type="checkbox"
            data-checkbox
            id="disabled-unchecked"
            disabled
            aria-disabled="true"
            aria-checked="false"
          />
          <label data-checkbox-label for="disabled-unchecked">
            비활성 (비체크)
          </label>

          <!-- 비활성 + 체크 -->
          <input
            type="checkbox"
            data-checkbox
            id="disabled-checked"
            checked
            disabled
            aria-disabled="true"
            aria-checked="true"
          />
          <label data-checkbox-label for="disabled-checked">
            비활성 (체크됨)
          </label>
        </div>

        <!-- 코드 블록 -->
        <div id="code-block-checkbox-disabled" class="code-block-wrapper"></div>
      </section>
    `;
  }

  /**
   * 섹션 5: Label과 함께
   * <label for>로 연결 + aria-describedby로 설명 텍스트 연동
   * @returns {string}
   * @private
   */
  _renderLabelSection() {
    return `
      <!-- ============================================
           섹션 5: Label과 함께
           <label for> 연결: 클릭 영역 확대 + 스크린리더 연동
           aria-describedby: 추가 설명 텍스트를 스크린리더에 전달
           .checkbox-helper: 설명 텍스트 스타일 (checkbox.css)
           ============================================ -->
      <section class="demo-section" aria-labelledby="section-checkbox-label">
        <h2 id="section-checkbox-label" class="demo-section-title">Label과 함께</h2>
        <p class="demo-description">
          <code>&lt;label for&gt;</code>로 레이블을 연결하고,
          <code>aria-describedby</code>로 추가 설명을 스크린리더에 전달합니다.
          레이블 클릭 시 체크박스가 토글됩니다.
        </p>

        <div class="demo-preview" style="flex-direction: column; align-items: flex-start; gap: 20px; max-width: 480px;">
          <!-- 이용약관 동의 (필수) -->
          <div>
            <input
              type="checkbox"
              data-checkbox
              id="label-terms"
              aria-checked="false"
              aria-describedby="label-terms-desc"
              aria-required="true"
            />
            <label data-checkbox-label for="label-terms">
              이용약관에 동의합니다
              <!-- aria-hidden: 스크린리더는 aria-required로 필수 상태 인식 -->
              <span class="checkbox-group-label" style="display:inline; color: var(--color-danger); margin-left: 2px; font-weight: 600;" aria-hidden="true">*</span>
            </label>
            <p class="checkbox-helper" id="label-terms-desc">
              서비스 이용을 위해 필수적으로 동의해야 합니다.
            </p>
          </div>

          <!-- 마케팅 수신 동의 (선택) -->
          <div>
            <input
              type="checkbox"
              data-checkbox
              id="label-marketing"
              checked
              aria-checked="true"
              aria-describedby="label-marketing-desc"
            />
            <label data-checkbox-label for="label-marketing">
              마케팅 정보 수신 동의 (선택)
            </label>
            <p class="checkbox-helper" id="label-marketing-desc">
              이벤트, 혜택 정보를 이메일로 받아보실 수 있습니다.
            </p>
          </div>

          <!-- 개인정보 제3자 제공 동의 (필수) -->
          <div>
            <input
              type="checkbox"
              data-checkbox
              id="label-privacy"
              aria-checked="false"
              aria-describedby="label-privacy-desc"
              aria-required="true"
            />
            <label data-checkbox-label for="label-privacy">
              개인정보 제3자 제공에 동의합니다
              <span style="color: var(--color-danger); margin-left: 2px; font-weight: 600;" aria-hidden="true">*</span>
            </label>
            <p class="checkbox-helper" id="label-privacy-desc">
              배송 및 결제 처리를 위해 필요합니다.
            </p>
          </div>
        </div>

        <!-- 코드 블록 -->
        <div id="code-block-checkbox-label" class="code-block-wrapper"></div>
      </section>
    `;
  }

  /**
   * 마운트 후 초기화
   * - 부모 afterMount() 먼저 호출 (페이지 스크롤 최상단)
   * - Lucide 아이콘 재초기화
   * - aria-checked 동기화 이벤트 바인딩
   * - Indeterminate 부모/자식 연동
   * - Space 키 토글 지원
   * - 5개 섹션별 CodeBlock 인스턴스 생성·마운트
   */
  afterMount() {
    // 부모 클래스 초기화: 페이지 스크롤 최상단
    super.afterMount();

    // Lucide 아이콘 재초기화
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }

    // CodeBlock 인스턴스 배열 (destroy()에서 정리용)
    this._codeBlocks = [];

    // Indeterminate 부모 체크박스 초기 상태 설정 및 이벤트 바인딩
    this._initIndeterminate();

    // 모든 체크박스: aria-checked 동기화 + Space 키 지원
    this._initCheckboxEvents();

    // 5개 섹션별 코드 블록 생성
    this._initCodeBlocks();
  }

  /**
   * Indeterminate 부모 체크박스 초기화
   * - 마운트 시 aria-checked="mixed" → element.indeterminate = true 설정
   * - 부모 클릭 → 자식 전체 토글
   * - 자식 변경 → 부모 상태 재계산
   * @private
   */
  _initIndeterminate() {
    const parentCheckbox = this.element.querySelector('[data-parent]');
    if (!parentCheckbox) return;

    // 마운트 시: aria-checked="mixed"이면 indeterminate 속성 설정
    const initialAriaChecked = parentCheckbox.getAttribute('aria-checked');
    if (initialAriaChecked === 'mixed') {
      parentCheckbox.indeterminate = true;
      parentCheckbox.checked = false;
    }

    // 자식 체크박스 수집
    const groupId = parentCheckbox.dataset.parent;
    const childCheckboxes = this.element.querySelectorAll(
      `[data-child-group="${groupId}"]`
    );

    // 부모 클릭: 자식 전체 체크 or 전체 해제
    const handleParentChange = () => {
      // indeterminate 또는 unchecked → 전체 체크
      // checked → 전체 해제
      const shouldCheck = parentCheckbox.indeterminate || !parentCheckbox.checked;

      childCheckboxes.forEach((child) => {
        child.checked = shouldCheck;
        child.setAttribute('aria-checked', String(shouldCheck));
      });

      parentCheckbox.indeterminate = false;
      parentCheckbox.checked = shouldCheck;
      parentCheckbox.setAttribute('aria-checked', String(shouldCheck));
    };
    this._addEventListener(parentCheckbox, 'change', handleParentChange);

    // 자식 변경: 부모 aria-checked 재계산
    const handleChildChange = () => {
      this._updateParentState(parentCheckbox, childCheckboxes);
    };
    childCheckboxes.forEach((child) => {
      this._addEventListener(child, 'change', handleChildChange);
    });
  }

  /**
   * 자식 체크박스 상태에 따라 부모 aria-checked 업데이트
   * - 전체 해제   → aria-checked="false"
   * - 일부만 체크 → aria-checked="mixed" (indeterminate)
   * - 전체 체크   → aria-checked="true"
   * @param {HTMLInputElement} parentEl - 부모 체크박스
   * @param {NodeList} childEls - 자식 체크박스 목록
   * @private
   */
  _updateParentState(parentEl, childEls) {
    const total = childEls.length;
    const checkedCount = Array.from(childEls).filter((el) => el.checked).length;

    if (checkedCount === 0) {
      parentEl.indeterminate = false;
      parentEl.checked = false;
      parentEl.setAttribute('aria-checked', 'false');
    } else if (checkedCount === total) {
      parentEl.indeterminate = false;
      parentEl.checked = true;
      parentEl.setAttribute('aria-checked', 'true');
    } else {
      // 일부만 체크: indeterminate 상태
      parentEl.indeterminate = true;
      parentEl.checked = false;
      parentEl.setAttribute('aria-checked', 'mixed');
    }
  }

  /**
   * 모든 data-checkbox 체크박스 이벤트 바인딩
   * - change: aria-checked 속성 동기화
   * - keydown: Space 키 토글 명시적 처리
   * @private
   */
  _initCheckboxEvents() {
    const allCheckboxes = this.element.querySelectorAll('[data-checkbox]');

    allCheckboxes.forEach((checkbox) => {
      // change: aria-checked 속성 동기화
      // (indeterminate 체크박스는 _updateParentState에서 별도 처리)
      const handleChange = () => {
        if (!checkbox.indeterminate) {
          checkbox.setAttribute('aria-checked', String(checkbox.checked));
        }
      };
      this._addEventListener(checkbox, 'change', handleChange);

      // keydown: Space 키로 명시적 토글
      // native input[type=checkbox]는 Space를 자동 처리하지만,
      // 접근성 패턴 명시를 위해 keydown 핸들러도 등록
      const handleKeydown = (e) => {
        if (e.key === ' ' || e.key === 'Spacebar') {
          e.preventDefault();
          if (!checkbox.disabled) {
            checkbox.click();
          }
        }
      };
      this._addEventListener(checkbox, 'keydown', handleKeydown);
    });
  }

  /**
   * 5개 섹션별 CodeBlock 인스턴스 생성·마운트
   * @private
   */
  _initCodeBlocks() {
    // 섹션 1: Basic Checkbox
    this._initCodeBlock('checkbox-basic', {
      html: `<!-- 기본 체크박스 패턴 -->
<!-- input[data-checkbox]: 시각적으로 숨기되 접근성 트리 유지 -->
<!-- label[data-checkbox-label]: ::before(박스) + ::after(체크마크) -->

<!-- 비체크 상태 -->
<input
  type="checkbox"
  data-checkbox
  id="my-checkbox"
  aria-checked="false"
/>
<label data-checkbox-label for="my-checkbox">
  기본 체크박스
</label>

<!-- 체크된 상태 -->
<input
  type="checkbox"
  data-checkbox
  id="my-checkbox-checked"
  checked
  aria-checked="true"
/>
<label data-checkbox-label for="my-checkbox-checked">
  체크된 체크박스
</label>`,
      css: `/* 네이티브 input[type="checkbox"] 시각적 숨김 */
input[type="checkbox"][data-checkbox] {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* 커스텀 체크박스 레이블 */
label[data-checkbox-label] {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-base);
  color: var(--color-text);
  cursor: pointer;
  min-height: 44px; /* WCAG 2.5.5 터치 타겟 */
  user-select: none;
  position: relative;
}

/* ::before: 체크박스 박스 */
label[data-checkbox-label]::before {
  content: '';
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  box-sizing: border-box;
  border: 1px solid var(--color-border-hover);
  border-radius: 3px;
  background-color: var(--color-bg);
  transition: background-color var(--transition-fast),
              border-color var(--transition-fast);
}

/* 체크 상태: primary 색상 박스 */
input[type="checkbox"][data-checkbox]:checked + label[data-checkbox-label]::before {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
}

/* ::after: 체크마크 */
label[data-checkbox-label]::after {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  width: 5px;
  height: 9px;
  border: 2px solid transparent;
  border-right-color: #fff;
  border-bottom-color: #fff;
  border-top: none;
  border-left: none;
  transform: translateX(6px) translateY(calc(-50% - 1px)) rotate(45deg);
  opacity: 0;
  transition: opacity var(--transition-fast);
}

/* 체크 시 체크마크 표시 */
input[type="checkbox"][data-checkbox]:checked + label[data-checkbox-label]::after {
  opacity: 1;
}

/* 포커스 링 (WCAG 2.1) */
input[type="checkbox"][data-checkbox]:focus-visible + label[data-checkbox-label]::before {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
}`,
      js: `// 체크 상태 변경 감지 및 aria-checked 동기화
const checkbox = document.querySelector('[data-checkbox]');

checkbox.addEventListener('change', () => {
  // aria-checked 속성 동기화
  checkbox.setAttribute('aria-checked', String(checkbox.checked));
  console.log('체크 상태:', checkbox.checked);
});`,
    });

    // 섹션 2: Checkbox Group
    this._initCodeBlock('checkbox-group', {
      html: `<!-- fieldset + legend로 체크박스 그룹화 -->
<fieldset style="border: none; padding: 0; margin: 0;">
  <legend class="checkbox-group-label">좋아하는 프레임워크 선택</legend>

  <div class="checkbox-group" style="margin-top: 8px;">
    <div>
      <input type="checkbox" data-checkbox id="react"
             name="frameworks" value="react" checked aria-checked="true" />
      <label data-checkbox-label for="react">React</label>
    </div>

    <div>
      <input type="checkbox" data-checkbox id="vue"
             name="frameworks" value="vue" aria-checked="false" />
      <label data-checkbox-label for="vue">Vue</label>
    </div>

    <div>
      <input type="checkbox" data-checkbox id="svelte"
             name="frameworks" value="svelte" checked aria-checked="true" />
      <label data-checkbox-label for="svelte">Svelte</label>
    </div>
  </div>
</fieldset>`,
      css: `/* 체크박스 그룹 수직 배치 */
.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

/* 그룹 레이블 (legend 스타일) */
.checkbox-group-label {
  display: block;
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text);
  margin-bottom: var(--spacing-xs);
}

/* 수평 그룹 변형 */
.checkbox-group--inline {
  flex-direction: row;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  align-items: center;
}`,
      js: `// 선택된 값 수집
const checkboxes = document.querySelectorAll('[name="frameworks"]');

function getSelectedValues() {
  return Array.from(checkboxes)
    .filter(cb => cb.checked)
    .map(cb => cb.value);
}

checkboxes.forEach(cb => {
  cb.addEventListener('change', () => {
    cb.setAttribute('aria-checked', String(cb.checked));
    console.log('선택된 프레임워크:', getSelectedValues());
  });
});`,
    });

    // 섹션 3: Indeterminate
    this._initCodeBlock('checkbox-indeterminate', {
      html: `<!-- 부모 체크박스 (전체 선택/해제) -->
<div>
  <input
    type="checkbox"
    data-checkbox
    id="parent-checkbox"
    aria-checked="mixed"
    data-parent="my-children"
  />
  <label data-checkbox-label for="parent-checkbox" style="font-weight: 600;">
    전체 선택
  </label>
</div>

<!-- 자식 체크박스 그룹 -->
<div
  id="my-children"
  class="checkbox-group"
  role="group"
  aria-label="하위 항목 선택"
  style="padding-left: 26px; border-left: 2px solid var(--color-border); margin-left: 9px;"
>
  <div>
    <input type="checkbox" data-checkbox id="child-1"
           checked aria-checked="true" data-child-group="my-children" />
    <label data-checkbox-label for="child-1">항목 A</label>
  </div>

  <div>
    <input type="checkbox" data-checkbox id="child-2"
           checked aria-checked="true" data-child-group="my-children" />
    <label data-checkbox-label for="child-2">항목 B</label>
  </div>

  <div>
    <input type="checkbox" data-checkbox id="child-3"
           aria-checked="false" data-child-group="my-children" />
    <label data-checkbox-label for="child-3">항목 C</label>
  </div>
</div>`,
      css: `/* Indeterminate 상태: primary 배경 + 대시(-) 표시 */
input[type="checkbox"][data-checkbox][aria-checked="mixed"]
  + label[data-checkbox-label]::before {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
}

input[type="checkbox"][data-checkbox][aria-checked="mixed"]
  + label[data-checkbox-label]::after {
  width: 10px;
  height: 2px;
  border: none;
  background-color: #fff;
  border-radius: 1px;
  transform: translateX(4px) translateY(-50%);
  opacity: 1;
}`,
      js: `// 부모 체크박스 상태 업데이트
function updateParentState(parent, children) {
  const total = children.length;
  const checkedCount = Array.from(children).filter(c => c.checked).length;

  if (checkedCount === 0) {
    parent.indeterminate = false;
    parent.checked = false;
    parent.setAttribute('aria-checked', 'false');
  } else if (checkedCount === total) {
    parent.indeterminate = false;
    parent.checked = true;
    parent.setAttribute('aria-checked', 'true');
  } else {
    parent.indeterminate = true;
    parent.checked = false;
    parent.setAttribute('aria-checked', 'mixed');
  }
}

const parent = document.querySelector('#parent-checkbox');
const children = document.querySelectorAll('[data-child-group="my-children"]');

// 초기 indeterminate 설정 (aria-checked="mixed" 반영)
parent.indeterminate = true;

// 부모 클릭: 전체 토글
parent.addEventListener('change', () => {
  const shouldCheck = parent.indeterminate || !parent.checked;
  children.forEach(child => {
    child.checked = shouldCheck;
    child.setAttribute('aria-checked', String(shouldCheck));
  });
  parent.indeterminate = false;
  parent.checked = shouldCheck;
  parent.setAttribute('aria-checked', String(shouldCheck));
});

// 자식 변경: 부모 상태 재계산
children.forEach(child => {
  child.addEventListener('change', () => {
    child.setAttribute('aria-checked', String(child.checked));
    updateParentState(parent, children);
  });
});`,
    });

    // 섹션 4: Disabled Checkbox
    this._initCodeBlock('checkbox-disabled', {
      html: `<!-- 비활성 체크박스 (비체크) -->
<input
  type="checkbox"
  data-checkbox
  id="disabled-unchecked"
  disabled
  aria-disabled="true"
  aria-checked="false"
/>
<label data-checkbox-label for="disabled-unchecked">
  비활성 (비체크)
</label>

<!-- 비활성 체크박스 (체크됨) -->
<input
  type="checkbox"
  data-checkbox
  id="disabled-checked"
  checked
  disabled
  aria-disabled="true"
  aria-checked="true"
/>
<label data-checkbox-label for="disabled-checked">
  비활성 (체크됨)
</label>`,
      css: `/* 비활성 상태 레이블: opacity + cursor */
input[type="checkbox"][data-checkbox]:disabled
  + label[data-checkbox-label] {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

/* 비활성 + 체크 상태: 박스 배경 유지 */
input[type="checkbox"][data-checkbox]:disabled:checked
  + label[data-checkbox-label]::before {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
}`,
      js: `// 조건부 비활성화 토글 예시
const checkbox = document.querySelector('#my-checkbox');
const toggleBtn = document.querySelector('#toggle-disabled');

toggleBtn.addEventListener('click', () => {
  const isDisabled = checkbox.disabled;
  checkbox.disabled = !isDisabled;
  checkbox.setAttribute('aria-disabled', String(!isDisabled));
});`,
    });

    // 섹션 5: Label과 함께
    this._initCodeBlock('checkbox-label', {
      html: `<!-- label for + aria-describedby 접근성 패턴 -->
<!-- 이용약관 동의 (필수) -->
<div>
  <input
    type="checkbox"
    data-checkbox
    id="terms"
    aria-checked="false"
    aria-describedby="terms-desc"
    aria-required="true"
  />
  <label data-checkbox-label for="terms">
    이용약관에 동의합니다
    <span aria-hidden="true" style="color: var(--color-danger); font-weight: 600;">*</span>
  </label>
  <p class="checkbox-helper" id="terms-desc">
    서비스 이용을 위해 필수적으로 동의해야 합니다.
  </p>
</div>

<!-- 마케팅 수신 동의 (선택) -->
<div>
  <input
    type="checkbox"
    data-checkbox
    id="marketing"
    checked
    aria-checked="true"
    aria-describedby="marketing-desc"
  />
  <label data-checkbox-label for="marketing">
    마케팅 정보 수신 동의 (선택)
  </label>
  <p class="checkbox-helper" id="marketing-desc">
    이벤트, 혜택 정보를 이메일로 받아보실 수 있습니다.
  </p>
</div>`,
      css: `/* 헬퍼/설명 텍스트 */
.checkbox-helper {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0;
  margin-top: var(--spacing-xs);
}`,
      js: `// 필수 동의 항목 검증
const form = document.querySelector('form');

form.addEventListener('submit', (e) => {
  const required = form.querySelectorAll('[aria-required="true"]');
  let firstError = null;

  required.forEach(cb => {
    if (!cb.checked) {
      e.preventDefault();
      if (!firstError) firstError = cb;
    }
  });

  // 첫 번째 미동의 항목으로 포커스 이동
  if (firstError) {
    firstError.focus();
    console.warn('필수 동의 항목을 확인해 주세요.');
  }
});`,
    });
  }

  /**
   * 리소스 정리
   * - CodeBlock 인스턴스들 destroy()
   * - 부모 destroy()가 _eventListeners 일괄 제거
   */
  destroy() {
    if (this._codeBlocks && Array.isArray(this._codeBlocks)) {
      this._codeBlocks.forEach((cb) => {
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
   * InputDemo, ButtonDemo와 동일한 패턴
   * @param {string} sectionId - 섹션 ID (checkbox-basic 등)
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
