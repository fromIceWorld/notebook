# web component

 `Web Components`  =  `Custom Elements`  +  `HTML Imports`  +  `HTML Tmplates`  +  `ShadowDOM`

## Custom Elements

### `API`

`customElements.define`

```typescript
customElements.define('my-element', class extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    // here the element has been inserted into the DOM
  }    
  disconnectCallback(){
      //元素从DOM中移除的时候将会调用
  }
  attributeChangedCallback(){
      //增加，删除，修改某个属性时被调用
  }
  adoptedCallback(){
      //当 custom element被移动到新的文档时，被调用。
  }  
});
const el = customElements.get('my-element');
const myElement = new el();  // same as document.createElement('my-element');
document.body.appendChild(myElement);
```

### 自定义元素的参数

```

```



## template

`支持模板，模板内支持<style>标签`

```html
<template>
    <style>
    	.....
    </style>
    ....模板
</template>
```

### slot

```html
<b-card>
	<标签 slot = "插槽名称">****</标签>  //具名插槽
    <标签>****</标签>                  //默认插槽
</b-card>

template:
<slot name="插槽名"></slot>    //具名插槽
<slot></slot>                 //默认插槽
```



## Shadow DOM

`隐藏内部代码不允许js`访问，隔离样式

```typescript
const shadow = this.attachShadow({ mode: 'closed' });
可以隔离内部样式，在 自定义组件和插入内部的template之间隔离一层 #shadow-root(closed)
使用:host设置宿主样式

设置样式隔离后，可在组件内标签上设置 part=“属性”，外层设置 b-card::part(属性){
    ....
}，作用于webComponents
```

## HTML Imports

```html
<link rel="import" href="/components/header.html">
阻塞式：可加 async
```

# component通信

### 父->子

```typescript
`设置 observedAttributes 监听属性`：
static get observedAttributes() {
                return ['prop'];
            }
set prop(v){
    this.setAttribute(prop，v)
}
当属性更改时，调用 this.setAttribute(属性，值)，更改组件属性，引起变化周期函数 attributeChangedCallback(...),响应变化 
```

### 子->父

```typescript
 
```

