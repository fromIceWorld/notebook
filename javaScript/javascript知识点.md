### javascript

------

##### 下载功能

```typescript
`1.` location.href = '接口'             //  赋值
      // 只支持 get 请求，去服务器拉取文件 
`2.` var blob = new Blob([res], {
          type: "application/vnd.ms-excel;ctf-8",
        }); 
	 a = document.createElement('a');
     href = window.URL.createObjectURL(blob);
     a.href = href;
	 a.setAttribute(
          "download",
          decodeURI(
            res.headers.get("content-disposition").split("filename=")[1]
          )
        );
	 document.body.appendChild(downEL);
     downEL.click();
     document.body.removeChild(downEL);
     window.URL.revokeObjectURL(href);
     
2 支持，post 请求传参，接收二进制流
```

##### 函数

```
function a(name,age){}
a.length:第一个【函数参数默认值】之前的参数的个数。 a.length == 2
function a(name,age = 9){}: a.length == 1
function a(name=2,age = 9){}: a.length == 0
a.length 无法通过赋值修改。
```

##### 原型，原型链，构造函数，实例

```javascript
function Mothor(name){
    this.name = name
}
Mothor.prototype.color = 'yellow';
var son1 = new Mothor('first');
var son2 = new Mothor('second');
 
Mothor.prototype = {
    constructor:Mothor,
    __proto__:Object.prototype
}

son1.__proto__ = Mothor.prototype;
son1.__proto__ = Mothor.prototype;

构造函数:
	构造函数是一个母体，通过 new 来生下实例，母子之间通过__proto__保持(子对母的)单向连接,母体还有自己的     原型，保存constructor（指向自身），和__proto__（指向原型的构造函数的原型Object.prototype）
原型:
	原型是构造函数的数据库，多个实例都通过__proto__共享同一个数据库。
原型链:原型与实例之间的关联(__proto__).
实例:是构造函数生下的产物(对象)，通过__proto__与母连接。

取值规则是:当在实例上找不到对应的数据，就根据__proto__去构造函数的原型(prototype)上找，如果还找不到，继          续根据构造函数的原型的__proto__向上找，找到Object.prototype，如果还找不到再继续找，                Object.prototype.__proto__ 是 null，取值结束。


`__proto__`:是非标准属性【后续可能被取消】，不建议直接取值，Reflect.getPrototypeOf(obj)
```

##### 继承

##### 作用域

```javascript
作用域是代码执行过程中取值的区域，分为全局作用域和函数作用域，在一段代码中，会有一个全局作用域和n个函数作用域层层嵌套，在代码执行过程中作用域会不断的入栈和出栈，维持全局作用域与函数作用域之间的关系,就是执行上下文。

在执行代码的过程中，变量对象 / 作用域链 / this 保证我们的取值，
var scope = "global scope";
function checkscope(){
    var scope2 = 'local scope';
    return scope2;
}
checkscope();

1- 代码执行，进入全局执行上下文(globalContext),globalContext入栈,stack  = [globalContext]
2- 执行代码，创建globalContext.vo = {
    scope："global scope"，
    checkscope：checkscope
   }，checkscope函数的作用域在创建时已经存在checkscope.[[Scope]] = [globalContext.vo]
3- 执行checkscope函数，进入checkscope的执行上下文，checkscope入栈
	stack  = [globalContext，checkscopeContext]
4- 初始化checkscopeContext = {
    AO:{
        arguments:{
            length:0
        },
        scope2:undefined
    },
    Scope:checkscope.[AO, [Scope]],
}
5- 执行checkscope函数，赋值AO
    checkscopeContext = {
        AO:{
            arguments:{
                length:0
            },
            scope2:'local scope'
        },
        Scope:checkscope.[AO, [Scope]],
}
6- 在retrun时，返回scope2，函数执行完毕，checkscopeContect出栈
	stack  = [globalContext]
```

##### **this指向**

```javascript

this的指向是在运行时确定的，按照最基础的理解，谁调用函数，this就指向谁，但是这样的理解是片面的，只是根据this的表现去总结this，最根本上，JavaScript对于this的处理是:
    判断【MemberExpression】是不是Reference，如果是Reference，用GetValue获取base值，如果base是对象，     this指向base，如果base是EnvironmentRecord，返回undefined，如果不是Reference返回undefined。
    if(MemberExpression === Reference){
    	if(typeOf base === Object){
    		this = base
    	}else if(base === EnvironmentRecord){
    		this = undefined
    	}
    } else{
        this = undefined
    }

0- Reference
	是对语言底层行为的一种描述，Reference 定义为“被解析的命名绑定，
    (由标识符解析和属性访问创建）；
     标识符:数据被命名之后，名字就是标识符；
     标识符解析：一层层的寻找数据，foo(寻找foo函数)
     属性访问：foo.bar
	Reference = {
		base:, 属性所在的对象或者是EnvironmentRecord，
				值为[ undefined, an Object, a Boolean, a String, a Number, 
				     or an environment record ]
		name:,属性的名称
		strict:是否是严格模式
	}
    GetBase：是获取Reference的base值的一种方法；
    IsPropertyReference：判断base是否是一个对象，是就返回true;
	GetValue:直接获取对应的name的值，返回的是真正的值，而不是Reference；
1- 确定函数的调用表达式
	var foo = {
    bar: function () {
        return this;
    }
	};

    foo.bar(); // foo

    // bar对应的Reference是：
    var BarReference = {
        base: foo,
        propertyName: 'bar',
        strict: false
    };


2- 在调用时，确认属性访问表达式(MemberExpression)，如果MemberExpression是Reference，GetValue返回     base，
	2.1 通过IsPropertyReference(v)来判断，当v是对象，this = base;
3-当遇到MemberExpression被包裹，GetValue获取被包裹的结果  (=  || ，)
	1.(foo.bar = foo.bar)()；返回的是foo.bar的值是一个函数，不是Reference
	2.(false || foo.bar)()；返回的是foo.bar的值是一个函数，不是Reference
	3.(foo.bar, foo.bar)()；返回的是foo.bar的值是一个函数，不是Reference
	因此在严格模式下this指向undefined，非严格模式下指向window。
   	
```

##### toString / valueOf  -> 隐式 / 显示转换

```javascript
出现背景:带有 +,-,==,++,--,*,!,/。      /等关系运算符/拼接符等情况;
参与数据：基本数据类型(null,undefined,Boolean,number,string,Symbol)
        复杂数据类型(object,array,function,regExp...)
难点1：字符串拼接符(+)和关系运算符(+)的区分，
	 - 当+两边有一边是字符串时，+就是字符串拼接符。将另一种类型转换为基本类型，再转换为            string类型
     - 不满足第一点 就是运算符。将两边最终转换为number运算。
难点2：复杂数据类型的转换。
	 - 当遇到拼接符时会先运行valueOf，如果返回值是基本类型直接返回，不是基本类型，运行            toString(),返回的是基本数据类型就返回，如果不是就报错。
难点3：当两边都是字符串时，比较unicode码
难点4：数组的toString会返回字符串拼接，对象的toString会返回[object,Object]
难点5：!运算符 会将(0,NaN,undefined,null,'',false)认为是false，转换为true，
       其他情况都认为是true,转换为false。而且!优先级高于 ==
`==`：两侧数据类型不同时，会进行隐式转换；
      `1.` 当两侧有一侧是number 时，会将另一侧不是number的 数据转换为number
坑：
	[] == 0 true
	![] == 0 true

	[] == ![] true
	[] == [] false    //比较的是地址

	{} == !{} false
	{} == {}  false   //比较的是地址


注：valueOf 和 toString都是Object.prototype上的函数，可在对象内定义遮蔽。

```

##### 三种事件模型

```javascript
1-DOM0级模型：触发绑定事件，没有传播
2-IE事件模型：触发绑定事件，向上传播
1-DOM2级事件模型：捕获->事件处理->冒泡
```

##### 事件委托

```javascript
依托于事件冒泡的，统一管理机制，在事件冒泡时，冒泡到父级，父级根据event.target识别事件目标，做出相应操作。
```

##### 捕获 / 冒泡

```javascript
事件传播：
	事件发生在某个DOM元素时，并不局限在此DOM元素上，会向上/向下传播。
事件捕获：
	从window ->document ->body，向下寻找元素，直到目标元素，
事件冒泡：
	从目标元素开始，向上传播，直到window
    isCapture:默认为false，在冒泡阶段发生，为true在捕获阶段发生。
    el.addEventListener(event, callback, isCapture);
    在callback里可用event.stopPropagation() / event.cancelBubble = true             取消继续传播
取消默认事件:
	e.preventDefault() / e.returnValue = false
```

##### DOM操作

```javascript
document.createDocumentFragment()  //创建DOM片段
        .createElement()           //创建具体节点
        .createTextNode()          //创建文本节点
el.appendChild(node)               //添加子节点
  .removeChild(node)               //移除子节点
  .replaceChild(new, old)          //替换子节点
  .insertBefore(new, old)          //在某一个节点前添加节点
document.getElementById();
         getElementsByName();
         getElementsByTagName();
         getElementsByClassName();
         querySelector();
         querySelectorAll();
el.getAttribute(key);
   setAttribute(key, value);
   hasAttribute(key);
   removeAttribute(key);

```

##### **垃圾回收机制**

```javascript
1- 引用计数法:
	定义：计算对对象的引用次数，当为0时，说明已经不需要了，可被回收。
    缺点：【循环引用】。
2- 标记清除法
	定义：将'不再使用的对象'定义为'无法到达的对象'，从根部(全局对象)走，能到达的对象，是还需要的，无法到达的对象被标记为不再使用，进行回收
```

##### 哪些操作会造成内存泄漏？

```javascript
1.意外的全局变量
2.被遗忘的计时器或回调函数
3.脱离 DOM 的引用
4.闭包
```

##### **防抖 / 节流**

```typescript
`防抖：`触发事件一定时间后，执行函数，如果一直触发，会一直更新时间，不会触发函数。
`节流：`触发事件后，在一定的时间内再次触发事件无效，只有执行函数后才能再次触发。

`防抖：` function debondce(fn, time){
    	   let timer;
           return function (){
               if(timer){
                   clearTimeout(timer)
               }else{
                   timer = setTimeout(()=>fn(), time)
               }
           }
        }
`节流：` function thr(fn, time){
          let timer = 0; 
          return function(){
              let current = Data.now();
              if(current - timer >= time){
                 fn();
                  timer = current
              }
          }
        }
```



##### **call / apply / bind**

```

```



##### 模块化

```typescript
`浏览器module`:
	浏览器原生支持的模块。
    缺点：IE支持不友好需>=11； 只能通过服务器测试【本地加载会CORS报错】
    优点：不用再写语法糖
`commonJS`:【node】
    引入：require
    输出：module.exports

	0- 同步加载(缺点:浏览器等待);
	1- 输出的是值的拷贝，后续模块内的变化就不会影响输出的值。
	2- 模块可多次加载，但只会在加载时运行一次，结果被缓存，后续加载会读取缓存结果，如果想再次加载，需清空缓存
`AMD`:
	输出：
		 define(id?, dependencies?,factory)
    引入：
         require([dependencies], function(dependencies){})           
           
	0- 主要是requireJS 
	1- 【依赖前置】，在需要的依赖加载完成后，运行回调函数。[解决依赖顺序问题]
	2- 异步[解决了js同步加载浏览器等待问题]
`CMD`:
	输出：
    	define(id?, deps?, factory)
        /**********************       
               define(function(require, exports, module) {
                  var $ = require('jquery.js')
                  $('div').addClass('active');
                });
       ************/
    引入：
        seajs.use(['myModule.js'], function(my){
		});
	0- 主要是seaJS
	1- 【就近依赖】,用到某个模块时再require
	
ES6:
	导出：
    	export  / export default
	导入：
    	import

AMD 与 CMD的不同:
	1-AMD 依赖前置，定义模块时要声明其依赖的模块，
      CMD 就近依赖，用到某个模块再require。
      AMD 在加载完成define好的模块就会立即执行，所有执行完成后，遇到require执行主逻辑【提前加载】
      CMD 在加载完成define好的模块，仅仅是下载不执行，只有需要用时require才执行模块【按需加载】
      AMD用户体验好，CMD性能好。

```

------

##### 字符串转换为数字

```javascript
let st = '1.23b'
parseFloat(st)
```

##### dom事件

###### mousewheel

```typescript
mousewheel[滚轮事件]：deltaY，wheelDelta和detail 判断滚轮滚动方向【在各浏览器支持程度不同】
deltaY：正值向下，负值向上,与操作系统的鼠标设置有关，绝对值为滚动幅度
wheelDaelta:向上120，向下-120,但为常量，只能判断方向，与滚轮速率无关[`chrome,Edge`支持]
detail:向上3，向下-3,但为常量，只能判断方向，与滚轮速率无关[只有`Firefox`支持]
detail，wheelDelta：与滚轮速率无关，无用属性

`deltaY:最可靠。`
```

##### 运算符优先级

```typescript
++i
> < 
i++
```

##### in

```typescript
`判断某个属性是否在对象及其原型链上`
in 会查到 自身的不可枚举属性
in 会去对象的 原型链上寻找属性
```

##### for循环

```typescript
`for循环中，设置循环变量的部分是父作用域，循环体内部是一个单独的作用域`
for循环中的let 和var：
var声明的变量是全局的，每一次循环，都改变全局变量，循环体内的变量指向全局变量
let生命的变量只在当前循环内有效，`每一次循环都会声明一个变量`，循环体内的变量指向上级作用域声明的变量

------------------------------------------------------------------


for/in：遍历对象`自身可继承，枚举`属性【操作的是`key`,对象：key，数组：index,字符串：index】
可配合 对象.hasOwnProperty(key),选择是否过滤原型上的值。

for/of：调用Iterator接口【Symbol.iterator()】产生遍历器【操作的是`value`】
forEach：

for/in，for：break可跳出整个循环，continue可跳出当前循环，return会报错`return只能放在函数中`。
forEach，map，filter：break,continue会报错，return跳出当前循环。不跳出整个函数
for/of：break,continue，return 正常`return只能放在函数中`

Object.keys():返回对象`自身所有`可枚举属性


重要：`return 需要放在函数中😥😥;break,continue 在for/while循环中`
```

###### for...in

```typescript
for...in 会遍历出原型链上的属性【但不会遍历Symbol属性的key】

let B = Symbol('BBB')
function Ap(age,sex){
    this.age = age;
    this.sex = sex;
}
Ap.prototype.go = function(){}
Ap[B] = 'bbb'
for(let key in a){console.log(key)}

`
age
sex
go
`
```

##### Object.create

```typescript
params prototype   原型
params description 新对象的描述符

Object.create(
    {age:12},
    {sex:{value:'man'}, 
     name:{value:'新对象'，enumerable：true，writable:false}
    }
)
创建一个新对象，使用现有的对象来提供新创建对象的__proto__
```

##### Object.freeze 和Object.seal

```typescript
`Object.freeze`:冻结对象，对象的属性无法被修改，对象无法添加/删除属性
                【可枚举型，可配置性，可写性，不能修改已有属性的值】
                【对象的原型也不能被修改】
                但是对象属性如果是对象，那么子对象如果未被freeze，内部属性是可修改的
`Object.seal` :封闭一个属性，阻止新属性的添加，并将现有属性标记为不可配置，当前属性的值只要是可修改的，就可以改写【configable:false】__proto__属性也不可修改               
```

##### Object.entries、Object.fromEntries

```typescript
`Object.entries`:将对象转换为数组类型的key：value 
                   【可转换为 Map =  new Map(Object.entries())】
`Object.fromEntries`：将数据类型的key:vakue 转换为对象
                   【将map转换为object obj = Object.fromEntries(Map)】
```

##### Object.getOwnPropertyNames

##### Object.getOwnPropertySymbols

##### Object.keys

```typescript
`keys:`获取对象自身的可枚举属性 // 不会获取数组的length属性
`getOwnPropertyNames:`获取对象自身的属性【包括不可枚举属性，但不包括Symbol属性】
                           // 会获取数组的length属性
`getOwnPropertySymbols:`获取自身所有的Symbols属性
```



##### Object.defineProperty

```typescript
`configurable`：为true，该属性的【描述符】才能被修改，同时该属性才能从对应的对象上被删除
`enumerable`：为true，属性才会出现在对象的枚举属性中【默认为false】
`value`：对应的值
`writable`：当且仅当该属性值为true时，上面的value才能被改变
`get`
`set`
```

##### .hasOwnProperty

```typescript
判断对象自身中是否有对应属性
```



##### slice,split,splice

```typescript
slice函数【string,Array】:slice(start,end?)`复制子集合，从start开始，end结束，不取end,`
split函数【string】：split(值或者正则,限制返回数组的最大数量)`不影响原字符串，切割后返回数组`
splice函数【Array】splice(start,numbe?,...add)：`操作数组本身本身,从start坐标开始，切割指定数量的值,不指定值就全部切割，为null则不切割，第三个参数后都是往数组添加的值：最终返回切割的值`                   
```

### 数组

快速创建二维数组

```typescript
Array.from(new Array(m), ()=>new Array(n));

`new Array(m)`: 只会声明一个长度为m的数组，但是无内容，// 数组的实际长度小于声明的长度，会用empty填满
                [empty*m] //实际长度为0，声明长度为m，empty填满

`Array.from`:会将第一个参数转换为数组，empty转换为 undefined；
             第二个参数相当于对第一个参数进行map
```



### ES6

------

##### let

```typescript
`0.`let声明的变量只在let命令所在的代码块内有效
`1.`let不存在变量提升
`2.`同一个作用域不可以使用let重复声明同一个变量
`3.`暂时性死区，只要块级作用域内存在let命令，它所声明的变量就`绑定`这个区域，不再受到外部的影响
     var tmp = 123;
     if (true) {
        tmp = 'abc'; // ReferenceError
        let tmp;
     }
```

##### const

```typescript
const声明一个只读变量，一旦声明，常量的值就不能改变;
`1.`同样存在暂时性死区，只能在声明的位置后面使用
`2.`不可重复声明

const本质上是保证变量指向的内存地址不能修改：
 基础类型，指向的变量的地址就是变量值
 复杂类型，指向的变量的地址，保存的是指向时机数据的指针
```

##### 块级作用域

```typescript
ES6引入了块级作用域
原因：
`1.` 内层变量会覆盖外层变量
`2.` 用来计数的循环变量泄露为全局变量

块级作用域必须用{}包裹
```

##### 顶层对象与全局变量

```typescript
全局变量：window
顶层对象：globalThis

`ES6中，将全局变量与顶层对象逐步区分：`
var，function 声明的全局变量依旧是顶层对象的属性
let，const，class声明的全局变量，不属于顶层对象的属性
```

##### Map

```typescript
键值对的集合（键不在局限于字符串）
```

##### weakMap

```typescript
`我们想在某个对象上存放一些数据，但是会形成对这个对象的引用`
因此引入weakMap 对对象弱引用，不妨碍垃圾回收机制

无遍历操作（keys(),values(),entries()）,无size属性，不支持clear，因此只有get(),set(),has(),delete()
```

##### weakRef

```typescript
用于直接创建对象的弱引用：
let target = {};
let wr = new WeakRef(target);
`wr.deref()`:获取原始对象
```



##### Set

```typescript
类似于数组，但成员都是唯一的（成员可以是任何值）
`1.`可遍历
```

##### weakSet

```typescript
`1.`weakSet的成员只能是对象
`2.`weakSet中的对象都是弱引用，即垃圾回收不考虑weakSet对该对象的引用；
`3.`weakSet不可遍历，由于weakSet的内部有多少成员取决于垃圾回收有没有运行，运行前后可能个数不一样，，
    而垃圾回收何时运行是不可预测的，所以weakSet不可遍历    
```

##### 箭头函数

```typescript
与普通函数的区别：普通函数的this是动态的，在执行时确定，箭头函数的this是静态的，在声明时确定，指向所在上下文【上层作用域】的this

`1.` 箭头函数没有自己的this对象
     内部的this是定义时上层作用域中的this`【箭头函数内部的this指向是固定的】`
`2.`不可以当作构造函数【因为没有this】
`3.`不可以使用arguments对象
`4.`不可以使用yield命令

`5.`不存在super，new.target
`6.`因为没有自己的this，所以不能用call，apply，bind这些方法改变this的指向

`不适用场合：`
`1.`对象中的属性是箭头函数且内部使用this，this会指向对象所在的作用域【全局对象】
     const cat = {
          lives: 9,
          jumps: () => {
            this.lives--;
          }
        }
```

##### 尾调用

```typescript
某个函数的最后一步是调用另一个函数：
function f(x){
  return g(x);
}
`函数调用：`函数调用会在内存中形成一个·调用记录·,又称为·调用帧·，保存调用位置和内部变量信息。
          如果在函数A的内部调用函数B，那么在A的调用帧上方，还会形成一个B的调用帧，等B运行结束，将结果返回             A，B的调用帧才会消失，如果B内部还调用函数C，那么还有一个C的调用帧，以此类推，所有的调用帧，行程一           个`调用栈`。
`尾调用优化：`尾调用由于是函数的最后一步操作，所以不需要外层函数的调用帧，因为调用位置，内部信息都不会用到了，            只要直接调用内层函数的调用帧，取代外层函数的调用帧就可以了。

```

##### 尾递归

```typescript
函数调用自身，称为递归。如果尾调用自身，称为尾递归。
function factorial(n) {
  if (n === 1) return 1;
  return n * factorial(n - 1);
}

factorial(5) // 120

`尾递归优化：`
function factorial(n, total) {
  if (n === 1) return total;
  return factorial(n - 1, n * total);
}

factorial(5, 1) // 120
```



##### Class

```typescript
内部默认严格模式
`1.` 只能使用new 调用
`2.` 不存在变量提升
`3.` name属性就是声明class时的后缀名称
`4` 类的方法内部如果含有this，默认指向类实例

`static`： 类的方法不被实例继承，父类的静态方法可以被子类继承
`private`：只能在类的方法中使用，子类/实例中无法使用
`protected`：只能在类及子类中使用，实例中无法使用

```



##### **proxy**

用于修改某些操作的默认行为，等同于在语言层面作出修改，属于一种`元编程`

proxy是在目标对象之前假设一层拦截

`target`：目标对象

`propKey`：目标属性

`receiver`：Proxy实例

```javascript
- `get`(target, propKey, receiver)：拦截对象属性的读取，比如proxy.foo和proxy['foo']。
- `set`(target, propKey, value, receiver)：拦截对象属性的设置，比如
	                                   proxy.foo = v或proxy['foo'] = v，返回一个布尔值。
- `has`(target, propKey)：拦截propKey in proxy的操作，返回一个布尔值。
- `deleteProperty`(target, propKey)：拦截delete proxy[propKey]的操作，返回一个布尔值。
- `ownKeys`(target)：拦截 Object.getOwnPropertyNames(proxy)
        Object.getOwnPropertySymbols(proxy)、Object.keys(proxy)、for...in循环，返回一个数组。
   该方法返回目标对象所有自身的属性的属性名，而Object.keys()的返回结果仅包括目标对象自身的可遍历属性。
- `getOwnPropertyDescriptor`(target, propKey)：拦截Object.getOwnPropertyDescriptor(proxy,      propKey)，返回属性的描述对象。
- `defineProperty`(target, propKey, propDesc)：拦截Object.defineProperty(proxy, propKey,      propDesc）、Object.defineProperties(proxy, propDescs)，返回一个布尔值。
- `preventExtensions`(target)：拦截Object.preventExtensions(proxy)，返回一个布尔值。
- `getPrototypeOf`(target)：拦截Object.getPrototypeOf(proxy)，返回一个对象。
- `isExtensible`(target)：拦截Object.isExtensible(proxy)，返回一个布尔值。
- `setPrototypeOf`(target, proto)：拦截Object.setPrototypeOf(proxy, proto)，返回一个布尔值。如   果目标对象是函数，那么还有两种额外操作可以拦截。
- `apply`(target, object, args)：拦截 Proxy 实例作为函数调用的操作，比如proxy(...args)、
   proxy.call(object, ...args)、proxy.apply(...)。
- `construct`(target, args)：拦截 Proxy 实例作为构造函数调用的操作，比如new proxy(...args)。
   
`相对于Object.defineProperty优点`:   
     1. proxy 是监听对象，Object.defineProperty是监听属性
     2. 可监听数组的变换
     3. 返回的是新对象，可以只操作新对象，Object.defineProperty只能遍历对象属性直接修改
     4. 新标准
`缺点`：
     1. 暂时没有Object.defineProperty 兼容新好 
     
     
     
`Proxy.revocable()`:返回可取消的Proxy实例
    let target = {};
    let handler = {};

    let {proxy, revoke} = Proxy.revocable(target, handler);

    proxy.foo = 123;
    proxy.foo // 123

    revoke();
    proxy.foo // TypeError: Revoked
```

###### this指向

```typescript
`1.` Proxy对target进行代理后，target中的this会指向Proxy代理
        const target = {
          m: function () {
            console.log(this === proxy);
          }
        };
        const handler = {};

        const proxy = new Proxy(target, handler);

        target.m() // false
        proxy.m()  // true
`2.` proxy拦截函数内部的this，指向的是handler对象
        const handler = {
          get: function (target, key, receiver) {
            console.log(this === handler);
            return 'Hello, ' + key;
          },
          set: function (target, key, value) {
            console.log(this === handler);
            target[key] = value;
            return true;
          }
        };

        const proxy = new Proxy({}, handler);

        proxy.foo
        // true
        // Hello, foo

        proxy.foo = 1
        // true
```



##### Reflect

```typescript
`设计目的:`
`1.`将Object对象中一些属于内部的方法(Object.defineProperty),放到Reflect对象上。
    现阶段某些方法同时在Object和Reflect上，未来新方法只部署在Reflect对象上，也就是在Reflect上
    获取语言内部的方法
`2.`修改某些Object的方法使其变得合理，例如Object.defineProperty(...)在无法定义属性时，会抛错，而
    Reflect.defineProperty(...)则会返回false
`3.`让Object操作都变成函数行为，某些Object是命令式
    'assign' in Object
    Reflect.has(Object, 'assign')
`4.`Reflect对象的方法与Proxy对象上的方法一一对应，这就可以让Proxy对象可以方便的调用Reflect方法，完成       默认行为，作为修改行为的基础。也就是，不管Proxy怎末修改默认行为，总可以在Reflect上获取默认行为。
    Proxy(target, {
      set: function(target, name, value, receiver) {
        var success = Reflect.set(target, name, value, receiver);
        if (success) {
          console.log('property ' + name + ' on ' + target + ' set to ' + value);
        }
        return success;
      }
    });

`Proxy拦截对象的属性行为，采用Reflect确保完成原有的行为，然后再完成Proxy部署的额外的功能`
```



##### Promise

```javascript
1- 三种状态,pending/rejected/resolved,只能pending转为 rejected和resolved
2- then有两个支路(成功/失败),由前一个promise确定.只有前一个状态确定才会执行后续的程序
3- thenable,兼容其他的类promise
4- 控制反转,内层返回的promise可控制外层的promise

代码路径：'../Promise'
```

##### Iterator

统一的接口机制，处理不同的数据结构;

任何数据只要部署`Iterator`接口，就可以完成遍历操作。

1. 为各种数据结构提供一个统一的，简便的访问接口
2. 使得数据结构的成员能够按照某种次序排列
3. ES6创造了一种新的遍历命令for...of循环，Iterator接口主要供for...of消费

```typescript
var it = makeIterator(['a', 'b']);

it.next() // { value: "a", done: false }
it.next() // { value: "b", done: false }
it.next() // { value: undefined, done: true }

function makeIterator(array) {
  var nextIndex = 0;
  return {
    next: function() {
      return nextIndex < array.length ?
        {value: array[nextIndex++], done: false} :
        {value: undefined, done: true};
    }
  };
}
```



##### async / await

```typescript
`async是Generator 的语法糖`
相较于Generator：
`1.` 内置执行器
`2.` 更好的语义
`3.` 更广的实用性
     yield命令后面只能跟Thunk函数/Promise对象，async函数的await命令后面，可以是Promise和        原始类型值【会自动转换成Promise.resolve(值)】
`4.` 返回的是Promise

`可实现多次重复尝试`：
配合try...catch 内部循环

`缺点：`
任何一个await语句后面的Promise对象变为reject状态，那么整个async函数都会中断执行
```



##### generator

##### module

ES6的模块是一种`静态定义`，在代码静态解析阶段生成

与CommonJS的不同：

1. CommonJS是值的拷贝，module是值的引用
2. CommonJS是运行时加载，ES6是编译时输出接口
3. CommonJS的模块require()是同步加载模块，ES6的import命令是异步加载，有一个独立的模块依赖的解析阶段

```typescript
内部默认严格模式
`export----------------------------------------`
1. export 输出的接口与值是动态绑定的【`CommonJS输出的是值的缓存，不存在动态更新`】
2. export可以出现在模块的任何位置，只要处于模块的顶层就行，处于块级作用域就会报错【处于条件代码中就无法做动    态优化，违背ES6模块设计的初衷】
`import----------------------------------------`
import {a,b} from './other.module'
import _ from 'lodash'   // 加载default，并重命名为_

1. import命令输入的变量都是只读的
2. import命令具有提升效果，会提升到整个模块的头部，首先执行
   【import命令是编译阶段执行的，在代码运行之前】
3. import是静态执行，所以不能使用表达式和变量，这些只有在运行时才能得到结果的语法结构

`动态导入：` 
import是静态执行，因此想要实现运行时导入：import(***).then(**)

```



------

### Vue

------

##### 发布订阅模式

```
1- 闭包dep,添加 __ob__ 属性(引用value,有自己的dep)
2- 数组：劫持方法(对于添加属性的方法[push,unshift,splice(，，value)]进行劫持观测；
      (pop,shift,sort,reverse直接进行依赖更新))。
3- $set /$delete ,用 __ob__.dep 进行依赖更新 

路径：'./definePropoty'
```

发布订阅模式

