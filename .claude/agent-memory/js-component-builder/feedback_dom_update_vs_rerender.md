---
name: DOM 직접 업데이트 vs 전체 리렌더
description: 탭 전환처럼 특정 DOM 요소만 변경할 때는 setState(재렌더) 대신 DOM 직접 조작이 성능상 유리
type: feedback
---

탭 전환, 토글 등 영향 범위가 명확한 상태 변화는 `setState()`로 전체 리렌더 하지 말고, 변경 대상 DOM 요소만 직접 업데이트한다.

**Why:** setState()는 innerHTML을 교체하므로 이벤트 리스너가 해제되고 afterMount()를 다시 호출해야 해서 불필요한 비용이 발생한다.

**How to apply:** `_switchTab()`, `_toggleExpand()` 같은 메서드에서는 `setAttribute`, `classList.add/remove`, `textContent` 등으로 최소 범위 DOM만 수정한다.
