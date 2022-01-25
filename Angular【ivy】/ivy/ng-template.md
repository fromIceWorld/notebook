# ng-template

ng-template 属于 Angular模板中的一种节点，模板视图:

1. 普通的DOM 节点
2. DOM节点 + Directive
3. 组件
4. ng-container
5. **ng-template**

**默认情况下不显示，**

1. <ng-container  *ngTemplateOutLet = "ref"> ; <ng-tempalte #ref>  // 会显示
2. <ng-tempalte  [ngIf]="true">   //会显示

**是浏览器中定义的 webComponents 在Angular中的实现。**

**属于一种view**，也会进行render

##  R3TemplateRef

ng-template 的 引用属性

```typescript
@params _declarationLView       // 声明ng-template的 parent view
@params _declarationTContainer  // ng-template 对应的 tNode
@params elementRef              // ng-template 对应的 comment 节点的引用【注释节点的引用】

`0.` instance 是 对 ng-template 的引用
`1.` 在container 内渲染时，会调用 `createEmbeddedView` 进入 ng-template 的 render 阶段。
`2.` 在render阶段，ng-template 对应的 lview也有自己继承的 [QUERIES]


const R3TemplateRef = class TemplateRef extends ViewEngineTemplateRef {
    constructor(_declarationLView, _declarationTContainer, elementRef) {
        super();
        this._declarationLView = _declarationLView;
        this._declarationTContainer = _declarationTContainer;
        this.elementRef = elementRef;
    }
    createEmbeddedView(context) {
        const embeddedTView = this._declarationTContainer.tViews;
        const embeddedLView = createLView(this._declarationLView, embeddedTView,
                                          context, 16 /* CheckAlways */, 
                                          null, embeddedTView.declTNode, 
                                          null, null, null, null);
        const declarationLContainer = this._declarationLView[this._declarationTContainer.index];
        embeddedLView[DECLARATION_LCONTAINER] = declarationLContainer;
        const declarationViewLQueries = this._declarationLView[QUERIES];
        if (declarationViewLQueries !== null) {
            embeddedLView[QUERIES] = declarationViewLQueries.createEmbeddedView(embeddedTView);
        }
        renderView(embeddedTView, embeddedLView, context);
        return new ViewRef(embeddedLView);
    }
};
```

