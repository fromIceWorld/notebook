# ViewContainerRef

ViewContainerRef 作为 viewTree 的引用，可对 viewTree操作 ：

1. 指令注入**ViewContainerRef**时，会将 指令对应的节点变为 **LContainer**

2. 可解析 component 生成 viewTree，并插入到 **LContainer**【viewTree对节点】

3. 可将 TemplateRef 生成 viewTree  插入到当前LContainer

4. ~~对viewTree进行变更检测~~【**viewRef** 对 viewTree 进行变更检测】

5. 操作**LContainer**中的viewTree，将 viewTree 从 rootViewTree 中 分离/重新添加

6. router-outlet 注入 ViewContainerRef，在解析component时，建立依赖链

   

```typescript
应用1-----------------------------------------------------
ngTemplateOutlet 指令中注入ViewContainerRef，通过传入的<ng-template #name> 的引用名称，去获取对应的templateRef，然后通过 ViewContainerRef 调用 templateRef进行渲染生成 view，插入到当前指令对应的LContainer中

应用2-------------------------------------
路由注入ViewContainerRef，将对应的component解析后存入 LContainer，
为 新创建的 component view 建立依赖链 【ViewContainerRef.injector】
```





由下述流程可知：当在 **LContainer**节点上 注入 **ViewContainerRef**时，返回 **R3ViewContainerRef**

​                              普通节点上 注入 **ViewContainerRef**，会将lview上对应的节点更改为 **LContainer**

`例如`: 在路由的 <router-outlet> 上注入了 **ViewContainerRef**, 会将 节点变为 **LContainer**

```typescript
ViewContainerRef.`__NG_ELEMENT_ID__` = function injectViewContainerRef() {
    const previousTNode = getCurrentTNode();
    return createContainerRef(previousTNode, getLView());
}
`1.` ViewContainerRef 有自己的 `__NG_ELEMENT_ID__` 属性，在依赖注入时不去BloomHash中查找，直接
     运行 `__NG_ELEMENT_ID__` 对应的函数。
```

## createContainerRef

创建 LContainer 的引用

```typescript
@params  当前tNode
@params tNode所属的 lview

`1.` tNode所对应的lview 上的节点 是 LContainer
`2.` tNode的类型是 ElementContainer， 取出对应的comment 节点
     如果 tNode 对应的节点是 普通节点，需创建 comment节点，并将comment节点插入到普通节点前
     并创建LContainer 插入到lview中的对应位置【hostNative是 普通节点】
     将LContainer插入 viewTree中
     
`3.` 将上面的 LContainer hostTnode， hostLView 实例化 生成 R3ViewContainerRef 实例   
```

### R3ViewContainerRef

LContainer 的 引用

```typescript
@params _lContainer  // LContainer
@params _hostTNode   // LContainer 对应的 tNode
@params _hostLView   // LContainer 所在的 LView


const R3ViewContainerRef = class ViewContainerRef extends VE_ViewContainerRef{
    constructor(_lContainer, _hostTNode, _hostLView) {
        super();
        this._lContainer = _lContainer;
        this._hostTNode = _hostTNode;
        this._hostLView = _hostLView;
    }
    // 依赖链，链接🔗 生成的 view 及 _hostTNode
    // 使 路由的 router-outlet上渲染的 component view 指向 依赖树
    get injector() {
        return new NodeInjector(this._hostTNode, this._hostLView);
    }
}
```

**目的**：是view容器, 在指令实例化时注入 **ViewContainerRef** 时,会创建 R3ViewContainerRef 会存入 injector

​           可包含 `host views`, 和 `embedded views`：

​                `host views`: 通过 createComponent() 创建的，路由对应的组件

​                `embedded views`：通过 TemplateRef 创建的。

ViewContainerRef.__NG_ELEMENT_ID__ = SWITCH_VIEW_CONTAINER_REF_FACTORY;

**使用**：在依赖注入时，@Inject(ViewContainerRef) ,    会 调用 __NG_ELEMENT_ID__ 返回  value。 

```typescript
`__NG_ELEMENT_ID__`是用于标识 特殊的 依赖注入的 factory的。例如：
						1. ElementRef
                        2. ChangeDetectorRef
                        3. TemplateRef
                        4. ViewContainerRef
`NG_ELEMENT_ID` ：当指令要注入到 依赖系统，给指令一个 NG_ELEMENT_ID，标识指令的唯一ID                       
```



