## compiler

compiler是webpack打包过程中的核心，用于控制webpack的整个生命周期

```typescript
在启用webpack时，使用【用户命令行传入的参数 + 配置文件的options + webpack默认配置】`初始化compiler`;
根据options中的plugin，调用plugin.apply,传入compiler  `在compiler中注册plugins`

```



