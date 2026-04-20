# Input 컴포넌트 E2E 테스트 시나리오

## 개요
Input 컴포넌트의 모든 변형(Default, Label & Helper, Error State, Leading Icon, Trailing Icon, Password Toggle, Disabled)과 상호작용(텍스트 입력, 비밀번호 토글), 접근성(ARIA, 포커스 링)을 검증합니다.

---

## 시나리오 1: 페이지 로드 및 렌더링
**목표**: Input 상세 페이지가 올바르게 로드되고 제목/설명이 표시됨

### 단계
1. `/#/input` 경로로 이동
2. 페이지 로드 완료 대기 (networkidle)
3. h1 제목 확인: "Input"
4. 설명 텍스트 확인: "사용자 텍스트 입력..." 포함

### 예상 결과
- 제목: "Input"
- 설명: 라벨, 헬퍼, 에러 메시지, 아이콘 관련 설명 포함
- DetailPage 레이아웃: 사이드바 + 메인 콘텐츠 표시

---

## 시나리오 2: 모든 Input 변형 렌더링
**목표**: 7개 섹션의 모든 입력 변형이 정상 렌더링됨

### 단계
1. 페이지 로드 완료
2. 각 섹션별 input 확인:
   - Default Input: 3개 (sm, md, lg 크기)
   - With Label & Helper: 1개 (라벨 + 헬퍼 텍스트)
   - Error State: 1개 (에러 메시지 포함)
   - Leading Icon: 1개 (좌측 아이콘)
   - Trailing Icon: 1개 (우측 아이콘 + 성공 상태)
   - Password Toggle: 1개 (비밀번호 토글 버튼)
   - Disabled Input: 1개 (비활성 상태)

### 예상 결과
- 모든 input이 DOM에 존재
- input[data-input] 속성 정확함
- data-size="sm|md|lg" 속성 정확
- data-error="true" 에러 상태 올바름
- 텍스트 입력 불가능하지 않음 (placeholder 보임)

---

## 시나리오 3: 텍스트 입력 및 폼 기능
**목표**: Input에 텍스트를 입력하고 값이 반영됨

### 단계
1. Default md input에 포커스
2. "안녕하세요" 입력
3. input.value 확인
4. Label & Helper 섹션의 input에 텍스트 입력
5. 값 확인

### 예상 결과
- 입력된 텍스트 정상 표시
- placeholder 텍스트 숨겨짐
- input 값 변경 반영
- 콘솔 에러 없음

---

## 시나리오 4: 에러 상태 및 ARIA 속성
**목표**: Error State input이 올바른 ARIA 속성을 가짐

### 단계
1. Error State 섹션의 input 찾기
2. data-error="true" 속성 확인
3. aria-invalid="true" 확인
4. aria-describedby 확인 (에러 메시지 ID와 연결)
5. role="alert" 에러 메시지 확인

### 예상 결과
- data-error="true" 속성 존재
- aria-invalid="true" 설정됨
- aria-describedby로 에러 메시지 ID 연결
- 에러 메시지: role="alert" 및 빨간색 표시
- 포커스 링: 빨간색 (danger color)

---

## 시나리오 5: 비밀번호 토글 기능
**목표**: Password Toggle input의 비밀번호 표시/숨김 전환 동작

### 단계
1. Password Toggle 섹션의 input 찾기 (type="password")
2. 초기 상태: input[type="password"] 확인
3. 토글 버튼 클릭
4. input[type="text"]로 변경되고 텍스트 표시 확인
5. 다시 토글 버튼 클릭
6. input[type="password"]로 복원 확인

### 예상 결과
- 초기: type="password"
- 토글 후: type="text" + 텍스트 표시
- 토글 버튼: aria-pressed="true|false" 토글
- 아이콘: eye-off ↔ eye로 교체
- aria-label 업데이트 (예: "비밀번호 표시" ↔ "비밀번호 숨김")

---

## 시나리오 6: 아이콘 Input (Leading / Trailing)
**목표**: Leading/Trailing 아이콘이 올바르게 배치되고 접근성 확보

### 단계
1. Leading Icon 섹션: .input-icon--leading 아이콘 확인
2. input[data-icon="leading"] 속성 확인
3. Trailing Icon 섹션: .input-icon--trailing 아이콘 확인
4. input[data-icon="trailing"] 속성 확인
5. 성공 상태 아이콘 (.input-icon--success) 확인

### 예상 결과
- Leading 아이콘: input 좌측에 배치 (padding-left: 38px)
- Trailing 아이콘: input 우측에 배치 (padding-right: 38px)
- 아이콘: aria-hidden="true" (장식용)
- pointer-events: none (클릭 무시)
- 텍스트 입력: 아이콘과 겹치지 않음

---

## 시나리오 7: Label & Helper 텍스트 (접근성)
**목표**: Label과 Helper 텍스트가 input과 올바르게 연결됨

### 단계
1. Label & Helper 섹션 찾기
2. <label for="input-id"> 확인
3. input id="input-id" 확인 (일치)
4. aria-describedby 확인 (helper ID와 연결)
5. aria-required="true" (필수 입력) 확인

### 예상 결과
- <label for> 속성이 input id와 일치
- aria-describedby로 helper 텍스트 ID 연결
- aria-required="true" 필수 표시
- 스크린리더: "메일 주소, 필수 입력, example@example.com 포함" 읽음

---

## 시나리오 8: Disabled Input
**목표**: Disabled input이 비활성 상태로 표시되고 클릭 불가

### 단계
1. Disabled Input 섹션 찾기
2. disabled 속성 확인
3. pointer-events: none 확인 (CSS)
4. input 클릭 시도
5. 텍스트 입력 시도

### 예상 결과
- disabled 속성 존재
- opacity: 0.5 (반투명)
- pointer-events: none (클릭 불가)
- 커서: not-allowed
- 배경: color-bg-secondary
- 클릭 이벤트 발생 안 함

---

## 시나리오 9: 키보드 네비게이션
**목표**: 키보드만으로 모든 input 순회 및 조작 가능

### 단계
1. Tab 키로 첫 번째 input에 포커스
2. Tab 키로 다음 input으로 이동
3. Shift+Tab으로 이전 input으로 이동
4. 각 input에 텍스트 입력
5. Password input: Space/Enter로 토글 버튼 활성화

### 예상 결과
- 모든 input에 포커스 가능 (disabled 제외)
- Tab 순서가 논리적 (위에서 아래로)
- 포커스 링(outline: 2px solid) 표시
- 텍스트 입력 정상
- Disabled input: Tab 불가능

---

## 시나리오 10: Focus Ring (WCAG 2.2)
**목표**: 포커스 상태가 명확하게 표시됨

### 단계
1. Tab 키로 input에 포커스
2. outline: 2px solid var(--color-primary) 확인
3. box-shadow 포커스 glow 확인
4. border-color 변경 확인
5. 에러 상태 input: 빨간색 포커스 링 확인

### 예상 결과
- 포커스 링: 2px 외곽선
- 색상: primary (일반) 또는 danger (에러)
- 명도 대비: 최소 4.5:1
- 라이트/다크 모드 모두 명확함
- outline-offset: 0px

---

## 시나리오 11: 다크/라이트 모드 전환
**목표**: 테마 전환 시 input 색상 자동 변경

### 단계
1. 라이트 모드 상태 확인 (배경: white, 텍스트: black)
2. 테마 토글 버튼 클릭
3. 다크 모드 전환 확인 (기다림)
4. 모든 input 색상 변경 확인
5. 포커스 링 색상 확인

### 예상 결과
- CSS 변수 자동 적용 (--color-bg, --color-text 등)
- border-color 변경 (라이트: #e5e7eb → 다크: #374151)
- 포커스 glow: box-shadow 조정 (투명도 0.15 → 0.2)
- 명도 대비 유지 (4.5:1+)

---

## 시나리오 12: DetailPage 네비게이션
**목표**: 사이드바에서 Input이 활성 상태 표시

### 단계
1. DetailPage 로드
2. 사이드바에서 Input 항목 찾기
3. 활성 상태 확인 (aria-current="page" 또는 .active 클래스)
4. 텍스트 색상: primary color 확인

### 예상 결과
- Input 네비게이션 항목 활성 표시
- 텍스트 색상: var(--color-primary)
- 텍스트 스타일: bold 또는 강조
- 다른 항목과 명확한 구분

---

## 시나리오 13: 반응형 설계
**목표**: 360px ~ 1440px 뷰포트에서 정상 표시

### 단계
1. 모바일 (360px): input 너비 100%, padding 조정 확인
2. 태블릿 (768px): 레이아웃 전환 확인
3. 데스크톱 (1440px): 최대 너비 1400px 유지 확인

### 예상 결과
- 모든 크기에서 가로 스크롤 없음
- sm 크기: 모바일에서 min-height 44px
- padding: 모바일에서 좌우 12px
- 터치 타겟: 최소 44px × 44px

---

## 시나리오 14: 코드 블록 및 문서화
**목표**: 각 섹션의 HTML/CSS/JS 코드 블록이 표시되고 복사 가능

### 단계
1. 각 섹션의 CodeBlock 찾기
2. 탭 (HTML / CSS / JS) 확인
3. 코드 복사 버튼 클릭
4. 코드가 클립보드에 복사됨 확인

### 예상 결과
- 3개 탭: HTML, CSS, JS
- 각 탭별 코드 정상 표시
- 복사 버튼 (아이콘 또는 텍스트)
- 복사 후 토스트/알림 표시

---

## Playwright 테스트 실행 방법

### 설치
```bash
npm install -D @playwright/test
```

### 테스트 실행
```bash
# 모든 테스트 실행
npx playwright test tests/e2e/input.spec.js

# 특정 테스트만 실행
npx playwright test tests/e2e/input.spec.js -g "페이지 로드"

# UI 모드로 실행 (디버깅용)
npx playwright test tests/e2e/input.spec.js --ui

# 헤드풀 모드 (브라우저 표시)
npx playwright test tests/e2e/input.spec.js --headed
```

---

## 접근성 검증 체크리스트

- [ ] 모든 input이 Tab 키로 순회 가능 (disabled 제외)
- [ ] 포커스 링이 명확하게 표시됨 (2px, 명도 대비 4.5:1+)
- [ ] <label for> 연결 (Label & Helper 섹션)
- [ ] aria-describedby (Helper + 에러 메시지)
- [ ] aria-invalid="true" (에러 상태)
- [ ] aria-required="true" (필수 입력)
- [ ] 비밀번호 토글: aria-pressed, aria-label 업데이트
- [ ] Disabled input: 비활성 상태 명확 (opacity 0.5)
- [ ] 색상 명도 대비: 최소 4.5:1
- [ ] role="alert" 에러 메시지
- [ ] 키보드 조작: Tab, Shift+Tab, 텍스트 입력, 토글

---

## 성능 기준

- 페이지 로드: < 2초 (네트워크 포함)
- input 포커스: < 50ms
- 텍스트 입력 응답: < 100ms
- 테마 전환: < 500ms
- 비밀번호 토글: < 200ms
- 포커스 링 렌더링: 재계산 없음 (이미 렌더링된 상태)

---

## 버전 정보

- 프로젝트: Web UI Component Guide v1.0
- 테스트 프레임워크: Playwright 1.40+
- 날짜: 2026-04-20
- 작성자: Claude Code
