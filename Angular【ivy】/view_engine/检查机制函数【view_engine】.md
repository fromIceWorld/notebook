#### 程序

**程序是一堆视图(View)组成的树，而每一个视图又是由不同类型节点组成的。**

[视图]: ./AppComponent.ngfactory.js

**节点类型**：元素节点，文本节点，指令节点，query节点【指令的queries属性】

#### 视图View

```typescript
视图是构成应用 UI 的基本元素。它是一组一起被创造和销毁的最小合集。
视图的属性可以更改，而视图中元素的结构（数量和顺序）不能更改。想要改变元素的结构，只能通过用 ViewContainerRef 来插入、移动或者移除嵌入的视图。每个视图可以包含多个视图容器（View Container）

视图通过nodes 属性与子视图关联，这样就能对子视图进行操作

`在ngfactory中 视图 通过 viewDef函数进行创建 `

```

```typescript
interface ViewData {
  def: ViewDefinition; 
  root: RootData;
  renderer: Renderer2;
  // index of component provider / anchor.
  parentNodeDef: NodeDef|null;
  parent: ViewData|null;
  viewContainerParent: ViewData|null;
  component: any;                            【视图对应的组件class】
  context: any;
  // Attention: Never loop over this, as this will
  // create a polymorphic usage site.
  // Instead: Always loop over ViewDefinition.nodes,
  // and call the right accessor (e.g. `elementData`) based on
  // the NodeType.
  nodes: {[key: number]: NodeData};
  state: ViewState;       //视图状态
  oldValues: any[];
  disposables: DisposableFn[]|null;
  initIndex: number;
}
`ViewState 代表View的状态,与生命周期相关`
enum ViewState {
  BeforeFirstCheck = 1 << 0,                     //未检查
  FirstCheck = 1 << 1,                           //第一次检查
  Attached = 1 << 2,                             //
  ChecksEnabled = 1 << 3,                        //初始化状态:已启用检查
  IsProjectedView = 1 << 4,                      //是否是投影View
  CheckProjectedView = 1 << 5,                   //检查投影View
  CheckProjectedViews = 1 << 6,                  //检查投影View列表
  Destroyed = 1 << 7,                            //是否销毁

  // InitState Uses 3 bits
  InitState_Mask = 7 << 8,   //标记是否已经完成 Init | AfterContentInit | AfterViewInit周期
  InitState_BeforeInit = 0 << 8,                  // 处于还未init状态
  InitState_CallingOnInit = 1 << 8,               //已经Init
  InitState_CallingAfterContentInit = 2 << 8,     //已经AfterContentInit
  InitState_CallingAfterViewInit = 3 << 8,        //已经AfterViewInit
  InitState_AfterInit = 4 << 8,                   //已经AfterInit

  CatDetectChanges = Attached | ChecksEnabled,    //可以检测更改
  CatInit = BeforeFirstCheck | CatDetectChanges | InitState_BeforeInit  //可以初始化
}
`View 实例，由 viewDef 生成[compViewDefFactory -> compViewDef -> viewDef]`
interface ViewDefinition {
  flags: ViewFlags;
  updateDirectives: ViewUpdateFn;
  updateRenderer: ViewUpdateFn;
  handleEvent: ViewHandleEventFn;
  nodes: NodeDef[];
  nodeFlags: NodeFlags;
  rootNodeFlags: NodeFlags;
  lastRenderRootNode: NodeDef|null;
  bindingCount: number;
  outputCount: number;
  nodeMatchedQueries: number;
}
`Node节点实例 由 elementDef生成`
`Text文本实例 由textDef生成`
```

#### 视图节点：viewDef

```typescript
@params flags: ViewFlags,                       //视图标记：None、OnPush,确定view 的检查类型 
@params nodes: NodeDef[],                       //view下的节点
@params updateDirectives?: null | ViewUpdateFn, //指令更新函数
@params updateRenderer?: null | ViewUpdateFn    //视图更新函数

@return ViewDefinition 视图节点

function viewDef(flags, nodes, updateDirectives?, updateRenderer?){}
```

##### 元素节点：elementDef

```typescript
@params checkIndex: number,                  //位置
@params flags: NodeFlags,                    //节点类型
@params matchedQueriesDsl: null | [string | number,QueryValueType][], 
@params ngContentIndex: null | number,
@params childCount: number,                  //子节点数量
@params namespaceAndName: string | null,     //标签
@params fixedAttrs: null | [string, string][] = [],  //节点属性表
@params bindings?: null | [BindingFlags, string, string | SecurityContext | null][],
@params outputs?: null | ([string, string])[],   //监听的事件等
@params handleEvent?: null | ElementHandleEventFn, //事件处理函数
@params componentView?: null | ViewDefinitionFactory, //组件.ngfactory.js中返回的 view
@params componentRendererType?: RendererType2 | null //组件.ngfactory.js中的 render
@return 节点对象 NodeDef

function elementDef(...){
	....
}
```

##### 文本节点：textDef

```typescript
@params checkIndex: number,             //位置
@params ngContentIndex: number | null,  //
@params staticText: string[]            //静态文本属性
@return 节点对象 NodeDef

function textDef(...){
    ...
    }
```

##### 指令节点：directiveDef

```typescript
@params checkIndex: number,              //节点位置
@params flags: NodeFlags,                //节点标志
@params matchedQueries: null | [string | number, QueryValueType][], 
@params childCount: number,              //子节点个数
@params ctor: any,                       //指令构造函数
@params deps: ([DepFlags, any] | any)[], //
@params props?: null | {[name: string]: [number, string]},  //输入属性
@params outputs?: null | {[name: string]: string}           //输出属性
@return 节点对象 NodeDef

function directiveDef(
    )
```

##### 查询节点：queryDef

```typescript
与 @ViewChild 、@ContentChild  相关
`查询节点由指令的 queries 生成属于指令节点的子节点`

@params flags: NodeFlags,           //节点标志
@params id: number,                 //id ？？？？谁的id
@params bindings: {[propName: string]: QueryBindingType}   //绑定属性？？？
@return 节点对象 NodeDef

function queryDef(...){
    ...
}
```

##### 锚点节点：anchorDef

```typescript
`ng-template 和 ng-container 相关`

@params flags: NodeFlags, 
@params matchedQueriesDsl: null | [string | number, 
@params QueryValueType][],
@params ngContentIndex: null | number, 
@params childCount: number, 
@params handleEvent?: null | ElementHandleEventFn,
@params templateFactory?: ViewDefinitionFactory

function anchorDef(...){
    ....
}
```

##### 节点对象：NodeDef

```typescript
{
    nodeIndex: -1,
    parent: null,
    renderParent: null,
    bindingIndex: -1,
    outputIndex: -1,
    checkIndex,
    flags: NodeFlags.TypeText,
    childFlags: 0,
    directChildFlags: 0,
    childMatchedQueries: 0,
    matchedQueries: {},
    matchedQueryIds: 0,
    references: {}, ngContentIndex,
    childCount: 0, bindings,
    bindingFlags: BindingFlags.TypeProperty,
    outputs: [],
    element: null,
    provider: null,
    text: {prefix: staticText[0]},
    query: null,
    ngContent: null,
  };
```



##### checkAndUpdateView

`View变更检测`

```typescript
@params ViewData：View实例的数据

Ⅰ 检查View状态，如果是第一次检查，就打上标记，否则去除第一次检查的标记
Ⅱ 每次检查调用，检测是否处于需要调用 ngOnInit/ngAfterContentInit/ngAfterViewInit生命周期[是就返回true] 
Ⅲ 标记投影视图View
Ⅳ 更新指令,调用viewDef 的updateDirectives函数 传入对应环境的检查函数更新指令，
Ⅴ 嵌入视图【ng-container，ng-template】
Ⅵ 
export function checkAndUpdateView(view: ViewData) {
Ⅰ if (view.state & ViewState.BeforeFirstCheck) {
    view.state &= ~ViewState.BeforeFirstCheck;
    view.state |= ViewState.FirstCheck;
  } else {
    view.state &= ~ViewState.FirstCheck;
  }
Ⅱ shiftInitState(
    view,
    ViewState.InitState_BeforeInit,
    ViewState.InitState_CallingOnInit
  );
Ⅲ markProjectedViewsForCheck(view);
Ⅳ Services.updateDirectives(view, CheckType.CheckAndUpdate);
Ⅴ execEmbeddedViewsAction(view, ViewAction.CheckAndUpdate);
  execQueriesAction(
    view,
    NodeFlags.TypeContentQuery,
    NodeFlags.DynamicQuery,
    CheckType.CheckAndUpdate
  );
Ⅱ let callInit = shiftInitState(
    view,
    ViewState.InitState_CallingOnInit,
    ViewState.InitState_CallingAfterContentInit
  );
  callLifecycleHooksChildrenFirst(
    view,
    NodeFlags.AfterContentChecked | (callInit ? NodeFlags.AfterContentInit : 0)
  );

  Services.updateRenderer(view, CheckType.CheckAndUpdate);

  execComponentViewsAction(view, ViewAction.CheckAndUpdate);
  execQueriesAction(
    view,
    NodeFlags.TypeViewQuery,
    NodeFlags.DynamicQuery,
    CheckType.CheckAndUpdate
  );
  callInit = shiftInitState(
    view,
    ViewState.InitState_CallingAfterContentInit,
    ViewState.InitState_CallingAfterViewInit
  );
  callLifecycleHooksChildrenFirst(
    view,
    NodeFlags.AfterViewChecked | (callInit ? NodeFlags.AfterViewInit : 0)
  );

  if (view.def.flags & ViewFlags.OnPush) {
    view.state &= ~ViewState.ChecksEnabled;
  }
  view.state &= ~(ViewState.CheckProjectedViews | ViewState.CheckProjectedView);
Ⅱ shiftInitState(
    view,
    ViewState.InitState_CallingAfterViewInit,
    ViewState.InitState_AfterInit
  );
}
```

##### updateRenderer

```
@params _ck：更新节点node的函数  CheckAndUpdateNode 
@params _v : 视图View
```



#### ChangeDetectorRef【操控view更新机制】

```typescript
detectChanges：当前组件和所有子组件执行一次变化检测，不管组件的状态是什么【是否被禁用】
markForCheck：向上迭代直到根节点，将所有的父组件都启用检查。
checkNoChanges：保证当前执行的变化检测中，不会有变化发生。
detach：对当前视图禁用检查
reattach ：对当前组件启用检测
```

#### 模块module

```typescript
Angular 根据模块进行划分，
providers和entryComponents 是整个程序中的动态部分`dynamic content`，
模板中的指令，管道属于静态部分`static content`

无论声明多少模块，在编译后只会合并生成一个模块工厂，所有模块的providers 和 entryComponents 会被合并到一起【懒加载模块会有单独的 ngfactory工厂】
```



#### 生命周期

- `ngOnChanges` - 在[输入属性 (input)](https://angular.cn/guide/glossary#input)/[输出属性 (output)](https://angular.cn/guide/glossary#output)的绑定值发生变化时调用。
- `ngOnInit` - 在第一次 `ngOnChange` 完成后调用。
- `ngDoCheck` - 开发者自定义变更检测。
- `ngAfterContentInit` - 在组件内容初始化后调用。
- `ngAfterContentChecked` - 在组件内容每次检查后调用。
- `ngAfterViewInit` - 在组件视图初始化后调用。
- `ngAfterViewChecked` - 在组件视图每次检查后调用。
- `ngOnDestroy` - 在指令销毁前调用。

```typescript
在ng中 view 组成一个 view树，再将dom展示在页面中，因此每一个view都有自己的生命周期 也有与他的父级及子级之间的交叉生命周期。以便view之间进行通讯【父->子传递参数,子->父 广播事件】和组成完整的页面。

1.父子之间如果传递参数，子init周期必定在父传递参数之后，因此 `ngOnChanges` 在 `ngOnInit` 之前
2.因为要支持 投影试图，所以在子视图完成前需要完成投影试图，`ngAfterContentInit`在 `ngAfterViewInit`之前
3.视图要进行检查之前需要检查投影试图，`ngAfterContentChecked` 在 `ngAfterViewChecked`
4.`ngOnDestroy`
5.`ngDoCheck` 
```

