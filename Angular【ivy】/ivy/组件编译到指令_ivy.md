# ivy模式下的编译

```
方式：使用增量DOM（区别于虚拟DOM）

```

# component

```typescript
初始阶段会为组件添加 static 静态属性`ɵcmp`【配置get特性】，在使用`ɵcmp`时触发get，对组件进行编译。
`providers属性`：编译后给feature添加函数【函数内部会给`ɵcmp`添加providersResolver解析函数，在某一阶段会传入组件的`ɵcmp`和 providersResolver 函数，对providers解析】
`ngOnChanges`ngOnChanges生命周期也会在 feature
feature：与 providers，viewProviders，NgOnChanges属性相关，与【usesInheritance,fullInheritance】也相关
```



# 关于View

```typescript
`1.` LView、TView.data
`2.` bloom filter
ivy 引入 LView：储存所有与操作有关的数据
    引入 TView.data:储存与LView有关的静态数据
    两者关系：LView 与 TView.data是拥有相同长度的数组，对应索引相关联,需要组合起来才能得到完整的View
```

## LView

```
[0-19]:储存固定的数据
[20-]:储存component的动态数据
```



# CompilerFacadeImpl

```typescript
`编译器的容器`：内部包含【管道编译，注入编译，模块编译，指令编译，组件编译等函数】
`compileComponent`:组件编译


AppComponent的编译结果：'./编译结果文件/AppComponent.js'
```

## compileComponent

### `组件编译[jit模式下]`

```typescript
组件的编译是在 `ɵcmp[ngComponentDef]` 的 get阶段。编译过程如下：
`1.`template:模板子字符串
`2.`tokenize:通过配置[插值语法，无效字符表，空格字符是否保留,....]解析template生成 token表
`3.`_TreeBuilder：根据tokens,将节点处理成ast，去除无效节点[合并空白节点，去除'\n'] 
`4.`htmlAstToRender3Ast:处理节点的ng特殊属性[传输值，绑定事件，特殊节点[‘ng-template’],指令等]
	 Element/Template节点：'[prop]':存入inputs属性中; '(eventName)':存入outputs中; '#标记名'：存入references中
     		  '普通属性'：存入attributes中; '子节点'：存入children
     Template节点：'let-name'：声明属性存入 variables; 
                 'ngTemplateOutlet' 和 'ngTemplateOutletContext'存入 templateAttrs
`5.`BindingParser: 解析模板和指令宿主区域中的绑定,将NgComponentDef所需的template数据进行token转换，最终转换成Expression 
`6.`definitionMap: 会解析 NgComponentDef 的 组件基础数据解析成Expression与上一步解析模板的表达式合并
`7.`jitExpression：将组件基础Expression和组件模板Expression 合并转换成 代码输出【NgComponentDef】。
```

### `2.`tokenize模板解析

```typescript
`通过ASCII 对比 解析【<tag, <--, <![, </tag】`
tokens：token集合🧩
_currentTokenStart：当前token的其实状态
_currentTokenType：当前token 的类型【开始标签，text，闭合标签，注释,....】
_inInterpolation：标记当前解析是否在插值语法【{{}}】内
end:记录template 的长度
state:{
    column:3     //当前列
    line:0       //当前行    遇到 [\n] 增加
    offset:3     //当前位置
    peek:105     //当前字符的 ASCII值  peek == $EOF 【offset >= end】 时 结束
}
advance函数，更新state，不断推进offset。

根据类别生成token:{
    type：token的类型，【开始标签，闭合标签,....】
    parts：【关键字段，比如[tag前缀，tag],】
    sourceSpan：记录token的坐标[行，列，第几个字符]及 所属文件uri和总模板内容content
}

---开始标签---
<tagname，解析到标签后，继续尝试解析属性【直到遇到['>','/','<']】，将解析的属性token 放入tokens中

---闭合标签----
遇到'/' + 'tagname' + '>';生成闭合标签的token； 

---text----
遇到text，需要考虑插值语法：{{}}，遇到'{{'进行标记[_inInterpolation],再去尝试'}}'
text的结束标志判断：遇到'<',结束text，再继续判断

`tokenize` 只是将标签 和属性进行分离解析。
```

### `3.`_TreeBuilder

```typescript
`通过tokens中的标记，建立层级节点关系树🎄`
tokens：tokenize 的解析结果。
_index：tokens的标志位，标记当前解析token
_elementStack：节点栈，处理节点关系。
rootNodes：保存根节点

处理过程：将attribute token 合并到 <开始节点>token，清除'\n'，合并多空白字符，将子节点合并到父节点的children中
```

### `4.`htmlAstToRender3Ast

```typescript
`将解析的普通ast节点，转换为ivy要使用的格式【对于特殊属性[指令],特殊tag的标记,插值语法】`:实际是对于ng语法的标记

`---预解析--------`
节点属性：['select','href','rel','ngNonBindable','ngProjectAs']
          'select':select 为空就会被设置为'*'
节点类型:['NG_CONTENT','STYLE','STYLESHEET','SCRIPT','OTHER']
		 'STYLESHEET': <link rel="stylesheet">
通过预解析，确定节点类型，再策略处理。             
             
`--text---`
1-查找‘{{}}’,
2-如果有插值语法，再查找 pipe
根据text是否是动态【插值语法,pipe】的生成不同的实例【Text,BoundText】
对于Text，在下一阶段会只生成creationInstruction
对于BoundText,在下一阶段会生成creationInstruction 和 updateInstructionWithAdvance


`--节点----`
Element{
    children: 子节点
    attributes: 节点属性【style,class,isNonBindableMode】
    references: #name 会被放入【存放标记的地方】
    outputs:  绑定的事件
    name:'div'
    inputs: 输入属性：【被[]包裹的属性】
    i18n:
    ParseSourceSpan： 源文件的记录
    souceSpan：源文件的记录
    endSourceSpan: 节点结束位置的记录
    
}

`---ng-container---`
解析 'ngTemplateOutlet' 和 'ngTemplateOutletContext'两个 BoundAttribute

`对于模板类型，会创造一个template 将自身节点包裹`

Template{
        tagName, 
        attributes, 
        inputs, 
        outputs, 
        templateAttrs,  //存储 模板属性【BoundAttribute】
        children, 这个children 就是被包裹的【ng-container节点】
        references, 
        variables, 
        sourceSpan, 
        startSourceSpan, 
        endSourceSpan, i18n
    
}
`---ng-template---`
也会生成 template 节点
```

### `5.`BindingParser / constantPool

`此阶段，属于[compileComponentFromMeta],解析整个组件的meta`

```typescript
`[BindingParser]`:解析模板和宿主区域的绑定
`[constantPool]`:常量池，存储，解析模板过程中需要生成的常量【可供节点创建/更新时使用】
				 例如：视图/内容查询声明的常量【'var c0 = ['name1']','var c1 = ['name2']',...】


`compileComponentFromMeta`:根据ast节点及指令元数据，生成更新/创建指令对应的【ast代码语句token并拼接生成template函数】。
分为两个阶段：NgComponentDef 中基础属性的【代码token】`[compileComponentFromMetadata](definitionMap中不包括
              template的代码)`
		   template模板创建/更新的【代码token】`[TemplateDefinitionBuilder ]`
例如[动态的样式,绑定的属性值,指令,.... ]。最终拼接成完整的： 【NgComponentDef】函数


`====================================================`
根据节点的类型【Element，Template】,有不同的处理方式
`_creationCodeFns`：创建节点所用到的函数
`_updateCodeFns`:更新节点所用到的函数

`---Element节点---`
Element节点：{
    span：节点的源文件映射位置
    reference：{moduleName:'@angular/core',name:'ɵɵelementStart'}
    paramsOrFn <LiteralExpr[]>：[index,tagName,]
}
`1.`使用Element节点的数据创建指令creationInstruction[内部调用instruction(span, reference, params)]
`2.`递归处理子节点
`3.`当创建完节点 creation函数 后，同样要创建 endElement 创建函数

`---Template节点---【ng-containere,ng-template】`
Template节点：{
    
}

`---BoundText----`
有插值的 文本
`---Text----`
普通文本
`---ng-content----`
<ng-content>
``    
```

### `5.1` TemplateDefinitionBuilder 

```typescript
遍历node，根据 node属性 生成 创建/更新指令集

创建指令集：creationInstruction
更新指令集：updateInstructionWithAdvance【包括advance[移动位置] + updateInstruction】

_currentIndex：当前处理节点的索引【与当前节点nodeIndex比较，不同时需要advance(nodeIndex - _currentIndex)】
_constants:{constExpressions:节点属性【constsNgComponentDef.consts】,prepareStatements:}
_creationCodeFns：创建创建指令集函数的代码token存储位置【根据属性index，tag，创建Element节点】
_updateCodeFns：创建更新指令集函数的代码token存储位置【根据指令index，tag，属性index更新Element节点】
_dataIndex:滚动记录节点的位置【references/pipe也会+1】，在creationInstruction和updateInstructionWithAdvance时使用
			【与 NgComponentDef.decls属性相关】
_bindingSlots：绑定插槽计数【pipe计数,[ngStyle],[ngClass]计数,插值表达式计数】
_pureFunctionSlots：【pipe增加的数量【pipe.arg+2】,】
					绑定计数会添加到_pureFunctionSlots,处理更新指令时，使用正确的插槽偏移量生成纯函数指令
_ngContentReservedSlots：投影视图
_constants：存储节点基础属性[style,class,(事件)]和节点的references

`---Element---`
_dataIndex++: 标记节点索引index,作为参数之一
elementName:节点名称
baseAttributeIndex：节点基础属性存储在_constants中的constExpressions中
				【对于节点上[style,class,(事件),未知属性]的属性，会处理后放入_constants.constExpressions中，只返回索引。】
referencesIndex：节点上的标记属性也同样存储在_constants中的constExpressions中
					【对于'#referenceName'】

--------------------------
attributes：节点属性{
    ng属性：isNonBindableMode  
    静态基础属性：style，class,
    其他未知属性：'*** = $$$'
}

outputs：{
    name:存储在_constants.constExpressions
}
references:{
    生成数组表达式{
        entries<LiteralArrayExpr>[]:[{value:'dir'},{value:''}]
    }
}
`-----pipe-----`
slotOffset:插槽偏移量
```

### `6.`jitExpression

```typescript
根据前几步解析出的 expression[preStatements,def] 拼装成函数添加到 class.ɵcmp对应的template query中
返回 $def【$def是 defineComponent(组件参数)函数的返回结果】
```

### `7.`bootstrap

```typescript
组件在挂载阶段会生成 componentFactory（包括 def，type，selector，module）
componentFactory.create 创建 `rootTView/rootLView` 再创建组件view(LView) 【组件view 被rootView包裹的意义？？】

```

### `8.`componentFactory.create

```typescript
创建 `hostRNode`，`rootTView/rootLView`，`rootContext`

`1.` 创建rootViewInjector【链式Injector】`依赖注入的层级关系`

enterView/leaveView 操作instructionState.lFrame 维护指令状态[LView,TView]和 层级关系

8.1 createRootComponentView:创建组件视图(LView),组件node，建立组件的层级关系     
8.2 createRootComponent：创建组件类(class)，作为组件view的执行上下文(CONTEXT)   

8.3 renderView(rootTView, rootLView, null):层级创建视图

最终return 组件实例{
    location： 组件ElementRef //
    _rootLView:rootview
    _tNode：  组件创建rootview 后 创建的 TNode(#host) 
    instance： 组件实例
    hostView： new RootViewRef(rootLView){_view:rootLView} `RootViewRef.detectChanges()`
    componentType：组件class
}
关于

`-------rootTView/rootLView 和 真正组件view 的关系--`
似乎 rootTView/rootLView 属于 组件view的包裹层,组件的生命周期函数和其他属性:  
		contentHooks/contentCheckHooks,viewCheckHooks/viewHooks,preOrderCheckHooks/preOrderHooks，destroyHooks
        contentQueries 都存放在【rootTView】,
在refreshView 时，先更新 rootTView中保存的组件的生命周期【init，check，contentHooks/contentCheckHooks】 再更新组件view【组件view不保存生命周期】，更新完成组件view后，退出组件环境，回到 rootTView 阶段，再调用  【ngAfterViewInit，ngAfterViewChecked】 生命周期。 
`？？？`为什莫需要套一层 rootView，代理执行组件的生命周期等函数【因为兼容性？？？？？】

```

### `8.1`   createRootComponentView

```typescript
创建根组件视图 和 根组件 node【创建组件视图，挂载到rootLView的【HEADER_OFFSET】节点上】

@params rNode： view 的宿主节点<app-root>
@params def  ： 组件的def
@params rootView ： rootLView

rootLView
rootTView
1. 创建虚拟的 tNode (#host TNode【不想读取它？？？，建立特殊TNode，作为调试时的标记？？？】)
	           存储在 rootTView.data[HEADER_OFFSET]
2. 创建组件的LView
	getOrCreateTComponentView(def)  // 创建组件的TView，挂载到def.tview
    componentView = createLView(rootView, getOrCreateTComponentView(def),...) //创建 component的LView，TView
                            

3.初次创建    `1.` diPublicInInjector 【设置boolean filter，设置指令token 存放位置[mask]，再将mask放进TView.data】                      
            `2.`  markAsComponentHost(tView, tNode):将tNode作为 rootTView的宿主。                
                                 【rootTView.components.push(tNode.index)】
            `3.` initTNodeFlags(tNode, rootView.length, 1)【初始化TNode 的flag，directiveStart】

 
          
将生成的组件LView 存储到 rootView[HEADER_OFFSET]      //？？为什么初始存储<app-host>，之后存储组件LView

`创建组件LView,存放到 rootView[HEADER_OFFSET],返回LView`

---------------------------------
创建组件view时，需要
1. 为 rootTView创建 TNode(#root)特殊TNode
2. 将TNode设置成 rootTView 的 host,【tView.components.push(TNode.index)】
   更新TNode的flag（TNode.flags |= 2 //isComponentHost）                                
3. 初始化TNode 的flag (TNode.flags |= 1 /* isDirectiveHost */;)
                /directiveStart: rootView.length
                /directiveEnd
                /providerIndexes: rootView.length                                 
                                 
```

### `8.2`  createRootComponent

```typescript
@params componentView  组件LView
@params componentDef   组件def
@params rootLView      rootLView
@params rootContext    创建的根上下文
@params hostFeatures   注册生命周期函数【将生命周期注册到TView】

获取指令的class 存储到LView[CONTEXT] 和 rootContext.components
实例化class组件，
解析依赖注入，`注册生命周期函数`【将生命周期[onchange，init，docheck]注册到rootTView】

```

### `8.3`  renderView

```
@params rootTView,
@params rootLView
@params context 执行上下文

执行 tView.viewQuery：创建视图query【@viewchild，@contentchild】
	tView.template：创建真正的视图【dom元素等】
	tView.components：存储子指令的索引，renderChildComponents(lView, components)，渲染子指令
```

rootView / rootTView

```typescript
rootView        存储 组件的host节点【<app-host>】于[HEADER_OFFSET]
rootTView.data  存储节点TNode,索引与rootView索引一致
```



### NgComponentDef

`组件的实例函数`,defineComponent的参数是 definitionMap,`definitionMap`是组件关键数据

```typescript

const $def = defineComponent({
        type: 组件类,
        selectors: 选择器//
        contentQueries：fn(rf,stx,dirIndex){
    							dirIndex
    							...
}
        viewQuery: function AppComponent_Query(rf, ctx) {
            if (rf & 1) {
                jit___viewQuery_8(_c0, 1);
            }
            if (rf & 2) {
                var _t;
                jit___queryRefresh_9((_t = jit___loadQuery_10())) &&
                    (ctx.dir = _t.first);
            }
        },
        features: 与NgOnChanges生命周期有关,
        decls: 视图函数的数量【element节点 + 监听事件函数 + pipe函数】,
        vars: 5,
        consts: 【数组，函数[】解析出element节点上的所有属性[
            [存储节点上的属性集合{属性的值，属性的类别}，在创建/更新时使用]
            enum type{
                class = 1;
                style = 2;
                [property] | (event) = 3
				*指令集 = 4
            }
            无type的属于其他类型[#标签,'id = value', '指令']
        ]
        template: function AppComponent_Template(rf, ctx) {
            模板的指令集，分为两种模式
            	rf == 1：创建
                rf == 2：更新
            通过调用对应指令函数，去创建/更新节点。
            创建element：elementStart(elementIndex, tagName,
                                   对应属性在consts中的index,
                                   对应索引在consts中的index,)
        },
        styles: [样式,
        ],
    })
```

#### constantPool

```typescript
常量池，收集在创建指令集<instruction>过程中的数据

statements://收集 常量代码token块,比如ContentChild，ViewChild【因为这些数据需要常量保存，区别于模板的动态数据】
pipeDefinitions:Map(0)
nextNameIndex:1
literals:Map(1) {["content"] => FixupExpression …} //收集[@ContentView],[@ViewChild]映射
literalFactories:Map(0)
isClosureCompilerEnabled:false
injectorDefinitions:Map(0)
directiveDefinitions:Map(0)
componentDefinitions:
```

#### @ContentChild()

```typescript
@ContentChild('选择符') 名称;
内容查询：在解析过程中，被 `constantPool.literals`收集映射关系；最终生成内容查询函数的代码块存入`definitionMap.contentQueries`

```

#### @ViewChild()

```typescript
@ViewChild('选择符') 名称;
视图查询：在解析过程中，被 `constantPool.literals`收集映射关系；最终生成内容查询函数的代码块存入`definitionMap.viewQuery`
```

## compileNgModuleDefs

模块编译

```typescript
模块会编译出一个 inject静态函数。
```

# bootstrap(组件)

`将组件挂载到element上，例如：<app-root>`

```typescript
组件在挂载时会生成 ComponentFactory$1，通过ComponentFactory$1.create创建LView/TView：
0. 创建 rootTView/rootLView
1. createRootComponentView：创建LView
2. createRootComponent：创建组件class,并用  features 和hostbinding 进行设置
3. renderView(rootTView, rootLView, null)
```



# 代码token

#### DeclareVarStmt `var表达式`

```
@params name       名称
@params value      值
@params type 
@params modifiers   
@params sourceSpan 源地址
@params leadingComments
```



#### LiteralExpr`基础表达式`

```typescript
value:值
type:
sourceSpan:记录源位置
```

#### LiteralMapExpr `对象表达式`

```
@params entries：LiteralMapEntry[] 【{key,value}】 
@params type
@params sourceSpan 源地址
@params typeParams
```

#### importExpr `import外部文件`表达式

```
importExpr({模块名, 函数名称}).callFn()
importExpr 引用 ExternalExpr 构造表达式,再调用 父级 Expression 的原型，构造特定表达式 
```

#### ExternalExpr `外部引入的表达式`

```
@params value:{name:'**', moduleName:'**'} 外部引入表达式
@params sourceSpan 源地址
@params type
@params typeParams
```

#### InvokeFunctionExpr `函数表达式`

```
@params fn         函数 ExternalExpr 
@params args       参数 其他表达式【对象，数组,...】
@params type  
@params sourceSpan 源地址
@params pure
```

# 编译BoundText

`编译绑定数据的text`

```typescript
对于绑定数据的text文件：
`1.` 先建立文本 index相关的`创建`指令
`2.` 再用  `ValueConverter` 更新绑定 _bindingSlots
`3.` 再建立 `advance` 和`更新`指令
```



# 额外的知识

## bloom filters

```typescript
中文名称：`布隆过滤器`
diPublicInInjector 时使用；
核心原理：元素集合，超大的位数组和n个哈希函数
`1.` 将位数组每一位都初始化为0：[0，0，0，0，0，......]
`2.` 将元素依次通过n个哈希函数进行映射，每次映射产生一个哈希值，对应数组上一个点，将数组位置置为1
`3.` 当查询一个未知元素是否位于集合时，将未知元素通过哈希函数进行映射，看哈希值是否存在数组中
`4.` 存在误判率

```

