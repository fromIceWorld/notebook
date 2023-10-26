## call

```javascript
var foo = {
    value:'call'
}
function bar(name,age){
    console.log(this.value)
    console.log(name,age)
}
bar.call(foo,'Ace',12)
```

用法：function.call（context , params1 , params2 , ....）

解释：call() 方法在使用一个指定的 this 值（foo）和若干个指定的参数值（‘Ace’,12）的前提下调用某个函数或方法

步骤：1 - 改变bar的执行上下文（context）为 foo 

​						foo.bar = bar

​            2 - 传入参数（参数数量不定）

​						foo.bar('Ace',12)			

​			3 - 删除foo 中的 bar 函数

​						delete foo.bar			

核心：改变bar函数的执行上下文（也就是改变 this 指向）为foo，然后传入后续参数 ( ‘Ace’,12 )

关键点：javaScript 中 的 this的指向；参数长度不定；

```javascript
Function.prototype.call2=function(context,...otherArg){
    context.fun = this || window               //foo.fun = bar 为null则指向window
    var result = context.fun(...otherArg) //context.fun( arguments[1] ...)
    delete context.fun
    return result                                 //bar可返回
}
```

## apply

apply和call相似 只是 传入参数不同，apply（context , [ params1 , params2 , ....]）

```javascript
Function.prototype.apply2 = function(context,arr){
    context.fun = this
    let result
    if(arr && arr.length>0){
        result = context.fn(arr)
    }else {
        result = context.fn()
    }
    delete context.fun
    return result
}
```

------

## bind

改变函数作用域，返回改变后的函数，并且可以分批传参

```typescript
第一个参数是，函数要绑定的作用域，后续的参数是 传入的参数
Function.prototype.bind = function(arg){
    let fn = this;
    let [context,...params] = arguments[0];
    let middle = function(){};
    middle.prototype = this.prototype;
    function result(...addConditions){
        fn.apply(context, [...params, ...addConditions])
	}
    result.prototype = new middle()
    return result
}
`new 时，丢失了 prototype 属性，需指向原函数原型，但不能直接指向，因为当修改bind函数原型时，也会修改原函数原型，需要一个middle函数缓冲`
```

@知微 2020/6/1