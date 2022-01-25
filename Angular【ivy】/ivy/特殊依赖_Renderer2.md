# Renderer2

有 `__NG_ELEMENT_ID__`属性的 特殊注入的依赖

获取 view 上的 render函数： **lView[RENDERER]**;

```typescript
/*
*  展此基类以实现自定义渲染。默认情况下，Angular将模板渲染到DOM中。您可以使用自定义渲染来拦截渲染调用，或渲 *  染到除DOM之外的其他对象。使用`RenderFactory2`创建自定义渲染器。使用自定义渲染器绕过Angular的模板，并*  进行无法以声明方式表达的自定义UI更改。
*  
*  例如，如果需要设置名称不是静态已知的属性或属性，请使用`setProperty（）`或`setAttribute（）`方法。
*
*/
`Renderer2.__NG_ELEMENT_ID__ = () => injectRenderer2()`

function injectRenderer2() {
    // We need the Renderer to be based on the component that it's being injected into, however since
    // DI happens before we've entered its view, `getLView` will return the parent view instead.
    const lView = getLView();
    const tNode = getCurrentTNode();
    const nodeAtIndex = getComponentLViewByIndex(tNode.index, lView);
    return getOrCreateRenderer2(isLView(nodeAtIndex) ? nodeAtIndex : lView);
}
```