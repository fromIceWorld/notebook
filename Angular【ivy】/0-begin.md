：

```typescript
项目由 Typescript 书写，启动前需要：
`1.`Typescript编译【主要是`装饰器`】
`2.`启动Angular【main.ts】    //Angular是业务编译器，将项目的业务代码，通过Angular编译
```

# main.ts文件

```typescript
依赖层级：【core > coreDynamic > browserDynamic】 
 `代码分层优点`：跨平台【替换第二层API】，编译方式更改【替换第一层API，aot/jit 切换】

`0.` 平台核心 providers            //PlatformRef
`1.` 平台动态核心 providers         //compiler相关 【JitCompilerFactory 或者aot编译】
`2.` 浏览器 providers              //DOM相关操作API


platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));

`platformBrowserDynamic`：

'1'：`Injector`收集程序运转需要的【core,coreDynamic,browser】依赖   //分层后需根据配置和平台整合providers
'2'：整合后用PlatformRef【provider之一】 创建并返回平台实例【_platform】， 

`bootstrapModule`:
属于_platform的能力,平台实例初始化完成后,加载业务代码【app.module是业务入口】
下见【1-bootstrapModule】
```

## Angular的三层依赖【providers】

#### 0-platformBrowserDynamic

```javascript
[
     [
    		{provide: PLATFORM_ID, useValue: 'browser'},
            {provide: PLATFORM_INITIALIZER, useValue: initDomAdapter, multi: true},
            {provide: DOCUMENT, useFactory: _document, deps: []},
     ],
    {
        provide: COMPILER_OPTIONS,
        useValue: {providers: [{provide: ResourceLoader, useClass: ResourceLoaderImpl, deps: []}]},
        multi: true
      },
  	{	provide: PLATFORM_ID, useValue: 'browser'},
]
`------------------------`
`浏览器依赖`：
    COMPILER_OPTIONS:        `XML请求的资源加载操作providers【ResourceLoaderImpl】`;
    PLATFORM_ID：           // 简单标记;
------核心内容：    
	PLATFORM_INITIALIZER:   // 浏览器初始化需要执行的 初始化操作【】;
	DOCUMENT:               // 浏览器的DOM操作API;

-----------------------------------------------------------------------------------------
`核心`：浏览器层的providers，主要是浏览器平台的操作【xhr请求，DOM操作】
```

#### 1-platformCoreDynamic

```javascript
[
    {provide: COMPILER_OPTIONS, useValue: {}, multi: true},
    {provide: CompilerFactory, useClass: JitCompilerFactory, deps: [COMPILER_OPTIONS]},
] 


`依赖`：
    COMPILER_OPTIONS：  // 编译配置信息
	CompilerFactory：   // 编译工厂函数： JIT编译 及其依赖【COMPILER_OPTIONS】

 '1.'：平台动态providers，主要是 编译相关 的providers。
 '2.'：命名为CoreDynamic动态的原因，应该也是 编译的动态配置【JIT编译 或者 AOT编译】
 
---------------------------------------------------------------------------------------- 
 `核心`;编译用的工厂函数[CompilerFactory]。
```

#### 2-platformCore

```typescript
[
      // Set a default platform name for platforms that don't set it explicitly.
      {provide: PLATFORM_ID, useValue: 'unknown'},
      {provide: PlatformRef, deps: [Injector]},
      {provide: TestabilityRegistry, deps: []},
      {provide: Console, deps: []},
    ];
`依赖`：
    PlatformRef            // 平台构造函数 PlatformRef;
    TestabilityRegistry    // 测试配置;
    Console                // console函数;
 
 '1.'：core 的providers 主要是最核心的  PlatformRef，项目也是由 PlatformRef 引导才能启动  
 
 ------------------------------------------------------------------------
`附加`：测试用[TestabilityRegistry],日志[Console]
`核心`：平台[PlatformRef]

```

## createPlatformFactory

```typescript
运行 createPlatformFactory函数 `递归收集收集各层级依赖 `

最终生成的Injector是收集的所有的平台所需的依赖。
```

### Injector

```typescript
Injector.create(各层级的 providers)  //收集存储所有providers
```

### createPlatform

```javascript
`1.`：injector.get(PlatformRef)  //生成平台实例
`2.`：运行初始化平台的相关 providers 【对平台初始化】
```

#### 输出 injector.get（token）

其他模块用到依赖时，通过【injector.get(token)】获取【_recods】中存储的依赖,然后进行【resolveToken操作】根据各种标志位，对依赖进行运行，将返回值作为参数传递给上级依赖，递归的运行依赖。

##### 输出injector.get(PlatformRef)

```typescript
`_record 中 对应的 PlatformRef 记录`：
PlatformRef  -->  {deps:[{token:Injector,options:OptionFlags.Default}],value:EMPTY,fn:PlatformRef,

`经过 resolveToken 解析`:
 PlatformRef 的依赖是 Injector，deps走 resolveToken 逻辑后返回的是 【StaticInjector实例】              
deps = [<StaticInjector实例>]
                   
最终：return new PlatformRef(...dep)
```

##### 输出injector.get(CompilerFactory)

```typescript
主要运行：resolveToken(CompilerFactory, record, _record, Injector.NULL, '', InjectFlags.Default)
deps:[{COMPILER_OPTIONS}]
最终 return new JitCompilerFactory(...deps)//参数是编译配置 _record 中的 COMPILER_OPTIONS
```

