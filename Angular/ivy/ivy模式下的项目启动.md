# ivy模式

```typescript
`核心`：「Decorator as Compiler」,在「装饰器」应用的过程中即完成了对相应类型的编译设置，不再具备独立的编译阶段【装饰器解析阶段,设置class 的静态属性的特性[get],在获取静态属性时，触发get,编译对应的模块/组件/注入/管道/参数.....】
```



### platformBrowserDynamic

```typescript
`浏览器`：
[
   {provide: InjectionToken, useValue: 'browser'},
   {provide: InjectionToken(Initializer), useValue: initDomAdapter, multi: true}
   {provide: InjectionToken, useFactory: _document, deps: Array(0)}
]
`coreDynamic`:
[
    {provider:InjectionToken(compilerOptions),useValue:{}},
    {provider:CompilerFactory,useClass:JitCompilerFactory,deps:[compilerOptions]}
]
`平台核心`
[
    {provide: PlatformRef, deps:[Inject]},
    {provide: TestabilityRegistry},
    {provide: Console},
]
`此阶段 是平台依赖注入，最顶级为NullInjector`【R3Injector,是依赖注入器】
    
platformBrowserDynamic() 收集各层级依赖【浏览器依赖，平台依赖，核心依赖】,存放到`PlatformRef`中的`_injector`中。
1. 获取 `Initializer`,运行初始化平台
2. 返回`PlatformRef实例`
```

#### .bootstrapModule(AppModule)

```typescript
在引导 AppModule 时,内部函数会将 AppModule 编译成 模块工厂函数`【与 之前的 view engine 不同😣】`;
```

##### compileNgModuleFactory(this.injector, options, *moduleType*)

```typescript
@injector    PlatformRef实例的`_injector`
@options     配置
@moduleType  AppModule

生成 NgModuleFactory$1 实例，内部注册模块的 imports[会编译所有的imports模块],【AppModule的 BrowserModule,commonModule 和 业务模块】

`NgModuleFactory$1`：{
    moduleType：AppModule,
}
```

###### .then(*moduleFactory* => this.bootstrapModuleFactory(*moduleFactory*, options))

```typescript
@moduleFactory  `NgModuleFactory$1`
```

#### bootstrapModuleFactory

```typescript
`属于 PlatformRef实例的方法`
`1.` 创建 ngZone 的依赖注入 = [{ provide: NgZone, useValue: ngZone }]
`2.` 获取 `ngZone` 使应用运行在 ngZone 上下文。
`3.` 创建 moduleRef：{
        parent：ngZoneInjector,
        _r3Injector:存储从AppModule起始的模块的链式依赖【imports，providers】
        _bootstrapComponents:[class]
        componentFactoryResolver：组件解析函数
        destroyCbs:[销毁时回调]
        injector：自身
        instance:模块实例
}
`4.` this._moduleDoBootstrap(moduleRef)
```

##### _moduleDoBootstrap

```typescript
@params moduleRef
从moduleRef的依赖中 取出 `ApplicationRef` //应用
如果有引导组件(_bootstrapComponents)：循环执行 ApplicationRef.bootstrap(fn)，挂载组件
没有引导组件，就使用 moduleRef.instance.ngDoBootstrap【需要在AppModule中自定义ngDoBootstrap去引导启动】
```

##### bootstrap【ApplicationRef引导组件】

```typescript
@params componentOrFactory 
`1.` 根据传入的参数判断 是否需要解析成 componentFactory：
	    正常情况下需要获取componentDef,生成 componentFactory
`2.` compRef = componentFactory.create(Injector.NULL, [], selectorOrNode, ngModule) 
     // 生成组件实例，
     // 创建视图链式依赖注入   
`3.` this._loadComponent(compRef)

compRef:{
    _rootLView: 根 LView，记录组件的LView 和 组件的上下文【包裹一层的意义】
    _tNode:     根 Node，虚拟节点【存在的意义？？？】 
    componentType:组件class
    hostView: RootViewRef【】
    instance: 组件实例，是视图的上下文
    location:存有视图的原生节点(nativeElement)【ElementRef 可获取视图的DOM】
}
```

###### this._loadComponent(compRef)

```typescript
this 指向-> `ApplicationRef`
`1.` 将 compRef 存入 ApplicationRef 的_views中。
`2.` this.tick(); _views循环执行 view.detectChanges()，执行变更检测

`ApplicationRef`:{
    _views:[RootViewRef]
}
```











#####  ngZone 上下文

```typescript
根据ngZone 的provider和应用的_Injector,创建有父级的 ngZoneInjector 小型注入器，供创建模块实例时使用。

获取 AppModule 的 `moduleRef`：
moduleRef = moduleFactory.create(ngZoneInjector);

初始化应用【运行 `ApplicationInitStatus`provider 】
```

#### app.module.ts

```typescript
ivy 将 app.module.ts中的注释 编译 成`ɵmod`和`ɵinj`添加到 class 的静态属性上。

会多出 `ɵinj`和 `ɵmod` 属性,没有之前的 [annotation].
`ɵinj`:{
    factory:ƒ AppModule_Factory(t) { return new (t || AppModule)(); }
    imports:(1) [Array(2)]  //引入的模块
    providers:(0) []
}
`ɵmod`:{
    bootstrap:(1) [ƒ]
    declarations:(3) [ƒ, ƒ, ƒ]
    exports:(0) []
    id:null
    imports:(2) [ƒ, ƒ]
    schemas:null
    transitiveCompileScopes:null
    type:class AppModule {\r\n}
}
`ɵmod`:属于 ngModuleDef
```

app.component.html

```typescript
`ɵcmp`:ngComponentDef 【一样的东西】

ivy 将 component 的 template  编译为指令形节点函数放到 作为静态属性 `ɵcmp`的属性之一，`ɵcmp`会挂载到 对应 `class` 上;
ivy 还会将 `ɵfac`作为静态属性 挂载到 `class`

class 是模板执行时的上下文 context;
class AppComponent{
    ....
}
AppComponent.ɵfac = function AppComponent_Factory(t) {
          return new (t || AppComponent)(...依赖注入);
        };
AppComponent.ɵcmp = ɵɵdefineComponent({
    type:AppComponent,
    selectors: [["app-root"]],
    viewQuery:视图查询函数,
    features:与 NgOnChanges相关？？？？,
    decls:28,
    var:4,
    consts: [
            [4, "ngTemplateOutlet", "ngTemplateOutletContext"],
            [3, "textContent"],
            ["dir", ""],
            ["back-color", "blue", 3, "dirEvent"],
            [2, "color", "goldenrod"],
            [1, "in"],
            ["id", "in2"],
            [2, "color", "indianred"],
            ["tochild", "title", 3, "childEmit"],
            ["tem1", ""],
          ],
   template:function AppComponent_Template(rf, ctx) {
       if (rf & 1) {
           E(0,'div')
           	T(1,'work')
           Eend()
           E(2,'h4')
           .....
       }
       if (rf & 2) {
           更新逻辑
       }
   }
   directives:[用到的指令],
   styles:[base64编码后的 样式地址]
}
)
```

##### ngComponentDef

```typescript
组件中的 `ɵcmp`的参数{
    type：组件类,
    selectors:选择器,
    viewQuery:视图查询函数【分创建和检查阶段】  
    features：
    decls：节点数量,
    vars: 组件中 绑定的信息【{{绑定}}】 
    consts: 记录所有节点上的属性,【在template函数的指令中传入index】
    template:视图模板函数【分创建和检查阶段】,
    directives:保存组件中用到的指令【所有疑似的指令】,
    styles:组件的样式
}
指令{
    hostVars：host bindings 【
    	父：`<child tooltip></child>`;
    	子：@HostBinding('tooltip') hostTitle = 'Hello World!';】
}
```

## 编译过程的参数

### instructionState[指令状态]

```typescript
const instructionState = {
	lFrame：{
		currentTNode: null,
        isParent: true,
        lView: null!,           //记录创建的所有元素
        tView: null!,           //
        selectedIndex: -1,
        contextLView: null!,
        elementDepthCount: 0,
        currentNamespace: null,
        currentDirectiveIndex: -1,
        bindingRootIndex: -1,
        bindingIndex: -1,
        currentQueryIndex: 0,
        parent: parent!,
        child: null,
        inI18n: false,
	},
	bindingsEnabled: true,
    isInCheckNoChangesMode: false,
}
`lView`[logic view]:每一个component实例，都会创建LView保存DOM 元素、绑定值和Directive 的实例，方便做变更检测和设置输入属性。
`tView`[template view]:template对同一组件的所有实例只创建一个共享实例。

Directive的实例存在`LView`，
将Directive的定义函数和创建DOM时也把对应的Node（TNode）放入`TVew`
```

### 编译过程概览：

```typescript
编译过程在装饰器编译阶段【有别于 view engine[有单独的编译环节]】

```

#### 组件编译

```typescript
`source：compileComponent函数`

@type      组件class
@metadata  @Component的参数

compileComponent(type, metadata){
	....
}
在编译组件阶段：会在组件class上挂载静态属性
	`ɵcmp`:设置class 的 ɵcmp 属性的 get。
       在 获取的时候会 返回 [ngComponentDef]属性。【第一次获取后就会缓存】
```

##### ngComponentDef

```typescript
`在编译过程中，会将 pipe`
```

#### 模块编译

```typescript
`source:compileNgModuleDefs函数`
@moduleType： 模块class, 
@ngModule：  @NgModule参数

compileNgModuleDefs(
    moduleType, ngModule, 
    allowDuplicateDeclarationsInRoot = false){
    ....
}
在编译模块阶段：会在模块class上挂载静态属性
	`ɵmod`:设置 class 的 ɵmod属性的get
       在 获取的时候会 返回 [ngModuleDef]属性。【第一次获取后就会缓存】
    `ɵinj`：   设置 class 的 ɵinj 属性的get配置
       在 获取的时候会 返回 [ngInjectorDef]属性。【第一次获取后就会缓存】
```

##### compileNgModuleDefs

```typescript

```

## 模板编译

```typescript
`source：parseTemplate`：根据传入template字符串，解析模板。返回{nodes，ngContentSelectors,....}

`source：class _Tokenizer`：解析 html 的标签/属性名称/text，分割为token。
`source：class Parser`：合并 连续的text，构造 `_TreeBuilder`
`source：class _TreeBuilder`：引用token 生成 element 数据对象【Element$1】
```

## 依赖注入_R3Injector

`ivy使用 R3Injector 依赖注入`

```typescript
R3Injector `1.` root依赖注入 
           `2.` 模块级依赖注入
           `3.` 组件级依赖注入【providers/viewproviders】
`2.`
模块的provider中配置的服务注入，会存入 `injector.records`中，类型如下:
【key:服务class,value:{
    factory: 【IndexService_Factory(t) {return new (t || jit_IndexService_0)();}】
    muti:
    value:{}
}】          
`3.`
组件的依赖注入是在 getOrCreateNodeInjectorForNode时，确定依赖索引injectorIndex，运行diPublicInInjector【布隆过滤器】，存储服务mask位置


在`模块实例化时`会创建依赖[R3Injector],递归处理imports 和providers,存储到 `injector.records`
```

### R3Injector

```typescript
class R3Injector {
	injectorDefTypes：依赖的所有模块【包括模块的依赖的依赖及模块自身】,
	records: 存储所有的依赖,
	parent：上级依赖
    _destroyed:依赖是否销毁
    scope:'root'
    source:'AppModule'
	onDestroy：在records中获取记录时，存储有 `ngOnDestroy`函数属性 的记录
    
	dedupStack：存储模块，判断是否重复依赖

   constructor(def, additionalProviders, parent, source = null)
}
```

