# ChangeDetectorRef

**变化检测器**, 当在组件中注入，会创建viewRef作为 value，可更改当前 lview 的 **FLAG** 属性，

注入的ChangeDetectorRef 其实返回的是 **ViewRef**【view 的 引用】

**使用**：当前组件的 changeDetection =  ChangeDetectionStrategy.OnPush时；



## injectChangeDetectorRef

```typescript
function injectChangeDetectorRef(isPipe = false) {
    return createViewRef(getCurrentTNode(), getLView(), isPipe);
}
```

### ViewRef

```typescript
@params _lView
@params _cdRefInjectingView
`markForCheck`:将当前 view 及其所有 parent view【祖先】 标记为 `Dirty[64]`
`detach`：从更改检测树中 分离出 视图。就是取消检测以当前view为root 的 tree
`reattach`：将view 重新添加 到检测树
`detectChanges`：检查当前view 及 childrens
`checkNoChanges`: 检查更改器及其子项,并在检查到更改时抛出; `开发模式`下用于验证运行更改检测不会触发其他更改

class ViewRef {
    constructor(_lView, _cdRefInjectingView ){
        this._lView = _lView;
        this._cdRefInjectingView = _cdRefInjectingView;
        this._appRef = null;                    // 当前 view 所 挂载的应用 【ApplicationRef】
        this._attachedToViewContainer = false;  // 当前 view 是否已经添加到LContainer
    }
    markForCheck() {
        markViewDirty(this._cdRefInjectingView || this._lView);
    }
    detach() {
        this._lView[FLAGS] &= ~128 /* Attached */;
    }
    reattach() {
        this._lView[FLAGS] |= 128 /* Attached */;
    }
    detectChanges() {
        detectChangesInternal(this._lView[TVIEW], this._lView, this.context);
    }
    checkNoChanges() {
        checkNoChangesInternal(this._lView[TVIEW], this._lView, this.context);
    }
}
```

