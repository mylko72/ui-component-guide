import Component from '../core/Component.js';

export default class TabsDemo extends Component {
  render() {
    return '<div class="demo-section"></div>';
  }

  mount() {
    // 이벤트 바인딩
  }

  afterMount() {
    // 초기화
  }

  destroy() {
    // 정리
  }

  _query(selector) {
    return this.element.querySelector(selector);
  }
}
