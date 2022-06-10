// 注册base 应用
customElements.define(
    'base-element',
    class base extends HTMLElement {
        constructor() {
            super();
        }
        static get observedAttributes() {
            return ['src'];
        }
        connectedCallback() {
            console.log('挂载到html');
        }
        attributeChangedCallback(attrName, oldvalue, newVal) {
            // 监听src的变化，挂载不同的子应用
            if (attrName == 'src' && newVal) {
                fetch(newVal)
                    .then((response) => {
                        return response.text();
                    })
                    .then((text) => {
                        let dynamicTags = document.createDocumentFragment();
                        console.log(text);
                        // 获取html文件
                        let css = text.match(/\<link\s+[^\>]*\>/g),
                            js = text.match(/\<script[^>]*\>\<\/script\>/g);
                        let nodeDetails = [];
                        for (let tagString of css.concat(js)) {
                            nodeDetails.push(splitDOM(tagString));
                        }
                        nodeDetails.forEach((node) => {
                            let newDom = document.createElement(node['tag']);
                            node['attrs'].forEach((kv) => {
                                newDom.setAttribute(kv[0], kv[1] ?? '');
                            });
                            console.log(newDom);
                            dynamicTags.appendChild(newDom);
                            // document.head.appendChild(newDom);
                        });
                        document.head.appendChild(dynamicTags);
                        console.log(css, js);
                    });
            }
            console.log(arguments);
        }
    }
);
// const base = customElements.get('base-element');
// const myBase = new base();
// document.body.append(myBase);
// 事件
function toMic(src) {
    // @ts-ignore
    document
        .getElementsByTagName('base-element')[0]
        .setAttribute('src', 'http://localhost:63498/');
}
