### 扫描器：scanner

```typescript
`解析字符串，生成token`：
const scanner = ts.createScanner(...)：创建扫描器
`配置scanner ：`
scanner.setText:配置扫描器的扫描文本。
       setOnError:报错函数。
       setScriptTarget:语言(标准语言|jsx)
`开始扫描`
scanner.scan()
在扫描过程中，不断返回 token，【在扫描过程中，可根据scanner获取token的起始位置。】
```

### 解析器：parser

```
(全局函数 parser.ts).createSourceFile ->
            Parser.parseSourceFile
```

```typescript
`解析器内部会调用扫描器`

`parseSourceFile 准备好解析器的状态，还调用 initializeState 准备好扫描器的状态`
`parseStatements 根据扫描器返回的token切换相应的XXX函数，创建ast节点`
```

### 绑定器：binder

```
program.getTypeChecker ->
    ts.createTypeChecker（检查器中）->
        initializeTypeChecker（检查器中） ->
            for each SourceFile `ts.bindSourceFile`（绑定器中）
            // followed by
            for each SourceFile `ts.mergeSymbolTable`（检查器中）
```

```typescript
`将源码的各个部分连接成一个相关的类型系统，供检查器使用`
`绑定器的主要职责是创建符号(Symbols)`
`绑定器被检查器在内部调用，检查器又被程序调用`

```



### 检查器：checker

### 发射器：emitter

