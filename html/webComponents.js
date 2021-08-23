let parent = document.getElementsByTagName('b-card');
parent[0].addEventListener('canLink', (e) => {
    console.log('添加的自定义事件');
});
class BCard extends HTMLElement {
    // 自定义组件 注册要监听的属性 static get
    observedAttributes() {
        return ['prop'];
    }
    static get innerHTML() {
        return `<style>
        :host {
            width: 200px;
            height: 200px;
            background-color: red;
        }
        .artical {
            color: #1aaf26;
        }
    </style>
    <div class="container">
        <p class="artical">这是一个webComponents内部</p>
        <p class="prop"></p>
        <slot name="insertCard"></slot>
        <slot></slot>
    </div>
    <div part="yes">zcds</div>`;
    }
    constructor() {
        var event = new CustomEvent('canLink', {
            detail: { hazcheeseburger: true },
        });
        super();
        //隐藏内部代码,隔离样式，使:host生效
        const shadow = (this._shadow = this.attachShadow({ mode: 'open' }));
        // shadow.innerHTML = `<style>
        //     :host {
        //         width: 200px;
        //         height: 200px;
        //         background-color: red;
        //     }
        //     .artical {
        //         color: #1aaf26;
        //     }
        // </style><div class="container">
        //     <p class="artical">这是一个webComponents内部</p>
        //     <p class="prop"></p>
        //     <slot name="insertCard"></slot>
        //     <slot></slot>
        // </div>
        // <div part="yes">zcds</div>
        //     `;

        // 接收处理传参
        // content.querySelector('.prop').innerText = this.getAttribute('prop');
        // shadow.append(content);
        // 添加事件监听
        shadow.addEventListener('click', ($event) => {
            console.log('事件监听');
        });
        console.log(shadow);
        this.addEventListener('mouseover', (e) => {
            this.setAttribute('style', 'color:pink; font-style: bold;');
            this.dispatchEvent(event);
        });
        this.addEventListener('mouseout', (e) => {
            this.setAttribute('style', 'color:black; font-style: bold;');
        });
    }
    // 生命周期
    connectedCallback() {
        console.log('插入DOM中');
    }
    disconnectCallback() {
        console.log('从DOM中移除');
    }
    attributeChangedCallback(name, oldValue, newValue) {
        console.log('修改属性');
        this._prop = newValue;
    }
    get prop() {
        return this._prop;
    }
    set prop(v) {
        this.setAttribute('prop', v);
    }
    adoptedCallback() {
        console.log('移动到新文档');
    }
    onfresh() {
        console.log(this._prop);
    }
}
window.customElements.define('b-card', BCard);
window['b-card'] = BCard;
