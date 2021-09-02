# 构建项目的运行环境

由于Angular可跨平台，因此各功能分层组合【core，coreDynamic，browser】

**core**：Angular的核心功能,【PlatformRef，TestabilityRegistry，Console】

**coreDynamic**：核心功能的动态支撑功能【CompilerFactory】 (JIT | AOT)

**browser**：平台功能【initDomAdapter,document】

各层级除了有自身的核心功能，还有通用模块【compilerOptions】

`platformBrowserDynamic()`聚合各层级的providers，通过Injector.create(providers)创建平台依赖集合【scope:platform】，

然后实例化`PlatformRef`，再运行平台初始化【PLATFORM_INITIALIZER】

【由于平台是browser，因此运行initDomAdapter】

# 引导根模块启动

**前置**：平台初始化时已经收集各层级依赖生成`Injector`,实例化PlatformRef，生成`PlatformRef`

1. PlatformRef.bootstrapModule(AppModule)会生成 `NgModuleFactory$1` 【模块】

   ```typescript
   注册AppModule的imports中的模块【提前解析imports模块及imports再imports的`ɵmod`,】`？？？？？？？？？？？`
   配置 JIToptions【Injector.get(COMPILER_OPTIONS)】
   ```

2. bootstrapModuleFactory(NgModuleFactory$1)  需要NgZone

# 根模块启动前置

在加载我们的业务模块时，如果项目需要NgZone,需要先启动NgZone，使模块运行在NgZone中。

NgZone也有自己的Injector 【ngZoneInjector = [provider:NgZone, parent:平台Injector]】

```typescript
`依赖链的第二级 ngZoneInjector ` 【scope:null】
```

**依赖链层级**：`Injector【platform】` <== `Injector【NgZone】`

# 在NgZone中引导根模块启动

1. **实例化模块**：const moduleRef = NgModuleFactory$1.create(ngZoneInjector )

   ```typescript
   const moduleRef  = {
       _parent：Injector【NgZone】,
       injector:moduleRef,
       componentFactoryResolver:解析组件的函数[`其中ngModule是moduleRef`],
                                // 是标记位，在解析组件时，传递给组件，让组件记录所属的模块【AppModule】
       _bootstrapComponents: 根组件class
       _r3Injector:`收集AppModule及其
              import的module【AppRouterModule, BrowserModule, ChildModuleModule】和它们的providers`
              Map = {
       			class => {factory, multi,value },
                   InjectionToken => {factory, multi,value },
                       
                   ..............
   			}
   }
   `依赖链的第三级AppModuleInjector`【scope:'root'】
   ```

   

2. **使用根模块引导应用**：this._moduleDoBootstrap(moduleRef)

# 根模块需要运行在应用上

1. **在依赖中查找到应用**： const appRef = *moduleRef*.injector.get(ApplicationRef);

   ```typescript
   moduleRef.injector实际调用的是moduleRef._r3Injector,运行ApplicationRef对应的 factory，返回应用实例。
   ```

2. **应用引导模块中的bootstrapComponents** ：appRef.bootstrap(*f*)

   ```typescript
   `1.` 解析 class AppComponent{} 成 componentFactory【使用👆的componentFactoryResolver解析】
   `2.` const compRef = componentFactory.create(Injector.NULL, [], selectorOrNode, ngModule);
          创建 LView，TView
          rootViewInjector【ElementInjector，rootLView存储于】`依赖链的第四级ElementInjector`
   `3.` this._loadComponent(compRef);
   
   `依赖链的第四级ElementInjector`【rootViewInjector】
   这是属于指令的注入器。每一个指令如果配置providers/viewProviders都会有 ElementInjector
   ```

   

3. 的

# 应用引导组件渲染

1. **应用解析组件**：this._componentFactoryResolver.resolveComponentFactory(*componentOrFactory*)

2. **组件实例化**：const compRef = componentFactory.create(Injector.NULL, [], selectorOrNode, ngModule);

   ```typescript
   `1.` 建立rootview 和 模块的依赖链
   const rootViewInjector = ngModule ? createChainedInjector(injector, ngModule.injector) : injector;
   `2.` 找到组件挂载的 DOM【app-root】
   `3.` 
   ```

   

3. **引导组件渲染**：this._loadComponent(compRef);

