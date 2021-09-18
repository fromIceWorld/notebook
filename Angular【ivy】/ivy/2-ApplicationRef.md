# ApplicationRef

应用平台，当AppModule 实例化后，在ApplicationRef 中引导 AppModule.bootstrap中的组件进行渲染。

存储 渲染的view

然后监听 zone，在合适的时机进行脏检查。

```typescript
class ApplicationRef{
        this._zone = _zone;
        this._console = _console;
        this._injector = _injector;
        this._exceptionHandler = _exceptionHandler;
        this._componentFactoryResolver = _componentFactoryResolver;
        this._initStatus = _initStatus;
        /** @internal */
        this._bootstrapListeners = [];
        this._views = [];
        this._runningTick = false;
        this._stable = true;
        this.componentTypes = [];
        this.components = [];
        this._onMicrotaskEmptySubscription    // 观察 zone.onMicrotaskEmpty
                       // 当触发时，ApplicationRef触发this.tick(),进行视图检查                       
}
```

