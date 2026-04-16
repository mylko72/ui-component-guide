# Task 003 완료 요약

**작업**: EventBus 및 Component 기본 클래스 구현  
**상태**: ✅ 완료  
**작업 일시**: 2026-04-16  
**소요 시간**: 0.3일  

---

## 산출물

### 1. `/assets/js/core/EventBus.js` (90줄)

**Pub/Sub 이벤트 시스템** - 컴포넌트 간 느슨한 결합 통신

**주요 기능**:
- `on(event, callback)`: 이벤트 리스너 등록
- `off(event, callback)`: 리스너 제거 (메모리 누수 방지)
- `emit(event, data)`: 이벤트 발행 및 콜백 실행
- `clear(event)`: 이벤트 또는 전체 정리

**특징**:
- Map 기반 저장소 (O(1) 조회)
- 다중 리스너 지원
- 콜백 예외 처리 (try-catch)
- 배열 복사본 순회로 실행 중 제거 회피
- Named export: `export class EventBus {}`

---

### 2. `/assets/js/core/Component.js` (156줄)

**컴포넌트 기본 클래스** - 생명주기 및 메모리 관리

**생명주기**:
```
constructor(selector)
  ↓
mount() → render() → innerHTML
  ↓
afterMount() → 초기화 (이벤트 등록)
  ↓
setState() → 상태 업데이트 → 리렌더링
  ↓
destroy() → 리스너 정리 → 상태 초기화
```

**주요 메서드**:
- `render()`: HTML 마크업 반환 (추상 메서드)
- `mount()`: HTML 렌더링
- `afterMount()`: 초기화
- `destroy()`: 메모리 해제
- `_query(selector)`: 엘리먼트 조회
- `_addEventListener(target, event, callback)`: 추적 가능한 리스너 등록
- `_removeEventListener(target, event, callback)`: 리스너 제거
- `setState(newState, shouldRerender)`: 상태 업데이트

**특징**:
- 문자열/HTMLElement selector 지원
- 이벤트 리스너 자동 추적
- destroy()에서 완전한 정리
- 선택적 리렌더링 지원
- Default export: `export default class Component {}`

---

## 검증

### EventBus 검증 ✅
- [x] `on()`: 리스너 등록, 다중 리스너 지원
- [x] `off()`: 콜백 완전 제거 (재호출 안 함)
- [x] `emit()`: 모든 리스너 콜백 실행, 데이터 전달
- [x] 예외 처리: 콜백 오류 → catch → 로깅 → 다음 리스너 계속

### Component 검증 ✅
- [x] `constructor()`: 문자열/HTMLElement selector 처리
- [x] `render()`: 서브클래스 구현 강제
- [x] `mount()`: HTML 렌더링
- [x] `afterMount()`: 초기화 가능
- [x] `destroy()`: 리스너 전부 제거
- [x] `_query()`: 범위/절대 경로 조회
- [x] `_addEventListener()`: 리스너 추적
- [x] `setState()`: 상태 업데이트 + 리렌더링

### 호환성 검증 ✅
- [x] 기존 Demo 클래스 상속 가능 (ButtonDemo, InputDemo 등)
- [x] shrimp-rules.md ES6 규칙 준수
- [x] 코드 스타일: 2칸 들여쓰기, camelCase/PascalCase, 한국어 주석
- [x] 메모리 누수 방지: 순환 참조 없음

---

## 코드 품질

| 항목 | 상태 |
|------|------|
| 문법 검증 | ✅ (node -c) |
| 메모리 관리 | ✅ (완전한 정리) |
| 에러 처리 | ✅ (try-catch 로깅) |
| 네이밍 규칙 | ✅ (camelCase/PascalCase) |
| 주석 품질 | ✅ (JSDoc + 한국어) |
| 모듈 형식 | ✅ (ES6 named/default export) |

---

## 사용 예시

### EventBus
```javascript
import { EventBus } from './core/EventBus.js';

const bus = new EventBus();

// 리스너 등록
bus.on('theme-changed', (theme) => {
  console.log('테마:', theme);
});

// 이벤트 발행
bus.emit('theme-changed', 'dark');

// 리스너 제거
bus.off('theme-changed', callback);
```

### Component
```javascript
import Component from './core/Component.js';

class ButtonDemo extends Component {
  render() {
    return '<button id="btn">클릭</button>';
  }

  afterMount() {
    const btn = this._query('#btn');
    this._addEventListener(btn, 'click', () => this._onClick());
  }

  _onClick() {
    this.setState({ clicked: true });
  }

  destroy() {
    // _eventListeners 자동 정리
    super.destroy();
  }
}

// 사용
const demo = new ButtonDemo('#app');
demo.mount();
demo.afterMount();
demo.destroy();
```

---

## 다음 단계

**Task 004: Router 구현**
- 의존성: EventBus 사용
- 해시 기반 라우팅 (#/button, #/input 등)
- 브라우저 뒤로/앞으로 가기 지원

---

## 파일 위치

```
assets/
└── js/
    └── core/
        ├── EventBus.js      (90줄, named export)
        └── Component.js     (156줄, default export)
```

---

## 참고 자료

- `shrimp-rules.md` - 프로젝트 표준 (ES6, 코드 스타일)
- `docs/ROADMAP.md` - 개발 로드맵
- `tasks/003-eventbus-component.md` - 상세 구현 가이드
