---
name: Input 컴포넌트 패턴
description: InputDemo 구현에서 확인된 Input CSS 선택자 패턴, 아이콘 래퍼 구조, 비밀번호 토글 구현 방법
type: reference
---

## CSS 선택자 패턴

기존 `input.css`는 `.input` 클래스가 아닌 `input[data-input]` 속성 선택자를 사용한다.
새 데모/컴포넌트에서 input 스타일을 적용할 때 반드시 `data-input` 속성을 붙여야 한다.

```html
<!-- 올바른 사용 -->
<input data-input data-size="md" type="text" />

<!-- 잘못된 사용 (스타일 미적용) -->
<input class="input" data-size="md" type="text" />
```

## 크기 변형

`data-size="sm|md|lg"` 속성 사용:
- sm: 32px 최소 높이, padding 6px 10px
- md: 44px 최소 높이 (기본값), padding 10px 14px
- lg: 52px 최소 높이, padding 14px 18px

## 에러 상태

`data-error="true"` + `aria-invalid="true"` 조합 사용:
```html
<input data-input data-error="true" aria-invalid="true" aria-describedby="error-msg-id" />
<p id="error-msg-id" role="alert">에러 메시지</p>
```

## 아이콘 입력 구조

`.input-icon-wrap` (position: relative) 안에 아이콘과 input을 함께 배치:
```html
<div class="input-icon-wrap">
  <i class="input-icon input-icon--leading" data-lucide="search" aria-hidden="true"></i>
  <input data-input data-size="md" data-icon="leading" />
</div>
```

- `data-icon="leading"`: padding-left 38px 자동 적용
- `data-icon="trailing"`: padding-right 38px 자동 적용
- `.input-icon--leading`: left: 12px
- `.input-icon--trailing`: right: 12px

## 비밀번호 토글 버튼

`.input-pw-toggle` 버튼 + `data-target` 속성으로 연결:
```html
<div class="input-icon-wrap">
  <input data-input data-icon="trailing" type="password" id="pw-input" />
  <button class="input-pw-toggle" data-target="pw-input"
          aria-label="비밀번호 표시" aria-pressed="false">
    <i data-lucide="eye" aria-hidden="true"></i>
  </button>
</div>
```

JS에서 토글 시:
1. `input.type = 'text'` ↔ `'password'` 전환
2. `aria-pressed="true|false"` 업데이트
3. `aria-label` 동적 변경 ("비밀번호 표시" ↔ "비밀번호 숨김")
4. `data-lucide` 속성 `"eye"` ↔ `"eye-off"` 교체 후 `lucide.createIcons()` 호출

## 입력 필드 그룹 구조

`.input-field`로 라벨 + input + 헬퍼/에러를 수직 배치:
```html
<div class="input-field">
  <label class="input-label" for="input-id">
    라벨 텍스트
    <span class="input-required" aria-hidden="true">*</span>
  </label>
  <input data-input id="input-id" aria-required="true" aria-describedby="helper-id" />
  <p class="input-helper" id="helper-id">헬퍼 텍스트</p>
</div>
```
