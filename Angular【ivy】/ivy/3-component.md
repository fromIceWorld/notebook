# compRef

组件实例，当在应用中挂载组件时，通过**module** 的 **_componentFactoryResolver**将 component<class> 解析成 【ComponentFactory$1】，然后创建 组件的 **view** 链，最后返回 compRef。

1. rootViewInjector

   ```typescript
   `0.` 依赖链，在创建rootLView 时 根据 _componentFactoryResolver 中存储的ngModule，确认是否与        module 建立依赖链 层级关系。
   `此依赖链 在LView[9]中存储，当新建lview 是，根据情况传递依赖，是view的依赖链`
   ```

2. rendererFactory

   ```typescript
   渲染工厂函数，用于创建DOM
   {
       eventManager,
       sharedStylesHost,   // style 样式
       appId,              // 随机生成的 ID
       rendererByCompId = new Map(),  // 存储不同的组件的渲染函数【hostRenderer】
       defaultRenderer = new DefaultDomRenderer2(eventManager)
   }
   `LView[10]存储渲染工厂，在lview中继承`
   ```

3. hostRenderer

   ```typescript
   `组件渲染函数`：encapsulation 配置不同，使用的渲染函数不同。
   Enum ViewEncapsulation{
       Emulated,
       ShadowDom    
   }
   根据 componentDef中配置的 encapsulation 生成的 渲染函数
   
   `LView[11]存储该渲染函数，每一个组件的encapsulation 可能不同，因此每次都会创建一个`
   ```

4. sanitizer

   ```typescript
   用于处理不安全的代码片段，防止 XSS【跨站脚本】
   `LView[12]存储转换函数，在lview中继承`
   ```

5. hostRNode

   ```typescript
   AppComponent的挂载 DOM: <app-root>
   ```

6. rootContext

   ```typescript
   `根组件的 上下文`:
   {
       components: [],   // 存储view的实例
       scheduler: scheduler || defaultScheduler,
       clean: CLEAN_PROMISE,
       playerHandler: playerHandler || null,
       flags: 0 /* Empty */
   }
   ```

7. rootTView，rootLView

   ```typescript
   根组件的 TView 和 LView
   const rootTView = [];
   const rootLView = [];
   `创建初始的 TView，LView`
   ```

8. createRootComponentView

   ```typescript
   `1.` 创建 tNode<#host>
   `2.` 合并host属性
   `3.` 创建 viewRenderer, 也就是👆的hostRenderer
   `4.` 创建 Tview， LView
   `5.` 为 tNode 创建 注入器  // 开辟BloomHash 区域
        将 自身 发布到 注入树中
        将组件标记为子组件
        初始化tNode的状态
   `6.` 将当前 lview 添加到 viewTree 中，行成树形结构  
        在添加过程中，不断更新 parentView的 CHILD_HEAD，CHILD_TAIL 数据
        CHILD_HEAD： head view，保存第一个子级view
        CHILD_TAIL： tail view,保存最后一个子级view。
   	【
           if (lView[CHILD_HEAD]) {
               lView[CHILD_TAIL][NEXT] = lViewOrLContainer;
           }
           else {
               lView[CHILD_HEAD] = lViewOrLContainer;
           }
           lView[CHILD_TAIL] = lViewOrLContainer;
   	】
       `在生成tree过程中，不断的更新CHILD_TAIL view，CHILD_TAIL view及CHILD_TAIL view的NEXT节点，这样就会保存head view，tail view，并且还会记录临近的下一个view, 建立关系`
   
   `7.` 将 lview 放入 rootLView 对应位置处    
   ```

9. createRootComponent

   ```typescript
   `1.` 实例化当前组件  // 解析组件中的 providers，viewProviders，扩展tNode的 BloomHash区域
                     // 实例化指令生成 nodeInjectorFactory，push存入lview，tview.blueprint
                     // def 存入 tView.data中
   `2.` 处理 features
   `3.` 执行组件的 contentQueries【create阶段】
   `4.` 如果当前组件有 hostBindings，hostAttrs，
        将 hostBindings 收集到 tView.hostBindingOpCodes
   ```

10. renderView

    ```typescript
    从根组件开始，执行渲染。
    `1.`  viewQuery 函数
    `2.` template 函数
    `3.` 当 ContentQueries 和 ViewQueries 是静态时，执行【update】操作
    ```

11. renderChildrenView

    ```typescript
    当 renderView 执行后，tView 会收集到所有子级component的 索引位置，再对children
    执行 renderView
    ```

12. return new ComponentRef$1(...)

    ```typescript
    `返回根组件实例`：
    {
        _rootLView,            // rootLView
        location,              // ElementRef 实例     
        _tNode,                // tNode
        instance,              // 组件实例
        componentType,         // 组件class    
        this.hostView = this.changeDetectorRef = new RootViewRef(_rootLView);    
    }
    
    ------------------------------------------------------------------------
    class ComponentRef$1 extends ComponentRef {
        constructor(componentType, instance, location, _rootLView, _tNode) {
            super();
            this.location = location;
            this._rootLView = _rootLView;
            this._tNode = _tNode;
            this.instance = instance;
            this.hostView = this.changeDetectorRef = new RootViewRef(_rootLView);
            this.componentType = componentType;
        }
        get injector() {
            return new NodeInjector(this._tNode, this._rootLView);
        }
        destroy() {
            this.hostView.destroy();
        }
        onDestroy(callback) {
            this.hostView.onDestroy(callback);
        }
    }
    ```


# 指令集

**这个指令与Angular的指令不同。**

组件的指令集就是 def.template 函数运行时内部执行的函数。

## ɵɵelementStart

DOM的创建节点指令

```typescript
`1.` 获取LView、TView         // instructionState.lFrame.lView
`2.` 获取lview[11] 上的 渲染函数
`3.` 创建 nativeNode  存入lview的对应索引上
`4.` 创建 tNode，创建时会解析tNode上的指令及reference  // tView.queries.elementStart(tView, tNode);
        `elementStartFirstCreatePass` // 节点第一次创建时的逻辑
`5.` 改变上下文中的当前 TNode   // instructionState.lFrame.currentTNode
`6.` 将 tNode的 属性 与 指令上的hostbinding属性 合并后应用到 nativeNode上【attrs，styles，classes】
`7.` 将 nativeNode append 到 parent 上
`8.` 记录 当前 节点的深度       //instructionState.lFrame.elementDepthCount++;
`9.` 实例化tNode上所有的指令，并运行指令的contentQueries【Create阶段】    // 实例化指令
`10` 将 tNode.localNames 与 索引列表匹配，并将值push到 lview中
```

### elementStartFirstCreatePass

第一次创建时，创建tNode的逻辑

```typescript
`1.`根据指令的参数 index 确定节点在lview的位置
            attrsIndex 从 consts获取节点的属性
            localRefsIndex 从 consts获取节点的 reference;
    建立 tNode
`2.`解析tNode上的directive指令【👇resolveDirectives】
`3.`解析出 tNode.attrs 中的 styles 和 classes 
      tNode.styles, tNode.classes 
`4.`解析tview中的 queries【contentQueries，viewQuery】     // tView.queries.elementStart(tView, tNode);
            
```

#### resolveDirectives

解析tNode上的指令，并将指令发布到**BloomHash** 上, 每一个tNode最多有一个**BloomHash**， 

lview:          [....,0,0,0,0,0,0,0,0,`parent.injectorIndex`,**nodeInjectorFactory**.....]// 第九位是tNode.parent.injectorIndex
tview.data:     [....,0,0,0,0,0,0,0,0,`tNode`,def....]        // 第九位是tNode
tview.blueprint:[....,0,0,0,0,0,0,0,0,`null`,nodeInjectorFactory....]

lview上的directive类型的 nodeInjectorFactory 会在 **ɵɵelementStart**阶段 实例化

```typescript
`1.` tNode 上的 attrs 与 指令的selector 进行匹配
`2.` 将指令的providers，viewProviders发布到依赖系统中
`3.` 如果匹配到的指令有组件的话，优先组件【将组件放到第一个】
`4.` 将当前tNode 标记为component   // 将tNode.index push 到 tView.component 中，在渲染children时使用
`5.` 将指令的@hostbinding 于 tNode.attrs 合并生成 tNode.mergedAttrs
`6.` 将指令的factory包装成 NodeInjectorFactory 存储到 `ivy`
`7.` 收集指令与的 exportsMap，以便与本地reference 匹配 {exportAs：directiveIdx} 
`8.` 如果指令有 contentQueries，hostBindings   更改 tNode.flag，标记当前tNode有contentQueries和hostBindings
`9.` 如果当前指令有 前置生命周期【ngOnChanges，ngOnInit，ngDoCheck】，将当前tNode.index存入tView.preOrderHooks
                 前置检查生命周期【ngOnChanges，ngDoCheck】，将当前tNode.index存入tView.preOrderCheckHooks

`10.`处理指令的inputs，outputs属性,将所有的指令的inputs，outputs收集后存储到
     `publicName`是入参名称; `internalName` 是内部名称
     tNode.inputs = {
         publicName:[directiveDefIdx,internalName,directiveDefIdx,internalName,....]
     }
	 tNode.outputs = {
         publicName:[directiveDefIdx,internalName,directiveDefIdx,internalName,....]
     }
     tNode.initialInputs  // 输入属性
`11.`将 localRefs 与 exportsMap做匹配，匹配成功后将 localRefs[i] 与 匹配到的指令的索引存入tNode.localNames中
     tNode.localNames.push(localRefs[i], index)
`12.`最后再合并一次属性，这样组件的属性的优先级就最高
`13.`返回 当前tNode是否有指令。
```

##### findDirectiveDefMatches

指令与tNode属性进行匹配

```typescript
tNode的属性 与 指令的 selector 进行匹配，匹配到的指令 发布到tNode的 `BloomHash` 区域。
并将 指令的 factory 包装成 NodeInjectorFactory 添加到 ivy上【lview，tview.blueprint】 
    指令的 def 存储到 tview.data中 与 lview，tview.blueprint 映射。
```

###### NodeInjectorFactory

将指令，providers和viewProviders的factory 包装成 NodeInjectorFactory存储到 lview，tview.data，tview.blueprint 中

**NodeInjectorFactory**：指令，providers和viewProviders 的 factory加一些状态符号。

```typescript
@params factory                // 指令的 factory
@params isViewProvider         // 处理viewProviders 会置为true，provider会置为false
                               // 处理组件类型的指令时 为true，指令为false
@params injectImplementation   // viewProviders和 provider 是 ɵɵdirectiveInject
                               // 指令 是null
                               //  ɵɵdirectiveInject 是依赖查找函数【在BloomHash中查找】
`injectImplementation` 默认是 injectInjectorOnly 实现，只 _currentInjector中查找， // null
                       可更改为 directiveInject【ivy的NodeInjector】    // ɵɵdirectiveInject
                       原因：1- injector 不应该依赖 ivy 的逻辑
                            2- 为了 tree-shaking，不想引入不必要的代码

class NodeInjectorFactory {
    constructor(factory, isViewProvider,injectImplementation) {
        this.factory = factory;
        this.resolving = false;
        this.canSeeViewProviders = isViewProvider;
        this.injectImpl = injectImplementation;
    }
}

`1.` 配置 injectImpl 为 ɵɵdirectiveInject 是 ivy的依赖查找方法
`2.` 在实例化指令时，如果有依赖注入，从tNode.injectorIndex位置找到BloomHash区域，在区域内查找是否存在依赖，存在依赖就将token      与 tview.data中存储依赖的位置区域对比，找到就返回索引，再在lview对应索引处找到 指令，如果是 NodeInjectorFactory，就运行      得出实例，已经是值就直接返回。
     未找到就根据 flag，确认是否再向上查找。
```

###### getOrCreateNodeInjectorForNode

获取/创建 tNode 上的指令的依赖注入位置，每一个tNode在创建时都会匹配指令，每一个匹配的指令都会发布到 **BloomHash**区域中

tNode.injectorIndex 是固定的，当tNode.injectorIndex固定时，当前tNode的**BloomHash**区域也就确定了

```typescript
`1.` 在tNode上匹配到指令时，在lview上创建注入器
     lview:          [....,0,0,0,0,0,0,0,0,`parent.injectorIndex`]// 第九位是tNode.parent.injectorIndex
     tview.data:     [....,0,0,0,0,0,0,0,0,`tNode`]        // 第九位是tNode
     tview.blueprint:[....,0,0,0,0,0,0,0,0,`null`]
`2.` 如果当前tNode 有parent，BloomHash 也会收集 parent的 BloomHash
      BloomHash = BloomHash | parentBloomHash

`由于在当前tNode就可以判断injector是否存在于当前tNode 链中，所以`
```

###### diPublicInInjector

将 指令 发布到 **BloomHash**

```typescript
diPublicInInjector(injectorIndex, tView, def.type){
	bloomAdd(injectorIndex, tView, token);
}
------------------------------------------------------
`0.` def.type 是指令的 class
`1.` 每一个 class 会有一个唯一的 `__NG_ELEMENT_ID__` 属性，作为唯一标记，发布到指令对应的BloomHash中 
```

#### providersResolver

解析指令上的providers，存入BloomHash中，在实例化指令时查找依赖【searchTokensOnInjector】，在BloomHash中确认是否存在，在ivy中查找指令实例

```typescript
`1.`解析指令上的providers 和 viewProviders；
    getOrCreateNodeInjectorForNode， diPublicInInjector 处理provider
    将providers 发布到 `BloomHash`上。
------------------------------------------------------------------------------
tNode.providerIndexes 初始是 providers在lview上存储的起始索引。
在解析providers时，会先处理viewProviders，碰到viewProviders会 +1048576【20位】并将provider处理成NodeInjectorFactory 
push 进lview，tview.data,tview.blueprint
因此最终的tNode.providerIndexes代表了providers在lview上存储的起始索引 和 viewProviders的数量。
`如何根据tNode.providerIndexes  获取providers在lview上存储的起始索引？？？？ `
`1048575`：11111111111111111111【20位】
`1048576`：100000000000000000000【21位】
tNode.providerIndexes = tNode.providerIndexes & 1048575【因为每次遇到viewProviders都会从第21位 +1;在前20位保存我们原始的tNode.providerIndexes】
我们可以通过tNode.providerIndexes >> 20 获取viewProviders的个数
          tNode.providerIndexes & 1048575 获取原始的tNode.providerIndexes
并且我们先处理的viewProviders，所以可以在查找依赖时规避掉viewProviders


当我们在查找依赖时，通过 NodeInjectorFactory.canSeeViewProviders 确定查找范围，可规避掉viewProviders
`规避方法`：tNode.providerIndexes + tNode.providerIndexes >> 20   就是providers的存储区域起点



`2.`在实例化指令阶段ɵɵInject查询依赖，通过tNode.providerIndexes 在BloomHash区域查找
    根据 NodeInjectorFactory.canSeeViewProviders 确定起始查找范围
    根据 @Host指令，可确定结束点 ：当有@Host指令时，只有 viewProviders 和 component 可见
    
`终`：因此查找时，根据NodeInjectorFactory.canSeeViewProviders 确认是否查找viewProviders
     tNode.flag【@Host指令】确认查找结束点。
     因为@Host只查找viewProviders和组件，因此如果 NodeInjectorFactory.canSeeViewProviders == false;
     就不用查找了，直接对比tNode.directiveStart【组件】与token。
    
`viewProviders 和providers的区别：`    
```

##### getOrCreateInjectable

1. providersResolver 将providers和viewProviders 发布到BloomHash及lview中
2. resolveDirectives将指令发布到BloomHash及lview中

**getOrCreateInjectable** 从*NodeInjectors => ModuleInjector.*查找依赖

```typescript
`1.` tNode.injectorIndex 获取BloomHash 区域的起始索引
`2.` 根据token的 `NG_ELEMENT_ID`获取token的标识
`3.` 在 BloomHash区域中查找是否存在 `NG_ELEMENT_ID`，存在就直接在tview的 providers和directives区域中查找对应token【对比      的是def和token】，找到就返回索引，在lview的对应索引查找对应的值，如果还是factory就实例化，已经是值就直接返回

`在查找的过程中，会有viewProviders和providers的限制; @Host，@Self的限制`
组件才能找看到viewProviders // 因为 viewProviders是@Component的参数，
                         // providers是@Component从@Directive上继承的属性
当向上查找穿过children view->parent view时，只有parent是组件才能看到 viewProviders

```

## ɵɵelementEnd

关闭节点的指令

```typescript
`1.` 获取当前的 tNode
`2.` 更改节点深度  // instructionState.lFrame.elementDepthCount--;
`3.` 根据tNode 的 【directiveStart - directiveEnd】，将指令的
     {ngAfterContentInit, ngAfterContentChecked, ngAfterViewInit, ngAfterViewChecked, ngOnDestroy}
	 生命周期函数 和 对应索引[directiveStart]分组后,放入tView对应的
     {contentHooks，contentCheckHooks，viewHooks，viewCheckHooks，destroyHooks}
`4.` 如果当前节点有 ContentQueries，执行tView.queries.elementEnd(currentTNode);  // 
`5.` 处理 tNode.classesWithoutHost  和 tNode.stylesWithoutHost 
     // `<div style="..." my-dir>` and `MyDir` with `@Input('style')` 
```

## ɵɵtemplate

创建 移植视图：<ng-template>， *ngTemplateOutlet

```typescript
`1.` 创建tNode 👇【templateFirstCreatePass】
`2.` 创建nativeNode，都是 comment类型的节点 // 注释节点
`3.` 将nativeNode加入到 DOM树中
`4.` 创建`LContainer` 放入 lview中
`5.` 如果有指令，实例化指令
`6.` 查找映射名称 #reference
```

### LContainer

lview上的 存储的第三类节点数据

第一类：nativeNode

第二类：lview

**第三类：LContainer**

第四类：pipeInstance    // pipe的实例 

第五类：local refs          // 节点的 local reference

```typescript
const lContainer = [
    hostNative, // host native
    true,  // Boolean `true` in this position signifies that this is an `LContainer`
    false, // 标记当前LContainer中是否有移植的视图，在更新时用
    currentView, // parent view
    null,  // next
    0,     // transplanted views to refresh count
    tNode, // t_host
    native, // nativeNode, 注释节点
    null, // view refs
    null  // 存储移植视图
];
```



### templateFirstCreatePass

具体创建过程和 elementStartFirstCreatePass 类似，但是会为tNode创建专属tViews属性，属于节点内部的指令集函数

```typescript
`1.` tNode.tViews = createTView(2 /* Embedded */, tNode, templateFn, ...)
                        // templateFn 是外部指令集函数
`2.` 会注册指令的后置生命周期钩子    
`3.` 专属于template的 视图查询                                
```

## ɵɵelementContainerStart

<ng-container> 的创建指令集

```typescript
与 ɵɵelementStart 和 ɵɵtemplate 功能类似。
`不同`：
`1.` 创建的nativeNode 时 comment 注释类型的DOM
`2.` tNode 创建 `elementContainerStartFirstCreatePass`
```

### elementContainerStartFirstCreatePass

创建 <ng-container> tNode

```typescript
与 ɵɵelementStart 创建tNode类似
```

## ɵɵtext

创建静态的 text 节点

```
创建 text节点 插入lview 和 parent DOM
```

## ɵɵpipe

pipe，管道；用于处理输入属性

```typescript
@params index
@params pipeName

`1.` 根据pipeName 从 tview.pipeRegistry 中获取pipeDef，存入 tview.data的 index位置
`2.` 实例化 pipe，设置includeViewProviders为false【因为pipe无法获取viewProviders】
                 设置_injectImplementation 为ɵɵdirectiveInject【依赖查询的方法】
`3.` 将 pipeInstance 存入 lview 的 index 索引处。

`在Update阶段 获取 pipeInstance`
```

