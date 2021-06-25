#### zone

​	zone是一个执行上下文，专门为异步操作设计，通过重写异步操作[setTimeout，setInterval，setImmediate，promise，ajax。。。]等方法用来拦截追踪异步操作。

```typescript
`1.`zone
`2.`delegate  zone的代理，存储钩子
`3.`task      异步API执行生成一个task
```

​	主要操作是**重写异步操作**，**添加zone函数**，当**触发异步**时，记录**收集zone**，回调异步时在记录的**zone的执行上下文中执行异步操作**。

```typescript
`setTimeout为例`
{
   重写异步操作:'__load_patch'
   收集zone： scheduleMacroTaskWithCurrentZone
}
```

**思维导图：**https://www.processon.com/mindmap/60d29300079129776d2c9a65

**zone在Angular中的作用**：重写异步操作，在触发异步操作时通知Angular执行变更检测。

## 起始

`zone所有操作都由一个Zone<root>开始：new Zone(null, null) `，其他的zone都是根的子节点，

```typescript
初始参数：
parent：null,   // 父
zoneSpec:null   // zone 的配置
```

zone：函数执行上下文

_currentZoneFrame：zone执行上下文栈

zoneDelegate：储存钩子函数，在运行阶段判断是否调用钩子函数，**注意**：用户钩子会拦截程序默认操作

zoneTask：存储

```javascript
class zone  {
	_parent,
    _name,
    _properties,
    _zoneDelegate,
        
    constructor(parent: Zone|null, zoneSpec: ZoneSpec|null) {
          this._parent = parent;
          this._name = zoneSpec ? zoneSpec.name || 'unnamed' : '<root>';
          this._properties = zoneSpec && zoneSpec.properties || {};
          this._zoneDelegate =
              new ZoneDelegate(
              	this, this._parent && this._parent._zoneDelegate, zoneSpec);
        }
	run(fn) 切换zone，让fn在指定的zone中执行，完成后恢复之前的zone
    fork
    wrap
    runGuarded
    runTask
    scheduleTask
    cancelTask
    _updateTaskCount【更新task 数量 触发 onhasTask 钩子】
}
`zone 中的 操作函数 对应的都是 ZoneDelegate中的生命周期钩子函数`:


zone                  ZoneDelegate
----------------------------
fork                  fork[onFork]
wrap                  intercept[onIntercept]
run/runGuarded        invoke[onInvoke]
handleError[处理错误]   handleError[onHandleError]

runTask               invokeTask[onInvokeTask]
scheduleTask          scheduleTask[onScheduleTask]
cancelTask            cancelTask[onCancelTask]
_updateTaskCount      hasTask[onhasTask]


`每次添加 钩子函数需要注意:`
例: 
	每次zone使用操作符时都会调用对应<生命周期函数>,后续操作需要在你<生命周期>钩子函数中操作
比如 onFork 钩子,当没有onFork钩子时,会创建新的zone并返回,但是如果有 onFork 钩子,后续流程会走 onFork函数,如果在 onFork 钩子里没有返回新的zone,就不会生成zone, 所以需要你在 onFork 函数中生成zone并返回.
```

##### _currentZoneFrame

```typescript
zone执行上下文，在zone.run(),时，切换_currentZoneFrame中的zone。执行完成后，再恢复_currentZoneFrame
```



##### zoneSpec

```typescript
zoneSpec是 zone 的配置数据，可配置zone的name，properties及 所有的生命周期钩子函数
【生命周期钩子】：父zone拦截其子zone的某些操作

interface ZoneSpec {
    name: string;                                 // 新生zone的名称
    properties?: { [key: string]: any };          // 当前zone存储的数据对象，可在子zone通过get获取key 获取 value，与注入类似，可被遮挡
  ----------------------------初始化时注册的钩子函数---------------------  
    onFork?: ( ... );         //在 fork 时执行                    
    onIntercept?: ( ... );    //拦截
    onInvoke?: ( ... );       //zone.run()执行时
    onHandleError?: ( ... );  //catch到错误时执行
    onScheduleTask?: ( ... ); //检查到异步操作执行时执行
    onInvokeTask?: ( ... );   //异步操作的回调被执行时执行
    onCancelTask?: ( ... );   //异步取消时调用【clearTimeout】
    onHasTask?: ( ... );      //监听任务队列的 空/非空 状态变换
}
{
    name:'zone1',
    onFork:function(){console.log('onFork',arguments)},
    onIntercept:function(){console.log('onIntercept',arguments)},
    onInvoke:function(){console.log('onInvoke',arguments)},
    onHandleError:function(){console.log('onHandleError',arguments)},
    onScheduleTask:function(){console.log('onScheduleTask',arguments)},
    onInvokeTask:function(){console.log('onInvokeTask',arguments)}},
    onCancelTask:function(){console.log('onCancelTask',arguments)}},
    onHasTask:function(){console.log('onHasTask',arguments)}
}
`注意:`
	当有连续的钩子函数时,需要在钩子函数中承担默认操作(因为添加钩子函数会将默认操作替代掉,因此需要在钩子函数中添加)
```

##### ZoneTask

```typescript
`调用patch后的异步API时，会生成ZoneTask，交给 zone.scheduleTask 处理，
zone在调用代理 _zoneDelegate.scheduleTask,触发 [onScheduleTask] 生命周期

根据任务类型分类[微任务,宏任务,事件]，
生成 ZoneTask 实例 task, 与生命周期`[onScheduleTask,onInvokeTask,onCancelTask,onHasTask]
相关
`task中保存了异步应用的调用栈 【zone】`


@params type   : 'macroTask'
@params source : 'setTimeout'
@params callback: 回调
@params options： 配置
@params scheduleFn：
@params cancelFn：

function ZoneTask(type, source, callback, options, scheduleFn, cancelFn) {
    this._zone = null;           //保存调用栈【zone】
    this.runCount = 0;
    this._zoneDelegates = null;   //zone代理
    this._state = 'notScheduled';
    this.type = type;
    this.source = source;
    this.data = options;
    this.scheduleFn = scheduleFn;   // 
    this.cancelFn = cancelFn;
    this.callback = callback;
    var self = this;
    // TODO: @JiaLiPassion options should have interface
    if (type === eventTask && options && options.useG) {
    	this.invoke = ZoneTask.invokeTask;
    }else {
        this.invoke = function () {
        	return ZoneTask.invokeTask.call(global, self, this, arguments);
    };
    }
}
```



##### ZoneDelegate

```typescript
`当前zone的代理，在new zone时产生对应代理_zoneDelegate，根据传入的配置(代理目标zone，父级代理，代理配置)生成对应的子代理`

根据 zoneSpec 配置的不同的钩子函数保存对应的zoneSpec, parentDelegate, CurrZone





    
    
interface _zoneDelegate  {
    public zone: Zone;  //代理的当前zone
    private _taskCounts:
        {microTask: number,
         macroTask: number,
         eventTask: number} = {'microTask': 0, 'macroTask': 0, 'eventTask': 0};
    
    private _parentDelegate: // 父zone代理

-------------------   
**ZS      : zoneSpec 
**Dlgt    : _parent._zoneDelegate
**CurrZone: 当前zone

    private _forkDlgt: ZoneDelegate|null;
    private _forkZS: ZoneSpec|null;
    private _forkCurrZone: Zone|null;

    private _interceptDlgt: ZoneDelegate|null;
    private _interceptZS: ZoneSpec|null;
    private _interceptCurrZone: Zone|null;

    private _invokeDlgt: ZoneDelegate|null;
    private _invokeZS: ZoneSpec|null;
    private _invokeCurrZone: Zone|null;

    private _handleErrorDlgt: ZoneDelegate|null;
    private _handleErrorZS: ZoneSpec|null;
    private _handleErrorCurrZone: Zone|null;

    private _scheduleTaskDlgt: ZoneDelegate|null;
    private _scheduleTaskZS: ZoneSpec|null;
    private _scheduleTaskCurrZone: Zone|null;

    private _invokeTaskDlgt: ZoneDelegate|null;
    private _invokeTaskZS: ZoneSpec|null;
    private _invokeTaskCurrZone: Zone|null;

    private _cancelTaskDlgt: ZoneDelegate|null;
    private _cancelTaskZS: ZoneSpec|null;
    private _cancelTaskCurrZone: Zone|null;

    private _hasTaskDlgt: ZoneDelegate|null;
    private _hasTaskDlgtOwner: ZoneDelegate|null;
    private _hasTaskZS: ZoneSpec|null;
    private _hasTaskCurrZone: Zone|null;
    
}
```

##### zone.run(fn)

`切换_currentZoneFrame，执行代理的invoke函数`

```typescript
class zone {
    public run<T>(
        callback: (...args: any[]) => T, applyThis?: any, applyArgs?: any[], source?: string): T {
      _currentZoneFrame = {parent: _currentZoneFrame, zone: this};
      try {
        return this._zoneDelegate.invoke(this, callback, applyThis, applyArgs, source);
      } finally {
        _currentZoneFrame = _currentZoneFrame.parent!;
      }
    }
}

通过设置_currentZoneFrame，进入当前zone，然后执行生命周期函数this._zoneDelegate.invoke，没有_invokeZS就直接运行callback。最后回到上级zone。
```

## patch

```typescript
zone 代理的API
```



### ZoneAwarePromise

**重点**:promise 和 zone之间的联系:

resolvePromise,then,finally **-触发->*** 

*scheduleResolveOrReject  **-触发->*** 

*zone.scheduleMicroTask  **-触发->***

*zone._zoneDelegate.scheduleTask* ***-触发->***

*onScheduleTask生命周期*

```typescript
function ZoneAwarePromise(executor) {
            var promise = this;
            if (!(promise instanceof ZoneAwarePromise)) {
                throw new Error('Must be an instanceof Promise.');
            }
            promise[symbolState] = UNRESOLVED;
            promise[symbolValue] = []; // queue;
            try {
                executor && executor(makeResolver(promise, RESOLVED),
                          makeResolver(promise, REJECTED));
            }
            catch (error) {
                resolvePromise(promise, false, error);
            }
        }
promise 状态：UNRESOLVED,
             RESOLVED,
             REJECTED,
             REJECTED_NO_CATCH
promise 值  :[]
```

##### makeResolver

```typescript
根据状态 生成 resolve/reject
function makeResolver(promise, state) {
    return function (v) {
        try {
            resolvePromise(promise, state, v);
        }
        catch (err) {
            resolvePromise(promise, false, err);
        }
        // Do not return value or you will break the Promise spec.
    };
}
```

##### resolvePromise

```typescript
@params promise, 
@params state     状态
@params value     值/错误

用于解析 Promise

```

### setTimeout

`window.setTimeout 的patch`

#### __load_patch重写

```typescript
Zone.__load_patch('timers', function (global) {
    var set = 'set';
    var clear = 'clear';
    patchTimer(global, set, clear, 'Timeout');
    patchTimer(global, set, clear, 'Interval');
    patchTimer(global, set, clear, 'Immediate');
});

function __load_patch(){
    patches[name] = fn(global, Zone, _api);
}

fn内 执行patchTimer
```

#### patchTimer【重写setTimeout】

```typescript
function patchTimer(window,'set','clear','Timeout'){
    function scheduleTask(task){...}
    function clearTask(task){...}
    setNative = patchMethod(window,'setTimeout',function(delegate){...})
    clearNative = patchMethod(window,'clearTimeout',function(delegate){...})
}

`scheduleMacroTaskWithCurrentZone 操作 与zone 关联`
`scheduleTask 属于 patchTimer`
`patchMethod 的第三个参数就是 重写后的setTimeout`

```

##### scheduleTask

```

```

##### clearTask

```

```



##### patchMethod

```typescript
获取原生函数，
执行`patchFn 返回闭包函数`： patchDelegate_1【patchTimer 第三个参数返回的函数】
`重写 setTimeout =  patchDelegate_1`
`返回 delegate：原生setTimeout
```

#### 调用经过patch 的 setTimeout 函数

```typescript
调用 scheduleMacroTaskWithCurrentZone 生成 task
```

##### scheduleMacroTaskWithCurrentZone

```typescript
@params source   "setTimeout"
@params callback "setTimeout的回调函数"
@params data     "记录"{
                    isPeriodic: nameSuffix === 'Interval', 循环异步???
                    delay: (nameSuffix === 'Timeout' || nameSuffix === 'Interval') ? args[1] || 0 :
                        undefined,
                    args: args 'setTimeout的参数'
                }
@params customSchedule  //patchTimer 声明的函数
@params customCancel    //patchTimer 声明的函数

function scheduleMacroTaskWithCurrentZone(
				source, 
                callback,
        		data,
                customSchedule,
                customCancel) {
    return Zone.current.scheduleMacroTask(
        source, callback, data, customSchedule, customCancel);
}
`使用当前 zone 处理宏任务`
```

2. 触发zone.current.scheduleMacroTask

   ```typescript
   Zone.prototype.scheduleMacroTask = function (source, callback, data, customSchedule, customCancel) {
               return this.scheduleTask(new ZoneTask('macroTask', source, callback, data, customSchedule, customCancel));
           };
   `生成 task 再调用 scheduleTask`
   ```

   

3. ZoneTask

   ```typescript
   `task 保存： 异步类型，异步名称，异步回调函数，异步配置`
   `task 中的 invoke函数 是else`
   `初始化 task 的状态 _state 为 'notScheduled'`
   
   function ZoneTask(type, source, callback, options, scheduleFn, cancelFn) {
               this._zone = null;
               this.runCount = 0;
               this._zoneDelegates = null;
               this._state = 'notScheduled';
               this.type = type;
               this.source = source;
               this.data = options;
               this.scheduleFn = scheduleFn;
               this.cancelFn = cancelFn;
               this.callback = callback;
               var self = this;
               // TODO: @JiaLiPassion options should have interface
               if (type === eventTask && options && options.useG) {
                   this.invoke = ZoneTask.invokeTask;
               }
               else {
                   this.invoke = function () {
                       return ZoneTask.invokeTask.call(global, self, this, arguments);
                   };
               }
           }
   
   ```

4. scheduleTask

   ```typescript
   `在 scheduleTask 中 改变 task 的状态 'notScheduled' -> 'scheduling' `
   `调用代理的 scheduleTask函数  _zoneDelegate.scheduleTask` 触发 onScheduleTask 钩子函数
   `对错误进行拦截，触发 onHandleError 钩子`
   `更改 task 的状态 'scheduling' ->  'scheduled'`
   `task 存储 zone`
   Zone.prototype.scheduleTask = function (task) {
               task._transitionTo(scheduling, notScheduled);
               var zoneDelegates = [];
               task._zoneDelegates = zoneDelegates;
               task._zone = this;
               try {
                   task = this._zoneDelegate.scheduleTask(this, task);
               }
               catch (err) {
                   // should set task's state to unknown when scheduleTask throw error
                   // because the err may from reschedule, so the fromState maybe notScheduled
                   task._transitionTo(unknown, scheduling, notScheduled);
                   // TODO: @JiaLiPassion, should we check the result from handleError?
                   this._zoneDelegate.handleError(this, err);
                   throw err;
               }
               if (task._zoneDelegates === zoneDelegates) {
                   // we have to check because internally the delegate can reschedule the task.
                   this._updateTaskCount(task, 1);
               }
               if (task.state == scheduling) {
                   task._transitionTo(scheduled, scheduling);
               }
               return task;
           }
   
   this._zoneDelegate.scheduleTask(this, task)【`此阶段上触发 onScheduleTask`】
   ```

5. _zoneDelegate.scheduleTask 【触发《onScheduleTask》钩子】

   ```typescript
   `在代理阶段，会触发《onScheduleTask》并为《onHasTask》钩子做准备`
   `触发 onScheduleTask 钩子函数`
   `有《onHasTask》钩子就将 ZoneDelegate代理 存储到task里`
   `执行用户的《onScheduleTask》钩子，传入参数`
   
   `没有《onScheduleTask》 就正常执行 `
   ZoneDelegate.prototype.scheduleTask = function (targetZone, task) {
               var returnTask = task;
               if (this._scheduleTaskZS) {
                   if (this._hasTaskZS) {
                       returnTask._zoneDelegates.push(this._hasTaskDlgtOwner);
                   }
                   returnTask = this._scheduleTaskZS.onScheduleTask(this._scheduleTaskDlgt, 
                                           this._scheduleTaskCurrZone, targetZone, task);
                   if (!returnTask)
                       returnTask = task;
               }
               else {
                   if (task.scheduleFn) {
                       task.scheduleFn(task);
                   }
                   else if (task.type == microTask) {
                       scheduleMicroTask(task);
                   }
                   else {
                       throw new Error('Task is missing scheduleFn.');
                   }
               }
               return returnTask;
           };
   `task.scheduleFn 在 ‘setTimeout 中是 scheduleTask函数👇`
   ```

   scheduleTask

   ```typescript
   function scheduleTask(task) {
           var data = task.data;
           function timer() {
               try {
                   task.invoke.apply(this, arguments);
               }
               finally {
                   // issue-934, task will be cancelled
                   // even it is a periodic task such as
                   // setInterval
                   if (!(task.data && task.data.isPeriodic)) {
                       if (typeof data.handleId === 'number') {
                           // in non-nodejs env, we remove timerId
                           // from local cache
                           delete tasksByHandleId[data.handleId];
                       }
                       else if (data.handleId) {
                           // Node returns complex objects as handleIds
                           // we remove task reference from timer object
                           data.handleId[taskSymbol] = null;
                       }
                   }
               }
           }
           data.args[0] = timer;
           data.handleId = setNative.apply(window, data.args);
           return task;
       }
   `调用回调函数，由于回调函数被重写，因此会先调用《钩子函数》`
   `调用 task.invokeTask 内部再调用 task.zone.runTask`
   ```

   zone.runTask【调用《onInvokeTask钩子函数》阶段】，【以及判断是否调用 《onHasTask》钩子】

   ```typescript
   `在 setTimeout 事件中 会在执行 《onInvokeTask》钩子前 删除 task.cancelFn【cancelSetTimeout函数】`
   `调用 《onInvokeTask》钩子`有报错就执行 《onHandleError》钩子
   `最后 判断是否会触发 《onHasTask》钩子`
   Zone.prototype.runTask = function (task, applyThis, applyArgs) {
               if (task.zone != this) {
                   throw new Error('A task can only be run in the zone of creation! (Creation: ' +
                       (task.zone || NO_ZONE).name + '; Execution: ' + this.name + ')');
               }
               if (task.state === notScheduled && (task.type === eventTask || task.type === macroTask)) {
                   return;
               }
               var reEntryGuard = task.state != running;
               reEntryGuard && task._transitionTo(running, scheduled);
               task.runCount++;
               var previousTask = _currentTask;
               _currentTask = task;
               _currentZoneFrame = { parent: _currentZoneFrame, zone: this };
               try {
                   if (task.type == macroTask && task.data && !task.data.isPeriodic) {
                       task.cancelFn = undefined;
                   }
                   try {
                       return this._zoneDelegate.invokeTask(this, task, applyThis, applyArgs);
                   }
                   catch (error) {
                       if (this._zoneDelegate.handleError(this, error)) {
                           throw error;
                       }
                   }
               }
               finally {
                   // if the task's state is notScheduled or unknown, then it has already been cancelled
                   // we should not reset the state to scheduled
                   if (task.state !== notScheduled && task.state !== unknown) {
                       if (task.type == eventTask || (task.data && task.data.isPeriodic)) {
                           reEntryGuard && task._transitionTo(scheduled, running);
                       }
                       else {
                           task.runCount = 0;
                           this._updateTaskCount(task, -1);
                           reEntryGuard &&
                               task._transitionTo(notScheduled, running, notScheduled);
                       }
                   }
                   _currentZoneFrame = _currentZoneFrame.parent;
                   _currentTask = previousTask;
               }
           };
   ```

#### zone + Angular => NgZone

```typescript
`zone 在 Angular 中触发检查机制的原理`：
在 zone 中 onHasTask，onInvoke，onInvokeTask 阶段触发 checkStable函数【checkStable触发事件发送(EventEmitter)，在 ApplicationRef 实例中监听(EventEmitter)，运行tick函数】
```

tick

```typescript
`tick 属于 ApplicationRef`：Angular应用实例
`用于对整个Angular应用执行变更检测`
`在tick函数中,调用view列表执行 detectChanges, 内部执行 Services.checkAndUpdateView`
tick(): void {
    if (this._runningTick) {
      throw new Error('ApplicationRef.tick is called recursively');
    }

    const scope = ApplicationRef._tickScope();
    try {
      this._runningTick = true;
      this._views.forEach((view) => view.detectChanges());
      if (this._enforceNoNewChanges) {
        this._views.forEach((view) => view.checkNoChanges());
      }
    } catch (e) {
      // Attention: Don't rethrow as it could cancel subscriptions to Observables!
      this._zone.runOutsideAngular(() => this._exceptionHandler.handleError(e));
    } finally {
      this._runningTick = false;
      wtfLeave(scope);
    }
  }
```



#### 问题

1. 异步任务之间维持zone

   

   

2. 每次执行完成都会恢复原来的zone【zone.run】

3. 异步任务 记录zone

#### 相关文章

https://juejin.cn/post/6844903929394757639

https://zhuanlan.zhihu.com/p/50835920