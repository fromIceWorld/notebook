## webpack.js

```typescript
0. 合并shell 上的配置 和 webpack.config.js配置
1. 验证options 的 有效性
2. 对options 分情况处理【对象：导出单个配置
                      数组：导出多个配置】  // AMD，CommonJS
3. 将应用所需的默认配置属性与options属性合并;【context，output，module,performance,optimization】
4. 根据options 生成compiler实例  

`👇生命周期`
```

![webpack生命周期](C:\Users\崔冰冰\Desktop\sea\webpack\img\webpack生命周期.jpg)

### Tapable[核心通信机制]

```typescript
`一种事件机制，通过提供 多种hooks，可以基于hooks进行通信`
------同步钩子
"SyncHook": 创建同步钩子
"SyncBailHook": 执行中注册的回调返回非undefined时停止
"SyncWaterfallHook": 接受至少一个参数，上一个注册的回调返回值作为下一个注册的回调的参数
"SyncLoopHook": 执行过程中回调返回非undefined时再次执行当前回调;

-----异步钩子
"AsyncParallelHook"：并行执行的钩子，当注册的所有的异步回调都并行执行完成后再执行callAsync/promise中的函数
"AsyncSeriesHook"：串联钩子，


1. 通过 **Hook 创建钩子   const hook = new **Hook(["name"]);
2. 通过tab注册回调        hook.tap('hello',(name)=>{console.log(`hello,${name}`)})
                        hook.tap('hello again',(name)=>{console.log(`hello,${name},again`)})
3. 通过call 触发         hook.call("webpack")
```

### compiler

入口执行实例，主要做全局性功能【监控代码，启动/终止一个compilation等任务】

```typescript
1. 生成一些基础属性，并基于super 生成 一些 hooks【compiler实例】 `👇Tapable`
2. 将options 的plugin对应的生命周期钩子 注册 在compiler 的 hooks上

`是webpack的 实例，初始化编译的上下文，options，初始化plugins....`
```

### Compilation

准备编译模块时创建，包含了模块资源，编译生成的资源以及变化的文件和被跟踪依赖的状态信息等等，以供插件工作时使用

```typescript
compilation是对所有的require(图)中对象的字面上的编译。这个对象可以访问所有的模块和他们的依赖;
`compilation代表了一次单一的版本构建和生成资源，`
一个编译对象表现了当前的模块资源，编译生成资源，变化的文件，以及被跟踪依赖的状态信息。编译对象也提供了很多关键点回调供插件做自定义时选择使用
```

#### compiler和compilation区别

```typescript
`compiler`：不变的webpack的执行环境
`compilation`：随时可变的项目文件，只要文件有改动，compilation就会被重新创建
```

## 模块

一个文件就属于一个模块

```typescript


```

## chunk

```typescript
将模块根据配置信息及依赖关系合并成一个文件chunk
```

## loader

```typescript
`最终目的是将非js类型`的文件转换为js文件;
将`scss，sass`转换为 css 后，转换成js;
将`高版本js，ts`转换为低版本js;


`主要执行转换功能，将文件内的字符串进行转换后，再输出字符串`

module.exports = function (content) {
    return replace(content);
};
【loader执行顺序】：use: ['a-loader', 'b-loader', 'c-loader'],
`
|- a-loader `pitch`
  |- b-loader `pitch`
    |- c-loader `pitch`
      |- requested module is picked up as a dependency
    |- c-loader normal execution
  |- b-loader normal execution
|- a-loader normal execution
`
`pitch`:属于loader的方法，在loader函数执行前执行;
如果pitch有返回值，则阶段后面的loader，直接折返：
例如b的pitch函数，返回数据，则执行顺序是：
`
|- a-loader `pitch`
  |- b-loader `pitch`
|- a-loader normal execution
`
------------------------------------------
`例如`[style-loader,css-loader]的配置；因为css-loader返回的是一个文件【将css到处为js】，style-loader获取到文件后并不能处理，style-loader只需要css值，因此在style-loader中通过css-loader require文件内容，但是正常逻辑style-loader接收到的是css-loader返回的js，无法解析，因此使用pitch，调用css-loader返回文件内容，并终端后面css-loader的执行，直接折返
```

## plugin

插件，注册到webpack的生命周期中，在特定的时机，被唤醒执行

```typescript
class MyPlugin{
    constructor(){}
    apply(compiler){
        // 在plugin 的apply函数中，将回调注册到compiler 的特定周期：done
        compiler.hook.done.tap('**',()=>{
            .....
        })
	}
}
```

## HMR

热模块替换

```typescript
1. 文件监听，变化后重新编译，确定牵连的模块
2. 将需要变动的模块的列表信息发送给浏览器 【manifest】
3. 浏览器根据manifest请求，变动的模块的文件
4. 文件内执行 accept函数，执行数据替换【loader赋予文件的能力】    
                        在文件中插入【module.hot.accept(path,callback) 函数;
                                   callback是执行的更新逻辑】

`module.hot.accept(path,callback)`：并不需要在每个文件中添加此逻辑


`webpack4以前，热更新文件以模块为单位
 webpack5之后，热更新文件以chunk为单位`
```

## tree-shaking

```typescript
`依赖于ES6 Modules，因为ESM是静态的` 【CMD是动态的】

1. webpack 通过静页语法分析将没有export的变量，置为 free variable
2. uglify 同样通过静态语法分析，找出不用的变量声明，将他们删除
```

