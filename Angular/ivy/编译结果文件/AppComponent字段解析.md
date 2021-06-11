# 组件构造过程中的数据

```typescript

```



## instructionState[指令集状态]

```typescript
const instructionState = {
	lFrame：{
		currentTNode:    // 用于在创建节点时设置父属性并跟踪查询结果,【tView.firstChild】
        isParent: true,
        lView: null!,           //记录创建的所有元素[DOM，绑定值，Directive实例]
        tView: null!,           //组件实例,对应的Node(TNode)
        selectedIndex: -1,      //当前选中的元素在LView的index
        contextLView: null!,    // Lview的执行上下文：lView
        elementDepthCount: 0,
        currentNamespace: null,
        currentDirectiveIndex: -1,
        bindingRootIndex: -1,
        bindingIndex: -1,     // 【tView.bindingStartIndex】
        currentQueryIndex: 0,  //当前 query索引
        parent: lFrame, // instructionState 之间是层级关系的树状结构
        child: lFrame, // instructionState 之间是层级关系的树状结构
        inI18n: false,
	},
	bindingsEnabled: true, //是否可以绑定数据，
    isInCheckNoChangesMode: false,
}

```

### enterView 

```typescript
切换lFrame结构，lFrame结构中LView,TView为主要属性，

@params newView 当前view【初始是LRootView】



instructionState.lFrame的 childlFrame

```



### LView

```typescript

【  [0-HEADER_OFFSET(20)固定数据],
    [bindingStartIndex = HEADER_OFFSET + decls], //存储节点，指令，事件
    [initialViewLength = bindingStartIndex + vars],
    [指令？]
】
`LView 来源于tView.blueprint，在创建时，clone【tView.blueprint】，再添加进去对应数据`

`LView 分为三类{Root:0,Component:1,Embedded:2}`
`LView的【0-20】是固定索引标记,后续的增加的数据，分段划分`
		【[20-...]第一部分是element节点顺序存放（）】
`LView的固定索引标记：`
const HOST = 0;    //存储LView 的宿主节点
const TVIEW = 1;   //此视图的静态数据，存储的tview[指令def]
const FLAGS = 2;   //LView 的状态{CreationMode：4，Attached：128，FirstLViewPass：8}
const PARENT = 3;  // parentLView = lView[PARENT]
const NEXT = 4;
const TRANSPLANTED_VIEWS_TO_REFRESH = 5;
const T_HOST = 6;   //  存储当前LView 插入的TNode; parentTNode = lView[T_HOST];
const CLEANUP = 7;
const CONTEXT = 8;  // LView 的上下文【view 对应的class】
const INJECTOR = 9;
const RENDERER_FACTORY = 10;  //dom渲染工厂
const RENDERER = 11;          //默认dom渲染工厂
const SANITIZER = 12;
const CHILD_HEAD = 13;
const CHILD_TAIL = 14;   //子视图的结尾？
// FIXME(misko): Investigate if the three declarations aren't all same thing.
const DECLARATION_VIEW = 15;
const DECLARATION_COMPONENT_VIEW = 16; 
const DECLARATION_LCONTAINER = 17;
const PREORDER_HOOK_FLAGS = 18;
const QUERIES = 19;     //存储查询
/**
 * Size of LView's header. Necessary to adjust for it when setting slots.
 *
 * IMPORTANT: `HEADER_OFFSET` should only be referred to the in the `ɵɵ*` instructions to translate
 * instruction index into `LView` index. All other indexes should be in the `LView` index space and
 * there should be no need to refer to `HEADER_OFFSET` anywhere else.
 */
export const HEADER_OFFSET = 20; //存储组件 view
```

### TView

```typescript
先有TView 再有LView【LView 根据 TView.blueprint 得来，】

`template view：由于组件的复用性较高，存储组件实例更好`
对组件(指令)的共性数据做缓存处理，将组件(指令)的实例存储在LView，将组件(指令)的定义函数放在TView.data，并且index相同，除了组件(指令)，在创建DOM时也把对应的Node(TNode)放入TView中【TNode中包含我们要创建的DOM元素的元数据（metadata）比如tagName，匹配的Directive等】
【通过这个方式angular再次调用Instruction创建DOM实例，就会去TView中确认保存的数据，这样就能立刻做后续的操作。】

type：类型 {根：0,组件：1,}
blueprint：根据LView 的分段原则【HEADER_OFFSET,decls,vars】,分段填充数据
bindingStartIndex：与decls 有关
firstChild：第一个TNode
data:[  //TView.data 与 LView 映射
    ...
    '20':tNode
]
components:[index],记录组件在LView的index值

templateFn:模板函数
queries:存储视图查询
directiveRegistry：transitiveScopes.compilation.directives【来自于注册时的缓存】
pipeRegistry：与directive同来源
```

### LRootView

```typescript
`根view`
`根LRootView 先创建空 rootTView，再根据 rootTView 创建 rootView`
```

### tNode

```
TNode 存储节点的数据(attribute, tagname,style....)

```

### compRef

`组件实例`

```
@params componentType, 组件class
@params instance,      组件class 实例
@params location,      组件的host <app-root>【LView[ROOT]】
@params _rootLView,    创建组件LView前的 rootView
@params _tNode         <#host>

在 ApplicationRef._loadComponent阶段,检查更新【内部进行tick检查】
```



## defineComponent的参数

```typescript
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
        hostBindings：
        inputs：
        outputs：
        exportAs：
        features: 与NgOnChanges生命周期有关,
        decls: 22【视图函数的数量【element节点 + 监听事件函数 + pipe函数】】,
        vars: 5【纯函数，绑定插槽数量】,
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

##### ɵɵelementStart

```typescript
@param DOM 在 LView 中的index【LView存储所有的节点】
@param DOM 节点的名称
@param 节点属性在 consts 中的index
@param 标签在 consts 中的index【#索引名】
```

## enterView

```
切换 instructionState.lFrame,储存 lView，tView
```



## renderView

`渲染视图，执行tView的各个函数，例如【模板函数，查询函数】`

```

```

