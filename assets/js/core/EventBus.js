/**
 * EventBus - Pub/Sub 패턴 이벤트 시스템
 * 컴포넌트 간 느슨한 결합을 위한 이벤트 발행/구독 시스템
 */

export class EventBus {
  constructor() {
    // 이벤트별 콜백 함수 배열을 저장하는 Map
    // Key: 이벤트명, Value: [콜백1, 콜백2, ...]
    this.events = new Map();
  }

  /**
   * 이벤트 리스너 등록
   * @param {string} event - 이벤트 이름
   * @param {Function} callback - 실행할 콜백 함수
   */
  on(event, callback) {
    if (typeof callback !== 'function') {
      console.warn(`EventBus: 콜백은 함수여야 합니다. 받은 타입: ${typeof callback}`);
      return;
    }

    if (!this.events.has(event)) {
      this.events.set(event, []);
    }

    this.events.get(event).push(callback);
  }

  /**
   * 이벤트 리스너 제거 (메모리 누수 방지)
   * @param {string} event - 이벤트 이름
   * @param {Function} callback - 제거할 콜백 함수
   */
  off(event, callback) {
    if (!this.events.has(event)) {
      return;
    }

    const callbacks = this.events.get(event);
    const index = callbacks.indexOf(callback);

    if (index > -1) {
      callbacks.splice(index, 1);
    }

    // 콜백이 모두 제거되었다면 이벤트 키도 삭제
    if (callbacks.length === 0) {
      this.events.delete(event);
    }
  }

  /**
   * 이벤트 발행 및 모든 리스너의 콜백 실행
   * @param {string} event - 이벤트 이름
   * @param {*} data - 콜백에 전달할 데이터
   */
  emit(event, data) {
    if (!this.events.has(event)) {
      return;
    }

    const callbacks = this.events.get(event);
    // 콜백 배열의 복사본에 대해 반복 (실행 중 콜백 제거 방지)
    [...callbacks].forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`EventBus: 이벤트 '${event}' 처리 중 오류 발생:`, error);
      }
    });
  }

  /**
   * 특정 이벤트의 모든 리스너 제거
   * @param {string} event - 이벤트 이름 (생략 시 모든 이벤트 제거)
   */
  clear(event) {
    if (event) {
      this.events.delete(event);
    } else {
      this.events.clear();
    }
  }
}

// 전역 EventBus 인스턴스 (선택사항)
export const eventBus = new EventBus();
