# web component

 `Web Components`  =  `Custom Elements`  +  `HTML Imports`  +  `HTML Tmplates`  +  `ShadowDOM`

webComponents 样式与模板之间耦合高？？？只能做UI层， 与框架的通用性没法比

## Custom Elements

### `API`

`customElements.define`

```typescript
customElements.define('my-element', class extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    // 元素插入DOM
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

                                                                           
不支持对象
```

### 子->父

```typescript
`创建自定义触发的事件名称`，dispatchEvent触发事件。
var event = new CustomEvent('自定义事件名称', {
    detail: {
        hazcheeseburger: true,
    },
});
this.dispatchEvent(event);
`parent监听事件`
dom.addEventListener('事件名称',(e)=>{
    
})
```

## 渐进式增强组件  :is

```typescript
<button is="my-button">
    
class MyButton extends HTMLButtonElement {}
```



## 跨组件通讯

# 生命周期

## disconnectedCallback

```
父-> 子： 先触发父的hook，再触发子的hook
```

# 缺点

1. 属性  获取/设置

   ```
   webComponents 认为本质上属性只能是字符串形式，所以当设置/获取属性时，都会被转换成字符串。
   所以对于对象，数组这类的数据只能拆分成单一属性。
   ```

   `解决`：组件继承，初始化数据

2. 