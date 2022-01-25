# ElementRef

有 `__NG_ELEMENT_ID__`属性的 特殊注入的依赖

```typescript
`ElementRef.__NG_ELEMENT_ID__ = injectElementRef`

function injectElementRef() {
    return createElementRef(getCurrentTNode(), getLView());
}

function createElementRef(tNode, lView) {
    return new ElementRef(getNativeByTNode(tNode, lView));
}
`获取lview上的 nativeNode`：
普通DOM上的指令注入 ElementRef         => 获取DOM
组件注入 ElementRef                  => 获取组件对应的 lview
<ng-container>上的指令注入ElementRef  => 获取组件上对应的 LContainer

```