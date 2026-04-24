---
name: Tabs 정적 HTML 패턴 (tabs.js)
description: 정적 HTML 페이지용 Tabs 컴포넌트 구현 — CodeBlock 충돌 방지, roving tabindex, disabled 건너뜀 패턴
type: reference
---

## Tabs.js 핵심 패턴

### CodeBlock 내 role="tablist" 충돌 방지
```js
if (tablist.closest('[data-code-block]') || tablist.closest('.code-block')) return;
```
- CodeBlock도 role="tablist"를 사용하므로 반드시 필터링 필요
- Tabs.init()이 CodeBlock 내 tablist를 잘못 초기화하면 CodeBlock 탭 기능이 깨짐

### Roving tabindex 방식
- 활성 탭만 tabindex="0", 나머지는 tabindex="-1"
- 탭 전환 시 focus()를 직접 호출하여 포커스 이동

### Disabled 탭 키보드 건너뜀
```js
_getNextEnabledTab(currentIndex, direction) {
  for (let i = 0; i < total; i++) {
    index = (index + direction + total) % total;
    if (!tab.disabled && tab.getAttribute('aria-disabled') !== 'true') return tab;
  }
}
```
- disabled + aria-disabled="true" 조합 사용
- 최대 total 번 반복으로 무한루프 방지

### JS 비활성화 대응 (Progressive Enhancement)
- 첫 번째 패널 제외, 나머지 패널에 style="display: none;" 인라인 적용
- JS 로드 후 _syncInitialState()가 aria-selected 기준으로 재동기화

### 탭 변형 (CSS만으로 완성)
- `.tabs--filled`: 배경색 컨테이너 + 활성 탭 흰색 배경
- `.tabs--vertical` + `.tabs-vertical-layout`: 세로 탭 + 패널 flex row 배치
- `.tabs--sm`, `.tabs--lg`: 크기 변형

### 스크립트 로드 순서 (pages/*.html)
1. code-block.js (CodeBlock 클래스 정의)
2. tabs.js (Tabs 클래스 정의 + DOMContentLoaded 자동 등록)
3. common.js (CodeBlock.init() 호출)
- tabs.js DOMContentLoaded가 common.js보다 먼저 실행되므로 Tabs.init()이 먼저 발화됨 (정상)
