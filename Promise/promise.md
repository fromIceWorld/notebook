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
class Promise{
    static all(promises){
        let pro5 = new Promise((resolve, reject)=>{
            let result = new Array(promises.length), index = 0,len = promises.length;
            for(let proIndex in promises){
                Promise.resolve(promises[proIndex]).then((value)=>{
                    if(index < len){
                        result[proIndex] = value;
                        index++;
                    }else{
                        resolve(result)
                    }
                },(reason)=>{
                    reject(reason);
                })
            }
        })
        return pro5
    }
}
```

### .race

```typescript
class Promise{
    static race(promises){
        let pro5 = new Promise((resolve, reject)=>{
            let result = new Array(promises.length), index = 0,len = promises.length;
            for(let proIndex in promises){
                Promise.resolve(promises[proIndex]).then((value)=>{
                        resolve(result)
                },(reason)=>{
                    reject(reason);
                })
            }
        })
        return pro5
    }
}
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

# async

```typescript
`标识一个函数是异步函数，返回一个promise`
```

# await

```typescript
`用于分割async中代码的执行顺序，使异步像同步一样执行`
1.await后面表达式返回的是普通值，
2.await 后面表达式返回promise
```

