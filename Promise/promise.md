# Promise

promise 是优于callback 方法  解决异步回调的方式;

1. promise 是一种链式调用，有pendding，resolved，rejected 状态，初始为pendding
2. 通过resolve，reject 函数更改状态来开启下一步调用，resolved为成功，rejected为失败
3. then 是链式调用的链节点，有成功回调和失败回调，会【返回新的promise】，当回调函数接收的值是thenable ，会将【新的promise】的resolve，reject 控制权交给 thenable
4. thenable 兼容其他的有then的类promise

在promise 中 有 resolve，reject 方法，

## promise

promise是起点，在构造promise时，根据提供的resolve，reject 函数控制链式传递

`then`是promise调用的关键√

```typescript
class Promise{
    status = 'pendding';
    resolveCallback = [];
    rejectCallback = [];
    value;
    reason;
    constructor(fn){
        try{
            fn(this.resolve, this.reject);
        }catch(e){
            reject(e)
        }
    }
    resolve(val){
        this.status = 'resolved'
        this.value = val;
        this.resolveCallback.forEach(fn=>{
            fn(value);
        })
    }
    reject(r){
        this.status = 'rejected'
        this.reason = r;
        this.rejectCallback.forEach(fn=>{
            fn(r);
        })
    }
    then(resolveFn, rejectFn){
       resolveFn = typeOf  resolveFn == 'function' ? resolveFn : (resolveFn)=>resolveFn;
       rejectFn = typeOf  rejectFnrejectFn == 'function' ? rejectFn : (rejectFn)=>rejectFn;
        let that = this;
       let pro2 = new Promise((resolve,reject)=>{
           if(this.status == 'pendding'){
               this.resolveCallback.push((value)=>{
                   setTimeout(()=>{
                       let x = resolveFn(value);
                       this.resolvePromise(pro2, x, resolve, reject)
                   })
               });
               this.rejectCallback.push((value)=>{
                   setTimeout(()=>{
                       let x = rejectFn(value);
                       this.resolvePromise(pro2, x, resolve, reject)
                   })
               });
           }
           if(this.status == 'resolved'){
               try{
                   setTimeout((that)=>{
                       let x = resolveFn(that.value);
                       this.resolvePromise(pro2, x, resolve, reject)
                   })
               }catch(e){
                   reject(e)
               }
           }
           if(this.status == 'rejected'){
               try{
                   setTimeout((that)=>{
                       let x = rejectFn(that.value);
                       this.resolvePromise(pro2, x, resolve, reject)
                   })
               }catch(e){
                   reject(e)
               }
           }
       })   
       return pro2;
    }
    resolvePromise(parentPro, x, resolve, reject){
        if(x == parentPro){
            reject(new TypeError('循环Promise'))
        }
        if(typeOf x == 'object' || typeOf x == 'function'){
            try{
                let then = x.then
                if(then && typeOf then == 'function'){
                    then.call(x,
                              function resolvePro(y){
                                    resolvePromise(parentPro, y, resolve,reject)
                              },
                              function rejectPro(r){
                                    reject(r)
                              }
                             )                      // 循环递归
                }else{
                    resolve(x)
                }
            }catch(e){
                reject(e)
            }
        }else{
            resolve(x)
        }
    }
}
`then`：函数，根据promise的状态进行处理，但内部操作都会将回调放到Mic中，
       因此根据then执行的顺序，确定其内部的调用顺序
`thenable`：如果是thenable，会调用thenable.then函数【又一层then】
`async`：会返回 new promise(...)
`await`：后面可以是promise和原始数据类型【原始数据类型会自动转换成立即resolved的Promise对象】
```

### .resolve

value是promise / 类promise / 其他

```typescript
class Promise{
    static resolve(value){
        if(value instanceof Promise){
            rerturn value
        }
        let pro3 = new Promise((resolve,reject)=>{
            if(typeof value == 'object' && typeof value.then == 'function'){
                try{
                    setTimeout(()=>{
                        value.then(resolve,reject)
                    })
                }catch(e){
                    reject(e)
                }
            }else{
                resolve(value)
            }
        })
        return pro3
    }
}
```

### .reject

```typescript
class Promise{
    static reject(value){
        let pro3 = new Promise((resolve,reject)=>{
            reject(value)
        })
        return pro3
    }
}
```

### .all

```typescript
const p1 = Promise.resolve(3);
const p2 = 1337;
const p3 = new Promise((resolve, reject) => {
  setTimeout(() => {
    ① resolve("foo");
    ② reject("foo");
  }, 1000);
});

Promise.all([p1, p2, p3]).then((values) => {
  console.log(values); // [3, 1337, "foo"]
},(values)=>console.log('拒绝',values)); "foo"

① `当所有的promise都resolved时，走resolve后续,返回Array类型的resolved值`  [3, 1337, "foo"]
② `当有一个promiserejected，走reject后续，只返回一个rejected值`  "foo"
```

### allSettled

```typescript
const promise1 = Promise.resolve(3);
const promise2 = new Promise((resolve, reject) =>
  setTimeout(reject, 100, 'foo'),
);
const promises = [promise1, promise2];

Promise.allSettled(promises).then((results) =>
  console.log(results)
);
[
    { status: "fulfilled", value: 3 },
    { status: "rejected", reason: "foo" }
]

`当所有的Promise都已敲定，返回的promise将被兑现，带有描述每个promise结果的对象数组`
```

### .race

```typescript
const promise1 = new Promise((resolve, reject) => {
  setTimeout(resolve, 500, 'one');
});

const promise2 = new Promise((resolve, reject) => {
  ① setTimeout(resolve, 100, 'two');
  ② setTimeout(reject, 100, 'two');   
});

Promise.race([promise1, promise2]).then((value) => {
  console.log('resolved', value);
},(value)=>{console.log('rejected',value);});


`返回的promise 会随着第一个敲定的promise而敲定,
第一个敲定的promise是兑现，返回的promise 是兑现，
第一个promise是拒绝，返回的promise就是拒绝`
```

### .any

```typescript
const promise1 = Promise.reject(0);
const promise2 = new Promise((resolve,reject) => setTimeout(reject, 100, 'quick'));
const promise3 = new Promise((resolve,reject) => setTimeout(reject, 500, 'slow'));

const promises = [promise1, promise2, promise3];

Promise.any(promises)
    .then((value) => console.log('resolve',value),
          (value)=>console.log('reject',value));
当输入的promises为空，返回的promise将会是拒绝[rejected]
当输入的任何一个promise兑现[resolved]时，返回的promise将会兑现[resolved]。
当输入的promise都拒绝[rejected]时，返回的promise将会拒绝[rejected]，并返回一个`AggregateError`,包含拒绝的原因。    
```

## then

```typescript
`返回新的promise`
then的执行逻辑取决于依赖的promise的决议【resolve，reject】，
但是promise设计的较灵活，而且可以兼容类promise，当resolve函数返回一个新的promise【用户创建】时，then对应的promise的状态也应该交给新promise【用户创建】，
------------------------------------------------------------
当没有新的promise【x是对象，且有对应的then函数 | x就是函数】时，默认返回resolved状态，即使当前then执行的是reject函数
------------------------------------------
有新的promise时，当前then的决议权应该交给新promise【将resolve，reject交给新promise】
```

## catch

```typescript
`catch是一个只有失败回调的then`【当函数为空时，promise会有一个空函数】
class Promise{
    catch(fn){
        return this.then(null,fn)
    }
}
```

## finally

```typescript
class Promise{
    finally(fn){
        return this.then(fn,fn)
    }
}
```

# Promise拒绝事件

[`rejectionhandled`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/rejectionhandled_event):

当 Promise 被拒绝、并且在 `reject` 函数处理该 rejection 之后会派发此事件。

[`unhandledrejection`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/unhandledrejection_event):

当 Promise 被拒绝，但没有提供 `reject` 函数来处理该 rejection 时，会派发此事件。

```
window.addEventListener(
  "unhandledrejection",
  (event) => {
    /* 你可以在这里添加一些代码，以便检查
     event.promise 中的 promise 和
     event.reason 中的 rejection 原因 */

    event.preventDefault();
  },
  false,
);

```

# async

```typescript
`async是Generator 的语法糖`
相较于Generator：
`1.` 内置执行器
`2.` 更好的语义
`3.` 更广的实用性
     yield命令后面只能跟Thunk函数/Promise对象，async函数的await命令后面，可以是Promise和原始类型值【会自动转换成Promise.resolve(值)】
`4.` 返回的是Promise

`可实现多次重复尝试`：
配合try...catch 内部循环

`缺点：`
任何一个await语句后面的Promise对象变为 reject 状态，那么整个async函数都会中断执行

`async函数的执行逻辑`
0. 
1. async函数如果没有返回值，会默认返回一个promise【"fulfilled"状态,result是undefind】。
2. 如果返回一个非promise时，将会返回一个promise【"fulfilled"状态，result是value】。
3. 如果返回一个promise时，将会代替默认返回的promise。
async function a(){
    console.log(123);
    return 666;
}
a() 返回 【"fulfilled"状态,result是666】的promise
async function a(){
    console.log(123);
}
a() 返回【"fulfilled"状态,result是undefind】的promise
async function a(){
    console.log(123);
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{resolve(100)},5000)
    })
}
a() 返回【"pending"状态,result是undefind】的promise，在5秒后promise变为【"fulfilled"状态,result是100】
async function a(){
    console.log(123);
    throw Error(123)
}
a()返回【"rejected"状态,result是Error信息】的promise
```

# await

```typescript
async function a(){
    console.log(12);
    await b();
    console.log('b end');
    await c();
    console.log('c end')
}
async function b(){
    console.log('b')
    return 2;
}
async function c(){
    console.log('c')
    return 2;
}
a();
new Promise((resolve,reject)=>{
    console.log('promise');
    resolve(1)
}).then(res=>{
    console.log('then')
})
console.log(6)

`
12
 b
 promise
 6
 b end
 c
 then
 c end
`
```



```typescript
`用于分割async中代码的执行顺序，使异步像同步一样执行`
await 会在执行完当前行的代码后，把下面的代码整体放入微任务队列中;
```

