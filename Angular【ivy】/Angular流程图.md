# 平台

`Platform`：Platform 仅仅提供项目运行所需要的基础能力。

```typescript
`1.`core
`2.`core：dynamic
`3.`browser

收集各层级的provider，初始化平台 Platform{
    `_injector`:各层级的provider
}
```

## 模块

`module`：模块是 Angular 模块化的一种实现，【在 Dart版本无模块】

模块默认在 zone 中 运行，因此需要引入 zone【provider】的 Injector，zone 的 parentInjector 就是 Platform的 _injector

模块的 _r3Injector 的 parentInjector  是  zoneInjector

```typescript
`injector 层级`
platForm[Injector] ----> zone[Injector] ----> module[Injector]

层级依赖            ----> Zone依赖        ----> ComponentFactoryResolver，NgModuleRef
```

### 应用

模块module是Angular 模块化的方法，不是必须存在的，但项目需要有root，因此应用作为Angular启动的 root。 

根模块AppModule 的 import依赖  Application，引导根模块AppModule的 bootstrapComponents 去渲染页面 

```typescript
一个主体，项目实例。【类似于  Vue 中的 const app = new Vue(....)】
```

#### 组件

`组件是 页面组成的重要成分，依附于 Application，属于module`

因此 会有 injectorChain【依赖注入链】 【组件rootLView -> module, 根据flag，去injector中 get】// 

```
组件 有一层 rootViewInjector【依赖注入链，父级是AppModule】，rootTView，rootLView,TNode
rootTView，rootLView,TNode 记录组件数据
```



##### 依赖

**依赖提供者**：@Injectable  

```typescript
@Injectable 配置 providedIn?: Type<any> | 'root' | 'platform' | 'any' | null
控制服务注入的层级 root[根模块]，platform[平台]，any[在每个惰性加载的模块中提供一个唯一的实例，而所有急性加载的模块共享一个实例]
```

**依赖提供者**：providers

```typescript
`模块/指令元数据中的providers`：
provider：token    //provider的 token
---------指定 provider 如何创建依赖值------
useClass： //  使用 new Logger                                [{ provide: Logger, useClass: Logger }]
useExisting：// 创建依赖的别名;[{ provide: aliasLogger, useExisting: Logger }]，
            //  依赖别名 aliasLogger，但是真实依赖还是Logger
useValue：  // 注入对象
useFactory：// 使用构造函数，添加deps属性，
					{ provide: HeroService,
                        useFactory: heroServiceFactory,
                        deps: [Logger, UserService]
                      }
              // heroServiceFactory(Logger, UserService)； heroServiceFactory 依赖deps，构造时注入deps


```

**依赖消费者**：构造函数 , @Inject

```typescript
`R3Injector,存储两类依赖：
1. additionalProviders： 明确要添加的依赖
2. processInjectorType： class 中 的 imports【ɵinj中】 和 providers
`
R3Injector{
	parent：上一层级的injector,
	records:记录 provider,
    injectorDefTypes:注入的providers 的 class，  
                                 // 例如：注入 AppModule 的 【CommonModule，ApplicationModule，BrowserModule】
	_destroyed:状态【是否被销毁？】
	scope：作用域
	source：记录 injector 的所属【用于在debugger 时，查看】  // 'Platform: core','AppModule',
    `-------------------------------------------`
    get(token, ..., flag){
        
        }
}

`processProvider`:解析 additionalProviders 添加到 record  【additionalProviders是要注入的依赖】
`processInjectorType`:会解析 模块的 ɵinj 属性 添加到 record【ɵinj 属性会解析 module.imports】

@Inject(token) 根据 token 去查找对应服务
```

