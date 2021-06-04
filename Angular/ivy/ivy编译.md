# ivy编译

```typescript
`核心`：「Decorator as Compiler」,在「装饰器」应用的过程中即完成了对相应类型的编译设置，不再具备独立的编译阶段
```



### platformBrowserDynamic

```typescript
`浏览器`：
[
   {provide: InjectionToken, useValue: 'browser'},
   {provide: InjectionToken, useValue: initDomAdapter, multi: true}
   {provide: InjectionToken, useFactory: _document, deps: Array(0)}
]
`平台核心`
[
    {provide: PlatformRef, deps:[Inject]},
    {provide: TestabilityRegistry},
    {provide: Console},
]

platformBrowserDynamic() 收集各层级依赖【浏览器依赖，平台依赖，核心依赖】,存放到`PlatformRef`中的`_injector`中。返回
`PlatformRef实例`
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

生成 NgModuleFactory$1 实例，同时注册模块的 imports。【AppModule的 BrowserModule 和 业务模块】
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
`属于 PlatformRef实例`
获取 `ngZone` 使后续步骤 运行在 ngZone 上下文。
```

#####  ngZone 上下文

```typescript
获取 AppModule 的 `moduleRef`
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

