# rollup

rollup只有plugin,无loader。

## plugin

```typescript
按照顺序注册在plugins上,在特定的生命周期按照生命周期的hooks类型[async,sync,...]调用plugins注册的插件。
```

## hooks 类型

```typescript
`async`:异步钩子,需要返回一个promise,否则会被标记为sync
`sync`:同步钩子
`first`:此类型的钩子会顺序执行，如果某个返回值不是null/undefined,会终止掉后续插件
`sequential`:此类型的钩子会按照顺序运行,如果某个钩子是异步的，之后的钩子会等当前钩子解析后再执行。
`parallel`:此类型的钩子会按照顺序运行,如果某个钩子是异步的，后续钩子不需等待，可以并行执行。
```

## hooks 工作流程

### build hooks

```typescript
rollup.rollup(inputOptions);
`在处理之前定位，提供和转换输出文件`
```

<img src="C:\Users\崔冰冰\Desktop\notebook\rollup\buil_hooks.webp" alt="buil_hooks" style="zoom: 50%;" />

#### resolveId

`first` `async`

```typescript
@params source     import 语法 的 from 参数
@params importer   import  语法 的 from 的绝对地址(emit file)
@params options

解析 import 语法，根据解析结果，确定后续流程
```

#### load

`first` `async`

```typescript
@params id 需要加载文件的 id[地址]

解析 file url,输出string
```

#### transform

```typescript
@params code
@params id
@return {
    code,ast,map
}
```



### output generation hooks

```typescript
bundle.generate(outputOptions);
`提供有关生成的包的信息，并在完成后修改构建`
```

<img src="C:\Users\崔冰冰\Desktop\notebook\rollup\output_generation_hooks.webp" alt="output_generation_hooks" style="zoom:50%;" />

## 插件上下文功能

##### this.addWatchFile

```
监听模式下，动态添加文件到监听范围
```

##### this.emitFile

```
在构建打包的时候，输出一个新的文件，比如将图片文字，字体，样式等文件输出到文件系统中
```

##### this.error

```
主动抛出异常，终止构建的流程
```

##### this.getModuleInfo

```
返回模块的信息，[入口文件，入口文件的依赖，依赖的依赖]
```

##### this.load

```
加载并解析对应的模块
```

##### this.parse

```
调用rollup内部的方法，将js代码解析成ast
```

##### this.resolve

```
解析模块的导入,可以将导入语句解析成对应文件路径，或者是网页的URL
```

