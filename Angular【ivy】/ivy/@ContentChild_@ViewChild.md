# 视图查询及内容查询

**相同点**：更新用的函数相同【*ɵɵloadQuery*，*ɵɵqueryRefresh*】

**不同点**：加载用函数不同，一个是*ɵɵcontentQuery*，一个是 *ɵɵviewQuery*，

​               一个是查询当前view，一个是查询投影进来的<ng-content>

​              **Create时机不同**，contentQueries是在 父view render阶段执行，初始化数据存入了 tview.queries【parent 】中

​                                             viewQuery 在当前 view render阶段执行，数据存入了当前  tview.queries 中

​             **Update时机不同**，当更新当前view时，如果有contentQueries，就证明子view 有contentQueries，执行子指令的

​                                               contentQueries的 update 函数。

**查询时机**：

**存储位置**：tview.queries, tview.contentQueries

**相关知识点**：*tNode.localNames*

# Create阶段

## contentQueries

内容查询，查询的是投影视图

```typescript
var _c0 = ['content'];
function AppComponent_ContentQueries(rf,ctx,dirIndex) {
      if (rf & 1) { jit___contentQuery_3(dirIndex,_c0,1); }
      if (rf & 2) {
        var _t;
        (jit___queryRefresh_4((_t = jit___loadQuery_5())) && (ctx.content = _t.first));
      }
}
```

### ɵɵcontentQuery

jit___contentQuery_3

```typescript
`1.` 将@ContentQuery中 查找用的元数据与 tNode.index 存入 'tView.queries' 中     // 父级的tView.queries中
`2.` 将 contentQuery元数据在tView.queries中的索引与directiveIndex存入 tView.contentQueries中
     tView.contentQueries 存储 索引及指令存储，当parent view refreshView时，更新子指令的 contentQueries 数据
`3.` 创建当前query的可观察数据，放入lview[19]; // lview[19]是一个可Observable的 列表

```

## viewQuery

视图查询，查询的是视图

```typescript
var _c1 = ['dir'];
function AppComponent_Query(rf,ctx) {
      if (rf & 1) { jit___viewQuery_6(_c1,1); }
      if (rf & 2) {
        var _t;
        (jit___queryRefresh_4((_t = jit___loadQuery_5())) && (ctx.dir = _t.first));
      }
}
```

### ɵɵviewQuery

jit___viewQuery_6

```typescript
`1.` 将@ViewQuery中 查找用的元数据与 `-1` 存入 'tView.queries' 中   // 当前的tView.queries中
     
`3.` 创建当前query的可观察数据，放入lview[19]; // lview[19]是一个可Observable的列表
```

## ɵɵcontentQuery 和 ɵɵviewQuery

对比

1. 都会创建搜索元数据存储到 tView.queries

   ```typescript
   `createTQuery(tview, meta, nodeIndex)`创建搜索元数据 存储到 tView.queries
   
   但是参数 nodeIndex 不同，contentQueries 存储的 nodeIndex 是tNode.index，
                         viewQuery 存储的 nodeIndex 是 -1。
   
   
   ```

2. contentQueries 会保存 TQuery在 tView.queries 上的索引 及 指令 索引

   ```typescript
   `saveContentQueryAndDirectiveIndex(tView, directiveIndex)`
   
   tView.contentQueries.push(tView.queries.length - 1, directiveIndex);
   ```

3.  都会创建【可观察数据】 存储到 *lView*[QUERIES]

4. 匹配时机

   ```typescript
   `匹配时机是指将查询用的元数据 与 tNode上的 referenceName 匹配，然后存入 tview.matches`，在refresh时更新用。
    `1.` 在创建 tNode时，如果有查询属性【tView.queries】，就将 predicate【搜索用的元数据】与 
         tNode.localNames 进行匹配，匹配成功后，
         将 tNode.index 及 matchIdx 存入 TQuery_.matches中 
   
   
   reference 可能匹配DOM，指令，provider，ElementRef，ViewContainerRef，TemplateRef，与read有关
   所以存入 TQuery_.matches的 matchIdx不同。
   `1.` read 是 ElementRef，ViewContainerRef，TemplateRef，(tNode.type & 4  [Container])
        matches 存储 [tNode.index, -2]
   `2.` read !== null 且 read 不是上面几种类型，那 reference 可能匹配的是指令 或是 provider
        matches 存储 [tNode.index, directiveOrProviderIdx]
   `3.` read == null
        matches 存储 [tNode.index, -1]
   ```

   # 

5. 创建及更新时机

   更新时 都使用 **ɵɵloadQuery** 和 **ɵɵqueryRefresh**

   ```typescript
   `viewQuery函数运行 【Create】`  // executeViewQueryFn()
   在 执行 executeTemplate 前，也就是 运行 模板指令集前
   
   `1.` 初始化 instructionState.lFrame.currentQueryIndex = 0
          // currentQueryIndex 代表当前 查询的索引，初始为 0 
   `2.` 执行 tView.viewQuery(1, component)
        内部运行 ：ɵɵviewQuery 函数👆：
          `1.` 创建查询的元数据 selector, -1 存入 tview.queries
          `3.` 创建 queryList 存储在 lView[QUERIES]
   
   `viewQuery函数运行 【Update】` 
        `1.` 获取 对应的 queryList【return lView[QUERIES].queries[queryIndex].queryList 】
               // 主要是获取 tQuery.matches
        `2.` ɵɵqueryRefresh(queryList)
          
   ```

   

   ```typescript
   `contentQueries函数运行 【Create】`  //   executeContentQueries()
   在 ɵɵelementStart 最后阶段，实例化所有的指令后，运行所有的指令的 contentQueries函数 ：
   
   def.contentQueries(1 /* Create */, lView[directiveIndex], directiveIndex);
   内部运行 ɵɵcontentQuery👆：
     `1.` 创建查询的元数据 selector, tNode.index 存入 tview.queries
     `2.` 将 元数据在tview.queries的索引 及对应的 指令在lview的索引存储在 tView.contentQueries 
     `3.` 创建 queryList 存储在 lView[QUERIES]
   
   ------------------------------------------------------------------------------------
   `contentQueries函数运行 【Update】`
   'static：true'： 在组件初始化前就 查询
      `1.`
      
   'static：false'：在组件初始化时才查询
   ```

# Update阶段

contentQueries 和 viewQuery 的更新逻辑相同：

**ɵɵloadQuery** => **ɵɵqueryRefresh**

## ɵɵloadQuery

```typescript
function ɵɵloadQuery() {
    return loadQueryInternal(instructionState.lFrame.lView, instructionState.lFrame.currentQueryIndex);
}
lView[QUERIES].queries[queryIndex].queryList

`从 lview[19].queries中获取对应视图的queryList`
```

## ɵɵqueryRefresh

```typescript
`0.` 更新 instructionState.lFrame.currentQueryIndex; 前进一位，指向下一个Query
`1.` 如果queryList.dirty，根据tview.queries中存储的nodeIndex，更新queryList.result，再触发queryList事件
```



# 标志位 reference

在 elementStartFirstCreatePass 阶段中的 resolveDirectives 阶段，根据 *localRefs* 存储到 **tNode.localNames**

存储 上的reference 和 标志。

```typescript
localRefs = ['content','']

cacheMatchingLocalNames(tNode, localRefs, exportsMap){
if (localRefs) {
        const localNames = tNode.localNames = ngDevMode ? new TNodeLocalNames() : [];
        // Local names must be stored in tNode in the same order that localRefs are defined
        // in the template to ensure the data is loaded in the same slots as their refs
        // in the template (for template queries).
        for (let i = 0; i < localRefs.length; i += 2) {
            const index = exportsMap[localRefs[i + 1]];
            if (index == null)
                throw new RuntimeError("301" /* EXPORT_NOT_FOUND */, `Export of name '${localRefs[i + 1]}' not found!`);
            localNames.push(localRefs[i], index);
        }
    }
}

普通的reference 存储的index 是 -1， 
tNode.localNames = ['content', -1]
```

# 总结

```typescript
`tview.queries`:{
            queries<`TQuery_`>:[],
            elementStart(tView, tNode){
                for (let i = 0; i < this.queries.length; i++) {
                    this.queries[i].elementStart(tView, tNode);
                }
            }
            elementEnd(tNode) {
                for (let i = 0; i < this.queries.length; i++) {
                    this.queries[i].elementEnd(tNode);
                }
            }
            嵌入视图的处理
            template的处理
            .....
        }
`TQuery_`:{
        metadata = {
            predicate: ['*', ''];
            flags,   // 标志位
            read,    // 标记位，标记当前查询的类型
        };
        matches = null;
        indexInDeclarationView = -1;
        crossesNgTemplate = false;         // 嵌入视图
    
        _appliesToNextNode = true;
        _declarationNodeIndex = nodeIndex;
}
----------------------------------------------------------------
`LQueries_`:{
    queries<`LQuery_`>:[],
}
`LQuery_`:{
    queryList<`QueryList`> = queryList;
    matches = null;
}
`QueryList`：{
	    _emitDistinctChangesOnly = _emitDistinctChangesOnly;
        dirty = true;
        _results = [];
        _changesDetected = false;
        _changes = null;
        length = 0;
        first = undefined;
        last = undefined;
}
TQuery_: 存储匹配用的元数据,匹配到的元数据及状态符。
tview.queries：存储每一个contentQuerie 和 viewQuery 产生的数据<TQuery_>
lview[19]: 存储LQuery_, 可标记存储的LQuery_为dirty状态。   
LQuery_：存储匹配结果QueryList
-------------------------------------------------------------------------------------------
<child-dir #c="child"></child-dir>
<child-dir #c></child-dir>  
`1.` 在ɵɵelementStart阶段执行指令的 contentQueries【Create】, 将@ContentChild的元数据['*']与tNode.index
     合并后存入tview.queries:[
         {
             metadata:{
                 predicate = ['*'];
                 flags = flags;
                 read = read; // 标志位，标记匹配的目标ElementRef,ViewContainerRef,TemplateRef，provider，
                              // directive，或是null。
                              // 当是ElementRef,ViewContainerRef,TemplateRef 会在matches存储[tNode.index, -1]
                              // providers或是 directive，存储[tNode.index, token所在的索引]
                              // null 存储[tNode.index, tNode.localNames中匹配的指令索引/-1]
             } 
             matches: null,
             indexInDeclarationView: -1,
             crossesNgTemplate: false,
             _appliesToNextNode: true,
             _declarationNodeIndex: tNode.index
         }
     ]; 并将元数据索引及指令的索引存入View.contentQueries:[0, directiveIndex]
     为当前tview.queries 中的数据，创建响应式数据queryList 存入 lview[19]中
`2.` 在renderView 阶段执行 viewQuery【Create】，和 contentQueries相似，少了 View.contentQueries步骤
`3.` localRefs 存储在node上声明的reference:['*',''，'引用名'，'exportsAs 名称'] 
     exportsMap存储node上指令和组件的 exportAs:{
         '**': directiveIdx,
         ``: -1    // 当组件有exportsAs属性时， 这个 -1 就变成组件的索引值
     }
     当解析完指令后，将localRefs 和 exportsMap 合并，存入 tNode.loacalNames中。
     ['引用名称', 指令的索引,'引用名称', -1,]
`4.` 在 elementStartFirstCreatePass阶段用 tview.queries中存储的元数据 与 tNode.localNames匹配
     匹配成功 就将 `tNode.index`和`指令的索引` 存入 TQuery_.matches:[tnode.index, 指令的索引/-2/-1]
     因此匹配后每一个他view.queries上都存储了reference匹配到的tNode 及匹配的内容的索引
`5.` 在`Update`时根据view.queries 中存储的 tNode.index，及target的索引。创建结果集：     
     target的索引：-1 // 代表是想获取当前节点，根据tNode的类型创建不同的实例:createElementRef,createTemplateRef
                 -2 // createElementRef,createTemplateRef,createContainerRef
                 其他索引 // 可能是查找的provider，directive，直接在lview中通过索引获取。
     将结果集push进 `lview[19].queries[queryIndex].matches`【LQuery_】中。
     再将结果集存入 `queryList`中,并标记dirty = true
     最后emit(queryList)，通知订阅者。
     
     

`未完成：`static与非static的 关系，  // 静态视图，可在ngContentInit,ngViewInit 前获取
         contentQuerie 查询的范围[tNode.index],
         查询视图 在 <ng-tamplate> 会如何表现    
```



# 附录

#### TQueryMetadata_

```typescript
class TQueryMetadata_ {
    constructor(predicate, flags, read = null) {
        this.predicate = predicate;
        this.flags = flags;
        this.read = read;
    }
}
```

#### TQueries_

```typescript
class TQueries_ {
    constructor(queries = []) {
        this.queries = queries;
    }
}
```

#### TQuery_

```typescript
class TQuery_ {
    constructor(metadata, nodeIndex = -1) {
        this.metadata = metadata;
        this.matches = null;     // 存储 [tNode.index, ]
        this.indexInDeclarationView = -1;
        this.crossesNgTemplate = false;
        /**
         * A flag indicating if a given query still applies to nodes it is crossing. We use this flag
         * (alongside with _declarationNodeIndex) to know when to stop applying content queries to
         * elements in a template.
         */
        this._appliesToNextNode = true;
        this._declarationNodeIndex = nodeIndex;  // contentQueries：存储tNode.index
                                                 // viewQuery：存储为 -1
    }
}    
```

### createTQuery

```typescript
function createTQuery(tView, metadata, nodeIndex) {
    if (tView.queries === null)
        tView.queries = new TQueries_();
    tView.queries.track(new TQuery_(metadata, nodeIndex));
}
```

## refreshContentQueries

更新 ContentQueries

```typescript
function refreshContentQueries(tView, lView) {
    const contentQueries = tView.contentQueries;
    if (contentQueries !== null) {
        for (let i = 0; i < contentQueries.length; i += 2) {
            const queryStartIdx = contentQueries[i];
            const directiveDefIdx = contentQueries[i + 1];
            if (directiveDefIdx !== -1) {
                const directiveDef = tView.data[directiveDefIdx];
                setCurrentQueryIndex(queryStartIdx);
                directiveDef.contentQueries(2 /* Update */, lView[directiveDefIdx], directiveDefIdx);
            }
        }
    }
}

根据 tView.contentQueries中存储的 queryStartIdx：元数据在tview.queries中的索引
                                directiveDefIdx：指令的索引
执行 directiveDef.contentQueries 的 Update
 实际 执行的是
```

### ɵɵloadQuery

lView[QUERIES].queries[queryIndex].queryList;

```typescript
function ɵɵloadQuery() {
    return loadQueryInternal(getLView(), getCurrentQueryIndex());
}
```

#### loadQueryInternal

```typescript
function loadQueryInternal(lView, queryIndex) {
    return lView[QUERIES].queries[queryIndex].queryList;
}
```

### ɵɵqueryRefresh

```typescript
function ɵɵqueryRefresh(queryList) {
    const lView = getLView();
    const tView = getTView();
    const queryIndex = getCurrentQueryIndex();
    setCurrentQueryIndex(queryIndex + 1);
    const tQuery = getTQuery(tView, queryIndex);
    if (queryList.dirty &&
        (isCreationMode(lView) ===
            ((tQuery.metadata.flags & 2 /* isStatic */) === 2 /* isStatic */))) {
        if (tQuery.matches === null) {
            queryList.reset([]);
        }
        else {
            const result = tQuery.crossesNgTemplate ?
                collectQueryResults(tView, lView, queryIndex, []) :
                materializeViewResults(tView, lView, tQuery, queryIndex);
            queryList.reset(result, unwrapElementRef);
            queryList.notifyOnChanges();
        }
        return true;
    }
    return false;
}
```

#### collectQueryResults

```typescript
function collectQueryResults(tView, lView, queryIndex, result) {
    const tQuery = tView.queries.getByIndex(queryIndex);
    const tQueryMatches = tQuery.matches;
    if (tQueryMatches !== null) {
        const lViewResults = materializeViewResults(tView, lView, tQuery, queryIndex);
        for (let i = 0; i < tQueryMatches.length; i += 2) {
            const tNodeIdx = tQueryMatches[i];
            if (tNodeIdx > 0) {
                result.push(lViewResults[i / 2]);
            }
            else {
                const childQueryIndex = tQueryMatches[i + 1];
                const declarationLContainer = lView[-tNodeIdx];
                // collect matches for views inserted in this container
                for (let i = CONTAINER_HEADER_OFFSET; i < declarationLContainer.length; i++) {
                    const embeddedLView = declarationLContainer[i];
                    if (embeddedLView[DECLARATION_LCONTAINER] === embeddedLView[PARENT]) {
                        collectQueryResults(embeddedLView[TVIEW], embeddedLView, childQueryIndex, result);
                    }
                }
                // collect matches for views created from this declaration container and inserted into
                // different containers
                if (declarationLContainer[MOVED_VIEWS] !== null) {
                    const embeddedLViews = declarationLContainer[MOVED_VIEWS];
                    for (let i = 0; i < embeddedLViews.length; i++) {
                        const embeddedLView = embeddedLViews[i];
                        collectQueryResults(embeddedLView[TVIEW], embeddedLView, childQueryIndex, result);
                    }
                }
            }
        }
    }
    return result;
}
```

#### materializeViewResults

```typescript
function materializeViewResults(tView, lView, tQuery, queryIndex) {
    const lQuery = lView[QUERIES].queries[queryIndex];
    if (lQuery.matches === null) {
        const tViewData = tView.data;
        const tQueryMatches = tQuery.matches;
        const result = [];
        for (let i = 0; i < tQueryMatches.length; i += 2) {
            const matchedNodeIdx = tQueryMatches[i];
            if (matchedNodeIdx < 0) {
                // we at the <ng-template> marker which might have results in views created based on this
                // <ng-template> - those results will be in separate views though, so here we just leave
                // null as a placeholder
                result.push(null);
            }
            else {
                const tNode = tViewData[matchedNodeIdx];
                result.push(createResultForNode(lView, tNode, tQueryMatches[i + 1], tQuery.metadata.read));
            }
        }
        lQuery.matches = result;
    }
    return lQuery.matches;
}

`1.` 从 tQuery.matches 中 保存的 tNode.index 及 matchIndex，返回实例。
```

##### createResultForNode

```typescript
function createResultForNode(lView, tNode, matchingIdx, read) {
    if (matchingIdx === -1) {
        // if read token and / or strategy is not specified, detect it using appropriate tNode type
        return createResultByTNodeType(tNode, lView);
    }
    else if (matchingIdx === -2) {
        // read a special token from a node injector
        return createSpecialToken(lView, tNode, read);
    }
    else {
        // read a token
        return getNodeInjectable(lView, lView[TVIEW], matchingIdx, tNode);
    }
}
```

###### createResultByTNodeType

```typescript
function createResultByTNodeType(tNode, currentView) {
    if (tNode.type & (3 /* AnyRNode */ | 8 /* ElementContainer */)) {
        return createElementRef(tNode, currentView);
    }
    else if (tNode.type & 4 /* Container */) {
        return createTemplateRef(tNode, currentView);
    }
    return null;
}

`1.` 根据tNode的类型不同，返回不同的数据。
```

