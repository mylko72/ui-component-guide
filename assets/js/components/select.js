/**
 * Select Component - WAI-ARIA Combobox 패턴 구현 (점진적 강화)
 *
 * 기능:
 * - 네이티브 <select>를 숨기고 커스텀 combobox/listbox UI로 강화
 * - Button 클릭으로 listbox 열기/닫기 (aria-expanded 토글)
 * - 키보드 네비게이션 (Arrow Down/Up: option 이동, Enter: 선택, Esc: 닫기)
 * - Typeahead: 글자 입력으로 option 자동 검색 및 하이라이트
 * - 선택 후 숨겨진 <select>.value 동기화 (form submit 정상 전송)
 * - 외부 클릭 시 listbox 자동 닫기
 * - 포커스가 컴포넌트 외부로 이동하면 listbox 닫기
 * - 비활성(disabled) select는 커스텀 UI 생성 안 함 (네이티브 그대로 유지)
 * - data-initialized로 중복 초기화 방지
 *
 * 점진적 강화 (Progressive Enhancement):
 * - JS 비활성화 시: 네이티브 <select> 그대로 동작 (form submission 정상)
 * - JS 활성화 후: 커스텀 role="combobox" 드롭다운 UI로 강화
 *
 * WAI-ARIA 참고: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
 * file:// 프로토콜 호환성: ES6 모듈 없음 (일반 스크립트)
 */

class Select {
  /**
   * Select 인스턴스 생성
   * @param {HTMLSelectElement} selectElement - [data-select] 네이티브 select 요소
   */
  constructor(selectElement) {
    // 네이티브 select 참조
    this.el = selectElement;

    // .select-wrap 래퍼 (커스텀 UI 삽입 기준 컨테이너)
    this.wrap = selectElement.closest('.select-wrap');

    // 커스텀 버튼 (combobox 역할)
    this.customButton = null;

    // 커스텀 listbox (ul)
    this.listbox = null;

    // 현재 listbox 열림 상태
    this.isOpen = false;

    // 현재 포커스/하이라이트된 option 인덱스 (커스텀 li 기준)
    this.activeIndex = -1;

    // Typeahead 검색 문자열 누적 버퍼
    this.typeaheadBuffer = '';

    // Typeahead 타이머 ID (일정 시간 후 버퍼 초기화)
    this.typeaheadTimer = null;

    // 외부 클릭 / 포커스아웃 핸들러 참조 (remove에 사용)
    this._boundHandlers = {};

    this._setup();
  }

  /**
   * public static init(container)
   * - container 내 모든 [data-select] 요소를 찾아 초기화
   * - disabled 상태이거나 .select-wrap 래퍼가 없는 경우 건너뜀
   * - data-initialized 속성으로 중복 초기화 방지
   * @param {Document|HTMLElement} container - 탐색 범위 (기본값: document)
   */
  static init(container = document) {
    container.querySelectorAll('select[data-select]').forEach(el => {
      // 이미 초기화된 요소는 건너뜀
      if (el.dataset.initialized) return;

      // disabled 상태의 select는 네이티브 그대로 유지
      if (el.disabled) return;

      // .select-wrap 래퍼가 없으면 커스텀 UI 생성 불가 → 건너뜀
      if (!el.closest('.select-wrap')) return;

      // 초기화 표시
      el.dataset.initialized = 'true';

      // Select 인스턴스 생성 (constructor에서 _setup 자동 호출)
      new Select(el);
    });
  }

  /**
   * 초기화: 커스텀 DOM 생성 → ARIA 설정 → 이벤트 등록
   */
  _setup() {
    this._buildCustomUI();
    this._bindEvents();
  }

  /* ============================================
     DOM 생성: 커스텀 combobox/listbox UI
     ============================================ */

  /**
   * 커스텀 UI 빌드
   * 1. 네이티브 <select> 시각적으로 숨김 (접근성 트리에서는 제거)
   * 2. 커스텀 button (combobox) 생성
   * 3. 커스텀 ul (listbox) + li (option) 목록 생성
   * 4. .select-wrap에 삽입
   */
  _buildCustomUI() {
    // 네이티브 <select> 숨김 처리
    // aria-hidden: 접근성 트리에서 제거 (커스텀 UI가 역할을 대신)
    // tabindex: -1: 탭 순서에서 제거
    this.el.style.display = 'none';
    this.el.setAttribute('aria-hidden', 'true');
    this.el.setAttribute('tabindex', '-1');

    // 고유 ID 생성 (aria-controls, aria-labelledby 연결용)
    const uid = 'select-' + Math.random().toString(36).slice(2, 9);
    const listboxId = uid + '-listbox';

    // 연결된 <label>의 id 탐색 (aria-labelledby 설정)
    const labelEl = this.el.id
      ? document.querySelector(`label[for="${this.el.id}"]`)
      : null;

    // 네이티브 select의 현재 선택값 텍스트
    const selectedText = this._getSelectedText();

    // ── 커스텀 버튼 (combobox) 생성 ──
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'select-custom__button';

    // ARIA: combobox 역할 — 입력값을 표시하고 팝업을 제어
    btn.setAttribute('role', 'combobox');
    btn.setAttribute('aria-haspopup', 'listbox');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', listboxId);

    // 네이티브 select의 aria-required / aria-describedby 상속
    const ariaRequired = this.el.getAttribute('aria-required');
    if (ariaRequired) btn.setAttribute('aria-required', ariaRequired);

    const ariaDescribedby = this.el.getAttribute('aria-describedby');
    if (ariaDescribedby) btn.setAttribute('aria-describedby', ariaDescribedby);

    const ariaInvalid = this.el.getAttribute('aria-invalid');
    if (ariaInvalid) btn.setAttribute('aria-invalid', ariaInvalid);

    // 라벨 연결: <label for="..."> 가 있으면 aria-labelledby로 연결
    if (labelEl) {
      if (!labelEl.id) {
        labelEl.id = uid + '-label';
      }
      btn.setAttribute('aria-labelledby', labelEl.id);
    } else if (this.el.getAttribute('aria-label')) {
      // aria-label 상속
      btn.setAttribute('aria-label', this.el.getAttribute('aria-label'));
    }

    // 네이티브 select의 data-size / data-error / data-success 상속
    const dataSize = this.el.dataset.size;
    if (dataSize) btn.dataset.size = dataSize;

    const dataError = this.el.dataset.error;
    if (dataError) btn.dataset.error = dataError;

    const dataSuccess = this.el.dataset.success;
    if (dataSuccess) btn.dataset.success = dataSuccess;

    // 버튼 내부: 선택 텍스트 span + 화살표 아이콘 span
    btn.innerHTML = `
      <span class="select-custom__value">${this._escapeHtml(selectedText)}</span>
      <span class="select-custom__arrow" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
             viewBox="0 0 24 24" fill="none" stroke="currentColor"
             stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
             aria-hidden="true" focusable="false">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </span>
    `;

    // ── 커스텀 listbox (ul) 생성 ──
    const listbox = document.createElement('ul');
    listbox.id = listboxId;
    listbox.className = 'select-custom__listbox';
    listbox.setAttribute('role', 'listbox');
    listbox.style.display = 'none';

    // listbox에 라벨 연결
    if (labelEl) {
      listbox.setAttribute('aria-labelledby', labelEl.id);
    }

    // 네이티브 <option> / <optgroup> 순회하여 커스텀 li 생성
    this._buildOptions(this.el, listbox);

    // .select-wrap에 커스텀 UI 삽입
    // .select-icon span은 커스텀 UI에서 arrow를 버튼 안에 직접 포함하므로 숨김
    const iconEl = this.wrap.querySelector('.select-icon');
    if (iconEl) iconEl.style.display = 'none';

    this.wrap.appendChild(btn);
    this.wrap.appendChild(listbox);

    // 인스턴스 참조 저장
    this.customButton = btn;
    this.listbox = listbox;

    // data-js-loaded 마커 (CSS에서 네이티브 스타일 숨기기 등 활용 가능)
    this.wrap.dataset.jsLoaded = 'true';
  }

  /**
   * 네이티브 select의 옵션 목록을 커스텀 listbox li 요소로 변환
   * optgroup도 그룹 레이블로 처리
   * @param {HTMLSelectElement} selectEl - 네이티브 select 요소
   * @param {HTMLUListElement} listbox - 커스텀 listbox 컨테이너
   */
  _buildOptions(selectEl, listbox) {
    Array.from(selectEl.children).forEach(child => {
      if (child.tagName === 'OPTGROUP') {
        // optgroup → 그룹 레이블 li 생성
        const groupLabelId = 'select-group-' + Math.random().toString(36).slice(2, 9);

        const groupLabel = document.createElement('li');
        groupLabel.className = 'select-custom__group-label';
        groupLabel.setAttribute('role', 'presentation');
        groupLabel.id = groupLabelId;
        groupLabel.textContent = child.label;
        listbox.appendChild(groupLabel);

        // optgroup 내 option 순회
        Array.from(child.children).forEach(opt => {
          const li = this._createOptionElement(opt, groupLabelId);
          listbox.appendChild(li);
        });
      } else if (child.tagName === 'OPTION') {
        // 최상위 option
        const li = this._createOptionElement(child, null);
        listbox.appendChild(li);
      }
    });
  }

  /**
   * 네이티브 <option> 요소로부터 커스텀 <li role="option"> 생성
   * @param {HTMLOptionElement} optionEl - 네이티브 option 요소
   * @param {string|null} groupLabelId - 소속 그룹 레이블 요소 id (없으면 null)
   * @returns {HTMLLIElement} 커스텀 option 요소
   */
  _createOptionElement(optionEl, groupLabelId) {
    const li = document.createElement('li');
    li.className = 'select-custom__option';
    li.setAttribute('role', 'option');
    li.setAttribute('tabindex', '-1');

    // 네이티브 option value를 data 속성에 저장
    li.dataset.value = optionEl.value;

    // 텍스트 내용
    li.textContent = optionEl.textContent.trim();

    // 비활성(disabled) option 처리
    if (optionEl.disabled) {
      li.setAttribute('aria-disabled', 'true');
      li.dataset.disabled = 'true';
    }

    // 선택됨 표시
    if (optionEl.selected) {
      li.setAttribute('aria-selected', 'true');
      li.dataset.selected = 'true';
    } else {
      li.setAttribute('aria-selected', 'false');
    }

    // 그룹 레이블 연결
    if (groupLabelId) {
      li.setAttribute('aria-describedby', groupLabelId);
    }

    return li;
  }

  /* ============================================
     이벤트 등록
     ============================================ */

  /**
   * 이벤트 핸들러 등록
   * - 버튼 클릭: listbox 토글
   * - 버튼 키다운: 키보드 네비게이션
   * - listbox 클릭: option 선택
   * - document 클릭: 외부 클릭 감지 (listbox 열릴 때 attach)
   * - wrap focusout: 포커스 이탈 감지
   */
  _bindEvents() {
    // 핸들러 참조 저장 (removeEventListener 사용을 위해)
    this._boundHandlers = {
      buttonClick: (e) => this._handleButtonClick(e),
      buttonKeydown: (e) => this._handleKeydown(e),
      listboxClick: (e) => this._handleListboxClick(e),
      listboxKeydown: (e) => this._handleKeydown(e),
      outsideClick: (e) => this._handleOutsideClick(e),
      focusout: (e) => this._handleFocusout(e),
    };

    // 버튼 이벤트
    this.customButton.addEventListener('click', this._boundHandlers.buttonClick);
    this.customButton.addEventListener('keydown', this._boundHandlers.buttonKeydown);

    // listbox 클릭 이벤트 (이벤트 위임)
    this.listbox.addEventListener('click', this._boundHandlers.listboxClick);
    this.listbox.addEventListener('keydown', this._boundHandlers.listboxKeydown);

    // 포커스 이탈 감지 (wrap 레벨에서 위임)
    this.wrap.addEventListener('focusout', this._boundHandlers.focusout);
  }

  /* ============================================
     listbox 열기/닫기
     ============================================ */

  /**
   * listbox 열기
   * - display: block 표시
   * - aria-expanded: true
   * - 현재 선택된 option으로 activeIndex 초기화
   * - 외부 클릭 감지 시작
   */
  _openListbox() {
    if (this.isOpen) return;
    this.isOpen = true;

    this.listbox.style.display = 'block';
    this.customButton.setAttribute('aria-expanded', 'true');
    this.wrap.classList.add('select-wrap--open');

    // 외부 클릭 감지 시작
    document.addEventListener('click', this._boundHandlers.outsideClick, true);

    // 현재 선택된 option으로 activeIndex 설정
    const options = this._getEnabledOptions();
    const allOptions = this._getAllOptions();

    // aria-selected="true"인 option 찾기
    const selectedLi = this.listbox.querySelector('[role="option"][aria-selected="true"]');
    if (selectedLi) {
      const enabledIndex = options.indexOf(selectedLi);
      this.activeIndex = enabledIndex >= 0 ? enabledIndex : 0;
    } else {
      this.activeIndex = options.length > 0 ? 0 : -1;
    }

    // 활성 option 하이라이트 및 스크롤
    if (this.activeIndex >= 0) {
      this._setActiveOption(this.activeIndex);
    }
  }

  /**
   * listbox 닫기
   * - display: none 숨김
   * - aria-expanded: false
   * - 활성 option 초기화
   * - 외부 클릭 감지 해제
   */
  _closeListbox() {
    if (!this.isOpen) return;
    this.isOpen = false;

    this.listbox.style.display = 'none';
    this.customButton.setAttribute('aria-expanded', 'false');
    this.wrap.classList.remove('select-wrap--open');

    // 외부 클릭 감지 해제
    document.removeEventListener('click', this._boundHandlers.outsideClick, true);

    // 모든 option의 active 상태 초기화
    this._clearActiveOption();
    this.activeIndex = -1;

    // Typeahead 버퍼 초기화
    this._clearTypeahead();
  }

  /**
   * listbox 토글 (열기 ↔ 닫기)
   */
  _toggleListbox() {
    if (this.isOpen) {
      this._closeListbox();
    } else {
      this._openListbox();
    }
  }

  /* ============================================
     option 포커스/활성화 관리
     ============================================ */

  /**
   * 활성화 가능한 option 목록 반환 (disabled, group-label 제외)
   * @returns {HTMLLIElement[]} 활성 option 배열
   */
  _getEnabledOptions() {
    return Array.from(
      this.listbox.querySelectorAll('[role="option"]:not([aria-disabled="true"])')
    );
  }

  /**
   * 모든 option 목록 반환 (disabled 포함, group-label 제외)
   * @returns {HTMLLIElement[]} 전체 option 배열
   */
  _getAllOptions() {
    return Array.from(this.listbox.querySelectorAll('[role="option"]'));
  }

  /**
   * 특정 인덱스의 option을 활성(하이라이트)으로 설정
   * - data-active 속성 추가 (CSS 스타일 대상)
   * - tabindex 0으로 변경 후 focus()
   * - 스크롤 위치 조정 (listbox가 열려 있을 때만)
   * @param {number} index - 활성화할 option 인덱스 (enabledOptions 기준)
   */
  _setActiveOption(index) {
    const options = this._getEnabledOptions();
    if (options.length === 0) return;

    // 인덱스 순환 처리
    const clampedIndex = (index + options.length) % options.length;
    this.activeIndex = clampedIndex;

    // 기존 active 초기화
    this._clearActiveOption();

    // 새 active 설정
    const target = options[clampedIndex];
    target.dataset.active = 'true';
    target.setAttribute('tabindex', '0');

    // 키보드 포커스 이동 (listbox 내부 키 입력을 listbox 이벤트로 처리)
    target.focus();

    // 스크롤 보정: option이 listbox 가시 영역 밖이면 스크롤
    this._scrollIntoView(target);
  }

  /**
   * 모든 option의 active 상태 초기화
   */
  _clearActiveOption() {
    this._getAllOptions().forEach(opt => {
      delete opt.dataset.active;
      opt.setAttribute('tabindex', '-1');
    });
  }

  /**
   * 특정 option이 listbox 가시 영역 내에 있도록 스크롤 조정
   * @param {HTMLLIElement} optionEl - 스크롤 대상 option 요소
   */
  _scrollIntoView(optionEl) {
    const listboxRect = this.listbox.getBoundingClientRect();
    const optRect = optionEl.getBoundingClientRect();

    if (optRect.bottom > listboxRect.bottom) {
      // 아래로 스크롤
      this.listbox.scrollTop += optRect.bottom - listboxRect.bottom;
    } else if (optRect.top < listboxRect.top) {
      // 위로 스크롤
      this.listbox.scrollTop -= listboxRect.top - optRect.top;
    }
  }

  /* ============================================
     option 선택 및 네이티브 <select> 동기화
     ============================================ */

  /**
   * option 선택
   * - 커스텀 UI 업데이트 (버튼 텍스트, aria-selected)
   * - 네이티브 <select>.value 동기화 (form submit 연동)
   * - change 이벤트 발행 (외부 리스너 연동)
   * - listbox 닫기
   * - 버튼으로 포커스 복귀
   * @param {HTMLLIElement} optionEl - 선택된 option li 요소
   */
  _selectOption(optionEl) {
    // disabled option은 선택 무시
    if (optionEl.dataset.disabled === 'true') return;

    const value = optionEl.dataset.value;
    const text = optionEl.textContent.trim();

    // 커스텀 버튼 텍스트 업데이트
    const valueSpan = this.customButton.querySelector('.select-custom__value');
    if (valueSpan) {
      valueSpan.textContent = text;
    }

    // aria-selected 업데이트: 모두 false → 선택된 것만 true
    this._getAllOptions().forEach(opt => {
      if (opt === optionEl) {
        opt.setAttribute('aria-selected', 'true');
        opt.dataset.selected = 'true';
      } else {
        opt.setAttribute('aria-selected', 'false');
        delete opt.dataset.selected;
      }
    });

    // 네이티브 <select>.value 동기화
    this.el.value = value;

    // change 이벤트 발행 (외부 리스너가 감지할 수 있도록)
    const changeEvent = new Event('change', { bubbles: true });
    this.el.dispatchEvent(changeEvent);

    // listbox 닫기
    this._closeListbox();

    // 버튼으로 포커스 복귀
    this.customButton.focus();
  }

  /* ============================================
     이벤트 핸들러
     ============================================ */

  /**
   * 버튼 클릭 핸들러
   */
  _handleButtonClick(e) {
    e.stopPropagation();
    this._toggleListbox();
  }

  /**
   * listbox 클릭 핸들러 (이벤트 위임)
   * - role="option"인 li 요소 클릭 시 option 선택
   * @param {MouseEvent} e - 클릭 이벤트
   */
  _handleListboxClick(e) {
    const optionEl = e.target.closest('[role="option"]');
    if (!optionEl) return;

    this._selectOption(optionEl);
  }

  /**
   * 통합 키보드 이벤트 핸들러
   * - 버튼과 listbox의 keydown 이벤트를 모두 처리
   * - 현재 포커스 위치(버튼/option)에 따라 다른 동작 수행
   * @param {KeyboardEvent} e - 키보드 이벤트
   */
  _handleKeydown(e) {
    const isOnButton = e.target === this.customButton;
    const isOnOption = e.target.closest('[role="option"]') !== null;

    switch (e.key) {
      /* ── 공통: Escape = listbox 닫기 + 버튼으로 포커스 복귀 ── */
      case 'Escape':
        if (this.isOpen) {
          e.preventDefault();
          this._closeListbox();
          this.customButton.focus();
        }
        break;

      /* ── 공통: Tab = listbox 닫기 (포커스는 자연스럽게 이동) ── */
      case 'Tab':
        this._closeListbox();
        break;

      /* ── Arrow Down: 다음 option으로 이동 ── */
      case 'ArrowDown':
        e.preventDefault();
        if (!this.isOpen) {
          // 버튼에서 ArrowDown → listbox 열기
          this._openListbox();
        } else {
          // listbox가 열려 있으면 다음 option
          const nextIndex = this.activeIndex + 1;
          this._setActiveOption(nextIndex);
        }
        break;

      /* ── Arrow Up: 이전 option으로 이동 ── */
      case 'ArrowUp':
        e.preventDefault();
        if (!this.isOpen) {
          // 버튼에서 ArrowUp → listbox 열기 후 마지막 option
          this._openListbox();
          const options = this._getEnabledOptions();
          if (options.length > 0) {
            this._setActiveOption(options.length - 1);
          }
        } else {
          // listbox가 열려 있으면 이전 option
          const prevIndex = this.activeIndex - 1;
          this._setActiveOption(prevIndex);
        }
        break;

      /* ── Home: 첫 번째 option으로 이동 ── */
      case 'Home':
        if (this.isOpen) {
          e.preventDefault();
          this._setActiveOption(0);
        }
        break;

      /* ── End: 마지막 option으로 이동 ── */
      case 'End':
        if (this.isOpen) {
          e.preventDefault();
          const opts = this._getEnabledOptions();
          this._setActiveOption(opts.length - 1);
        }
        break;

      /* ── Enter / Space: 선택 또는 listbox 열기 ── */
      case 'Enter':
        e.preventDefault();
        if (this.isOpen && isOnOption) {
          // listbox가 열려 있고 option에 포커스 → 선택
          const focused = this.listbox.querySelector('[role="option"][data-active="true"]');
          if (focused) this._selectOption(focused);
        } else if (isOnButton) {
          // 버튼에서 Enter → listbox 토글
          this._toggleListbox();
        }
        break;

      case ' ':
        if (isOnButton && !this.isOpen) {
          // 버튼에서 Space → listbox 열기
          e.preventDefault();
          this._openListbox();
        } else if (this.isOpen && isOnOption) {
          // option에서 Space → 선택
          e.preventDefault();
          const focused = this.listbox.querySelector('[role="option"][data-active="true"]');
          if (focused) this._selectOption(focused);
        }
        break;

      /* ── 기타 인쇄 가능한 문자: Typeahead 검색 ── */
      default:
        // 단일 글자 입력 (조합 중인 IME 문자는 제외)
        if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
          e.preventDefault();
          if (!this.isOpen) {
            this._openListbox();
          }
          this._handleTypeahead(e.key);
        }
        break;
    }
  }

  /**
   * 외부 클릭 핸들러 (capture phase에서 감지)
   * - 클릭 대상이 .select-wrap 내부가 아니면 listbox 닫기
   * @param {MouseEvent} e - 클릭 이벤트
   */
  _handleOutsideClick(e) {
    if (this.wrap.contains(e.target)) return;
    this._closeListbox();
  }

  /**
   * 포커스 이탈 핸들러 (focusout은 버블링됨)
   * - 포커스가 .select-wrap 외부로 이동하면 listbox 닫기
   * @param {FocusEvent} e - 포커스 이벤트
   */
  _handleFocusout(e) {
    // relatedTarget: 포커스가 이동하는 대상 (null이면 창 밖)
    const relatedTarget = e.relatedTarget;

    // 포커스가 wrap 내부로 이동하는 경우는 무시
    if (relatedTarget && this.wrap.contains(relatedTarget)) return;

    // wrap 외부로 포커스가 이동 → listbox 닫기
    if (this.isOpen) {
      this._closeListbox();
    }
  }

  /* ============================================
     Typeahead 검색
     ============================================ */

  /**
   * Typeahead: 입력된 글자로 option 자동 검색 및 하이라이트
   * - 같은 글자를 반복 입력하면 해당 글자로 시작하는 다음 option으로 이동 (순환)
   * - 다른 글자 입력 시 버퍼에 누적하여 접두어 검색
   * - 500ms 후 버퍼 자동 초기화
   * @param {string} char - 입력된 단일 문자
   */
  _handleTypeahead(char) {
    // 버퍼에 글자 추가
    this.typeaheadBuffer += char.toLowerCase();

    // 기존 타이머 초기화
    if (this.typeaheadTimer) {
      clearTimeout(this.typeaheadTimer);
    }

    // 500ms 후 버퍼 초기화
    this.typeaheadTimer = setTimeout(() => {
      this.typeaheadBuffer = '';
      this.typeaheadTimer = null;
    }, 500);

    const options = this._getEnabledOptions();
    if (options.length === 0) return;

    const buffer = this.typeaheadBuffer;

    // 단일 문자 반복 입력 감지 (예: 'aaaa' → 'a'만 반복)
    const isRepeating = buffer.split('').every(c => c === buffer[0]) && buffer.length > 1;

    // 검색 시작 인덱스
    // 반복 입력: 현재 activeIndex 다음부터 순환 검색
    // 첫 입력 / 다른 글자: 현재 activeIndex 다음부터 검색 (현재 포함)
    const startIndex = isRepeating
      ? (this.activeIndex + 1) % options.length
      : this.activeIndex;

    // 검색 문자열 결정
    const searchStr = isRepeating ? buffer[0] : buffer;

    // options를 startIndex부터 순환하여 searchStr로 시작하는 option 탐색
    for (let i = 0; i < options.length; i++) {
      const idx = (startIndex + i) % options.length;
      const text = options[idx].textContent.trim().toLowerCase();

      if (text.startsWith(searchStr)) {
        this._setActiveOption(idx);
        return;
      }
    }
    // 매칭 option 없으면 버퍼만 초기화
  }

  /**
   * Typeahead 버퍼 및 타이머 초기화
   */
  _clearTypeahead() {
    this.typeaheadBuffer = '';
    if (this.typeaheadTimer) {
      clearTimeout(this.typeaheadTimer);
      this.typeaheadTimer = null;
    }
  }

  /* ============================================
     유틸리티
     ============================================ */

  /**
   * 네이티브 <select>에서 현재 선택된 option의 텍스트를 반환
   * 선택된 option이 없으면 첫 번째 option 텍스트 반환
   * @returns {string} 선택된 option의 텍스트
   */
  _getSelectedText() {
    const selectedOption = this.el.options[this.el.selectedIndex];
    return selectedOption ? selectedOption.textContent.trim() : '';
  }

  /**
   * HTML 특수문자 이스케이프 (XSS 방지)
   * @param {string} str - 이스케이프할 문자열
   * @returns {string} 이스케이프된 문자열
   */
  _escapeHtml(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  /**
   * 인스턴스 정리 (이벤트 리스너 해제, 커스텀 UI 제거)
   * 동적으로 컴포넌트를 제거할 때 호출
   */
  destroy() {
    // 외부 클릭 감지 해제
    document.removeEventListener('click', this._boundHandlers.outsideClick, true);

    // 버튼 이벤트 해제
    if (this.customButton) {
      this.customButton.removeEventListener('click', this._boundHandlers.buttonClick);
      this.customButton.removeEventListener('keydown', this._boundHandlers.buttonKeydown);
      this.customButton.remove();
    }

    // listbox 이벤트 해제 및 제거
    if (this.listbox) {
      this.listbox.removeEventListener('click', this._boundHandlers.listboxClick);
      this.listbox.removeEventListener('keydown', this._boundHandlers.listboxKeydown);
      this.listbox.remove();
    }

    // wrap 이벤트 해제
    this.wrap.removeEventListener('focusout', this._boundHandlers.focusout);

    // .select-icon 원복
    const iconEl = this.wrap.querySelector('.select-icon');
    if (iconEl) iconEl.style.display = '';

    // 네이티브 <select> 원복
    this.el.style.display = '';
    this.el.removeAttribute('aria-hidden');
    this.el.removeAttribute('tabindex');

    // wrap 상태 초기화
    delete this.wrap.dataset.jsLoaded;
    this.wrap.classList.remove('select-wrap--open');

    // 초기화 상태 초기화 (재초기화 가능하게)
    delete this.el.dataset.initialized;

    // Typeahead 정리
    this._clearTypeahead();
  }
}

/**
 * DOMContentLoaded 이벤트에서 자동 초기화
 * - 페이지 로드 완료 후 모든 Select 컴포넌트 초기화
 */
document.addEventListener('DOMContentLoaded', () => {
  Select.init();
});
