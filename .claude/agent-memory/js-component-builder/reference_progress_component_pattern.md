---
name: Progress 컴포넌트 패턴
description: WAI-ARIA progressbar 패턴, CSS 변수(--progress-value) 진행률 제어, 인스턴스 메서드 API 구현 레퍼런스
type: reference
---

## HTML 구조

```html
<div class="progress-wrapper">
  <div class="progress-header">
    <span class="progress-label" id="lbl-1">라벨</span>
    <span class="progress-value-text" aria-hidden="true">75%</span>
  </div>
  <div
    class="progress"
    data-component="progress"
    data-progress="75"
    role="progressbar"
    aria-valuenow="75"
    aria-valuemin="0"
    aria-valuemax="100"
    aria-labelledby="lbl-1"
  >
    <div class="progress__bar" style="--progress-value: 75;"></div>
  </div>
</div>
```

## 핵심 패턴

### CSS 변수 너비 제어
- `.progress__bar { width: calc(var(--progress-value, 0) * 1%); }` — JS 없을 때도 style 속성의 --progress-value로 동작
- 점진적 강화: style="--progress-value: 75;" 마크업만으로 CSS가 바 너비 제어

### JS 인스턴스 접근
- `el._progressInstance` — Progress.init() 후 요소에 인스턴스 저장
- `setValue(value)`: 0~100 클램핑, indeterminate 자동 해제, aria-valuenow + data-progress + CSS 변수 동시 업데이트
- `getValue()`: 현재 값 반환
- `increment(amount=10)` / `decrement(amount=10)`: 상대 조작
- `complete()` / `reset()`: 100/0으로 설정
- `setIndeterminate(force?)`: 불확정 상태 토글 (aria-valuenow 제거, 애니메이션 추가)

### 초기값 읽기 우선순위
data-progress > aria-valuenow > .progress__bar style의 --progress-value > 0

### 비활성 상태
- `aria-disabled="true"` → opacity 0.4, 바 회색 처리
- .progress-wrapper에 적용 시 라벨/텍스트까지 함께 흐릿해짐

### Indeterminate 애니메이션
- `.progress--indeterminate .progress__bar { width: 40%; animation: progress-indeterminate 1.5s ... }`
- `setIndeterminate(true)` 호출 시 aria-valuenow 제거 (WAI-ARIA 명세 준수)

### 색상 변형 (CSS 클래스)
- `.progress--primary` / `--success` / `--warning` / `--error` / `--info`
- 동적 변경: `el.classList.replace('progress--primary', 'progress--success')`

### 크기 변형
- `.progress--sm` (4px) / `.progress--md` (8px) / `.progress--lg` (12px)

### Live Region 패턴
- `<p role="status" aria-live="polite" aria-atomic="true">` — 완료/상태 변경 시 스크린 리더 알림
- `.progress-value-text`에는 `aria-hidden="true"` 필수 (스크린 리더는 aria-valuenow 읽음)

## 파일 위치
- `assets/css/components/progress.css`
- `assets/js/components/progress.js`
- `pages/progress.html`
