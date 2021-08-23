# 模块编译

```typescript
模块在编译后会添加静态属性 `ɵmod` 和`ɵinj`的 get 特性，在获取时，编译对应数据。
`ɵinj`:编译运行后生成对象={
    factory: 编译生成函数【AppModule_Factory(t) {return new (t || jit_AppModule_1)()】
    imports:  引入模块
    providers:依赖项
}
```

## ɵinj

`ɵinj`属性 和 ɵmod 相似 编译后会生成函数factory,

```typescript
ɵinj是 ngInjectorDef，会有自己的构造函数 factory，
```

