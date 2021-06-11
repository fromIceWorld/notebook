#### @NgModule

```typescript
export const NgModule: NgModuleDecorator = makeDecorator(
    'NgModule', (ngModule: NgModule) => ngModule, undefined, undefined,
    /**
     * Decorator that marks the following class as an NgModule, and supplies
     * configuration metadata for it.
     *
     * * The `declarations` and `entryComponents` options configure the compiler
     * with information about what belongs to the NgModule.
     * * The `providers` options configures the NgModule's injector to provide
     * dependencies the NgModule members.
     * * The `imports` and `exports` options bring in members from other modules, and make
     * this module's members available to others.
     */
    (type: Type<any>, meta: NgModule) => SWITCH_COMPILE_NGMODULE(type, meta));
```

##### makeDecorator

```typescript
export function makeDecorator<T>(
    name: string, props?: (...args: any[]) => any, parentClass?: any,
    additionalProcessing?: (type: Type<T>) => void,
    typeFn?: (type: Type<T>, ...args: any[]) => void):
    {new (...args: any[]): any; (...args: any[]): any; (...args: any[]): (cls: any) => any;} {
  return noSideEffects(() => {
    const metaCtor = makeMetadataCtor(props);

    function DecoratorFactory(
        this: unknown|typeof DecoratorFactory, ...args: any[]): (cls: Type<T>) => any {
      if (this instanceof DecoratorFactory) {
        metaCtor.call(this, ...args);
        return this as typeof DecoratorFactory;
      }

      const annotationInstance = new (DecoratorFactory as any)(...args);
      return function TypeDecorator(cls: Type<T>) {
        if (typeFn) typeFn(cls, ...args);
        // Use of Object.defineProperty is important since it creates non-enumerable property which
        // prevents the property is copied during subclassing.
        const annotations = cls.hasOwnProperty(ANNOTATIONS) ?
            (cls as any)[ANNOTATIONS] :
            Object.defineProperty(cls, ANNOTATIONS, {value: []})[ANNOTATIONS];
        annotations.push(annotationInstance);


        if (additionalProcessing) additionalProcessing(cls);

        return cls;
      };
    }

    if (parentClass) {
      DecoratorFactory.prototype = Object.create(parentClass.prototype);
    }

    DecoratorFactory.prototype.ngMetadataName = name;
    (DecoratorFactory as any).annotationCls = DecoratorFactory;
    return DecoratorFactory as any;
  });
}

**备注
noSideEffects 会执行 参数(fn)

**
返回装饰器工厂DecoratorFactory,就是我们的 NgModel 装饰器，arg就是传入的参数，(this是ts一种限制，不是参数🙄)

在编译ts时，生成注释实例 annotationInstance = {...arg},由于 annotationInstance 是 DecoratorFactory 的实例，因此集成了 ngMetadataName 属性【标识】，在其他步骤用，最后 返回 TypeDecorator。
在后续装饰时对class AppModule{} 进行操作，
AppModule.__annotations__ = [{providers,import,declarations,bootstrap...}].
`NgModule装饰器为class上添加注释__annotations__，注释是装饰器的参数`
```

##### entryComponents

`entryComponents` 定义的组件，即动态组件？？？？？？？？





#### @Input

`const ɵ6 = (bindingPropertyName) => ({ bindingPropertyName });`

`const Input = makePropDecorator('Input', ɵ6);`

##### makePropDecorator【部分装饰器的通用函数】

```typescript
@params 名称   'Input'
@params 属性   (bindingPropertyName) => ({ bindingPropertyName }) 
                     //确定返回属性key：bindingPropertyName
@params 父类
@params 附加处理

function makePropDecorator(name, props, parentClass, additionalProcessing) {
    return noSideEffects(() => {
        const metaCtor = makeMetadataCtor(props);
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

##### makeMetadataCtor

```typescript
元属性的构造函数
接收属性，经过props过滤后返回特定属性
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
```



#### @Directive

[`selector?`](https://angular.cn/api/core/Directive#selector)

选择器

```
selector:'[back-color]'
```

[`inputs?`](https://angular.cn/api/core/Directive#inputs)

输入属性：通过属性绑定传入，由宿主传递给指令

```typescript
back-color = "red"

```

[`outputs?`](https://angular.cn/api/core/Directive#outputs)

输出属性：通过事件绑定由指令传递给宿主

```typescript
`EventEmitter`:(dirEvent)="handleEvent($event)"
指令通过创建 EventEmitter 并@Output()导出，指令再通过调用导出的 EventEmitter.emit触发事件，宿主通过事件绑定监听该事件，并通过$event来获取 payload对象。


```

[`providers?`](https://angular.cn/api/core/Directive#providers)

一组依赖注入令牌，它允许 DI 系统为这个指令或组件提供依赖。

[`exportAs?`](https://angular.cn/api/core/Directive#exportAs)

定义一个名字，用于在模板中把该指令赋值给一个变量。

```typescript
exportAs: 'child'
`<child-dir #c="child"></child-dir>`
```



[`queries?`](https://angular.cn/api/core/Directive#queries)

配置一些查询，它们将被注入到该指令中。

```typescript
为指令添加一些数据？？？【添加 ContentChildren 】
queries: {
    contentChildren: new ContentChildren(Backgroud),
  }
```

[`host?`](https://angular.cn/api/core/Directive#host)

一组键值对，将类的属性映射到宿主的元素的绑定（Property、Attribute 和事件）

```typescript
`为宿主元素添加监听事件和自定义属性`
host: {
    '(keyup)' : 'keyupFun($event.target)',
     'test-data': 'hello world'
  }
```

[`jit?`](https://angular.cn/api/core/Directive#jit)

编译模式：jit/aot

- 结构指令

  *ngIf  *ngFor  *switch

- 属性指令

  *ngStyle  *ngClass

- 自定义指令【自定义 结构/属性 指令】

  自定义结构性指令时通过设置@Input的 set属性，更新数据

  

#### @hostListening

#### @ViewChild

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



#### @hostBinding

#### @Attribute

获取宿主元素上的属性