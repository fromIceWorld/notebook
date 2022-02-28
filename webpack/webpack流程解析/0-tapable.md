## Tapable

webpack 中 `plugin`的通信核心【发布-订阅模式】

```typescript
tapable 以 class hook 为基类，派生出有特定功能的 子 hook:

------同步钩子
    "SyncHook": 创建同步钩子
    "SyncBailHook": 执行中注册的回调返回非undefined时停止
    "SyncWaterfallHook": 接受至少一个参数，上一个注册的回调返回值作为下一个注册的回调的参数
    "SyncLoopHook": 执行过程中回调返回非undefined时再次执行当前回调;
-----异步钩子
    "AsyncParallelHook"：并行执行的钩子，当注册的所有的异步回调都并行执行完成后再执行callAsync/promise中的函数
    "AsyncSeriesHook"：串联钩子;

`tap`： 将回调注册到 hook 上
`call`：调用子类的 compiler, 动态生成回调函数 
```

### 基类Hook

提供 通讯的基础通用功能：`options`,`tap`

```typescript
class Hook{
    constructor(_args = [], name = undefined){
        this._args = args;        // 动态生成的函数的 形参
        this.name = name;         
        this.taps = [];           // 注册到当前hook 的 回调信息
        ....
    }
    compiler(){
        /* 在子类继承时会重写：
           实例化hook 时 会调用 HookCodeFactory 生成
        */
	}
    tap(options, fn){
        /*
            options 属于 入参配置信息，
            fn 属于 回调函数;
        */
        将传入的配置信息保存到`taps`中【根据before，stage，调整顺序】
	}
}
```

### HookCodeFactory

基类代码工厂函数，通过调用hook 中的call 函数，间接调用hook派生类的compiler函数，生成回调函数以执行

```typescript
根据 new **Hook(..) 时传入的参数，作为形参; // params
是否需要全局共享上下文，作为header;全局变量; //  header
将tap的回调函数，根据tap的属性，执行顺序，hook的特性，转换为 codeString组合起来;  //body

`生成函数`: fn = new Function( _args.join(','),
                             header + body
                            )
`拦截能力`：注册 intercept  方法插入自己的逻辑
```

### 流程

```typescript
let hook = new SyncHook(["param"],"newHook");  // 第一个参数是形参，第二个参数是 hook 的name
                                   // 上面HOOK 的参数
hook.tap({name:"jackxun"},()=>{})              // 第一个参数是tap 的配置信息，第二个参数是回调函数
hook.call("params-real",...)                   // 实参，会根据_args，生成执行函数，赋值给 call 函数
                                               // 然后执行call(...args)【在hook实例】
`call执行函数如何生成 ?`
 _args是函数的形参变量          //params
 _context是所有tap共享的上下文  // header
根据tap 配置的及所注册的hook类型，将taps 组合【串行，并行，同步，异步】生成代码   // body
          【next，tap，down，next...】
          
`执行 ?`
根据上步生成的fn【call】执行回调，将hook.call传入的参数传入fn;          
```

