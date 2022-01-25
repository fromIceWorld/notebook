# TemplateRef

模板的引用，只能通过在 `Container 也就是 <ng-template>`类型的tNode中的指令注入，

​                        可以将当前 view 插入到**LContainer** 中

`注意`：**TemplateRef** 是对 Template 的引用，只能在 【<ng-template>节点上的指令中注入使用】

​            如果要对普通DOM引用，使用**ElementRef**

```typescript
`与WebComponent 规范，表现一致，ng-template 只是模板，需要插入到对应位置才能展示`

`对应位置`：LContainer 中

<ng-container *ngTemplateOutlet="templateRefExp; context: contextExp"></ng-container>
`【应用：】` *ngTemplateOutlet 对应的指令，
              `1.` 通过 ɵɵreference 指令集赋值 templateRefExp = <ng-template>节点的引用 `R3TemplateRef`
              `2.` 再通过注入viewContainerRef 调用`R3TemplateRef`：
                        R3TemplateRef.createEmbeddedView(contextExp) 创建 view插入到当前的LContainer中
```



## R3TemplateRef

ivy模式下的 引用, 会生成template引用，并将引用注入到  **Injector**

```typescript
@params _declarationLView          // 当前指令所在节点的所属lview
@params _declarationTContainer     // 当前指令所在的 tNode<ng-template>在lview上对应的节点：【LContainer】
@params elementRef                 // 指令对应的tNode的 节点引用  

`_declarationTContainer`上有tViews属性，是<ng-template>对应的tview【类型是 `Embedded`】

const R3TemplateRef = class TemplateRef extends ViewEngineTemplateRef {
    constructor(_declarationLView, _declarationTContainer, elementRef) {
        super();
        this._declarationLView = _declarationLView;
        this._declarationTContainer = _declarationTContainer;
        this.elementRef = elementRef;
    }
    createEmbeddedView(context) {
        const embeddedTView = this._declarationTContainer.tViews;
        const embeddedLView = createLView(this._declarationLView, embeddedTView, context, 16 /* CheckAlways */, null, embeddedTView.declTNode, null, null, null, null);
        const declarationLContainer = this._declarationLView[this._declarationTContainer.index];
        ngDevMode && assertLContainer(declarationLContainer);
        embeddedLView[DECLARATION_LCONTAINER] = declarationLContainer;
        const declarationViewLQueries = this._declarationLView[QUERIES];
        if (declarationViewLQueries !== null) {
            embeddedLView[QUERIES] = declarationViewLQueries.createEmbeddedView(embeddedTView);
        }
        renderView(embeddedTView, embeddedLView, context);
        return new ViewRef(embeddedLView);
    }
};
`1.` templateRef 是对当前<ng-template>的引用。
`2.` createEmbeddedView 是将<ng-template>对应的view 渲染到LContainer 中
    // <ng-template> 是嵌入视图，因此需要将<ng-template>对应的视图 插入到LContainer 中

`createEmbeddedView` 是【ViewContainerRef】调用生成 view插入到 `LContainer` 中
```

