---
name: Checkbox Indeterminate 패턴
description: aria-checked="mixed" + element.indeterminate 속성 조합으로 구현하는 부분 선택 체크박스 패턴
type: reference
---

## Checkbox Indeterminate 구현 패턴

### CSS 선택자 패턴 (checkbox.css)
- `input[type="checkbox"][data-checkbox]`: 네이티브 input을 시각적으로 숨김 (SR 접근성 유지)
- `label[data-checkbox-label]`: `::before`(박스) + `::after`(체크마크/대시) 가상 요소로 커스텀 외형

### Indeterminate 3가지 상태
1. **전체 해제**: `element.indeterminate = false`, `checked = false`, `aria-checked="false"`
2. **일부 체크**: `element.indeterminate = true`, `checked = false`, `aria-checked="mixed"`
3. **전체 체크**: `element.indeterminate = false`, `checked = true`, `aria-checked="true"`

### 마운트 시 초기화 주의점
- HTML에 `aria-checked="mixed"`로 선언해도 브라우저는 `indeterminate` 속성을 자동 설정하지 않음
- `afterMount()`에서 반드시 `element.indeterminate = true` 직접 설정 필요
- CSS `:indeterminate` 가상 클래스는 JS의 `element.indeterminate` 속성에만 반응 (aria 속성과 별개)

### 부모-자식 연동 패턴
- 부모: `data-parent="groupId"` 속성으로 자식 그룹 ID 지정
- 자식: `data-child-group="groupId"` 속성으로 그룹 소속 명시
- 부모 클릭 → `indeterminate || !checked` 로 shouldCheck 결정 → 자식 전체 토글
- 자식 change → `_updateParentState()` 호출 → checkedCount/total 비교로 상태 결정

### 접근성
- `fieldset + legend`: 그룹 의미 전달 (스크린리더: "그룹명 [그룹] 항목명 체크박스" 형식)
- `role="group" aria-label`: div 기반 자식 그룹에 그룹 의미 보충
- Space 키: native input은 자동 지원하지만, `keydown` 핸들러 명시적 등록으로 확실히 처리
