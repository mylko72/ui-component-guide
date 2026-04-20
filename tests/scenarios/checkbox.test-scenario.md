# Checkbox 컴포넌트 E2E 테스트 시나리오

## 개요
Checkbox 컴포넌트의 모든 변형(기본, 그룹, Indeterminate, Disabled)과 상호작용(클릭, 키보드), 접근성(ARIA, 포커스 링)을 검증합니다.

---

## 시나리오 1: 페이지 로드 및 렌더링
**목표**: Checkbox 상세 페이지가 올바르게 로드되고 제목/설명이 표시됨

### 단계
1. `/#/checkbox` 경로로 이동
2. 페이지 로드 완료 대기 (networkidle)
3. h1 제목 확인: "Checkbox"
4. 설명 텍스트 확인: "단일, 그룹, Indeterminate..." 포함

### 예상 결과
- 제목: "Checkbox"
- 설명: 단일, 그룹, Indeterminate 상태 관련 설명 포함
- DetailPage 레이아웃: 사이드바 + 메인 콘텐츠 표시

---

## 시나리오 2: 모든 Checkbox 변형 렌더링
**목표**: 5개 섹션의 모든 체크박스 변형이 정상 렌더링됨

### 단계
1. 페이지 로드 완료
2. 각 섹션별 체크박스 확인:
   - Basic Checkbox: 1개 (비체크 상태)
   - Checkbox Group: 3개 (fieldset + legend)
   - Indeterminate: 1개(부모) + 3개(자식)
   - Disabled Checkbox: 2개 (비체크/체크)
   - Label과 함께: 1개 (label 포함)

### 예상 결과
- 모든 체크박스가 DOM에 존재
- input[type="checkbox"] 숨겨짐 (시각적으로)
- label::before로 커스텀 박스 표시
- legend 텍스트 표시 (그룹 제목)
- aria-checked 속성 정확함

---

## 시나리오 3: 기본 체크박스 클릭
**목표**: Basic Checkbox를 클릭하여 상태 변경

### 단계
1. Basic Checkbox 섹션의 체크박스 찾기
2. 초기 상태: aria-checked="false"
3. 체크박스 클릭
4. 상태 변경 확인: aria-checked="true"
5. 다시 클릭하여 해제 확인

### 예상 결과
- 클릭 시 checked 상태 토글
- label::before 배경: 체크 시 primary 색상
- label::after 체크마크(✓) 표시
- aria-checked 속성 업데이트
- 콘솔 에러 없음

---

## 시나리오 4: 체크박스 그룹
**목표**: 여러 체크박스가 독립적으로 작동

### 단계
1. Checkbox Group 섹션의 3개 체크박스 찾기
2. legend 텍스트 확인: "기능 선택"
3. 첫 번째 체크박스 클릭 (체크)
4. 두 번째 체크박스 클릭 (체크)
5. 첫 번째 다시 클릭 (해제)

### 예상 결과
- 각 체크박스가 독립적으로 작동
- 다른 체크박스에 영향 없음
- 모든 상태가 aria-checked에 반영
- fieldset 시각적 그룹화 (border 또는 spacing)

---

## 시나리오 5: Indeterminate 상태
**목표**: 부모-자식 체크박스의 혼합 상태 동작

### 단계
1. Indeterminate 섹션 찾기
2. 부모 체크박스의 초기 상태: aria-checked="mixed"
3. 대시(-) 표시 확인 (::after)
4. 첫 번째 자식 클릭 (체크)
5. 모든 자식 체크 (3개 모두)
6. 부모의 상태 변경 확인

### 예상 결과
- 초기: 부모 aria-checked="mixed", 자식 2개는 true, 1개는 false
- 자식 변경 감지 → 부모 상태 자동 업데이트
- 모두 체크 시: 부모 aria-checked="true"
- 모두 해제 시: 부모 aria-checked="false"
- 일부만 체크: 부모 aria-checked="mixed"

---

## 시나리오 6: Disabled 체크박스
**목표**: Disabled 체크박스가 클릭 불가능

### 단계
1. Disabled Checkbox 섹션 찾기
2. 첫 번째 disabled 체크박스 (비체크) 클릭 시도
3. 두 번째 disabled 체크박스 (체크) 클릭 시도
4. opacity 확인
5. cursor: not-allowed 확인

### 예상 결과
- disabled 속성 존재
- aria-disabled="true" 설정됨
- opacity: 0.5 (반투명)
- pointer-events: none (클릭 무시)
- 커서: not-allowed
- 상태 변경 없음

---

## 시나리오 7: 키보드 네비게이션 및 Space 토글
**목표**: 키보드만으로 체크박스 조작 가능

### 단계
1. Tab 키로 첫 번째 체크박스에 포커스
2. Tab 키로 다음 체크박스로 이동
3. Shift+Tab으로 이전 체크박스로 이동
4. Space 키로 포커스된 체크박스 토글
5. 다시 Space로 토글 해제

### 예상 결과
- 모든 체크박스에 포커스 가능 (disabled 제외)
- Tab 순서가 논리적 (위에서 아래로)
- 포커스 링(outline: 2px solid) 표시
- Space 키로 checked 상태 토글
- Disabled 체크박스: Tab 불가능

---

## 시나리오 8: 포커스 링 (WCAG 2.2)
**목표**: 포커스 상태가 명확하게 표시됨

### 단계
1. Tab 키로 체크박스에 포커스
2. outline: 2px solid var(--color-primary) 확인
3. box-shadow 포커스 glow 확인
4. label::before 주변 outline 표시 확인

### 예상 결과
- 포커스 링: 2px 외곽선
- 색상: primary color
- 명도 대비: 최소 4.5:1
- 라이트/다크 모드 모두 명확함
- label::before가 포커스 대상 (input 숨겨짐)

---

## 시나리오 9: Label 연결 (접근성)
**목표**: Label과 Checkbox가 올바르게 연결됨

### 단계
1. Label과 함께 섹션 찾기
2. <label for="checkbox-id"> 확인
3. input id="checkbox-id" 확인 (일치)
4. aria-describedby 확인 (설명 텍스트 ID)
5. 필수 표시(*) 확인

### 예상 결과
- <label for> 속성이 input id와 일치
- aria-describedby로 설명 텍스트 ID 연결
- 필수 표시: <span class="input-required">*</span>
- 스크린리더: "이메일 수신, 필수 입력" 읽음

---

## 시나리오 10: 다크/라이트 모드 전환
**목표**: 테마 전환 시 체크박스 색상 자동 변경

### 단계
1. 라이트 모드 상태 확인
2. 테마 토글 버튼 클릭
3. 다크 모드 전환 확인 (기다림)
4. 모든 체크박스 색상 변경 확인
5. 포커스 링 색상 확인

### 예상 결과
- CSS 변수 자동 적용
- label::before border-color 변경
- label::before 체크 시 background-color 변경
- 포커스 glow: box-shadow 조정 (투명도 변화)
- 명도 대비 유지 (4.5:1+)

---

## 시나리오 11: DetailPage 네비게이션
**목표**: 사이드바에서 Checkbox가 활성 상태 표시

### 단계
1. DetailPage 로드
2. 사이드바에서 Checkbox 항목 찾기
3. 활성 상태 확인 (aria-current="page" 또는 .active 클래스)

### 예상 결과
- Checkbox 네비게이션 항목 활성 표시
- 텍스트 색상: var(--color-primary)
- 다른 항목과 명확한 구분

---

## 시나리오 12: 반응형 설계
**목표**: 360px ~ 1440px 뷰포트에서 정상 표시

### 단계
1. 모바일 (360px): label::before 18px, 터치 타겟 44px 확인
2. 태블릿 (768px): 레이아웃 전환 확인
3. 데스크톱 (1440px): 최대 너비 1400px 유지 확인

### 예상 결과
- 모든 크기에서 가로 스크롤 없음
- 터치 타겟: 최소 44px × 44px
- 체크박스 박스: 18px × 18px (모든 크기)
- label 텍스트: 레이아웃 깨짐 없음

---

## 시나리오 13: 코드 블록 및 문서화
**목표**: 각 섹션의 HTML/CSS/JS 코드 블록이 표시되고 복사 가능

### 단계
1. 각 섹션의 CodeBlock 찾기
2. 탭 (HTML / CSS / JS) 확인
3. 코드 복사 버튼 클릭
4. 코드가 클립보드에 복사됨 확인

### 예상 결과
- 3개 탭: HTML, CSS, JS
- 각 탭별 코드 정상 표시
- 복사 버튼 클릭 후 토스트/알림 표시

---

## Playwright 테스트 실행 방법

### 설치
```bash
npm install -D @playwright/test
```

### 테스트 실행
```bash
# 모든 테스트 실행
npx playwright test tests/e2e/checkbox.spec.js

# 특정 테스트만 실행
npx playwright test tests/e2e/checkbox.spec.js -g "기본 체크박스"

# UI 모드로 실행 (디버깅용)
npx playwright test tests/e2e/checkbox.spec.js --ui

# 헤드풀 모드 (브라우저 표시)
npx playwright test tests/e2e/checkbox.spec.js --headed
```

---

## 접근성 검증 체크리스트

- [ ] 모든 체크박스가 Tab 키로 순회 가능 (disabled 제외)
- [ ] 포커스 링이 명확하게 표시됨 (2px, 명도 대비 4.5:1+)
- [ ] <label for> 연결 (Label과 함께 섹션)
- [ ] aria-describedby (설명 텍스트)
- [ ] aria-checked="true|false|mixed" 정확함
- [ ] Indeterminate: aria-checked="mixed" 자동 업데이트
- [ ] Disabled 체크박스: 비활성 상태 명확 (opacity 0.5)
- [ ] 색상 명도 대비: 최소 4.5:1
- [ ] role="checkbox" (암묵적, input:checked 표시)
- [ ] 키보드 조작: Tab, Shift+Tab, Space 토글
- [ ] legend (그룹 제목)

---

## 성능 기준

- 페이지 로드: < 2초 (네트워크 포함)
- 체크박스 클릭: < 50ms
- 상태 변경 렌더링: < 100ms
- Indeterminate 업데이트: < 150ms
- 테마 전환: < 500ms
- 포커스 링 렌더링: 재계산 없음

---

## 버전 정보

- 프로젝트: Web UI Component Guide v1.0
- 테스트 프레임워크: Playwright 1.40+
- 날짜: 2026-04-20
- 작성자: Claude Code
