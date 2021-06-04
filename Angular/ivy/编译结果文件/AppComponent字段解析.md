# 组件构造过程中的数据

```typescript

```



## instructionState[指令集状态]

```typescript
const instructionState = {
	lFrame：{
		currentTNode: // 用于在创建节点时设置父属性并跟踪查询结果,
        isParent: true,
        lView: null!,           //记录创建的所有元素[DOM，绑定值，Directive实例]
        tView: null!,           //组件实例,对应的Node(TNode)
        selectedIndex: -1,      //标识当前选中的元素在LView的index
        contextLView: null!,
        elementDepthCount: 0,
        currentNamespace: null,
        currentDirectiveIndex: -1,
        bindingRootIndex: -1,
        bindingIndex: -1,
        currentQueryIndex: 0,
        parent: lFrame, // instructionState 之间是层级关系的树状结构？
        child: lFrame, // instructionState 之间是层级关系的树状结构？
        inI18n: false,
	},
	bindingsEnabled: true,
    isInCheckNoChangesMode: false,
}
`lView`[logic view]:正在处理的当前视图的状态,[文本，element，容器，pipe和他们的绑定，在调用之间存储的任何局部变量]
`tView`[template view]:template对同一组件的所有实例只创建一个共享实例。

Directive的实例存在`LView`，
将Directive的定义函数和创建DOM时也把对应的Node（TNode）放入`TVew`
```

LView

```typescript
`LView的固定索引标记`
const HOST = 0;    //擦汗如此LView 的节点
const TVIEW = 1;   //此视图的静态数据，存储的tview[指令def]
const FLAGS = 2;   //LView 的状态
const PARENT = 3;  // parentLView = lView[PARENT]
const NEXT = 4;
const TRANSPLANTED_VIEWS_TO_REFRESH = 5;
const T_HOST = 6;   //  存储当前LView 插入的TNode; parentTNode = lView[T_HOST];
const CLEANUP = 7;
const CONTEXT = 8;
const INJECTOR = 9;
const RENDERER_FACTORY = 10;
const RENDERER = 11;
const SANITIZER = 12;
const CHILD_HEAD = 13;
const CHILD_TAIL = 14;
// FIXME(misko): Investigate if the three declarations aren't all same thing.
const DECLARATION_VIEW = 15;
const DECLARATION_COMPONENT_VIEW = 16;
const DECLARATION_LCONTAINER = 17;
const PREORDER_HOOK_FLAGS = 18;
const QUERIES = 19;
/**
 * Size of LView's header. Necessary to adjust for it when setting slots.
 *
 * IMPORTANT: `HEADER_OFFSET` should only be referred to the in the `ɵɵ*` instructions to translate
 * instruction index into `LView` index. All other indexes should be in the `LView` index space and
 * there should be no need to refer to `HEADER_OFFSET` anywhere else.
 */
export const HEADER_OFFSET = 20;
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
        decls: 22,
        vars: 5,
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

