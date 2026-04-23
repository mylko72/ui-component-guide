---
name: Switch 컴포넌트 CSS 구현 패턴
description: data-switch/data-switch-label 선택자, 트랙(::before)+노브(::after) 슬라이딩 토글 구현, 크기별 translateX 계산식, switch-row/switch-list 레이아웃
type: project
---

## Switch 핵심 CSS 패턴

### 선택자 체계
- `input[type="checkbox"][data-switch]` — 네이티브 input 시각적 숨김 (clip 패턴)
- `label[data-switch-label]` — 스위치 래퍼 (position: relative 필수, ::after 절대배치 기준)
- `label[data-switch-label]::before` — 트랙 (pill 배경)
- `label[data-switch-label]::after` — 노브 (슬라이딩 원형)

### 트랙+노브 크기 및 translateX 계산식

| 크기 | 트랙       | 노브     | OFF translateX     | ON translateX              |
|------|-----------|----------|--------------------|---------------------------|
| sm   | 32×20px   | 14×14px  | translateX(3px)    | translateX(15px) [32-14-3] |
| md   | 40×24px   | 18×18px  | translateX(3px)    | translateX(19px) [40-18-3] |
| lg   | 52×32px   | 24×24px  | translateX(4px)    | translateX(24px) [52-24-4] |

translateX ON = 트랙너비 - 노브너비 - 오른쪽여백

### sm 크기 checked 선택자 특이점
`input:checked + label[data-switch-label][data-size="sm"]::after` 처럼
checked 선택자에서 data-size를 label에 붙여야 인접 형제 선택자가 올바르게 작동함.
(label::after에 data-size가 있으므로 label 선택자에 포함시켜야 함)

### 색상 전환
- 비활성(OFF): `var(--color-border-hover)` 트랙 배경
- 활성(ON): `var(--color-primary)` 트랙 배경
- 에러 OFF: `color-mix(in srgb, var(--color-danger) 25%, var(--color-border-hover))`
- 에러 ON: `var(--color-danger)`

### 애니메이션
- transition: `0.3s cubic-bezier(0.4, 0, 0.2, 1)` (트랙 색상, 노브 transform 동일 적용)
- prefers-reduced-motion: `transition: none`

### 접근성 패턴
- `role="switch"` + `aria-checked="true|false"` — checkbox와 달리 switch role 명시
- `aria-labelledby` — switch-row 패턴에서 좌측 제목 ID 참조
- `aria-describedby` — 헬퍼/에러 텍스트 ID 연결

### 레이아웃 클래스
- `.switch-row` — `justify-content: space-between` (좌: 텍스트, 우: 스위치)
- `.switch-row__content` — flex: 1, min-width: 0 (텍스트 말줄임 대응)
- `.switch-list` — border + border-radius 컨테이너
- `.switch-list__item` — 각 항목, border-bottom 구분선, hover 배경 전환
