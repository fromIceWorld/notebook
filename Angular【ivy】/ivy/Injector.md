# Injector

注入器，可处理 Module的依赖，也可单独处理providers，

1. 有def 时处理 def.imports，导入的依赖
2. 有additionalProviders，处理额外的providers



```typescript
@params def                  // ngModuleType 注入的模块类【处理imports的模块的providers】
@params additionalProviders  // 存储到依赖中的 providers
@params parent               // 上级 Injector
@params source               // 标记当前Injector 的 来源，用于Debugger

`Injector会深度遍历处理 def.imports及providers，将触及的providers都收集到records中`
{
    parent： 父级Injector
    records: providers存储的地方
    injectorDefTypes: 此注入器的可传递集，// 从当前模块开始所有依赖的模块
                      可在@Injectable中配置 provideIn为 module，
                      在查找token时，判断是否将@Injectable类token注入当前Injector
                      与 👇scope 判断一样
    onDestroy： 收集 有 ngOnDestroy 的实例
    _destroyed： 当前Injector的状态，标记当前Injector 是否已被销毁
    scope： 当前Injector的作用域，可在判断@Injectable类token时与provideIn 对比，判断是否将                     @Injectable类 token 注入到当前 Injector 
    source：👆
}
------------------------------------------------------------------------------

class R3Injector{
    constructor(def, additionalProviders, parent, source = null) {
        this.parent = parent;
        this.records = new Map();
        this.injectorDefTypes = new Set();
        this.onDestroy = new Set();
        this._destroyed = false;
        const dedupStack = [];
        additionalProviders &&
            deepForEach(additionalProviders, provider => this.processProvider(provider, def, additionalProviders));
        deepForEach([def], injectorDef => this.processInjectorType(injectorDef, [], dedupStack));
        // Make sure the INJECTOR token provides this injector.
        this.records.set(INJECTOR$1, makeRecord(undefined, this));
        // Detect whether this injector has the APP_ROOT_SCOPE token and thus should provide
        // any injectable scoped to APP_ROOT_SCOPE.
        const record = this.records.get(INJECTOR_SCOPE);
        this.scope = record != null ? record.value : null;
        // Source name, used for debugging
        this.source = source || (typeof def === 'object' ? null : stringify(def));
    }
}
```

## processProvider

处理 providers

```typescript
@params provider      // provider
@params ngModuleType  // 所属模块
@params providers     // providers
`1.` 由于provider有多种形态，因此需统一处理确认 token：
            有__forward_ref__
            {provider:***,deps:[]}      
             class ** 
     provider还有配置方式：usevalue，factory，class        
        
         
`2.` 构造 record，根据provider的配置，解析成factory。
     usevalue 优先级最高
     class 类型的provider，会解析 class 的 `ɵfac` 属性 作为 record的factory
                         如果没有`ɵfac` 就 解析 `ɵprov` 属性【@Injectable】
     useFactory
     useExisting:
     useClass： 也是 `ɵfac` 属性优先级高，没有 `ɵfac` 才会调用 new
`3.` 生成 record     
    {
        factory
        value: NOT_YET = {}
        multi:
    }
`4.` 根据 provider的multi 配置，确认provider是否是多privoder 组合的 【例如compilerOptions】 
      `1.` 单provider，直接将 record 和 token 存入 records
      `2.` 多provider，将 provider存入 multiRecord【第一次生成的record】中的 multi属性中 
                      将 <token, multiRecord>存入 records
                      再将provider 作为token 存入 records中
           这样处理即将所有相同的依赖收集到了一起，还将依赖单独收集，在运行factory时能找到相同依赖          
```

## processInjectorType

处理 ngModule，也就是模块中的providers。

```typescript
`1.` 处理 module 中的 imports的所有模块，及imports的模块的providers
`2.` 将 imports的 模块收集到 records中，同时将模块的providers也收集到records中
```

## get

从 Injector 中 获取收集的依赖

```typescript
`1.` 根据 InjectFlags 决定查找的范围 @Self，@Optional，@SkipSelf，@
`2.` 如果当前 Injector中没有查找到对应token，再判断 token 是否被@Injectable装饰过，
               如果是被 @Injectable装饰过的token，再判断 @Injectable的 provideIn 属性是否与当前                  Injector的scope/injectorDefTypes匹配，匹配才能将token记录到当前Injector的records                并返回
`3.` 根据token查到的record，运行record.factory函数。
     将 record.factory的结果赋值到 record.value上，缓存结果，避免二次运算。

在当前Injector未找到 对应token，根据当前Injector存储的parent。查找上级的Injector
`这就是依赖查找链`
```

