## tapable@^2.1.1

贯穿于webpack整个生命周期的插件管理机制【订阅-发布】

通过实现各种机制的Hook，进行事件通信

### Hook

基类

```typescript
/* 创建call函数 */
const CALL_DELEGATE = function(...args) {
	this.call = this._createCall("sync");
	return this.call(...args);
};

class Hook{
    constructor(arg = [], name = undefined){
        this._args = args;
        this.name = name;
        this.taps = [];            // 注册在当前hooks的回调信息
        this.call = CALL_DELEGATE; // 创建发布接口，调用call函数激发订阅taps 
	}
    _tap(type, options, fn){
        .....
        /* 注册接口，将回调注册到taps*/
    }
    compiler(){
        /* 抽象函数，会在派生类中覆盖*/
	}
    _createCall(type){
        /*初始化创建实例时，动态创建call*/
        return this.compile({
			taps: this.taps,
			interceptors: this.interceptors,
			args: this._args,
			type: type
		});
    }
    
}
```

#### SyncHook

基于Hook类的派生类【同步】

```typescript
class SyncHookCodeFactory extends HookCodeFactory {
	content({ onError, onDone, rethrowIfPossible }) {
		return this.callTapsSeries({
			onError: (i, err) => onError(err),
			onDone,
			rethrowIfPossible
		});
	}
}

const factory = new SyncHookCodeFactory();
const COMPILE = function(options) {
	factory.setup(this, options);
	return factory.create(options);
};

function SyncHook(args = [], name = undefined) {
	const hook = new Hook(args, name);
	hook.constructor = SyncHook;
	hook.tapAsync = TAP_ASYNC;
	hook.tapPromise = TAP_PROMISE;
	hook.compile = COMPILE;
	return hook;
}
```

#### 实例化SyncHook

```typescript
1. 覆盖了Hook 类 的 compiler 函数
2. 主体也还是调用 Hook

-------流程---
new Hook，Hook内部 动态创建 call 函数
                【调用 _createCall,再调用compiler】
`主要是compiler【内部是HookCodeFactory】`
```

### HookCodeFactory

hook对应的compiler的工厂函数

```typescript
class HookCodeFactory{
    constructor(config){
        this.config = config;
        this.options = undefined;
        this._args = undefined;
    }
    create(options){
        ....
        /* 根据type，生成不同的函数，new Function(...)*/
        /*
        	args      参数
        	header    函数体的声明部分
        	content   函数体
        	
        */
    }
    setup(instance, options){
        instance._x = options.taps.map(t=>t.fn)
	}
}
```

