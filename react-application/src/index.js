// import React from 'react';
// import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
// import reportWebVitals from './reportWebVitals';



// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
import * as React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';

class ReactElement extends HTMLElement {
  
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
    const props = {
      ...this.getProps(this.attributes),
      ...this.getEvents(),
      children: this.parseHtmlToReact(this.innerHTML)
    };
    render(<App {...props} />, this);
  }

  unmount() {
    unmountComponentAtNode(this);
  }

  parseHtmlToReact(html) {
    return html;
  }

  getProps(attributes) {
    return [ ...attributes ]         
      .filter(attr => attr.name !== 'style')         
      .map(attr => this.convert(attr.name, attr.value))
      .reduce((props, prop) => 
        ({ ...props, [prop.name]: prop.value }), {});
  }

  getEvents() {
    return Object.values(this.attributes)
      .filter(key => /on([a-z].*)/.exec(key.name))
      .reduce((events, ev) => ({
        ...events,
        [ev.name]: args => 
        this.dispatchEvent(new CustomEvent(ev.name, { ...args }))
      }), {});
  }

  convert(attrName, attrValue) {
    let value = attrValue;
    if (attrValue === 'true' || attrValue === 'false') 
      value = attrValue === 'true';      
    else if (!isNaN(attrValue) && attrValue !== '') 
      value = +attrValue;      
    else if (/^{.*}/.exec(attrValue)) 
      value = JSON.parse(attrValue);
    return {         
      name: attrName,         
      value: value      
    };
  }

}

customElements.define('react-app', ReactElement);