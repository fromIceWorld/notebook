**类型的重要意义之一是限制了数据的可用操作与实际意义**

### 类型系统层级

判断类型兼容

```typescript
type Result = 'linbudu' extends string ? 1 : 2;
```

```typescript
// 8
type VerboseTypeChain = never extends 'linbudu'
  ? 'linbudu' extends 'linbudu' | 'budulin'
  ? 'linbudu' | 'budulin' extends string
  ? string extends {}
  ? string extends String
  ? String extends {}
  ? {} extends object
  ? object extends {}
  ? {} extends Object
  ? Object extends {}
  ? object extends Object
  ? Object extends object
  ? Object extends any
  ? Object extends unknown
  ? any extends unknown
  ? unknown extends any
  ? 8
  : 7
  : 6
  : 5
  : 4
  : 3
  : 2
  : 1
  : 0
  : -1
  : -2
  : -3
  : -4
  : -5
  : -6
  : -7
  : -8

```



### type 与 interface

```typescript
一般interface 用来描述对象、类的结构，
而type用来将一个函数签名、一组联合类型、一个工具类型等等抽离成一个完整独立的类型。
```

#### interface的合并

```typescript
`子接口中的属性类型需要能够兼容（extends）父接口中的属性类型`
interface Struct1 {
  primitiveProp: string;
  objectProp: {
    name: string;
  };
  unionProp: string | number;
}

// 接口“Struct2”错误扩展接口“Struct1”。
interface Struct2 extends Struct1 {
  // “primitiveProp”的类型不兼容。不能将类型“number”分配给类型“string”。
  primitiveProp: number;
  // 属性“objectProp”的类型不兼容。
  objectProp: {
    age: number;
  };
  // 属性“unionProp”的类型不兼容。
  // 不能将类型“boolean”分配给类型“string | number”。
  unionProp: boolean;
}
```

如果直接声明多个同名接口，虽然接口会合并，但同名属性仍然需要兼容

```typescript
interface Struct1 {
  primitiveProp: string;
}

interface Struct1 {
// 后续属性声明必须属于同一类型。
// 属性“primitiveProp”的类型必须为“string”，但此处却为类型“number”。
  primitiveProp: number;
}
```

#### 接口和类型别名之间的合并

```typescript
type Base = {
  name: string;
};

interface IDerived extends Base {
  // 报错！就像继承接口一样需要类型兼容
  name: number;
  age: number;
}

interface IBase {
  name: string;
}

// 合并后的 name 同样是 never 类型
type Derived = IBase & {
  name: number;
};
```



### 原始类型

```

```



### 字面量类型和联合类型

#### 字面量类型

```typescript
const str1: "linbudu" = "linbud";

`一般和联合类型一起使用`
```

#### 对象字面量类型

```typescript
interface Tmp {
  obj: {
    name: "linbudu",
    age: 18
  }
}
const tmp: Tmp = {
  obj: {
    name: "linbudu",
    age: 18
  }
}
```

#### 联合类型

```typescript
interface Tmp {
  bool: true | false;
  num: 1 | 2 | 3;
  str: "lin" | "bu" | "du"
}
```

### 枚举

```typescript
enum Items {
  Foo,
  Bar,
  Baz
}
const fooValue = Items.Foo; // 0
const fooKey = Items[0]; // "Foo"
```

### 函数与Class中的类型

#### 函数类型

```typescript
`函数类型描述了函数入参类型与函数返回值类型`
function foo(name: string): number {
  return name.length;
}
`类型抽离：`
type FuncFoo = (name: string) => number
const foo: FuncFoo = (name) => {
  return name.length
}

interface FuncFooStruct {
  (name: string): number
}
`这时的 interface 被称为 Callable Interface`
看起来可能很奇怪，但我们可以这么认为，interface 就是用来描述一个类型结构的，而函数类型本质上也是一个结构固定的类型罢了
```

##### 可选参数

```typescript
`可选参数必须位于必选参数之后`
function foo1(name: string, age?: number): number {
  const inputAge = age || 18; // 或使用 age ?? 18
  return name.length + inputAge
}
```

##### rest参数

```typescript
function foo(arg1: string, ...rest: any[]) { }

function foo(arg1: string, ...rest: [number, boolean]) { }
```

##### 函数重载

函数的返回类型基于其入参值

```typescript
function func(foo: number, bar: true): string;
function func(foo: number, bar?: false): number;
function func(foo: number, bar?: boolean): string | number {
  if (bar) {
    return String(foo);
  } else {
    return foo * 599;
  }
}

const res1 = func(599); // number
const res2 = func(599, true); // string
const res3 = func(599, false); // number
`拥有多个重载声明的函数在被调用时，是按照重载的声明顺序往下查找的`
```

##### 异步函数、Generator 函数

```typescript
async function asyncFunc(): Promise<void> {}
function* genFunc(): Iterable<void> {}
async function* asyncGenFunc(): AsyncIterable<void> {}
```

#### Class

##### 构造函数、属性、方法、访问符

```typescript
class Foo {
  prop: string;
  constructor(inputProp: string) {
    this.prop = inputProp;
  }
  print(addon: string): void {
    console.log(`${this.prop} and ${addon}`)
  }
  get propA(): string {
    return `${this.prop}+A`;
  }
  set propA(value: string) {
    this.prop = `${value}+A`
  }
}
```

##### 修饰符

`public` `private` `protected` `readonly`

```typescript
readonly 属于操作性修饰符,其他三位都属于访问性修饰符。
`public`:    类，子类，实例
`private`:   类
`protected`: 类，子类

在构造函数中对参数应用访问性修饰符：
class Foo {
  constructor(public arg1: string, private arg2: boolean) { }
}
new Foo("linbudu", true)
此时，参数会被直接作为类的成员（即实例的属性），免去后续的手动赋值。
```

##### 静态成员

`static`

```typescript
class Foo {
  static staticHandler() { }
    
  public instanceHandler() { }
}
`静态成员不会被实例继承，始终属于当前定义的这个类(以及其子类)`
```

##### 继承、实现、抽象类

```typescript
class Base { }

class Derived extends Base { }
```

###### 派生类对基类的访问与覆盖

```typescript
1.派生类对基类的访问是由其访问修饰符决定的。
2.基类的方法可以在派生类中被覆盖，但是仍然可以通过`super`访问到基类中的方法。
    class Base {
      print() { }
    }

    class Derived extends Base {
      print() {
        super.print()
        // ...
      }
3.在派生类覆盖基类方法时，我们并不能确保派生类的这一方法能覆盖基类方法，在ts@4.3引入了`override`确保派生类尝试覆盖的方法在基类中一定存在
    class Base {
      printWithLove() { }
    }

    class Derived extends Base {
      override print() { // error [尝试覆盖的方法并未在基类中声明]
        // ...
      }
    }
```

##### 抽象类

抽象类是对类结构与方法的抽象

```typescript
`一个抽象类描述了一个类中应当有哪些成员（属性、方法等），一个抽象方法描述了这一方法在实际实现中的结构`
abstract class AbsFoo {
  abstract absProp: string;
  abstract get absGetter(): string;
  abstract absMethod(name: string): string
}
```

###### implements

实现抽象类

```typescript
class Foo implements AbsFoo {
  absProp: string = "linbudu"

  get absGetter() {
    return "linbudu"
  }

  absMethod(name: string) {
    return name
  }
}
```

##### SOLID原则

###### S：单一原则

```typescript
`一个类应该仅具有一种职责`
对一个数据实体的操作，读操作和写操作应该被视为两种不同的职责，并被分配到两个类中。
```

###### O：开放封闭原则

```typescript
`一个类应该是可扩展但不可修改的`
例如登录:微信登录,支付宝登录。
不能通过if/else来进行开发,如果后续增加美团登录,逻辑会复杂。

1.我们将登录逻辑抽离
2.不同的登陆方式通过扩展基础类实现在记得特殊逻辑。

abstract class LoginHandler {
  abstract handler(): void
}

class WeChatLoginHandler implements LoginHandler {
  handler() { }
}

class TaoBaoLoginHandler implements LoginHandler {
  handler() { }
}

class TikTokLoginHandler implements LoginHandler {
  handler() { }
}

class Login {
  public static handlerMap: Record<LoginType, LoginHandler> = {
    [LoginType.TaoBao]: new TaoBaoLoginHandler(),
    [LoginType.TikTok]: new TikTokLoginHandler(),
    [LoginType.WeChat]: new WeChatLoginHandler(),

  }
  public static handler(type: LoginType) {
    Login.handlerMap[type].handler()
  }
}
```

###### L：里式替换原则

```typescript
`一个派生类可以在程序的任何一处对其基类进行替换`
子类完全继承了父类的一切，对父类进行了功能的扩展(而非收窄)
```

###### I：接口分离原则

```typescript
`类的实现方式应当只需要实现自己需要的那部分接口`
微信登录需要密码，指纹，面容。支付需要密码。
我们提供的抽象类应当按照功能维度拆分成颗粒度最小的组成才对。
```

###### D：依赖倒置原则

```typescript
`对功能的实现应该依赖于抽象层`
我们的登录提供方法应该基于共同的登录抽象类实现（LoginHandler），最终调用方法也基于这个抽象类，而不是在一个高阶登录方法中去依赖多个低阶登录提供方。
```

### 类型断言

`as`

```typescript
在 TypeScript 类型分析不正确或不符合预期时，将其断言为此处的正确类型。
```

### 双重断言

```typescript
如果在使用类型断言时，原类型与断言类型之间差异过大，TypeScript 会给你一个类型报错。
const str: string = "linbudu";
// 从 X 类型 到 Y 类型的断言可能是错误的，blabla
(str as { handler: () => {} }).handler()
```

此时它会提醒你先断言到 unknown 类型，再断言到预期类型，就像这样：

```typescript
const str: string = "linbudu";

(str as unknown as { handler: () => {} }).handler();
```

这是因为你的断言类型和原类型的差异太大，需要先断言到一个通用的类，即 any / unknown。这一通用类型包含了所有可能的类型，因此**断言到它**和**从它断言到另一个类型**差异不大。

### 非空断言

`!`

配置项： `non-nullable-type-assertion-style`

```typescript
declare const foo: {
  func?: () => ({
    prop?: number | null;
  })
};

foo.func!().prop!.toFixed();

`非空断言类型断言的简写,笃定有对应属性：`
((foo.func as () => ({
  prop?: number;
}))().prop as number).toFixed();


const element = document.querySelector("#id")!;
```

### 类型工具

#### 类型别名

```typescript
`对一组类型或一个特定类型结构进行封装，以便于在其它地方进行复用`
`可以使用泛型`
type A = string;

`抽离联合类型`：
type StatusCode = 200 | 301 | 400 | 500 | 502;
const status: StatusCode = 502;

`抽离函数类型`：
type Handler = (e: Event) => void;

const clickHandler: Handler = (e) => { };

`声明一个对象类型`：
type ObjType = {
  name: string;
  age: number;
}
```

#### 工具类型[泛型]

```typescript
type Factory<T> = T | number | string;
```

#### 联合类型和交叉类型

##### 联合类型

`|`

A`|`B 满足 A 或者 B 

##### 交叉类型

`&`   

A`&`B需要同时满足 A 与 B 两个类型

```typescript
interface NameStruct {
  name: string;
}
interface AgeStruct {
  age: number;
}
type ProfileStruct = NameStruct & AgeStruct;

const profile: ProfileStruct = {
  name: "linbudu",
  age: 18
}
```

###### 对象类型交叉

```typescript
`对象类型的交叉类型，其内部的同名属性类型同样会按照交叉类型进行合并：`
type Struct1 = {
  primitiveProp: string;
  objectProp: {
    name: string;
  }
}

type Struct2 = {
  primitiveProp: number;
  objectProp: {
    age: number;
  }
}

type Composed = Struct1 & Struct2;

type PrimitivePropType = Composed['primitiveProp']; // never
type ObjectPropType = Composed['objectProp']; // { name: s
```

#### 索引类型

##### 索引签名类型

```typescript
interface AllStringTypes {
  propA: number;
  [key: string]: string;
}
```

##### 索引类型查询

`keyof`

```typescript
interface Foo {
  linbudu: 1,
  599: 2
}

type FooKeys = keyof Foo; // "linbudu" | 599
```

##### 索引类型访问

```typescript
`可通过类型获取类型`
interface NumberRecord {
  propA: string;
  [key: string]: number;
}
type PropAType = NumberRecord['propA']; // string
type PropType = NumberRecord[string]; // number


interface Foo {
  propA: number;
  propB: boolean;
  propC: string;
}
type PropTypeUnion = Foo[keyof Foo]; // string | number | boolean

```

#### 映射类型

```typescript
type Stringify<T> = {
  [K in keyof T]: string;
};

interface Foo {
  prop1: string;
  prop2: number;
  prop3: boolean;
  prop4: () => void;
}

type StringifiedFoo = Stringify<Foo>;

// 等价于
interface StringifiedFoo {
  prop1: string;
  prop2: string;
  prop3: string;
  prop4: string;
}

type Clone<T> = {
  [K in keyof T]: T[K];  //索引类型访问
};
```

#### 类型查询操作符

`typeof`

```typescript
1.在逻辑代码中使用的 typeof 一定会是 JavaScript 中的 typeof，而类型代码（如类型标注、类型别名中等）中的一定是类型查询的 typeof.
2.
```

`ReturnType`

返回一个函数类型中返回值位置的类型

```typescript
const func = (input: string) => {
  return input.length > 10;
}
// boolean
type FuncReturnType = ReturnType<typeof func>;
```

#### 类型守卫⚔

通过分析逻辑代码，可推断出变量的类型。

```typescript
declare const strOrNumOrBool: string | number | boolean;

if (typeof strOrNumOrBool === "string") {
  // 一定是字符串！
  strOrNumOrBool.charAt(1);
} else if (typeof strOrNumOrBool === "number") {
  // 一定是数字！
  strOrNumOrBool.toFixed();
} else if (typeof strOrNumOrBool === "boolean") {
  // 一定是布尔值！
  strOrNumOrBool === true;
} else {
  // 要是走到这里就说明有问题！
  const _exhaustiveCheck: never = strOrNumOrBool;
  throw new Error(`Unknown input type: ${_exhaustiveCheck}`);
}
```

`in`，`instance`，`is`

#### 类型断言守卫⚔

```typescript
let name: any = 'linbudu';

function assertIsNumber(val: any): asserts val is number {
  if (typeof val !== 'number') {
    throw new Error('Not a number!');
  }
}

assertIsNumber(name);

// number 类型！
name.toFixed();
```

### 泛型

#### 泛型与类型别名结合

```typescript
映射类型
索引类型
条件类型:
type IsEqual<T> = T extends true ? 1 : 2;

```

#### 泛型约束与默认值

```typescript
`默认值`：
type Factory<T = boolean> = T | number | string;

`泛型约束`:要求传入的泛型符合某个条件：
             使用 extends number 限制传入类型
              =10000 声明一个默认值
             
 type ResStatus<ResCode extends number =10000> = ResCode extends 10000 | 10001 | 10002
  ? 'success'
  : 'failure';

type Res1 = ResStatus<10000>; // "success"
type Res2 = ResStatus<20000>; // "failure"

type Res3 = ResStatus<'10000'>; // 类型“string”不满足约束“number”。            
             
```

#### 多泛型关联

```typescript
type Conditional<Type, Condition, TruthyResult, FalsyResult> =
  Type extends Condition ? TruthyResult : FalsyResult;

//  "passed!"
type Result1 = Conditional<'linbudu', string, 'passed!', 'rejected!'>;

// "rejected!"
type Result2 = Conditional<'linbudu', boolean, 'passed!', 'rejected!'>;

```

#### Class中的泛型

Class 中的泛型消费方则是属性、方法、乃至装饰器等

```typescript
class Queue<TElementType> {
  private _list: TElementType[];

  constructor(initial: TElementType[]) {
    this._list = initial;
  }

  // 入队一个队列泛型子类型的元素
  enqueue<TType extends TElementType>(ele: TType): TElementType[] {
    this._list.push(ele);
    return this._list;
  }

  // 入队一个任意类型元素（无需为队列泛型子类型）
  enqueueWithUnknownType<TType>(element: TType): (TElementType | TType)[] {
    return [...this._list, element];
  }

  // 出队
  dequeue(): TElementType[] {
    this._list.pop();
    return this._list;
  }
}
```

### 结构化类型

`核心理念`：基于类型结构进行判断类型兼容性

别称：`鸭子类型`

**如果你看到一只鸟走起来像鸭子，游泳像鸭子，叫得也像鸭子，那么这只鸟就是鸭子**。

```typescript
class Cat {
  eat() { }
}
class Dog {
  eat() { }
}
function feedCat(cat: Cat) { } //并没有报错
feedCat(new Dog())
`因为ts比较两个类型是通过比较两个类型上实际拥有的属性和方法`
```

```typescript
class Cat {
  eat() { }
}

class Dog {
  bark() { }
  eat() { }
}

function feedCat(cat: Cat) { } // 不会报错

feedCat(new Dog())
`结构化类型系统认为 Dog 类型完全实现了 Cat 类型。至于额外的方法 bark，可以认为是 Dog 类型继承 Cat 类型后添加的新方法，即此时 Dog 类可以被认为是 Cat 类的子类`
```

### 标称类型系统

两个可兼容的类型，**其名称必须是完全一致的**

```typescript
type USD = number;
type CNY = number;

const CNYCount: CNY = 200;
const USDCount: USD = 200;

function addCNY(source: CNY, input: CNY) {
  return source + input;
}

addCNY(CNYCount, USDCount)
`标称类型系统中，CNY 与 USD 被认为是两个完全不同的类型`
```

### 类型的逻辑运算

`infer`：inference(推断)的缩写

**在条件类型中提取类型的某一部分信息**

```typescript
type FunctionReturnType<T extends Func> = T extends (
  ...args: any[]
) => infer R
  ? R
  : never;
`当传入的类型参数满足 T extends (...args: any[] ) => infer R 这样一个结构（不用管 infer R，当它是 any 就行），返回 infer R 位置的值，即 R。否则，返回 never。`
```

### 协变与逆变

**随着某一个量的变化，随之变化一致的即称为协变，而变化相反的即称为逆变。**

### 反射

**在程序运行时去检查以及修改程序行为**

```typescript
Proxy中的 Reflet 符合
```

### 反射元数据

未成为标准，需要安装 [reflect-metadata](https://github.com/rbuckton/reflect-metadata) 

```typescript
反射元数据提案（即 "reflect-metadata" 包）为顶级对象 Reflect 新增了一批专用于元数据读写的 API，如 Reflect.defineMetadata、Reflect.getMetadata 等。
`元数据`：用于描述数据的数据,如某个方法的参数信息、返回值信息就可称为该方法的元数据。
`元数据存储`：
为类或类属性添加了元数据后，构造函数（或是构造函数的原型，根据静态成员还是实例成员决定）会具有 [[Metadata]] 属性，，该属性内部包含一个 Map 结构，键为属性键，值为元数据键值对。也就是说，静态成员的元数据信息存储于构造函数，而实例成员的元数据信息存储于构造函数的原型上。
`静态成员的元数据信息存储于构造函数，而实例成员的元数据信息存储于构造函数的原型上`
```

