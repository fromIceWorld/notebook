# features

在编译后的指令def中有features 属性，暂时发现内部有 ngOnChanges，providers，viewProviders 等属性才会生成features

**执行阶段**：在ɵɵdefineComponent 阶段 会执行 **features** 中所有的函数

## ngOnChanges

在 指令有**ngOnChanges**生命周期时，会在features属性中添加 `ɵɵNgOnChangesFeature` 函数,

在生成def阶段【👆】运行features返回**NgOnChangesFeatureImpl**函数;

​                                    **registerPreOrderHooks** 在为指令添加setInput属性,并将                          

​                                    **rememberChangeHistoryAndInvokeOnChangesHook**，添加到tview.preOrderHooks 中，在特定时期执行

**setInput属性执行时机**：实例化指令时期，如果有输入属性，就执行 setInput函数

### ɵɵNgOnChangesFeature

```typescript
function ɵɵNgOnChangesFeature() {
    return function NgOnChangesFeatureImpl(definition) {
            if (definition.type.prototype.ngOnChanges) {
                definition.setInput = ngOnChangesSetInput;
            }
            return rememberChangeHistoryAndInvokeOnChangesHook;
        }
}
`给指令添加 setInput 属性`
```

#### NgOnChangesFeatureImpl

```
在 指令 registerPreOrderHooks 时执行，更新输入属性，并注册调用ngOnChanges的函数
```

#### ngOnChangesSetInput

```typescript
`resolveDirective时 调用，更新输入值`
function ngOnChangesSetInput(instance, value, publicName, privateName) {
    const simpleChangesStore = getSimpleChangesStore(instance) ||
        setSimpleChangesStore(instance, { previous: EMPTY_OBJ, current: null });
    const current = simpleChangesStore.current || (simpleChangesStore.current = {});
    const previous = simpleChangesStore.previous;
    const declaredName = this.declaredInputs[publicName];
    const previousChange = previous[declaredName];
    current[declaredName] = new SimpleChange(
                                    previousChange && previousChange.currentValue,
                                    value, previous === EMPTY_OBJ
                                );
    instance[privateName] = value;
}
`instance上的 __ngSimpleChanges__ 属性 存储 previous 和 current 值`

`对比 previous 和 current，更新instance的值`
```

#### rememberChangeHistoryAndInvokeOnChangesHook

```typescript
`调用生命周期钩子 ngOnChange 时调用 `
function rememberChangeHistoryAndInvokeOnChangesHook() {
    const simpleChangesStore = getSimpleChangesStore(this);
    const current = simpleChangesStore === null || simpleChangesStore === void 0 
                    ? void 0
                    : simpleChangesStore.current;
    if (current) {
        const previous = simpleChangesStore.previous;
        if (previous === EMPTY_OBJ) {
            simpleChangesStore.previous = current;
        }
        else {
            // New changes are copied to the previous store, so that we don't lose history for inputs
            // which were not changed this time
            for (let key in current) {
                previous[key] = current[key];
            }
        }
        simpleChangesStore.current = null;
        this.ngOnChanges(current);
    }
}
`1.` 获取 __ngSimpleChanges__ 顺序ing
`2.` 将current 值，更新到 previous中; 置current为null
`3.` 用currrent值作为参数 执行ngOnchanges 钩子。 

`用于执行指令的ngOnchanges生命周期钩子`
```

## providers，viewProviders

也会在features生成函数

#### ɵɵProvidersFeature

```typescript
function ɵɵProvidersFeature(providers, viewProviders = []) {
    return (definition) => {
        definition.providersResolver =
            (def, processProvidersFn) => {
                return providersResolver(def, //
                processProvidersFn ? processProvidersFn(providers) : providers, //
                viewProviders);
            };
    };
}
`添加 def.providersResolver 解析能力，在实例化指令前，解析providers，viewProviders 注入到BloomHash中供查询，并将实例
push 到lview中; def push到tview.data中`
```

