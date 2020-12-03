import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

class VueElement extends HTMLElement {
  
  constructor() {
    super();
    this.observer = new MutationObserver(() => this.update());
    this.observer.observe(this, { attributes: true });
  }

  connectedCallback() {
    this._innerHTML = this.innerHTML;
    this.mount();
  }

  disconnectedCallback() {
    this.unmount();
    this.observer.disconnect();
  }

  update() {
    this.unmount();
    this.mount();
  }

  mount() {
    new Vue({
      render: h => h(App),
    }).$mount(this)
  }
}

customElements.define('vue-app', VueElement);

