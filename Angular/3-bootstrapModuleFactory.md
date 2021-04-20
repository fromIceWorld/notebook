## bootstrapModuleFactory

在 bootstrapModuleFactory 获取 ngZone ，将对应代码运行在  ngZone  上下文，对代码中的异步操作进行拦截。

```typescript
  bootstrapModuleFactory<M>(moduleFactory: NgModuleFactory<M>, options?: BootstrapOptions):
      Promise<NgModuleRef<M>> {
    // Note: We need to create the NgZone _before_ we instantiate the module,
    // as instantiating the module creates some providers eagerly.
    // So we create a mini parent injector that just contains the new NgZone and
    // pass that as parent to the NgModuleFactory.
    const ngZoneOption = options ? options.ngZone : undefined;
    const ngZoneEventCoalescing = (options && options.ngZoneEventCoalescing) || false;
    const ngZoneRunCoalescing = (options && options.ngZoneRunCoalescing) || false;
    const ngZone = getNgZone(ngZoneOption, {ngZoneEventCoalescing, ngZoneRunCoalescing});
    const providers: StaticProvider[] = [{provide: NgZone, useValue: ngZone}];
    // Note: Create ngZoneInjector within ngZone.run so that all of the instantiated services are
    // created within the Angular zone
    // Do not try to replace ngZone.run with ApplicationRef#run because ApplicationRef would then be
    // created outside of the Angular zone.
    return ngZone.run(() => {
      const ngZoneInjector = Injector.create(
          {providers: providers, parent: this.injector, name: moduleFactory.moduleType.name});
      const moduleRef = <InternalNgModuleRef<M>>moduleFactory.create(ngZoneInjector);
      const exceptionHandler: ErrorHandler|null = moduleRef.injector.get(ErrorHandler, null);
      if (!exceptionHandler) {
        throw new Error('No ErrorHandler. Is platform module (BrowserModule) included?');
      }
      ngZone!.runOutsideAngular(() => {
        const subscription = ngZone!.onError.subscribe({
          next: (error: any) => {
            exceptionHandler.handleError(error);
          }
        });
        moduleRef.onDestroy(() => {
          remove(this._modules, moduleRef);
          subscription.unsubscribe();
        });
      });
      return _callAndReportToErrorHandler(exceptionHandler, ngZone!, () => {
        const initStatus: ApplicationInitStatus = moduleRef.injector.get(ApplicationInitStatus);
        initStatus.runInitializers();
        return initStatus.donePromise.then(() => {
          if (ivyEnabled) {
            // If the `LOCALE_ID` provider is defined at bootstrap then we set the value for ivy
            const localeId = moduleRef.injector.get(LOCALE_ID, DEFAULT_LOCALE_ID);
            setLocaleId(localeId || DEFAULT_LOCALE_ID);
          }
          this._moduleDoBootstrap(moduleRef);
          return moduleRef;
        });
      });
    });
  }
`主要是 ngZone.run中的函数`
`Injector.create 走《0-begin》中的 【2.2-Injector】`:生成对应_record<Map>{
    NgZone : {deps:[],value:ngZone,fn:IDENT, useNew:false}
}
```

#### ngZone.run()

```typescript
将代码运行在`<ngZone>`中
创建 ngZoneInjector 注入
生成 模块实例：moduleFactory.create
```

##### moduleFactory.create

```typescript
@params moduleType：模块AppModule.ts
@params _bootstrapComponents：启动根组件
@params _ngModuleDefFactory：合并后的依赖模块的模块工厂函数

class NgModuleFactory_ extends NgModuleFactory<any> {
  constructor(
    public readonly moduleType: Type<any>,
    private _bootstrapComponents: Type<any>[],
    private _ngModuleDefFactory: NgModuleDefinitionFactory
  ) {
    // Attention: this ctor is called as top level function.
    // Putting any logic in here will destroy closure tree shaking!
    super();
  }

  create(parentInjector: Injector | null): NgModuleRef<any> {
    initServicesIfNeeded();
    // Clone the NgModuleDefinition so that any tree shakeable provider definition
    // added to this instance of the NgModuleRef doesn't affect the cached copy.
    // See https://github.com/angular/angular/issues/25018.
    const def = cloneNgModuleDefinition(
      resolveDefinition(this._ngModuleDefFactory)
    );
    return Services.createNgModuleRef(
      this.moduleType,
      parentInjector || Injector.NULL,
      this._bootstrapComponents,
      def
    );
  }
}
`--------`
initServicesIfNeeded()：初始化框架创建视图，检测视图，更新.....等服务。
resolveDefinition(this._ngModuleDefFactory)：
			运行_ngModuleDefFactory【见../模块.ngfactory.md】
```

###### resolveDefinition

```typescript
@params factory：jit_moduleDef_3被包装后的函数【见../模块.ngfactory.md】

function resolveDefinition<D extends Definition<any>>(
  factory: DefinitionFactory<D>
): D {
  console.log(factory); //合并后的依赖模块的模块工厂函数
  let value = DEFINITION_CACHE.get(factory)! as D;
  if (!value) {
    value = factory(() => NOOP);
    value.factory = factory;
    DEFINITION_CACHE.set(factory, value);
  }
  return value;
}

`-------运行factory,返回jit_moduleDef_3(...)`见【./模块.ngfactory.md】
return {
    factory: null,
    providersByKey,  //根据 providers 转换结果
    providers,       //参数providers
    modules,         //所有模块
    isRoot,          //是否是根模块
}

```

###### cloneNgModuleDefinition

```typescript
clone 避免影响 tree shakeable ？？？？？？
return {
    factory: null,
    providersByKey,  //根据 providers 转换结果
    providers,       //参数providers
    modules,         //所有模块
    isRoot,          //是否是根模块
}
```

#### Services.createNgModuleRef

创建模块实例

```typescript
@params moduleType： 模块AppModule.ts
@params parentInjector: ngZoneInjector
@params bootstrapComponents: 启动根组件
@params def：👆返回值

function debugCreateNgModuleRef(
    moduleType: Type<any>, parentInjector: Injector, bootstrapComponents: Type<any>[],
    def: NgModuleDefinition): NgModuleRef<any> {
  const defWithOverride = applyProviderOverridesToNgModule(def);
  return createNgModuleRef(moduleType, parentInjector, bootstrapComponents, defWithOverride);
}
`返回 模块实例 moduleRef`
```

