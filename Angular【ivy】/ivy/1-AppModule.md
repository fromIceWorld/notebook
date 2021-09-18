# moduleRef

实例化 AppModule

const moduleRef = new NgModuleFactory$1(*moduleType*) 

​                                       = new NgModuleRef$1(*moduleType*, parentInjector)

```typescript
@params ngModuleType   // 模块
@params _parent   // 父级Injector，当有ngZone 是 父级是 NgZoneInjector
                       // NgZoneInjector的 父级是 platFormInjector
{
    _parent,                  // 父级Injector
    injector: NgModuleRef$1,  // this
    instance: 当前模块的实例,
    _bootstrapComponents:[]   // 模块的bootstrap 
    componentFactoryResolver: // 独属于当前模块的组件解析器
    _r3Injector：             // 解析当前模块的providers 及imports的模块和providers 
                              // 父级Injector是 _parent
}
`_r3Injector 父级Injector链接 ngZoneInjector，ngZoneInjector再链接PlatFormInjector`

class NgModuleRef$1 extends NgModuleRef {
        constructor(ngModuleType, _parent) {
        super();
        this._parent = _parent;
        this._bootstrapComponents = [];
        this.injector = this;
        this.destroyCbs = [];
        this.componentFactoryResolver = new ComponentFactoryResolver$1(this);
        const ngModuleDef = getNgModuleDef(ngModuleType);
        const ngLocaleIdDef = getNgLocaleIdDef(ngModuleType);
        ngLocaleIdDef && setLocaleId(ngLocaleIdDef);
        this._bootstrapComponents = maybeUnwrapFn(ngModuleDef.bootstrap);
        this._r3Injector = createInjectorWithoutInjectorInstances(ngModuleType, _parent, [
            { provide: NgModuleRef, useValue: this }, {
                provide: ComponentFactoryResolver,
                useValue: this.componentFactoryResolver
            }
        ], stringify(ngModuleType));
        this._r3Injector._resolveInjectorDefTypes();
        this.instance = this.get(ngModuleType);
    }
}
```

