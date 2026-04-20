# Button 컴포넌트 E2E 테스트 시나리오

## 개요
Button 컴포넌트의 모든 변형(Primary, Secondary, Outline, Ghost, Danger, Icon, Loading, Disabled)과 상호작용(클릭, 키보드 네비게이션), 접근성(ARIA, 포커스 링)을 검증합니다.

---

## 시나리오 1: 페이지 로드 및 렌더링
**목표**: Button 상세 페이지가 올바르게 로드되고 제목/설명이 표시됨

### 단계
1. `/#/button` 경로로 이동
2. 페이지 로드 완료 대기 (networkidle)
3. h1 제목 확인: "Button"
4. 설명 텍스트 확인: "사용자 액션을 트리거하는..." 포함

### 예상 결과
- 제목: "Button"
- 설명: 변형, 크기, 상태 관련 설명 포함
- DetailPage 레이아웃: 사이드바 + 메인 콘텐츠 표시

---

## 시나리오 2: 모든 버튼 변형 렌더링
**목표**: 8개 섹션의 모든 버튼 변형이 정상 렌더링됨

### 단계
1. 페이지 로드 완료
2. 각 변형별 버튼 수 확인:
   - Primary: 3개 (sm, md, lg)
   - Secondary: 3개
   - Outline: 3개
   - Ghost: 3개
   - Danger: 3개
   - Icon: 6개+
   - Loading: 3개+
   - Disabled: 3개+

### 예상 결과
- 모든 변형이 DOM에 존재
- 각 변형의 data-variant, data-size 속성 정확함
- 색상 표시 정상

---

## 시나리오 3: 클릭 상호작용
**목표**: 버튼 클릭 시 예상된 상호작용 동작

### 단계
1. Primary md 버튼 클릭
2. 콘솔 에러 확인
3. Secondary 버튼 클릭
4. Danger 버튼 클릭

### 예상 결과
- 클릭 이벤트 정상 처리
- 콘솔 에러 없음
- pointer-events 정상 작동

---

## 시나리오 4: 키보드 네비게이션
**목표**: 키보드만으로 모든 버튼 조작 가능

### 단계
1. Tab 키로 첫 번째 버튼에 포커스
2. Tab 키로 다음 버튼으로 이동
3. Shift+Tab으로 이전 버튼으로 이동
4. Space 키로 포커스된 버튼 활성화
5. Enter 키로 포커스된 버튼 활성화

### 예상 결과
- 모든 버튼에 포커스 가능
- Tab 순서가 논리적 (좌→우, 위→아래)
- Space/Enter로 클릭 이벤트 발생
- 포커스 링(outline) 표시

---

## 시나리오 5: Disabled 버튼
**목표**: Disabled 버튼이 클릭 불가능

### 단계
1. Disabled 버튼에 포커스
2. Disabled 버튼 클릭 시도
3. Space/Enter 키 입력

### 예상 결과
- disabled 속성 확인
- pointer-events: none 적용
- 클릭 이벤트 발생 안 함
- 반투명 표시 (opacity: 0.5)

---

## 시나리오 6: Icon 버튼 접근성
**목표**: Icon 버튼에 aria-label이 올바르게 설정됨

### 단계
1. 모든 Icon 버튼 찾기
2. 각 Icon 버튼의 aria-label 확인
3. 스크린리더 테스트 (선택사항)

### 예상 결과
- 모든 Icon 버튼에 aria-label 존재
- aria-label 텍스트 의미 명확 (예: "검색", "삭제")
- 아이콘 <i> 요소에 aria-hidden="true"

---

## 시나리오 7: Focus Ring (WCAG 2.2)
**목표**: 포커스 상태가 명확하게 표시됨

### 단계
1. Tab 키로 버튼에 포커스
2. 포커스 링 시각 확인
3. 포커스 링 색상/스타일 검증

### 예상 결과
- 포커스 링: 2px 외곽선
- 색상: 명확한 명도 대비 (최소 4.5:1)
- 라이트/다크 모드 모두 표시

---

## 시나리오 8: 다크/라이트 모드 전환
**목표**: 테마 전환 시 버튼 색상 자동 변경

### 단계
1. 라이트 모드 상태 확인
2. 테마 토글 버튼 클릭
3. 다크 모드 전환 확인 (기다림)
4. 모든 버튼 색상 변경 확인

### 예상 결과
- CSS 변수 자동 적용
- 모든 변형의 색상 변경
- 명도 대비 유지 (4.5:1+)

---

## 시나리오 9: Loading 상태
**목표**: Loading 버튼이 올바르게 표시되고 스피너 애니메이션 동작

### 단계
1. Loading 버튼 찾기 (data-loading="true")
2. aria-busy="true" 확인
3. 스피너 애니메이션 시각 확인

### 예상 결과
- aria-busy="true" 설정
- 스피너 아이콘 회전 애니메이션
- cursor: wait 적용

---

## 시나리오 10: DetailPage 네비게이션
**목표**: 사이드바에서 Button이 활성 상태 표시

### 단계
1. DetailPage 로드
2. 사이드바에서 Button 항목 찾기
3. 활성 상태 확인 (aria-current="page" 또는 .active 클래스)

### 예상 결과
- Button 네비게이션 항목 활성 표시
- 텍스트 색상: primary color
- 텍스트 스타일: bold

---

## Playwright 테스트 실행 방법

### 설치
```bash
npm install -D @playwright/test
```

### 테스트 실행
```bash
# 모든 테스트 실행
npx playwright test tests/e2e/button.spec.js

# 특정 테스트만 실행
npx playwright test tests/e2e/button.spec.js -g "페이지 로드"

# UI 모드로 실행 (디버깅용)
npx playwright test tests/e2e/button.spec.js --ui

# 헤드풀 모드 (브라우저 표시)
npx playwright test tests/e2e/button.spec.js --headed
```

---

## 접근성 검증 체크리스트

- [ ] 모든 버튼이 Tab 키로 순회 가능
- [ ] 포커스 링이 명확하게 표시됨
- [ ] Icon 버튼에 aria-label 존재
- [ ] Disabled 버튼이 비활성 상태 표시
- [ ] 색상 명도 대비: 최소 4.5:1
- [ ] 로딩 상태: aria-busy="true"
- [ ] 세 가지 이상의 방법으로 버튼 활성화 가능 (클릭, Enter, Space)

---

## 성능 기준

- 페이지 로드: < 2초 (네트워크 포함)
- 버튼 클릭 응답: < 100ms
- 테마 전환: < 500ms
- 포커스 링 렌더링: 재계산 없음 (이미 렌더링된 상태)

---

## 버전 정보

- 프로젝트: Web UI Component Guide v1.0
- 테스트 프레임워크: Playwright 1.40+
- 날짜: 2026-04-20
- 작성자: Claude Code
