# refreshView

更新 view【暂时不考虑 CheckNoChanges】

1. 运行template函数的 **Update**模式
2. 执行pre 生命周期钩子 preOrderCheckHooks / preOrderHooks
3. 查找并标记移植视图，更新移植视图【*Attached* 】
4. 更新嵌入视图  // 从[CHILD_HEAD] 开始，沿着[NEXT]查找
5. 更新 contentQueries
6. 执行 contentCheckHooks **/** contentHooks
7. 执行 HostBinding 函数
8. 更新子组件👆     // 执行上面的流程 
9. 更新 viewQuery
10. 执行 viewCheckHooks / viewHooks
11. 更新 TRANSPLANTED_VIEWS_TO_REFRESH   // 移植视图需要更新的个数。

## 插值语法 + pipe 的更新

```typescript
`lview.bindingStartIndex : 是存储 var值的起始索引` // var值，就是变化的值

'prefix': 插值语法的前缀
'suffix'：插值语法的后缀
ɵɵpipeBind：{
    index: pipe在 lview的索引
    slotOffset: 绑定值在 lview上的 binding区域的 偏移量
    argument1:pipe 的第一个参数   // 插值
}


lview 上 会存储 value = ‘’ 的 text节点和pipeInstance。
`1.` 在Update时，调用 ɵɵtextInterpolate('prefix', ɵɵpipeBind(index,slotOffset,argument1), 'suffix')
       ɵɵpipeBind：从lview取出 pipeInstance;
                   执行pipeInstance;
                   对比argument1 与 lview[bindingIndex]  // 新旧值对比
                   不同就根据 argument1 运行 pipeInstance 获取新值存入 lview[bindingIndex] 

```

## 3.查找并标记需要更新的移植视图的个数

```typescript
`HAS_TRANSPLANTED_VIEWS`:2;
`MOVED_VIEWS`: 9;
`TRANSPLANTED_VIEWS_TO_REFRESH`:5

`1.` 从当前lview中 查找 LContainer; 如果LContainer 有 MOVED_VIEWS 
`2.` 找到 MOVED_VIEWS 中 view 的 parent，更新 TRANSPLANTED_VIEWS_TO_REFRESH 属性 // 也就是需要更新的移植视图个数
     并将 MOVED_VIEWS 中 view 标记为 RefreshTransplantedView // 已经被添加的shi'tu
```



## preOrderHooks

lview[Flag] 

执行前置生命周期钩子：ngOnChanges，ngOnInit，ngDoCheck

```typescript
`[tNode.index, directiveIndex,ngOnChanges, -directiveIndex,ngOnInit, directiveIndex,ngDoCheck,...]`
在lview上根据 directiveIndex 获取指令的实例【指令执行的上下文】
ngOnChanges 是要执行的函数fn，因此fn.call(directiveInstance)  

遇到 -directiveIndex 是 ngOnInit 生命周期 更新 lview[FLAG] 标志位
```

