# 组件构造过程中的数据

```typescript
组件 属于指令的子类，TNode对应 tag，tagName对应组件。
也就是在 解析过程中，<组件名>会被解析成一个TNode，而组件是TNode中的一个指令。
```



## instructionState[指令集状态]

```typescript

const instructionState = {
	lFrame：{
		currentTNode:    // 用于在创建节点时设置父TNode 并跟踪查询结果,【tView.firstChild】
        isParent: true,  // 当前tNode 是否有子tNode
        lView: null!,           // 记录创建的所有元素[nativeDOM，绑定值，Directive实例]
        tView: null!,           // 组件实例,对应的Node(TNode)
        selectedIndex: -1,      //当前选中的元素在LView的index
        contextLView: null!,    // Lview的执行上下文：lView
        elementDepthCount: 0,   // 节点的层级
        currentNamespace: null, // 当前的 namespace
        currentDirectiveIndex: -1, 
        bindingRootIndex: -1,
        bindingIndex: -1,     // 【tView.bindingStartIndex】
        currentQueryIndex: 0,  //当前 query索引
        parent: lFrame, // instructionState 之间是层级关系的树状结构，在render时维持层级关系
        child: lFrame, // instructionState 之间是层级关系的树状结构,保存层级关系
        inI18n: false,
	},
	bindingsEnabled: true, //是否可以绑定数据，
    isInCheckNoChangesMode: false,
}

```

### enterView 

```typescript
维护view的上下文
```



### LView

`logic view` 存储组件的【对外数据】和 DOM 节点和 组件的LView，替代factory

```typescript
`LView  = 常规绑定 + 纯函数的绑定 `

`常规绑定`: [0-19]
`decls`:node,pipeInstance, local reference
`vars`: template中绑定的属性个数
`纯函数的绑定`：
|-------decls------|---------vars---------|                            |----- hostVars (dir1) ------|
 ------------------------------------------------------------------------------------------
| nodes/refs/pipes | bindings | fn slots  | injector |providers | dir1 |  host bindings | host slots |
------------------------------------------------------------------------------------------
                   ^                      ^                             ^
     TView.bindingStartIndex      TView.expandoStartIndex               指令的hostBinding属性
`vars`标记的是绑定的纯函数的返回值，例如 {{参数}}，[**]="参数。那var的长度就是2，在LView的vars段记录 参数的值。


【  [0-HEADER_OFFSET(20)固定数据],
    [bindingStartIndex = HEADER_OFFSET + decls], //存储dom节点，指令，事件,#ref【dom的引用也会添加一份】
    [常量数据 bindingStartIndex + vars], 
              // 纯函数会保存原始数据和转换后数据，存储到对应位置，节点保存bindingStartIndex + 偏移量，去印证数据是否改变
    [Bloom过滤器]          //tNode上指令injector和所有父级injector 合并
	parentLoc             // 父级injector 的位置
	providersFactory      //存储providers的工厂函数
    指令的实例 【__ngContext__属性存储LView】//tView会存储 指令实例在LView的【索引和hook】，在refresh时调用
    [Bloom过滤器]          //第二个tNode指令injector和所有父级injector 合并
	parentLoc             // 第二个指令父级injector 的位置
	providersFactory      //存储providers的工厂函数
    指令的实例 【__ngContext__属性存储指令所在LView】//tView会存储 指令实例在LView的【索引和hook】，在refresh时调用
    `...重复的tNode上BloomHash及provider，directive相关数据☝`
】
`LView 来源于tView.blueprint，在创建时，clone【tView.blueprint】，再添加进去对应数据`

`LView 分为三类{Root:0,Component:1,Embedded:2}`
`LView的【0-20】是固定索引标记,后续的增加的数据，分段划分`
		【[20-...]第一部分是element节点顺序存放（）】
`LView的固定索引标记：`
const HOST = 0;    //存储LView 的宿主节点<app-root>
const TVIEW = 1;   //此视图的静态数据，存储的组件的一些状态 tview[指令def]，状态
                   // tview.data 存储 tnode 及BlooHash 区域及一些 依赖 providers
                   
const FLAGS = 2;   //LView 的状态{CreationMode：4，Attached：128，FirstLViewPass：8}
                   // 是否 有 contentqueries，viewqueries，.....
                   // 还会存储 lview 中 已经执行的ngOninit钩子的个数。通过2048【二进制第12位】记录
                        
const PARENT = 3;  // parentLView = lView[PARENT]
`记录当前view的 相邻的下一个view`          
const NEXT = 4;    // 相邻的下一个节点
const TRANSPLANTED_VIEWS_TO_REFRESH = 5;  // 需更更新的移植视图的数量
const T_HOST = 6;   //  当前LView对应的的TNode; 第一个组件的tNode 是#host
const CLEANUP = 7;  //  清除queries,...
const CONTEXT = 8;  // LView 的上下文【普通view 对应的class的实例，rootview对应的是rootcontext】
const INJECTOR = 9;   //ElementInjector依赖注入链，rootview的依赖链上级是AppModule依赖
                      //每一个指令view都指向rootView,以便在依赖链中查找不到依赖时，向                                   // ModuleInjector查找。
 
`----继承的属性10-12 渲染用的工程函数及 DOM安全卫士-----------`          
const RENDERER_FACTORY = 10;  // dom渲染工厂函数,有唯一ID，对组件进行处理后生成渲染函数【RENDERER[11]】
                              //
const RENDERER = 11;          // 组件渲染数据【包含component的 def,contentAttr,hostAttr,data,eventManager】
                              // contentAttr,hostAttr是 拼接后的唯一字符串，在生成样式时对样式进行封装。
const SANITIZER = 12;         // DOM安全卫士，Angular 默认将所有输入视为不信任值，，当我们通过 property，attribute，  
                              // style，class绑定 或插值方式，将一个值从模板中插入 DOM 时，SANITIZER 会自动帮
                              // 我们清除和转义不受信任的值
`13-14 标记了当前view的 子view的 第一个和最后一个 view `                                 
const CHILD_HEAD = 13;    // 当前视图的 第一个子view，也就是head view
const CHILD_TAIL = 14;   //当前视图的最后一个个子view，【遍历嵌套视图以删除监听器，调用ondestroy回调】
          
          
`15-16，标记了 当前lview 的位置信息，声明当前view的view，当前view 所属的组件，`          
const DECLARATION_VIEW = 15;    //声明当前lview 的 lview，也就是parent 
const DECLARATION_COMPONENT_VIEW = 16;  // 声明lview的 view，当前视图如果是嵌入视图，就会存储parent[16]
                                        // 非嵌入视图，和 DECLARATION_VIEW一样
const DECLARATION_LCONTAINER = 17;      // 当前lview声明的LContainer
                                        // 当前view是embeddedView 时，才有
const PREORDER_HOOK_FLAGS = 18;        // 存储生命周期钩子的状态，及 已经执行的ngOninit钩子的个数
                                       // 在更新开始时，置为0
const QUERIES = 19;     // 存储 queries 其中有 匹配到的页面内容

 // 偏移量，常春藤的生长位置。         
export const HEADER_OFFSET = 20; //存储组件 view
```

### TView

`template view`：存储TNode 与 LView 中的真实节点索引一致

TView 保存在 ComponentDef，是组件的一个共享实例，再创建相同组件时，就会调用缓存

TView.data 存储节点的tNode。

```typescript
先有TView 再有LView【LView 根据 TView.blueprint 得来，】

`template view：由于组件的复用性较高，存储组件实例更好`
对组件(指令)的共性数据做缓存处理，将组件(指令)的实例存储在LView，将组件(指令)的定义函数放在TView.data，并且index相同，除了组件(指令)，在创建DOM时也把对应的Node(TNode)放入TView中【TNode中包含我们要创建的DOM元素的元数据（metadata）比如tagName，匹配的Directive等】
【通过这个方式angular再次调用Instruction创建DOM实例，就会去TView中确认保存的数据，这样就能立刻做后续的操作。】

type：类型 {根：0,组件：1,嵌入：2}
blueprint：根据LView 的分段原则【HEADER_OFFSET,decls,vars】,分段填充数据
bindingStartIndex：  // 记录view中绑定的起始索引;        插值语法，函数插槽
expandoStartIndex:   // 记录view中指令和注入的起始索引;   providers，directives
firstChild：第一个TNode
consts: 组件的属性列表【存储node属性 和 queries 名称，存储的索引在ɵɵelementStart时查询queries 时使用】
declTNode: 声明当前tView 的tNode
         // 当前 tNode如果是`Embedded`【嵌入视图】，declTNode指向 当前tNode 的 parent tNode  
data:[  //TView.data 与 LView 映射
    ...
    '20':tNode【#host】
    [`预定8位`]：布隆过滤器存储指令，使其对DI系统公开
]
components:[index,...],   // 记录child component 的view 在 lview的index【tNode.index】

templateFn:模板函数
queries: // 存储视图列表【contentView,queryView】
contentQueries：存储【queries中的索引 和 指令的索引】

directiveRegistry：模板注册的指令
pipeRegistry：模板注册的管道
`---------------注册生命周期------------------------------------- `           
preOrderHooks： 如果tNode上有指令，在解析指令阶段，存储tNode.index;
preOrderCheckHooks： 如果tNode上有指令，在解析指令阶段，存储tNode.index;
            
在实例化指令时，将指令的生命周期注册到tView.preOrderHooks 和 tView.preOrderCheckHooks 中
[指令在lview的索引，指令的生命周期钩子函数]
`preOrderHooks`:属于前置生命钩子，包含 ngOnChanges，ngOnInit，ngDoCheck
`preOrderCheckHooks`:属于check类钩子，包含ngOnChanges，ngDoCheck
因此存tView中存储的钩子数据的形态：
`preOrderHooks:`[
    tNode.index,                     // 标记有生命周期的tNode
    directiveIndex,ngOnChanges,      // 保存要执行生命周期的指令及要执行的函数
    -directiveIndex,ngOnInit,        // 
    directiveIndex,ngDoCheck,
    ....
]
`preOrderCheckHooks:`[
    tNode.index,
    directiveIndex,ngOnChanges,
    directiveIndex,ngDoCheck,
    ....
]
```

### LRootView

```typescript
`根view，属于一种虚拟的 LView，虚拟一层 rootComponent 的 parent`


```

### tNode

`保存 node节点的所有元数据,再次调用时可立即使用，节省时间`

第一个tNode 是 <#host>,类似于 <app-host> 对应的 tNodee

```typescript
TNode 存储节点的数据(attribute, tagname,style....){
    type,            // tNode 的类型
	index,            // 存储节点LView 在rootLView的索引
	value,           //  节点值/节点名称 【二类元素[标签]，就是节点名称；】
	attrs,            // 节点的所有属性
	parent，          // 父级tNode
	匹配的Directive,
	injectorIndex     // 依赖开始索引【Bloom 过滤器的 开始索引】
    mergedAttrs       // tNode上的 attrs 属性 与 节点上指令的hostbinding 属性合并
    inputs            // 将directive.inputs 的属性和 directove在LView的索引组合后保存  
    outputs           // 将directive.outputs的属性和 directove在LView的索引组合后保存  
    tViews            // ng-container 对应的 tView
    directiveStart    // 当前node绑定的指令的开始索引【在LView中的索引】，后续引用指令的的生命周期到 tView中
    directiveEnd      // node绑定的指令的结束索引
    localNames:[]     // 存储 queryName   
    Styles：          //  静态styles
    stylesWithoutHost //  静态styles 不包含 host属性
    classes           // 静态 class
    classesWithoutHost //  静态class 不包含 host属性
    providerIndexes    // 存储ElmentInjector 的 providers在常春藤开始的索引
    projection         // 投影节点
}
TNode
```

#### type

tNode 的类型

```typescript
`1`:Text               // 文本类  tNode                     对应的lview节点是 TextDOM
`2`:Element            // 普通DOM/组件    生成的tNode         对应的lview节点是DOM/lview
`4`:Container          // <ng-template>  生成的 tNode       对应lview节点是 LContainer
`8`:ElementContainer   // <ng-container> 生成的 tNode       对应的lview节点是comment
`16`:Projection        // <ng-content>   生成的tNode        
```



### tNode, LView, TView, rootTView, rootLView

`各数据之间的联系`

```typescript
`1.` rootTView 和 rootLView 是 虚拟的根节点【为 <app-root> 的虚拟父节点】
`2.` LView, TView 是组件的 常春藤，存储 组件的 关键数据，LView存储组件的实例，TView.data存储组件的节点数据tNode
`3.` tNode 记录节点的数据 

----------从根节点更新时---------
`1.` rootLView[CONTEXT]中存有 AppComponent的实例，获取
`策略`  执行 template函数 渲染DOM【rootLView无 template】
`2.` 执行 AppComponent的生命周期 [onchange,init,check]
`3.` 更新移植视图
`4.` 更新嵌入式图
`5.` 更新 ContentQueries
`6.` 执行 AppComponent的生命周期 [contentCheckHooks]
`7.` hostbinding
`8.` 更新 childComponents【tView.components】
`9.` 执行viewQuery
`10.`执行 AppComponent的生命周期 [viewCheckHooks] 
`11.`更新移植视图的数量【ng-template 到 ng-container】
```





## renderView(rootTView, rootLView, null)

`从 roolLView 开始渲染`

```typescript
rootTView 无需要渲染的东西，所以引导 child 渲染 
`1.`  const components = tView.components;  //child 在 lView的索引
`2.`  renderChildComponents(lView, components);
```



## defineComponent的参数

`defineComponent 是 组件经过转化后的数据，后续为 LView，TView 服务`

```typescript
`defineComponent`数据在生成 LView和TView时会转移到 LView和TView
{
        type: 组件类,
        selectors: 选择器//
        contentQueries：
        viewQuery: function AppComponent_Query(rf, ctx) {
            if (rf & 1) {
                jit___viewQuery_8(_c0, 1);
            }
            if (rf & 2) {
                var _t;
                jit___queryRefresh_9((_t = jit___loadQuery_10())) &&
                    (ctx.dir = _t.first);
            }
        },
        hostBindings： // 配置会影响宿主节点。
        inputs：输入    //
        outputs：输出   //
        exportAs：
        features: 【NgOnChanges， Providers】,
        ngContentSelectors:['*', 'content'],  <ng-content select> 的选择器
        decls: 22【视图函数的数量【element节点 + 监听事件函数 + pipe函数】】,
        vars: 5【纯函数，绑定插槽数量】,在视图更新时，会获取存储的数据
        consts: 解析出element节点上的所有属性[
            [存储节点上的属性集合{属性的值，属性的类别}，在创建/更新时使用]
            enum type{
                class = 1;
                style = 2;
                [property] | (event) = 3
				*指令集 = 4
            }
            无type的属于其他类型[#标签,'id = value', '指令']
        ]
        template: function AppComponent_Template(rf, ctx) {
            模板的指令集，分为两种模式
            	rf == 1：创建
                rf == 2：更新
            通过调用对应指令函数，去创建/更新节点。
            创建element：elementStart(elementIndex, tagName,
                                   对应属性在consts中的index,
                                   对应索引在consts中的index,)
        },
        ngContentSelectors：
        attrs：
        directives：
        pipes：
        encapsulation：
        data：
        changeDetection：
        styles: [样式,],
    }
```

# templateFn

`template 生成的函数运行，创建真实的DOM`

`instructionState.lFrame 维持上下文环境`

在运行过程中分为两个mode【创建，更新】

创建：第一次创建时，生成真实dom 和 tNode，存储不同的容器【LView存储 dom 和 childLView；tView.data存储tNode】

​           tView 还存储 other 数据

更新：

##### ɵɵreference

```typescript
当页面有嵌入式图如下:`
		<ng-container *ngTemplateOutlet="tem"></ng-container>
        <ng-template #tem>嵌入视图</ng-template>
`
var _r4 = jit___reference_14(15);
.....
jit___property_16('ngTemplateOutlet',_r4);

会运行 ɵɵreference(index),  // index 是 <ng-template> view 在 lview的 索引。
获取 LContainer  // _r4 = lview[index]
```

##### ɵɵproperty

```typescript
`处理 ng-template 和 ng-container`：
`1.` 将 lContainer处理成 TemplateRef。赋值到 lview中的 bindingIndex 位置
`2.` 再将 TemplateRef赋值到 <ng-container> 对应的 节点上  ngTemplateOutlet属性上。
```



##### ɵɵtext

```typescript
@params index
@params value

`1.` const lView = getLView();
`2.` const tView = getTView();
`3.` get/create tNode  // 第一次创建就直接创建后存储到 TView.data【HEADER_OFFSET + index】, 
                         // 非第一次，就直接根据索引【HEADER_OFFSET + index】寻找。
`4.` 创建 nativeNode 存到 LView[HEADER_OFFSET + index]
`5.` 将 nativeNode append 到 nativeNode[parent]
`6.` 设置当前tNode，更改上下文中的 tNode
```

##### ɵɵpipe

```typescript
@params index
@params pipeName

`1.` const tView = getTView();
`2.` pipeDef = getPipeDef$1(pipeName, tView.pipeRegistry); // 根据pipe的name 从 tview.pipeRegistry获取管道
`3.` tView.data[HEADER_OFFSET + index] = pipeDef // 缓存pipe的def
`4.` LView[HEADER_OFFSET + index] = pipeInstance
```

##### ɵɵlistener

```typescript
@params eventName
@params listenerFn
@params useCapture = false
@params eventTargetResolver

`1.` 为native 添加 eventName 对应的 listenerFn
`2.` subscribe to directive outputs
```

##### ɵɵprojectionDef

```
处理父组件投影进来的视图
```

##### ɵɵprojection

```typescript
`<ng-content> 会渲染成 ɵɵprojection函数`，目的是，处理投影视图，从父级component 上找到DOM：
处理 ng-content，接收视图
```

## renderView

`渲染视图，执行tView的各个函数，例如【模板函数，查询函数】`

```

```

## Bloom过滤器

`8位 的 Bloom过滤器，存储 injector，和父injector`

```typescript
当前node 的injector = injector | parentInector
也就是当前node的 bloom 过滤器是合并完所有祖先的过滤器。

`---怎末存储------`
匹配到的指令会添加上静态属性`__NG_ELEMENT_ID__` = 从0递增的数字.

`----存储什么-----------`
Bloom过滤器会在<node match derective> 阶段，存储节点中匹配到的指令的__NG_ELEMENT_ID__ 属性到 Bloom过滤器中 

```

