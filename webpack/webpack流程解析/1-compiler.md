## compiler

compiler是webpack打包过程中的核心，用于控制webpack的整个生命周期，相当于一个webpack 的实例

```typescript
compiler控制编译流程;基于`tapable`的【发布-订阅】管理插件，在编译过程中广播出不同的hook，调用不同的插件;

```

1. 根据 cli 传入的参数 和配置参数，初始化设置
2. 注册plugins

