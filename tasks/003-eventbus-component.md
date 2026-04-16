# Task 003: EventBus 및 Component 기본 클래스 구현

**상태**: ✅ 완료  
**작업 일시**: 2026-04-16  
**소요 시간**: 0.3일  
**의존성**: Task 001 (폴더 구조)

---

## 개요

순수 JavaScript ES6 Modules로 SPA의 핵심 인프라인 **pub/sub 이벤트 시스템(EventBus)**과 **컴포넌트 생명주기 관리(Component)**를 구현했습니다.

---

## 산출물

### 1. EventBus.js (`assets/js/core/EventBus.js`)

**목적**: 컴포넌트 간 느슨한 결합을 위한 이벤트 발행/구독 시스템

**주요 메서드**:

```javascript
export class EventBus {
  // on(event: string, callback: Function): void
  // 이벤트 리스너 등록
  // - 동일 이벤트 다중 리스너 지원
  // - 콜백 타입 검증

  // off(event: string, callback: Function): void
  // 리스너 제거 (메모리 누수 방지)
  // - 콜백 배열에서 완전 제거
  // - 빈 배열이면 이벤트 키도 삭제

  // emit(event: string, data: any): void
  // 이벤트 발행 및 모든 리스너 콜백 실행
  // - 콜백 배열의 복사본에 대해 반복 (실행 중 제거 방지)
  // - 예외 처리: 콜백 오류 시 로깅, 다른 리스너 계속 실행

  // clear(event?: string): void
  // 특정 이벤트 또는 전체 이벤트 제거
}

export const eventBus = new EventBus();
```

**구현 세부**:

- **내부 저장소**: `this.events = new Map()` (Key: 이벤트명, Value: 콜백 배열)
- **메모리 관리**: `off()` 호출 시 정확한 참조 비교로 콜백 제거, 빈 배열은 Map에서 삭제
- **안정성**: `emit()` 시 배열 복사본 `[...callbacks]` 순회 (실행 중 제거 회피)
- **에러 처리**: 콜백 실행 중 예외는 catch하여 로깅, 다른 리스너 영향 방지

**사용 예시**:

```javascript
const bus = new EventBus();

// 리스너 등록
bus.on('theme-changed', (theme) => {
  console.log('테마 변경:', theme);
});

// 이벤트 발행
bus.emit('theme-changed', 'dark');

// 리스너 제거
bus.off('theme-changed', callback);
```

---

### 2. Component.js (`assets/js/core/Component.js`)

**목적**: 모든 UI 컴포넌트의 기본 클래스, 생명주기 및 메모리 관리 제공

**주요 메서드**:

```javascript
export default class Component {
  // constructor(selector: string | HTMLElement): void
  // - selector가 문자열이면 _query()로 조회
  // - HTMLElement이면 직접 할당
  // - this.state = {} 초기화
  // - this._eventListeners = [] 이벤트 추적 초기화

  // render(): string
  // - HTML 마크업 반환 (추상 메서드)
  // - 서브클래스에서 구현

  // mount(): void
  // - render() 호출 후 this.element.innerHTML에 적용
  // - 엘리먼트 없으면 에러 로깅

  // afterMount(): void
  // - 마운트 후 초기화 (이벤트 리스너 등록, 상태 설정)
  // - 서브클래스에서 구현

  // destroy(): void
  // - 모든 추적된 이벤트 리스너 제거
  // - this.element.innerHTML 초기화
  // - this.state 초기화
  // - 메모리 누수 방지

  // _query(selector: string): HTMLElement | null
  // - 범위 조회: this.element가 있으면 element.querySelector()
  // - 절대 경로 조회: #selector 형식이고 this.element 없으면 document.querySelector()
  // - 기본값: document.querySelector()

  // _addEventListener(target: HTMLElement, event: string, callback: Function): void
  // - 리스너 추가 + 추적 (_eventListeners에 저장)
  // - destroy() 시 자동 제거

  // _removeEventListener(target: HTMLElement, event: string, callback: Function): void
  // - 리스너 제거 + 추적 목록에서 제거

  // setState(newState: Object, shouldRerender: boolean = true): void
  // - 상태 업데이트: this.state = { ...this.state, ...newState }
  // - 자동 리렌더링: mount() → afterMount() 호출
}
```

**생명주기**:

```
constructor(selector)
    ↓
mount()
    ↓
render() → this.element.innerHTML = html
    ↓
afterMount() → 이벤트 등록, 초기 상태 설정
    ↓
[상태 변경 가능]
    ↓
destroy() → 정리 및 메모리 해제
```

**메모리 관리**:

1. **이벤트 리스너 추적**: `_eventListeners` 배열에 `{ target, event, callback }` 저장
2. **자동 정리**: `destroy()`에서 모든 리스너 제거
3. **우수 사례**:
   ```javascript
   // ✅ 권장: _addEventListener 사용
   this._addEventListener(button, 'click', () => this._onClick());

   // ❌ 피하기: 직접 addEventListener
   button.addEventListener('click', () => this._onClick());
   ```

**사용 예시**:

```javascript
class ButtonDemo extends Component {
  render() {
    return `
      <button id="demo-btn" aria-label="클릭">
        클릭하기
      </button>
    `;
  }

  mount() {
    // render() 자동 호출됨 (Component.mount())
  }

  afterMount() {
    const btn = this._query('#demo-btn');
    this._addEventListener(btn, 'click', () => this._onClick());
  }

  _onClick() {
    this.setState({ clicked: true });
  }

  destroy() {
    // 모든 리스너 자동 정리됨 (Component.destroy())
    super.destroy();
  }
}

// 사용
const demo = new ButtonDemo('#app');
demo.mount();
demo.afterMount();

// 정리
demo.destroy();
```

---

## 기술 특성

### EventBus

| 항목 | 값 |
|------|-----|
| 이벤트 저장소 | Map (O(1) 조회) |
| 콜백 배열 | Array.push() / splice() |
| 다중 리스너 | ✅ 지원 |
| 메모리 누수 방지 | ✅ `off()` 정확한 제거, 빈 Map 키 삭제 |
| 예외 처리 | ✅ try-catch, 로깅 |
| Export | `export class EventBus {}` (named export) |

### Component

| 항목 | 값 |
|------|-----|
| 기본 클래스 | 추상 클래스 패턴 |
| 생명주기 | constructor → mount → render → afterMount → destroy |
| Selector | 문자열 또는 HTMLElement 지원 |
| 이벤트 추적 | `_eventListeners` 배열 |
| 메모리 관리 | 수동 destroy() 호출 필수 |
| 상태 관리 | `setState(newState, shouldRerender)` |
| Export | `export default class Component {}` (default export) |

---

## 검증 체크리스트

- ✅ EventBus `on()`: 리스너 등록, 동일 이벤트 다중 리스너 지원
- ✅ EventBus `emit()`: 모든 리스너 콜백 실행, 데이터 전달
- ✅ EventBus `off()`: 콜백 완전 제거, 재호출 안 됨
- ✅ EventBus 에러 처리: 콜백 오류 시 로깅, 다른 리스너 계속 실행
- ✅ Component `constructor`: 문자열/HTMLElement selector 지원
- ✅ Component `render()`: 서브클래스 구현 확인
- ✅ Component `mount()`: HTML 렌더링
- ✅ Component `afterMount()`: 초기화 (이벤트 등록)
- ✅ Component `destroy()`: 모든 리스너 제거, 상태 초기화
- ✅ Component `_query()`: 범위/절대 경로 조회
- ✅ Component `_addEventListener()`: 리스너 추적 및 자동 정리
- ✅ Component `setState()`: 상태 업데이트 + 선택적 리렌더링
- ✅ 메모리 관리: 순환 참조 없음, 완전한 정리
- ✅ ES6 Modules: named export / default export 정확성

---

## 다음 작업

**Task 004: Router 구현** (해시 기반 SPA)

- 의존성: EventBus 사용
- 18개 컴포넌트 라우트 등록
- 해시 변경 감지 및 페이지 전환

---

## 파일 위치

- `/assets/js/core/EventBus.js` (90줄)
- `/assets/js/core/Component.js` (156줄)

---

## 참고 자료

- `shrimp-rules.md` - ES6 Modules 규칙, 코드 스타일
- ButtonDemo.js - 기존 Demo 파일 (상속 예시)
