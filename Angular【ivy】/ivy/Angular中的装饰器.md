# Ivy模式

版本：@11.1.0-next.4

`装饰器分为三种，类装饰器，属性装饰器，参数装饰器,`

*类装饰器*：

```typescript
`ɵcmp`,`ɵinj`
为class 添加静态属性  【配置get】,在获取对应静态属性时，编译指令/模块/管道/注入
```

**属性装饰器：**

```
为class.__prop__metadata__ 添加静态属性:{
	Input:[装饰实例,....],
	Output:[]
	....
}
```

**参数装饰器**：

```typescript
`参数装饰器限定依赖查找的方式`
为class.__parameters__ 添加静态属性:[
	
]
```

#### 装饰器通用函数

##### noSideEffects

`无副作用`

```typescript
`编译器相信包裹的函数没有副作用？？？？？？`
function noSideEffects(fn) {
    return { toString: fn }.toString();
}
```

##### makeMetadataCtor

```typescript
`策略构造函数`:根据传入的函数，创建构造函数(不同的装饰器传入的函数不同)
function makeMetadataCtor(props) {
    return function ctor(...args) {
        if (props) {
            const values = props(...args);
            for (const propName in values) {
                this[propName] = values[propName];
            }
        }
    };
}
@input：    {bindingPropertyName}  //接受值，装饰class
@NgModule： 在装饰器装饰class类时，会生成`ɵmod` and `ɵinj`
```

##### makeDecorator【类装饰器的通用函数】

`NgModule,Directive,Compoment,Injectable,Pipe`**使用**

`class 根据传入函数，添加不同的静态属性 `

```typescript
@NgModule,@Directive 通用函数【name,props,typeFn不同】
@params name   标识装饰器类型？名称？
@params props  接收属性，不同的装饰器接受不同的属性
@params typeFn 装饰函数【不同类型的装饰器，调用不同的函数装饰class：{
    NgNodule:在装饰器装饰class类时，会生成`ɵmod` and `ɵinj` 静态属性的get属性【JIT】
    Directive:生成 `ɵdir`静态属性的get属性【JIT】
    
    ...以上get属性 在获取时会调用 `getCompilerFacade()`【编译相关函数】编译
}】

function makeDecorator(name, props, parentClass, additionalProcessing, typeFn) {
    return noSideEffects(() => {
        const metaCtor = makeMetadataCtor(props);
        function DecoratorFactory(...args) {
            if (this instanceof DecoratorFactory) {
                metaCtor.call(this, ...args);
                return this;
            }
            const annotationInstance = new DecoratorFactory(...args);
            return function TypeDecorator(cls) {
                if (typeFn)
                    typeFn(cls, ...args);
                // Use of Object.defineProperty is important since it creates non-enumerable property which
                // prevents the property is copied during subclassing.
                const annotations = cls.hasOwnProperty(ANNOTATIONS) ?
                    cls[ANNOTATIONS] :
                    Object.defineProperty(cls, ANNOTATIONS, { value: [] })[ANNOTATIONS];
                annotations.push(annotationInstance);
                if (additionalProcessing)
                    additionalProcessing(cls);
                return cls;
            };
        }
        if (parentClass) {
            DecoratorFactory.prototype = Object.create(parentClass.prototype);
        }
        DecoratorFactory.prototype.ngMetadataName = name; //标识构造函数名称
        DecoratorFactory.annotationCls = DecoratorFactory;
        return DecoratorFactory;ty
    });
}
```

##### makePropDecorator【属性装饰器的通用函数】

`ContentChildren,ContentChild,ViewChildren,ViewChild,Input,Output,HostBinding,HostListener`**使用**

`根据传入的name属性，为class 静态属性 __prop__metadata__对象中添加 装饰实例(存储指令经过转换后的元数据)，内部包括，上面的名称属性`

```typescript
`生成prop对应的构造函数`
@params 名称   名称
@params 属性   根据传入函数，获取指令元数据
@params 父类   prototype = parentClass.prototype属性
@params 附加处理 additionalProcessing

function makePropDecorator(name, props, parentClass, additionalProcessing) {
    return noSideEffects(() => {
        const metaCtor = makeMetadataCtor(props);
        //class.__prop__metadata__ 上添加 name属性，value是装饰器的元数据
        function PropDecoratorFactory(...args) {
            if (this instanceof PropDecoratorFactory) {
                metaCtor.apply(this, args);
                return this;
            }
            const decoratorInstance = new PropDecoratorFactory(...args);
            function PropDecorator(target, name) {
                const constructor = target.constructor;
                // Use of Object.defineProperty is important because it creates a non-enumerable property
                // which prevents the property from being copied during subclassing.
                const meta = constructor.hasOwnProperty(PROP_METADATA) ?
                    constructor[PROP_METADATA] :
                    Object.defineProperty(constructor, PROP_METADATA, { value: {} })[PROP_METADATA];
                meta[name] = meta.hasOwnProperty(name) && meta[name] || [];
                meta[name].unshift(decoratorInstance);
                if (additionalProcessing)
                    additionalProcessing(target, name, ...args);
            }
            return PropDecorator;
        }
        if (parentClass) {
            PropDecoratorFactory.prototype = Object.create(parentClass.prototype);
        }
        PropDecoratorFactory.prototype.ngMetadataName = name;
        PropDecoratorFactory.annotationCls = PropDecoratorFactory;
        return PropDecoratorFactory;
    });
}
```

##### makeParamDecorator【参数装饰器的通用函数】

`Inject,Optional,Self,SkipSelf,Host,Attribute`**使用**

添加属性 到 【class.__parameters_ = []】属性中

```typescript

function makeParamDecorator(name, props, parentClass) {
    return noSideEffects(() => {
        const metaCtor = makeMetadataCtor(props);
        function ParamDecoratorFactory(...args) {
            if (this instanceof ParamDecoratorFactory) {
                metaCtor.apply(this, args);
                return this;
            }
            const annotationInstance = new ParamDecoratorFactory(...args);
            ParamDecorator.annotation = annotationInstance;
            return ParamDecorator;
            function ParamDecorator(cls, unusedKey, index) {
                // Use of Object.defineProperty is important since it creates non-enumerable property which
                // prevents the property is copied during subclassing.
                const parameters = cls.hasOwnProperty(PARAMETERS) ?
                    cls[PARAMETERS] :
                    Object.defineProperty(cls, PARAMETERS, { value: [] })[PARAMETERS];
                // there might be gaps if some in between parameters do not have annotations.
                // we pad with nulls.
                while (parameters.length <= index) {
                    parameters.push(null);
                }
                 `parameters 是二维数组，因为可能是多装饰器`
                (parameters[index] = parameters[index] || []).push(annotationInstance);
                return cls;
            }
        }
        if (parentClass) {
            ParamDecoratorFactory.prototype = Object.create(parentClass.prototype);
        }
        ParamDecoratorFactory.prototype.ngMetadataName = name;
        ParamDecoratorFactory.annotationCls = ParamDecoratorFactory;
        return ParamDecoratorFactory;
    });
}
```

### 类装饰器

#### @NgModule

`const ɵ0$e = (ngModule) => ngModule`

`const ɵ1$3 = (type, meta) => SWITCH_COMPILE_NGMODULE(type, meta);`

`const NgModule = makeDecorator('NgModule', ɵ0$e, undefined, undefined, ɵ1$3);`

##### SWITCH_COMPILE_NGMODULE->compileNgModule

```typescript
`compileNgModule`:JIT模式下运行
编译模块，为模块class添加：
`ɵmod`：@NgModule的参数
`ɵinj`

```

##### entryComponents

`entryComponents` 定义的组件，即动态组件？？？？？？？？

#### @Directive

`const ɵ0$d = (dir = {}) => dir`

` const ɵ1$2 = (type, meta) => SWITCH_COMPILE_DIRECTIVE(type, meta);`

`const Directive = makeDecorator('Directive', ɵ0$d, undefined, undefined, ɵ1$2);`

```typescript
接收装饰器参数
为class 添加 `ɵdir`静态属性的 get函数：

在解析指令的 数据时，会解析 `属性装饰器`添加到class上的静态属性 ==> 生成 propMetadata
                               生成 queries属性【@ContentChild】
                               生成 viewQueries属性【@ViewChild】
                       `参数装饰器`添加到class上的静态属性 ==> 生成 deps 【依赖注入】
                       `OnChanges生命周期标识`
                              lifecycle:{usesOnChanges:true}  // 是否使用OnChanges生命周期
```

#### @Component

`const ɵ2$1 = (c = {}) => (Object.assign({ changeDetection: ChangeDetectionStrategy.Default }, c))`

`const ɵ3$1 = (type, meta) => SWITCH_COMPILE_COMPONENT(type, meta);`

`const Component = makeDecorator('Component', ɵ2$1, Directive, undefined, ɵ3$1);`

```typescript
ɵ2$1 获取组件的元数据,添加默认changeDetection 检查模式 
ɵ3$1 定义 class 的静态属性 `ɵcmp`的get属性，在获取`ɵcmp`时，调用compileComponent编译组件

组件是 @Directive的 子类，会添加   `ɵfac`：class 的constructor
```

#### @Pipe

`const ɵ4 = (p) => (Object.assign({ pure: true }, p))`

`const ɵ5 = (type, meta) => SWITCH_COMPILE_PIPE(type, meta);`

`const Pipe = makeDecorator('Pipe', ɵ4, undefined, undefined, ɵ5);`

```typescript
ɵ4 获取管道元数据, 默认数据 {pure: true}
ɵ5 定义 class 的静态属性 `ɵpipe`的get属性，在获取`ɵpipe`时，调用compilePipe编译管道
   定义 class 的静态属性 `ɵfac`的get属性,是管道的 工厂函数 	
```

#### @Injectable

`const ɵ0$a = (type, meta) => SWITCH_COMPILE_INJECTABLE(type, meta);`

`const Injectable = makeDecorator('Injectable', undefined, undefined, undefined, ɵ0$a);`

```typescript
ɵ0$a 函数定义class类静态属性 `ɵprov`的get属性，在获取`ɵprov`时 进行 编译
     函数定义class类静态属性 `ɵfac`的get属性,在获取`ɵprov` 进行 编译
     
@Injectable()：标识服务是可注入的【如果配置参数providedIn：root，标识此依赖注入到应用applicationRef
     											    Type：NgModule】
providers：将服务配置到NgModule的options，标识服务是属于本模块，在本模块只有一个实例【模块级注入】
           将服务配置到Component的options，标识服务是属于本组件及子组件，在本组件及子组件只有一个实例【组件级注入】
【组件】viewProviders：将服务配置到Component的options，标识服务是属于本组件，只在本组件有一个实例【组件级注入】 

`@Injectable原理`:当在组件/指令中使用该依赖时，会根据token【class】向上查找，如果符合依赖注入的规格{
    有`ɵprov` 和 `ɵfac`属性
    providedIn 满足要求
}，就将服务实例化，保存到 records中并返回。
```

### 属性装饰器

#### @Input

`const ɵ6 = (bindingPropertyName) => ({ bindingPropertyName });`

`const Input = makePropDecorator('Input', ɵ6);`

`装饰class的 静态属性'__prop__metadata__'：{Input:[decoratorInstance],}`





[`jit?`](https://angular.cn/api/core/Directive#jit)

编译模式：jit/aot

- 结构指令

  *ngIf  *ngFor  *switch

- 属性指令

  *ngStyle  *ngClass

- 自定义指令【自定义 结构/属性 指令】

  自定义结构性指令时通过设置@Input的 set属性，更新数据

  

#### @HostListener





#### @ViewChild

`获取组件模板中的Component 或者HTMLElement`

`const ɵ3 = (selector, data) => (Object.assign({ selector, first: true, isViewQuery: true, descendants: true }, data));`

`const ViewChild = makePropDecorator('ViewChild', ɵ3, Query);`

```typescript
ɵ3 获取元数据
为 class 添加 静态属性'__prop__metadata__'：{
    'ViewChild':[装饰实例]
}
```

获取视图中定义的模板元素，子元素的变量【非private的变量，例如：注入的服务】，子元素DOM，指令，子元素的 providers，所有的ng-template节点【参数是TemplateRef】

```typescript
会在 ngAfterViewInit()之前赋值
模板元素：
`<ng-template #tpl>
      Hello, Semlinker!
</ng-template>`
```

#### @ViewChildren

从视图 DOM 中获取元素或指令的 `QueryList`

```
会在 ngAfterViewInit()之前赋值
```

#### @ContentChild

`获取组件 投影进来的 插槽的的Component 或者HTMLElement`

```typescript
<app-body>
	<div #slot1>插槽</div>
	<app-slot>插槽组件</app-slot>
</app-body>

export class bodyComponent{
	@ContentChild('slot1')  slot1
    @ContentChild(SlotComponent)  slotComponent
}
```



#### @hostBinding

```typescript
用于把一个DOM 属性标记为绑定到宿主的属性，

它会对具有 ngModel 指令的 DOM 元素设置 valid 和 invalid 属性：

@Directive({selector: '[ngModel]'})
class NgModelStatus {
  constructor(public control: NgModel) {}
  @HostBinding('class.valid') get valid() { return this.control.valid; }
  @HostBinding('class.invalid') get invalid() { return this.control.invalid; }
}

@Component({
  selector: 'app',
  template: `<input [(ngModel)]="prop">`,
})
class App {
  prop;
}
```



### 参数装饰器

```typescript
通过装饰器 paramDecorator 给class 添加 静态属性【__parameters__】,和对应的paramsType[]
通过 Reflector 获取 params。
```



#### attachInjectFlag

```typescript
@params decorator 装饰器函数
function attachInjectFlag(decorator, flag) {
    decorator[DI_DECORATOR_FLAG] = flag;   //标志位属性 __NG_DI_FLAG__
    decorator.prototype[DI_DECORATOR_FLAG] = flag;
    return decorator;
}
```



#### @Inject

`const ɵ0$3 = (token) => ({ token });`

`const Inject = attachInjectFlag(makeParamDecorator('Inject', ɵ0$3),-1)`

```typescript
`1.`attachInjectFlag    //为装饰器【ParamDecoratorFactory】添加 flag
`2.`makeParamDecorator  //构造装饰器【ParamDecoratorFactory】
`ParamDecoratorFactory`：接收装饰器的参数，生成实例，存储到class[__parameters__]对应的索引中

`Angular 获取 构造函数中通过 @Inject装饰的参数`【ReflectionCapabilities函数】

```

#### @Optional

`const Optional = attachInjectFlag(makeParamDecorator('Optional'), 8 */\* Optional \*/*)`

```typescript
允许Angular 将你注入的服务视为可选服务,无法在在运行时解析，会将服务解析为null，不会抛出错误
```

#### @Self

`const Self = attachInjectFlag(makeParamDecorator('Self'), 2 */\* Self \*/*)`

```
让 Angular 仅查看当前组件或指令的 ElementInjector
```

#### @SkipSelf

`const SkipSelf= attachInjectFlag(makeParamDecorator('SkipSelf'), 4 */\* SkipSelf\*/*)`

```
Angular 在父 ElementInjector 中而不是当前 ElementInjector 中开始搜索服务
```

#### @Host

`const Host = attachInjectFlag(makeParamDecorator('Host'), 1 */\* Host \*/*);`

```
@Host 属性装饰器会禁止在宿主组件以上的搜索。宿主组件通常就是请求该依赖的那个组件。
不过，当该组件投影进某个父组件时，那个父组件就会变成宿主
```



#### @Attribute

`makeParamDecorator('Attribute', (attributeName) => ({ attributeName, __NG_ELEMENT_ID__: () => ɵɵinjectAttribute(*ttributeName) }));`

获取宿主元素上的属性