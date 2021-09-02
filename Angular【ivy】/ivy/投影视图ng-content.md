# ng-content

插槽，通过 select 属性，可变为具名插槽。

```typescript
----------AppComponent--------------
template:`<app-child>
            投影内容
          </app-child>`


----app-child组件 ---------------
template:  `<ng-content select="">  `

-----------------------------------------------------------------------
<ng-content>可通过 select 属性，接收投影到 app-child组件的试图。
`select` 格式是 CSS选择器，当 select格式 与 投影进来的视图的CSS 匹配时，会选择匹配的 DOM 插入到当前插槽
         默认是 `*`,匹配所有未被匹配的投影。
```

## 流程解析

有 插槽的组件在 Create阶段，都会先运行 ɵɵprojectionDef(*projectionSlots*),获取到所有的插槽集，存储在tNode.projection 中，在 <ng-content>对应的指令集运行时，获取；

<ng-content>对应的指令集 会运行 ɵɵprojection 函数，获取 插槽集

```typescript
template:`
	<ng-content></ng-content>
	<ng-content select="[name='hasName']"></ng-content>
`

projectionSlots: ['*', ['', 'name', 'hasname']];  // 值已被转换成小写

ɵɵprojectionDef(projectionSlots)：
`1.` 获取到根tNode， 因为投影视图与tNode的关系，
       投影试图 = tNode.child  // 投影视图是所有的child 视图
`2.` 将 tNode.child 与 projectionSlots，进行匹配，然后按照匹配的select 将tNode 放入 
     根tNode.projection 中
`3` ɵɵprojection 根据顺序，获取 DOM进行渲染     
```

### ɵɵprojectionDef

```typescript
function ɵɵprojectionDef(projectionSlots) {
    const componentNode = getLView()[DECLARATION_COMPONENT_VIEW][T_HOST];
    if (!componentNode.projection) {
        // If no explicit projection slots are defined, fall back to a single
        // projection slot with the wildcard selector.
        const numProjectionSlots = projectionSlots ? projectionSlots.length : 1;
        const projectionHeads = componentNode.projection =
            newArray(numProjectionSlots, null);
        const tails = projectionHeads.slice();
        let componentChild = componentNode.child;
        while (componentChild !== null) {
            const slotIndex = projectionSlots ? matchingProjectionSlotIndex(componentChild, projectionSlots) : 0;
            if (slotIndex !== null) {
                if (tails[slotIndex]) {
                    tails[slotIndex].projectionNext = componentChild;
                }
                else {
                    projectionHeads[slotIndex] = componentChild;
                }
                tails[slotIndex] = componentChild;
            }
            componentChild = componentChild.next;
        }
    }
}

``
```

### ɵɵprojection

```typescript
function ɵɵprojection(nodeIndex, selectorIndex = 0, attrs) {
    const lView = getLView();
    const tView = getTView();
    const tProjectionNode = getOrCreateTNode(tView, HEADER_OFFSET + nodeIndex, 16 /* Projection */, null, attrs || null);
    // We can't use viewData[HOST_NODE] because projection nodes can be nested in embedded views.
    if (tProjectionNode.projection === null)
        tProjectionNode.projection = selectorIndex;
    // `<ng-content>` has no content
    setCurrentTNodeAsNotParent();
    if ((tProjectionNode.flags & 64 /* isDetached */) !== 64 /* isDetached */) {
        // re-distribution of projectable nodes is stored on a component's view level
        applyProjection(tView, lView, tProjectionNode);
    }
}
```

